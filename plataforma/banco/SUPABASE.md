# Supabase — o que fazer, na ordem

Guia para montar o banco do Zap Commerce do zero. É para ser seguido de cima
para baixo, sem pular. Leva cerca de 30 minutos na primeira vez.

Os arquivos `.sql` desta pasta são a fonte da verdade. Se algo aqui divergir
deles, os arquivos estão certos.

> **Já foi testado.** Os três arquivos rodaram num PostgreSQL 16 de verdade,
> com `auth` e `storage` simulados como no Supabase. Foi conferido que: a conta
> nasce sozinha no cadastro, o pedido recebe número sequencial por loja
> (1, 2, 3), o total do cliente ignora pedido cancelado, publicar move o
> rascunho para o ar, e — o mais importante — um lojista **não** enxerga
> cliente, pedido nem rascunho de outro, nem consegue gravar na loja alheia ou
> se promover a dono. Um erro encontrado nesse teste (recursão na regra de
> equipe, que travava o dono legítimo) já está corrigido nos arquivos.

---

## Antes de começar

Você vai precisar de:

- uma conta em **supabase.com** (o plano gratuito atende até começar a vender);
- o repositório aberto, nesta pasta (`plataforma/banco/`).

Duas palavras que vão aparecer bastante:

- **RLS** (Row Level Security): a regra, dentro do próprio banco, que decide
  quem pode ver cada linha. É o que garante que a Vale Verde nunca enxergue os
  clientes do Studio Nara. Sem ela, um `where` esquecido no código vaza tudo.
- **service_role**: uma chave que ignora todas as regras. Serve para o servidor
  fazer trabalho administrativo. **Nunca** pode ir para o site.

---

## Passo 1 — Criar o projeto

1. Entre em **https://supabase.com/dashboard** e clique em **New project**
2. Preencha:
   - **Name**: `zap-commerce`
   - **Database Password**: gere uma senha forte e **guarde num gerenciador de
     senhas**. O Supabase não mostra ela de novo.
   - **Region**: **South America (São Paulo)** — o banco fica perto de quem vai
     usar, e a diferença é sentida em cada clique.
3. **Create new project** e espere ~2 minutos.

---

## Passo 2 — Criar as tabelas

No menu lateral, **SQL Editor** → **New query**.

Agora rode os três arquivos desta pasta, **nesta ordem**, um de cada vez:

| Ordem | Arquivo | O que faz |
|---|---|---|
| 1º | `01-schema.sql` | Cria as tabelas, os índices e os gatilhos |
| 2º | `02-seguranca.sql` | Liga o RLS e cria o bucket de fotos |
| 3º | `03-dados.sql` | Cadastra os três planos |

Para cada um: abra o arquivo, copie o conteúdo inteiro, cole no editor e clique
em **Run**.

Deve aparecer *Success. No rows returned*. Se aparecer erro em vermelho, pare e
me mande o texto do erro — não siga adiante, porque os arquivos dependem um do
outro.

### Conferindo

Rode isto para ver se ficou tudo de pé:

```sql
select table_name,
       (select count(*) from pg_policies p
         where p.tablename = t.table_name) as regras
  from information_schema.tables t
 where table_schema = 'public' and table_type = 'BASE TABLE'
 order by table_name;
```

Você deve ver **14 tabelas**, e **nenhuma com 0 regras**. Uma tabela com zero
regras e RLS ligado fica invisível para todo mundo; com RLS desligado, fica
visível para todo mundo. Os dois casos são problema.

---

## Passo 3 — Ajustar o Auth

Menu lateral → **Authentication** → **Sign In / Providers**.

1. **Email** ligado.
2. **Confirm email**: aqui você escolhe.
   - **Desligado** — a pessoa se cadastra e entra na hora. Menos atrito para
     vender, mais e-mail falso na base.
   - **Ligado** — ela precisa clicar num link no e-mail.

   **Sugestão:** deixe **desligado** enquanto estiver testando e validando o
   produto. Ligue antes de começar a cobrar de verdade.

3. Em **Authentication → URL Configuration**, preencha:
   - **Site URL**: o endereço da Vercel (ex.: `https://zap-commerce.vercel.app`)
   - **Redirect URLs**: acrescente `http://localhost:5180/**` para conseguir
     testar na sua máquina.

> Não existe tabela de senha nos nossos arquivos, e isso é de propósito. Senha
> fica com o Supabase, que já resolve hash, recuperação e tentativa de invasão.
> Guardar senha por conta própria é o erro mais caro que dá para cometer aqui.

---

## Passo 4 — Pegar as chaves

Menu lateral → **Project Settings** → **API**. Anote:

- **Project URL** — algo como `https://xxxx.supabase.co`
- **anon public** — a chave que vai no site
- **service_role** — a chave secreta

No projeto, crie o arquivo `plataforma/.env.local` com:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=cole-a-chave-anon-aqui
```

E na Vercel: **Settings → Environment Variables**, as mesmas duas, para
*Production* e *Preview*.

> ⚠️ A `anon` pode ficar exposta no navegador — é para isso que ela existe, e é
> o RLS que a segura. A **service_role** não pode aparecer em lugar nenhum do
> site, nem em variável que comece com `VITE_`: tudo que começa com `VITE_` vai
> junto para o navegador de quem abrir a página.

---

## Passo 5 — Backup

Menu lateral → **Database** → **Backups**.

No plano gratuito o Supabase guarda os últimos 7 dias. **Isso não é backup seu,
é backup deles.** Quando entrar o primeiro cliente pagante, suba para o plano
Pro e configure o backup diário para um lugar que você controla.

Para levar uma cópia agora, pelo terminal:

```bash
npx supabase db dump --db-url "postgresql://postgres:SENHA@db.xxxx.supabase.co:5432/postgres" > backup.sql
```

---

## O que cada tabela guarda

| Tabela | Para quê |
|---|---|
| `planos` | Os três planos e o que cada um libera |
| `contas` | Quem contratou. Espelha o usuário do Auth |
| `membros` | Quem pode mexer em qual conta (dono, gerente, operador) |
| `assinaturas` | Histórico de cobrança. É onde o gateway vai escrever |
| `lojas` | A loja: tema, módulos e as páginas montadas no estúdio |
| `dominios` | Domínio próprio, nos planos de cima |
| `categorias` | As seções do catálogo, na ordem que o lojista quer |
| `ofertas` | Produtos e serviços |
| `oferta_categorias` | Liga um ao outro (um produto pode estar em várias) |
| `clientes` | A base do CRM. Nasce sozinha a cada pedido |
| `pedidos` | O pedido, com status e totais |
| `pedido_itens` | As linhas do pedido |
| `fotos` | A ficha de cada arquivo do banco de fotos |
| `convites` | Convidar sócio, funcionário ou passar a loja para o cliente |

### Quatro decisões que valem entender

**Dinheiro é `integer`, em centavos.** Nunca `float`. Em ponto flutuante,
`0,1 + 0,2` não dá `0,3` — dá `0,30000000000000004`. Um centavo de erro por
pedido vira divergência de caixa no fim do mês.

**Layout é JSONB, catálogo é tabela.** As páginas montadas no estúdio mudam
inteiras e são lidas inteiras; ninguém vai perguntar "quantos blocos de texto
existem". Já produto e pedido viram tabela, porque é sobre eles que você vai
somar, filtrar e cobrar.

**O pedido congela nome e preço.** `pedido_itens` guarda o nome e o preço do
momento da compra, não um atalho para o produto. Se amanhã o arroz subir para
R$ 29,90, o pedido de ontem tem que continuar dizendo R$ 24,90 — senão o
histórico mente e o cliente reclama com razão.

**Rascunho e publicado convivem.** A loja tem `paginas_rascunho` e
`paginas_publicadas`. O lojista monta no rascunho e o comprador lê o publicado.
Publicar é copiar um no outro, e isso acontece dentro da função
`publicar_loja()` para não existir meio-termo.

---

## Testando se a segurança funciona

Vale gastar cinco minutos aqui. É o teste que separa "achei que estava seguro"
de "está seguro".

1. Crie duas contas pelo site (ou pelo **Authentication → Add user**).
2. Com a conta A, crie uma loja e um produto.
3. Entre com a conta B e rode, no navegador, uma consulta pedindo todas as lojas.

**O esperado:** a conta B só vê as lojas dela e as lojas publicadas de qualquer
um — nunca o rascunho da conta A, nunca os clientes da conta A.

Pelo SQL Editor dá para simular um usuário:

```sql
-- troque pelo id real, que está em Authentication → Users
select set_config('request.jwt.claims',
  json_build_object('sub','ID-DA-CONTA-B','role','authenticated')::text, true);
set local role authenticated;

select slug, nome from public.lojas;          -- não pode listar rascunho alheio
select * from public.clientes;                -- tem que vir vazio
```

Se algo vier que não devia, **pare e me chame** antes de colocar cliente real
dentro.

---

## O que ainda não está aqui

Deliberadamente fora, para não construir o que ainda não vai ser usado:

- **Cupom e desconto** — a estrutura de preço já aguenta, mas não tem tabela
  ainda. Entra quando aparecer a primeira campanha de verdade.
- **Multi-estoque** — hoje é um número por produto. Depósito e loja física
  separados é outro desenho, e só vale quando alguém pedir.
- **Nota fiscal** — integração com emissor é projeto próprio.
- **Log de auditoria** — quem mudou o quê e quando. Importante quando houver
  funcionário mexendo, não antes.

---

## Se der errado

**"permission denied for table X"** — o RLS está ligado e falta política, ou
você está usando a chave `anon` para algo que exige login. Confira o Passo 2.

**"new row violates row-level security policy"** — você está tentando gravar em
nome de outra conta. Quase sempre é `conta_id` ou `loja_id` errado na escrita.

**Cadastro cria o usuário mas não cria a conta** — o gatilho
`t_auth_novo_usuario` não foi criado. Rode o `01-schema.sql` de novo (ele é
seguro de repetir a partir da seção de gatilhos).

**Tudo vazio, mesmo logado** — provavelmente a linha em `membros` não existe.
Ela é criada pelo mesmo gatilho acima.
