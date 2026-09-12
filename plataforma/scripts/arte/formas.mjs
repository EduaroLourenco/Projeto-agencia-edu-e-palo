import { tom, rotulo, brilho } from "./cena.mjs";

/**
 * Os arquétipos de embalagem.
 *
 * Poucos moldes, muitos produtos: um saco, uma caixa, uma garrafa, um pote.
 * É de propósito — catálogo de distribuidora tem cara de família, e repetir
 * o molde com proporção e cor diferentes lê como coleção, não como preguiça.
 *
 * Todo desenho vive num viewBox 600×600, apoiado em y=470, com a luz vindo
 * de cima à esquerda. Quem quebrar isso quebra a página inteira.
 */

const INK = "#2a2118";

// Um SVG só pode ter vários objetos (os heróis compõem). Gradiente com id
// repetido faz o segundo herdar a cor do primeiro, então cada um leva o seu.
let sequencia = 0;
const novoId = () => `g${++sequencia}`;

/** Corpo com sombreado: claro na esquerda, escuro na direita. */
function corpo(id, cor, x1 = "0%", x2 = "100%") {
  return `<linearGradient id="${id}" x1="${x1}" y1="0%" x2="${x2}" y2="0%">
    <stop offset="0%" stop-color="${tom(cor, 0.34)}"/>
    <stop offset="26%" stop-color="${tom(cor, 0.1)}"/>
    <stop offset="62%" stop-color="${cor}"/>
    <stop offset="100%" stop-color="${tom(cor, -0.3)}"/>
  </linearGradient>`;
}

const traco = (d, w = 2.4) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.5" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/* ============================================================
   SACO EM PÉ — arroz, feijão, açúcar, farinha, macarrão
   ============================================================ */
export function saco({ cor, marca, linha, peso }) {
  const g = novoId();
  const d =
    "M181,176 C174,262 174,368 183,452 Q185,470 205,470 L395,470 Q415,470 417,452 C426,368 426,262 419,176 Z";
  return `
  <defs>${corpo(g, cor)}</defs>
  <path d="M203,128 L397,128 L406,178 L194,178 Z" fill="${tom(cor, -0.34)}"/>
  <path d="M203,128 L397,128 L397,140 L203,140 Z" fill="${tom(cor, 0.2)}" opacity="0.45"/>
  <path d="${d}" fill="url(#${g})"/>
  ${brilho(206, 190, 46, 260, 0.5, 22)}
  <path d="M400,182 C408,268 408,372 400,462" stroke="${tom(cor, -0.5)}" stroke-opacity="0.5" stroke-width="16" fill="none" stroke-linecap="round"/>
  ${traco(d)}
  ${traco("M194,178 L406,178", 2)}
  ${rotulo({ x: 216, y: 236, w: 168, h: 150, cor, marca, linha, peso })}`;
}

/* ============================================================
   CAIXA — café, biscoito, leite, suco, guardanapo
   ============================================================ */
export function caixa({ cor, marca, linha, peso, largura = 190, altura = 318 }) {
  const g = novoId();
  const x = 300 - largura / 2 - 18;
  const y = 470 - altura;
  const dx = 44;
  const dy = 26;
  const frente = `M${x},${y} L${x + largura},${y} L${x + largura},470 L${x},470 Z`;
  return `
  <defs>${corpo(g, cor)}</defs>
  <path d="M${x + largura},${y} L${x + largura + dx},${y - dy} L${x + largura + dx},${470 - dy} L${x + largura},470 Z" fill="${tom(cor, -0.4)}"/>
  <path d="M${x},${y} L${x + dx},${y - dy} L${x + largura + dx},${y - dy} L${x + largura},${y} Z" fill="${tom(cor, 0.28)}"/>
  <path d="${frente}" fill="url(#${g})"/>
  ${brilho(x + 14, y + 16, 34, altura - 40, 0.42, 6)}
  ${traco(frente)}
  ${traco(`M${x + largura},${y} L${x + largura + dx},${y - dy} L${x + largura + dx},${470 - dy} L${x + largura},470`)}
  ${traco(`M${x},${y} L${x + dx},${y - dy} L${x + largura + dx},${y - dy}`)}
  ${rotulo({ x: x + 24, y: y + altura * 0.24, w: largura - 48, h: altura * 0.44, cor, marca, linha, peso })}`;
}

/* ============================================================
   GARRAFA — óleo, refrigerante, água, suco, molho
   ============================================================ */
export function garrafa({ cor, marca, linha, peso, corTampa, pescoco = 46, ombro = 210 }) {
  const g = novoId();
  const tampa = corTampa ?? tom(cor, -0.45);
  const d = `M${300 - pescoco / 2},150
    C${300 - pescoco / 2},${ombro - 40} 192,${ombro - 34} 190,${ombro + 16}
    C185,300 185,392 190,448 Q192,470 214,470 L386,470 Q408,470 410,448
    C415,392 415,300 410,${ombro + 16} C408,${ombro - 34} ${300 + pescoco / 2},${ombro - 40} ${300 + pescoco / 2},150 Z`;
  return `
  <defs>${corpo(g, cor)}</defs>
  <rect x="${300 - pescoco / 2 - 8}" y="112" width="${pescoco + 16}" height="42" rx="7" fill="${tampa}"/>
  <rect x="${300 - pescoco / 2 - 8}" y="112" width="14" height="42" rx="7" fill="#fff" opacity="0.22"/>
  <path d="${d}" fill="url(#${g})"/>
  ${brilho(212, ombro + 24, 40, 214, 0.55, 20)}
  ${traco(d)}
  ${rotulo({ x: 214, y: 268, w: 172, h: 132, cor, marca, linha, peso })}`;
}

/* ============================================================
   FRASCO DE APERTAR — detergente, produto de cabelo
   ============================================================ */
export function frasco({ cor, marca, linha, peso }) {
  const g = novoId();
  const d = `M244,196 C240,268 238,372 242,450 Q243,470 262,470 L338,470 Q357,470 358,450
    C362,372 360,268 356,196 Q354,180 336,180 L264,180 Q246,180 244,196 Z`;
  return `
  <defs>${corpo(g, cor)}</defs>
  <path d="M276,112 L324,112 L330,148 Q332,162 316,162 L284,162 Q268,162 270,148 Z" fill="${tom(cor, -0.5)}"/>
  <rect x="272" y="160" width="56" height="26" rx="8" fill="${tom(cor, -0.36)}"/>
  <path d="${d}" fill="url(#${g})"/>
  ${brilho(256, 206, 26, 226, 0.5, 13)}
  ${traco(d)}
  ${rotulo({ x: 258, y: 256, w: 84, h: 138, cor, marca, linha, peso })}`;
}

/* ============================================================
   GALÃO COM ALÇA — água sanitária, desinfetante
   ============================================================ */
export function galao({ cor, marca, linha, peso }) {
  const g = novoId();
  const d = `M196,208 Q196,186 218,186 L382,186 Q404,186 404,208 L404,448 Q404,470 382,470 L218,470 Q196,470 196,448 Z`;
  return `
  <defs>${corpo(g, cor)}</defs>
  <rect x="272" y="120" width="56" height="42" rx="9" fill="${tom(cor, -0.5)}"/>
  <path d="M254,162 L346,162 L358,190 L242,190 Z" fill="${tom(cor, -0.16)}"/>
  <path d="${d}" fill="url(#${g})"/>
  <path d="M330,232 Q374,232 374,272 Q374,312 330,312 L330,290 Q352,290 352,272 Q352,254 330,254 Z" fill="${tom(cor, -0.42)}" opacity="0.55"/>
  ${brilho(212, 214, 30, 226, 0.46, 15)}
  ${traco(d)}
  ${rotulo({ x: 214, y: 250, w: 108, h: 150, cor, marca, linha, peso })}`;
}

/* ============================================================
   POTE — molho, creme, conserva
   ============================================================ */
export function pote({ cor, marca, linha, peso }) {
  const g = novoId();
  const d = `M188,242 Q188,224 208,224 L392,224 Q412,224 412,242 L412,444 Q412,470 386,470 L214,470 Q188,470 188,444 Z`;
  return `
  <defs>${corpo(g, cor)}</defs>
  <rect x="200" y="152" width="200" height="62" rx="14" fill="${tom(cor, -0.46)}"/>
  <rect x="200" y="152" width="34" height="62" rx="14" fill="#fff" opacity="0.18"/>
  <path d="${d}" fill="url(#${g})"/>
  ${brilho(206, 250, 36, 180, 0.5, 18)}
  ${traco(d)}
  ${rotulo({ x: 216, y: 276, w: 168, h: 136, cor, marca, linha, peso })}`;
}

/* ============================================================
   PILHA — copos, guardanapos, fardos
   ============================================================ */
export function pilha({ cor, marca, linha, peso }) {
  const g = novoId();
  const d = `M214,182 L386,182 L366,452 Q364,470 344,470 L256,470 Q236,470 234,452 Z`;
  return `
  <defs>${corpo(g, cor)}</defs>
  <path d="${d}" fill="url(#${g})"/>
  ${[236, 286, 336, 386].map((y) => traco(`M${222 + (y - 182) * 0.075},${y} L${378 - (y - 182) * 0.075},${y}`, 1.6)).join("")}
  <ellipse cx="300" cy="182" rx="86" ry="20" fill="${tom(cor, 0.3)}"/>
  <ellipse cx="300" cy="182" rx="86" ry="20" fill="none" stroke="${INK}" stroke-opacity="0.45" stroke-width="2.4"/>
  ${brilho(232, 200, 30, 230, 0.42, 15)}
  ${traco(d)}
  ${rotulo({ x: 240, y: 268, w: 120, h: 116, cor, marca, linha, peso })}`;
}

/* ============================================================
   ROUPA — desenho de vitrine, silhueta cheia com dobra
   ============================================================ */
function tecido(id, cor) {
  return `<linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="24%">
    <stop offset="0%" stop-color="${tom(cor, 0.3)}"/>
    <stop offset="38%" stop-color="${tom(cor, 0.06)}"/>
    <stop offset="100%" stop-color="${tom(cor, -0.26)}"/>
  </linearGradient>`;
}

const dobra = (d) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-opacity="0.22" stroke-width="2" stroke-linecap="round"/>`;

export function blusa({ cor, manga = "curta", barra = 430 }) {
  const g = novoId();
  const mangaD =
    manga === "curta"
      ? "M206,160 L150,236 L188,272 L228,214"
      : "M206,160 L142,242 L118,396 L166,410 L206,268";
  const mangaDir =
    manga === "curta"
      ? "M394,160 L450,236 L412,272 L372,214"
      : "M394,160 L458,242 L482,396 L434,410 L394,268";
  const d = `M206,160 Q248,132 268,128 Q300,166 332,128 Q352,132 394,160
    L394,${barra} Q394,${barra + 14} 378,${barra + 14} L222,${barra + 14} Q206,${barra + 14} 206,${barra} Z`;
  return `
  <defs>${tecido(g, cor)}</defs>
  <path d="${mangaD}" fill="${tom(cor, -0.18)}"/>
  <path d="${mangaDir}" fill="${tom(cor, -0.3)}"/>
  <path d="${d}" fill="url(#${g})"/>
  <path d="M268,128 Q300,168 332,128 Q300,150 268,128 Z" fill="${tom(cor, -0.5)}" opacity="0.5"/>
  ${dobra(`M258,${barra - 100} L262,${barra}`)}
  ${dobra(`M344,${barra - 130} L340,${barra}`)}
  ${traco(d)}
  ${traco(mangaD)}
  ${traco(mangaDir)}`;
}

export function calca({ cor, largura = 1 }) {
  const g = novoId();
  // Cós estreito, gancho alto e canela comprida. Sem os três a peça vira
  // bermuda — foi o que aconteceu na primeira versão.
  const cos = 78;
  const barra = 40 * largura;
  const gancho = 268;
  const d = `M${300 - cos},124 L${300 + cos},124
    L${300 + cos - 6 + barra},452 Q${300 + cos - 6 + barra},468 ${300 + cos - 24 + barra},468
    L${306 + barra * 0.5},468 Q${296 + barra * 0.5},468 ${295 + barra * 0.5},452
    L300,${gancho}
    L${304 - barra * 0.5},452 Q${303 - barra * 0.5},468 ${293 - barra * 0.5},468
    L${300 - cos + 24 - barra},468 Q${300 - cos + 6 - barra},468 ${300 - cos + 6 - barra},452 Z`;
  return `
  <defs>${tecido(g, cor)}</defs>
  <path d="${d}" fill="url(#${g})"/>
  <rect x="${300 - cos}" y="124" width="${cos * 2}" height="26" fill="${tom(cor, -0.24)}"/>
  ${dobra(`M${300 - cos * 0.5},166 L${300 - cos * 0.5 - barra * 0.4},446`)}
  ${dobra(`M${300 + cos * 0.5},166 L${300 + cos * 0.5 + barra * 0.4},446`)}
  ${dobra(`M300,150 L300,${gancho - 10}`)}
  ${traco(d)}
  ${traco(`M${300 - cos},150 L${300 + cos},150`, 2)}`;
}

export function saia({ cor, pregas = false }) {
  const g = novoId();
  const d = "M228,168 L372,168 L424,438 Q426,458 404,458 L196,458 Q174,458 176,438 Z";
  const linhas = pregas
    ? [246, 274, 300, 326, 354].map((x) => dobra(`M${x},186 L${x + (x - 300) * 0.42},446`)).join("")
    : dobra("M330,186 L372,440");
  return `
  <defs>${tecido(g, cor)}</defs>
  <path d="${d}" fill="url(#${g})"/>
  <rect x="228" y="168" width="144" height="28" fill="${tom(cor, -0.24)}"/>
  ${linhas}
  ${traco(d)}
  ${traco("M228,196 L372,196", 2)}`;
}

export function vestido({ cor, barra = 462 }) {
  const g = novoId();
  const d = `M234,152 Q262,128 278,124 Q300,158 322,124 Q338,128 366,152
    L352,236 L${404},${barra - 14} Q408,${barra} 388,${barra} L212,${barra} Q192,${barra} 196,${barra - 14} L248,236 Z`;
  return `
  <defs>${tecido(g, cor)}</defs>
  <path d="${d}" fill="url(#${g})"/>
  <path d="M278,124 Q300,160 322,124 Q300,146 278,124 Z" fill="${tom(cor, -0.5)}" opacity="0.5"/>
  ${dobra(`M276,250 L258,${barra - 20}`)}
  ${dobra(`M330,250 L352,${barra - 26}`)}
  ${traco(d)}
  ${traco("M248,236 L352,236", 2)}`;
}

/* ============================================================
   SERVIÇO — traço fino sobre campo tonal

   Serviço não tem embalagem. Fingir um objeto pra ele é o erro que
   deixa agenda de salão com cara de e-commerce mal adaptado.
   ============================================================ */
export function motivo({ cor, desenho }) {
  const linha = tom(cor, -0.52);
  const T = (d, w = 5) =>
    `<path d="${d}" fill="none" stroke="${linha}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const C = (cx, cy, r, w = 5) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${linha}" stroke-width="${w}"/>`;

  const desenhos = {
    tesoura: `${T("M228,168 L360,352")}${T("M372,168 L240,352")}${C(224, 380, 30)}${C(376, 380, 30)}${C(300, 268, 7, 4)}`,
    // Tigela e pincel: coloração se reconhece pela mistura, não pelo tubo.
    tigela: `${T("M168,286 L432,286 A132,132 0 0 1 168,286 Z")}${T("M196,320 Q300,352 404,320", 4)}${T(
      "M356,140 L392,176 L268,300 L232,264 Z",
    )}${T("M232,264 L204,320 L268,300", 4)}`,
    // Escova raquete: cabo, cabeça arredondada e cerdas. A escova redonda
    // que eu tinha desenhado antes lia como um sol.
    escova: `${T("M242,132 Q300,120 358,132 Q392,142 392,214 Q392,300 300,332 Q208,300 208,214 Q208,142 242,132 Z")}${[
      [252, 176],
      [300, 166],
      [348, 176],
      [252, 226],
      [300, 216],
      [348, 226],
      [268, 274],
      [300, 264],
      [332, 274],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${linha}"/>`)
      .join("")}${T("M284,332 L284,424 Q284,444 300,444 Q316,444 316,424 L316,332", 5)}`,
    gota: `${T("M300,138 C300,138 210,258 210,318 A90,90 0 1 0 390,318 C390,258 300,138 300,138 Z")}${T("M262,322 A46,46 0 0 0 300,368", 4)}`,
    // Esmalte pra manicure e bacia pra pedicure: duas coisas que se
    // reconhecem de longe. Mão desenhada em traço vira luva.
    esmalte: `${T("M262,150 L338,150 L338,208 L338,208 Q378,238 378,296 L378,410 Q378,436 352,436 L248,436 Q222,436 222,410 L222,296 Q222,238 262,208 Z")}${T(
      "M280,110 L320,110 L320,150 L280,150 Z",
      4,
    )}${T("M240,300 L360,300", 4)}`,
    // Lótus. A bacia com vapor que eu tinha desenhado antes virava carinha
    // sorridente — três curvas em cima de um arco lêem como rosto.
    lotus: `${T("M300,404 Q300,300 300,236 Q300,300 300,404")}${[-1, 1]
      .map(
        (s) =>
          `${T(`M300,404 Q${300 + s * 96},348 ${300 + s * 54},228 Q300,286 300,404`)}${T(
            `M300,404 Q${300 + s * 158},372 ${300 + s * 152},260 Q${300 + s * 62},300 300,404`,
          )}`,
      )
      .join("")}${T("M172,414 Q300,442 428,414", 4)}`,
    sobrancelha: `${T("M180,300 Q252,224 366,246 Q414,256 424,282")}${T("M186,320 Q256,254 360,272", 4)}${C(300, 386, 44, 4)}${T("M282,386 Q300,370 318,386", 4)}`,
    rosto: `${T("M368,132 Q276,142 250,236 Q232,300 254,344 Q244,372 262,382 Q258,414 292,420 L340,420")}${T("M296,266 Q276,286 296,300", 4)}${T("M282,352 Q302,362 322,352", 4)}`,
    vidros: `${T("M232,238 Q232,224 246,224 L286,224 Q300,224 300,238 L300,438 Q300,452 286,452 L246,452 Q232,452 232,238 Z")}${T(
      "M254,186 L278,186 L278,224 L254,224 Z",
      4,
    )}${T("M324,272 Q324,258 338,258 L372,258 Q386,258 386,272 L386,438 Q386,452 372,452 L338,452 Q324,452 324,272 Z")}${T(
      "M342,222 L368,222 L368,258 L342,258 Z",
      4,
    )}`,
  };

  return `
  <circle cx="300" cy="290" r="188" fill="${tom(cor, 0.72)}" opacity="0.75"/>
  <circle cx="300" cy="290" r="188" fill="none" stroke="${tom(cor, 0.3)}" stroke-width="2"/>
  ${desenhos[desenho] ?? desenhos.gota}`;
}
