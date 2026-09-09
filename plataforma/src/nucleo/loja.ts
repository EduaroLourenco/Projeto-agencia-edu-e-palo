import type { BlocoNaPagina, Loja, TipoPagina } from "./tipos";
import { DEMOS } from "../../demos/indice";
import { montarLoja, paraSlug, type IdModelo } from "./modelos";

/**
 * De onde vem a loja.
 *
 * Hoje: dos arquivos em `demos/`, com as edições do estúdio por cima,
 * guardadas em localStorage. Amanhã: da API. Esta é a única peça que muda —
 * por isso tudo passa por aqui e nada importa `demos/` direto.
 */

const CHAVE_RASCUNHO = (slug: string) => `plataforma:rascunho:${slug}`;
const CHAVE_PUBLICADO = (slug: string) => `plataforma:publicado:${slug}`;
const CHAVE_VERSAO = "plataforma:versao-demos";

/**
 * Sobe quando as demos mudam de conteúdo.
 *
 * Sem isto, quem já tinha mexido no estúdio ficava preso na versão antiga
 * pra sempre: o que estava salvo no navegador era mesclado POR CIMA da demo
 * nova, e a atualização simplesmente não aparecia. Foi exatamente o que
 * aconteceu — as lojas novas existiam no código e ninguém via.
 *
 * Numa versão nova, o que estava salvo é descartado uma vez só. É aceitável
 * porque isto é demonstração; quando houver API, a migração é do servidor.
 */
const VERSAO_DEMOS = "2026-09-09-blocos-e-estilo";

function limparSeVelho() {
  try {
    if (localStorage.getItem(CHAVE_VERSAO) === VERSAO_DEMOS) return;
    // Só o que é edição das DEMOS. Loja que o lojista criou é dele: uma
    // atualização nossa não pode apagar o trabalho dele.
    const proprias = new Set(Object.keys(criadas()));
    for (const chave of Object.keys(localStorage)) {
      const slug = chave.replace(/^plataforma:(rascunho|publicado):/, "");
      if (slug === chave || proprias.has(slug)) continue;
      localStorage.removeItem(chave);
    }
    localStorage.setItem(CHAVE_VERSAO, VERSAO_DEMOS);
  } catch {
    /* navegador sem storage: segue com a demo de fábrica */
  }
}

const CHAVE_CRIADAS = "plataforma:lojas";

/**
 * As lojas que o lojista criou, além das três demos.
 *
 * É o que separa "três demonstrações fixas" de um estúdio: aqui ele abre
 * uma loja nova, escolhe um modelo e sai com uma vitrine montada.
 */
function criadas(): Record<string, Loja> {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CRIADAS) ?? "{}") as Record<string, Loja>;
  } catch {
    return {};
  }
}

function gravarCriadas(mapa: Record<string, Loja>) {
  return gravar(CHAVE_CRIADAS, mapa);
}

/** A base de uma loja: a demo de fábrica ou a loja que foi criada aqui. */
function base(slug: string): Loja | null {
  return DEMOS[slug] ?? criadas()[slug] ?? null;
}

export function slugsDisponiveis(): string[] {
  return [...Object.keys(DEMOS), ...Object.keys(criadas())];
}

/** Todas as lojas prontas pra listar na galeria, com o que já foi publicado. */
export function listarLojas(): { loja: Loja; propria: boolean }[] {
  limparSeVelho();
  const proprias = criadas();
  return [
    ...Object.keys(DEMOS).map((slug) => ({ loja: carregarLoja(slug)!, propria: false })),
    ...Object.keys(proprias).map((slug) => ({ loja: carregarLoja(slug)!, propria: true })),
  ].filter((x) => x.loja);
}

export function criarLoja(dados: { nome: string; whatsapp: string; modelo: IdModelo }) {
  const usados = new Set(slugsDisponiveis());
  let slug = paraSlug(dados.nome);
  let n = 2;
  while (usados.has(slug)) slug = `${paraSlug(dados.nome)}-${n++}`;

  const loja = montarLoja({ ...dados, slug });
  const r = gravarCriadas({ ...criadas(), [slug]: loja });
  return r.ok ? { ok: true as const, slug } : { ok: false as const, erro: r.erro };
}

export function duplicarLoja(slug: string, nome: string) {
  const origem = carregarLoja(slug);
  if (!origem) return { ok: false as const, erro: "Loja não encontrada." };
  const usados = new Set(slugsDisponiveis());
  let novoSlug = paraSlug(nome);
  let n = 2;
  while (usados.has(novoSlug)) novoSlug = `${paraSlug(nome)}-${n++}`;

  const copia: Loja = JSON.parse(JSON.stringify({ ...origem, slug: novoSlug, nome }));
  const r = gravarCriadas({ ...criadas(), [novoSlug]: copia });
  return r.ok ? { ok: true as const, slug: novoSlug } : { ok: false as const, erro: r.erro };
}

/** Some de vez. Só vale pra loja criada aqui — demo se restaura, não se apaga. */
export function apagarLoja(slug: string) {
  if (DEMOS[slug]) return;
  const mapa = criadas();
  delete mapa[slug];
  gravarCriadas(mapa);
  localStorage.removeItem(CHAVE_RASCUNHO(slug));
  localStorage.removeItem(CHAVE_PUBLICADO(slug));
}

function clonar<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** A loja como o comprador vê: demo + o que já foi publicado. */
export function carregarLoja(slug: string): Loja | null {
  limparSeVelho();
  const original = base(slug);
  if (!original) return null;
  try {
    const publicado = localStorage.getItem(CHAVE_PUBLICADO(slug));
    if (publicado) return { ...clonar(original), ...(JSON.parse(publicado) as Partial<Loja>) };
  } catch {
    /* ignora rascunho corrompido e serve a loja original */
  }
  return clonar(original);
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
/**
 * O que de uma loja é editável — e portanto salvo.
 *
 * `ofertas` e `config` entraram quando o painel ganhou cadastro de item:
 * sem eles, criar um produto funcionava na tela e sumia no F5.
 */
function editavel(loja: Loja) {
  const { paginas, tema, modulos, nome, descricao, whatsapp, aberta, logoUrl, ofertas, config } = loja;
  return { paginas, tema, modulos, nome, descricao, whatsapp, aberta, logoUrl, ofertas, config };
}

/**
 * Grava, avisando quando o navegador não aceita mais.
 *
 * Foto vira base64 e base64 pesa. O limite do localStorage fica perto de
 * 5 MB e estourar ele lança — sem este aviso, o lojista subia a sexta foto
 * e a loja inteira parava de salvar em silêncio.
 */
function gravar(chave: string, valor: unknown): { ok: true } | { ok: false; erro: string } {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return { ok: true };
  } catch {
    return {
      ok: false,
      erro: "O navegador ficou sem espaço. Apague algumas fotos pesadas ou restaure a loja.",
    };
  }
}

export function salvarRascunho(loja: Loja) {
  return gravar(CHAVE_RASCUNHO(loja.slug), editavel(loja));
}

export function publicar(loja: Loja) {
  const r = gravar(CHAVE_PUBLICADO(loja.slug), editavel(loja));
  if (r.ok) localStorage.removeItem(CHAVE_RASCUNHO(loja.slug));
  return r;
}

/**
 * Salva direto no ar, sem passar por rascunho.
 *
 * É o caminho do painel: preço de produto e telefone da loja não são
 * "layout em construção" — quando o lojista muda, é porque mudou mesmo.
 */
export function salvarLoja(loja: Loja) {
  return gravar(CHAVE_PUBLICADO(loja.slug), editavel(loja));
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
