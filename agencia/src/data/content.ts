// Copy de exemplo — troque à vontade. Números/nomes são placeholders.

export const AGENCIA = {
  nome: "BEPA",
  nomeCompleto: "BEPA Consultoria, Assessoria e Serviços",
  iniciais: "B",
  tagline: "Consultoria, Assessoria e Serviços",
  whatsapp: "55169920093456",
  mensagemPadrao: "Oi! Vi o site de vocês e quero entender como posso digitalizar meu negócio.",
  email: "contato@bepa.com.br",
  // Guardados, mas fora do ar por decisão de conteúdo: nenhuma tela
  // renderiza esses dois hoje. Ficam aqui pra não se perderem.
  instagram: "https://instagram.com/bepa.consultoria",
  linkedin: "https://linkedin.com/company/bepa-consultoria",
};

// Em produção, defina VITE_ZAP_COMMERCE_URL no .env apontando para o domínio publicado do case.
export const ZAP_COMMERCE_URL =
  import.meta.env.VITE_ZAP_COMMERCE_URL || "http://localhost:5173/bella-atacado";

// Vídeo real do catálogo funcionando, usado no mockup de celular do case.
export const VIDEO_DEMO = "/demo-catalogo.mp4";
// Primeiro quadro do vídeo, mostrado enquanto ele carrega.
export const POSTER_DEMO = "/demo-poster.jpg";

export function linkWhatsApp(mensagem = AGENCIA.mensagemPadrao) {
  return `https://wa.me/${AGENCIA.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export interface Modulo {
  id: string;
  numero: string;
  titulo: string;
  resumo: string;
  itens: string[];
  cor: "violet" | "pink" | "blue";
}

export const MODULOS: Modulo[] = [
  {
    id: "comercio-whatsapp",
    numero: "01",
    titulo: "Comércio no WhatsApp",
    resumo:
      "Catálogo digital mobile-first com calculadora de preço em tempo real e pedido pronto no WhatsApp. É o mesmo motor por trás do Zap-Commerce, um dos nossos cases.",
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
    cor: "blue",
  },
  {
    id: "marketing-digital",
    numero: "03",
    titulo: "Marketing Digital",
    resumo:
      "Presença que gera venda: redes sociais, tráfego pago e identidade visual pensados pra quem realmente compra, não só pra curtir.",
    itens: [
      "Gestão de redes sociais com calendário e métricas",
      "Tráfego pago (Meta Ads e Google Ads)",
      "Branding e identidade visual",
      "Conteúdo pensado pra conversão, não só pra alcance",
    ],
    cor: "pink",
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
      "Visibilidade financeira real: conectamos a operação do dia a dia aos números que mostram se o negócio está saudável e onde pode lucrar mais.",
    itens: [
      "Controle de caixa com registro automatizado de entradas, saídas e fluxo diário integrado à operação",
      "Gestão de ordens de serviço (OS) e faturamento, com vínculo direto entre a execução de vendas/serviços e os relatórios financeiros",
      "Relatórios gerenciais e dashboards para análise de lucratividade, desempenho e tomada de decisão",
      "Controle de contas a receber e a pagar para acompanhamento da saúde financeira do negócio",
    ],
    cor: "blue",
  },
  {
    id: "consultoria-automacao",
    numero: "06",
    titulo: "Consultoria & Automação",
    resumo:
      "A gente entra, mapeia onde seu processo trava, e automatiza o que hoje consome seu tempo: planilha, mensagem repetida, controle manual.",
    itens: [
      "Diagnóstico completo do processo atual",
      "Automação de tarefas repetitivas",
      "Integração entre as ferramentas do seu negócio",
      "Treinamento da equipe pra usar o que foi construído",
    ],
    cor: "pink",
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
    cor: "blue",
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
    cor: "pink",
  },
  {
    id: "alimentacao",
    numero: "09",
    titulo: "Alimentação Sem Taxa de Delivery",
    resumo:
      "Cardápio digital com carrinho e cálculo de frete por CEP. Ideal para distribuidoras de bebidas e lanchonetes que querem fugir das altas taxas do iFood.",
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
    cor: "blue",
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
    descricao: "Você recebe um plano claro: o que vai ser feito, prazo e investimento, sem letra miúda.",
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

export interface PerguntaFrequente {
  pergunta: string;
  resposta: string;
}

export const FAQ: PerguntaFrequente[] = [
  {
    pergunta: "Quanto custa um projeto?",
    resposta:
      "Depende do módulo e do tamanho do problema. Depois do diagnóstico, você recebe uma proposta fechada, sem surpresa depois.",
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
      "Não. O Zap-Commerce é um case específico, mas construímos sistemas, sites e automações pra qualquer negócio que precise vender melhor online.",
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
  /** O que costuma travar nesse setor — o gancho de identificação. */
  dor: string;
  /** O que a gente entrega pra resolver, em linguagem de dono de negócio. */
  entregas: string[];
}

export const NICHOS: Nicho[] = [
  {
    id: "moda",
    nome: "Moda & Atacado",
    descricao: "Lojas da Rua 44 e atacadistas",
    dor: "Cliente manda foto solta no grupo, ninguém calcula o preço de atacado na hora e o pedido se perde no meio das mensagens.",
    entregas: [
      "Catálogo digital com preço de atacado calculado sozinho",
      "Pedido chegando pronto e formatado no seu WhatsApp",
      "Entrega por excursão, retirada ou transportadora",
      "Painel pra você mesmo trocar foto, preço e estoque",
    ],
  },
  {
    id: "distribuidoras",
    nome: "Distribuidoras",
    descricao: "Bebidas, alimentos e mercearias",
    dor: "Pedido por telefone e caderno, tabela de preço diferente por cliente e nenhuma visão de quanto realmente sobra no fim do mês.",
    entregas: [
      "Catálogo com tabela de preço por tipo de cliente",
      "Pedido mínimo e cálculo de frete por região",
      "Controle de contas a pagar e a receber",
      "Relatório de margem por produto",
    ],
  },
  {
    id: "estetica",
    nome: "Salões & Estética",
    descricao: "Agenda cheia sem parar de atender",
    dor: "Você para no meio do atendimento pra responder “que horas tem vaga?” e ainda assim marca dois clientes no mesmo horário.",
    entregas: [
      "Agendamento online, o cliente marca sozinho",
      "Confirmação e lembrete automáticos no WhatsApp",
      "Vitrine de serviços com preço e duração",
      "Histórico de quem já passou pelo seu salão",
    ],
  },
  {
    id: "eventos",
    nome: "Baladas & Eventos",
    descricao: "Lista VIP e reserva de lounge",
    dor: "Lista VIP no papel, fila na portaria e mapa de mesas que só uma pessoa da equipe sabe ler.",
    entregas: [
      "Lista VIP com QR Code gerado na hora",
      "Mapa de lounges e mesas (livre/ocupado)",
      "Check-in pelo celular do segurança",
      "Exportação da lista pra planilha ou WhatsApp",
    ],
  },
  {
    id: "oficinas",
    nome: "Oficinas & Auto",
    descricao: "Orçamento e ordem de serviço digital",
    dor: "Orçamento no caderno, cliente ligando pra saber se o carro ficou pronto e serviço que some entre uma troca de turno e outra.",
    entregas: [
      "Ordem de serviço do orçamento ao faturamento",
      "Status do serviço visível pro cliente",
      "Agenda dos mecânicos sem choque de horário",
      "Relatório financeiro ligado à execução",
    ],
  },
  {
    id: "logistica",
    nome: "Logística & Frete",
    descricao: "Excursões e transporte de carga",
    dor: "Ninguém sabe onde está a mercadoria, e o comprador liga toda hora perguntando se o fardo já saiu.",
    entregas: [
      "Registro digital de despacho (bilhete eletrônico)",
      "Rastreamento pelo número de celular",
      "Painel de manifesto de carga",
      "Aviso automático no WhatsApp a cada status",
    ],
  },
  {
    id: "lanchonetes",
    nome: "Lanchonetes & Delivery",
    descricao: "Cardápio próprio, sem taxa de aplicativo",
    dor: "20% a 30% do seu faturamento fica com o aplicativo de entrega e o cliente é deles, não seu.",
    entregas: [
      "Cardápio digital com carrinho e total em tempo real",
      "Cálculo de entrega por CEP e bairro",
      "Painel de pedidos estilo Kanban",
      "Zero comissão: a venda é 100% sua",
    ],
  },
  {
    id: "saude",
    nome: "Clínicas & Consultórios",
    descricao: "Agenda, prontuário e faturamento",
    dor: "Secretária presa no telefone remarcando horário, e paciente que falta sem avisar porque ninguém lembrou.",
    entregas: [
      "Agendamento online com confirmação automática",
      "Lembrete de consulta pra reduzir falta",
      "Prontuário simples e organizado",
      "Controle de convênio e faturamento",
    ],
  },
  {
    id: "industrias",
    nome: "Indústrias",
    descricao: "Catálogo B2B e portal de representante",
    dor: "Pedido de representante chega por e-mail e WhatsApp, cada um num formato, e alguém digita tudo de novo no sistema.",
    entregas: [
      "Portal B2B com catálogo e tabela por representante",
      "Central de pedidos com status em tempo real",
      "Integração com o ERP que você já usa",
      "Site institucional pra captar cliente novo",
    ],
  },
  {
    id: "petshop",
    nome: "Pet Shop & Hotelaria",
    descricao: "Banho, tosa e hospedagem",
    dor: "Agenda de banho e tosa no caderno, e nenhum controle de qual pet está hospedado até quando.",
    entregas: [
      "Agendamento de banho e tosa online",
      "Ficha do pet com histórico de atendimento",
      "Controle de hospedagem com entrada e saída",
      "Lembrete automático de retorno pro tutor",
    ],
  },
];

/* Os depoimentos fictícios (Renata/Diego/Carla) foram removidos: eram
   placeholders inventados e conviviam com prints REAIS de conversa logo
   abaixo — inclusive com nomes que se repetiam. Prova real vale mais que
   prova escrita por nós; a seção "Na prática" (CONVERSAS) faz esse papel. */

/* ------------------------------------------------------------------ */
/* CONVERSAS REAIS — prints de WhatsApp como prova social               */
/* ------------------------------------------------------------------ */

export interface Conversa {
  id: string;
  etiqueta: string;
  titulo: string;
  descricao: string;
  cor: "violet" | "pink" | "blue";
  /**
   * Print em `public/conversas/`. Vazio ("") mostra o espaço reservado.
   * Antes de publicar: borre número, foto e nome completo de quem aparece.
   */
  imagem: string;
  /** Dimensão real do arquivo: sem ela o navegador não reserva o espaço
      e a página pula quando o print chega (CLS). */
  largura: number;
  altura: number;
}

export const CONVERSAS: Conversa[] = [
  {
    id: "cliente-aprovando",
    etiqueta: "Depoimento",
    titulo: "“Chegou mais 4 pedidos sem eu precisar calcular nada”",
    descricao:
      "Cliente na manhã seguinte ao site entrar no ar. Antes ele perdia cerca de 2 pedidos por semana porque o pessoal mandava foto solta e ele esquecia de responder.",
    cor: "pink",
    imagem: "/conversas/cliente-aprovando.jpg",
    largura: 739,
    altura: 900,
  },
  {
    id: "lead-salao",
    etiqueta: "Lead pelo site",
    titulo: "Salão de beleza chegando pelo site",
    descricao:
      "“Muita mulherada me manda mensagem perguntando da minha agenda, querem saber se tenho hora vaga.” O site trouxe o contato; a agenda online resolve a dor.",
    cor: "violet",
    imagem: "/conversas/lead-salao.jpg",
    largura: 739,
    altura: 1200,
  },
  {
    id: "pedido-formatado",
    etiqueta: "Sistema funcionando",
    titulo: "Pedido do catálogo chegando pronto",
    descricao:
      "O cliente monta a sacola no catálogo e o pedido cai formatado no WhatsApp do lojista: itens, regra de preço, total e forma de entrega. Sem digitar nada.",
    cor: "blue",
    imagem: "/conversas/pedido-formatado.jpg",
    largura: 739,
    altura: 1460,
  },
];

export interface MembroTime {
  nome: string;
  /** Profissão principal em uma linha, pra faixa do hero e pro rodapé.
      O `papel` completo só aparece no cartão do Quem somos, que tem espaço. */
  profissao: string;
  papel: string;
  bio: string;
  /** Retrato 3:4, 660x880. */
  foto: string;
  /** Recorte quadrado do rosto, 320x320, pros lugares apertados. */
  fotoQuadrada: string;
  /** Guardado, mas não renderizado hoje — o cartão do Quem somos não
      mostra mais link de LinkedIn. */
  linkedin: string;
}

export const TIME: MembroTime[] = [
  {
    nome: "Eduardo Lourenço",
    profissao: "Engenheiro de Software",
    papel: "Engenheiro de Software · Consultor de E-commerce e Marketplace",
    bio: "Coordenador de e-commerce com estrada em marketplaces (Mercado Livre, Amazon, Shopee) e formação em Engenharia de Software. Cuida das integrações de ERP/API, da automação da operação e do desenvolvimento, com foco em rentabilidade e escala.",
    foto: "/time/eduardo.jpg",
    fotoQuadrada: "/time/eduardo-sq.jpg",
    linkedin:
      "https://www.linkedin.com/in/eduardo-louren%C3%A7o-7a5739260?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    nome: "Paloma Amaral",
    profissao: "Finanças & Business Intelligence",
    papel: "Finanças & Business Intelligence",
    bio: "Gestão financeira e administrativa com foco em Business Intelligence: fluxo de caixa, conciliação bancária e dashboards que mostram onde está a margem. Em formação em Engenharia de Software, une dados, tecnologia e finanças.",
    foto: "/time/paloma.jpg",
    fotoQuadrada: "/time/paloma-sq.jpg",
    linkedin: "https://www.linkedin.com/in/palomadias028",
  },
  {
    nome: "Bárbara Prata",
    profissao: "Gestão de Pessoas & Atendimento",
    papel: "Liderança, Gestão de Equipes & Experiência do Cliente",
    bio: "Formação em Gestão de Pessoas e Experiência do Cliente, com experiência em atendimento, acompanhamento de indicadores e desenvolvimento de equipes. Foco em atendimento proativo, eficaz e humanizado, sempre buscando resultado e melhoria contínua.",
    foto: "/time/barbara.jpg",
    fotoQuadrada: "/time/barbara-sq.jpg",
    linkedin: "",
  },
];
