-- =============================================================
--  ZAP COMMERCE — ESQUEMA
--  Rode este arquivo PRIMEIRO, no SQL Editor do Supabase.
--
--  Três decisões que explicam o resto:
--
--  1. Multi-inquilino por CONTA. Toda linha de todo lugar carrega
--     `conta_id`. É o que garante que o cliente A nunca enxergue o
--     cliente B — a regra é verificável numa coluna só, e não
--     espalhada por dez JOINs.
--
--  2. Layout é documento, catálogo é tabela. As páginas montadas no
--     estúdio são JSONB: elas mudam inteiras, são lidas inteiras e
--     ninguém nunca vai perguntar "quantos blocos de texto existem".
--     Já produto, pedido e cliente viram tabela de verdade, porque é
--     sobre eles que você vai querer somar, filtrar e cobrar.
--
--  3. Rascunho e publicado são a MESMA tabela, colunas diferentes.
--     O lojista monta em `paginas_rascunho` e o comprador lê
--     `paginas_publicadas`. Publicar é copiar uma na outra. Sem isso,
--     mexer na loja mudaria a vitrine no ar em tempo real.
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- PLANOS
-- Tabela e não enum: preço muda, nome muda, limite muda. Enum
-- obrigaria migração de banco pra trocar R$ 149 por R$ 159.
-- -------------------------------------------------------------
create table public.planos (
  id            text primary key,              -- 'essencial' | 'profissional' | 'estudio'
  nome          text not null,
  preco_centavos integer not null,             -- centavos, nunca float: 0.1+0.2 != 0.3
  chamada       text not null default '',
  inclui        text[] not null default '{}',
  limite_lojas  integer not null default 1,
  limite_fotos_mb integer not null default 50,
  destaque      boolean not null default false,
  ativo         boolean not null default true,
  ordem         integer not null default 0
);

-- -------------------------------------------------------------
-- CONTAS
-- Quem contrata. Espelha auth.users (o Supabase cuida de senha,
-- e-mail e recuperação) e guarda só o que é nosso.
-- A senha NUNCA vem pra cá.
-- -------------------------------------------------------------
create table public.contas (
  id          uuid primary key references auth.users(id) on delete cascade,
  nome        text not null,
  email       text not null,
  telefone    text,
  negocio     text,
  documento   text,                            -- CPF/CNPJ, pra nota e cobrança
  plano_id    text not null references public.planos(id) default 'essencial',
  -- 'teste' | 'ativa' | 'inadimplente' | 'cancelada'
  situacao    text not null default 'teste',
  teste_ate   timestamptz default (now() + interval '14 days'),
  criada_em   timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);
create index on public.contas (plano_id);
create index on public.contas (situacao);

-- -------------------------------------------------------------
-- ASSINATURAS
-- Histórico de cobrança. Separado da conta porque a conta tem UM
-- estado e a cobrança tem MUITOS eventos — e quando o gateway
-- entrar, é aqui que o webhook dele escreve.
-- -------------------------------------------------------------
create table public.assinaturas (
  id                uuid primary key default gen_random_uuid(),
  conta_id          uuid not null references public.contas(id) on delete cascade,
  plano_id          text not null references public.planos(id),
  -- 'teste' | 'ativa' | 'atrasada' | 'cancelada'
  situacao          text not null default 'teste',
  gateway           text,                      -- 'stripe' | 'asaas' | 'mercadopago'
  gateway_id        text,                      -- id da assinatura lá
  valor_centavos    integer not null,
  inicio            timestamptz not null default now(),
  proxima_cobranca  timestamptz,
  cancelada_em      timestamptz,
  criada_em         timestamptz not null default now()
);
create index on public.assinaturas (conta_id);
create unique index on public.assinaturas (gateway, gateway_id)
  where gateway_id is not null;

-- -------------------------------------------------------------
-- LOJAS
-- O slug é único no sistema inteiro porque ele É o link público.
-- -------------------------------------------------------------
create table public.lojas (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid not null references public.contas(id) on delete cascade,
  slug        text not null unique,
  nome        text not null,
  descricao   text not null default '',
  whatsapp    text not null,
  aberta      boolean not null default true,
  logo_url    text,

  -- Cor, papel, fonte, cantos: o objeto `Tema` inteiro.
  tema        jsonb not null default '{}'::jsonb,
  -- Quais recursos estão ligados: ['b2b','entrega','pagamento']
  modulos     text[] not null default '{}',
  -- Configuração de cada módulo: {"b2b":{"pedidoMinimo":300}, ...}
  config      jsonb not null default '{}'::jsonb,

  -- O que o comprador vê. Vazio = loja nunca publicada.
  paginas_publicadas jsonb,
  -- O que o lojista está montando. Nulo = sem alterações pendentes.
  paginas_rascunho   jsonb,
  publicada_em       timestamptz,

  -- 'produtos' | 'servicos' | 'atacado' | 'zero'
  modelo      text,
  -- 'essencial' | 'elegante' | 'corporativo' | 'clinica' | 'marketplace' | 'noturno'
  estilo      text,

  arquivada_em timestamptz,
  criada_em   timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);
create index on public.lojas (conta_id);
-- O índice que sustenta a vitrine: achar a loja pelo link, rápido,
-- ignorando as arquivadas.
create index on public.lojas (slug) where arquivada_em is null;

-- -------------------------------------------------------------
-- DOMÍNIOS
-- Um link de graça (slug), e domínio próprio nos planos de cima.
-- Tabela separada porque uma loja pode ter vários (o antigo que
-- redireciona, o novo que é o principal).
-- -------------------------------------------------------------
create table public.dominios (
  id          uuid primary key default gen_random_uuid(),
  loja_id     uuid not null references public.lojas(id) on delete cascade,
  dominio     text not null unique,            -- 'loja.valeverde.com.br'
  principal   boolean not null default false,
  verificado  boolean not null default false,
  verificado_em timestamptz,
  criado_em   timestamptz not null default now()
);
create index on public.dominios (loja_id);

-- -------------------------------------------------------------
-- CATEGORIAS
-- Tabela e não texto solto: assim a categoria tem ordem (o lojista
-- decide o que vem primeiro na vitrine) e renomear não exige achar
-- e trocar em todo produto.
-- -------------------------------------------------------------
create table public.categorias (
  id        uuid primary key default gen_random_uuid(),
  loja_id   uuid not null references public.lojas(id) on delete cascade,
  nome      text not null,
  slug      text not null,
  ordem     integer not null default 0,
  criada_em timestamptz not null default now(),
  unique (loja_id, slug)
);
create index on public.categorias (loja_id, ordem);

-- -------------------------------------------------------------
-- OFERTAS (produtos e serviços)
-- -------------------------------------------------------------
create table public.ofertas (
  id          uuid primary key default gen_random_uuid(),
  loja_id     uuid not null references public.lojas(id) on delete cascade,
  -- Código do lojista (SKU). Dele, não nosso — pode repetir entre lojas.
  codigo      text,
  tipo        text not null default 'produto' check (tipo in ('produto','servico')),
  nome        text not null,
  resumo      text not null default '',
  descricao   text not null default '',
  slug        text not null,

  preco_base_centavos integer not null default 0,
  -- Preço "de", riscado. Nulo = sem promoção.
  preco_de_centavos   integer,

  ativa       boolean not null default true,
  destaque    boolean not null default false,
  ordem       integer not null default 0,

  -- Estoque opcional: nulo = não controla, e a loja nunca bloqueia venda.
  estoque     integer,
  -- Abaixo disto, avisa no painel.
  estoque_minimo integer,

  -- [{url, alt, largura, altura}]
  midia       jsonb not null default '[]'::jsonb,
  -- O pedaço de cada módulo: {"b2b":{"minimo":12}, "agendamento":{"duracaoMin":60}}
  dados_modulo jsonb not null default '{}'::jsonb,

  criada_em   timestamptz not null default now(),
  atualizada_em timestamptz not null default now(),
  unique (loja_id, slug)
);
create index on public.ofertas (loja_id) where ativa;
create index on public.ofertas (loja_id, ordem);
create unique index on public.ofertas (loja_id, codigo) where codigo is not null;

create table public.oferta_categorias (
  oferta_id    uuid not null references public.ofertas(id) on delete cascade,
  categoria_id uuid not null references public.categorias(id) on delete cascade,
  primary key (oferta_id, categoria_id)
);
create index on public.oferta_categorias (categoria_id);

-- -------------------------------------------------------------
-- CLIENTES (a base do CRM)
-- O telefone é a identidade: é por ele que o pedido chega no
-- WhatsApp, e é o único dado que todo comprador dá.
-- -------------------------------------------------------------
create table public.clientes (
  id          uuid primary key default gen_random_uuid(),
  loja_id     uuid not null references public.lojas(id) on delete cascade,
  nome        text,
  telefone    text not null,
  email       text,
  documento   text,
  -- Endereço como documento: formato muda por país e ninguém
  -- consulta "todos os clientes do CEP X".
  endereco    jsonb,
  observacoes text,
  -- 'vip', 'atacado', 'inadimplente' — o lojista cria as dele.
  etiquetas   text[] not null default '{}',

  -- Mantidos pelo gatilho lá embaixo, pra não recalcular a cada
  -- abertura de tela. É o que faz a lista de clientes carregar
  -- rápido com dez mil pedidos.
  total_pedidos integer not null default 0,
  total_gasto_centavos bigint not null default 0,
  primeiro_pedido_em timestamptz,
  ultimo_pedido_em   timestamptz,

  criado_em   timestamptz not null default now(),
  unique (loja_id, telefone)
);
create index on public.clientes (loja_id);
create index on public.clientes (loja_id, ultimo_pedido_em desc nulls last);

-- -------------------------------------------------------------
-- PEDIDOS
-- -------------------------------------------------------------
create table public.pedidos (
  id          uuid primary key default gen_random_uuid(),
  loja_id     uuid not null references public.lojas(id) on delete cascade,
  cliente_id  uuid references public.clientes(id) on delete set null,

  -- Número curto por loja (#1, #2, #3), preenchido pelo gatilho.
  -- Ninguém lê um UUID no telefone com o cliente esperando.
  numero      integer not null,

  status      text not null default 'novo'
              check (status in ('novo','confirmado','separando','entregue','cancelado')),

  subtotal_centavos  integer not null default 0,
  desconto_centavos  integer not null default 0,
  frete_centavos     integer not null default 0,
  total_centavos     integer not null default 0,

  -- Cópia do nome e telefone no momento da compra. Redundante de
  -- propósito: se o cliente trocar de número amanhã, o pedido de
  -- ontem tem que continuar contando a verdade de ontem.
  cliente_nome     text,
  cliente_telefone text,

  -- O que cada passo do checkout respondeu (entrega, pagamento…).
  passos      jsonb not null default '{}'::jsonb,
  -- A mensagem exata que foi pro WhatsApp.
  mensagem    text not null default '',
  origem      text not null default 'vitrine',

  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (loja_id, numero)
);
create index on public.pedidos (loja_id, criado_em desc);
create index on public.pedidos (loja_id, status);
create index on public.pedidos (cliente_id);

create table public.pedido_itens (
  id          uuid primary key default gen_random_uuid(),
  pedido_id   uuid not null references public.pedidos(id) on delete cascade,
  -- Pode virar nulo: produto apagado não apaga o histórico de venda.
  oferta_id   uuid references public.ofertas(id) on delete set null,

  -- Congelados na hora da compra, pelo mesmo motivo do nome do cliente.
  nome            text not null,
  preco_centavos  integer not null,
  quantidade      integer not null check (quantidade > 0),
  subtotal_centavos integer not null,

  -- {"tamanho":"M"} ou {"inicio":"2026-09-10T14:00","profissionalId":"p1"}
  selecao         jsonb not null default '{}'::jsonb,
  resumo_selecao  text not null default ''
);
create index on public.pedido_itens (pedido_id);
create index on public.pedido_itens (oferta_id);

-- -------------------------------------------------------------
-- FOTOS
-- O arquivo vive no Storage; aqui fica só a ficha dele. Guardar
-- imagem em base64 numa coluna incha o banco e deixa toda consulta
-- lenta — foi o limite que a versão de navegador bateu.
-- -------------------------------------------------------------
create table public.fotos (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid not null references public.contas(id) on delete cascade,
  loja_id     uuid references public.lojas(id) on delete set null,
  caminho     text not null unique,            -- caminho no bucket 'fotos'
  nome        text not null default '',
  bytes       integer not null default 0,
  largura     integer,
  altura      integer,
  criada_em   timestamptz not null default now()
);
create index on public.fotos (conta_id, criada_em desc);

-- -------------------------------------------------------------
-- CONVITES
-- Pra agência montar a loja e depois passar pro cliente final,
-- e pro lojista dar acesso ao funcionário.
-- -------------------------------------------------------------
create table public.convites (
  id          uuid primary key default gen_random_uuid(),
  conta_id    uuid not null references public.contas(id) on delete cascade,
  loja_id     uuid references public.lojas(id) on delete cascade,
  email       text not null,
  papel       text not null default 'operador' check (papel in ('dono','gerente','operador')),
  token       text not null unique default encode(gen_random_bytes(24), 'hex'),
  expira_em   timestamptz not null default (now() + interval '7 days'),
  aceito_em   timestamptz,
  criado_em   timestamptz not null default now()
);
create index on public.convites (email) where aceito_em is null;

create table public.membros (
  conta_id  uuid not null references public.contas(id) on delete cascade,
  usuario_id uuid not null references auth.users(id) on delete cascade,
  papel     text not null default 'operador' check (papel in ('dono','gerente','operador')),
  criado_em timestamptz not null default now(),
  primary key (conta_id, usuario_id)
);
create index on public.membros (usuario_id);

-- =============================================================
--  GATILHOS
-- =============================================================

-- `atualizada_em` mantido pelo banco. Deixar isso pro aplicativo
-- significa que uma escrita esquecida mente sobre a data pra sempre.
create or replace function public.tocar_atualizada_em()
returns trigger language plpgsql as $$
begin
  if to_jsonb(new) ? 'atualizada_em' then new.atualizada_em := now(); end if;
  if to_jsonb(new) ? 'atualizado_em' then new.atualizado_em := now(); end if;
  return new;
end $$;

create trigger t_contas_touch before update on public.contas
  for each row execute function public.tocar_atualizada_em();
create trigger t_lojas_touch before update on public.lojas
  for each row execute function public.tocar_atualizada_em();
create trigger t_ofertas_touch before update on public.ofertas
  for each row execute function public.tocar_atualizada_em();
create trigger t_pedidos_touch before update on public.pedidos
  for each row execute function public.tocar_atualizada_em();

-- Número sequencial por loja.
-- O `for update` trava a loja por um instante: sem ele, dois pedidos
-- no mesmo segundo pegariam o mesmo número.
create or replace function public.numerar_pedido()
returns trigger language plpgsql as $$
declare proximo integer;
begin
  if new.numero is not null and new.numero > 0 then return new; end if;
  perform 1 from public.lojas where id = new.loja_id for update;
  select coalesce(max(numero), 0) + 1 into proximo
    from public.pedidos where loja_id = new.loja_id;
  new.numero := proximo;
  return new;
end $$;

create trigger t_pedidos_numero before insert on public.pedidos
  for each row execute function public.numerar_pedido();

-- Totais do cliente, atualizados quando o pedido muda de estado.
-- Cancelado não conta: senão o "melhor cliente" vira quem mais desiste.
create or replace function public.recontar_cliente()
returns trigger language plpgsql as $$
declare alvo uuid := coalesce(new.cliente_id, old.cliente_id);
begin
  if alvo is null then return coalesce(new, old); end if;
  update public.clientes c set
    total_pedidos = sub.qtd,
    total_gasto_centavos = sub.soma,
    primeiro_pedido_em = sub.primeiro,
    ultimo_pedido_em = sub.ultimo
  from (
    select count(*) qtd, coalesce(sum(total_centavos),0) soma,
           min(criado_em) primeiro, max(criado_em) ultimo
    from public.pedidos
    where cliente_id = alvo and status <> 'cancelado'
  ) sub
  where c.id = alvo;
  return coalesce(new, old);
end $$;

create trigger t_pedidos_recontar
  after insert or update of status, total_centavos, cliente_id or delete
  on public.pedidos
  for each row execute function public.recontar_cliente();

-- Conta criada no Supabase Auth vira conta nossa automaticamente.
-- Sem isto, o cadastro precisaria de duas escritas e qualquer falha
-- no meio deixaria um usuário sem conta, logado e sem lugar nenhum.
create or replace function public.ao_criar_usuario()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.contas (id, nome, email, telefone, negocio, plano_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'telefone',
    new.raw_user_meta_data->>'negocio',
    coalesce(new.raw_user_meta_data->>'plano', 'essencial')
  );
  insert into public.membros (conta_id, usuario_id, papel)
  values (new.id, new.id, 'dono');
  return new;
end $$;

create trigger t_auth_novo_usuario
  after insert on auth.users
  for each row execute function public.ao_criar_usuario();

-- =============================================================
--  PUBLICAR
--  Uma função só, pra publicar ser atômico. Se o aplicativo fizesse
--  em dois passos, uma queda no meio deixaria a loja publicada pela
--  metade.
-- =============================================================
create or replace function public.publicar_loja(p_loja_id uuid)
returns public.lojas language plpgsql security invoker as $$
declare resultado public.lojas;
begin
  update public.lojas
     set paginas_publicadas = coalesce(paginas_rascunho, paginas_publicadas),
         paginas_rascunho = null,
         publicada_em = now()
   where id = p_loja_id
  returning * into resultado;

  if resultado.id is null then
    raise exception 'Loja não encontrada ou sem permissão';
  end if;
  return resultado;
end $$;

-- =============================================================
--  A VITRINE PÚBLICA
--  Uma view com só o que o comprador pode ver. O aplicativo lê
--  daqui, e assim nenhum descuido de consulta vaza rascunho,
--  telefone de cliente ou loja de outra conta.
-- =============================================================
create view public.vitrine
with (security_invoker = true) as
select l.id, l.slug, l.nome, l.descricao, l.whatsapp, l.aberta,
       l.logo_url, l.tema, l.modulos, l.config,
       l.paginas_publicadas as paginas, l.publicada_em
  from public.lojas l
 where l.arquivada_em is null
   and l.paginas_publicadas is not null;
