import type { DadosCheckout, LinhaResolvida, Pedido } from "./tipos";

/**
 * O pedido fica guardado E vai pro WhatsApp.
 *
 * Sem histórico não existe "repetir último pedido" — e esse é o botão que o
 * comprador B2B mais usa. Hoje o histórico é local, do navegador do
 * comprador; quando a API entrar, só esta camada muda.
 */

const CHAVE = (slug: string) => `plataforma:pedidos:${slug}`;
const LIMITE = 30;

export function salvarPedido(params: {
  lojaSlug: string;
  linhas: LinhaResolvida[];
  total: number;
  passos: DadosCheckout;
  mensagem: string;
}): Pedido {
  const pedido: Pedido = {
    id: `p_${Date.now().toString(36)}`,
    criadoEm: Date.now(),
    ...params,
  };
  try {
    const anteriores = listarPedidos(params.lojaSlug);
    localStorage.setItem(CHAVE(params.lojaSlug), JSON.stringify([pedido, ...anteriores].slice(0, LIMITE)));
  } catch {
    /* não perder a venda por causa de storage cheio */
  }
  return pedido;
}

export function listarPedidos(slug: string): Pedido[] {
  try {
    const bruto = localStorage.getItem(CHAVE(slug));
    return bruto ? (JSON.parse(bruto) as Pedido[]) : [];
  } catch {
    return [];
  }
}

export function ultimoPedido(slug: string): Pedido | null {
  return listarPedidos(slug)[0] ?? null;
}
