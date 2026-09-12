/**
 * O fundo comum de toda arte do catálogo.
 *
 * As demos não têm foto de produto — e fingir foto com desenho chapado é o
 * que faz catálogo parecer template. Então a escolha é assumida: ilustração
 * editorial, mesma luz e mesma escala ótica em todas, num fundo de estúdio.
 *
 * O que dá o acabamento não é o desenho em si, é o resto: gradiente de luz
 * vindo de cima à esquerda, sombra de contato macia embaixo do objeto,
 * vinheta discreta e grão fino por cima de tudo. Sem o grão, qualquer
 * ilustração vetorial lê como clipart.
 */

export const LADO = 600;

/** Escurece/clareia uma cor #rrggbb. `f` negativo escurece. */
export function tom(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const canal = (deslocamento) => {
    const v = (n >> deslocamento) & 255;
    const alvo = f > 0 ? 255 : 0;
    return Math.round(v + (alvo - v) * Math.abs(f));
  };
  return `#${[canal(16), canal(8), canal(0)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * Monta a página que o Chromium vai fotografar.
 *
 * `objeto` é o SVG do produto, já desenhado num viewBox 600×600 com o chão
 * na altura y=470 — é o contrato que mantém todas as artes alinhadas.
 */
export function pagina({ objeto, fundo, sombra = 0.16, largura = LADO, altura = LADO, ampliar = 1 }) {
  const claro = tom(fundo, 0.86);
  const medio = tom(fundo, 0.62);
  const fundoEscuro = tom(fundo, 0.34);

  return `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;background:#fff}
  svg{display:block}
  text{font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">
  <defs>
    <radialGradient id="chao" cx="34%" cy="22%" r="92%">
      <stop offset="0%" stop-color="#fffefc"/>
      <stop offset="46%" stop-color="${claro}"/>
      <stop offset="100%" stop-color="${medio}"/>
    </radialGradient>
    <radialGradient id="vinheta" cx="50%" cy="44%" r="76%">
      <stop offset="60%" stop-color="${fundoEscuro}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${fundoEscuro}" stop-opacity="0.30"/>
    </radialGradient>
    <radialGradient id="contato">
      <stop offset="0%" stop-color="#241c14" stop-opacity="${sombra}"/>
      <stop offset="55%" stop-color="#241c14" stop-opacity="${sombra * 0.42}"/>
      <stop offset="100%" stop-color="#241c14" stop-opacity="0"/>
    </radialGradient>
    <filter id="grao" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <filter id="borrar-pouco" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="7"/>
    </filter>
  </defs>

  <rect width="${largura}" height="${altura}" fill="url(#chao)"/>
  <ellipse cx="${largura / 2}" cy="474" rx="${largura * 0.30}" ry="26" fill="url(#contato)" filter="url(#borrar-pouco)"/>
  <g transform="translate(300,470) scale(${ampliar}) translate(-300,-470)">${objeto}</g>
  <rect width="${largura}" height="${altura}" fill="url(#vinheta)"/>
  <rect width="${largura}" height="${altura}" filter="url(#grao)" opacity="0.085" style="mix-blend-mode:multiply"/>
</svg>`;
}

/**
 * Plaquinha de rótulo com texto de verdade.
 *
 * É o detalhe que mais faz a ilustração parecer embalagem e não desenho: o
 * olho reconhece hierarquia tipográfica antes de reconhecer a forma.
 */
export function rotulo({ x, y, w, h, cor, marca, linha, peso }) {
  const meio = x + w / 2;
  const cimaTexto = y + h * 0.34;
  const util = w - 18;

  /**
   * Corpo que cabe na plaquinha.
   *
   * "GUARDANAPO" na mesma altura de "UVA" estoura a borda — e rótulo
   * vazando é o detalhe que denuncia desenho automático. A largura do Inter
   * em caixa alta fica perto de 0.66 do corpo; abaixo disso, encolhe.
   */
  const cabe = (texto, ideal, folga = 0.66) =>
    Math.min(ideal, Math.floor(util / (texto.length * folga)));

  // 0.74 e não 0.66: a linha da marca leva letter-spacing, que soma largura.
  const corpoMarca = cabe(marca, Math.round(h * 0.19), 0.74);
  return `
  <g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(9, h / 3)}" fill="#fdfbf7" opacity="0.96"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(9, h / 3)}" fill="none" stroke="${tom(cor, -0.18)}" stroke-opacity="0.35" stroke-width="1.4"/>
    <text x="${meio}" y="${cimaTexto}" text-anchor="middle" font-size="${corpoMarca}" font-weight="700"
          letter-spacing="${(corpoMarca * 0.06).toFixed(1)}" fill="${tom(cor, -0.42)}">${marca}</text>
    ${linha ? `<text x="${meio}" y="${cimaTexto + h * 0.27}" text-anchor="middle" font-size="${cabe(linha, Math.round(h * 0.135), 0.56)}" font-weight="500" fill="${tom(cor, -0.2)}" opacity="0.85">${linha}</text>` : ""}
    ${peso ? `<text x="${meio}" y="${y + h * 0.90}" text-anchor="middle" font-size="${cabe(peso, Math.round(h * 0.15), 0.56)}" font-weight="600" fill="${tom(cor, -0.42)}" opacity="0.6">${peso}</text>` : ""}
  </g>`;
}

/** Faixa de luz vertical: o brilho que a fonte de luz deixa no corpo. */
export function brilho(x, y, w, h, forca = 0.5, raio = 8) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${raio}" fill="#ffffff" opacity="${forca}"
            style="mix-blend-mode:soft-light"/>`;
}
