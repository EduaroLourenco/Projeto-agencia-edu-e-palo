import type { LojaConfig, Produto } from "../types";

export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export function resolveImageUrl(url: string): string {
  if (!url) return url;
  return url.startsWith("/") ? `${API_BASE}${url}` : url;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const corpo = await res.json().catch(() => ({}) as { message?: string });
    const mensagem = Array.isArray(corpo.message) ? corpo.message.join(", ") : corpo.message;
    throw new ApiError(res.status, mensagem || `Erro ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// ---------- Mapeamento API <-> tipos do front ----------

interface LojaApi {
  id: string;
  slug: string;
  nomeLoja: string;
  aberto: boolean;
  whatsappNumero: string;
  mensagemSaudacao: string;
  regraAtacadoTipo: string;
  regraAtacadoMinimo: number;
  corDestaque: string;
  pontosRetirada: { id: string; tipo: string; nome: string; descricao?: string | null }[];
}

function mapLoja(l: LojaApi): LojaConfig {
  return {
    slug: l.slug,
    nomeLoja: l.nomeLoja,
    aberto: l.aberto,
    whatsappNumero: l.whatsappNumero,
    mensagemSaudacao: l.mensagemSaudacao,
    corDestaque: l.corDestaque,
    regraAtacado: {
      tipo: l.regraAtacadoTipo as "quantidade" | "valor",
      minimo: l.regraAtacadoMinimo,
    },
    pontosRetirada: l.pontosRetirada.map((p) => ({
      id: p.id,
      tipo: p.tipo as "maos" | "excursao" | "correios",
      nome: p.nome,
      descricao: p.descricao ?? undefined,
    })),
  };
}

// ---------- Auth ----------

export async function login(slug: string, senha: string) {
  const data = await request<{ token: string; loja: LojaApi }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ slug, senha }),
  });
  return { token: data.token, loja: mapLoja(data.loja) };
}

export async function registrar(params: {
  slug: string;
  nomeLoja: string;
  whatsappNumero: string;
  senha: string;
}) {
  const data = await request<{ token: string; loja: LojaApi }>("/auth/registrar", {
    method: "POST",
    body: JSON.stringify(params),
  });
  return { token: data.token, loja: mapLoja(data.loja) };
}

// ---------- Lojas ----------

export async function buscarLoja(slug: string): Promise<LojaConfig | null> {
  try {
    const data = await request<LojaApi>(`/lojas/${slug}`);
    return mapLoja(data);
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null;
    throw e;
  }
}

export async function atualizarLoja(token: string, dados: Partial<LojaConfig>): Promise<LojaConfig> {
  const body: Record<string, unknown> = {
    nomeLoja: dados.nomeLoja,
    aberto: dados.aberto,
    whatsappNumero: dados.whatsappNumero,
    mensagemSaudacao: dados.mensagemSaudacao,
  };
  if (dados.regraAtacado) {
    body.regraAtacadoTipo = dados.regraAtacado.tipo;
    body.regraAtacadoMinimo = dados.regraAtacado.minimo;
  }
  if (dados.pontosRetirada) {
    body.pontosRetirada = dados.pontosRetirada;
  }
  const data = await request<LojaApi>("/lojas/me", {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
  return mapLoja(data);
}

// ---------- Produtos ----------

interface ProdutoApi {
  id: string;
  tenantId: string;
  nome: string;
  precoVarejo: number;
  precoAtacado: number;
  categorias: string[];
  tamanhosDisponiveis: string[];
  imageUrl: string;
  instagramReelsUrl?: string;
  isUltimasPecas: boolean;
  isAtivo: boolean;
  criadoEm: number;
}

export async function listarProdutosPublico(slug: string): Promise<Produto[]> {
  return request<ProdutoApi[]>(`/produtos/loja/${slug}`);
}

export async function listarProdutosDoLojista(token: string): Promise<Produto[]> {
  return request<ProdutoApi[]>("/produtos/me", { headers: authHeaders(token) });
}

export async function criarProduto(
  token: string,
  dados: Omit<Produto, "id" | "tenantId" | "criadoEm">,
): Promise<Produto> {
  return request<ProdutoApi>("/produtos", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(dados),
  });
}

export async function atualizarProduto(
  token: string,
  id: string,
  dados: Partial<Omit<Produto, "id" | "tenantId" | "criadoEm">>,
): Promise<Produto> {
  return request<ProdutoApi>(`/produtos/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(dados),
  });
}

export async function excluirProduto(token: string, id: string): Promise<void> {
  await request(`/produtos/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

// ---------- Upload ----------

export async function enviarImagem(token: string, arquivo: File): Promise<string> {
  const form = new FormData();
  form.append("arquivo", arquivo);
  const data = await request<{ imageUrl: string }>("/upload", {
    method: "POST",
    headers: authHeaders(token),
    body: form,
  });
  return data.imageUrl;
}
