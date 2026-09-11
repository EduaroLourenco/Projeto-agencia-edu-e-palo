import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { paginaUnica } from "./scripts/pagina-unica.ts";

/**
 * Três alvos.
 *
 * O normal é o de sempre: arquivos separados, com hash, pra hospedar.
 *
 * O modo "demo" (`npm run demo`) monta a plataforma inteira num HTML só —
 * CSS, JS e as fotos em base64 — pra mandar por link e o cliente abrir no
 * celular sem servidor nenhum atrás. É o que a gente entrega numa reunião.
 *
 * O modo "pages" (`npm run build:pages`) é o site público no GitHub Pages:
 * arquivos separados, porque aí o navegador guarda cada um em cache e a
 * segunda visita é instantânea, mas servido de dentro de uma subpasta
 * (`/nome-do-repositorio/`). Daí o `base` — sem ele, a página procura o JS
 * na raiz do domínio e abre em branco.
 */
const REPOSITORIO = "Projeto-agencia-edu-e-palo";

export default defineConfig(({ mode }) => {
  const demo = mode === "demo";
  const pages = mode === "pages";
  return {
    plugins: [react(), tailwindcss(), ...(demo ? [paginaUnica()] : [])],
    server: { port: 5180 },
    base: pages ? `/${REPOSITORIO}/` : "/",
    build: demo
      ? {
          cssCodeSplit: false,
          assetsInlineLimit: () => true,
          rollupOptions: { output: { codeSplitting: false } },
        }
      : {},
  };
});
