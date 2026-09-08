import type { Canto, Densidade, ParFontes, Tema } from "./tipos";

/**
 * O lojista escolhe UMA cor. A gente gera a escala inteira.
 *
 * É a decisão que garante contraste em todo lugar: ele nunca escolhe "cor do
 * texto do botão", então nunca sai texto cinza-claro em fundo bege. Ver a
 * seção "Limitar pra ficar bonito" da proposta.
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

/* ============================================================
   A ESCALA

   A primeira versão fixava a luminosidade de cada degrau — 600 = 44% de
   lightness, sempre. Estava errado: o olho não lê HSL. Verde a 44% é bem
   mais claro que violeta a 44%, então a mesma regra dava 2,7 de contraste
   no verde e 8,7 no violeta. Cinco de oito cores testadas reprovavam.

   Agora todo degrau que carrega texto ou serve de fundo de botão é resolvido
   POR CONTRASTE: busca binária na luminosidade até bater a razão alvo contra
   o papel. Funciona pra qualquer matiz, inclusive amarelo.
   ============================================================ */

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

const PAPEL: [number, number, number] = [1, 1, 1];
const TINTA: [number, number, number] = [0.078, 0.071, 0.102];

/**
 * A luminosidade que faz esta matiz bater o contraste pedido contra o papel.
 * Escurecer sempre aumenta o contraste, então a função é monótona e 20 passos
 * de busca binária chegam mais perto do que a tela consegue mostrar.
 */
function luminosidadeParaContraste(h: number, s: number, alvo: number): number {
  let baixo = 0;
  let alto = 100;
  for (let i = 0; i < 20; i++) {
    const meio = (baixo + alto) / 2;
    if (razao(hslParaRgb(h, s, meio), PAPEL) >= alvo) baixo = meio;
    else alto = meio;
  }
  return baixo;
}

/**
 * Quem tem `contraste` é resolvido por busca — são os tons que carregam
 * TEXTO em cima do papel. Quem tem `l` é tinta clara, que só serve de fundo.
 *
 * O 500 não está aqui: ele é a superfície da marca (fundo de botão) e segue
 * outra regra, logo abaixo.
 */
const DEGRAUS: { nome: string; l?: number; contraste?: number; sMult: number }[] = [
  { nome: "50", l: 97.5, sMult: 0.45 },
  { nome: "100", l: 94, sMult: 0.6 },
  { nome: "200", l: 87, sMult: 0.75 },
  { nome: "300", l: 76, sMult: 0.9 },
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
 * dela se o melhor texto possível (branco ou tinta) não chegar a 4,5. Amarelo
 * continua amarelo, com texto escuro; azul escurece o suficiente pro branco.
 */
function superficieDaMarca(h: number, s: number, lEscolhida: number) {
  const melhorTexto = (l: number) => {
    const fundo = hslParaRgb(h, s, l);
    const comBranco = razao(fundo, PAPEL);
    const comTinta = razao(fundo, TINTA);
    return comBranco >= comTinta
      ? { cor: "#ffffff", contraste: comBranco, escurecer: true }
      : { cor: "#14121a", contraste: comTinta, escurecer: false };
  };

  const partida = Math.min(72, Math.max(30, lEscolhida));

  // Preferência por texto branco quando ele está por perto.
  //
  // Sem isto, um rosa de 56% de luminosidade ganha texto escuro — passa no
  // contraste, mas rosa com preto não é a cara de marca nenhuma. Escurecer
  // até 14 pontos costuma bastar pra liberar o branco em rosa, vermelho e
  // laranja. Amarelo precisaria de 30+ e vira marrom: nesse caso o branco
  // não vale o preço, e o texto escuro fica.
  for (let d = 0; d <= 14; d++) {
    const l = partida - d;
    if (l < 12) break;
    const contraste = razao(hslParaRgb(h, s, l), PAPEL);
    if (contraste >= 4.5) return { l, texto: "#ffffff", contraste };
  }

  let l = partida;
  let escolha = melhorTexto(l);
  // Anda 1% por vez na direção que aumenta o contraste do texto vencedor.
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

function luzDe(h: number, s: number, d: (typeof DEGRAUS)[number]) {
  return d.contraste !== undefined ? luminosidadeParaContraste(h, s, d.contraste) : d.l!;
}

export function escalaDaMarca(hex: string): Record<string, string> {
  const [h, s, l] = hexParaHsl(hex);
  const out: Record<string, string> = {};
  for (const d of DEGRAUS) {
    const sat = satDe(s, d.sMult);
    out[d.nome] = `hsl(${h.toFixed(1)} ${sat.toFixed(1)}% ${luzDe(h, sat, d).toFixed(1)}%)`;
  }
  const sup = superficieDaMarca(h, satDe(s, 1), l);
  out["500"] = `hsl(${h.toFixed(1)} ${satDe(s, 1).toFixed(1)}% ${sup.l.toFixed(1)}%)`;

  // Barra de progresso, pontinho de carrossel, traço fino: são gráfico, não
  // texto, e precisam de 3:1 contra o papel. A superfície da marca pode ser
  // amarela e não bater isso — então esse tom é resolvido em separado.
  out["grafico"] = `hsl(${h.toFixed(1)} ${satDe(s, 1).toFixed(1)}% ${luminosidadeParaContraste(h, satDe(s, 1), 3.1).toFixed(1)}%)`;
  return out;
}

/** Só pra conferência: o contraste real de cada degrau contra o papel. */
export function conferirEscala(hex: string): Record<string, number> {
  const [h, s, l] = hexParaHsl(hex);
  const out: Record<string, number> = {};
  for (const d of DEGRAUS) {
    const sat = satDe(s, d.sMult);
    out[d.nome] = razao(hslParaRgb(h, sat, luzDe(h, sat, d)), PAPEL);
  }
  const sup = superficieDaMarca(h, satDe(s, 1), l);
  out["500"] = razao(hslParaRgb(h, satDe(s, 1), sup.l), PAPEL);
  out["textoNoBotao"] = sup.contraste;
  out["grafico"] = razao(hslParaRgb(h, satDe(s, 1), luminosidadeParaContraste(h, satDe(s, 1), 3.1)), PAPEL);
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

const DENSIDADE: Record<Densidade, { gap: string; padY: string; linha: string; cartao: string }> = {
  confortavel: { gap: "1.25rem", padY: "1.15rem", linha: "1.7", cartao: "1.15rem" },
  media: { gap: "0.9rem", padY: "0.85rem", linha: "1.6", cartao: "0.9rem" },
  compacta: { gap: "0.6rem", padY: "0.6rem", linha: "1.5", cartao: "0.7rem" },
};

const CANTO: Record<Canto, { p: string; m: string; g: string }> = {
  reto: { p: "2px", m: "4px", g: "6px" },
  suave: { p: "8px", m: "12px", g: "18px" },
  redondo: { p: "14px", m: "20px", g: "28px" },
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

/** Escreve o tema como custom properties no elemento dado. */
export function aplicarTema(el: HTMLElement, tema: Tema) {
  const escala = escalaDaMarca(tema.corMarca);
  for (const [degrau, cor] of Object.entries(escala)) {
    el.style.setProperty(`--marca-${degrau}`, cor);
  }
  el.style.setProperty("--marca", tema.corMarca);
  el.style.setProperty("--sobre-marca", textoSobreMarca(tema.corMarca));

  const d = DENSIDADE[tema.densidade];
  el.style.setProperty("--gap", d.gap);
  el.style.setProperty("--pad-y", d.padY);
  el.style.setProperty("--altura-linha", d.linha);
  el.style.setProperty("--pad-cartao", d.cartao);

  const c = CANTO[tema.canto];
  el.style.setProperty("--canto-p", c.p);
  el.style.setProperty("--canto-m", c.m);
  el.style.setProperty("--canto-g", c.g);

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
