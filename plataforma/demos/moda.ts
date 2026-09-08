import type { Loja, Oferta } from "../src/nucleo/tipos";

/**
 * BELLA ATACADO — o case do Zap-Commerce renascido na plataforma.
 *
 * Serve pra checar uma coisa importante: tudo que a loja da cliente fazia
 * no v1 (grade, variação de tamanho, preço de atacado por quantidade,
 * pedido no WhatsApp) tem que sair aqui só com configuração, sem código.
 */

function foto(arquivo: string, alt: string) {
  return [{ url: `/catalogo/${arquivo}.jpg`, alt, largura: 600, altura: 600 }];
}

const TAMANHOS = ["P", "M", "G", "GG"];

type Peca = {
  id: string;
  nome: string;
  resumo: string;
  preco: number;
  categoria: string;
  arquivo: string;
  cores: string[];
  destaque?: boolean;
  esgotadas?: string[];
};

const PECAS: Peca[] = [
  { id: "blusa-linho", nome: "Blusa de Linho Premium", resumo: "Linho misto, caimento solto", preco: 49.9, categoria: "Blusas", arquivo: "blusa-linho", cores: ["Off-white", "Terracota"], destaque: true },
  { id: "blusa-tricot", nome: "Blusa Tricot Decote V", resumo: "Tricot leve, meia estação", preco: 54.9, categoria: "Blusas", arquivo: "blusa-tricot", cores: ["Rosé", "Preto"], esgotadas: ["GG|Rosé"] },
  { id: "cropped", nome: "Cropped Canelado", resumo: "Canelado com elastano", preco: 34.9, categoria: "Blusas", arquivo: "cropped", cores: ["Lilás", "Branco", "Preto"], destaque: true },
  { id: "calca-wide", nome: "Calça Wide Leg Jeans", resumo: "Jeans com lavagem média", preco: 89.9, categoria: "Calças", arquivo: "calca-wide", cores: ["Azul médio", "Azul escuro"], destaque: true },
  { id: "calca-alfaiataria", nome: "Calça de Alfaiataria", resumo: "Cintura alta, prega frontal", preco: 94.9, categoria: "Calças", arquivo: "calca-alfaiataria", cores: ["Preto", "Bege"] },
  { id: "vestido-midi", nome: "Vestido Midi Fluido", resumo: "Viscose, manga curta", preco: 109.9, categoria: "Vestidos", arquivo: "vestido-midi", cores: ["Vinho", "Verde oliva"], destaque: true },
  { id: "vestido-longo", nome: "Vestido Longo Fenda", resumo: "Malha canelada", preco: 129.9, categoria: "Vestidos", arquivo: "vestido-longo", cores: ["Preto", "Marsala"] },
  { id: "saia-envelope", nome: "Saia Envelope Sarja", resumo: "Sarja com elastano", preco: 69.9, categoria: "Saias", arquivo: "saia-envelope", cores: ["Caramelo", "Preto"] },
  { id: "saia-plissada", nome: "Saia Plissada Midi", resumo: "Plissado permanente", preco: 79.9, categoria: "Saias", arquivo: "saia-plissada", cores: ["Roxo", "Off-white"] },
];

const ofertas: Oferta[] = PECAS.map((p) => ({
  id: p.id,
  tipo: "produto",
  nome: p.nome,
  resumo: p.resumo,
  descricao: `${p.nome}. ${p.resumo}. Grade ${TAMANHOS.join("/")}. Preço de atacado a partir de 6 peças no pedido.`,
  midia: foto(p.arquivo, p.nome),
  categorias: [p.categoria],
  precoBase: p.preco,
  ativa: true,
  destaque: p.destaque,
  dadosModulo: {
    variantes: {
      eixos: [
        { nome: "Tamanho", valores: TAMANHOS },
        { nome: "Cor", valores: p.cores },
      ],
      esgotadas: p.esgotadas ?? [],
    },
  },
}));

export const moda: Loja = {
  slug: "bella-atacado",
  nome: "Bella Atacado",
  descricao: "Moda feminina no atacado. A partir de 6 peças.",
  whatsapp: "5516920093456",
  aberta: true,

  tema: { corMarca: "#e0356f", densidade: "confortavel", canto: "redondo", fontes: "sora-inter" },

  modulos: ["variantes", "b2b", "entrega"],

  config: {
    b2b: {
      pedidoMinimo: 0,
      exigirIdentificacao: false,
      faixas: [
        { min: 6, desconto: 12 },
        { min: 20, desconto: 18 },
        { min: 50, desconto: 24 },
      ],
    },
    entrega: {
      metodos: [
        { id: "maos", nome: "Retirada em mãos", descricao: "Combinamos ponto e horário no chat." },
        { id: "excursao", nome: "Entrega na excursão", descricao: "Diga o guia e a placa do ônibus.", pede: ["observacao"] },
        { id: "correios", nome: "Correios ou transportadora", descricao: "Frete a combinar.", pede: ["cep", "endereco"] },
      ],
    },
  },

  paginas: {
    inicio: [
      { id: "b1", tipo: "banner", props: { imagemCelular: "/catalogo/hero-moda.jpg", imagemDesktop: "/catalogo/hero-moda.jpg", titulo: "Coleção que chegou", texto: "Peças novas toda semana, direto do showroom.", rotuloBotao: "", linkBotao: "", variante: "sobreposto", altura: "alta" } },
      { id: "b2", tipo: "faixa-aviso", props: { texto: "Atacado a partir de 6 peças · até 24% off", tom: "marca" } },
      { id: "b3", tipo: "faixa-categorias", props: { titulo: "Categorias", estilo: "cartoes" } },
      { id: "b4", tipo: "grade-ofertas", props: { titulo: "Queridinhas", regra: "destaques", categoria: "", limite: 4, colunas: "2" } },
      { id: "b5", tipo: "barra-faixa-preco", props: { titulo: "Seu desconto" } },
      { id: "b6", tipo: "prova-social", props: { titulo: "Quem já revende", depoimentos: [
        { texto: "Peço na quinta e recebo na terça. Nunca veio peça trocada.", autor: "Juliana M.", papel: "Loja Encanto · Rio Verde" },
        { texto: "O catálogo no WhatsApp facilitou demais. Minhas clientes escolhem direto.", autor: "Patrícia S.", papel: "Revendedora · Anápolis" },
      ] } },
      { id: "b7", tipo: "contato", props: { titulo: "Quer ver peça antes de fechar?", texto: "Mandamos vídeo da peça na hora.", rotuloBotao: "Chamar no WhatsApp" } },
    ],
    catalogo: [
      { id: "c1", tipo: "barra-faixa-preco", props: { titulo: "Seu desconto", __espaco: "antes" } },
    ],
    oferta: [
      { id: "o1", tipo: "faixa-aviso", props: { texto: "6 peças no pedido = 12% off em tudo", tom: "claro", __espaco: "meio" } },
      { id: "o2", tipo: "grade-ofertas", props: { titulo: "Combina com", regra: "destaques", categoria: "", limite: 4, colunas: "2", __espaco: "baixo" } },
    ],
    sacola: [
      { id: "s1", tipo: "barra-faixa-preco", props: { titulo: "Seu desconto", __espaco: "antes" } },
    ],
    confirmacao: [
      { id: "f1", tipo: "texto", props: { titulo: "", corpo: "Confirmamos as peças e o total no WhatsApp. Depois é só fazer o PIX que a gente separa e envia.", alinhamento: "centro", __espaco: "depois" } },
    ],
  },

  ofertas,
};
