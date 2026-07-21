import sharp from "sharp";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");
mkdirSync(PUBLIC_DIR, { recursive: true });

const ICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#05050a"/>
  <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#g)"/>
  <text x="32" y="42" font-family="Arial, sans-serif" font-size="26" font-weight="800" fill="#05050a" text-anchor="middle">EP</text>
</svg>`;

const OG_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#05050a"/>
      <stop offset="1" stop-color="#12081f"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8b5cf6"/>
      <stop offset="1" stop-color="#22d3ee"/>
    </linearGradient>
    <radialGradient id="glow1" cx="0.15" cy="0.15" r="0.5">
      <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.9" cy="0.9" r="0.5">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow1)"/>
  <rect width="1200" height="630" fill="url(#glow2)"/>

  <rect x="80" y="80" width="72" height="72" rx="18" fill="url(#accent)"/>
  <text x="116" y="130" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="#05050a" text-anchor="middle">EP</text>

  <text x="80" y="280" font-family="Arial, sans-serif" font-size="64" font-weight="800" fill="#ffffff">Edu &amp; Paloma</text>
  <text x="80" y="340" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#c4b5fd">Agência Digital · Goiânia</text>

  <text x="80" y="410" font-family="Arial, sans-serif" font-size="26" font-weight="400" fill="#a3a3ad">Catálogos com pedido no WhatsApp, sites sob medida,</text>
  <text x="80" y="446" font-family="Arial, sans-serif" font-size="26" font-weight="400" fill="#a3a3ad">marketing digital e automação.</text>

  <rect x="80" y="500" width="220" height="56" rx="28" fill="#ffffff"/>
  <text x="190" y="535" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#05050a" text-anchor="middle">Falar no WhatsApp</text>
</svg>`;

async function gerar() {
  const iconBuf = Buffer.from(ICON_SVG);
  await sharp(iconBuf, { density: 384 }).resize(32, 32).png().toFile(join(PUBLIC_DIR, "favicon-32.png"));
  await sharp(iconBuf, { density: 384 }).resize(16, 16).png().toFile(join(PUBLIC_DIR, "favicon-16.png"));
  await sharp(iconBuf, { density: 384 }).resize(180, 180).png().toFile(join(PUBLIC_DIR, "apple-touch-icon.png"));
  await sharp(iconBuf, { density: 384 }).resize(192, 192).png().toFile(join(PUBLIC_DIR, "icon-192.png"));
  await sharp(iconBuf, { density: 384 }).resize(512, 512).png().toFile(join(PUBLIC_DIR, "icon-512.png"));

  const ogBuf = Buffer.from(OG_SVG);
  await sharp(ogBuf).resize(1200, 630).png().toFile(join(PUBLIC_DIR, "og-image.png"));

  writeFileSync(
    join(PUBLIC_DIR, "manifest.webmanifest"),
    JSON.stringify(
      {
        name: "Edu & Paloma — Agência Digital",
        short_name: "Edu & Paloma",
        description: "Sistemas, sites e marketing digital para negócios de Goiânia.",
        start_url: "/",
        display: "standalone",
        background_color: "#05050a",
        theme_color: "#05050a",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      null,
      2,
    ),
  );

  console.log("Ícones e manifest gerados em public/");
}

gerar().catch((err) => {
  console.error(err);
  process.exit(1);
});
