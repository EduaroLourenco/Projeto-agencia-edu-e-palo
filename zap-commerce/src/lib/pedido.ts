import type { ItemCarrinho, Produto, RegraAtacado } from "../types";
import type { LinhaPedido } from "./whatsapp";
import { formatarReal } from "./format";

export interface ResumoPedido {
  linhas: LinhaPedido[];
  atacadoAtivo: boolean;
  subtotal: number;
  progressoAtual: number;
  regraDescricao: string;
}

export function calcularResumoPedido(
  itens: ItemCarrinho[],
  produtos: Produto[],
  regra: RegraAtacado,
): ResumoPedido {
  const porId = new Map(produtos.map((p) => [p.id, p]));

  const totalPecas = itens.reduce((acc, i) => acc + i.quantidade, 0);
  const subtotalVarejo = itens.reduce((acc, i) => {
    const p = porId.get(i.produtoId);
    return p ? acc + p.precoVarejo * i.quantidade : acc;
  }, 0);

  const progressoAtual = regra.tipo === "quantidade" ? totalPecas : subtotalVarejo;
  const atacadoAtivo = progressoAtual >= regra.minimo;

  const linhas: LinhaPedido[] = itens
    .map((i) => {
      const produto = porId.get(i.produtoId);
      if (!produto) return null;
      const precoUnitario = atacadoAtivo ? produto.precoAtacado : produto.precoVarejo;
      return { produto, tamanho: i.tamanho, quantidade: i.quantidade, precoUnitario };
    })
    .filter((l): l is LinhaPedido => l !== null);

  const subtotal = linhas.reduce((acc, l) => acc + l.precoUnitario * l.quantidade, 0);

  const regraDescricao =
    regra.tipo === "quantidade"
      ? `Acima de ${regra.minimo} peças`
      : `Pedidos acima de ${formatarReal(regra.minimo)}`;

  return { linhas, atacadoAtivo, subtotal, progressoAtual, regraDescricao };
}
