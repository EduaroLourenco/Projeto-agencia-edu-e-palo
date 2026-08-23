// Conteúdo detalhado da página /servicos — complementa os módulos de MODULOS (content.ts)
// com a esteira de serviços especializados de dados, marca, automação e sistemas.

export interface ServicoExtra {
  id: string;
  icone: string;
  titulo: string;
  resumo: string;
  itens: string[];
}

export interface CategoriaServicos {
  id: string;
  titulo: string;
  descricao: string;
  cor: "violet" | "lime" | "cyan";
  servicos: ServicoExtra[];
}

export const CATEGORIAS_SERVICOS: CategoriaServicos[] = [
  {
    id: "dados-performance",
    titulo: "Dados & Performance",
    descricao: "Pra parar de decidir no achismo e passar a decidir olhando o número certo.",
    cor: "violet",
    servicos: [
      {
        id: "causa-raiz",
        icone: "search-check",
        titulo: "Diagnóstico de causa-raiz (atraso e cancelamento)",
        resumo:
          "Cruzamos dado de logística com o marketplace pra achar exatamente onde o pedido trava — separação, transportadora, prazo do vendedor ou o próprio cliente — em vez de ficar no chute.",
        itens: [
          "Mapeamento do funil do pedido até a entrega",
          "Cruzamento de dados de logística com o marketplace",
          "Relatório de causa raiz priorizado por impacto",
        ],
      },
      {
        id: "dashboard-multicanal",
        icone: "layout-dashboard",
        titulo: "Dashboard multicanal (estilo BI)",
        resumo:
          "Um painel só reúne a venda de site, marketplaces e WhatsApp, pra você parar de abrir cinco telas todo dia só pra saber como está o negócio.",
        itens: [
          "Integração dos principais canais de venda num painel único",
          "Faturamento, ticket médio e conversão por canal",
          "Atualização automática, sem planilha manual",
        ],
      },
      {
        id: "reconciliacao-estoque",
        icone: "refresh-cw",
        titulo: "Reconciliação de estoque ERP x Marketplace",
        resumo:
          "Comparamos o estoque do seu sistema com o que está publicado em cada canal pra evitar vender produto que não existe fisicamente — e a punição que vem junto disso.",
        itens: [
          "Conferência automática entre ERP e anúncios ativos",
          "Alerta de divergência antes que vire cancelamento",
          "Rotina recorrente, não uma auditoria única",
        ],
      },
      {
        id: "curva-abc",
        icone: "bar-chart-3",
        titulo: "Curva ABC + plano de campanha",
        resumo:
          "Classificamos o catálogo pelo que realmente traz resultado e montamos um plano de campanha pra investir onde tem retorno — em vez de promover tudo do mesmo jeito.",
        itens: [
          "Classificação ABC por faturamento e margem",
          "Plano de campanha priorizado por produto",
          "Recomendação do que tirar de linha ou reposicionar",
        ],
      },
      {
        id: "segmentacao-rfm",
        icone: "users-round",
        titulo: "Segmentação RFM (comportamento do cliente)",
        resumo:
          "Analisamos recência, frequência e valor de compra pra identificar quem é cliente fiel, quem sumiu e quem só compra na promoção — e o que fazer com cada grupo.",
        itens: [
          "Segmentação da base por comportamento de compra",
          "Identificação de clientes em risco de churn",
          "Ação sugerida por segmento: recuperação, fidelização, retenção",
        ],
      },
      {
        id: "calendario-campanha",
        icone: "calendar-check",
        titulo: "Calendário de campanha com antes/depois",
        resumo:
          "Planejamos o calendário promocional do ano e medimos o resultado de cada ação com número real — pra saber se a campanha vendeu ou só deu desconto.",
        itens: [
          "Calendário de campanhas alinhado às datas do setor",
          "Comparativo de performance antes/depois de cada ação",
          "Relatório de ROI por campanha",
        ],
      },
    ],
  },
  {
    id: "lancamento-marca",
    titulo: "Lançamento & Marca",
    descricao: "Pra produto novo não nascer perdido no meio do catálogo.",
    cor: "lime",
    servicos: [
      {
        id: "pacote-lancamento",
        icone: "rocket",
        titulo: "Pacote de lançamento de produto",
        resumo:
          "Antes de lançar, mapeamos a concorrência, definimos o posicionamento e montamos um plano de 60 dias — com meta clara em cada etapa.",
        itens: [
          "Análise de concorrência e precificação de mercado",
          "Definição de posicionamento e proposta de valor",
          "Plano de lançamento de 60 dias com metas por etapa",
        ],
      },
      {
        id: "infra-marca",
        icone: "palette",
        titulo: "Infraestrutura de marca pros anúncios",
        resumo:
          "Padronizamos foto, copy e identidade visual de todos os SKUs do catálogo, pra loja parecer uma marca de verdade — não uma coleção de anúncios soltos.",
        itens: [
          "Diretrizes de foto, copy e layout de anúncio",
          "Padronização aplicada em todo o catálogo",
          "Templates reaproveitáveis pra produto novo",
        ],
      },
      {
        id: "auditoria-compliance",
        icone: "shield-check",
        titulo: "Auditoria de compliance de anúncio",
        resumo:
          "Conferimos se cada anúncio está dentro das regras do marketplace e da legislação — Inmetro, ficha técnica, informação obrigatória — pra evitar denúncia e bloqueio.",
        itens: [
          "Checklist de conformidade por categoria de produto",
          "Identificação de anúncio em risco de bloqueio",
          "Correção priorizada por gravidade",
        ],
      },
    ],
  },
  {
    id: "automacao-atendimento",
    titulo: "Automação & Atendimento",
    descricao: "Pra tirar o time do repetitivo e deixar o dado provar o resultado.",
    cor: "cyan",
    servicos: [
      {
        id: "automacao-sac",
        icone: "bot",
        titulo: "Automação de SAC e atendimento",
        resumo:
          "Montamos um fluxo automático pra dúvida e reclamação repetitiva — status de pedido, troca, prazo — sem precisar de alguém respondendo a mesma coisa o dia inteiro.",
        itens: [
          "Mapeamento das dúvidas e reclamações mais frequentes",
          "Fluxo automático de resposta e triagem",
          "Escalonamento pra humano só quando realmente precisa",
        ],
      },
      {
        id: "auditoria-ga4",
        icone: "line-chart",
        titulo: "Auditoria + funil de GA4",
        resumo:
          "Configuramos e interpretamos o Google Analytics 4 pra mostrar de onde vem a venda de verdade — não só visita, o caminho inteiro até o pedido confirmado.",
        itens: [
          "Configuração de evento e funil de conversão",
          "Auditoria do que já existe, corrigindo o que está errado",
          "Relatório de origem de venda por canal",
        ],
      },
      {
        id: "tracker-roi",
        icone: "badge-check",
        titulo: "Tracker de ROI white-label",
        resumo:
          "Um painel de retorno sobre investimento em mídia, com a marca do seu negócio, pra mostrar pro seu próprio cliente ou sócio se o dinheiro investido está voltando.",
        itens: [
          "Painel de ROI personalizado com a identidade do cliente final",
          "Consolidação de investimento e retorno por canal",
          "Feito pra agências e consultorias que reportam a terceiros",
        ],
      },
    ],
  },
  {
    id: "dev-sistemas",
    titulo: "Dev & Sistemas",
    descricao: "Onde a operação para de depender de planilha e passa a rodar sozinha.",
    cor: "violet",
    servicos: [
      {
        id: "integracao-erp-api",
        icone: "plug-zap",
        titulo: "Integração automática ERP x Marketplace (API)",
        resumo:
          "Conectamos seu ERP direto com os marketplaces via API, pra estoque, preço e pedido atualizarem sozinhos — fim da planilha manual e do erro de digitação.",
        itens: [
          "Integração via API entre ERP e marketplaces",
          "Sincronização automática de estoque e preço",
          "Menos erro manual, menos ruptura de estoque",
        ],
      },
      {
        id: "painel-bi-web",
        icone: "monitor-smartphone",
        titulo: "Painel BI web (substitui Excel)",
        resumo:
          "Uma versão web do seu dashboard de gestão — vários acessando ao mesmo tempo, dado atualizado sozinho, sem depender de planilha que só uma pessoa sabe mexer.",
        itens: [
          "Painel web multiusuário com controle de acesso",
          "Atualização automática de dado",
          "Substitui a planilha crítica do dia a dia",
        ],
      },
      {
        id: "repricer",
        icone: "sliders-horizontal",
        titulo: "Repricer / motor de preço dinâmico",
        resumo:
          "Sistema que ajusta o preço no marketplace automaticamente, dentro de regras que você define, pra não perder venda por preço alto nem margem por preço baixo.",
        itens: [
          "Regras de precificação por produto ou categoria",
          "Ajuste automático conforme concorrência e margem mínima",
          "Histórico de alteração de preço",
        ],
      },
      {
        id: "monitor-api-ml",
        icone: "radar",
        titulo: "Monitor de métricas via API do Mercado Livre",
        resumo:
          "Puxamos dado direto da API do Mercado Livre — venda, reputação, anúncio — sem precisar exportar relatório na mão toda semana.",
        itens: [
          "Integração direta com a API do Mercado Livre",
          "Venda, reputação e anúncio em tempo real",
          "Alerta automático de queda de performance",
        ],
      },
      {
        id: "saas-agendamento",
        icone: "calendar-check",
        titulo: "SaaS de agendamento multissetorial",
        resumo:
          "Sistema de agendamento pronto pra revender — salão, clínica, oficina, estúdio — com sua marca, implantação rápida, sem construir do zero.",
        itens: [
          "Sistema de agendamento white-label por setor",
          "Implantação rápida com sua marca aplicada",
          "Modelo de assinatura pra revenda",
        ],
      },
      {
        id: "micro-saas-documentos",
        icone: "file-text",
        titulo: "Micro-SaaS de documentos",
        resumo:
          "Gerador de recibo, declaração ou contrato simples, por assinatura mensal — resolve uma dor específica sem virar um sistema gigante e caro.",
        itens: [
          "Geração automática de documento recorrente",
          "Modelo de assinatura mensal de baixo custo",
          "Personalização por tipo de documento e setor",
        ],
      },
      {
        id: "portal-b2b",
        icone: "building-2",
        titulo: "Portal B2B de fornecedor e representante",
        resumo:
          "Organiza pedido de vários representantes ou distribuidores num só lugar, com catálogo, tabela de preço e status de pedido centralizados.",
        itens: [
          "Catálogo e tabela de preço por representante",
          "Central de pedidos com status em tempo real",
          "Menos pedido perdido em e-mail ou WhatsApp",
        ],
      },
      {
        id: "gestao-os",
        icone: "ticket",
        titulo: "Gestão Operacional e Ordens de Serviço (OS)",
        resumo:
          "Automatiza o fluxo de atendimento técnico: chamado aberto, status de execução e relatório financeiro integrado, sem depender de caderno ou planilha solta.",
        itens: [
          "Controle de chamados técnicos do abertura ao fechamento",
          "Status de serviço visível pro cliente e pro time",
          "Relatório financeiro integrado à execução da OS",
        ],
      },
      {
        id: "plataforma-ecommerce",
        icone: "shopping-cart",
        titulo: "Plataforma de E-commerce e Loja Virtual",
        resumo:
          "Construção da loja própria em si — catálogo completo, responsiva e otimizada pra venda, com SEO e checkout fluido. Complementa a estratégia de marketplaces com um canal que é 100% seu.",
        itens: [
          "Catálogo de produtos completo e responsivo",
          "SEO técnico e checkout otimizado pra conversão",
          "Canal de venda próprio, sem depender só de marketplace",
        ],
      },
      {
        id: "integracao-erp-crm",
        icone: "network",
        titulo: "Integração de APIs e Sistemas (ERP/CRM)",
        resumo:
          "Conecta o site ou sistema do cliente com o que já existe por fora: gateway de pagamento, emissão de nota fiscal, ERP local e meios de envio — tudo conversando entre si.",
        itens: [
          "Integração com gateways de pagamento e emissão de NF",
          "Conexão com ERP/CRM já usado pelo negócio",
          "Meios de envio e frete integrados ao pedido",
        ],
      },
      {
        id: "sites-institucionais-hp",
        icone: "gauge",
        titulo: "Website Institucional High-Performance",
        resumo:
          "Site moderno e otimizado pra posicionamento de marca, captação de lead B2B/B2C e apresentação de catálogo industrial — pensado pra carregar rápido e converter visita em contato.",
        itens: [
          "Performance e SEO técnico desde a estrutura",
          "Captação de lead com formulário qualificado",
          "Apresentação de catálogo institucional ou industrial",
        ],
      },
      {
        id: "app-web-sob-medida",
        icone: "app-window",
        titulo: "Aplicação Web Sob Medida (SaaS)",
        resumo:
          "Quando o gargalo é específico e nenhum sistema pronto resolve — controle interno de insumo, agendamento com regra própria, portal de fornecedor — construímos a aplicação exata pra esse problema.",
        itens: [
          "Levantamento do gargalo específico da operação",
          "Aplicação construída sob medida, não adaptada de template",
          "Ideal quando nenhuma solução pronta resolve o caso",
        ],
      },
      {
        id: "manutencao-hospedagem",
        icone: "server-cog",
        titulo: "Manutenção, Hospedagem e Segurança",
        resumo:
          "Pacote contínuo de suporte técnico, otimização de velocidade, gestão da infraestrutura em nuvem e proteção de dados — pra o site ou sistema não virar problema depois que vai pro ar.",
        itens: [
          "Suporte técnico contínuo pós-lançamento",
          "Otimização de velocidade e gestão de infraestrutura em nuvem",
          "Proteção de dados e monitoramento de segurança",
        ],
      },
    ],
  },
  {
    id: "financas-controladoria",
    titulo: "Finanças & Controladoria",
    descricao: "Pra saber, com número na mão, quanto sobra no fim do mês — e por quê.",
    cor: "cyan",
    servicos: [
      {
        id: "dashboard-financeiro-bi",
        icone: "pie-chart",
        titulo: "Dashboard de Indicadores Financeiros (BI)",
        resumo:
          "Margem de lucro, DRE simplificado, ticket médio, faturamento por canal e projeção de receita — tudo em tempo real, num painel só, sem esperar o fim do mês pra saber como foi.",
        itens: [
          "DRE simplificado e margem de lucro em tempo real",
          "Faturamento por canal e ticket médio",
          "Projeção de receita com base no histórico",
        ],
      },
      {
        id: "automacao-faturamento",
        icone: "receipt",
        titulo: "Automação de Faturamento e Cobrança",
        resumo:
          "Emissão automática de nota fiscal (NF-e/NFS-e), geração de Pix e boleto, e régua de cobrança pra inadimplente — sem alguém tendo que lembrar de fazer isso manualmente.",
        itens: [
          "Emissão automática de NF-e/NFS-e",
          "Geração de Pix e boleto integrada à venda",
          "Régua de cobrança automatizada pra inadimplência",
        ],
      },
      {
        id: "contas-pagar-receber",
        icone: "landmark",
        titulo: "Controle de Contas a Pagar e a Receber",
        resumo:
          "Gestão centralizada com alerta de vencimento, fluxo de caixa diário e mensal, e categorização por centro de custo — pra nada vencer sem ninguém perceber.",
        itens: [
          "Alertas de vencimento automáticos",
          "Fluxo de caixa diário e mensal",
          "Categorização por centro de custo",
        ],
      },
      {
        id: "conciliacao-bancaria",
        icone: "credit-card",
        titulo: "Conciliação Bancária e de Cartões",
        resumo:
          "Cruzamento automático entre a venda registrada (maquininha, e-commerce) e o extrato bancário, pra identificar taxa cobrada errada ou estorno que passou batido.",
        itens: [
          "Cruzamento automático de vendas com o extrato bancário",
          "Identificação de taxa incorreta ou estorno não registrado",
          "Cobertura de maquininha e e-commerce no mesmo processo",
        ],
      },
      {
        id: "precificacao-margem",
        icone: "percent",
        titulo: "Precificação e Calculadora de Margem",
        resumo:
          "Simula custo de produção ou aquisição (CMV), despesa operacional e imposto, pra você definir a margem de lucro ideal antes de colocar o preço na etiqueta — não depois.",
        itens: [
          "Simulação de CMV e despesa operacional",
          "Cálculo de imposto embutido no preço final",
          "Definição da margem ideal antes da precificação",
        ],
      },
      {
        id: "comissao-split",
        icone: "split",
        titulo: "Cálculo de Comissão e Split de Pagamento",
        resumo:
          "Automatiza a divisão de receita entre vendedor, representante comercial ou parceiro, com suporte a gateway de pagamento com split automático — sem planilha de rateio no fim do mês.",
        itens: [
          "Divisão automática entre vendedores, representantes e parceiros",
          "Suporte a gateway de pagamento com split automático",
          "Fim da planilha manual de rateio de comissão",
        ],
      },
      {
        id: "fluxo-caixa-projecao",
        icone: "trending-up",
        titulo: "Relatório e Projeção de Fluxo de Caixa",
        resumo:
          "Análise de ponto de equilíbrio (breakeven), simulação de cenário futuro e controle de custo fixo versus variável — pra decisão de investimento sair do feeling e entrar na planilha certa.",
        itens: [
          "Análise de ponto de equilíbrio (breakeven)",
          "Simulação de cenários futuros de receita e custo",
          "Controle de custo fixo versus variável",
        ],
      },
    ],
  },
  {
    id: "ticket-menor",
    titulo: "Ticket Menor & Volume",
    descricao: "Projeto enxuto, entrega rápida — pra testar antes de investir em algo maior.",
    cor: "lime",
    servicos: [
      {
        id: "ferramenta-sob-medida",
        icone: "calculator",
        titulo: "Ferramenta web sob medida",
        resumo:
          "Calculadora, formulário ou gerador simples que resolve uma tarefa manual repetitiva do seu time — escopo enxuto, ticket menor, resultado imediato.",
        itens: [
          "Escopo enxuto focado numa única tarefa",
          "Entrega rápida, sem processo longo de projeto",
          "Bom pra testar antes de investir em algo maior",
        ],
      },
      {
        id: "catalogo-landing-local",
        icone: "store",
        titulo: "Catálogo digital + landing page pra loja local",
        resumo:
          "Presença digital básica pra quem ainda não tem nada online — catálogo com foto e preço, contato direto, publicado em poucos dias.",
        itens: [
          "Catálogo digital com foto, preço e categoria",
          "Landing page com contato direto pelo WhatsApp",
          "Publicação rápida, ideal como primeiro passo online",
        ],
      },
    ],
  },
];

// Resumos aprofundados dos módulos principais (reaproveitados de content.ts na página /servicos,
// com um ângulo mais concreto/entrega do que o teaser da home).
export const RESUMOS_SERVICOS: Record<string, string> = {
  "comercio-whatsapp":
    "Substitui o grupo de WhatsApp bagunçado por uma vitrine profissional: o cliente monta o próprio pedido, vê o preço certo e a mensagem final já chega organizada pro lojista, sem ida e volta.",
  "sites-sistemas":
    "Não é template disfarçado de sistema: mapeamos o seu processo real e construímos exatamente o que ele precisa — do site institucional ao painel interno que sua equipe usa todo dia.",
  "marketing-digital":
    "Tráfego, redes sociais e identidade visual trabalhando juntos com uma meta clara: converter, não só aparecer. Cada peça de conteúdo nasce pensando em quem vai comprar.",
  "marketplace-ecommerce":
    "Do primeiro anúncio à operação madura: colocamos sua loja pra vender nos canais certos e estruturamos a rotina — estoque, precificação, atendimento — pra sustentar o crescimento.",
  financas:
    "Conectamos a operação do dia a dia — venda, OS, faturamento — aos números que realmente importam: quanto entra, quanto sai, e onde está a margem que ninguém está vendo.",
  "consultoria-automacao":
    "A gente entra no processo, encontra o gargalo que consome seu tempo e constrói a automação certa — sem prometer robô milagroso, só o que realmente resolve.",
  "vida-noturna":
    "Portaria e reserva sem fila de papel: lista VIP, mapa de lounge e check-in digital, feitos pra funcionar no ritmo — e no barulho — de uma casa noturna cheia.",
  agendamento:
    "Seu cliente agenda sozinho, você para de responder 'que horas tem vaga' o dia inteiro — e ainda ganha um histórico organizado de quem passou pelo seu negócio.",
  alimentacao:
    "Cardápio, carrinho e frete calculado por CEP, sem repassar 20-30% pro aplicativo de entrega. A venda continua sua, do pedido ao pagamento.",
  "logistica-44":
    "Rastreamento de fardo por excursão ou transportadora, com notificação automática — pra lojista e revendedor pararem de se perguntar onde está a mercadoria.",
};

/* ------------------------------------------------------------------ */
/* AGRUPAMENTO POR PROBLEMA DO CLIENTE                                  */
/* ------------------------------------------------------------------ */

/**
 * As categorias acima são a nossa taxonomia interna (por disciplina).
 * O cliente não chega pensando "preciso de Dev & Sistemas" — ele chega
 * com um problema. Estes grupos reorganizam os mesmos 44 serviços pela
 * pergunta que o dono do negócio faz, e é essa a divisão que a página
 * /servicos usa: poucas áreas na entrada, profundidade a um clique.
 */
export interface GrupoServicos {
  id: string;
  nome: string;
  /** Frase curta, no problema do cliente — não no nome da disciplina. */
  promessa: string;
  icone: string;
  /** IDs vindos de MODULOS (content.ts) e de CATEGORIAS_SERVICOS. */
  servicos: string[];
}

export const GRUPOS_SERVICOS: GrupoServicos[] = [
  {
    id: "vender-online",
    nome: "Vender online e em marketplace",
    promessa: "Do primeiro catálogo à operação madura em Mercado Livre, Shopee e loja própria.",
    icone: "shopping-cart",
    servicos: [
      "comercio-whatsapp",
      "marketplace-ecommerce",
      "plataforma-ecommerce",
      "catalogo-landing-local",
      "repricer",
      "monitor-api-ml",
      "reconciliacao-estoque",
      "curva-abc",
      "auditoria-compliance",
      "infra-marca",
      "pacote-lancamento",
    ],
  },
  {
    id: "sistemas",
    nome: "Sistema sob medida pra sua operação",
    promessa: "Quando nenhum sistema pronto encaixa no jeito que o seu negócio funciona.",
    icone: "app-window",
    servicos: [
      "app-web-sob-medida",
      "gestao-os",
      "portal-b2b",
      "agendamento",
      "saas-agendamento",
      "vida-noturna",
      "alimentacao",
      "logistica-44",
      "micro-saas-documentos",
      "ferramenta-sob-medida",
    ],
  },
  {
    id: "financas",
    nome: "Finanças e controladoria",
    promessa: "Saber, com número na mão, quanto sobra no fim do mês — e por quê.",
    icone: "wallet",
    servicos: [
      "financas",
      "dashboard-financeiro-bi",
      "automacao-faturamento",
      "contas-pagar-receber",
      "conciliacao-bancaria",
      "precificacao-margem",
      "comissao-split",
      "fluxo-caixa-projecao",
    ],
  },
  {
    id: "dados",
    nome: "Dados pra decidir",
    promessa: "Parar de decidir no achismo e passar a olhar o número certo.",
    icone: "bar-chart-3",
    servicos: [
      "dashboard-multicanal",
      "painel-bi-web",
      "causa-raiz",
      "segmentacao-rfm",
      "calendario-campanha",
      "tracker-roi",
    ],
  },
  {
    id: "automacao",
    nome: "Automação e integração",
    promessa: "Tirar o time do repetitivo e fazer os sistemas conversarem entre si.",
    icone: "plug-zap",
    servicos: [
      "consultoria-automacao",
      "automacao-sac",
      "integracao-erp-api",
      "integracao-erp-crm",
      "manutencao-hospedagem",
    ],
  },
  {
    id: "site-marketing",
    nome: "Site, marca e tráfego",
    promessa: "Ser achado, parecer profissional e transformar visita em contato.",
    icone: "megaphone",
    servicos: ["sites-sistemas", "sites-institucionais-hp", "marketing-digital", "auditoria-ga4"],
  },
];
