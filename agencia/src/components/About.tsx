import { Reveal } from "./Reveal";
import { DUPLA, AGENCIA } from "../data/content";
import { Globe, ExternalLink, MapPin } from "lucide-react";

const ESPECIALIDADES: Record<string, string[]> = {
  E: ["React", "NestJS", "Marketplaces", "ERP & API"],
  P: ["SQL", "Power BI", "Python", "Fluxo de Caixa"],
};

export function About() {
  return (
    <section id="quem-somos" className="relative border-y border-white/5 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Quem somos</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Uma dupla, um objetivo: sistema que funciona e resultado que aparece.
          </h2>
          <p className="mt-5 text-white/60">
            Somos uma dupla que decidiu juntar engenharia de software, dados e visão de negócio pra
            resolver um problema bem específico: negócios que vendem muito bem no boca a boca, mas
            travam na hora de escalar online. A gente entra exatamente nesse ponto — sem prometer
            mágica, sem contrato eterno, só sistema que funciona de verdade.
          </p>
          <p className="mt-4 text-white/60">
            Cada projeto passa pelas duas mãos: um cuida da estratégia comercial, dos marketplaces e
            da engenharia por trás do sistema; a outra cuida das finanças, dos processos e dos dados
            que mostram se o negócio está saudável. No fim, o que chega pra você é um sistema pensado
            de ponta a ponta — do código ao caixa.
          </p>

          <div className="mt-7 flex items-center gap-3">
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

        <Reveal delay={0.1} className="flex flex-col gap-5 lg:items-end">
          {DUPLA.map((pessoa) => (
            <div
              key={pessoa.iniciais}
              className="group flex w-full flex-col gap-4 rounded-3xl border border-white/10 bg-surface p-6 transition-all hover:border-white/20 lg:max-w-sm"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${pessoa.cor} font-display text-xl font-extrabold text-ink`}
                >
                  {pessoa.iniciais}
                </span>
                <div>
                  <p className="font-display text-base font-bold text-white">{pessoa.nome}</p>
                  <p className="text-xs font-semibold text-white/50">{pessoa.papel}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-white/45">{pessoa.bio}</p>

              {/* Tags de especialidade */}
              <div className="flex flex-wrap gap-1.5">
                {ESPECIALIDADES[pessoa.iniciais]?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Case + LinkedIn */}
              <div className="flex items-center gap-2 border-t border-white/8 pt-4">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
                <span className="text-[11px] text-white/40">Fundadores da Sigma · 2024</span>
                <a
                  href={pessoa.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-white/40 transition-colors hover:text-white"
                >
                  <ExternalLink size={12} />
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
