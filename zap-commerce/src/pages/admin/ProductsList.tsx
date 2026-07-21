import { useState } from "react";
import type { Produto } from "../../types";
import { formatarReal } from "../../lib/format";
import { ApiError, atualizarProduto, criarProduto, excluirProduto, resolveImageUrl } from "../../lib/api";
import { ErrorToast } from "../../components/ErrorToast";
import { ProductForm } from "./ProductForm";

const ERRO_GENERICO = "Não foi possível completar a ação. Confira sua conexão e tente de novo.";

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
  const [erroApi, setErroApi] = useState<string | null>(null);

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
    } catch (e) {
      setErroApi(e instanceof ApiError ? e.message : ERRO_GENERICO);
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(p: Produto) {
    if (!confirm(`Remover "${p.nome}" definitivamente?`)) return;
    try {
      await excluirProduto(token, p.id);
      onMudou();
    } catch (e) {
      setErroApi(e instanceof ApiError ? e.message : ERRO_GENERICO);
    }
  }

  return (
    <div className="px-4 pb-24 pt-4 lg:px-0 lg:pb-8 lg:pt-0">
      <div className="mb-3 flex items-center justify-between lg:mb-5">
        <h2 className="font-display text-base font-bold lg:text-xl">
          Suas peças <span className="text-ink/40">({produtos.length})</span>
        </h2>
        <button
          onClick={abrirNovo}
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-white transition-transform active:scale-95 lg:px-5 lg:py-2.5"
        >
          + Nova Peça
        </button>
      </div>

      {produtos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 px-4 py-14 text-center text-sm text-ink/40">
          Nenhuma peça cadastrada ainda. Toque em "+ Nova Peça" para começar.
        </div>
      ) : (
        <>
          {/* Cards — mobile/tablet */}
          <div className="flex flex-col gap-2.5 lg:hidden">
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

          {/* Tabela — desktop */}
          <div className="hidden overflow-hidden rounded-2xl border border-black/5 bg-white lg:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 text-xs uppercase tracking-wide text-ink/40">
                  <th className="px-4 py-3 font-semibold">Peça</th>
                  <th className="px-4 py-3 font-semibold">Varejo</th>
                  <th className="px-4 py-3 font-semibold">Atacado</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveImageUrl(p.imageUrl)}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-lg object-cover"
                        />
                        <span className={`font-medium ${p.isAtivo ? "" : "text-ink/40"}`}>{p.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{formatarReal(p.precoVarejo)}</td>
                    <td className="px-4 py-3 text-ink/70">{formatarReal(p.precoAtacado)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {p.isAtivo ? (
                          <span className="rounded-full bg-ok-500/10 px-2 py-0.5 text-[11px] font-bold text-ok-500">
                            Visível
                          </span>
                        ) : (
                          <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] font-bold text-ink/50">
                            Oculto
                          </span>
                        )}
                        {p.isUltimasPecas && (
                          <span className="rounded-full bg-gold-500/15 px-2 py-0.5 text-[11px] font-bold text-gold-500">
                            Últimas peças
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => abrirEdicao(p)}
                          className="rounded-lg bg-ink/5 px-3 py-1.5 text-xs font-semibold hover:bg-ink/10"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => excluir(p)}
                          className="rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-100"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ProductForm
        aberto={formAberto}
        onFechar={() => setFormAberto(false)}
        produto={editando}
        token={token}
        salvando={salvando}
        onSalvar={salvar}
      />

      <ErrorToast mensagem={erroApi} onFechar={() => setErroApi(null)} />
    </div>
  );
}
