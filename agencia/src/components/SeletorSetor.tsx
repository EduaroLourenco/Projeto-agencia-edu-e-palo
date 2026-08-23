import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Shirt,
  Beer,
  Scissors,
  PartyPopper,
  Wrench,
  Bus,
  UtensilsCrossed,
  HeartPulse,
  Factory,
  PawPrint,
  Check,
  X,
  ArrowRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { NICHOS, linkWhatsApp, type Nicho } from "../data/content";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

const ICONES: Record<string, ReactNode> = {
  moda: <Shirt size={15} />,
  distribuidoras: <Beer size={15} />,
  estetica: <Scissors size={15} />,
  eventos: <PartyPopper size={15} />,
  oficinas: <Wrench size={15} />,
  logistica: <Bus size={15} />,
  lanchonetes: <UtensilsCrossed size={15} />,
  saude: <HeartPulse size={15} />,
  industrias: <Factory size={15} />,
  petshop: <PawPrint size={15} />,
};

function PainelNicho({ nicho, onClose }: { nicho: Nicho; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const mensagem = `Oi! Tenho um negócio de ${nicho.nome}. Vi no site de vocês o que fazem pro meu setor e quero entender como funciona.`;

  // Portal: fora do <main>, que tem z-index próprio e prenderia o painel
  // atrás do botão "voltar ao topo" e da textura de ruído.
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`O que fazemos para ${nicho.nome}`}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-5"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 [&>svg]:h-5 [&>svg]:w-5">
            {ICONES[nicho.id]}
          </span>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <h3 className="mt-4 font-display text-xl font-bold text-white">{nicho.nome}</h3>

        <div className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">
            Onde costuma travar
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{nicho.dor}</p>
        </div>

        <p className="mt-6 text-[11px] font-bold uppercase tracking-widest text-violet-400">
          O que a gente entrega
        </p>
        <ul className="mt-3 flex flex-col gap-2.5">
          {nicho.entregas.map((e) => (
            <li key={e} className="flex items-start gap-2.5 text-sm leading-relaxed text-white/75">
              <Check size={15} className="mt-0.5 shrink-0 text-violet-300" />
              {e}
            </li>
          ))}
        </ul>

        <MagneticButton
          href={linkWhatsApp(mensagem)}
          target="_blank"
          rel="noreferrer"
          onClick={() => rastrear("whatsapp_click", { origem: "nicho", nicho: nicho.id })}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-pink-400 px-6 py-3.5 text-sm font-bold text-ink"
        >
          Quero isso no meu negócio
          <ArrowRight size={15} />
        </MagneticButton>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/**
 * Seletor de setor. Vive dentro do hero: é o primeiro gesto que o
 * visitante pode fazer, e o caminho mais curto entre "esse site é pra
 * mim?" e a resposta. Rola na horizontal pra caber na primeira tela sem
 * empurrar o resto para baixo.
 */
export function SeletorSetor() {
  const [escolhido, setEscolhido] = useState<Nicho | null>(null);

  return (
    <div>
      <p className="text-xs font-semibold text-white/50">
        Qual é o seu negócio? Toque e veja o que resolvemos nele.
      </p>

      {/* Sombra na borda direita: sem ela, um chip cortado pode parecer
          bug de layout em vez de convite pra arrastar. */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink to-transparent sm:hidden" />
        <div className="no-scrollbar -mx-5 mt-3 flex snap-x gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {NICHOS.map((nicho) => (
            <button
              key={nicho.id}
              onClick={() => setEscolhido(nicho)}
              className="flex shrink-0 snap-start items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3.5 py-2.5 transition-all active:scale-95 hover:border-violet-400/50 hover:bg-violet-500/12"
            >
              <span className="text-violet-300">{ICONES[nicho.id]}</span>
              <span className="whitespace-nowrap font-display text-xs font-bold text-white/85">
                {nicho.nome}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {escolhido && <PainelNicho nicho={escolhido} onClose={() => setEscolhido(null)} />}
      </AnimatePresence>
    </div>
  );
}
