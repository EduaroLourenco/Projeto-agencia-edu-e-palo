import { Reveal } from "./Reveal";
import { RetratoTime } from "./RetratoTime";
import { TIME } from "../data/content";

/* Escalonamento no desktop: as três colunas descem em degrau em vez de
   ficarem alinhadas numa régua. É transform, não margem — não mexe na
   altura da linha, então nenhum cartão fica com sobra embaixo. */
const DEGRAU = ["md:translate-y-0", "md:translate-y-8", "md:translate-y-16"];

export function About() {
  return (
    <section id="quem-somos" className="relative border-y border-white/5 bg-surface/40 py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
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

        {/* No celular vira carrossel. Empilhados, três cartões com foto grande
            somavam quase três telas só de time; deslizando, as fotos continuam
            grandes e a seção cabe em uma. */}
        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-14 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-20 [&::-webkit-scrollbar]:hidden">
          {TIME.map((pessoa, i) => (
            <Reveal
              key={pessoa.nome}
              delay={0.08 + i * 0.07}
              className={`h-full w-[85%] shrink-0 snap-center sm:w-[60%] md:w-auto ${DEGRAU[i]}`}
            >
              <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-surface transition-colors duration-300 hover:border-violet-400/40">
                <div className="relative">
                  <RetratoTime
                    src={pessoa.foto}
                    alt={`Retrato de ${pessoa.nome}`}
                    intensidade={8}
                    className="aspect-[4/5]"
                  />

                  {/* Chip próprio, não texto solto com mix-blend: as fotos têm
                      fundo claro e escuro, e o número precisa ler nos dois. */}
                  <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-ink/60 px-2.5 py-1 font-display text-[11px] font-bold text-white/80 backdrop-blur-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* O degradê nasce do próprio fundo do site, então o nome
                      fica legível em cima de qualquer foto. */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent px-5 pb-5 pt-20">
                    <p className="font-display text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                      {pessoa.nome}
                    </p>
                    <p className="mt-1.5 text-xs font-semibold leading-snug text-violet-300 transition-colors duration-300 group-hover:text-violet-200">
                      {pessoa.papel}
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <p className="flex-1 text-[13px] leading-relaxed text-white/55">{pessoa.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
