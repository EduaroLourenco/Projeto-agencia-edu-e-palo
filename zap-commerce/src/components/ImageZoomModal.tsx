import { useEffect } from "react";
import { X } from "lucide-react";
import type { Produto } from "../types";
import { resolveImageUrl } from "../lib/api";
import { formatarReal } from "../lib/format";

export function ImageZoomModal({
  produto,
  onFechar,
}: {
  produto: Produto | null;
  onFechar: () => void;
}) {
  useEffect(() => {
    if (!produto) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [produto, onFechar]);

  if (!produto) return null;

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
      onClick={onFechar}
      role="dialog"
      aria-modal="true"
      aria-label={`Foto ampliada de ${produto.nome}`}
    >
      <button
        onClick={onFechar}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
        aria-label="Fechar"
      >
        <X size={20} />
      </button>

      <div className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={resolveImageUrl(produto.imageUrl)}
          alt={produto.nome}
          className="max-h-[75vh] max-w-full rounded-xl object-contain"
        />
        <div className="mt-4 text-center text-white">
          <p className="font-display text-base font-bold">{produto.nome}</p>
          <p className="text-sm text-white/60">
            {formatarReal(produto.precoVarejo)} · atacado {formatarReal(produto.precoAtacado)}
          </p>
        </div>
      </div>
    </div>
  );
}
