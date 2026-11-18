import sharp from "sharp";
import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="13" fill="#ffe100"/>
  <text x="32" y="47" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="700" fill="#11110f" text-anchor="middle">B</text>
</svg>`;

const OG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect x="70" y="330" width="530" height="118" rx="10" fill="#ffe100"/>
  <text font-family="Segoe UI, Arial, sans-serif" font-size="100" font-weight="600" letter-spacing="-3" fill="#11110f">
    <tspan x="80" y="190">Olá, BEPA.</tspan>
    <tspan x="80" y="300">Quero</tspan>
    <tspan x="80" y="420">vender mais.</tspan>
  </text>
  <text x="80" y="550" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#55544d">Consultoria em vendas, sistemas e finanças</text>
</svg>`;

const icone = Buffer.from(ICON_SVG);
writeFileSync(join(PUBLIC_DIR, "favicon.svg"), ICON_SVG);
for (const [nome, lado] of [
  ["favicon-32.png", 32],
  ["favicon-16.png", 16],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
]) {
  await sharp(icone, { density: 384 }).resize(lado, lado).png().toFile(join(PUBLIC_DIR, nome));
}

await sharp(Buffer.from(OG_SVG)).resize(1200, 630).png().toFile(join(PUBLIC_DIR, "og-image.png"));

writeFileSync(
  join(PUBLIC_DIR, "manifest.webmanifest"),
  JSON.stringify(
    {
      name: "BEPA — Consultoria, Assessoria e Serviços",
      short_name: "BEPA",
      description: "Tecnologia e estratégia para vender mais.",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#ffffff",
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      ],
    },
    null,
    2,
  ),
);
