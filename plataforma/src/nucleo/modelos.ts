import type { Loja, Oferta, TipoPagina, BlocoNaPagina } from "./tipos";

/**
 * De onde nasce uma loja nova.
 *
 * Três modelos, não um em branco: loja vazia é a tela mais desanimadora que
 * existe, e o lojista não sabe o que fazer com ela. Cada modelo já vem com
 * as páginas montadas, os recursos certos ligados e três itens de exemplo —
 * marcados como exemplo, pra ele trocar em vez de inventar do zero.
 */

export type IdModelo = "produtos" | "servicos" | "atacado";

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
];

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
};

const MODULOS: Record<IdModelo, string[]> = {
  produtos: ["variantes", "entrega", "pagamento"],
  servicos: ["agendamento", "pagamento"],
  atacado: ["b2b", "entrega", "pagamento"],
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
};

function paginas(modelo: IdModelo): Record<TipoPagina, BlocoNaPagina[]> {
  const comum: BlocoNaPagina[] = [
    { id: "p1", tipo: "faixa-categorias", props: { titulo: "", estilo: "pilulas" } },
  ];

  const inicio: BlocoNaPagina[] = [
    {
      id: "b1",
      tipo: "texto",
      props: {
        titulo: "Bem-vindo à sua loja nova",
        corpo: "Toque em qualquer bloco pra editar. Use o + pra adicionar seções e a paleta pra trocar as cores.",
        alinhamento: "centro",
      },
      estilo: { fundo: "marca-suave", respiro: "g", canto: "redondo", alinhamento: "centro" },
    },
    ...comum,
    {
      id: "b2",
      tipo: modelo === "atacado" ? "lista-rapida" : "grade-ofertas",
      props:
        modelo === "atacado"
          ? { titulo: "Mais pedidos", regra: "todas", categoria: "", limite: 8 }
          : { titulo: modelo === "servicos" ? "Nossos serviços" : "Destaques", regra: "todas", categoria: "", limite: 6, colunas: "2" },
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
      estilo: { fundo: "suave", respiro: "g", sangrar: true },
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
      estilo: { fundo: "escuro", respiro: "g", sangrar: true },
    },
  ];

  if (modelo === "servicos") {
    inicio.splice(1, 0, { id: "b0", tipo: "proximos-horarios", props: { titulo: "Próximos horários" } });
  }
  if (modelo === "atacado") {
    inicio.splice(1, 0, { id: "b0", tipo: "faixa-aviso", props: { texto: "Pedido mínimo R$ 300 · entrega em 48h", tom: "marca" } });
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
    estilo: { fundo: "suave", respiro: "m" },
  };

  return {
    inicio,
    catalogo: [
      {
        id: "c1",
        tipo: "faixa-aviso",
        props: { texto: "Escreva aqui a condição da semana · troque este texto", tom: "claro", __espaco: "antes" },
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
        estilo: { fundo: "marca-suave", respiro: "g", alinhamento: "centro", canto: "redondo" },
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
}: {
  nome: string;
  slug: string;
  whatsapp: string;
  modelo: IdModelo;
}): Loja {
  const def = MODELOS.find((m) => m.id === modelo) ?? MODELOS[0];
  return {
    slug,
    nome,
    descricao: def.descricao,
    whatsapp,
    aberta: true,
    tema: {
      corMarca: def.corMarca,
      corPapel: "#ffffff",
      densidade: "media",
      canto: "suave",
      fontes: "sora-inter",
      estiloBotao: "solido",
      sombra: "suave",
      escalaTexto: "normal",
    },
    modulos: MODULOS[modelo],
    paginas: paginas(modelo),
    ofertas: EXEMPLOS[modelo].map((o) => ({ ...o })),
    config: CONFIG[modelo],
  };
}
