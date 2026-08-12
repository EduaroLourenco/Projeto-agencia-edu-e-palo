import {
  Shirt,
  Beer,
  Scissors,
  PartyPopper,
  Wrench,
  Bus,
  UtensilsCrossed,
  HeartPulse,
} from "lucide-react";
import type { ReactNode } from "react";
import { NICHOS } from "../data/content";
import { Reveal } from "./Reveal";

const ICONES: Record<string, ReactNode> = {
  moda: <Shirt size={15} />,
  distribuidoras: <Beer size={15} />,
  estetica: <Scissors size={15} />,
  eventos: <PartyPopper size={15} />,
  oficinas: <Wrench size={15} />,
  logistica: <Bus size={15} />,
  lanchonetes: <UtensilsCrossed size={15} />,
  saude: <HeartPulse size={15} />,
};

function Faixa() {
  return (
    <div className="flex shrink-0 items-center gap-8 pr-8">
      {NICHOS.map((nicho) => (
        <span key={nicho.id} className="flex items-center gap-2.5 whitespace-nowrap">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
            {ICONES[nicho.id]}
          </span>
          <span className="font-display text-sm font-bold text-white/70">{nicho.nome}</span>
          <span className="h-1 w-1 rounded-full bg-white/20" />
        </span>
      ))}
    </div>
  );
}

export function Nichos() {
  return (
    <section id="setores" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Setores atendidos</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Soluções sob medida para quem move o seu setor.
          </h2>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="relative mt-10 overflow-hidden border-y border-white/5 bg-surface/40 py-4">
          <div className="animate-marquee flex w-max">
            <Faixa />
            <Faixa />
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-ink to-transparent" />
        </div>
      </Reveal>
    </section>
  );
}
