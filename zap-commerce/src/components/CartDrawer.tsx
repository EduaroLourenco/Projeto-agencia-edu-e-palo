import type { RegraAtacado } from "../types";
import type { LinhaPedido } from "../lib/whatsapp";
import { formatarReal } from "../lib/format";
import { resolveImageUrl } from "../lib/api";
import { BottomSheet } from "./BottomSheet";
import { WholesaleProgressBar } from "./WholesaleProgressBar";

export function CartDrawer({
  aberto,
  onFechar,
  linhas,
  subtotal,
  regra,
  progressoAtual,
  atacadoAtivo,
  onAtualizarQuantidade,
  onIrParaCheckout,
}: {
  aberto: boolean;
  onFechar: () => void;
  linhas: LinhaPedido[];
  subtotal: number;
  regra: RegraAtacado;
  progressoAtual: number;
  atacadoAtivo: boolean;
  onAtualizarQuantidade: (produtoId: string, tamanho: string, quantidade: number) => void;
  onIrParaCheckout: () => void;
}) {
  return (
    <BottomSheet aberto={aberto} onFechar={onFechar} titulo="Sua Sacola">
      {linhas.length === 0 ? (
        <div className="px-5 py-14 text-center text-sm text-ink/40">
          Sua sacola está vazia. Volte e escolha suas peças favoritas!
        </div>
      ) : (
        <>
          <div className="pt-3">
            <WholesaleProgressBar regra={regra} progressoAtual={progressoAtual} />
          </div>

          <div className="flex flex-col gap-3 px-4 pb-3">
            {linhas.map((l) => (
              <div
                key={`${l.produto.id}-${l.tamanho}`}
                className="flex items-center gap-3 rounded-xl border border-black/5 bg-white p-2.5"
              >
                <img
                  src={resolveImageUrl(l.produto.imageUrl)}
                  alt={l.produto.nome}
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{l.produto.nome}</p>
                  <p className="text-xs text-ink/50">
                    Tam. {l.tamanho} · {formatarReal(l.precoUnitario)}/un
                  </p>
                </div>
                <div className="flex items-center rounded-lg border border-black/10">
                  <button
                    onClick={() =>
                      onAtualizarQuantidade(l.produto.id, l.tamanho, l.quantidade - 1)
                    }
                    className="flex h-8 w-8 items-center justify-center text-ink/60"
                    aria-label="Diminuir"
                  >
                    –
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">{l.quantidade}</span>
                  <button
                    onClick={() =>
                      onAtualizarQuantidade(l.produto.id, l.tamanho, l.quantidade + 1)
                    }
                    className="flex h-8 w-8 items-center justify-center text-ink/60"
                    aria-label="Aumentar"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 border-t border-black/5 bg-paper px-5 py-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm text-ink/60">
                Total {atacadoAtivo && <span className="text-ok-500">(preço atacado)</span>}
              </span>
              <span className="font-display text-xl font-bold">{formatarReal(subtotal)}</span>
            </div>
            <button
              onClick={onIrParaCheckout}
              className="w-full rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white active:scale-95 transition-transform"
            >
              Finalizar Pedido pelo WhatsApp
            </button>
          </div>
        </>
      )}
    </BottomSheet>
  );
}
