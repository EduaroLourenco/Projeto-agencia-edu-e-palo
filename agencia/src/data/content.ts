export const AGENCIA = {
  nome: "BEPA",
  nomeCompleto: "BEPA Consultoria, Assessoria e Serviços",
  tagline: "Consultoria, Assessoria e Serviços",
  // 55 (país) + 16 (DDD) + 9 dígitos, como o wa.me exige.
  whatsapp: "5516920093456",
  whatsappVisivel: "+55 16 92009-3456",
  mensagemPadrao: "Olá! Vim pelo site da BEPA e quero entender por onde começar.",
};

export const SITRA_URL = "https://sitra.agenciabepa.com.br/";

export function linkWhatsApp(mensagem = AGENCIA.mensagemPadrao) {
  return `https://wa.me/${AGENCIA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export interface Pessoa {
  nome: string;
  papel: string;
  foto: string;
  largura: number;
  altura: number;
  /** Enquadramento do rosto quando a foto é recortada. */
  foco: string;
}

export const TIME = {
  eduardo: {
    nome: "Eduardo",
    papel: "E-commerce & Desenvolvimento",
    foto: "/time/eduardo.webp",
    largura: 500,
    altura: 708,
    foco: "50% 22%",
  },
  paloma: {
    nome: "Paloma",
    papel: "Finanças & Dados",
    foto: "/time/paloma.webp",
    largura: 500,
    altura: 570,
    foco: "50% 30%",
  },
  barbara: {
    nome: "Bárbara",
    papel: "Pessoas & Atendimento",
    foto: "/time/barbara.webp",
    largura: 500,
    altura: 625,
    foco: "50% 30%",
  },
  volpe: {
    nome: "Volpe",
    papel: "Comercial & Atendimento",
    foto: "/time/volpe.webp",
    largura: 500,
    altura: 690,
    foco: "50% 24%",
  },
} satisfies Record<string, Pessoa>;

export interface Frente {
  id: string;
  nome: string;
  area: string;
  /** Três verbos que resumem o que a frente faz acontecer. */
  ritmo: [string, string, string];
  resumo: string;
  entregas: string[];
  pessoa: Pessoa;
  /** Como o visitante descreve o problema, na seção de contato. */
  dor: string;
  mensagem: string;
  acao: string;
  url?: string;
}

export const FRENTES: Frente[] = [
  {
    id: "vendas",
    nome: "Vendas online",
    area: "E-commerce & marketplace",
    ritmo: ["Anunciou.", "Vendeu.", "Entregou."],
    resumo: "Loja própria e marketplaces com anúncio, preço e estoque sob controle.",
    entregas: ["Mercado Livre, Shopee e Amazon", "Anúncios, preço e tráfego pago", "Integração com o ERP"],
    pessoa: TIME.eduardo,
    dor: "Quero vender mais online",
    mensagem: "Olá! Vim pelo site da BEPA e quero vender mais online.",
    acao: "Falar sobre vendas",
  },
  {
    id: "financas",
    nome: "Finanças e dados",
    area: "Gestão financeira",
    ritmo: ["Entrou.", "Saiu.", "Sobrou."],
    resumo: "Caixa e indicadores organizados para saber quanto sobra e por quê.",
    entregas: ["Fluxo de caixa e contas", "Conciliação bancária e de cartões", "Painéis de gestão"],
    pessoa: TIME.paloma,
    dor: "Não sei quanto sobra no fim do mês",
    mensagem: "Olá! Vim pelo site da BEPA e quero entender melhor os números da minha empresa.",
    acao: "Falar sobre finanças",
  },
  {
    id: "atendimento",
    nome: "Pessoas e atendimento",
    area: "Equipe & experiência do cliente",
    ritmo: ["Chamou.", "Respondeu.", "Resolveu."],
    resumo: "Processo e indicadores para a equipe atender melhor, sem repetir trabalho.",
    entregas: ["Fluxo de atendimento", "Indicadores da equipe", "Automação de respostas repetidas"],
    pessoa: TIME.barbara,
    dor: "O atendimento está travando",
    mensagem: "Olá! Vim pelo site da BEPA e quero organizar o atendimento da minha empresa.",
    acao: "Falar sobre atendimento",
  },
  {
    id: "sitra",
    nome: "Sites e sistemas",
    area: "Sitra by BEPA",
    ritmo: ["Publicou.", "Organizou.", "Mediu."],
    resumo: "Landing pages, sites e software, com exemplos para explorar antes de decidir.",
    entregas: ["Landing pages", "Sites institucionais", "Software sob medida"],
    pessoa: TIME.volpe,
    dor: "Preciso de um site ou sistema",
    mensagem: "",
    acao: "Conhecer a Sitra",
    url: SITRA_URL,
  },
];

export interface Produto {
  nome: string;
  descricao: string;
  /** Preencha quando o produto estiver no ar: o cartão vira link sozinho. */
  url?: string;
}

export const PRODUTOS: Produto[] = [
  { nome: "Produto 01", descricao: "Em construção. O acesso aparece aqui quando estiver pronto para uso." },
  { nome: "Produto 02", descricao: "Em construção. O acesso aparece aqui quando estiver pronto para uso." },
];

export const ETAPAS = [
  { titulo: "Primeira conversa", texto: "Você conta o que está travando e como a empresa funciona hoje." },
  { titulo: "Prioridade", texto: "Definimos o que resolver primeiro, com escopo, prazo e valor na proposta." },
  { titulo: "Execução", texto: "Quem cuida da frente acompanha a entrega e os ajustes com você." },
];

export const DUVIDAS = [
  {
    pergunta: "Quanto custa?",
    resposta: "Depende do escopo. Depois da primeira conversa, você recebe uma proposta com valor e prazo.",
  },
  {
    pergunta: "Preciso contratar todas as frentes?",
    resposta: "Não. Cada frente funciona sozinha. Você começa pelo que mais pesa hoje.",
  },
  {
    pergunta: "Qual a diferença entre BEPA e Sitra?",
    resposta:
      "A BEPA cuida de vendas, finanças e atendimento. A Sitra é a nossa frente de sites e sistemas, com portfólio e contato próprios.",
  },
  {
    pergunta: "E depois da entrega?",
    resposta: "O acompanhamento é combinado na proposta, de acordo com o que foi construído.",
  },
];
