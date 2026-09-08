import type { Loja, Oferta } from "../src/nucleo/tipos";
import { foto, urlFoto } from "./midia";

/**
 * STUDIO NARA — a demo que prova a tese.
 *
 * Mesma plataforma, mesmo checkout, mesmo carrinho. O que muda é um módulo
 * ligado. Se este arquivo funciona sem nenhuma linha nova no núcleo, o
 * desenho da Seção 05 da proposta estava certo.
 *
 * Repare que tem produto junto (a linha de home care): serviço e produto
 * convivem na mesma sacola porque o núcleo nunca soube a diferença.
 */

type Servico = {
  id: string;
  nome: string;
  resumo: string;
  preco: number;
  categoria: string;
  arquivo: string;
  duracao: number;
  profissionais?: string[];
  destaque?: boolean;
};

const SERVICOS: Servico[] = [
  { id: "corte", nome: "Corte + Finalização", resumo: "Corte, lavagem e escova", preco: 90, categoria: "Cabelo", arquivo: "corte", duracao: 60, destaque: true },
  { id: "coloracao", nome: "Coloração Completa", resumo: "Raiz e comprimento", preco: 260, categoria: "Cabelo", arquivo: "coloracao", duracao: 150, profissionais: ["nara", "camila"], destaque: true },
  { id: "hidratacao", nome: "Hidratação Profunda", resumo: "Máscara com ativos, 3 etapas", preco: 120, categoria: "Cabelo", arquivo: "hidratacao", duracao: 60 },
  { id: "escova", nome: "Escova Modelada", resumo: "Lavagem e modelagem", preco: 60, categoria: "Cabelo", arquivo: "escova", duracao: 45 },
  { id: "manicure", nome: "Manicure", resumo: "Cutícula, lixa e esmaltação", preco: 45, categoria: "Unhas", arquivo: "manicure", duracao: 45, profissionais: ["rafa"], destaque: true },
  { id: "pedicure", nome: "Pedicure", resumo: "Cuidado completo dos pés", preco: 55, categoria: "Unhas", arquivo: "pedicure", duracao: 50, profissionais: ["rafa"] },
  { id: "sobrancelha", nome: "Design de Sobrancelha", resumo: "Com henna opcional", preco: 50, categoria: "Estética", arquivo: "design-sobrancelha", duracao: 30, profissionais: ["camila"] },
  { id: "limpeza-pele", nome: "Limpeza de Pele", resumo: "Extração e máscara calmante", preco: 180, categoria: "Estética", arquivo: "limpeza-pele", duracao: 90, profissionais: ["camila"] },
];

const ofertasServico: Oferta[] = SERVICOS.map((s) => ({
  id: s.id,
  tipo: "servico",
  nome: s.nome,
  resumo: `${s.resumo} · ${s.duracao} min`,
  descricao: `${s.nome}. ${s.resumo}. Duração aproximada de ${s.duracao} minutos. Chegue 10 minutos antes.`,
  midia: foto(s.arquivo, s.nome),
  categorias: [s.categoria],
  precoBase: s.preco,
  ativa: true,
  destaque: s.destaque,
  dadosModulo: {
    agendamento: { duracaoMin: s.duracao, profissionaisIds: s.profissionais },
  },
}));

// Produto no meio dos serviços: é o caso da oficina que vende peça e mão de
// obra na mesma nota, e a sacola precisa aguentar os dois desde o dia um.
const ofertasProduto: Oferta[] = [
  {
    id: "kit-home-care",
    tipo: "produto",
    nome: "Kit Home Care",
    resumo: "Shampoo e máscara pra manter em casa",
    descricao: "Shampoo 300ml + máscara 250g da linha que usamos no studio.",
    midia: foto("home-care", "Kit Home Care"),
    categorias: ["Produtos"],
    precoBase: 145,
    ativa: true,
    dadosModulo: {},
  },
];

export const salao: Loja = {
  slug: "studio-nara",
  nome: "Studio Nara",
  descricao: "Cabelo, unhas e estética. Agende pelo celular.",
  whatsapp: "5516920093456",
  aberta: true,

  tema: { corMarca: "#7b4bd8", densidade: "confortavel", canto: "redondo", fontes: "fraunces-inter" },

  modulos: ["agendamento", "pagamento"],

  config: {
    agendamento: {
      profissionais: [
        { id: "nara", nome: "Nara", papel: "Colorista" },
        { id: "camila", nome: "Camila", papel: "Estética" },
        { id: "rafa", nome: "Rafa", papel: "Unhas" },
      ],
      diasAtendidos: [2, 3, 4, 5, 6],
      horaInicio: "09:00",
      horaFim: "19:00",
      intervalo: 30,
      janelaDias: 30,
    },
    pagamento: {
      formas: [
        { id: "pix", nome: "PIX no dia" },
        { id: "cartao", nome: "Cartão no studio", descricao: "Crédito em até 3x sem juros." },
        { id: "dinheiro", nome: "Dinheiro" },
      ],
    },
  },

  paginas: {
    inicio: [
      { id: "b1", tipo: "banner", props: { imagemCelular: urlFoto("hero-salao"), imagemDesktop: urlFoto("hero-salao-largo"), titulo: "Seu horário, sem precisar ligar", texto: "Escolha o serviço, o dia e a profissional. A confirmação chega no WhatsApp.", rotuloBotao: "", linkBotao: "", variante: "sobreposto", altura: "alta" } },
      { id: "b2", tipo: "proximos-horarios", props: { titulo: "Próximos horários" } },
      { id: "b3", tipo: "grade-ofertas", props: { titulo: "Mais agendados", regra: "destaques", categoria: "", limite: 4, colunas: "2" } },
      { id: "b4", tipo: "faixa-categorias", props: { titulo: "O que a gente faz", estilo: "pilulas" } },
      { id: "b5", tipo: "carrossel-ofertas", props: { titulo: "Leve pra casa", regra: "produtos", categoria: "", limite: 6 } },
      { id: "b6", tipo: "prova-social", props: { titulo: "", depoimentos: [
        { texto: "Marquei às onze da noite, sem incomodar ninguém. No dia seguinte estava confirmado.", autor: "Letícia R." },
        { texto: "Adoro escolher com quem vou. A Rafa é sempre a minha.", autor: "Bruna T." },
      ] } },
      { id: "b7", tipo: "contato", props: { titulo: "Prefere falar com a gente?", texto: "Chama que a gente encaixa.", rotuloBotao: "Chamar no WhatsApp" } },
    ],
    catalogo: [],
    oferta: [
      { id: "o1", tipo: "faixa-aviso", props: { texto: "Chegue 10 minutos antes do horário", tom: "claro", __espaco: "baixo" } },
      { id: "o2", tipo: "carrossel-ofertas", props: { titulo: "Costumam marcar junto", regra: "servicos", categoria: "", limite: 6, __espaco: "baixo" } },
    ],
    sacola: [],
    confirmacao: [
      { id: "f1", tipo: "texto", props: { titulo: "Anotado!", corpo: "Confirmamos seu horário no WhatsApp. Se precisar remarcar, é só chamar até 4 horas antes.", alinhamento: "centro", __espaco: "depois" } },
    ],
  },

  ofertas: [...ofertasServico, ...ofertasProduto],
};
