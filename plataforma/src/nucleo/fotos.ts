import { pesoEmKB, prepararImagem } from "./imagem";

/**
 * O BANCO DE FOTOS
 *
 * Toda foto que entra na loja passa a morar aqui também. É o que transforma
 * "subir a foto de novo em cada bloco" em "escolher a foto que já subi" — e
 * é a diferença entre montar uma loja em vinte minutos e desistir na metade.
 *
 * Hoje as fotos são base64 no navegador, e por isso existe um teto: o
 * localStorage inteiro tem ~5 MB e a loja também mora nele. Quando a galeria
 * do aparelho e o servidor entrarem, só este arquivo muda.
 */

export interface Foto {
  id: string;
  url: string;
  nome: string;
  kb: number;
  criadaEm: number;
}

const CHAVE = "plataforma:fotos";

/** Teto de segurança: acima disso a loja não cabe mais no navegador. */
export const TETO_KB = 2600;

export function listarFotos(): Foto[] {
  try {
    const fotos = JSON.parse(localStorage.getItem(CHAVE) ?? "[]") as Foto[];
    return fotos.sort((a, b) => b.criadaEm - a.criadaEm);
  } catch {
    return [];
  }
}

export function pesoDoBanco(): number {
  return listarFotos().reduce((a, f) => a + f.kb, 0);
}

function gravar(fotos: Foto[]): boolean {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(fotos));
    return true;
  } catch {
    return false;
  }
}

/**
 * Prepara e guarda. Devolve a URL pra quem pediu usar na hora.
 *
 * A mesma foto subida duas vezes não vira duas: comparar a data URI inteira
 * é barato o bastante nesta escala e evita o banco inchar em silêncio.
 */
export async function guardarFoto(
  arquivo: File,
  opcoes: { lado?: number; quadrada?: boolean } = {},
): Promise<{ ok: true; foto: Foto } | { ok: false; erro: string }> {
  let url: string;
  try {
    ({ url } = await prepararImagem(arquivo, { lado: opcoes.lado ?? 1000, quadrada: opcoes.quadrada }));
  } catch (e) {
    return { ok: false, erro: e instanceof Error ? e.message : "Não consegui usar esta imagem." };
  }

  const fotos = listarFotos();
  const igual = fotos.find((f) => f.url === url);
  if (igual) return { ok: true, foto: igual };

  const foto: Foto = {
    id: `f_${Date.now().toString(36)}`,
    url,
    nome: arquivo.name.replace(/\.[^.]+$/, "").slice(0, 40) || "foto",
    kb: pesoEmKB(url),
    criadaEm: Date.now(),
  };

  if (pesoDoBanco() + foto.kb > TETO_KB) {
    return {
      ok: false,
      erro: `O banco de fotos chegou no limite deste navegador (${TETO_KB} KB). Apague alguma foto antiga antes de subir esta.`,
    };
  }
  if (!gravar([foto, ...fotos])) {
    return { ok: false, erro: "O navegador ficou sem espaço. Apague algumas fotos e tente de novo." };
  }
  return { ok: true, foto };
}

export function apagarFoto(id: string) {
  gravar(listarFotos().filter((f) => f.id !== id));
}

export function renomearFoto(id: string, nome: string) {
  gravar(listarFotos().map((f) => (f.id === id ? { ...f, nome } : f)));
}

/** Só as URLs, que é o que os controles do estúdio consomem. */
export function urlsDoBanco(): string[] {
  return listarFotos().map((f) => f.url);
}
