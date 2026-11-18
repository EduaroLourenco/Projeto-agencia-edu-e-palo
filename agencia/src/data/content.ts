export const AGENCIA = {
  nome: "BEPA",
  nomeCompleto: "BEPA Consultoria, Assessoria e Serviços",
  // 55 (país) + 16 (DDD) + 9 dígitos, como o wa.me exige.
  whatsapp: "5516920093456",
  whatsappVisivel: "+55 16 92009-3456",
  mensagemPadrao: "Olá! Vim pelo site da BEPA e quero entender como vocês podem ajudar meu negócio.",
};

export const SITRA_URL = "https://sitra.agenciabepa.com.br/";

export function linkWhatsApp(mensagem = AGENCIA.mensagemPadrao) {
  return `https://wa.me/${AGENCIA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export interface Servico {
  id: string;
  titulo: string;
  texto: string;
}

export interface Area {
  id: string;
  nome: string;
  servicos: Servico[];
}

// Nome e título entram na frase ("Quero vender mais com loja virtual"): mantenha essa leitura ao editar.
export const AREAS: Area[] = [
  {
    id: "vendas",
    nome: "Vender mais",
    servicos: [
      { id: "marketplaces", titulo: "Marketplaces", texto: "Mercado Livre, Shopee, Amazon e TikTok Shop." },
      { id: "loja-virtual", titulo: "Loja virtual", texto: "Um canal de venda que é 100% seu." },
      { id: "catalogo-whatsapp", titulo: "Catálogo no WhatsApp", texto: "O pedido chega pronto para você." },
      { id: "trafego", titulo: "Tráfego e redes sociais", texto: "Anúncios e conteúdo feitos para vender." },
    ],
  },
  {
    id: "operacao",
    nome: "Organizar a operação",
    servicos: [
      { id: "sistema", titulo: "Sistema sob medida", texto: "Do jeito que sua empresa funciona." },
      { id: "os", titulo: "Ordens de serviço", texto: "Do chamado ao faturamento, sem caderno." },
      { id: "agendamento", titulo: "Agendamento online", texto: "O cliente marca sozinho." },
      { id: "portal-b2b", titulo: "Portal de pedidos B2B", texto: "Representantes e pedidos em um só lugar." },
    ],
  },
  {
    id: "financas",
    nome: "Controlar as finanças",
    servicos: [
      { id: "fluxo-caixa", titulo: "Fluxo de caixa", texto: "Quanto entra, quanto sai e quanto sobra." },
      { id: "contas", titulo: "Contas a pagar e receber", texto: "Nada vence sem você saber." },
      { id: "conciliacao", titulo: "Conciliação bancária", texto: "Vendas, cartões e extrato batendo." },
      { id: "precificacao", titulo: "Preço e margem", texto: "O preço certo antes de vender." },
    ],
  },
  {
    id: "tempo",
    nome: "Ganhar tempo",
    servicos: [
      { id: "painel", titulo: "Painel de indicadores", texto: "Os números do negócio em uma tela." },
      { id: "integracoes", titulo: "Integração de sistemas", texto: "ERP, vendas e pagamentos conectados." },
      { id: "atendimento", titulo: "Atendimento automático", texto: "Dúvidas repetidas respondidas na hora." },
      { id: "automacao", titulo: "Automação de tarefas", texto: "Menos planilha e trabalho manual." },
    ],
  },
];

export const listaPtBr = new Intl.ListFormat("pt-BR", { style: "long", type: "conjunction" });

export const minuscula = (texto: string) => texto[0].toLowerCase() + texto.slice(1);

export function mensagem(ids: string[], areaAtual: string) {
  const partes = AREAS.flatMap((a) => {
    const itens = a.servicos.filter((s) => ids.includes(s.id)).map((s) => minuscula(s.titulo));
    return itens.length > 0 ? [`${minuscula(a.nome)} com ${listaPtBr.format(itens)}`] : [];
  });
  const atual = AREAS.find((a) => a.id === areaAtual) ?? AREAS[0];
  return `Olá, BEPA. Quero ${partes.length > 0 ? listaPtBr.format(partes) : minuscula(atual.nome)}.`;
}

export const TIME = [
  {
    nome: "Maria Clara Volpe",
    papel: "Comercial & Atendimento",
    bio: "Acompanha a conversa com o cliente, do primeiro contato à entrega do projeto.",
    foto: "/time/volpe.webp",
    largura: 425,
    altura: 618,
  },
  {
    nome: "Eduardo Lourenço",
    papel: "Engenheiro de Software",
    bio: "Marketplaces, integrações de ERP e desenvolvimento, com foco em rentabilidade e escala.",
    foto: "/time/eduardo.webp",
    largura: 425,
    altura: 602,
  },
  {
    nome: "Paloma Amaral",
    papel: "Finanças & Business Intelligence",
    bio: "Fluxo de caixa, conciliação bancária e dashboards que mostram onde está a margem.",
    foto: "/time/paloma.webp",
    largura: 425,
    altura: 485,
  },
  {
    nome: "Bárbara Prata",
    papel: "Gestão de Pessoas & Atendimento",
    bio: "Atendimento, indicadores e desenvolvimento de equipes, com foco em melhoria contínua.",
    foto: "/time/barbara.webp",
    largura: 500,
    altura: 625,
  },
];

/** Quando um produto estiver no ar, adicione aqui: o link aparece sozinho na página. */
export const PRODUTOS: { nome: string; url: string }[] = [];
