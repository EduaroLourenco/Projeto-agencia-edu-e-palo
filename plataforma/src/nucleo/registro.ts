import type { DefinicaoBloco, Modulo, TipoPagina } from "./tipos";

/**
 * Onde blocos e módulos se cadastram.
 *
 * O estúdio e a vitrine só conversam com este registro — nenhum dos dois
 * importa um bloco pelo nome. É isso que faz bloco novo aparecer no editor
 * sem ninguém mexer no editor.
 */

const blocos = new Map<string, DefinicaoBloco<never>>();
const modulos = new Map<string, Modulo>();

export function registrarBloco(def: DefinicaoBloco<never>) {
  if (blocos.has(def.tipo)) {
    console.warn(`[registro] bloco "${def.tipo}" registrado duas vezes — ignorando o segundo`);
    return;
  }
  blocos.set(def.tipo, def);
}

export function registrarModulo(modulo: Modulo) {
  modulos.set(modulo.id, modulo);
  // Um módulo publica os blocos dele junto. Ligar o módulo faz o bloco
  // aparecer no catálogo do estúdio, sem cadastro separado.
  modulo.blocos?.forEach((b) => registrarBloco({ ...b, exigeModulo: modulo.id }));
}

export function bloco(tipo: string): DefinicaoBloco<never> | undefined {
  return blocos.get(tipo);
}

export function todosOsBlocos(): DefinicaoBloco<never>[] {
  return [...blocos.values()];
}

export function modulo(id: string): Modulo | undefined {
  return modulos.get(id);
}

export function modulosAtivos(ids: string[]): Modulo[] {
  return ids.map((id) => modulos.get(id)).filter((m): m is Modulo => m !== undefined);
}

export function todosOsModulos(): Modulo[] {
  return [...modulos.values()];
}

/** O que o lojista pode inserir nesta página, com os módulos que ele ligou. */
export function blocosDisponiveis(pagina: TipoPagina, modulosLigados: string[]): DefinicaoBloco<never>[] {
  return todosOsBlocos()
    .filter((b) => b.paginas.includes(pagina))
    .filter((b) => !b.ancora)
    .filter((b) => !b.exigeModulo || modulosLigados.includes(b.exigeModulo))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

/** Valores iniciais de um bloco, lidos da declaração de campos. */
export function propsPadrao(def: DefinicaoBloco<never>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [chave, campo] of Object.entries(def.campos)) {
    if (campo.tipo === "lista") out[chave] = campo.padrao ?? [];
    else if ("padrao" in campo && campo.padrao !== undefined) out[chave] = campo.padrao;
    else if (campo.tipo === "simNao") out[chave] = false;
    else if (campo.tipo === "numero") out[chave] = 0;
    else out[chave] = "";
  }
  if (def.variantes?.length) out.variante = def.variantes[0].valor;
  return out;
}
