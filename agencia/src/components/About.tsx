import { Reveal } from "./Reveal";
import { TIME, AGENCIA } from "../data/content";
import { Globe, ExternalLink, MapPin } from "lucide-react";

export function About() {
  return (
    <section id="quem-somos" className="relative border-y border-white/5 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        {/* Texto no topo e as pessoas embaixo: com três blocos, a coluna
            lateral que servia pra dois viraria uma pilha comprida. */}
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Quem somos</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Três frentes, um objetivo: sistema que funciona e resultado que aparece.
          </h2>
          <p className="mt-5 text-white/60">
            Um time que juntou engenharia de software, finanças e gestão de pessoas pra resolver um
            problema específico: quem vende muito bem no boca a boca, mas trava na hora de escalar
            online. Cada projeto passa pelas três mãos — código e operação, números e margem,
            atendimento e time. O que chega pra você é um sistema pensado do código ao caixa.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/8 px-3 py-1.5 text-xs font-semibold text-yellow-300">
              <MapPin size={12} />
              Goiânia, GO
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/50">
              Atendemos presencial e remoto
            </span>
          </div>

          {/* Redes sociais da agência */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href={AGENCIA.instagram}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              <Globe size={13} />
              Instagram
            </a>
            <a
              href={AGENCIA.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              <ExternalLink size={13} />
              LinkedIn
            </a>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TIME.map((pessoa, i) => (
            <Reveal key={pessoa.iniciais} delay={0.08 + i * 0.07} className="h-full">
              <div className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-6 transition-colors hover:border-white/20">
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${pessoa.cor} font-display text-xl font-extrabold text-ink`}
                  >
                    {pessoa.iniciais}
                  </span>
                  <p className="font-display text-base font-bold leading-snug text-white">
                    {pessoa.nome}
                  </p>
                </div>

                <p className="text-xs font-semibold leading-relaxed text-violet-300">{pessoa.papel}</p>
                <p className="flex-1 text-xs leading-relaxed text-white/55">{pessoa.bio}</p>

                {pessoa.linkedin && (
                  <a
                    href={pessoa.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 border-t border-white/8 pt-4 text-[11px] font-semibold text-white/45 transition-colors hover:text-white"
                  >
                    <ExternalLink size={12} />
                    LinkedIn
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
