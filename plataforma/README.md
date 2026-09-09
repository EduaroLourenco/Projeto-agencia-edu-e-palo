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

### Redesenhar a arte das demos

```bash
node scripts/arte/render.mjs            # tudo
node scripts/arte/render.mjs arroz cafe # só esses, pra iterar
node scripts/arte/render.mjs --folha    # contact sheet em /tmp
```

As 41 imagens de `demos/fotos` são desenhadas, não fotografadas. O desenho
é SVG (`scripts/arte/formas.mjs`), rasterizado no Chromium pra ter gradiente,
sombra e grão de verdade, e reduzido pela metade com reamostragem boa.

A escolha é assumida: sem banco de imagem, fingir foto com desenho chapado é
o que faz catálogo parecer template. Então são poucos moldes — saco, caixa,
garrafa, pote — repetidos com proporção, cor e rótulo diferentes, todos com a
mesma luz e a mesma escala. Lê como coleção.

Cada loja tem duas capas: retrato (900×1200) pro celular e faixa
(1600×640) pro computador, com composições diferentes. Uma arte só nos dois
formatos perde metade da imagem no recorte.

### Mandar a demo pra alguém

```bash
npm run demo     # gera dist/index.html
```

Sai a plataforma inteira num arquivo HTML só — CSS, JavaScript e as fotos em
base64, rota depois do `#`. Abre com dois cliques, sem servidor, sem internet.
É o que se manda por WhatsApp pro cliente antes da reunião, ou se sobe em
qualquer hospedagem estática sem configurar regra de reescrita.

O `dist/corpo.html` que sai junto é o mesmo conteúdo sem `<html>`/`<head>`/
`<body>`, pra publicadores que montam o esqueleto por fora.

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
│   ├── tema.ts        marca e papel viram as escalas inteiras
│   ├── loja.ts        rascunho, publicado, restaurar
│   └── pedidos.ts     histórico (o que faz "repetir pedido" existir)
│
├── blocos/        20 blocos + as 6 âncoras
├── paginas/       âncoras e espaços livres de cada página
├── modulos/       variantes · b2b · entrega · agendamento · pagamento
├── design/        primitivos (Folha, Stepper, Chip, Campo, Botao)
├── vitrine/       a loja que o comprador usa (+ estilo por seção)
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
- Estúdio: arrastar **ou** subir/descer pelas setas, editar, ocultar, duplicar,
  apagar, desfazer/refazer, trocar tema, ligar e desligar módulos, ver como
  cliente, publicar
- **20 blocos**, incluindo selos de confiança, perguntas frequentes, galeria,
  contagem regressiva, endereço com horários e botões de link
- **Estilo por seção**: fundo (papel, marca, escuro ou cor livre), respiro,
  cantos, sombra, contorno, alinhamento e sangria até a borda da tela. A cor do
  texto não é oferecida — ela é derivada do fundo, medida
- Tema por loja em sete eixos: cor da marca, **cor de fundo**, densidade,
  cantos, fontes, **estilo do botão**, **tamanho do texto** e **profundidade**

## As duas regras que sustentam a personalização

**1. O lojista escolhe fundos, nunca cores de texto.** Toda tinta, borda e
superfície nasce da cor do papel por busca binária de contraste. É o que
permite abrir "pinta a seção da cor que quiser" sem abrir junto a porta pra
loja ilegível. Escolher um papel escuro produz modo escuro inteiro — não há
um caminho separado no código pra isso.

Conferido no navegador em cinco combinações, incluindo amarelo sobre fundo
escuro (a mais difícil): texto principal ≥13,8:1, secundário ≥4,5:1, links
≥4,5:1, gráficos ≥3,0:1, texto do botão ≥4,6:1.

**2. Arrastar é o caminho rápido; as setas são o caminho garantido.** No
celular, no balcão, com a mão ocupada, o garantido ganha. As duas coisas
existem lado a lado em cada bloco.

## O que falta

- **API.** Hoje as lojas vêm de `demos/` e o que o estúdio salva fica no
  `localStorage`. `src/nucleo/loja.ts` e `src/nucleo/pedidos.ts` são as duas
  únicas peças que mudam quando o back entrar.
- **Upload de imagem.** O estúdio escolhe entre as imagens já no catálogo.
- **Editar item pelo painel.** Item ainda se edita no arquivo da loja.
- **Estoque de verdade.** O módulo está previsto, não construído.
- **As imagens do catálogo são geradas**, não são fotos. São um sistema visual
  coerente pra demonstração — numa proposta real entram as fotos do cliente.
