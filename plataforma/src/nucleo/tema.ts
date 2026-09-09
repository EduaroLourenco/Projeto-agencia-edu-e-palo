import type { Canto, Densidade, EstiloBotao, EscalaTexto, NivelSombra, ParFontes, Tema } from "./tipos";

/**
 * O lojista escolhe as cores. A gente gera as escalas inteiras.
 *
 * A regra que sustenta tudo: ele nunca escolhe "cor do texto do botão" nem
 * "cor da borda". Escolhe a marca e o papel; todo o resto é derivado POR
 * CONTRASTE MEDIDO. É o que permite abrir a personalização sem abrir a porta
 * pra loja ilegível — inclusive papel escuro, que vira modo escuro sozinho.
 */

function hexParaHsl(hex: string): [number, number, number] {
  const limpo = hex.replace("#", "");
  const n = limpo.length === 3 ? limpo.split("").map((c) => c + c).join("") : limpo;
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return [h * 360, s * 100, l * 100];
}

function hslParaRgb(h: number, s: number, l: number): [number, number, number] {
  const S = s / 100;
  const L = l / 100;
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = L - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] :
    h < 120 ? [x, c, 0] :
    h < 180 ? [0, c, x] :
    h < 240 ? [0, x, c] :
    h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}

function luminancia([r, g, b]: [number, number, number]): number {
  const f = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function razao(a: [number, number, number], b: [number, number, number]): number {
  const la = luminancia(a);
  const lb = luminancia(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

function rgbDoHex(hex: string): [number, number, number] {
  const [h, s, l] = hexParaHsl(hex);
  return hslParaRgb(h, s, l);
}

const BRANCO: [number, number, number] = [1, 1, 1];
const PRETO: [number, number, number] = [0.078, 0.071, 0.102];

const hsl = (h: number, s: number, l: number) => `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;

/**
 * A luminosidade que bate o contraste pedido contra uma referência.
 *
 * Afastar-se da referência sempre aumenta o contraste, então em cada lado a
 * função é monótona e a busca binária converge. `paraBaixo` diz de que lado
 * procurar: papel claro pede tinta escura, papel escuro pede tinta clara.
 */
function luzParaContraste(
  h: number,
  s: number,
  alvo: number,
  referencia: [number, number, number],
  paraBaixo: boolean,
  lReferencia: number,
): number {
  let baixo = paraBaixo ? 0 : lReferencia;
  let alto = paraBaixo ? lReferencia : 100;
  for (let i = 0; i < 22; i++) {
    const meio = (baixo + alto) / 2;
    const bate = razao(hslParaRgb(h, s, meio), referencia) >= alvo;
    if (paraBaixo) {
      // Procurando o mais CLARO que ainda bate: se bate, pode subir.
      if (bate) baixo = meio;
      else alto = meio;
    } else {
      if (bate) alto = meio;
      else baixo = meio;
    }
  }
  return paraBaixo ? baixo : alto;
}

/* ============================================================
   O PAPEL

   Antes o papel era branco fixo e os neutros eram constantes no CSS. Agora
   ele é escolha do lojista, e tudo que encosta nele — tintas, bordas,
   superfícies — nasce dele. Papel escuro produz modo escuro sem nenhum
   caminho separado no código.
   ============================================================ */

/** Alvos de contraste de cada neutro contra o papel. */
const TINTAS: { nome: string; alvo: number }[] = [
  { nome: "tinta", alvo: 14 },
  { nome: "tinta-70", alvo: 7.2 },
  { nome: "tinta-45", alvo: 4.6 },
  { nome: "tinta-25", alvo: 2.4 },
  { nome: "tinta-12", alvo: 1.45 },
];

export interface Paleta {
  escuro: boolean;
  papel: string;
  papel2: string;
  papel3: string;
  borda: string;
  bordaForte: string;
  tintas: Record<string, string>;
}

export function paletaDoPapel(hex: string): Paleta {
  const [h, sBruto, l] = hexParaHsl(hex);
  const rgb = hslParaRgb(h, sBruto, l);
  const escuro = luminancia(rgb) < 0.2;

  // Neutro puro em tela lê como "não escolhido". Herdar um resto do matiz do
  // papel é o que dá aquele cinza morno de interface caprichada — mas pouco,
  // senão a tinta fica colorida.
  const sTinta = Math.min(14, sBruto * 0.5);
  const sSuperficie = Math.min(20, sBruto * 0.75);

  const tintas: Record<string, string> = {};
  for (const t of TINTAS) {
    tintas[t.nome] = hsl(h, sTinta, luzParaContraste(h, sTinta, t.alvo, rgb, !escuro, l));
  }

  // Superfícies vizinhas: um degrau e dois degraus na direção do contraste.
  // No escuro elas clareiam, no claro elas escurecem — em ambos, a hierarquia
  // "papel < papel-2 < papel-3" continua de pé.
  const passo = (delta: number) => {
    const alvo = escuro ? l + delta : l - delta;
    return hsl(h, sSuperficie, Math.min(98, Math.max(3, alvo)));
  };

  return {
    escuro,
    papel: hsl(h, sSuperficie * 0.7, l),
    papel2: passo(escuro ? 5 : 3),
    papel3: passo(escuro ? 10 : 7),
    borda: hsl(h, sSuperficie, Math.min(98, Math.max(3, escuro ? l + 13 : l - 9))),
    bordaForte: hsl(h, sSuperficie, Math.min(98, Math.max(3, escuro ? l + 24 : l - 20))),
    tintas,
  };
}

/* ============================================================
   A ESCALA DA MARCA

   A primeira versão fixava a luminosidade de cada degrau — 600 = 44% de
   lightness, sempre. Estava errado: o olho não lê HSL. Verde a 44% é bem
   mais claro que violeta a 44%, então a mesma regra dava 2,7 de contraste
   no verde e 8,7 no violeta.

   Agora todo degrau que carrega texto ou serve de fundo de botão é resolvido
   POR CONTRASTE contra o papel de verdade da loja — que agora pode ser
   escuro, e aí a escala inteira inverte de direção sozinha.
   ============================================================ */

const DEGRAUS: { nome: string; desvio?: number; contraste?: number; sMult: number }[] = [
  { nome: "50", desvio: 2.5, sMult: 0.45 },
  { nome: "100", desvio: 6, sMult: 0.6 },
  { nome: "200", desvio: 13, sMult: 0.75 },
  { nome: "300", desvio: 24, sMult: 0.9 },
  { nome: "400", contraste: 2.2, sMult: 1 },
  { nome: "600", contraste: 4.6, sMult: 1 },
  { nome: "700", contraste: 7.2, sMult: 0.95 },
  { nome: "800", contraste: 10.5, sMult: 0.9 },
  { nome: "900", contraste: 14, sMult: 0.85 },
];

/**
 * A SUPERFÍCIE DA MARCA — o fundo do botão principal.
 *
 * Aqui forçar contraste contra o papel seria errado nas duas pontas: um alvo
 * baixo obriga texto escuro até no azul, e um alvo alto transforma amarelo em
 * marrom. Some a marca nos dois casos.
 *
 * A regra é outra: parte da luminosidade que a pessoa escolheu, e só se afasta
 * dela se o melhor texto possível (branco ou preto) não chegar a 4,5.
 */
function superficieDaMarca(h: number, s: number, lEscolhida: number) {
  const melhorTexto = (l: number) => {
    const fundo = hslParaRgb(h, s, l);
    const comBranco = razao(fundo, BRANCO);
    const comPreto = razao(fundo, PRETO);
    return comBranco >= comPreto
      ? { cor: "#ffffff", contraste: comBranco, escurecer: true }
      : { cor: "#14121a", contraste: comPreto, escurecer: false };
  };

  const partida = Math.min(72, Math.max(30, lEscolhida));

  // Preferência por texto branco quando ele está por perto.
  //
  // Sem isto, um rosa de 56% de luminosidade ganha texto escuro — passa no
  // contraste, mas rosa com preto não é a cara de marca nenhuma. Amarelo
  // precisaria de 30+ pontos e viraria marrom: aí o texto escuro fica.
  for (let d = 0; d <= 14; d++) {
    const l = partida - d;
    if (l < 12) break;
    if (razao(hslParaRgb(h, s, l), BRANCO) >= 4.5) {
      return { l, texto: "#ffffff", contraste: razao(hslParaRgb(h, s, l), BRANCO) };
    }
  }

  let l = partida;
  let escolha = melhorTexto(l);
  for (let i = 0; i < 70 && escolha.contraste < 4.5; i++) {
    l += escolha.escurecer ? -1 : 1;
    if (l < 6 || l > 96) break;
    escolha = melhorTexto(l);
  }

  return { l, texto: escolha.cor, contraste: escolha.contraste };
}

function satDe(s: number, mult: number) {
  return Math.min(100, Math.max(8, s * mult));
}

export function escalaDaMarca(hex: string, papelHex = "#ffffff"): Record<string, string> {
  const [h, s] = hexParaHsl(hex);
  const l = hexParaHsl(hex)[2];
  const [hP, sP, lP] = hexParaHsl(papelHex);
  const papelRgb = hslParaRgb(hP, sP, lP);
  const escuro = luminancia(papelRgb) < 0.2;

  const out: Record<string, string> = {};
  for (const d of DEGRAUS) {
    const sat = satDe(s, d.sMult);
    // Os tons claros (50–300) são "quase papel com um toque da marca": eles
    // acompanham o papel em vez de serem claros no absoluto, senão viram
    // manchas brancas numa loja escura.
    const luz =
      d.contraste !== undefined
        ? luzParaContraste(h, sat, d.contraste, papelRgb, !escuro, lP)
        : Math.min(98, Math.max(3, escuro ? lP + d.desvio! : lP - d.desvio!));
    out[d.nome] = hsl(h, sat, luz);
  }

  const sup = superficieDaMarca(h, satDe(s, 1), l);
  out["500"] = hsl(h, satDe(s, 1), sup.l);

  // Barra de progresso, pontinho de carrossel, traço fino: são gráfico, não
  // texto, e precisam de 3:1 contra o papel. A superfície da marca pode ser
  // amarela e não bater isso — então esse tom é resolvido em separado.
  out["grafico"] = hsl(h, satDe(s, 1), luzParaContraste(h, satDe(s, 1), 3.1, papelRgb, !escuro, lP));
  return out;
}

/** Só pra conferência: o contraste real de cada degrau contra o papel. */
export function conferirEscala(hex: string, papelHex = "#ffffff"): Record<string, number> {
  const escala = escalaDaMarca(hex, papelHex);
  const papelRgb = rgbDoHex(papelHex);
  const out: Record<string, number> = {};
  for (const [nome, cor] of Object.entries(escala)) {
    const m = cor.match(/hsl\(([\d.]+) ([\d.]+)% ([\d.]+)%\)/);
    if (!m) continue;
    out[nome] = razao(hslParaRgb(+m[1], +m[2], +m[3]), papelRgb);
  }
  const [h, s, l] = hexParaHsl(hex);
  out["textoNoBotao"] = superficieDaMarca(h, satDe(s, 1), l).contraste;
  return out;
}

/**
 * O texto que vai POR CIMA do botão.
 *
 * Media contra o hex cru antes — mas o fundo do botão é o `marca-500`
 * derivado, que pode ser bem diferente da cor escolhida. Agora compara
 * contra o fundo real e devolve o candidato com mais contraste.
 */
export function textoSobreMarca(hex: string): string {
  const [h, s, l] = hexParaHsl(hex);
  return superficieDaMarca(h, satDe(s, 1), l).texto;
}

/**
 * O texto que vai por cima de QUALQUER fundo — usado pelo estilo de bloco,
 * onde o lojista pode pintar a seção da cor que quiser.
 */
export function textoSobre(hex: string): string {
  const rgb = rgbDoHex(hex);
  return razao(rgb, BRANCO) >= razao(rgb, PRETO) ? "#ffffff" : "#14121a";
}

/** Contraste entre duas cores em hex. Usado pelos avisos do estúdio. */
export function contrasteEntre(a: string, b: string): number {
  return razao(rgbDoHex(a), rgbDoHex(b));
}

/* ============================================================
   OS OUTROS EIXOS
   ============================================================ */

const DENSIDADE: Record<Densidade, { gap: string; padY: string; linha: string; cartao: string }> = {
  confortavel: { gap: "1.25rem", padY: "1.15rem", linha: "1.7", cartao: "1.15rem" },
  media: { gap: "0.9rem", padY: "0.85rem", linha: "1.6", cartao: "0.9rem" },
  compacta: { gap: "0.6rem", padY: "0.6rem", linha: "1.5", cartao: "0.7rem" },
};

const CANTO: Record<Canto, { p: string; m: string; g: string }> = {
  reto: { p: "2px", m: "4px", g: "6px" },
  suave: { p: "8px", m: "12px", g: "18px" },
  redondo: { p: "14px", m: "20px", g: "28px" },
  pilula: { p: "999px", m: "999px", g: "26px" },
};

const SOMBRA: Record<NivelSombra, { s1: string; s2: string; s3: string }> = {
  plana: { s1: "none", s2: "none", s3: "0 1px 0 rgba(0,0,0,0.06)" },
  suave: {
    s1: "0 1px 2px rgba(22, 19, 15, 0.04)",
    s2: "0 1px 3px rgba(22, 19, 15, 0.05), 0 6px 16px -8px rgba(22, 19, 15, 0.12)",
    s3: "0 2px 6px rgba(22, 19, 15, 0.06), 0 18px 40px -16px rgba(22, 19, 15, 0.22)",
  },
  elevada: {
    s1: "0 1px 3px rgba(22, 19, 15, 0.08)",
    s2: "0 2px 6px rgba(22, 19, 15, 0.10), 0 12px 26px -10px rgba(22, 19, 15, 0.22)",
    s3: "0 4px 12px rgba(22, 19, 15, 0.12), 0 28px 60px -20px rgba(22, 19, 15, 0.34)",
  },
};

/** Corpo base de cada papel tipográfico, em px. A escala multiplica tudo. */
const TIPOS: Record<string, number> = {
  micro: 10.5,
  mini: 12,
  menor: 13,
  corpo: 14.5,
  medio: 16,
  titulo: 19,
  secao: 23,
  display: 30,
};

const ESCALA_TEXTO: Record<EscalaTexto, number> = {
  pequeno: 0.94,
  normal: 1,
  grande: 1.09,
};

/** `googleFonts` não é lido em runtime: é a receita que scripts/fontes.py usa
 *  pra baixar os arquivos que ficam em src/fontes. */
export const PARES_DE_FONTE: Record<ParFontes, { nome: string; display: string; corpo: string; googleFonts: string }> = {
  "sora-inter": {
    nome: "Sora + Inter",
    display: '"Sora", ui-sans-serif, system-ui, sans-serif',
    corpo: '"Inter", ui-sans-serif, system-ui, sans-serif',
    googleFonts: "Sora:wght@500;600;700;800",
  },
  "fraunces-inter": {
    nome: "Fraunces + Inter",
    display: '"Fraunces", ui-serif, Georgia, serif',
    corpo: '"Inter", ui-sans-serif, system-ui, sans-serif',
    googleFonts: "Fraunces:opsz,wght@9..144,500;9..144,700",
  },
  "archivo-inter": {
    nome: "Archivo + Inter",
    display: '"Archivo", ui-sans-serif, system-ui, sans-serif',
    corpo: '"Inter", ui-sans-serif, system-ui, sans-serif',
    googleFonts: "Archivo:wght@600;700;800",
  },
  "instrument-inter": {
    nome: "Instrument + Inter",
    display: '"Instrument Sans", ui-sans-serif, system-ui, sans-serif',
    corpo: '"Inter", ui-sans-serif, system-ui, sans-serif',
    googleFonts: "Instrument+Sans:wght@500;600;700",
  },
};

export const PAPEIS_SUGERIDOS = [
  "#ffffff", "#faf8f5", "#f6f4ef", "#f4f6f5", "#f5f4f8",
  "#1c1a17", "#16171c", "#1a1720", "#14181a", "#211c1a",
];

export const CORES_SUGERIDAS = [
  "#1f7a4d", "#0f6fae", "#4b3a8f", "#7b4bd8", "#e0356f",
  "#c2410c", "#a16207", "#15803d", "#0e7490", "#be123c",
];

/** Valores que uma loja antiga (salva antes destes eixos existirem) assume. */
export const TEMA_PADRAO: Omit<Tema, "corMarca" | "densidade" | "canto" | "fontes"> = {
  corPapel: "#ffffff",
  estiloBotao: "solido",
  sombra: "suave",
  escalaTexto: "normal",
};

export function temaCompleto(tema: Tema): Required<Tema> {
  return { ...TEMA_PADRAO, ...tema } as Required<Tema>;
}

/**
 * Só a marca, sem o papel.
 *
 * É o que o estúdio pinta no documento: os controles dele acompanham a cor
 * da loja (a moldura de seleção, o interruptor), mas o papel do editor
 * continua neutro mesmo quando a loja é escura.
 */
export function aplicarMarca(el: HTMLElement, temaCru: Tema) {
  const tema = temaCompleto(temaCru);
  const escala = escalaDaMarca(tema.corMarca, "#ffffff");
  for (const [degrau, cor] of Object.entries(escala)) {
    el.style.setProperty(`--marca-${degrau}`, cor);
  }
  el.style.setProperty("--marca", tema.corMarca);
  el.style.setProperty("--sobre-marca", textoSobreMarca(tema.corMarca));
}

/**
 * Escreve o tema como custom properties no elemento dado.
 *
 * Recebe um elemento e não o `document` de propósito: no estúdio a loja é
 * uma prévia dentro de uma página que tem interface própria. Pintar o
 * documento inteiro deixava o editor escuro junto com a loja escura.
 */
export function aplicarTema(el: HTMLElement, temaCru: Tema) {
  const tema = temaCompleto(temaCru);
  const paleta = paletaDoPapel(tema.corPapel);

  const escala = escalaDaMarca(tema.corMarca, tema.corPapel);
  for (const [degrau, cor] of Object.entries(escala)) {
    el.style.setProperty(`--marca-${degrau}`, cor);
  }
  el.style.setProperty("--marca", tema.corMarca);
  el.style.setProperty("--sobre-marca", textoSobreMarca(tema.corMarca));

  el.style.setProperty("--color-papel", paleta.papel);
  el.style.setProperty("--color-papel-2", paleta.papel2);
  el.style.setProperty("--color-papel-3", paleta.papel3);
  el.style.setProperty("--color-borda", paleta.borda);
  el.style.setProperty("--color-borda-forte", paleta.bordaForte);
  for (const [nome, cor] of Object.entries(paleta.tintas)) {
    el.style.setProperty(`--color-${nome}`, cor);
  }
  el.style.setProperty("--papel-escuro", paleta.escuro ? "1" : "0");

  /**
   * A cor herdada tem que sair daqui também.
   *
   * Quem não declara cor — título, nome de produto — herda do `body`, e o
   * `body` está fora deste contêiner: ele resolveu `var(--color-tinta)` com
   * o valor antigo. Sem esta linha, uma loja de papel escuro ficava com os
   * títulos pretos no preto.
   */
  el.style.color = paleta.tintas.tinta;

  const d = DENSIDADE[tema.densidade];
  el.style.setProperty("--gap", d.gap);
  el.style.setProperty("--pad-y", d.padY);
  el.style.setProperty("--altura-linha", d.linha);
  el.style.setProperty("--pad-cartao", d.cartao);

  const c = CANTO[tema.canto] ?? CANTO.suave;
  el.style.setProperty("--canto-p", c.p);
  el.style.setProperty("--canto-m", c.m);
  el.style.setProperty("--canto-g", c.g);

  const s = SOMBRA[tema.sombra] ?? SOMBRA.suave;
  el.style.setProperty("--sombra-1", s.s1);
  el.style.setProperty("--sombra-2", s.s2);
  el.style.setProperty("--sombra-3", s.s3);

  const mult = ESCALA_TEXTO[tema.escalaTexto] ?? 1;
  for (const [nome, px] of Object.entries(TIPOS)) {
    el.style.setProperty(`--t-${nome}`, `${(px * mult).toFixed(2)}px`);
  }

  /**
   * O botão principal em três roupas.
   *
   * Sai como variável e não como classe porque o botão é primitivo: quem
   * decide a aparência é o tema, e nenhum componente precisa saber disso.
   * Contorno e suave usam degraus já resolvidos por contraste, então
   * continuam legíveis em papel claro e escuro.
   */
  const roupas: Record<EstiloBotao, [string, string, string]> = {
    solido: [escala["500"], textoSobreMarca(tema.corMarca), "transparent"],
    contorno: ["transparent", escala["700"], escala["500"]],
    suave: [escala["100"], escala["800"], "transparent"],
  };
  const [bf, bt, bb] = roupas[tema.estiloBotao] ?? roupas.solido;
  el.style.setProperty("--botao-fundo", bf);
  el.style.setProperty("--botao-texto", bt);
  el.style.setProperty("--botao-borda", bb);

  const f = PARES_DE_FONTE[tema.fontes];
  el.style.setProperty("--fonte-display", f.display);
  el.style.setProperty("--fonte-corpo", f.corpo);
}

/**
 * As fontes vêm com o pacote (src/fontes.css), então não há nada pra buscar.
 *
 * A função continua existindo porque a Vitrine chama ela sempre que o tema
 * muda — e um dia pode voltar a ter trabalho, se o lojista puder subir a
 * fonte da marca dele.
 */
export function garantirFontes(_par: ParFontes) {}
