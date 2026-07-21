import { NICHOS } from "../data/content";
import { Reveal } from "./Reveal";

export function Nichos() {
  return (
    <section id="setores" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Setores atendidos</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Soluções sob medida para quem move Goiânia.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">
            Cada setor tem seu jeito de vender. A gente conhece cada um deles — e já construiu sistemas
            que funcionam de verdade no dia a dia dessas operações.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {NICHOS.map((nicho, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-surface/50 p-5 transition-all duration-300 hover:border-white/20 hover:bg-surface"
              >
                {/* Glow on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(circle at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)" }}
                />
                <span className="block text-3xl">{nicho.emoji}</span>
                <p className="mt-3 font-display text-sm font-bold text-white">{nicho.nome}</p>
                <p className="mt-1 text-xs text-white/45 leading-relaxed">{nicho.descricao}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
