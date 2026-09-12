import type { Loja, Oferta, TipoPagina, BlocoNaPagina, EstiloBloco, Tema } from "./tipos";

/**
 * De onde nasce uma loja nova.
 *
 * Três modelos, não um em branco: loja vazia é a tela mais desanimadora que
 * existe, e o lojista não sabe o que fazer com ela. Cada modelo já vem com
 * as páginas montadas, os recursos certos ligados e três itens de exemplo —
 * marcados como exemplo, pra ele trocar em vez de inventar do zero.
 *
 * MODELO e ESTILO são eixos separados, e isso é o ponto. O modelo decide o
 * que a loja FAZ (agenda, caixa fechada, sacola); o estilo decide como ela
 * PARECE. Cruzados, três modelos e seis estilos dão dezoito lojas que não se
 * parecem — em vez de três demonstrações com a cor trocada, que era o que
 * fazia tudo aqui ter cara de template barato.
 */

export type IdModelo = "produtos" | "servicos" | "atacado" | "zero";

export const MODELOS: {
  id: IdModelo;
  nome: string;
  descricao: string;
  corMarca: string;
}[] = [
  {
    id: "produtos",
    nome: "Loja de produtos",
    descricao: "Vitrine com fotos, sacola e pedido no WhatsApp.",
    corMarca: "#0f6fae",
  },
  {
    id: "servicos",
    nome: "Serviços com agenda",
    descricao: "Cliente escolhe o serviço, o dia, a hora e quem atende.",
    corMarca: "#7b4bd8",
  },
  {
    id: "atacado",
    nome: "Atacado / distribuidora",
    descricao: "Caixa fechada, pedido mínimo e faixa de desconto por volume.",
    corMarca: "#1f7a4d",
  },
  {
    id: "zero",
    nome: "Começar do zero",
    descricao: "Uma página em branco. Você escolhe cada bloco.",
    corMarca: "#3b3b46",
  },
];

/* ============================================================
   ESTILOS — a mesma loja, seis caras
   ============================================================ */

export type IdEstilo = "essencial" | "elegante" | "corporativo" | "clinica" | "marketplace" | "noturno";

export interface Estilo {
  id: IdEstilo;
  nome: string;
  /** Uma frase que diz pra quem serve — não o que é. */
  descricao: string;
  /** O que muda no tema. `corMarca` ausente = mantém a cor do modelo. */
  tema: Omit<Tema, "corMarca"> & { corMarca?: string };
  /**
   * Como as seções são vestidas.
   *
   * Trocar só a cor não muda a cara de um site: o que muda é onde tem caixa,
   * onde tem borda, o que sangra até a borda da tela e quanto ar sobra. É
   * isto aqui, e não a paleta, que separa "clínica" de "marketplace".
   */
  vestimenta: {
    abertura: EstiloBloco;
    secao: EstiloBloco;
    fechamento: EstiloBloco;
    /** O tom da faixinha de aviso. */
    faixa: "claro" | "marca" | "escuro";
    /** Grade do catálogo: estilo denso mostra três colunas. */
    colunas: "2" | "3";
    /** Como a faixa de categorias se apresenta. */
    categorias: "pilulas" | "cartoes";
  };
}

export const ESTILOS: Estilo[] = [
  {
    id: "essencial",
    nome: "Essencial",
    descricao: "Claro, direto, sem firula. Bom pra quase tudo.",
    tema: {
      corPapel: "#ffffff",
      densidade: "media",
      canto: "suave",
      fontes: "sora-inter",
      estiloBotao: "solido",
      sombra: "suave",
      escalaTexto: "normal",
    },
    vestimenta: {
      abertura: { fundo: "marca-suave", respiro: "g", canto: "redondo", alinhamento: "centro" },
      secao: { fundo: "suave", respiro: "g", sangrar: true },
      fechamento: { fundo: "escuro", respiro: "g", sangrar: true },
      faixa: "marca",
      colunas: "2",
      categorias: "pilulas",
    },
  },
  {
    id: "elegante",
    nome: "Elegante",
    descricao: "Serifa, muito ar, quase nenhuma caixa. Joalheria, ateliê, autoral.",
    tema: {
      corMarca: "#8a6236",
      corPapel: "#faf7f2",
      densidade: "confortavel",
      canto: "reto",
      fontes: "fraunces-inter",
      estiloBotao: "contorno",
      sombra: "plana",
      escalaTexto: "grande",
    },
    vestimenta: {
      // Sem fundo e sem caixa: o que faz um site parecer caro é o vazio em
      // volta do texto, não a moldura. Cada caixa a menos aqui é dinheiro.
      abertura: { fundo: "nenhum", respiro: "g", alinhamento: "centro", espacoDepois: "grande" },
      secao: { fundo: "nenhum", respiro: "g", borda: true, canto: "reto" },
      fechamento: { fundo: "escuro", respiro: "g", sangrar: true, alinhamento: "centro" },
      faixa: "claro",
      colunas: "2",
      categorias: "pilulas",
    },
  },
  {
    id: "corporativo",
    nome: "Corporativo",
    descricao: "Estruturado, com bordas e hierarquia firme. Consultoria, indústria, B2B.",
    tema: {
      corMarca: "#14356b",
      corPapel: "#ffffff",
      densidade: "media",
      canto: "reto",
      fontes: "archivo-inter",
      estiloBotao: "solido",
      sombra: "plana",
      escalaTexto: "normal",
    },
    vestimenta: {
      // Alinhado à esquerda e com borda: relatório, não cartaz. É o que o
      // comprador corporativo lê como "gente séria".
      abertura: { fundo: "suave", respiro: "g", canto: "reto", borda: true, alinhamento: "esquerda" },
      secao: { fundo: "nenhum", respiro: "g", borda: true, canto: "reto" },
      fechamento: { fundo: "marca", respiro: "g", sangrar: true, alinhamento: "esquerda" },
      faixa: "escuro",
      colunas: "2",
      categorias: "pilulas",
    },
  },
  {
    id: "clinica",
    nome: "Clínica & saúde",
    descricao: "Calmo, arredondado, sem aresta. Consultório, exame, bem-estar.",
    tema: {
      corMarca: "#0e7c86",
      corPapel: "#f2f7f8",
      densidade: "confortavel",
      canto: "redondo",
      fontes: "instrument-inter",
      estiloBotao: "solido",
      sombra: "suave",
      escalaTexto: "normal",
    },
    vestimenta: {
      // Tudo em cartão flutuando num papel levemente frio: é a linguagem de
      // app de saúde, e ela comunica cuidado antes de qualquer texto.
      abertura: { fundo: "papel", respiro: "g", canto: "redondo", sombra: "leve", alinhamento: "centro" },
      secao: { fundo: "papel", respiro: "g", canto: "redondo", sombra: "leve" },
      fechamento: { fundo: "marca-suave", respiro: "g", canto: "redondo", alinhamento: "centro" },
      faixa: "claro",
      colunas: "2",
      categorias: "pilulas",
    },
  },
  {
    id: "marketplace",
    nome: "Marketplace",
    descricao: "Denso, três colunas, tudo à mão. Muitos itens e giro rápido.",
    tema: {
      corMarca: "#2f4bd6",
      corPapel: "#f4f5f8",
      densidade: "compacta",
      canto: "suave",
      fontes: "archivo-inter",
      estiloBotao: "solido",
      sombra: "suave",
      escalaTexto: "pequeno",
    },
    vestimenta: {
      // Faixa pintada no topo e produto imediatamente abaixo: no marketplace
      // o herói é o catálogo, não o discurso.
      abertura: { fundo: "marca", respiro: "m", canto: "suave", sangrar: true, alinhamento: "centro" },
      secao: { fundo: "papel", respiro: "m", canto: "suave", borda: true },
      fechamento: { fundo: "suave", respiro: "g", sangrar: true },
      faixa: "marca",
      colunas: "3",
      categorias: "cartoes",
    },
  },
  {
    id: "noturno",
    nome: "Noturno",
    descricao: "Fundo escuro e detalhe dourado. Bar, estúdio, marca de noite.",
    tema: {
      corMarca: "#c9a227",
      corPapel: "#141319",
      densidade: "confortavel",
      canto: "suave",
      fontes: "instrument-inter",
      estiloBotao: "contorno",
      sombra: "plana",
      escalaTexto: "normal",
    },
    vestimenta: {
      abertura: { fundo: "marca-suave", respiro: "g", canto: "suave", alinhamento: "centro" },
      secao: { fundo: "suave", respiro: "g", sangrar: true },
      fechamento: { fundo: "marca-suave", respiro: "g", sangrar: true, alinhamento: "centro" },
      faixa: "marca",
      colunas: "2",
      categorias: "pilulas",
    },
  },
];

export function estilo(id: IdEstilo): Estilo {
  return ESTILOS.find((e) => e.id === id) ?? ESTILOS[0];
}

function item(
  id: string,
  tipo: Oferta["tipo"],
  nome: string,
  resumo: string,
  preco: number,
  categoria: string,
  dadosModulo: Record<string, unknown> = {},
): Oferta {
  return {
    id,
    tipo,
    nome,
    resumo,
    descricao: "",
    midia: [],
    categorias: [categoria],
    precoBase: preco,
    ativa: true,
    destaque: true,
    dadosModulo,
  };
}

const EXEMPLOS: Record<IdModelo, Oferta[]> = {
  produtos: [
    item("ex1", "produto", "Produto de exemplo 1", "Troque o nome, a foto e o preço", 49.9, "Destaques"),
    item("ex2", "produto", "Produto de exemplo 2", "Este texto vira o resumo do item", 79.9, "Destaques"),
    item("ex3", "produto", "Produto de exemplo 3", "Apague os exemplos quando terminar", 29.9, "Novidades"),
  ],
  servicos: [
    item("ex1", "servico", "Serviço de exemplo 1", "Troque o nome e o preço", 90, "Principais", {
      agendamento: { duracaoMin: 60 },
    }),
    item("ex2", "servico", "Serviço de exemplo 2", "A duração define os horários livres", 150, "Principais", {
      agendamento: { duracaoMin: 90 },
    }),
    item("ex3", "produto", "Produto pra levar pra casa", "Serviço e produto na mesma sacola", 120, "Loja"),
  ],
  atacado: [
    item("ex1", "produto", "Item de exemplo · caixa", "Fardo com 12", 24.9, "Mercearia", {
      b2b: { minimo: 12, multiplo: 12, unidadeCaixa: "pct" },
    }),
    item("ex2", "produto", "Item de exemplo · fardo", "Fardo com 6", 8.9, "Bebidas", {
      b2b: { minimo: 6, multiplo: 6, unidadeCaixa: "un" },
    }),
    item("ex3", "produto", "Item de exemplo · unidade", "Vende avulso", 4.35, "Limpeza"),
  ],
  zero: [],
};

const MODULOS: Record<IdModelo, string[]> = {
  produtos: ["variantes", "entrega", "pagamento"],
  servicos: ["agendamento", "pagamento"],
  atacado: ["b2b", "entrega", "pagamento"],
  zero: ["pagamento"],
};

const CONFIG: Record<IdModelo, Record<string, unknown>> = {
  produtos: {
    entrega: {
      modos: [
        { id: "retirada", nome: "Retirar na loja", descricao: "Combinamos o horário no chat." },
        { id: "entrega", nome: "Entrega", descricao: "Frete a combinar.", pede: ["cep", "endereco"] },
      ],
    },
    pagamento: { formas: [{ id: "pix", nome: "PIX" }, { id: "cartao", nome: "Cartão na entrega" }] },
  },
  servicos: {
    agendamento: {
      profissionais: [{ id: "p1", nome: "Profissional 1", papel: "Equipe" }],
      diasAtendidos: [1, 2, 3, 4, 5, 6],
      horaInicio: "09:00",
      horaFim: "18:00",
      intervalo: 30,
      janelaDias: 30,
    },
    pagamento: { formas: [{ id: "pix", nome: "PIX no dia" }, { id: "cartao", nome: "Cartão no local" }] },
  },
  atacado: {
    b2b: {
      pedidoMinimo: 300,
      exigirIdentificacao: true,
      faixas: [
        { min: 30, desconto: 3 },
        { min: 60, desconto: 6 },
      ],
    },
    entrega: {
      modos: [{ id: "rota", nome: "Entrega na rota", descricao: "Até 48h na sua região.", pede: ["endereco"] }],
    },
    pagamento: { formas: [{ id: "pix", nome: "PIX" }, { id: "boleto", nome: "Boleto 28 dias" }] },
  },
  zero: {
    pagamento: { formas: [{ id: "pix", nome: "PIX" }] },
  },
};

/**
 * A loja em branco.
 *
 * Não é um arquivo vazio: é uma página com UM bloco de texto explicando o
 * que fazer. Tela totalmente em branco não é liberdade, é paralisia — e o
 * lojista fecha o estúdio achando que quebrou.
 */
function paginasVazias(e: Estilo): Record<TipoPagina, BlocoNaPagina[]> {
  return {
    inicio: [
      {
        id: "z1",
        tipo: "texto",
        props: {
          titulo: "Sua página em branco",
          corpo: "Toque no + aqui embaixo pra colocar o primeiro bloco: uma capa, uma vitrine de produtos, um texto. Toque na paleta pra trocar as cores e as fontes.",
          alinhamento: "centro",
        },
        estilo: e.vestimenta.abertura,
      },
    ],
    catalogo: [],
    oferta: [],
    sacola: [],
    confirmacao: [],
  };
}

function paginas(modelo: IdModelo, e: Estilo): Record<TipoPagina, BlocoNaPagina[]> {
  if (modelo === "zero") return paginasVazias(e);

  const v = e.vestimenta;
  const comum: BlocoNaPagina[] = [
    { id: "p1", tipo: "faixa-categorias", props: { titulo: "", estilo: v.categorias } },
  ];

  const inicio: BlocoNaPagina[] = [
    {
      id: "b1",
      tipo: "texto",
      props: {
        titulo: "Bem-vindo à sua loja nova",
        corpo: "Toque em qualquer bloco pra editar. Use o + pra adicionar seções e a paleta pra trocar as cores.",
        alinhamento: v.abertura.alinhamento ?? "centro",
      },
      estilo: v.abertura,
    },
    ...comum,
    {
      id: "b2",
      tipo: modelo === "atacado" ? "lista-rapida" : "grade-ofertas",
      props:
        modelo === "atacado"
          ? { titulo: "Mais pedidos", regra: "todas", categoria: "", limite: 8 }
          : {
              titulo: modelo === "servicos" ? "Nossos serviços" : "Destaques",
              regra: "todas",
              categoria: "",
              limite: v.colunas === "3" ? 9 : 6,
              colunas: v.colunas,
            },
    },
    {
      id: "b3",
      tipo: "selos",
      props: {
        titulo: "",
        variante: "grade",
        selos: [
          { icone: "atendimento", titulo: "Atendimento no WhatsApp", texto: "Troque este texto pelo seu." },
          { icone: "qualidade", titulo: "Uma promessa sua", texto: "O que a sua loja garante." },
        ],
      },
      estilo: v.secao,
    },
    {
      id: "b4",
      tipo: "perguntas",
      props: {
        titulo: "Perguntas frequentes",
        perguntas: [
          { pergunta: "Como faço pra comprar?", resposta: "Monte o pedido e finalize no WhatsApp." },
          { pergunta: "Quais as formas de pagamento?", resposta: "Troque esta resposta pelas suas." },
        ],
      },
    },
    {
      id: "b5",
      tipo: "contato",
      props: { titulo: "Ficou com dúvida?", texto: "Chama que a gente responde.", rotuloBotao: "Chamar no WhatsApp", variante: "limpo" },
      estilo: v.fechamento,
    },
  ];

  if (modelo === "servicos") {
    inicio.splice(1, 0, { id: "b0", tipo: "proximos-horarios", props: { titulo: "Próximos horários" } });
  }
  if (modelo === "atacado") {
    inicio.splice(1, 0, { id: "b0", tipo: "faixa-aviso", props: { texto: "Pedido mínimo R$ 300 · entrega em 48h", tom: v.faixa } });
  }

  // As outras páginas também nascem com conteúdo. Loja nova com catálogo e
  // sacola em branco parece inacabada — e é onde o cliente mais desiste.
  const garantias: BlocoNaPagina = {
    id: "g1",
    tipo: "selos",
    props: {
      titulo: "",
      variante: "fila",
      selos: [
        { icone: "atendimento", titulo: "Dúvida? Chama no zap", texto: "A gente responde rápido." },
        { icone: "qualidade", titulo: "Sua garantia aqui", texto: "Troque por uma promessa sua." },
      ],
    },
    estilo: { ...v.secao, respiro: "m", sangrar: false },
  };

  return {
    inicio,
    catalogo: [
      {
        id: "c1",
        tipo: "faixa-aviso",
        props: { texto: "Escreva aqui a condição da semana · troque este texto", tom: v.faixa, __espaco: "antes" },
      },
      { ...garantias, id: "c2", props: { ...garantias.props, __espaco: "depois" } },
    ],
    oferta: [
      { ...garantias, id: "o0", props: { ...garantias.props, __espaco: "meio" } },
      { id: "o1", tipo: "carrossel-ofertas", props: { titulo: "Veja também", regra: "todas", categoria: "", limite: 8, __espaco: "baixo" } },
    ],
    sacola: [
      { ...garantias, id: "s1", props: { ...garantias.props, __espaco: "antes" } },
      {
        id: "s2",
        tipo: "lista-rapida",
        props: { titulo: "Esqueceu algo?", regra: "todas", categoria: "", limite: 5, esconderNaSacola: true, __espaco: "depois" },
      },
    ],
    confirmacao: [
      {
        id: "f1",
        tipo: "texto",
        props: { titulo: "Recebemos!", corpo: "Confirmamos tudo pelo WhatsApp. Escreva aqui o que acontece depois do pedido.", alinhamento: "centro", __espaco: "depois" },
        estilo: { ...v.abertura, alinhamento: "centro", sangrar: false },
      },
    ],
  };
}

/** Vira slug de URL: sem acento, sem espaço, sem repetir traço. */
export function paraSlug(nome: string): string {
  return (
    nome
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "loja"
  );
}

export function montarLoja({
  nome,
  slug,
  whatsapp,
  modelo,
  estilo: idEstilo = "essencial",
  corMarca,
}: {
  nome: string;
  slug: string;
  whatsapp: string;
  modelo: IdModelo;
  estilo?: IdEstilo;
  /** Sobrepõe a cor do estilo — o lojista escolheu a cor da marca dele. */
  corMarca?: string;
}): Loja {
  const def = MODELOS.find((m) => m.id === modelo) ?? MODELOS[0];
  const e = estilo(idEstilo);
  return {
    slug,
    nome,
    descricao: def.descricao,
    whatsapp,
    aberta: true,
    tema: {
      ...e.tema,
      corMarca: corMarca ?? e.tema.corMarca ?? def.corMarca,
    },
    modulos: MODULOS[modelo],
    paginas: paginas(modelo, e),
    ofertas: EXEMPLOS[modelo].map((o) => ({ ...o })),
    config: CONFIG[modelo],
  };
}
