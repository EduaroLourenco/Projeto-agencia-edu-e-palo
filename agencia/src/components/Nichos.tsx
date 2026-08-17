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
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

const ICONES: Record<string, ReactNode> = {
  moda: <Shirt size={16} />,
  distribuidoras: <Beer size={16} />,
  estetica: <Scissors size={16} />,
  eventos: <PartyPopper size={16} />,
  oficinas: <Wrench size={16} />,
  logistica: <Bus size={16} />,
  lanchonetes: <UtensilsCrossed size={16} />,
  saude: <HeartPulse size={16} />,
  industrias: <Factory size={16} />,
  petshop: <PawPrint size={16} />,
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
        className="max-h-[88vh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-surface p-7 sm:max-w-lg sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            {ICONES[nicho.id]}
          </span>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:text-white"
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
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-ink"
        >
          Quero isso no meu negócio
          <ArrowRight size={15} />
        </MagneticButton>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export function Nichos() {
  const [escolhido, setEscolhido] = useState<Nicho | null>(null);

  return (
    <section id="setores" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-5">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Setores atendidos</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Qual desses é o seu negócio?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/60">
            Toque no seu setor e veja direto o que a gente resolve nele — sem precisar ler o site inteiro.
          </p>
        </Reveal>

        {/* Estático de propósito: como agora são botões de navegação, esteira
            animada obrigaria o visitante a perseguir o alvo com o dedo e a
            esperar o setor dele passar. Aqui os 10 aparecem de uma vez. */}
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {NICHOS.map((nicho) => (
              <button
                key={nicho.id}
                onClick={() => setEscolhido(nicho)}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:border-violet-400/45 hover:bg-violet-500/10 sm:gap-2 sm:px-4 sm:py-2.5"
              >
                <span className="text-violet-300">{ICONES[nicho.id]}</span>
                <span className="font-display text-xs font-bold text-white/85 sm:text-sm">
                  {nicho.nome}
                </span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 text-center text-xs text-white/45">
            Não achou o seu? A gente já montou sistema pra setor que não está nessa lista.
          </p>
        </Reveal>
      </div>

      <AnimatePresence>
        {escolhido && <PainelNicho nicho={escolhido} onClose={() => setEscolhido(null)} />}
      </AnimatePresence>
    </section>
  );
}
