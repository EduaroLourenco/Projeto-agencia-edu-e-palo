// Copy de exemplo — troque à vontade. Números/nomes são placeholders.

export const AGENCIA = {
  nome: "Sigma",
  nomeCompleto: "Sigma Consultoria, Assessoria e Serviços",
  iniciais: "S",
  tagline: "Consultoria, Assessoria e Serviços · Goiânia",
  cidade: "Goiânia",
  whatsapp: "5516994447044",
  mensagemPadrao: "Oi! Vi o site de vocês e quero entender como posso digitalizar meu negócio.",
  email: "contato@sigmaconsultoria.com.br",
  instagram: "https://instagram.com/sigma.consultoria",
  linkedin: "https://linkedin.com/company/sigma-consultoria",
};

// Em produção, defina VITE_ZAP_COMMERCE_URL no .env apontando para o domínio publicado do case.
export const ZAP_COMMERCE_URL =
  import.meta.env.VITE_ZAP_COMMERCE_URL || "http://localhost:5173/bella-atacado";

// Vídeo real do catálogo funcionando, usado no mockup de celular do case.
export const VIDEO_DEMO = "/demo-catalogo.mp4";

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
    id: "marketplace-ecommerce",
    numero: "04",
    titulo: "Marketplace & E-commerce",
    resumo:
      "Colocamos sua loja ou indústria para vender nos principais canais digitais, com estratégia de performance por trás de cada anúncio publicado.",
    itens: [
      "Digitalização de lojas e indústrias para venda online",
      "Implementação de loja própria e presença nos principais marketplaces (Mercado Livre, Shopee, Amazon, TikTok Shop e outros)",
      "Estratégias de performance para aumento de vendas e lucratividade",
      "Consultoria de operação e capacitação em e-commerce, tráfego e redes sociais, com toda a infraestrutura necessária para executar",
    ],
    cor: "violet",
  },
  {
    id: "financas",
    numero: "05",
    titulo: "Finanças",
    resumo:
      "Visibilidade financeira real: conectamos a operação do dia a dia aos números que mostram se o negócio está saudável — e onde pode lucrar mais.",
    itens: [
      "Controle de caixa com registro automatizado de entradas, saídas e fluxo diário integrado à operação",
      "Gestão de ordens de serviço (OS) e faturamento, com vínculo direto entre a execução de vendas/serviços e os relatórios financeiros",
      "Relatórios gerenciais e dashboards para análise de lucratividade, desempenho e tomada de decisão",
      "Controle de contas a receber e a pagar para acompanhamento da saúde financeira do negócio",
    ],
    cor: "cyan",
  },
  {
    id: "consultoria-automacao",
    numero: "06",
    titulo: "Consultoria & Automação",
    resumo:
      "A gente entra, mapeia onde seu processo trava, e automatiza o que hoje consome seu tempo — planilha, mensagem repetida, controle manual.",
    itens: [
      "Diagnóstico completo do processo atual",
      "Automação de tarefas repetitivas",
      "Integração entre as ferramentas do seu negócio",
      "Treinamento da equipe pra usar o que foi construído",
    ],
    cor: "lime",
  },
  {
    id: "vida-noturna",
    numero: "07",
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
    numero: "08",
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
    numero: "09",
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
    numero: "10",
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
  id: string;
  nome: string;
  descricao: string;
}

export const NICHOS: Nicho[] = [
  { id: "moda", nome: "Moda & Atacado", descricao: "Lojas da Rua 44 e atacadistas" },
  { id: "distribuidoras", nome: "Distribuidoras", descricao: "Bebidas, alimentos e mercearias" },
  { id: "estetica", nome: "Salões & Estética", descricao: "Agendamento sem WhatsApp" },
  { id: "eventos", nome: "Baladas & Eventos", descricao: "Lista VIP e reserva de lounge" },
  { id: "oficinas", nome: "Oficinas & Auto", descricao: "Agendamento e orçamento digital" },
  { id: "logistica", nome: "Logística Interior", descricao: "Excursões e frete da 44" },
  { id: "lanchonetes", nome: "Lanchonetes", descricao: "Cardápio e delivery sem taxa" },
  { id: "saude", nome: "Clínicas & Saúde", descricao: "Agenda e prontuário simples" },
];

export interface Depoimento {
  nome: string;
  negocio: string;
  texto: string;
  iniciais: string;
  cor: "violet" | "lime" | "cyan";
}

// Placeholder: depoimentos fictícios pra ilustrar o layout. Troque por
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

/* ------------------------------------------------------------------ */
/* CONVERSAS REAIS — prints de WhatsApp como prova social               */
/* ------------------------------------------------------------------ */

export interface Conversa {
  id: string;
  etiqueta: string;
  titulo: string;
  descricao: string;
  cor: "violet" | "lime" | "cyan";
  /**
   * Print em `public/conversas/`. Vazio ("") mostra o espaço reservado.
   * Antes de publicar: borre número, foto e nome completo de quem aparece.
   */
  imagem: string;
}

export const CONVERSAS: Conversa[] = [
  {
    id: "cliente-aprovando",
    etiqueta: "Depoimento",
    titulo: "“Chegou mais 4 pedidos sem eu precisar calcular nada”",
    descricao:
      "Cliente na manhã seguinte ao site entrar no ar. Antes ele perdia cerca de 2 pedidos por semana porque o pessoal mandava foto solta e ele esquecia de responder.",
    cor: "lime",
    imagem: "/conversas/cliente-aprovando.jpg",
  },
  {
    id: "lead-salao",
    etiqueta: "Lead pelo site",
    titulo: "Salão de beleza chegando pelo site",
    descricao:
      "“Muita mulherada me manda mensagem perguntando da minha agenda, querem saber se tenho hora vaga.” O site trouxe o contato; a agenda online resolve a dor.",
    cor: "violet",
    imagem: "/conversas/lead-salao.jpg",
  },
  {
    id: "pedido-formatado",
    etiqueta: "Sistema funcionando",
    titulo: "Pedido do catálogo chegando pronto",
    descricao:
      "O cliente monta a sacola no catálogo e o pedido cai formatado no WhatsApp do lojista — itens, regra de preço, total e forma de entrega. Sem digitar nada.",
    cor: "cyan",
    imagem: "/conversas/pedido-formatado.jpg",
  },
];

export interface MembroDupla {
  iniciais: string;
  nome: string;
  papel: string;
  bio: string;
  cor: string;
  linkedin: string;
}

export const DUPLA: MembroDupla[] = [
  {
    iniciais: "E",
    nome: "Eduardo Luiz Lourenço",
    papel: "E-commerce & Engenharia de Software",
    bio: "Coordenador de e-commerce com experiência prática em marketplaces (Mercado Livre, Amazon, Shopee) e formação em Engenharia de Software. Lidera integrações de ERP e API, automação de operação e desenvolvimento full stack — sempre com foco em rentabilidade e escala.",
    cor: "from-violet-500 to-cyan-400",
    linkedin:
      "https://www.linkedin.com/in/eduardo-louren%C3%A7o-7a5739260?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    iniciais: "P",
    nome: "Paloma Amaral",
    papel: "Finanças & Business Intelligence",
    bio: "Atua na gestão financeira e administrativa com foco em Business Intelligence: fluxo de caixa, conciliação bancária, automação de processos e dashboards gerenciais para tomada de decisão. Em formação em Engenharia de Software, une dados, tecnologia e finanças.",
    cor: "from-cyan-400 to-lime-400",
    linkedin: "https://www.linkedin.com/in/palomadias028",
  },
];
