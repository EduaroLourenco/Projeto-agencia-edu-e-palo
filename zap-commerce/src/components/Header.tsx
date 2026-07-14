import { Link } from "react-router-dom";
import type { LojaConfig } from "../types";

export function Header({
  loja,
  totalPecas,
  onAbrirSacola,
}: {
  loja: LojaConfig;
  totalPecas: number;
  onAbrirSacola: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-paper/90 px-4 py-3 backdrop-blur">
      <Link to="." className="flex min-w-0 items-center gap-2">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-white">
          {loja.nomeLoja.slice(0, 1)}
        </div>
        <div className="min-w-0 text-left">
          <p className="truncate font-display text-sm font-semibold leading-tight">{loja.nomeLoja}</p>
          <p className="flex items-center gap-1 text-xs text-ink/50">
            <span
              className={`h-1.5 w-1.5 rounded-full ${loja.aberto ? "bg-ok-500" : "bg-ink/30"}`}
            />
            {loja.aberto ? "Aberto agora" : "Fechado no momento"}
          </p>
        </div>
      </Link>

      <button
        onClick={onAbrirSacola}
        className="relative flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white active:scale-95 transition-transform"
      >
        Sacola
        {totalPecas > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold animate-pop">
            {totalPecas}
          </span>
        )}
      </button>
    </header>
  );
}
