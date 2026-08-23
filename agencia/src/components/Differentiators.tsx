import { DIFERENCIAIS } from "../data/content";
import { Reveal } from "./Reveal";

export function Differentiators() {
  const [destaque, ...resto] = [
    ...DIFERENCIAIS.filter((d) => d.destaque),
    ...DIFERENCIAIS.filter((d) => !d.destaque),
  ];

  return (
    <section id="diferenciais" className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Por que a gente</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            Quem constrói o seu sistema é quem conversa com você.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-9 rounded-2xl border border-violet-500/20 bg-surface p-7">
            <h3 className="font-display text-xl font-bold text-white sm:text-2xl">{destaque.titulo}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 sm:text-base">
              {destaque.descricao}
            </p>
          </div>
        </Reveal>

        {/* Antes eram 5 cards grandes empilhados (1,7 tela de rolagem só de
            afirmação). Agora os 4 secundários viram uma faixa compacta. */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resto.map((d, i) => (
            <Reveal key={d.titulo} delay={0.05 + i * 0.05} className="h-full">
              <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-surface p-5">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                  <h3 className="font-display text-sm font-bold text-white">{d.titulo}</h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">{d.descricao}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
