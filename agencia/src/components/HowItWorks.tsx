import { ETAPAS } from "../data/content";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="relative border-y border-white/5 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-lime-400">Como funciona</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Um processo direto, do primeiro papo ao sistema no ar.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {ETAPAS.map((etapa, i) => (
            <Reveal key={etapa.numero} delay={i * 0.08}>
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="font-display text-3xl font-extrabold text-white/15">{etapa.numero}</span>
                  {i < ETAPAS.length - 1 && (
                    <span className="hidden h-px flex-1 bg-gradient-to-r from-white/20 to-transparent lg:block" />
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{etapa.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{etapa.descricao}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
