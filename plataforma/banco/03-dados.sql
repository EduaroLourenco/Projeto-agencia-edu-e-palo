-- =============================================================
--  ZAP COMMERCE — DADOS INICIAIS
--  Rode por último. Só os planos: é a única coisa que o sistema
--  precisa ter no banco antes do primeiro cadastro existir.
--
--  Pode rodar de novo sem medo — o `on conflict` atualiza em vez
--  de duplicar. É assim que você muda preço: edita aqui e roda.
-- =============================================================

insert into public.planos
  (id, nome, preco_centavos, chamada, inclui, limite_lojas, limite_fotos_mb, destaque, ordem)
values
  ('essencial', 'Essencial', 7900,
   'Pra quem está começando a vender pelo WhatsApp.',
   array['1 loja','Catálogo ilimitado','Pedido no WhatsApp','Estúdio completo'],
   1, 200, false, 1),

  ('profissional', 'Profissional', 14900,
   'Pra quem já vende e quer organizar.',
   array['3 lojas','Tudo do Essencial','Pedidos com status','Métricas do negócio','Atacado e agenda'],
   3, 1000, true, 2),

  ('estudio', 'Estúdio', 34900,
   'Pra agência que monta loja pra cliente.',
   array['Lojas ilimitadas','Tudo do Profissional','Domínio próprio','Marca própria no painel','Suporte prioritário'],
   999, 5000, false, 3)

on conflict (id) do update set
  nome = excluded.nome,
  preco_centavos = excluded.preco_centavos,
  chamada = excluded.chamada,
  inclui = excluded.inclui,
  limite_lojas = excluded.limite_lojas,
  limite_fotos_mb = excluded.limite_fotos_mb,
  destaque = excluded.destaque,
  ordem = excluded.ordem;
