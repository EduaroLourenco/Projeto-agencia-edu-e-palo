-- =============================================================
--  ZAP COMMERCE — SEGURANÇA (RLS)
--  Rode este arquivo DEPOIS do 01-schema.sql.
--
--  Row Level Security é a peça que transforma "um banco com vários
--  clientes dentro" em "cada cliente com o seu banco". Sem ela,
--  qualquer erro de consulta no aplicativo — um `where` esquecido —
--  entrega o catálogo e a carteira de clientes de um lojista pro
--  outro. Com ela, o banco recusa, mesmo que o código peça.
--
--  A regra vale inclusive pra chave pública que roda no navegador.
--  A chave `service_role` ignora tudo isto: ela NUNCA pode aparecer
--  no site — só em função de servidor.
-- =============================================================

alter table public.planos            enable row level security;
alter table public.contas            enable row level security;
alter table public.assinaturas       enable row level security;
alter table public.lojas             enable row level security;
alter table public.dominios          enable row level security;
alter table public.categorias        enable row level security;
alter table public.ofertas           enable row level security;
alter table public.oferta_categorias enable row level security;
alter table public.clientes          enable row level security;
alter table public.pedidos           enable row level security;
alter table public.pedido_itens      enable row level security;
alter table public.fotos             enable row level security;
alter table public.convites          enable row level security;
alter table public.membros           enable row level security;

-- -------------------------------------------------------------
-- De quais contas o usuário logado faz parte.
--
-- `security definer` é proposital: a função precisa ler `membros`
-- sem passar pela política de `membros`, senão uma checa a outra em
-- círculo e nada funciona. Ela não recebe parâmetro e só enxerga o
-- próprio usuário, então não dá pra usar pra espiar ninguém.
-- -------------------------------------------------------------
create or replace function public.minhas_contas()
returns setof uuid language sql stable security definer set search_path = public as $$
  select conta_id from public.membros where usuario_id = auth.uid()
$$;

create or replace function public.minhas_lojas()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.lojas where conta_id in (select public.minhas_contas())
$$;

-- As contas onde o usuário manda (não só participa).
--
-- Precisa existir separada, e `security definer`, pelo mesmo motivo da
-- anterior: a política de `membros` tem que perguntar "quem manda aqui?"
-- sem consultar `membros` por dentro da política de `membros` — isso é
-- recursão infinita, e o Postgres recusa a consulta inteira. O efeito
-- prático seria o dono não conseguir cadastrar o próprio funcionário.
create or replace function public.contas_que_administro()
returns setof uuid language sql stable security definer set search_path = public as $$
  select conta_id from public.membros
   where usuario_id = auth.uid() and papel in ('dono','gerente')
$$;

-- -------------------------------------------------------------
-- PLANOS — a tabela de preços é pública, é a página de vendas.
-- -------------------------------------------------------------
create policy planos_leitura on public.planos
  for select using (ativo);

-- -------------------------------------------------------------
-- CONTAS e MEMBROS
-- -------------------------------------------------------------
create policy contas_ler on public.contas
  for select using (id in (select public.minhas_contas()));

-- Sem `for insert`: conta nasce pelo gatilho do cadastro, nunca
-- por escrita direta. Assim ninguém cria conta de outro.
create policy contas_editar on public.contas
  for update using (id in (select public.minhas_contas()))
  with check (id in (select public.minhas_contas()));

create policy membros_ler on public.membros
  for select using (conta_id in (select public.minhas_contas()));

create policy membros_gerir on public.membros
  for all using (conta_id in (select public.contas_que_administro()))
  with check (conta_id in (select public.contas_que_administro()));

create policy assinaturas_ler on public.assinaturas
  for select using (conta_id in (select public.minhas_contas()));
-- Escrita de assinatura é só do webhook de pagamento (service_role).

-- -------------------------------------------------------------
-- LOJAS
-- Duas políticas de leitura porque são dois públicos: o visitante
-- anônimo, que vê só o que está publicado, e o dono, que vê tudo.
-- -------------------------------------------------------------
create policy lojas_publicas on public.lojas
  for select using (arquivada_em is null and paginas_publicadas is not null);

create policy lojas_minhas on public.lojas
  for select using (conta_id in (select public.minhas_contas()));

create policy lojas_criar on public.lojas
  for insert with check (conta_id in (select public.minhas_contas()));

create policy lojas_editar on public.lojas
  for update using (conta_id in (select public.minhas_contas()))
  with check (conta_id in (select public.minhas_contas()));

create policy lojas_apagar on public.lojas
  for delete using (conta_id in (select public.minhas_contas()));

create policy dominios_publicos on public.dominios
  for select using (verificado);
create policy dominios_meus on public.dominios
  for all using (loja_id in (select public.minhas_lojas()));

-- -------------------------------------------------------------
-- CATÁLOGO — público lê o que está ativo, dono faz o resto.
-- -------------------------------------------------------------
create policy categorias_publicas on public.categorias
  for select using (
    loja_id in (select id from public.lojas
                 where arquivada_em is null and paginas_publicadas is not null)
  );
create policy categorias_minhas on public.categorias
  for all using (loja_id in (select public.minhas_lojas()))
  with check (loja_id in (select public.minhas_lojas()));

create policy ofertas_publicas on public.ofertas
  for select using (
    ativa and loja_id in (select id from public.lojas
                           where arquivada_em is null and paginas_publicadas is not null)
  );
create policy ofertas_minhas on public.ofertas
  for all using (loja_id in (select public.minhas_lojas()))
  with check (loja_id in (select public.minhas_lojas()));

create policy oferta_cat_publicas on public.oferta_categorias
  for select using (
    oferta_id in (select id from public.ofertas where ativa)
  );
create policy oferta_cat_minhas on public.oferta_categorias
  for all using (
    oferta_id in (select id from public.ofertas
                   where loja_id in (select public.minhas_lojas()))
  );

-- -------------------------------------------------------------
-- CLIENTES — nunca públicos. Nem para leitura.
-- -------------------------------------------------------------
create policy clientes_meus on public.clientes
  for all using (loja_id in (select public.minhas_lojas()))
  with check (loja_id in (select public.minhas_lojas()));

-- -------------------------------------------------------------
-- PEDIDOS
--
-- O comprador não tem conta: ele finaliza no WhatsApp sem se
-- cadastrar. Então o anônimo PODE inserir pedido — mas só em loja
-- aberta e publicada, e não pode ler pedido nenhum, nem o próprio.
-- Ler exige ser dono da loja.
--
-- Se um dia isso virar alvo de robô, a inserção sai daqui e passa a
-- ser uma função de servidor com limite por IP.
-- -------------------------------------------------------------
create policy pedidos_inserir_publico on public.pedidos
  for insert with check (
    loja_id in (select id from public.lojas
                 where aberta and arquivada_em is null
                   and paginas_publicadas is not null)
  );

create policy pedidos_meus on public.pedidos
  for select using (loja_id in (select public.minhas_lojas()));
create policy pedidos_editar on public.pedidos
  for update using (loja_id in (select public.minhas_lojas()))
  with check (loja_id in (select public.minhas_lojas()));
create policy pedidos_apagar on public.pedidos
  for delete using (loja_id in (select public.minhas_lojas()));

create policy itens_inserir_publico on public.pedido_itens
  for insert with check (true);   -- o pedido-pai já foi checado acima
create policy itens_meus on public.pedido_itens
  for select using (
    pedido_id in (select id from public.pedidos
                   where loja_id in (select public.minhas_lojas()))
  );

-- -------------------------------------------------------------
-- FOTOS e CONVITES
-- -------------------------------------------------------------
create policy fotos_minhas on public.fotos
  for all using (conta_id in (select public.minhas_contas()))
  with check (conta_id in (select public.minhas_contas()));

create policy convites_meus on public.convites
  for all using (conta_id in (select public.minhas_contas()));
-- Quem foi convidado lê o próprio convite pelo e-mail dele.
create policy convites_pra_mim on public.convites
  for select using (email = auth.jwt() ->> 'email');

-- =============================================================
--  ARQUIVOS
--  O bucket é público pra LEITURA (foto de produto precisa abrir
--  no navegador de qualquer um) e privado pra escrita: cada conta
--  só grava dentro da pasta com o id dela.
-- =============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

create policy fotos_ler on storage.objects
  for select using (bucket_id = 'fotos');

-- O caminho tem que começar com o id da conta: 'a1b2.../capa.jpg'.
create policy fotos_subir on storage.objects
  for insert with check (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] in (
      select c::text from public.minhas_contas() c
    )
  );

create policy fotos_apagar on storage.objects
  for delete using (
    bucket_id = 'fotos'
    and (storage.foldername(name))[1] in (
      select c::text from public.minhas_contas() c
    )
  );
