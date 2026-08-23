import { ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { VIDEO_DEMO } from "../data/content";

/**
 * Mockup de celular. Com `comVideo`, mostra o vídeo real do catálogo
 * funcionando (VIDEO_DEMO); sem ele, mostra a tela estática de exemplo.
 * O vídeo fica só num lugar da página pra não tocar duplicado.
 */
export function PhoneMockup({ comVideo = false }: { comVideo?: boolean }) {
  if (comVideo && VIDEO_DEMO) {
    return (
      <div className="relative mx-auto w-[260px] select-none sm:w-[300px]">
        <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-violet-500/20 blur-3xl" />
        <div className="rounded-[2.5rem] border border-white/10 bg-surface-2 p-3 shadow-2xl shadow-black/60">
          <video
            src={VIDEO_DEMO}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Demonstração do catálogo digital funcionando"
            className="aspect-[384/832] w-full rounded-[1.75rem] bg-ink object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div aria-hidden className="relative mx-auto w-[260px] select-none sm:w-[300px]">
      <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-violet-500/20 blur-3xl" />
      <div className="rounded-[2.5rem] border border-white/10 bg-surface-2 p-3 shadow-2xl shadow-black/60">
        <div className="overflow-hidden rounded-[1.75rem] bg-ink">
          <div className="flex items-center justify-between px-4 pb-2 pt-3 text-[10px] text-white/40">
            <span>9:41</span>
            <span className="h-1.5 w-10 rounded-full bg-white/15" />
          </div>

          <div className="flex items-center justify-between px-4 pb-3">
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                Z
              </span>
              <span className="text-xs font-semibold text-white">Loja da Ana</span>
            </div>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-white">
              <ShoppingBag size={12} />
            </span>
          </div>

          <div className="mx-4 mb-3 rounded-xl bg-white/[0.06] p-2.5">
            <div className="aspect-[16/8] w-full rounded-lg bg-gradient-to-br from-violet-500/40 via-fuchsia-500/20 to-blue-400/30" />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-white">Cropped Linho</span>
              <span className="text-[11px] font-bold text-pink-400">R$ 39,90</span>
            </div>
          </div>

          <div className="mx-4 mb-3 flex items-center gap-1.5 rounded-lg bg-pink-400/10 px-2.5 py-2 text-[10px] font-semibold text-pink-300">
            <Tag size={11} />
            Preço de atacado liberado
          </div>

          <div className="mx-4 mb-4 flex items-center justify-between rounded-xl bg-[#25D366] px-3 py-2.5">
            <span className="text-[11px] font-bold text-white">Finalizar no WhatsApp</span>
            <ArrowRight size={14} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
