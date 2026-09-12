import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { paginaUnica } from "./scripts/pagina-unica.ts";

/**
 * Dois alvos.
 *
 * O normal (`npm run build`) é o site que vai pra Vercel: arquivos
 * separados, com hash no nome, pro navegador guardar em cache e a segunda
 * visita ser instantânea. O endereço das páginas é limpo — /vale-verde —
 * porque o `vercel.json` manda qualquer caminho cair no index.html.
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
