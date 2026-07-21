// Copy de exemplo — troque à vontade. Números/nomes são placeholders.

export const AGENCIA = {
  nome: "Edu & Paloma",
  tagline: "Agência Digital · Goiânia",
  cidade: "Goiânia",
  whatsapp: "5562999999999",
  mensagemPadrao: "Oi! Vi o site de vocês e quero entender como posso digitalizar meu negócio.",
  email: "contato@eduepaloma.com.br",
  instagram: "https://instagram.com/eduepaloma.dev",
  linkedin: "https://linkedin.com/company/eduepaloma",
};

// Em produção, defina VITE_ZAP_COMMERCE_URL no .env apontando para o domínio publicado do case.
export const ZAP_COMMERCE_URL =
  import.meta.env.VITE_ZAP_COMMERCE_URL || "http://localhost:5173/bella-atacado";

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
  {
    id: "vida-noturna",
    numero: "05",
    titulo: "Vida Noturna & Eventos",
    resumo:
      "Digitaliza a portaria e as reservas de baladas e eventos em Goiânia. Lista VIP com QR Code, mapa de lounges interativo e painel de check-in no celular do segurança.",
    itens: [
      "Lista VIP com QR Code gerado na hora",
      "Mapa visual de lounges e mesas (livre/ocupado)",
      "Check-in pelo celular do segurança (câmera + validação)",
      "Exportação da lista para planilha ou WhatsApp",
    ],
    cor: "cyan",
  },
  {
    id: "agendamento",
    numero: "06",
    titulo: "Agendamento Sem WhatsApp",
    resumo:
      "Para salões, clínicas de estética e oficinas: o cliente agenda online enquanto você atende. Sem parar para responder mensagem, sem horário duplo.",
    itens: [
      "Vitrine de serviços com preço e duração",
      "Calendário com horários disponíveis em tempo real",
      "Integração gratuita com Google Agenda",
      "Confirmação automática via WhatsApp para o cliente",
    ],
    cor: "lime",
  },
  {
    id: "alimentacao",
    numero: "07",
    titulo: "Alimentação Sem Taxa de Delivery",
    resumo:
      "Cardápio digital com carrinho e cálculo de frete por CEP — ideal para distribuidoras de bebidas e lanchonetes que querem fugir das altas taxas do iFood.",
    itens: [
      "Cardápio por categorias com fotos e preços",
      "Carrinho em tempo real com total atualizado",
      "Cálculo de entrega por CEP e bairro de Goiânia",
      "Painel de pedidos estilo Kanban (Recebido → Entregue)",
    ],
    cor: "violet",
  },
  {
    id: "logistica-44",
    numero: "08",
    titulo: "Logística da Região da 44",
    resumo:
      "Conecta lojistas da 44 com revendedores do interior de Goiás. Rastreamento de fardos por excursão ou transportadora, notificação automática para o comprador.",
    itens: [
      "Registro digital de despacho (bilhete eletrônico)",
      "Rastreamento por número de celular",
      "Painel de manifestos de carga para guias de excursão",
      "Notificação automática via WhatsApp a cada status",
    ],
    cor: "cyan",
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

export interface Nicho {
  emoji: string;
  nome: string;
  descricao: string;
}

export const NICHOS: Nicho[] = [
  { emoji: "👗", nome: "Moda & Atacado", descricao: "Lojas da Rua 44 e atacadistas" },
  { emoji: "🍺", nome: "Distribuidoras", descricao: "Bebidas, alimentos e mercearias" },
  { emoji: "✂️", nome: "Salões & Estética", descricao: "Agendamento sem WhatsApp" },
  { emoji: "🎉", nome: "Baladas & Eventos", descricao: "Lista VIP e reserva de lounge" },
  { emoji: "🔧", nome: "Oficinas & Auto", descricao: "Agendamento e orçamento digital" },
  { emoji: "🚌", nome: "Logística Interior", descricao: "Excursões e frete da 44" },
  { emoji: "🍔", nome: "Lanchonetes", descricao: "Cardápio e delivery sem taxa" },
  { emoji: "🏥", nome: "Clínicas & Saúde", descricao: "Agenda e prontuário simples" },
];

export interface Depoimento {
  nome: string;
  negocio: string;
  texto: string;
  iniciais: string;
  cor: "violet" | "lime" | "cyan";
}

// ⚠️ Placeholder: depoimentos fictícios pra ilustrar o layout. Troque por
// depoimentos reais de clientes (com autorização deles) antes de publicar.
export const DEPOIMENTOS: Depoimento[] = [
  {
    nome: "Renata Souza",
    negocio: "Bella Modas — Atacado, Goiânia",
    texto:
      "Antes eu perdia pedido todo dia porque cliente mandava foto solta no grupo. Agora eles entram na vitrine, montam a sacola e o pedido já chega formatado pra mim. Virou rotina.",
    iniciais: "RS",
    cor: "violet",
  },
  {
    nome: "Diego Almeida",
    negocio: "Distribuidora Almeida — Bebidas",
    texto:
      "Achei que era complicado. Em duas semanas tava no ar, sem custo de iFood, sem percentual. O cliente digita o CEP e já sabe o frete. Simples assim.",
    iniciais: "DA",
    cor: "cyan",
  },
  {
    nome: "Carla Mendes",
    negocio: "Studio CM — Estética, Setor Bueno",
    texto:
      "Parei de ficar no celular respondendo 'que horas tem?' entre atendimento. O cliente já abre o site, vê os horários e agenda. Liberou minha cabeça pra trabalhar.",
    iniciais: "CM",
    cor: "lime",
  },
];

export interface MembroDupla {
  iniciais: string;
  nome: string;
  papel: string;
  bio: string;
  cor: string;
}

export const DUPLA: MembroDupla[] = [
  {
    iniciais: "E",
    nome: "Eduardo",
    papel: "Estratégia & Produto",
    bio: "Transforma o problema do negócio em um sistema que realmente funciona. Cuida de arquitetura, back-end e de garantir que o que sai do ar entrega resultado.",
    cor: "from-violet-500 to-cyan-400",
  },
  {
    iniciais: "P",
    nome: "Paloma",
    papel: "Design & Experiência",
    bio: "Garante que o sistema seja bonito, rápido e fácil de usar — do primeiro acesso ao checkout. Interface que converte, não só que imprime.",
    cor: "from-cyan-400 to-lime-400",
  },
];
