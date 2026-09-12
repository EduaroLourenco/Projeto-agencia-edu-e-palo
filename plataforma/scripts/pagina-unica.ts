import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import type { Plugin } from "vite";

/**
 * Costura o build inteiro num arquivo só.
 *
 * O Vite já embutiu as fotos em base64 (assetsInlineLimit). O que sobra são
 * um .js e um .css referenciados pelo index.html — este plugin traz os dois
 * pra dentro e apaga os avulsos. Sai:
 *
 *   dist/index.html   — abre com dois cliques, sem servidor
 *   dist/corpo.html   — o mesmo sem <html>/<head>/<body>, pro publicador
 */
export function paginaUnica(): Plugin {
  return {
    name: "pagina-unica",
    enforce: "post",
    apply: "build",
    writeBundle(opcoes, pacote) {
      const dir = opcoes.dir ?? "dist";
      const caminhoHtml = join(dir, "index.html");
      let html = readFileSync(caminhoHtml, "utf8");
      const paraApagar: string[] = [];

      for (const [nome, saida] of Object.entries(pacote)) {
        if (nome.endsWith(".js") && saida.type === "chunk") {
          const tag = new RegExp(`<script[^>]*src="[^"]*${escapar(nome)}"[^>]*></script>`);
          if (!tag.test(html)) continue;
          // Função, não string: o bundle tem "$&" dentro (React usa isso num
          // replace) e como texto de substituição isso vira o próprio match.
          html = html.replace(tag, () => `<script type="module">\n${blindar(saida.code)}\n</script>`);
          paraApagar.push(nome);
        }
        if (nome.endsWith(".css") && saida.type === "asset") {
          const tag = new RegExp(`<link[^>]*href="[^"]*${escapar(nome)}"[^>]*>`);
          if (!tag.test(html)) continue;
          html = html.replace(tag, () => `<style>\n${String(saida.source)}\n</style>`);
          paraApagar.push(nome);
        }
      }

      writeFileSync(caminhoHtml, html);

      // O publicador de artefatos monta o esqueleto por fora e só aceita o
      // miolo. O Vite põe o script no <head>; aqui ele desce pro fim, senão
      // roda antes da div#root existir.
      const scripts = [...html.matchAll(/<script type="module">[\s\S]*?<\/script>/g)].map((m) => m[0]);
      const corpo = [
        pegar(html, /<title>[\s\S]*?<\/title>/),
        pegar(html, /<style>[\s\S]*?<\/style>/),
        pegar(html, /<body[^>]*>([\s\S]*)<\/body>/, 1).replace(
          /<script type="module">[\s\S]*?<\/script>/g,
          "",
        ),
        ...scripts,
      ]
        .filter(Boolean)
        .join("\n");
      writeFileSync(join(dir, "corpo.html"), corpo);

      for (const nome of paraApagar) rmSync(join(dir, nome), { force: true });
    },
  };
}

function escapar(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** "</script" dentro de uma string do bundle fecharia a tag antes da hora. */
function blindar(codigo: string) {
  return codigo.replace(/<\/script/gi, "<\\/script");
}

function pegar(html: string, re: RegExp, grupo = 0) {
  return html.match(re)?.[grupo]?.trim() ?? "";
}
