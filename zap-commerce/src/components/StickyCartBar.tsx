import { formatarReal } from "../lib/format";

export function StickyCartBar({
  totalPecas,
  subtotal,
  atacadoAtivo,
  onAbrirSacola,
}: {
  totalPecas: number;
  subtotal: number;
  atacadoAtivo: boolean;
  onAbrirSacola: () => void;
}) {
  if (totalPecas === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-md animate-slide-up px-4 pb-4">
      <button
        onClick={onAbrirSacola}
        className="flex w-full items-center justify-between rounded-2xl bg-ink px-4 py-3.5 text-white shadow-xl shadow-black/20 transition-transform active:scale-[0.98]"
      >
        <span className="flex items-center gap-2.5 text-left">
          <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-500 px-1.5 text-xs font-bold">
            {totalPecas}
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold">{formatarReal(subtotal)}</span>
            {atacadoAtivo && <span className="text-[10px] text-lime-400">preço de atacado ✓</span>}
          </span>
        </span>
        <span className="rounded-full bg-white/15 px-3.5 py-2 text-xs font-bold">Ver sacola</span>
      </button>
    </div>
  );
}
