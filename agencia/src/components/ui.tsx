import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export const BTN_PRIMARIO =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-strong";

export const BTN_SECUNDARIO =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-ink/20 px-6 text-sm font-semibold text-ink transition-colors hover:border-ink/50";

/** Variante para faixas escuras (bg-ink). */
export const BTN_SECUNDARIO_ESCURO =
  "inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:border-white/60";

/**
 * Cabeçalho de seção editorial: rótulo numerado numa coluna estreita,
 * título e introdução ao lado. No celular, empilha.
 */
export function CabecalhoSecao({
  numero,
  rotulo,
  titulo,
  children,
  escuro = false,
}: {
  numero: string;
  rotulo: string;
  titulo: ReactNode;
  children?: ReactNode;
  escuro?: boolean;
}) {
  return (
    <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
      <p
        className={`text-sm font-semibold md:col-span-3 md:pt-2 ${escuro ? "text-white/70" : "text-muted"}`}
      >
        <span className={`tabular-nums ${escuro ? "text-brand-light" : "text-brand"}`}>{numero}</span>
        <span className="mx-2" aria-hidden>
          —
        </span>
        {rotulo}
      </p>
      <div className="md:col-span-9">
        <h2
          className={`max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-[-0.025em] sm:text-[2.6rem] ${escuro ? "text-white" : "text-ink"}`}
        >
          {titulo}
        </h2>
        {children && (
          <p
            className={`mt-5 max-w-2xl text-base leading-relaxed sm:text-lg ${escuro ? "text-white/70" : "text-muted"}`}
          >
            {children}
          </p>
        )}
      </div>
    </Reveal>
  );
}
