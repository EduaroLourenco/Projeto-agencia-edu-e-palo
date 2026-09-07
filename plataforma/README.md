# Plataforma — lojas em blocos

Sistema que monta lojas B2B, de produto **ou** de serviço, a partir de blocos
que se arrasta e módulos que se liga.

É a implementação da proposta *Zap Commerce em Blocos*. Esta pasta não depende
de nada do resto do repositório: dá pra recortar ela, rodar `git init` e virar
projeto independente.

```bash
cd plataforma
npm install
npm run dev      # http://localhost:5180
```

---

## O que abrir primeiro

| Endereço | O que é |
|---|---|
| `/` | A galeria de demonstrações — é por onde você começa numa reunião |
| `/vale-verde` | Distribuidora de alimentos: atacado com caixa fechada e pedido mínimo |
| `/bella-atacado` | Moda no atacado: o case do Zap-Commerce renascido |
| `/studio-nara` | Salão: serviço com agenda, profissional e produto na mesma sacola |
| `/:slug/estudio` | O editor de blocos |
| `/:slug/painel` | O backstage do lojista |

O que você editar no estúdio fica no seu navegador. O botão de restaurar, na
galeria, devolve a loja ao estado de fábrica — use antes de mostrar pra outra
pessoa.

---

## A ideia em uma tela

**Bloco** é um pedaço visual de uma página. **Módulo** é uma capacidade do
sistema. Ligar um módulo traz, de uma vez, os blocos dele, os passos de
checkout, as regras de preço e as telas de painel.

```
src/
├── nucleo/        o motor. não conhece nenhum módulo.
│   ├── tipos.ts       Oferta, LinhaSacola, Bloco, Modulo, PassoCheckout…
│   ├── registro.ts    onde blocos e módulos se cadastram
│   ├── sacola.ts      localStorage por loja
│   ├── preco.ts       a cadeia de regras
│   ├── resumo.ts      junta sacola + ofertas + módulos
│   ├── checkout.ts    a esteira de passos
│   ├── mensagem.ts    monta o texto do WhatsApp a partir dos passos
│   ├── tema.ts        uma cor vira a escala inteira
│   ├── loja.ts        rascunho, publicado, restaurar
│   └── pedidos.ts     histórico (o que faz "repetir pedido" existir)
│
├── blocos/        13 blocos + as 6 âncoras
├── paginas/       âncoras e espaços livres de cada página
├── modulos/       variantes · b2b · entrega · agendamento · pagamento
├── design/        primitivos (Folha, Stepper, Chip, Campo, Botao)
├── vitrine/       a loja que o comprador usa
├── estudio/       o editor
└── painel/        o backstage
demos/             uma loja inteira por arquivo
```

### As cinco páginas

Cada tipo de página tem a própria tela em branco, com **âncoras** (peças que
sempre existem, na ordem que funciona) e **espaços livres** entre elas.

Na página do item, galeria → nome e preço → escolha → botão de comprar são
âncoras. O lojista sente liberdade total e o caminho até a sacola nunca quebra.

### Produto e serviço

Uma `Oferta` só. A linha da sacola guarda uma `selecao` genérica — `{tamanho:"M"}`
ou `{inicio:"2026-09-10T14:00", profissionalId:"nara"}` — e o núcleo nunca abre
esse objeto. Quem sabe ler é o módulo que escreveu.

Por isso o `studio-nara` vende corte de cabelo e kit de home care na mesma
sacola, com o mesmo checkout, sem nenhuma linha de código específica.

---

## Como criar coisas

**Uma loja nova:** copie um arquivo de `demos/`, troque o conteúdo, registre em
`demos/indice.ts`. Nenhum componente muda.

**Um bloco novo:** crie a definição com `campos`, `paginas` e `Componente`, e
registre em `src/blocos/index.ts`. Ele aparece sozinho no catálogo do estúdio,
com os controles desenhados a partir dos campos que você declarou — o editor
não precisa saber que ele existe.

**Um módulo novo:** um objeto `Modulo` com o que ele traz (`blocos`, `passos`,
`regrasPreco`, `configurador`, `validarSacola`, `telasPainel`) e um registro em
`src/modulos/index.ts`.

---

## O que já está de pé

- Vitrine completa: início, catálogo (com os dois modos de ver), página do item,
  sacola e confirmação
- Sacola que sobrevive a fechar o navegador, isolada por loja
- Preço em cadeia: tabela do cliente → faixa de quantidade → arredondamento,
  com as etapas visíveis pro comprador
- Validação que **impede o pedido errado de sair**: mínimo por item, múltiplo de
  caixa fechada e pedido mínimo da loja
- Checkout em esteira, um passo por vez, com a mensagem do WhatsApp se montando
  a partir do que cada passo respondeu
- Pedido gravado **e** aberto no WhatsApp — é o histórico que faz "repetir
  último pedido" existir
- Agenda com profissional, dia e horário, descontando o que já passou
- Estúdio: arrastar, editar, ocultar, duplicar, apagar, desfazer/refazer, trocar
  tema, ligar e desligar módulos, ver como cliente, publicar
- Tema por loja: uma cor gera a escala com contraste calculado; densidade, canto
  e par de fontes escolhidos numa lista curta

## O que falta

- **API.** Hoje as lojas vêm de `demos/` e o que o estúdio salva fica no
  `localStorage`. `src/nucleo/loja.ts` e `src/nucleo/pedidos.ts` são as duas
  únicas peças que mudam quando o back entrar.
- **Upload de imagem.** O estúdio escolhe entre as imagens já no catálogo.
- **Editar item pelo painel.** Item ainda se edita no arquivo da loja.
- **Estoque de verdade.** O módulo está previsto, não construído.
- **As imagens do catálogo são geradas**, não são fotos. São um sistema visual
  coerente pra demonstração — numa proposta real entram as fotos do cliente.
