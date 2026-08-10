import { Quote } from "lucide-react";
import { DEPOIMENTOS, type Depoimento } from "../data/content";
import { Reveal } from "./Reveal";

const CORES: Record<Depoimento["cor"], { ring: string; quote: string; avatar: string }> = {
  violet: {
    ring: "border-violet-500/20",
    quote: "text-violet-400",
    avatar: "from-violet-500 to-cyan-400",
  },
  lime: {
    ring: "border-lime-400/20",
    quote: "text-lime-400",
    avatar: "from-lime-400 to-cyan-400",
  },
  cyan: {
    ring: "border-cyan-400/20",
    quote: "text-cyan-400",
    avatar: "from-cyan-400 to-violet-500",
  },
};

export function Testimonials() {
  return (
    <section id="depoimentos" className="relative border-y border-white/5 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-lime-400">Quem usa, conta</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            O que nossos clientes dizem.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEPOIMENTOS.map((dep, i) => {
            const cor = CORES[dep.cor];
            return (
              <Reveal key={dep.nome} delay={i * 0.1} className="h-full">
                <div
                  className={`flex h-full flex-col rounded-3xl border bg-surface p-7 ${cor.ring}`}
                >
                  <Quote size={20} className={`shrink-0 ${cor.quote}`} />
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70 italic">
                    "{dep.texto}"
                  </p>
                  <div className="mt-7 flex items-center gap-3 border-t border-white/8 pt-5">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${cor.avatar} font-display text-sm font-extrabold text-ink`}
                    >
                      {dep.iniciais}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{dep.nome}</p>
                      <p className="text-xs text-white/45">{dep.negocio}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Social proof bar */}
        <Reveal delay={0.2}>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-5 rounded-2xl border border-white/8 bg-surface/50 px-6 py-5 text-center sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-3">
            <div>
              <p className="font-display text-2xl font-extrabold text-white">R$0</p>
              <p className="text-xs text-white/45">taxa de plataforma</p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-2xl font-extrabold text-white">100%</p>
              <p className="text-xs text-white/45">no WhatsApp do cliente</p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-2xl font-extrabold text-white">8+</p>
              <p className="text-xs text-white/45">setores em Goiânia</p>
            </div>
            <div className="hidden h-8 w-px bg-white/10 sm:block" />
            <div>
              <p className="font-display text-2xl font-extrabold text-white">semanas</p>
              <p className="text-xs text-white/45">do papo ao sistema no ar</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
