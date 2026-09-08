import type { Loja, Oferta } from "../src/nucleo/tipos";

/**
 * DISTRIBUIDORA VALE VERDE — o vertical que a gente resolve primeiro.
 *
 * Recompra alta, catálogo grande, caixa fechada, pedido mínimo. É onde a
 * Lista Rápida e a barra de faixa de preço brilham, e onde o comprador
 * sofre mais com portal ruim.
 */

function foto(arquivo: string, alt: string) {
  return [{ url: `/catalogo/${arquivo}.jpg`, alt, largura: 600, altura: 600 }];
}

type Item = {
  id: string;
  nome: string;
  resumo: string;
  preco: number;
  categoria: string;
  arquivo: string;
  minimo: number;
  multiplo: number;
  unidade: string;
  destaque?: boolean;
};

const ITENS: Item[] = [
  { id: "arroz-5kg", nome: "Arroz Agulhinha Tipo 1 · 5kg", resumo: "Fardo com 6 pacotes", preco: 24.9, categoria: "Mercearia", arquivo: "arroz", minimo: 6, multiplo: 6, unidade: "pct", destaque: true },
  { id: "feijao-1kg", nome: "Feijão Carioca · 1kg", resumo: "Fardo com 10 pacotes", preco: 7.4, categoria: "Mercearia", arquivo: "feijao", minimo: 10, multiplo: 10, unidade: "pct", destaque: true },
  { id: "oleo-900", nome: "Óleo de Soja · 900ml", resumo: "Caixa com 20 unidades", preco: 6.2, categoria: "Mercearia", arquivo: "oleo", minimo: 20, multiplo: 20, unidade: "un" },
  { id: "acucar-1kg", nome: "Açúcar Refinado · 1kg", resumo: "Fardo com 10 pacotes", preco: 4.35, categoria: "Mercearia", arquivo: "acucar", minimo: 10, multiplo: 10, unidade: "pct" },
  { id: "cafe-500", nome: "Café Torrado e Moído · 500g", resumo: "Caixa com 20 pacotes", preco: 16.8, categoria: "Mercearia", arquivo: "cafe", minimo: 10, multiplo: 10, unidade: "pct", destaque: true },
  { id: "farinha-1kg", nome: "Farinha de Trigo · 1kg", resumo: "Fardo com 10 pacotes", preco: 4.9, categoria: "Mercearia", arquivo: "farinha", minimo: 10, multiplo: 10, unidade: "pct" },
  { id: "macarrao-500", nome: "Macarrão Espaguete · 500g", resumo: "Fardo com 20 pacotes", preco: 3.75, categoria: "Mercearia", arquivo: "macarrao", minimo: 20, multiplo: 20, unidade: "pct" },
  { id: "molho-2kg", nome: "Molho de Tomate · 2kg", resumo: "Caixa com 6 latas", preco: 13.5, categoria: "Mercearia", arquivo: "molho", minimo: 6, multiplo: 6, unidade: "lata" },
  { id: "leite-1l", nome: "Leite Integral · 1L", resumo: "Caixa com 12 unidades", preco: 5.15, categoria: "Mercearia", arquivo: "leite", minimo: 12, multiplo: 12, unidade: "un" },
  { id: "biscoito-400", nome: "Biscoito Cream Cracker · 400g", resumo: "Caixa com 20 pacotes", preco: 5.4, categoria: "Mercearia", arquivo: "biscoito", minimo: 20, multiplo: 20, unidade: "pct" },

  { id: "refri-2l", nome: "Refrigerante Cola · 2L", resumo: "Fardo com 6 garrafas", preco: 8.9, categoria: "Bebidas", arquivo: "refrigerante", minimo: 6, multiplo: 6, unidade: "un", destaque: true },
  { id: "agua-500", nome: "Água Mineral · 500ml", resumo: "Fardo com 12 garrafas", preco: 1.65, categoria: "Bebidas", arquivo: "agua", minimo: 12, multiplo: 12, unidade: "un" },
  { id: "suco-1l", nome: "Suco de Uva Integral · 1L", resumo: "Caixa com 12 garrafas", preco: 12.4, categoria: "Bebidas", arquivo: "suco", minimo: 6, multiplo: 6, unidade: "un" },

  { id: "detergente-500", nome: "Detergente Neutro · 500ml", resumo: "Caixa com 24 frascos", preco: 2.35, categoria: "Limpeza", arquivo: "detergente", minimo: 24, multiplo: 24, unidade: "un" },
  { id: "sanitaria-2l", nome: "Água Sanitária · 2L", resumo: "Fardo com 6 frascos", preco: 7.8, categoria: "Limpeza", arquivo: "sanitaria", minimo: 6, multiplo: 6, unidade: "un" },

  { id: "copo-200", nome: "Copo Descartável 200ml", resumo: "Pacote com 100 copos", preco: 6.9, categoria: "Descartáveis", arquivo: "copo-descartavel", minimo: 10, multiplo: 10, unidade: "pct" },
  { id: "guardanapo", nome: "Guardanapo 24x22", resumo: "Fardo com 20 pacotes", preco: 2.1, categoria: "Descartáveis", arquivo: "guardanapo", minimo: 20, multiplo: 20, unidade: "pct" },
];

const ofertas: Oferta[] = ITENS.map((i) => ({
  id: i.id,
  tipo: "produto",
  nome: i.nome,
  resumo: i.resumo,
  descricao: `${i.nome}. ${i.resumo}. Preço por ${i.unidade}, com desconto por volume conforme a faixa do pedido.`,
  midia: foto(i.arquivo, i.nome),
  categorias: [i.categoria],
  precoBase: i.preco,
  ativa: true,
  destaque: i.destaque,
  dadosModulo: {
    b2b: { minimo: i.minimo, multiplo: i.multiplo, unidadeCaixa: i.unidade },
  },
}));

export const distribuidora: Loja = {
  slug: "vale-verde",
  nome: "Vale Verde Distribuidora",
  descricao: "Mercearia, bebidas e limpeza pro seu comércio.",
  whatsapp: "5516920093456",
  aberta: true,

  tema: { corMarca: "#1f7a4d", densidade: "compacta", canto: "suave", fontes: "instrument-inter" },

  modulos: ["b2b", "entrega", "pagamento"],

  config: {
    b2b: {
      pedidoMinimo: 300,
      exigirIdentificacao: true,
      faixas: [
        { min: 60, desconto: 3 },
        { min: 150, desconto: 6 },
        { min: 300, desconto: 9 },
      ],
      tabelas: [
        { id: "padrao", nome: "Tabela padrão", desconto: 0 },
        { id: "rede", nome: "Rede credenciada", desconto: 4 },
        { id: "parceiro", nome: "Parceiro Vale Verde", desconto: 7 },
      ],
    },
    entrega: {
      metodos: [
        { id: "rota", nome: "Rota da distribuidora", descricao: "Entregamos na sua região em até 48h. Sem frete acima do mínimo.", pede: ["endereco", "observacao"] },
        { id: "retirada", nome: "Retirar no depósito", descricao: "Av. das Indústrias, 1240 — seg a sáb, 7h às 17h." },
        { id: "transportadora", nome: "Transportadora", descricao: "Pra fora da nossa rota. Frete combinado no chat.", pede: ["cep", "endereco"] },
      ],
    },
    pagamento: {
      formas: [
        { id: "pix", nome: "PIX à vista", descricao: "2% de desconto no total." },
        { id: "boleto-7", nome: "Boleto 7 dias" },
        { id: "boleto-28", nome: "Boleto 28 dias", descricao: "Pra cliente com cadastro aprovado." },
      ],
    },
  },

  paginas: {
    inicio: [
      { id: "b0", tipo: "banner", props: { imagemCelular: "/catalogo/hero-distribuidora.jpg", imagemDesktop: "/catalogo/hero-distribuidora.jpg", titulo: "Seu estoque, sem sair do balcão", texto: "Mercearia, bebidas e limpeza. Entrega na sua região em 48h.", rotuloBotao: "", linkBotao: "", variante: "sobreposto", altura: "alta" } },
      { id: "b1", tipo: "faixa-aviso", props: { texto: "Pedido mínimo R$ 300 · entrega em 48h na rota", tom: "marca" } },
      { id: "b2", tipo: "repetir-pedido", props: { titulo: "Repetir último pedido" } },
      { id: "b3", tipo: "barra-faixa-preco", props: { titulo: "Sua faixa de preço" } },
      { id: "b4", tipo: "faixa-categorias", props: { titulo: "", estilo: "pilulas" } },
      { id: "b5", tipo: "lista-rapida", props: { titulo: "Mais pedidos", regra: "destaques", categoria: "", limite: 6 } },
      { id: "b6", tipo: "carrossel-ofertas", props: { titulo: "Bebidas", regra: "categoria", categoria: "Bebidas", limite: 8 } },
      { id: "b7", tipo: "contato", props: { titulo: "Precisa de algo que não está aqui?", texto: "Chama o representante que a gente cota pra você.", rotuloBotao: "Falar com o representante" } },
    ],
    catalogo: [
      { id: "c1", tipo: "barra-faixa-preco", props: { titulo: "Sua faixa de preço", __espaco: "antes" } },
    ],
    oferta: [
      { id: "o1", tipo: "carrossel-ofertas", props: { titulo: "Costumam levar junto", regra: "destaques", categoria: "", limite: 8, __espaco: "baixo" } },
    ],
    sacola: [
      { id: "s1", tipo: "barra-faixa-preco", props: { titulo: "Sua faixa de preço", __espaco: "antes" } },
      { id: "s2", tipo: "lista-rapida", props: { titulo: "Esqueceu algo?", regra: "todas", categoria: "", limite: 5, esconderNaSacola: true, __espaco: "depois" } },
    ],
    confirmacao: [
      { id: "f1", tipo: "texto", props: { titulo: "O que acontece agora", corpo: "1. Conferimos estoque e confirmamos o pedido no WhatsApp.\n2. Enviamos o boleto ou a chave PIX.\n3. A entrega entra na próxima rota da sua região.", alinhamento: "esquerda", __espaco: "depois" } },
    ],
  },

  ofertas,
};
