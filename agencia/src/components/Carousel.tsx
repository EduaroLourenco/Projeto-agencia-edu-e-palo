import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Carrossel horizontal com scroll-snap: no celular o usuário arrasta com o
 * dedo, no desktop as setas aparecem. A rolagem nativa mantém o componente
 * leve e acessível (teclado e leitor de tela continuam funcionando).
 */
export function Carousel({
  children,
  ariaLabel,
  className,
}: {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  const trilhoRef = useRef<HTMLDivElement>(null);
  const [podeVoltar, setPodeVoltar] = useState(false);
  const [podeAvancar, setPodeAvancar] = useState(true);

  const atualizarSetas = useCallback(() => {
    const el = trilhoRef.current;
    if (!el) return;
    const folga = 8; // tolerância pra arredondamento de subpixel
    setPodeVoltar(el.scrollLeft > folga);
    setPodeAvancar(el.scrollLeft + el.clientWidth < el.scrollWidth - folga);
  }, []);

  useEffect(() => {
    const el = trilhoRef.current;
    if (!el) return;
    atualizarSetas();

    el.addEventListener("scroll", atualizarSetas, { passive: true });
    const observer = new ResizeObserver(atualizarSetas);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", atualizarSetas);
      observer.disconnect();
    };
  }, [atualizarSetas]);

  function rolar(direcao: 1 | -1) {
    const el = trilhoRef.current;
    if (!el) return;
    // Avança ~1 card por clique, respeitando a largura visível.
    const passo = Math.min(el.clientWidth * 0.8, 380);
    el.scrollBy({ left: passo * direcao, behavior: "smooth" });
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        ref={trilhoRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:mx-0 sm:px-0"
      >
        {children}
      </div>

      {/* Setas — só em telas com espaço; no celular a rolagem é por toque. */}
      <button
        type="button"
        onClick={() => rolar(-1)}
        disabled={!podeVoltar}
        aria-label="Ver anteriores"
        className="absolute -left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-surface/95 text-white shadow-lg backdrop-blur transition-opacity hover:bg-surface disabled:pointer-events-none disabled:opacity-0 lg:flex"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => rolar(1)}
        disabled={!podeAvancar}
        aria-label="Ver próximos"
        className="absolute -right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-surface/95 text-white shadow-lg backdrop-blur transition-opacity hover:bg-surface disabled:pointer-events-none disabled:opacity-0 lg:flex"
      >
        <ChevronRight size={20} />
      </button>

      {/* Sombra indicando que ainda há conteúdo à direita */}
      {podeAvancar && (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-ink to-transparent sm:block" />
      )}
    </div>
  );
}
