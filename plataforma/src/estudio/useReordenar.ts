import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

/**
 * Arrastar pra reordenar, com o dedo.
 *
 * Não usa a API de drag-and-drop do HTML de propósito: ela não funciona em
 * toque e é o motivo de tanto editor de loja só servir no mouse. Aqui é
 * pointer event puro, que atende dedo, caneta e mouse pelo mesmo caminho.
 *
 * A rolagem da página só é liberada de novo no fim: sem `touch-action: none`
 * na alça, o navegador rola em vez de arrastar.
 */
export function useReordenar({
  ids,
  container,
  onSoltar,
}: {
  ids: string[];
  container: RefObject<HTMLElement | null>;
  onSoltar: (de: number, para: number) => void;
}) {
  const [arrastandoId, setArrastandoId] = useState<string | null>(null);
  const [alvoIndice, setAlvoIndice] = useState<number | null>(null);

  // Refs porque os handlers vivem em listeners de window durante o arrasto.
  const origem = useRef(0);
  const alvo = useRef<number | null>(null);
  const centros = useRef<{ id: string; centro: number }[]>([]);

  const medir = useCallback(() => {
    const raiz = container.current;
    if (!raiz) return;
    centros.current = ids
      .map((id) => {
        const el = raiz.querySelector<HTMLElement>(`[data-bloco="${id}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { id, centro: r.top + r.height / 2 };
      })
      .filter((x): x is { id: string; centro: number } => x !== null);
  }, [ids, container]);

  const iniciar = useCallback(
    (e: ReactPointerEvent, id: string, indice: number) => {
      e.preventDefault();
      medir();
      origem.current = indice;
      alvo.current = indice;
      setArrastandoId(id);
      setAlvoIndice(indice);
    },
    [medir],
  );

  useEffect(() => {
    if (!arrastandoId) return;

    function aoMover(e: PointerEvent) {
      // O alvo é o primeiro bloco cujo centro está abaixo do dedo.
      let indice = centros.current.length;
      for (let i = 0; i < centros.current.length; i++) {
        if (e.clientY < centros.current[i].centro) {
          indice = i;
          break;
        }
      }
      // Ao arrastar pra baixo, o próprio item ocupa uma posição no caminho.
      const ajustado = indice > origem.current ? indice - 1 : indice;
      alvo.current = ajustado;
      setAlvoIndice(ajustado);

      // Rola quando o dedo chega perto da borda, senão não dá pra levar um
      // bloco do fim da página pro começo.
      const margem = 90;
      if (e.clientY < margem) window.scrollBy({ top: -14 });
      else if (e.clientY > window.innerHeight - margem) window.scrollBy({ top: 14 });
    }

    function aoSoltar() {
      const de = origem.current;
      const para = alvo.current;
      setArrastandoId(null);
      setAlvoIndice(null);
      if (para !== null && para !== de) onSoltar(de, para);
    }

    window.addEventListener("pointermove", aoMover, { passive: true });
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoSoltar);
    return () => {
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointercancel", aoSoltar);
    };
  }, [arrastandoId, onSoltar]);

  return { arrastandoId, alvoIndice, iniciar };
}
