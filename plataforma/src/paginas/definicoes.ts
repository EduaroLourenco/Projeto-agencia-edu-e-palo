import type { DefinicaoPagina, TipoPagina } from "../nucleo/tipos";

/**
 * Âncoras e espaços livres.
 *
 * Se a página de oferta fosse uma tela totalmente em branco, um dia alguém
 * apaga o botão de comprar — ou empurra ele pra baixo de três carrosséis.
 * As âncoras são as peças que a página sempre tem, na ordem que funciona.
 * Entre elas ficam os espaços livres, onde o lojista solta o que quiser.
 *
 * O lojista sente liberdade total e o caminho até a sacola nunca quebra.
 */

export const PAGINAS: Record<TipoPagina, DefinicaoPagina> = {
  inicio: {
    tipo: "inicio",
    nome: "Início",
    descricao: "Primeira impressão e atalho pra quem já compra sempre.",
    ancoras: [],
    espacos: [{ id: "corpo", nome: "Página", depoisDaAncora: null }],
  },

  catalogo: {
    tipo: "catalogo",
    nome: "Catálogo",
    descricao: "Achar no meio de centenas de itens.",
    ancoras: ["catalogo-lista"],
    espacos: [
      { id: "antes", nome: "Antes da lista", depoisDaAncora: null },
      { id: "depois", nome: "Depois da lista", depoisDaAncora: "catalogo-lista" },
    ],
  },

  oferta: {
    tipo: "oferta",
    nome: "Página do item",
    descricao: "Decidir e colocar na sacola.",
    // Ordem fixa: galeria, identificação, escolha, comprar.
    ancoras: ["oferta-galeria", "oferta-cabecalho", "oferta-comprar"],
    espacos: [
      { id: "topo", nome: "Acima da foto", depoisDaAncora: null },
      { id: "meio", nome: "Entre a foto e o botão", depoisDaAncora: "oferta-cabecalho" },
      { id: "baixo", nome: "Abaixo do botão", depoisDaAncora: "oferta-comprar" },
    ],
  },

  sacola: {
    tipo: "sacola",
    nome: "Sacola",
    descricao: "Conferir antes de mandar. É aqui que o erro morre.",
    ancoras: ["sacola-itens"],
    espacos: [
      { id: "antes", nome: "Antes dos itens", depoisDaAncora: null },
      { id: "depois", nome: "Depois dos itens", depoisDaAncora: "sacola-itens" },
    ],
  },

  confirmacao: {
    tipo: "confirmacao",
    nome: "Depois do pedido",
    descricao: "O que acontece agora.",
    ancoras: ["confirmacao-recibo"],
    espacos: [{ id: "depois", nome: "Depois do recibo", depoisDaAncora: "confirmacao-recibo" }],
  },
};

export const ORDEM_PAGINAS: TipoPagina[] = ["inicio", "catalogo", "oferta", "sacola", "confirmacao"];
