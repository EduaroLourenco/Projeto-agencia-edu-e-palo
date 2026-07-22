# Edu & Paloma — Agência + Zap-Commerce

Duas coisas neste workspace:

1. **`agencia/`** — o site institucional da agência (o produto principal): página única, chamativa, com os módulos de serviço, como funciona, cases e contato via WhatsApp.
2. **`zap-commerce/` + `zap-commerce-api/`** — um sistema full-stack **funcional** (não maquete) de catálogo de atacado com pedido no WhatsApp, usado como case/portfólio dentro do site da agência (seção "Cases").

## Como rodar tudo

Pré-requisito: Node.js 18+ e um banco Postgres (veja "Banco de dados" abaixo — é grátis e leva 2 minutos).

```bash
cd zap-commerce-api && cp .env.example .env   # preencha DATABASE_URL antes de continuar
npm run setup   # instala as três apps, sincroniza o schema e semeia a loja de demonstração
npm run dev     # sobe site da agência (5174), API (3001) e vitrine Zap-Commerce (5173) juntos
```

- **Site da agência:** `http://localhost:5174`
- **Vitrine de demonstração (case):** `http://localhost:5173/bella-atacado`
- **Painel do lojista:** `http://localhost:5173/bella-atacado/admin` (senha: `1234`)

### Banco de dados

O back-end roda como função serverless no Vercel, sem disco persistente — por isso usa Postgres, não SQLite. Use o mesmo banco pra desenvolver local e pra produção:

- **Vercel Postgres:** no dashboard do Vercel → seu projeto → aba **Storage** → **Create Database** → Postgres. Copia a `DATABASE_URL` gerada.
- **ou Supabase:** [supabase.com](https://supabase.com) → New Project → Settings → Database → copia a "Connection string" (modo URI).

Cole a URL em `zap-commerce-api/.env` (arquivo não versionado).

## Arquitetura

```
tst code/
├── agencia/              site institucional da agência (React + Vite + Tailwind v4 + Framer Motion)
├── zap-commerce/          front-end do case (React + TypeScript + Vite + Tailwind v4)
└── zap-commerce-api/      back-end do case (NestJS + Prisma + Postgres), com handler serverless em api/index.ts
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

NestJS com Prisma sobre Postgres. Roda local com `npm run start:dev` (via `src/main.ts`, `app.listen`) e em produção como função serverless no Vercel (via `api/index.ts`, que reaproveita a mesma configuração através de `src/create-app.ts` — nenhuma rota muda entre os dois modos).

- `POST /auth/registrar`, `POST /auth/login` — cria/autentica uma loja, devolve JWT (senha com hash `bcrypt`).
- `GET /lojas/:slug` (pública) / `PATCH /lojas/me` (autenticada) — configuração da loja e pontos de entrega.
- `GET /produtos/loja/:slug` (pública, só ativos) / `GET /produtos/me` + `POST` + `PUT /:id` + `DELETE /:id` (autenticadas) — CRUD de produtos, sempre escopado por loja (multi-tenant).
- `POST /upload` (autenticada) — recebe a foto (até 2MB), converte pra base64 e devolve como `data:` URL, guardada direto na coluna `imageUrl` do produto. Sem disco, sem serviço externo — funciona em função serverless. Pra evoluir pra Cloudinary depois (upload sem limite de tamanho, otimização de imagem), só o `UploadController` muda.

## Deploy no Vercel

Este é um monorepo com 3 pastas — no Vercel cada uma vira **um projeto separado**, apontando para uma subpasta do mesmo repositório GitHub.

### 1. `zap-commerce-api/` (o back-end) — publique primeiro

- Novo projeto no Vercel → import do repositório → **Root Directory: `zap-commerce-api`**
- Variáveis de ambiente (Settings → Environment Variables):
  - `DATABASE_URL` → a connection string do Postgres (ver "Banco de dados" acima)
  - `JWT_SECRET` → gere com `openssl rand -hex 32`
- O build usa o script `vercel-build` (`prisma generate && prisma db push && nest build`) — já sincroniza o schema no banco a cada deploy, não precisa rodar nada manual
- Depois de publicado, copia a URL do projeto (ex: `https://zap-commerce-api.vercel.app`) — os dois front-ends abaixo precisam dela
- **Depois do primeiro deploy**, rode `npm run db:seed` localmente apontando pro mesmo `DATABASE_URL` de produção pra criar a loja de demonstração

### 2. `zap-commerce/` (a vitrine)

- Novo projeto no Vercel → mesmo repositório → **Root Directory: `zap-commerce`**
- Já incluí `zap-commerce/vercel.json` com a regra de rewrite necessária — sem ela, links diretos tipo `/bella-atacado` dariam 404 ao atualizar a página, porque o React Router cuida dessas rotas no navegador, não o servidor
- Variável de ambiente obrigatória: `VITE_API_URL` → a URL do projeto do passo 1

### 3. `agencia/` (site institucional)

- Novo projeto no Vercel → mesmo repositório → **Root Directory: `agencia`**
- Variáveis de ambiente:
  - `VITE_ZAP_COMMERCE_URL` → domínio publicado do Zap-Commerce (passo 2) + `/bella-atacado`
  - `VITE_GA_MEASUREMENT_ID` → opcional, se for usar Google Analytics

## Caminho de evolução

| Camada | Hoje | Próximo passo natural |
|---|---|---|
| Fotos de produto | base64 direto no banco (até 2MB) | Cloudinary — sem limite de tamanho, otimização automática de imagem |
| CORS | `origin: true` (aberto) | restringir para o domínio real: em `src/create-app.ts`, trocar por `origin: 'https://seu-dominio.com'` |
| Migrations | `prisma db push` (sincroniza direto) | `prisma migrate dev` pra ter histórico de migrations versionado |

## O que fica pronto para o próximo passo

- Multi-tenant por slug já funcional (`/loja-da-maria`, `/loja-da-maria/admin`) — qualquer lojista pode criar a própria loja pela home.
- Regra de atacado configurável por quantidade mínima de peças **ou** valor mínimo de pedido.
- Mensagem gerada para o WhatsApp já no formato validado com o cenário de exemplo da especificação (excursão, guia, placa do ônibus, PIX).
