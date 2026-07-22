# Edu & Paloma — Agência + Zap-Commerce

Duas coisas neste workspace:

1. **`agencia/`** — o site institucional da agência (o produto principal): página única, chamativa, com os módulos de serviço, como funciona, cases e contato via WhatsApp.
2. **`zap-commerce/` + `zap-commerce-api/`** — um sistema full-stack **funcional** (não maquete) de catálogo de atacado com pedido no WhatsApp, usado como case/portfólio dentro do site da agência (seção "Cases").

## Como rodar tudo

Pré-requisito: Node.js 18+.

```bash
npm run setup   # instala as três apps, roda a migration e semeia a loja de demonstração
npm run dev     # sobe site da agência (5174), API (3001) e vitrine Zap-Commerce (5173) juntos
```

- **Site da agência:** `http://localhost:5174`
- **Vitrine de demonstração (case):** `http://localhost:5173/bella-atacado`
- **Painel do lojista:** `http://localhost:5173/bella-atacado/admin` (senha: `1234`)

## Arquitetura

```
tst code/
├── agencia/              site institucional da agência (React + Vite + Tailwind v4 + Framer Motion)
├── zap-commerce/          front-end do case (React + TypeScript + Vite + Tailwind v4)
└── zap-commerce-api/      back-end do case (NestJS + Prisma + SQLite local)
```

## `agencia/` — site institucional

Página única, tema escuro com gradiente violeta/ciano, animações de entrada ao rolar a página (Framer Motion). Toda a copy é editável em **`agencia/src/data/content.ts`** — nome da agência, número de WhatsApp, módulos de serviço, etapas do processo — sem precisar mexer nos componentes.

- **Hero** — proposta de valor + mockup estilizado do produto + CTA de WhatsApp.
- **Módulos** (`#modulos`) — os 4 serviços como cards independentes: Comércio no WhatsApp, Sites & Sistemas sob Medida, Marketing Digital, Consultoria & Automação.
- **Como funciona** (`#como-funciona`) — as 5 etapas do processo, do diagnóstico ao suporte.
- **Case** (`#case`) — o Zap-Commerce como prova de trabalho, com link para a vitrine rodando de verdade.
- **Quem somos** (`#quem-somos`) — texto genérico da dupla (troque por bio real quando quiser).
- **CTA final + rodapé** — WhatsApp e email.

Para trocar o nome, número de WhatsApp e textos: edite `agencia/src/data/content.ts`. Para trocar as cores: os tokens estão em `agencia/src/index.css` (`--color-violet-*`, `--color-lime-*`, `--color-cyan-400`).

## `zap-commerce/` + `zap-commerce-api/` — o case

### Front-end — `zap-commerce/`

SPA mobile-first, sem framework de estado externo (Context API + hooks já resolvem o escopo).

- **Vitrine** (`src/pages/Storefront.tsx`): grid de produtos com lazy loading, embed "Shop the Look" para Reels/TikTok, calculadora de atacado em tempo real com barra de progresso, sacola persistida em `localStorage` (sobrevive a fechar o navegador ou perder sinal na estrada), checkout com 3 métodos de entrega (mãos, excursão, Correios com autocomplete de CEP via ViaCEP) e geração da mensagem final formatada para `wa.me`.
- **Painel do lojista** (`src/pages/admin/`): login por senha (JWT real contra a API), CRUD de produtos com upload de foto, configuração de regra de atacado e pontos de entrega.
- **Camada de API** (`src/lib/api.ts`): único ponto de contato com o backend; troca de URL via `VITE_API_URL`.

### Back-end — `zap-commerce-api/`

NestJS com Prisma sobre SQLite local (zero contas externas para rodar). Os *models* já são o desenho final — trocar para Postgres em produção é só mudar o `provider` do datasource.

- `POST /auth/registrar`, `POST /auth/login` — cria/autentica uma loja, devolve JWT (senha com hash `bcrypt`).
- `GET /lojas/:slug` (pública) / `PATCH /lojas/me` (autenticada) — configuração da loja e pontos de entrega.
- `GET /produtos/loja/:slug` (pública, só ativos) / `GET /produtos/me` + `POST` + `PUT /:id` + `DELETE /:id` (autenticadas) — CRUD de produtos, sempre escopado por loja (multi-tenant).
- `POST /upload` (autenticada) — recebe a foto e devolve a URL. Hoje salva em disco local (`uploads/`) e serve como estático; é o ponto exato onde entra o fluxo de assinatura direta da Cloudinary da especificação original.

## Deploy no Vercel

Este é um monorepo com 3 pastas — no Vercel cada front-end vira **um projeto separado**, apontando para uma subpasta do mesmo repositório GitHub. O back-end **não** entra no Vercel (veja o motivo logo abaixo).

### 1. `agencia/` (site institucional)

- Novo projeto no Vercel → import do repositório → **Root Directory: `agencia`**
- Vercel detecta Vite automaticamente (build `npm run build`, saída `dist/`)
- Variáveis de ambiente do projeto (Settings → Environment Variables):
  - `VITE_ZAP_COMMERCE_URL` → domínio publicado do Zap-Commerce (ex: `https://zap-commerce.vercel.app/bella-atacado`)
  - `VITE_GA_MEASUREMENT_ID` → opcional, se for usar Google Analytics

### 2. `zap-commerce/` (a vitrine)

- Novo projeto no Vercel → mesmo repositório → **Root Directory: `zap-commerce`**
- Já incluí `zap-commerce/vercel.json` com a regra de rewrite necessária — sem ela, links diretos tipo `/bella-atacado` dariam 404 ao atualizar a página, porque o React Router cuida dessas rotas no navegador, não o servidor
- Variável de ambiente obrigatória: `VITE_API_URL` → URL do back-end publicado (ver item 3)

### 3. `zap-commerce-api/` (o back-end) — não vai pro Vercel

Vercel roda funções serverless sem estado: cada execução pode acontecer numa instância diferente, então o SQLite (`dev.db`, um arquivo local) não persiste entre requisições — os dados somem. Duas opções:

- **Mais simples:** publicar em [Render](https://render.com) ou [Fly.io](https://fly.io) como um serviço "web" normal (roda continuamente, SQLite funciona igual roda aqui). Zero mudança de código — é só apontar o comando de start pro `dist/main.js` depois do `npm run build`.
- **Se quiser tudo no Vercel:** precisa trocar o SQLite por um Postgres hospedado (Supabase ou Neon, ambos com camada gratuita) e adaptar o `main.ts` para exportar um handler serverless. Me avisa se preferir esse caminho que eu preparo a migração.

## Caminho para produção (stack de custo zero da especificação)

Nada aqui exige reescrever telas — só trocar a infraestrutura por baixo:

| Camada | Hoje (local) | Produção | Como trocar |
|---|---|---|---|
| Front-end | Vite dev server | Vercel ou Netlify | `npm run build` em `zap-commerce/`, apontar o deploy para a pasta `dist/` |
| Back-end | `nest start` local | Render ou Fly.io | `npm run build` em `zap-commerce-api/`, rodar `dist/main.js` |
| Banco de dados | SQLite (`dev.db`) | Supabase (Postgres) | trocar `provider = "sqlite"` por `"postgresql"` em `prisma/schema.prisma` e apontar `DATABASE_URL` |
| Fotos | disco local (`uploads/`) | Cloudinary | trocar `UploadController` pelo fluxo de assinatura (o front pede a assinatura à API, o celular do lojista envia a foto direto pra Cloudinary — o backend nunca processa o arquivo) |
| Segredo do JWT | valor fixo de dev | variável de ambiente forte | gerar com `openssl rand -hex 32` e setar `JWT_SECRET` no ambiente de produção |
| CORS | `origin: true` (aberto) | restrito | em `main.ts`, trocar por `origin: 'https://seu-dominio.com'` |

## O que fica pronto para o próximo passo

- Multi-tenant por slug já funcional (`/loja-da-maria`, `/loja-da-maria/admin`) — qualquer lojista pode criar a própria loja pela home.
- Regra de atacado configurável por quantidade mínima de peças **ou** valor mínimo de pedido.
- Mensagem gerada para o WhatsApp já no formato validado com o cenário de exemplo da especificação (excursão, guia, placa do ônibus, PIX).
