import { useState } from "react";
import type { Produto } from "../../types";
import { formatarReal } from "../../lib/format";
import { atualizarProduto, criarProduto, excluirProduto, resolveImageUrl } from "../../lib/api";
import { ProductForm } from "./ProductForm";

export function ProductsList({
  token,
  produtos,
  onMudou,
}: {
  token: string;
  produtos: Produto[];
  onMudou: () => void;
}) {
  const [formAberto, setFormAberto] = useState(false);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [salvando, setSalvando] = useState(false);

  function abrirNovo() {
    setEditando(null);
    setFormAberto(true);
  }

  function abrirEdicao(p: Produto) {
    setEditando(p);
    setFormAberto(true);
  }

  async function salvar(dados: Omit<Produto, "id" | "tenantId" | "criadoEm">) {
    setSalvando(true);
    try {
      if (editando) {
        await atualizarProduto(token, editando.id, dados);
      } else {
        await criarProduto(token, dados);
      }
      setFormAberto(false);
      onMudou();
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(p: Produto) {
    if (confirm(`Remover "${p.nome}" definitivamente?`)) {
      await excluirProduto(token, p.id);
      onMudou();
    }
  }

  return (
    <div className="px-4 pb-24 pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-bold">
          Suas peças <span className="text-ink/40">({produtos.length})</span>
        </h2>
        <button
          onClick={abrirNovo}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white active:scale-95 transition-transform"
        >
          + Nova Peça
        </button>
      </div>

      {produtos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 px-4 py-14 text-center text-sm text-ink/40">
          Nenhuma peça cadastrada ainda. Toque em "+ Nova Peça" para começar.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {produtos.map((p) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 rounded-2xl border p-2.5 ${
                p.isAtivo ? "border-black/5 bg-white" : "border-black/5 bg-black/5 opacity-60"
              }`}
            >
              <img
                src={resolveImageUrl(p.imageUrl)}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.nome}</p>
                <p className="text-xs text-ink/50">
                  {formatarReal(p.precoVarejo)} · atacado {formatarReal(p.precoAtacado)}
                </p>
                <div className="mt-1 flex gap-1.5">
                  {p.isUltimasPecas && (
                    <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[10px] font-bold text-gold-500">
                      Últimas peças
                    </span>
                  )}
                  {!p.isAtivo && (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold text-ink/50">
                      Oculto da vitrine
                    </span>
                  )}
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5">
                <button
                  onClick={() => abrirEdicao(p)}
                  className="rounded-lg bg-ink/5 px-2.5 py-1.5 text-xs font-semibold"
                >
                  Editar
                </button>
                <button
                  onClick={() => excluir(p)}
                  className="rounded-lg bg-brand-50 px-2.5 py-1.5 text-xs font-semibold text-brand-600"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductForm
        aberto={formAberto}
        onFechar={() => setFormAberto(false)}
        produto={editando}
        token={token}
        salvando={salvando}
        onSalvar={salvar}
      />
    </div>
  );
}
