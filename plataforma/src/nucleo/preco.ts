import type { ContextoPreco, PrecoResolvido, RegraPreco } from "./tipos";

/**
 * Preço não é um campo, é uma cadeia.
 *
 * Cada regra recebe o preço que veio da anterior e devolve o dela. Guardamos
 * as etapas pelo caminho porque o comprador B2B precisa ver *por que* o preço
 * dele é aquele — "tabela do cliente", "faixa 48+" — e não só o número final.
 */
export function resolverPreco(regras: RegraPreco[], ctx: ContextoPreco): PrecoResolvido {
  const base = ctx.oferta.precoBase;
  let preco = base;
  const etapas: PrecoResolvido["etapas"] = [];

  for (const regra of [...regras].sort((a, b) => a.ordem - b.ordem)) {
    const saida = regra.aplicar(preco, ctx);
    if (!saida || saida.preco === preco) continue;
    etapas.push({ rotulo: saida.rotulo ?? regra.id, de: preco, para: saida.preco });
    preco = saida.preco;
  }

  return { unitario: preco, base, etapas };
}

/** Arredondamento pra baixo no centavo — sempre a última da cadeia. */
export const regraArredondar: RegraPreco = {
  id: "arredondar",
  ordem: 90,
  aplicar: (preco) => {
    const arredondado = Math.floor(preco * 100) / 100;
    return arredondado === preco ? null : { preco: arredondado, rotulo: "Arredondamento" };
  },
};

export function formatarReal(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatarNumero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}
