/**
 * Quem está usando o sistema.
 *
 * Ainda não existe servidor, então a conta mora no navegador e as contas de
 * teste ficam em código — foi o combinado. Quando o banco entrar, só este
 * arquivo muda: o resto do sistema pergunta `usarSessao()` e não sabe de
 * onde veio a resposta.
 */

export type Plano = "essencial" | "profissional" | "estudio";

export interface Conta {
  id: string;
  nome: string;
  email: string;
  /** Nunca guarde senha assim em produção. Aqui é demonstração. */
  senha: string;
  telefone?: string;
  negocio?: string;
  plano: Plano;
  criadoEm: number;
  /** Slugs das lojas desta conta. */
  lojas: string[];
}

export const PLANOS: {
  id: Plano;
  nome: string;
  preco: number;
  chamada: string;
  inclui: string[];
  destaque?: boolean;
}[] = [
  {
    id: "essencial",
    nome: "Essencial",
    preco: 79,
    chamada: "Pra quem está começando a vender pelo WhatsApp.",
    inclui: ["1 loja", "Catálogo ilimitado", "Pedido no WhatsApp", "Estúdio completo"],
  },
  {
    id: "profissional",
    nome: "Profissional",
    preco: 149,
    chamada: "Pra quem já vende e quer organizar.",
    inclui: ["3 lojas", "Tudo do Essencial", "Pedidos com status", "Métricas do negócio", "Atacado e agenda"],
    destaque: true,
  },
  {
    id: "estudio",
    nome: "Estúdio",
    preco: 349,
    chamada: "Pra agência que monta loja pra cliente.",
    inclui: ["Lojas ilimitadas", "Tudo do Profissional", "Marca própria no painel", "Suporte prioritário"],
  },
];

const CHAVE_CONTAS = "plataforma:contas";
const CHAVE_SESSAO = "plataforma:sessao";

/**
 * As contas de teste, em código.
 *
 * Entrar com qualquer uma delas já cai num painel com loja e histórico —
 * é o caminho pra testar sem preencher cadastro toda vez.
 */
export const CONTAS_DE_TESTE: Conta[] = [
  {
    id: "conta-demo",
    nome: "Eduardo Lourenço",
    email: "demo@zap.com",
    senha: "123456",
    negocio: "Agência",
    plano: "estudio",
    criadoEm: Date.now(),
    lojas: ["vale-verde", "bella-atacado", "studio-nara"],
  },
];

function lerContas(): Conta[] {
  try {
    const salvas = JSON.parse(localStorage.getItem(CHAVE_CONTAS) ?? "[]") as Conta[];
    // As de teste sempre existem; as salvas vêm por cima se o e-mail bater.
    const porEmail = new Map(CONTAS_DE_TESTE.map((c) => [c.email, c]));
    for (const c of salvas) porEmail.set(c.email, c);
    return [...porEmail.values()];
  } catch {
    return [...CONTAS_DE_TESTE];
  }
}

function gravarContas(contas: Conta[]) {
  const proprias = contas.filter((c) => !CONTAS_DE_TESTE.some((t) => t.email === c.email));
  try {
    localStorage.setItem(CHAVE_CONTAS, JSON.stringify(proprias));
    return true;
  } catch {
    return false;
  }
}

export function entrar(email: string, senha: string): { ok: true; conta: Conta } | { ok: false; erro: string } {
  const conta = lerContas().find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
  if (!conta) return { ok: false, erro: "Não achei uma conta com esse e-mail." };
  if (conta.senha !== senha) return { ok: false, erro: "Senha errada. Confira e tente de novo." };
  localStorage.setItem(CHAVE_SESSAO, conta.id);
  return { ok: true, conta };
}

export function criarConta(dados: {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  negocio?: string;
  plano: Plano;
}): { ok: true; conta: Conta } | { ok: false; erro: string } {
  const contas = lerContas();
  if (contas.some((c) => c.email.toLowerCase() === dados.email.trim().toLowerCase())) {
    return { ok: false, erro: "Já existe uma conta com esse e-mail. Entre em vez de criar." };
  }
  const conta: Conta = {
    id: `conta-${Date.now().toString(36)}`,
    ...dados,
    email: dados.email.trim(),
    criadoEm: Date.now(),
    lojas: [],
  };
  if (!gravarContas([...contas, conta])) {
    return { ok: false, erro: "O navegador ficou sem espaço pra salvar a conta." };
  }
  localStorage.setItem(CHAVE_SESSAO, conta.id);
  return { ok: true, conta };
}

export function contaAtual(): Conta | null {
  const id = localStorage.getItem(CHAVE_SESSAO);
  if (!id) return null;
  return lerContas().find((c) => c.id === id) ?? null;
}

export function sair() {
  localStorage.removeItem(CHAVE_SESSAO);
}

/** Registra uma loja nova na conta de quem criou. */
export function vincularLoja(slug: string) {
  const conta = contaAtual();
  if (!conta || conta.lojas.includes(slug)) return;
  const contas = lerContas().map((c) => (c.id === conta.id ? { ...c, lojas: [...c.lojas, slug] } : c));
  gravarContas(contas);
}

export function desvincularLoja(slug: string) {
  const contas = lerContas().map((c) => ({ ...c, lojas: c.lojas.filter((s) => s !== slug) }));
  gravarContas(contas);
}

export function limiteDeLojas(plano: Plano): number {
  return plano === "essencial" ? 1 : plano === "profissional" ? 3 : 99;
}
