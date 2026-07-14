// Copy de exemplo — troque à vontade. Números/nomes são placeholders.

export const AGENCIA = {
  nome: "Edu & Paloma",
  tagline: "Agência Digital",
  whatsapp: "5562999999999",
  mensagemPadrao: "Oi! Vi o site de vocês e quero entender como posso digitalizar meu negócio.",
  email: "contato@eduepaloma.com.br",
};

export function linkWhatsApp(mensagem = AGENCIA.mensagemPadrao) {
  return `https://wa.me/${AGENCIA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export interface Modulo {
  id: string;
  numero: string;
  titulo: string;
  resumo: string;
  itens: string[];
  cor: "violet" | "lime" | "cyan";
}

export const MODULOS: Modulo[] = [
  {
    id: "comercio-whatsapp",
    numero: "01",
    titulo: "Comércio no WhatsApp",
    resumo:
      "Catálogo digital mobile-first com calculadora de preço em tempo real e pedido pronto no WhatsApp — o mesmo motor por trás do Zap-Commerce, um dos nossos cases.",
    itens: [
      "Vitrine mobile-first que carrega instantaneamente",
      "Calculadora de atacado/desconto automática",
      "Checkout com retirada, excursão ou entrega",
      "Painel do lojista com upload de fotos e produtos",
    ],
    cor: "violet",
  },
  {
    id: "sites-sistemas",
    numero: "02",
    titulo: "Sites & Sistemas sob Medida",
    resumo:
      "Do site institucional ao sistema interno: construímos software que resolve o problema real do seu negócio, sem gambiarra e sem molde genérico.",
    itens: [
      "Sites institucionais e landing pages de alta conversão",
      "Sistemas internos, dashboards e painéis administrativos",
      "Integrações com as ferramentas que você já usa",
      "Manutenção e evolução contínua depois do lançamento",
    ],
    cor: "cyan",
  },
  {
    id: "marketing-digital",
    numero: "03",
    titulo: "Marketing Digital",
    resumo:
      "Presença que gera venda: redes sociais, tráfego pago e identidade visual pensados pra quem realmente compra — não só pra curtir.",
    itens: [
      "Gestão de redes sociais com calendário e métricas",
      "Tráfego pago (Meta Ads e Google Ads)",
      "Branding e identidade visual",
      "Conteúdo pensado pra conversão, não só pra alcance",
    ],
    cor: "lime",
  },
  {
    id: "consultoria-automacao",
    numero: "04",
    titulo: "Consultoria & Automação",
    resumo:
      "A gente entra, mapeia onde seu processo trava, e automatiza o que hoje consome seu tempo — planilha, mensagem repetida, controle manual.",
    itens: [
      "Diagnóstico completo do processo atual",
      "Automação de tarefas repetitivas",
      "Integração entre as ferramentas do seu negócio",
      "Treinamento da equipe pra usar o que foi construído",
    ],
    cor: "violet",
  },
];

export interface Etapa {
  numero: string;
  titulo: string;
  descricao: string;
}

export const ETAPAS: Etapa[] = [
  {
    numero: "01",
    titulo: "Diagnóstico",
    descricao: "Entendemos seu negócio, seu cliente e onde a venda está travando hoje.",
  },
  {
    numero: "02",
    titulo: "Proposta",
    descricao: "Você recebe um plano claro: o que vai ser feito, prazo e investimento — sem letra miúda.",
  },
  {
    numero: "03",
    titulo: "Desenvolvimento",
    descricao: "Construção do módulo escolhido, com pontos de checagem com você no caminho.",
  },
  {
    numero: "04",
    titulo: "Lançamento",
    descricao: "Site ou sistema no ar, testado, com você aprovando cada etapa antes de ir pro ar.",
  },
  {
    numero: "05",
    titulo: "Suporte",
    descricao: "Acompanhamento pós-lançamento pra ajustar, melhorar e crescer junto com você.",
  },
];

export interface Diferencial {
  titulo: string;
  descricao: string;
  destaque?: boolean;
}

export const DIFERENCIAIS: Diferencial[] = [
  {
    titulo: "Um time, todos os módulos",
    descricao:
      "Você não precisa contratar uma agência pra cada parte do problema. A gente cuida do sistema, do site, do marketing e da automação — tudo conversando entre si, do mesmo jeito que o Zap-Commerce nasceu.",
    destaque: true,
  },
  {
    titulo: "Processo transparente",
    descricao: "Prazo e investimento combinados antes de começar. Sem letra miúda, sem surpresa na fatura.",
  },
  {
    titulo: "Sem contrato eterno",
    descricao: "Você contrata o módulo que resolve o problema de agora. Quando parar de fazer sentido, para.",
  },
  {
    titulo: "Feito sob medida",
    descricao: "Nada de template genérico — cada sistema nasce do seu processo real, não do que já vem pronto.",
  },
  {
    titulo: "Suporte de verdade",
    descricao: "Depois que vai pro ar, a gente continua por perto pra ajustar o que precisar.",
  },
];

export interface PerguntaFrequente {
  pergunta: string;
  resposta: string;
}

export const FAQ: PerguntaFrequente[] = [
  {
    pergunta: "Quanto custa um projeto?",
    resposta:
      "Depende do módulo e do tamanho do problema. Depois do diagnóstico, você recebe uma proposta fechada — sem surpresa depois.",
  },
  {
    pergunta: "Quanto tempo leva?",
    resposta:
      "Projetos como o Zap-Commerce saem do papel em poucas semanas. A gente sempre define um prazo claro já na proposta.",
  },
  {
    pergunta: "Preciso contratar todos os módulos?",
    resposta:
      "Não. Cada módulo funciona sozinho. Muita gente começa com um e expande depois, conforme o negócio cresce.",
  },
  {
    pergunta: "Vocês atendem só o setor de moda e atacado?",
    resposta:
      "Não — o Zap-Commerce é um case específico, mas construímos sistemas, sites e automações pra qualquer negócio que precise vender melhor online.",
  },
  {
    pergunta: "E depois que o site ou sistema vai pro ar?",
    resposta:
      "A gente continua por perto: ajustes, melhorias e suporte fazem parte do processo, não são um custo escondido à parte.",
  },
];
