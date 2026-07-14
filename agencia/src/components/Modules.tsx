import { Check, Code2, Megaphone, MessageCircle, Workflow } from "lucide-react";
import type { ReactNode } from "react";
import { MODULOS, type Modulo } from "../data/content";
import { Reveal } from "./Reveal";
import { TiltCard } from "./TiltCard";

const ICONES: Record<string, ReactNode> = {
  "comercio-whatsapp": <MessageCircle size={22} />,
  "sites-sistemas": <Code2 size={22} />,
  "marketing-digital": <Megaphone size={22} />,
  "consultoria-automacao": <Workflow size={22} />,
};

const CORES: Record<Modulo["cor"], { bg: string; text: string; ring: string }> = {
  violet: { bg: "bg-violet-500/15", text: "text-violet-300", ring: "hover:border-violet-500/40" },
  lime: { bg: "bg-lime-500/15", text: "text-lime-300", ring: "hover:border-lime-500/40" },
  cyan: { bg: "bg-cyan-400/15", text: "text-cyan-300", ring: "hover:border-cyan-400/40" },
};

export function Modules() {
  return (
    <section id="modulos" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">O que oferecemos</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Tudo dividido em módulos — contrate o que resolve seu problema agora.
          </h2>
          <p className="mt-4 max-w-xl text-white/55">
            Nada de pacote fechado genérico. Cada módulo pode ser contratado sozinho ou combinado
            com os outros, conforme o momento do seu negócio.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {MODULOS.map((m, i) => {
            const cor = CORES[m.cor];
            return (
              <Reveal key={m.id} delay={i * 0.08} className="h-full">
                <TiltCard className="h-full">
                  <article
                    className={`h-full rounded-3xl border border-white/10 bg-surface p-7 transition-colors ${cor.ring}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${cor.bg} ${cor.text}`}>
                        {ICONES[m.id]}
                      </span>
                      <span className="font-display text-3xl font-extrabold text-white/10">{m.numero}</span>
                    </div>

                    <h3 className="mt-5 font-display text-xl font-bold text-white">{m.titulo}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/55">{m.resumo}</p>

                    <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5">
                      {m.itens.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                          <Check size={15} className={`mt-0.5 shrink-0 ${cor.text}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
