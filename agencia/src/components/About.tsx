import { Reveal } from "./Reveal";
import { TIME } from "../data/content";
import { ExternalLink } from "lucide-react";

export function About() {
  return (
    <section id="quem-somos" className="relative border-y border-white/5 bg-surface/40 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* Texto no topo e as pessoas embaixo: com três blocos, a coluna
            lateral que servia pra dois viraria uma pilha comprida. */}
        <Reveal className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Quem somos</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Três frentes, um objetivo: sistema que funciona e resultado que aparece.
          </h2>
          <p className="mt-5 text-white/60">
            Um time que juntou engenharia de software, finanças e gestão de pessoas pra resolver um
            problema específico: quem vende muito bem no boca a boca, mas trava na hora de escalar
            online. Cada projeto passa pelas três mãos: código e operação, números e margem,
            atendimento e time.
          </p>
        </Reveal>

        {/* No celular vira carrossel. Empilhados, três cartões com foto
            grande somavam quase três telas só de time; deslizando, as fotos
            continuam grandes e a seção cabe em uma. */}
        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-14 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          {TIME.map((pessoa, i) => (
            <Reveal
              key={pessoa.nome}
              delay={0.08 + i * 0.07}
              className="h-full w-[78%] shrink-0 snap-center sm:w-[56%] md:w-auto"
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-surface transition-colors hover:border-white/20">
                {/* A foto é o cartão. Nome e profissão vão por cima dela, no
                    degradê, pra não empurrar a bio pra fora da tela. As três
                    fotos vêm de câmeras e fundos diferentes: a saturação
                    contida faz elas lerem como um conjunto. */}
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
                  <img
                    src={pessoa.foto}
                    alt={`Retrato de ${pessoa.nome}`}
                    width={660}
                    height={880}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/75 to-transparent px-5 pb-5 pt-16">
                    <p className="font-display text-lg font-bold leading-tight text-white">
                      {pessoa.nome}
                    </p>
                    <p className="mt-1 text-xs font-semibold leading-snug text-violet-300">
                      {pessoa.papel}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <p className="flex-1 text-xs leading-relaxed text-white/55">{pessoa.bio}</p>

                  {pessoa.linkedin && (
                    <a
                      href={pessoa.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="-mb-1 flex min-h-[44px] items-center gap-1.5 border-t border-white/8 pt-3 text-[11px] font-semibold text-white/45 transition-colors hover:text-white"
                    >
                      <ExternalLink size={12} />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
