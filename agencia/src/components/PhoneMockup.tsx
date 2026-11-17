import { useEffect, useRef, useState } from "react";
import { VIDEO_DEMO, POSTER_DEMO } from "../data/content";

/**
 * Vídeo real do catálogo funcionando, num corpo de celular.
 * O `src` só entra quando o vídeo chega perto da tela: com autoPlay o
 * navegador baixaria 1,3 MB no carregamento, disputando banda com o texto.
 */
export function PhoneMockup() {
  const ref = useRef<HTMLVideoElement>(null);
  const [carregar, setCarregar] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setCarregar(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setCarregar(true);
          obs.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !carregar) return;
    const menosMovimento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!menosMovimento) el.play().catch(() => {});
  }, [carregar]);

  return (
    <div className="mx-auto w-[220px] rounded-[2.25rem] border border-line-dark bg-ink-2 p-2.5 sm:w-[260px]">
      <video
        ref={ref}
        src={carregar ? VIDEO_DEMO : undefined}
        poster={POSTER_DEMO}
        width={384}
        height={832}
        muted
        loop
        playsInline
        controls={false}
        preload="none"
        aria-label="Demonstração do catálogo digital do Zap-Commerce em uso"
        className="aspect-[384/832] w-full rounded-[1.75rem] bg-ink object-cover"
      />
    </div>
  );
}
