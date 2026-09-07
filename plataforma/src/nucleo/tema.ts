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

/** Luminosidade alvo de cada degrau. A saturação cai nas pontas pra não berrar. */
const DEGRAUS: { nome: string; l: number; sMult: number }[] = [
  { nome: "50", l: 97, sMult: 0.5 },
  { nome: "100", l: 93, sMult: 0.7 },
  { nome: "200", l: 85, sMult: 0.85 },
  { nome: "300", l: 74, sMult: 0.95 },
  { nome: "400", l: 62, sMult: 1 },
  { nome: "500", l: 52, sMult: 1 },
  { nome: "600", l: 44, sMult: 1 },
  { nome: "700", l: 36, sMult: 0.95 },
  { nome: "800", l: 28, sMult: 0.9 },
  { nome: "900", l: 20, sMult: 0.8 },
];

export function escalaDaMarca(hex: string): Record<string, string> {
  const [h, s] = hexParaHsl(hex);
  const out: Record<string, string> = {};
  for (const d of DEGRAUS) {
    const sat = Math.min(100, Math.max(8, s * d.sMult));
    out[d.nome] = `hsl(${h.toFixed(1)} ${sat.toFixed(1)}% ${d.l}%)`;
  }
  return out;
}

/**
 * Texto que lê em cima da cor da marca. Calculado, não escolhido:
 * marca amarela pede texto escuro, marca azul pede texto claro.
 */
export function textoSobreMarca(hex: string): string {
  const limpo = hex.replace("#", "");
  const n = limpo.length === 3 ? limpo.split("").map((c) => c + c).join("") : limpo;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum > 0.45 ? "#15121a" : "#ffffff";
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

/** Carrega da Google Fonts só o par que a loja usa. */
export function garantirFontes(par: ParFontes) {
  const id = `fontes-${par}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=${PARES_DE_FONTE[par].googleFonts}&display=swap`;
  document.head.appendChild(link);
}
