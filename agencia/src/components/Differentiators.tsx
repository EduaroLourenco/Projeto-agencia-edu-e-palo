import { DIFERENCIAIS } from "../data/content";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

export function Differentiators() {
  return (
    <section id="diferenciais" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Por que a gente</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Diferente de agência que empurra pacote fechado.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIFERENCIAIS.map((d, i) => (
            <Reveal
              key={d.titulo}
              delay={i * 0.07}
              className={d.destaque ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}
            >
              <TiltCard className="h-full">
                <div
                  className={`flex h-full flex-col justify-between rounded-3xl border p-7 ${
                    d.destaque
                      ? "border-violet-500/30 bg-gradient-to-br from-violet-500/15 via-surface to-surface"
                      : "border-white/10 bg-surface"
                  }`}
                >
                  <h3 className={`font-display font-bold text-white ${d.destaque ? "text-2xl sm:text-3xl" : "text-lg"}`}>
                    {d.titulo}
                  </h3>
                  <p className={`mt-4 text-white/60 ${d.destaque ? "max-w-md text-base" : "text-sm leading-relaxed"}`}>
                    {d.descricao}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
