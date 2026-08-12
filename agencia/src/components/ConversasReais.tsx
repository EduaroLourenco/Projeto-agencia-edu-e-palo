import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ImageIcon, MessageCircle, X, ZoomIn } from "lucide-react";
import { CONVERSAS, type Conversa } from "../data/content";
import { Reveal } from "./Reveal";

// Conversa é prova → um único acento, sem rodízio de cor por card.
const CORES: Record<Conversa["cor"], { bg: string; text: string; borda: string }> = {
  violet: { bg: "bg-cyan-400/15", text: "text-cyan-300", borda: "hover:border-cyan-400/45" },
  lime: { bg: "bg-cyan-400/15", text: "text-cyan-300", borda: "hover:border-cyan-400/45" },
  cyan: { bg: "bg-cyan-400/15", text: "text-cyan-300", borda: "hover:border-cyan-400/45" },
};

export function ConversasReais() {
  // Enquanto o print não estiver em public/conversas/, a imagem falha ao
  // carregar e o card cai no espaço reservado — assim é só soltar os
  // arquivos na pasta, sem precisar editar código.
  const [semImagem, setSemImagem] = useState<string[]>([]);
  const [ampliada, setAmpliada] = useState<Conversa | null>(null);

  useEffect(() => {
    if (!ampliada) return;
    document.body.style.overflow = "hidden";
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAmpliada(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [ampliada]);

  return (
    <section id="conversas" className="relative overflow-hidden py-24 sm:py-32">
      <div className="glow-cyan pointer-events-none absolute right-0 top-1/4 h-[380px] w-[380px] translate-x-1/2 rounded-full opacity-50" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            <MessageCircle size={14} />
            Na prática
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Conversas reais de quem já está usando.
          </h2>
          <p className="mt-4 max-w-2xl text-white/60">
            Do lead que chega pelo site ao pedido caindo pronto no WhatsApp do lojista.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CONVERSAS.map((c, i) => {
            const cor = CORES[c.cor];
            const temImagem = c.imagem && !semImagem.includes(c.id);
            return (
              <Reveal key={c.id} delay={i * 0.08} className="h-full">
                <figure
                  className={`flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface transition-colors ${cor.borda}`}
                >
                  {temImagem ? (
                    <button
                      type="button"
                      onClick={() => setAmpliada(c)}
                      aria-label={`Ampliar print: ${c.titulo}`}
                      className="group relative block aspect-[3/4] w-full overflow-hidden border-b border-white/10 bg-ink/60"
                    >
                      <img
                        src={c.imagem}
                        alt={c.titulo}
                        loading="lazy"
                        onError={() => setSemImagem((atual) => [...atual, c.id])}
                        /* contain: proporções diferentes entre os prints, então
                           encaixamos inteiro em vez de cortar a conversa. */
                        className="h-full w-full object-contain"
                      />
                      <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1.5 text-[11px] font-semibold text-white/90 backdrop-blur transition-opacity group-hover:bg-black/85">
                        <ZoomIn size={12} />
                        Ampliar
                      </span>
                    </button>
                  ) : (
                    <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 border-b border-dashed border-white/15 bg-white/[0.02] px-4 text-center">
                      <ImageIcon size={22} className="text-white/50" />
                      <p className="text-xs font-semibold text-white/55">Espaço reservado para o print</p>
                      <p className="text-[11px] leading-relaxed text-white/50">
                        Coloque em <code className="text-white/55">public/conversas/</code>
                      </p>
                    </div>
                  )}

                  <figcaption className="flex flex-1 flex-col p-6">
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${cor.bg} ${cor.text}`}
                    >
                      {c.etiqueta}
                    </span>
                    <p className="mt-4 font-display text-base font-bold leading-snug text-white">{c.titulo}</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/60">{c.descricao}</p>
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Portal: fora do <main>, que tem z-index próprio e prenderia o overlay
          atrás do botão "voltar ao topo" e da textura de ruído. */}
      {createPortal(
        <AnimatePresence>
          {ampliada && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAmpliada(null)}
              role="dialog"
              aria-modal="true"
              aria-label={ampliada.titulo}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/85 p-5 backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={() => setAmpliada(null)}
                aria-label="Fechar"
                className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X size={19} />
              </button>

              <motion.img
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                src={ampliada.imagem}
                alt={ampliada.titulo}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <p className="max-w-md text-center text-sm text-white/70">{ampliada.titulo}</p>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
