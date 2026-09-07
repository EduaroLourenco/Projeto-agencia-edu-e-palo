import type { BlocoNaPagina, Loja, TipoPagina } from "./tipos";
import { DEMOS } from "../../demos/indice";

/**
 * De onde vem a loja.
 *
 * Hoje: dos arquivos em `demos/`, com as edições do estúdio por cima,
 * guardadas em localStorage. Amanhã: da API. Esta é a única peça que muda —
 * por isso tudo passa por aqui e nada importa `demos/` direto.
 */

const CHAVE_RASCUNHO = (slug: string) => `plataforma:rascunho:${slug}`;
const CHAVE_PUBLICADO = (slug: string) => `plataforma:publicado:${slug}`;

export function slugsDisponiveis(): string[] {
  return Object.keys(DEMOS);
}

function clonar<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** A loja como o comprador vê: demo + o que já foi publicado. */
export function carregarLoja(slug: string): Loja | null {
  const base = DEMOS[slug];
  if (!base) return null;
  try {
    const publicado = localStorage.getItem(CHAVE_PUBLICADO(slug));
    if (publicado) return { ...clonar(base), ...(JSON.parse(publicado) as Partial<Loja>) };
  } catch {
    /* ignora rascunho corrompido e serve a demo original */
  }
  return clonar(base);
}

/** A loja como o lojista está mexendo: inclui o que ainda não publicou. */
export function carregarRascunho(slug: string): Loja | null {
  const publicada = carregarLoja(slug);
  if (!publicada) return null;
  try {
    const rascunho = localStorage.getItem(CHAVE_RASCUNHO(slug));
    if (rascunho) return { ...publicada, ...(JSON.parse(rascunho) as Partial<Loja>) };
  } catch {
    /* idem */
  }
  return publicada;
}

/**
 * Salva sem publicar. É o que permite montar a loja inteira na frente do
 * cliente sem a loja no ar mudar enquanto isso.
 */
export function salvarRascunho(loja: Loja) {
  const { paginas, tema, modulos, nome, descricao, whatsapp } = loja;
  localStorage.setItem(
    CHAVE_RASCUNHO(loja.slug),
    JSON.stringify({ paginas, tema, modulos, nome, descricao, whatsapp }),
  );
}

export function publicar(loja: Loja) {
  const { paginas, tema, modulos, nome, descricao, whatsapp } = loja;
  localStorage.setItem(
    CHAVE_PUBLICADO(loja.slug),
    JSON.stringify({ paginas, tema, modulos, nome, descricao, whatsapp }),
  );
  localStorage.removeItem(CHAVE_RASCUNHO(loja.slug));
}

export function temRascunho(slug: string): boolean {
  return localStorage.getItem(CHAVE_RASCUNHO(slug)) !== null;
}

export function descartarRascunho(slug: string) {
  localStorage.removeItem(CHAVE_RASCUNHO(slug));
}

/** Volta a loja pro estado de fábrica. Útil na demo, e o cliente adora ver. */
export function restaurarDemo(slug: string) {
  localStorage.removeItem(CHAVE_RASCUNHO(slug));
  localStorage.removeItem(CHAVE_PUBLICADO(slug));
}

export function blocosDaPagina(loja: Loja, pagina: TipoPagina): BlocoNaPagina[] {
  return loja.paginas[pagina] ?? [];
}
