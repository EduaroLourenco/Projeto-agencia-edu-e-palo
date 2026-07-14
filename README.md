# Zap-Commerce

Catálogo digital de atacado para lojistas de moda (pensado para a Rua 44, Goiânia) que calcula o preço de atacado em tempo real e fecha o pedido pronto no WhatsApp do lojista. Baseado na especificação técnica original, com um diferencial de posicionamento validado por pesquisa de mercado: nenhum concorrente genérico (FácilZap, Lojazap, Gopage, ZAX) modela o **ônibus de excursão de compras** como método de entrega nativo — esse é o comportamento real de quem vem do interior comprar na 44.

Este é um sistema full-stack **funcional**, não uma maquete: front-end React consumindo uma API NestJS real, com banco de dados, autenticação por senha com hash e upload de imagens de verdade.

## Como rodar

Pré-requisito: Node.js 18+.

```bash
npm run setup   # instala as duas apps, roda a migration e semeia a loja de demonstração
npm run dev     # sobe API (porta 3001) e front-end (porta 5173) juntos
```

Depois abra `http://localhost:5173`:

- **Vitrine de demonstração:** `/bella-atacado`
- **Painel do lojista:** `/bella-atacado/admin` (senha: `1234`)
- **Criar uma loja nova:** pela home, ou acessando `/qualquer-nome/admin` direto

Se preferir rodar cada parte manualmente:

```bash
# terminal 1
cd zap-commerce-api
cp .env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run start:dev

# terminal 2
cd zap-commerce
npm install
npm run dev
```

## Arquitetura

```
tst code/
├── zap-commerce/        front-end (React 19 + TypeScript + Vite + Tailwind v4)
└── zap-commerce-api/    back-end (NestJS + Prisma + SQLite local)
```

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
