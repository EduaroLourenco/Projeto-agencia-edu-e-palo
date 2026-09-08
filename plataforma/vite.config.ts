import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { paginaUnica } from "./scripts/pagina-unica.ts";

/**
 * Dois alvos.
 *
 * O normal é o de sempre: arquivos separados, com hash, pra hospedar.
 *
 * O modo "demo" (`npm run demo`) monta a plataforma inteira num HTML só —
 * CSS, JS e as fotos em base64 — pra mandar por link e o cliente abrir no
 * celular sem servidor nenhum atrás. É o que a gente entrega numa reunião.
 */
export default defineConfig(({ mode }) => {
  const demo = mode === "demo";
  return {
    plugins: [react(), tailwindcss(), ...(demo ? [paginaUnica()] : [])],
    server: { port: 5180 },
    build: demo
      ? {
          cssCodeSplit: false,
          assetsInlineLimit: () => true,
          rollupOptions: { output: { codeSplitting: false } },
        }
      : {},
  };
});
