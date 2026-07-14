import { useState } from "react";
import type { Produto } from "../types";
import { formatarReal } from "../lib/format";
import { resolveImageUrl } from "../lib/api";
import { VideoEmbed } from "./VideoEmbed";

export function ProductCard({
  produto,
  atacadoAtivo,
  onAdicionar,
}: {
  produto: Produto;
  atacadoAtivo: boolean;
  onAdicionar: (tamanho: string, quantidade: number) => void;
}) {
  const [tamanho, setTamanho] = useState(produto.tamanhosDisponiveis[0]);
  const [quantidade, setQuantidade] = useState(1);
  const [confirmado, setConfirmado] = useState(false);

  const precoExibido = atacadoAtivo ? produto.precoAtacado : produto.precoVarejo;

  function adicionar() {
    onAdicionar(tamanho, quantidade);
    setConfirmado(true);
    setQuantidade(1);
    setTimeout(() => setConfirmado(false), 1400);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
      <div className="relative">
        {produto.instagramReelsUrl ? (
          <VideoEmbed url={produto.instagramReelsUrl} imagemCapa={resolveImageUrl(produto.imageUrl)} />
        ) : (
          <div className="aspect-[4/5] w-full overflow-hidden">
            <img
              src={resolveImageUrl(produto.imageUrl)}
              loading="lazy"
              alt={produto.nome}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {produto.isUltimasPecas && (
          <span className="absolute bottom-3 left-3 inline-block rounded-full bg-gold-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
            ⚠️ Últimas peças
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-display text-sm font-semibold leading-snug">{produto.nome}</h3>

        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold text-brand-600">
            {formatarReal(precoExibido)}
          </span>
          <span className="text-xs text-ink/40">/un</span>
          {atacadoAtivo && (
            <span className="text-xs text-ink/40 line-through">{formatarReal(produto.precoVarejo)}</span>
          )}
        </div>
        {!atacadoAtivo && (
          <p className="mt-0.5 text-[11px] text-ink/50">
            No atacado: {formatarReal(produto.precoAtacado)}/un
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          {produto.tamanhosDisponiveis.map((t) => (
            <button
              key={t}
              onClick={() => setTamanho(t)}
              className={`h-8 min-w-8 rounded-lg border px-2 text-xs font-semibold transition-colors ${
                tamanho === t ? "border-ink bg-ink text-white" : "border-black/10 text-ink/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-black/10">
            <button
              onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center text-lg text-ink/60"
              aria-label="Diminuir quantidade"
            >
              –
            </button>
            <span className="w-6 text-center text-sm font-semibold">{quantidade}</span>
            <button
              onClick={() => setQuantidade((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center text-lg text-ink/60"
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <button
            onClick={adicionar}
            className={`flex h-9 flex-1 items-center justify-center rounded-lg text-sm font-semibold text-white transition-all active:scale-95 ${
              confirmado ? "bg-ok-500" : "bg-brand-500"
            }`}
          >
            {confirmado ? "Adicionado ✓" : "Adicionar à Sacola"}
          </button>
        </div>
      </div>
    </article>
  );
}
