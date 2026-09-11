import type { CSSProperties } from "react";
import type { EstiloBloco } from "../nucleo/tipos";
import { textoSobre } from "../nucleo/tema";

/**
 * Traduz o estilo escolhido pelo lojista em CSS.
 *
 * O que ele escolhe é o FUNDO. A cor do texto não é oferecida: ela sai daqui
 * já resolvida contra o fundo. Foi a única forma de abrir "pinta a seção da
 * cor que quiser" sem abrir também "texto cinza-claro em fundo bege".
 *
 * Fundos que vêm do tema (marca, papel, escuro) não precisam de conta: os
 * degraus já foram resolvidos por contraste em `tema.ts`, e o texto por cima
 * deles é conhecido. Só o "própria" — cor livre — é medido na hora.
 */

export const RESPIRO: Record<string, string> = {
  nenhum: "0px",
  p: "0.75rem",
  m: "1.15rem",
  g: "1.75rem",
};

const CANTOS: Record<string, string> = {
  reto: "2px",
  suave: "14px",
  redondo: "24px",
};

const SOMBRAS: Record<string, string> = {
  nenhuma: "none",
  leve: "var(--sombra-1)",
  media: "var(--sombra-2)",
};

export const ESPACO_DEPOIS: Record<string, string> = {
  nenhum: "0px",
  normal: "0px",
  grande: "1.5rem",
};

/**
 * A margem que os carrosséis de dentro usam pra sangrar.
 *
 * `sangra` vaza até a borda da PÁGINA. Dentro de uma seção pintada isso está
 * errado: o carrossel tem que vazar até a borda da SEÇÃO. Reescrever
 * `--pad-pagina` no invólucro resolve os dois casos com a mesma regra.
 */
type ComVariavel = CSSProperties & Record<`--${string}`, string | undefined>;

/**
 * Quando a seção pinta o fundo, a escala de tinta inteira tem que mudar.
 *
 * `color` sozinho só resolve o texto que herda. Título, resumo, preço e
 * rótulo usam degraus (`text-tinta-70`, `text-tinta-45`) que apontam pra
 * escala do PAPEL — e num fundo azul eles continuavam cinza-escuro, isto é,
 * ilegíveis. Aqui a escala é redesenhada por transparência sobre a cor do
 * texto da seção, que já foi resolvida por contraste contra o fundo.
 */
function escalaSobre(cor: string): Record<string, string> {
  const mistura = (pct: number) => `color-mix(in oklab, ${cor} ${pct}%, transparent)`;
  return {
    "--color-tinta": cor,
    "--color-tinta-70": mistura(80),
    "--color-tinta-45": mistura(62),
    "--color-tinta-25": mistura(40),
    "--color-tinta-12": mistura(22),
    "--color-borda": mistura(20),
    "--color-borda-forte": mistura(34),
  };
}

export interface Vestido {
  /** Fundo, respiro e moldura. Vai no invólucro de fora. */
  estilo: CSSProperties;
  /**
   * Só a nova unidade de sangria, num invólucro de dentro.
   *
   * Tem que ser um segundo elemento: uma propriedade escrita no mesmo
   * elemento vale também pras declarações DELE, e aí a margem negativa da
   * própria seção passava a usar o valor novo — a seção parava de sangrar.
   */
  interno: CSSProperties;
  /** True quando o bloco pinta o próprio fundo — muda o respiro padrão. */
  pintado: boolean;
  sangra: boolean;
}

export function vestirBloco(e: EstiloBloco | undefined): Vestido | null {
  if (!e) return null;

  const fundo = e.fundo ?? "nenhum";
  const pintado = fundo !== "nenhum";
  const estilo: ComVariavel = {};

  switch (fundo) {
    case "papel":
      estilo.background = "var(--color-papel)";
      break;
    case "suave":
      estilo.background = "var(--color-papel-3)";
      break;
    case "marca-suave":
      estilo.background = "var(--marca-50)";
      estilo.color = "var(--marca-900)";
      Object.assign(estilo, escalaSobre("var(--marca-900)"));
      break;
    case "marca":
      estilo.background = "var(--marca-500)";
      estilo.color = "var(--sobre-marca)";
      Object.assign(estilo, escalaSobre("var(--sobre-marca)"));
      break;
    case "escuro":
      // A cor de fundo é lida ANTES de a escala ser reescrita: dentro do
      // mesmo elemento a propriedade nova já vale, e o fundo viraria a cor
      // do próprio texto.
      estilo.background = "var(--papel-tinta, var(--color-tinta))";
      estilo.color = "var(--color-papel)";
      Object.assign(estilo, escalaSobre("var(--color-papel)"));
      break;
    case "propria": {
      const cor = e.corFundo || "#ffffff";
      estilo.background = cor;
      const texto = textoSobre(cor);
      estilo.color = texto;
      Object.assign(estilo, escalaSobre(texto));
      break;
    }
  }

  // Bloco pintado sem respiro fica com o texto colado na borda da cor. Então
  // o padrão de quem pinta é médio, e o de quem não pinta é nenhum.
  const interno: ComVariavel = {};

  const respiro = e.respiro ?? (pintado ? "m" : "nenhum");
  if (respiro !== "nenhum") {
    estilo.padding = RESPIRO[respiro];
    interno["--pad-pagina"] = RESPIRO[respiro];
  }

  if (e.canto && e.canto !== "herdar") estilo.borderRadius = CANTOS[e.canto];
  else if (pintado) estilo.borderRadius = "var(--canto-g)";

  if (e.borda) {
    estilo.border = "1px solid var(--color-borda)";
  }

  if (e.sombra && e.sombra !== "nenhuma") estilo.boxShadow = SOMBRAS[e.sombra];

  if (e.alinhamento === "centro") estilo.textAlign = "center";

  const sangra = Boolean(e.sangrar);
  if (sangra) {
    estilo.marginInline = "calc(var(--pad-pagina) * -1)";
    const lateral = `calc(${RESPIRO[respiro] ?? "0px"} + var(--pad-pagina))`;
    estilo.paddingInline = lateral;
    interno["--pad-pagina"] = lateral;
    // Sangrando, o canto arredondado deixa duas fatias do papel aparecendo
    // nas pontas. Só faz sentido quadrado.
    estilo.borderRadius = "0";
  }

  if (e.espacoDepois && e.espacoDepois !== "nenhum") {
    estilo.marginBottom = ESPACO_DEPOIS[e.espacoDepois];
  }

  return { estilo, interno, pintado, sangra };
}

/** Os campos que o estúdio desenha na aba "Estilo". Comum a todo bloco. */
export const CAMPOS_ESTILO = {
  fundo: {
    tipo: "escolha" as const,
    rotulo: "Fundo da seção",
    padrao: "nenhum",
    opcoes: [
      { valor: "nenhum", nome: "Nenhum" },
      { valor: "papel", nome: "Papel" },
      { valor: "suave", nome: "Suave" },
      { valor: "marca-suave", nome: "Marca clara" },
      { valor: "marca", nome: "Marca" },
      { valor: "escuro", nome: "Escuro" },
      { valor: "propria", nome: "Escolher cor" },
    ],
  },
  corFundo: { tipo: "cor" as const, rotulo: "A cor", padrao: "#f2f0eb" },
  respiro: {
    tipo: "escolha" as const,
    rotulo: "Respiro interno",
    padrao: "nenhum",
    opcoes: [
      { valor: "nenhum", nome: "Nenhum" },
      { valor: "p", nome: "Pouco" },
      { valor: "m", nome: "Médio" },
      { valor: "g", nome: "Muito" },
    ],
  },
  canto: {
    tipo: "escolha" as const,
    rotulo: "Cantos",
    padrao: "herdar",
    opcoes: [
      { valor: "herdar", nome: "Do tema" },
      { valor: "reto", nome: "Reto" },
      { valor: "suave", nome: "Suave" },
      { valor: "redondo", nome: "Redondo" },
    ],
  },
  sombra: {
    tipo: "escolha" as const,
    rotulo: "Sombra",
    padrao: "nenhuma",
    opcoes: [
      { valor: "nenhuma", nome: "Nenhuma" },
      { valor: "leve", nome: "Leve" },
      { valor: "media", nome: "Média" },
    ],
  },
  borda: { tipo: "simNao" as const, rotulo: "Contorno fino", padrao: false },
  sangrar: {
    tipo: "simNao" as const,
    rotulo: "Ocupar a largura toda",
    padrao: false,
    dica: "A seção encosta nas bordas da tela, sem margem.",
  },
  alinhamento: {
    tipo: "escolha" as const,
    rotulo: "Alinhamento",
    padrao: "esquerda",
    opcoes: [
      { valor: "esquerda", nome: "Esquerda" },
      { valor: "centro", nome: "Centro" },
    ],
  },
  espacoDepois: {
    tipo: "escolha" as const,
    rotulo: "Espaço depois",
    padrao: "nenhum",
    opcoes: [
      { valor: "nenhum", nome: "Normal" },
      { valor: "grande", nome: "Grande" },
    ],
  },
};
