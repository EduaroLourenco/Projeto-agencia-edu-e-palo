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
        <div className="flex flex-col items-center justify-center gap-4 px-5 py-16 text-center">
          {/* Ícone ilustrado da sacola vazia */}
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              className="h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 20h24l-3 22H23L20 20z"
                stroke="#f22e69"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d="M26 20c0-3.314 2.686-6 6-6s6 2.686 6 6"
                stroke="#f22e69"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="27" cy="47" r="2" fill="#f22e69" />
              <circle cx="37" cy="47" r="2" fill="#f22e69" />
            </svg>
            {/* Estrelinhas decorativas */}
            <span className="absolute -right-1 -top-1 text-base">✨</span>
          </div>
          <div>
            <p className="font-display text-base font-bold text-ink">Sacola vazia por enquanto</p>
            <p className="mt-1 text-sm text-ink/50">
              Escolha suas peças favoritas e adicione aqui.
            </p>
          </div>
          <p className="rounded-xl bg-brand-50 px-4 py-2.5 text-xs font-semibold text-brand-600">
            👆 Deslize para baixo e explore a vitrine
          </p>
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
