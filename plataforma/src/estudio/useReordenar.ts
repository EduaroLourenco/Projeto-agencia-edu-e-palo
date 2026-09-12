import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

/**
 * Arrastar pra reordenar, com o dedo.
 *
 * Não usa a API de drag-and-drop do HTML de propósito: ela não funciona em
 * toque e é o motivo de tanto editor de loja só servir no mouse. Aqui é
 * pointer event puro, que atende dedo, caneta e mouse pelo mesmo caminho.
 *
 * TRÊS COISAS QUE ESTAVAM ERRADAS na primeira versão, e que faziam o arrasto
 * "às vezes não funcionar":
 *
 * 1. As posições dos blocos eram medidas UMA VEZ, no começo. Como o arrasto
 *    rola a página, na primeira rolagem toda medida ficava velha e o bloco
 *    caía no lugar errado. Agora a medida é em coordenada de documento
 *    (soma o scroll), então rolar não invalida nada.
 *
 * 2. A rolagem automática só andava quando o dedo se MEXIA. Segurando o dedo
 *    parado na beirada — que é o gesto natural — a página parava, e não dava
 *    pra levar um bloco do fim da página pro começo. Agora é um laço de
 *    animação, que anda sozinho enquanto o dedo estiver na faixa.
 *
 * 3. Sem captura de ponteiro, um dedo que saísse do elemento no meio do
 *    caminho podia perder o `pointerup` e deixar o bloco grudado.
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
  const centros = useRef<number[]>([]);
  const yDocumento = useRef(0);
  const rolagem = useRef<number | null>(null);

  /** Centro de cada bloco em coordenada de documento — imune à rolagem. */
  const medir = useCallback(() => {
    const raiz = container.current;
    if (!raiz) return;
    centros.current = ids.map((id) => {
      const el = raiz.querySelector<HTMLElement>(`[data-bloco="${id}"]`);
      if (!el) return Number.POSITIVE_INFINITY;
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2 + window.scrollY;
    });
  }, [ids, container]);

  const recalcularAlvo = useCallback(() => {
    let indice = centros.current.length;
    for (let i = 0; i < centros.current.length; i++) {
      if (yDocumento.current < centros.current[i]) {
        indice = i;
        break;
      }
    }
    // Ao arrastar pra baixo, o próprio item ocupa uma posição no caminho.
    const ajustado = indice > origem.current ? indice - 1 : indice;
    alvo.current = ajustado;
    setAlvoIndice(ajustado);
  }, []);

  const iniciar = useCallback(
    (e: ReactPointerEvent, id: string, indice: number) => {
      e.preventDefault();
      // Captura: daqui pra frente todos os eventos deste dedo chegam aqui,
      // mesmo que ele saia de cima da alça.
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      medir();
      origem.current = indice;
      alvo.current = indice;
      yDocumento.current = e.clientY + window.scrollY;
      setArrastandoId(id);
      setAlvoIndice(indice);
      navigator.vibrate?.(12);
    },
    [medir],
  );

  useEffect(() => {
    if (!arrastandoId) return;

    let yTela = 0;

    function aoMover(e: PointerEvent) {
      yTela = e.clientY;
      yDocumento.current = e.clientY + window.scrollY;
      recalcularAlvo();
    }

    /**
     * Rolagem contínua enquanto o dedo estiver na faixa da beirada.
     *
     * A velocidade cresce conforme ele se aproxima da borda: perto do meio
     * da faixa anda devagar, colado na borda anda rápido. Sem essa rampa a
     * página ou não sai do lugar ou dispara.
     */
    function quadro() {
      const margem = 110;
      const alturaTela = window.innerHeight;
      let passo = 0;
      if (yTela < margem) passo = -((margem - yTela) / margem) * 18;
      else if (yTela > alturaTela - margem) passo = ((yTela - (alturaTela - margem)) / margem) * 18;

      if (passo !== 0) {
        const antes = window.scrollY;
        window.scrollBy(0, passo);
        // A página pode ter chegado ao fim: se não rolou, não adianta
        // recalcular nem seguir empurrando.
        if (window.scrollY !== antes) {
          yDocumento.current = yTela + window.scrollY;
          medir();
          recalcularAlvo();
        }
      }
      rolagem.current = requestAnimationFrame(quadro);
    }
    rolagem.current = requestAnimationFrame(quadro);

    // Blocos mudam de altura enquanto o alvo se move (o espaço abre e fecha),
    // então as medidas precisam acompanhar.
    const observador = new ResizeObserver(() => {
      medir();
      recalcularAlvo();
    });
    if (container.current) observador.observe(container.current);

    function aoSoltar() {
      const de = origem.current;
      const para = alvo.current;
      setArrastandoId(null);
      setAlvoIndice(null);
      if (para !== null && para !== de) onSoltar(de, para);
    }

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        alvo.current = origem.current;
        aoSoltar();
      }
    }

    window.addEventListener("pointermove", aoMover, { passive: true });
    window.addEventListener("pointerup", aoSoltar);
    window.addEventListener("pointercancel", aoSoltar);
    window.addEventListener("keydown", aoTeclar);
    return () => {
      if (rolagem.current !== null) cancelAnimationFrame(rolagem.current);
      observador.disconnect();
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerup", aoSoltar);
      window.removeEventListener("pointercancel", aoSoltar);
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [arrastandoId, onSoltar, medir, recalcularAlvo, container]);

  return { arrastandoId, alvoIndice, iniciar };
}
