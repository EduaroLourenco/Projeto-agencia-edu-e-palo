import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";

export function BottomSheet({
  aberto,
  onFechar,
  titulo,
  children,
}: {
  aberto: boolean;
  onFechar: () => void;
  titulo: string;
  children: ReactNode;
}) {
  const tituloId = useId();
  const fecharRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    fecharRef.current?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onFechar();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={tituloId}
    >
      <div className="absolute inset-0 animate-fade-in bg-black/50" onClick={onFechar} />
      <div className="safe-bottom relative flex max-h-[88vh] w-full max-w-md animate-slide-up flex-col rounded-t-3xl bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <h2 id={tituloId} className="font-display text-base font-bold">
            {titulo}
          </h2>
          <button
            ref={fecharRef}
            onClick={onFechar}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-ink/60 focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="no-scrollbar overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
