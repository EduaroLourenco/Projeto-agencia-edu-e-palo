import type { DadosCheckout, LinhaResolvida, Pedido, StatusPedido } from "./tipos";

/**
 * O pedido fica guardado E vai pro WhatsApp.
 *
 * Sem histórico não existe "repetir último pedido" — e esse é o botão que o
 * comprador B2B mais usa. Hoje o histórico é local, do navegador do
 * comprador; quando a API entrar, só esta camada muda.
 */

const CHAVE = (slug: string) => `plataforma:pedidos:${slug}`;
const LIMITE = 200;

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
    status: "novo",
    cliente: extrairCliente(params.passos),
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

/**
 * Tira nome e telefone de onde o checkout tiver posto.
 *
 * Cada módulo nomeia os campos do seu jeito, e o núcleo não conhece módulo.
 * Então aqui é uma varredura por nomes prováveis — feio, mas honesto: é o
 * preço de não ter tabela de cliente ainda.
 */
function extrairCliente(passos: DadosCheckout): { nome?: string; telefone?: string } | undefined {
  let nome: string | undefined;
  let telefone: string | undefined;
  for (const respostas of Object.values(passos ?? {})) {
    for (const [chave, valor] of Object.entries(respostas ?? {})) {
      if (typeof valor !== "string" || !valor.trim()) continue;
      const c = chave.toLowerCase();
      if (!nome && (c.includes("nome") || c.includes("razao"))) nome = valor.trim();
      if (!telefone && (c.includes("tel") || c.includes("whats") || c.includes("celular"))) telefone = valor.trim();
    }
  }
  return nome || telefone ? { nome, telefone } : undefined;
}

export function atualizarStatus(slug: string, id: string, status: StatusPedido) {
  const lista = listarPedidos(slug).map((p) => (p.id === id ? { ...p, status } : p));
  try {
    localStorage.setItem(CHAVE(slug), JSON.stringify(lista));
  } catch {
    /* storage cheio: o status não grava, mas o pedido não se perde */
  }
  return lista;
}

/** Apaga tudo de uma loja. Usado ao restaurar a demo. */
export function limparPedidos(slug: string) {
  localStorage.removeItem(CHAVE(slug));
}
