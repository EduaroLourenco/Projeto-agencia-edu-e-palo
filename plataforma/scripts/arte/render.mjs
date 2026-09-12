import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { pagina } from "./cena.mjs";
import { CATALOGO } from "./catalogo.mjs";
import { HEROIS } from "./herois.mjs";

/**
 * Desenha o catálogo das demos.
 *
 *   node scripts/arte/render.mjs            # tudo
 *   node scripts/arte/render.mjs arroz cafe # só esses, pra iterar rápido
 *   node scripts/arte/render.mjs --folha    # contact sheet, pra olhar junto
 *
 * Rasteriza no Chromium porque o desenho depende de gradiente, sombra e
 * grão — coisas que biblioteca de imagem em Python não faz bonito. Sai no
 * dobro do tamanho e reduz depois: é o que dá borda limpa.
 */

const DESTINO = "demos/fotos";
const CROMO =
  process.env.CHROME_BIN ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";

const args = process.argv.slice(2);
const soFolha = args.includes("--folha");
const filtros = args.filter((a) => !a.startsWith("--"));

mkdirSync(DESTINO, { recursive: true });
const navegador = await chromium.launch({ executablePath: CROMO });

async function desenhar({ arquivo, fundo, desenhar, largura = 600, altura = 600, sombra, ampliar }) {
  // O produto ocupava pouco mais da metade da altura. Numa grade fica bom,
  // mas na lista rápida — miniatura de 56px — vira um pontinho no meio do
  // quadro. 1.14 preenche sem encostar na borda.
  const html = pagina({ objeto: desenhar(), fundo, largura, altura, sombra, ampliar: ampliar ?? 1.14 });
  const aba = await navegador.newPage({
    viewport: { width: largura, height: altura },
    deviceScaleFactor: 2,
  });
  await aba.setContent(html, { waitUntil: "load" });
  await aba.evaluate(() => document.fonts.ready);
  const png = join("/tmp", `arte-${arquivo}.png`);
  await aba.screenshot({ path: png });
  await aba.close();

  // Reduz pela metade com reamostragem boa e grava como JPEG: o grão fica
  // fino em vez de granulado, e o arquivo cai pra um quinto.
  const destino = join(DESTINO, `${arquivo}.jpg`);
  execFileSync("python3", [
    "-c",
    `import sys
from PIL import Image
i = Image.open(sys.argv[1]).convert("RGB").resize((${largura}, ${altura}), Image.LANCZOS)
i.save(sys.argv[2], quality=88, optimize=True, progressive=True)`,
    png,
    destino,
  ]);
  return destino;
}

const tudo = [...CATALOGO, ...HEROIS];
const alvos = filtros.length ? tudo.filter((i) => filtros.includes(i.arquivo)) : tudo;

for (const item of alvos) {
  const destino = await desenhar(item);
  process.stdout.write(`${item.arquivo}  `);
  void destino;
}
console.log(`\n${alvos.length} artes`);

if (soFolha) {
  const { readFileSync } = await import("node:fs");
  const cartoes = alvos
    .map((i) => {
      const b64 = readFileSync(join(DESTINO, `${i.arquivo}.jpg`)).toString("base64");
      return `<figure><img src="data:image/jpeg;base64,${b64}"><figcaption>${i.arquivo}</figcaption></figure>`;
    })
    .join("");
  const html = `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:20px;background:#f6f4f1;font:12px Inter,system-ui;display:grid;
         grid-template-columns:repeat(6,1fr);gap:14px}
    figure{margin:0}img{width:100%;display:block;border-radius:10px}
    figcaption{padding-top:5px;color:#6b6259}</style>${cartoes}`;
  const aba = await navegador.newPage({ viewport: { width: 1500, height: 800 } });
  await aba.setContent(html, { waitUntil: "load" });
  await aba.screenshot({ path: "/tmp/folha-catalogo.png", fullPage: true });
  await aba.close();
  writeFileSync("/tmp/folha.html", html);
  console.log("folha: /tmp/folha-catalogo.png");
}

await navegador.close();
