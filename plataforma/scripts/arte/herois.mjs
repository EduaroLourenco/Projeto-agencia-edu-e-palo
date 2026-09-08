import * as f from "./formas.mjs";
import { tom } from "./cena.mjs";

/**
 * Os banners de capa, em dois recortes.
 *
 * Cada loja sai duas vezes: retrato pro celular e faixa larga pro desktop.
 * Não é capricho — a mesma arte 3:2 num banner 3:4 perde metade da largura
 * no `object-cover`, e era exatamente o que estava acontecendo: as peças
 * das pontas apareciam cortadas ao meio.
 *
 * Mesma linguagem do catálogo, em vitrine: objetos numa bancada, com
 * profundidade — o que está atrás é menor e mais claro, que é como o olho
 * lê distância. A faixa de baixo fica de propósito mais calma, porque é
 * onde o bloco põe o véu e o título.
 */

const RECORTES = {
  // O chão desce quase até o pé da arte de propósito: o véu do bloco cobre
  // o terço de baixo, e cobrindo chão vazio ele vira um bloco cinza morto.
  // Com o produto ali embaixo, o título cai por cima da peça — que é o que
  // banner de loja de verdade faz.
  celular: { largura: 900, altura: 1200, chao: 975, sufixo: "" },
  largo: { largura: 1600, altura: 640, chao: 528, sufixo: "-largo" },
};

/** Encaixa um desenho de 600×600 (chão em y=470) na bancada do herói. */
function encaixar(chao) {
  return function por(cx, escala, svg, { recuo = 0 } = {}) {
    const tx = cx - 300 * escala;
    const ty = chao - 470 * escala;
    return `<g transform="translate(${tx},${ty}) scale(${escala})" opacity="${(1 - recuo).toFixed(2)}">
      <ellipse cx="300" cy="480" rx="150" ry="20" fill="#241c14" opacity="0.13" filter="url(#borrar-pouco)"/>
      ${svg}
    </g>`;
  };
}

/**
 * O chão da bancada.
 *
 * Retângulo chapado deixava uma emenda reta atravessando o banner, e o véu
 * do bloco por cima transformava o terço de baixo num bloco cinza morto.
 * Com degradê a linha do horizonte continua legível e o resto respira.
 */
const bancada = (cor, { largura, altura, chao }, opacidade = 0.34) => `
  <defs>
    <linearGradient id="bancada" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${tom(cor, -0.14)}" stop-opacity="${opacidade}"/>
      <stop offset="55%" stop-color="${tom(cor, -0.06)}" stop-opacity="${opacidade * 0.55}"/>
      <stop offset="100%" stop-color="${tom(cor, 0.2)}" stop-opacity="${opacidade * 0.2}"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${chao}" width="${largura}" height="${altura - chao}" fill="url(#bancada)"/>
  <rect x="0" y="${chao - 1.5}" width="${largura}" height="3" fill="${tom(cor, -0.26)}" opacity="0.22"/>`;

/**
 * As composições, um layout por recorte.
 *
 * Derivar o retrato do layout largo — aproximando e aumentando as peças —
 * dava colisão: o saco de arroz tapava o rótulo dos vizinhos. Retrato cabe
 * três peças, faixa larga cabe cinco. Então são dois layouts escritos à
 * mão, e não um espremido no outro.
 *
 * `x` é fração da largura; `e`, escala; `recuo`, distância (o objeto fica
 * mais transparente e o fundo claro atravessa ele).
 */
const PECAS = {
  "hero-distribuidora": {
    fundo: "#e7e0d2",
    cafe: () => f.caixa({ cor: "#6d3b2a", marca: "TORRADO", linha: "Moído", peso: "500 g", largura: 168, altura: 296 }),
    molho: () => f.pote({ cor: "#b1452f", marca: "TOMATE", linha: "Tradicional", peso: "2 kg" }),
    oleo: () => f.garrafa({ cor: "#e0b545", marca: "SOJA", linha: "Tipo 1", peso: "900 ml" }),
    cola: () => f.garrafa({ cor: "#8c2f2a", marca: "COLA", linha: "Original", peso: "2 L", ombro: 196 }),
    arroz: () => f.saco({ cor: "#e4c76a", marca: "AGULHINHA", linha: "Tipo 1", peso: "5 kg" }),
    largo: [
      { p: "cafe", x: 0.115, e: 0.78, recuo: 0.24 },
      { p: "molho", x: 0.885, e: 0.76, recuo: 0.24 },
      { p: "oleo", x: 0.29, e: 1.0, recuo: 0.1 },
      { p: "cola", x: 0.715, e: 0.98, recuo: 0.12 },
      { p: "arroz", x: 0.5, e: 1.18, recuo: 0 },
    ],
    retrato: [
      { p: "oleo", x: 0.19, e: 1.16, recuo: 0.16 },
      { p: "cola", x: 0.82, e: 1.12, recuo: 0.18 },
      { p: "arroz", x: 0.505, e: 1.42, recuo: 0 },
    ],
  },
  "hero-moda": {
    fundo: "#ece1d8",
    chaoOpacidade: 0.3,
    saia: () => f.saia({ cor: "#b8834a" }),
    calca: () => f.calca({ cor: "#3b3a38", largura: 0.7 }),
    blusa: () => f.blusa({ cor: "#c88a5e", manga: "curta", barra: 424 }),
    vestido: () => f.vestido({ cor: "#8e3b4c" }),
    largo: [
      { p: "saia", x: 0.15, e: 0.9, recuo: 0.2 },
      { p: "calca", x: 0.85, e: 0.9, recuo: 0.2 },
      { p: "blusa", x: 0.365, e: 1.1, recuo: 0.08 },
      { p: "vestido", x: 0.635, e: 1.1, recuo: 0.1 },
    ],
    retrato: [
      { p: "saia", x: 0.17, e: 1.08, recuo: 0.2 },
      { p: "calca", x: 0.84, e: 1.08, recuo: 0.2 },
      { p: "vestido", x: 0.52, e: 1.36, recuo: 0 },
    ],
  },
};

function bancadaDePecas(nome, recorte) {
  const cena = PECAS[nome];
  const por = encaixar(recorte.chao);
  const layout = recorte.largura < recorte.altura ? cena.retrato : cena.largo;
  return (
    bancada(cena.fundo, recorte, cena.chaoOpacidade) +
    layout
      .map(({ p, x, e, recuo }) => por(recorte.largura * x, e, cena[p](), { recuo }))
      .join("")
  );
}

/**
 * Penteadeira: espelho de arco, lâmpadas em volta, frascos na pedra.
 *
 * A primeira versão do salão era só mancha colorida desfocada — bonita de
 * longe e igual a qualquer papel de parede de gerador de imagem.
 */
function penteadeira({ largura, altura, chao }) {
  const cx = largura / 2;
  const raio = Math.min(largura * 0.29, (chao - 90) * 0.46);
  const topo = chao - raio * 2.35;
  const aro = "#8d7ab4";

  const lampadas = Array.from({ length: 13 }, (_, i) => {
    const a = Math.PI * (1 + i / 12);
    const x = cx + Math.cos(a) * (raio + 34);
    const y = topo + raio + Math.sin(a) * (raio + 34);
    if (y > chao) return "";
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="#fff3dc"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="13" fill="none" stroke="${aro}" stroke-opacity="0.4" stroke-width="2"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26" fill="#ffe9bd" opacity="0.32" filter="url(#halo)"/>`;
  }).join("");

  const vidro = (x, alto, largo, cor) => `
    <rect x="${x}" y="${chao - alto}" width="${largo}" height="${alto}" rx="${largo * 0.28}" fill="${cor}" opacity="0.9"/>
    <rect x="${x + largo * 0.16}" y="${chao - alto + 12}" width="${largo * 0.2}" height="${alto - 30}" rx="6" fill="#fff" opacity="0.4"/>
    <rect x="${x + largo * 0.3}" y="${chao - alto - 22}" width="${largo * 0.4}" height="24" rx="6" fill="${tom(cor, -0.35)}"/>`;

  const potePinceis = (x) => `
    <path d="M${x},${chao} L${x},${chao - 74} Q${x},${chao - 94} ${x + 22},${chao - 94} L${x + 64},${chao - 94}
             Q${x + 86},${chao - 94} ${x + 86},${chao - 74} L${x + 86},${chao} Z" fill="#c9b6ea" opacity="0.85"/>
    ${[16, 38, 60]
      .map(
        (d, i) =>
          `<path d="M${x + d},${chao - 92} L${x + d - 4 + i * 4},${chao - 182 + i * 16}" stroke="#6f5a97"
                 stroke-opacity="0.6" stroke-width="7" stroke-linecap="round" fill="none"/>`,
      )
      .join("")}`;

  return `
  <defs>
    <filter id="halo" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter>
    <linearGradient id="espelho" x1="16%" y1="0%" x2="84%" y2="100%">
      <stop offset="0%" stop-color="#f6f1fb"/>
      <stop offset="42%" stop-color="#ddd2ee"/>
      <stop offset="100%" stop-color="#c3b6df"/>
    </linearGradient>
  </defs>
  <defs>
    <linearGradient id="pedra" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d3c4ea" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#f0eaf8" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect x="0" y="${chao}" width="${largura}" height="${altura - chao}" fill="url(#pedra)"/>
  <rect x="0" y="${chao - 1.5}" width="${largura}" height="3" fill="#a892cd" opacity="0.28"/>
  <path d="M${cx - raio},${chao} L${cx - raio},${topo + raio} A${raio},${raio} 0 0 1 ${cx + raio},${topo + raio} L${cx + raio},${chao} Z"
        fill="url(#espelho)"/>
  <path d="M${cx - raio + 46},${chao} L${cx - raio + 46},${topo + raio} A${raio - 46},${raio - 46} 0 0 1 ${cx - 16},${topo + 42}"
        fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="26" stroke-linecap="round"/>
  <path d="M${cx - raio},${chao} L${cx - raio},${topo + raio} A${raio},${raio} 0 0 1 ${cx + raio},${topo + raio} L${cx + raio},${chao}"
        fill="none" stroke="${aro}" stroke-opacity="0.55" stroke-width="7"/>
  <ellipse cx="${cx - raio * 0.3}" cy="${chao - raio * 0.46}" rx="${raio * 0.56}" ry="${raio * 0.25}" fill="#ffffff" opacity="0.28"/>
  ${lampadas}
  ${vidro(largura * 0.16, 128, 54, "#a98bc8")}
  ${vidro(largura * 0.09, 96, 48, "#e0a9c0")}
  ${vidro(largura * 0.79, 116, 50, "#8fb3d8")}
  ${potePinceis(largura * 0.85)}`;
}

const LOJAS = [
  { arquivo: "hero-distribuidora", fundo: "#e7e0d2", cena: bancadaDePecas },
  { arquivo: "hero-moda", fundo: "#ece1d8", cena: bancadaDePecas },
  { arquivo: "hero-salao", fundo: "#e8e2f0", cena: (_nome, recorte) => penteadeira(recorte) },
];

export const HEROIS = LOJAS.flatMap(({ arquivo, fundo, cena }) =>
  Object.values(RECORTES).map((recorte) => ({
    arquivo: arquivo + recorte.sufixo,
    fundo,
    largura: recorte.largura,
    altura: recorte.altura,
    sombra: 0,
    ampliar: 1,
    desenhar: () => cena(arquivo, recorte),
  })),
);
