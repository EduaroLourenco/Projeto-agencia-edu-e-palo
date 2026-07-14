import { Reveal } from "./Reveal";

const DUPLA = [
  { iniciais: "E", papel: "Estratégia & Produto" },
  { iniciais: "P", papel: "Design & Experiência" },
];

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
            Somos uma dupla que decidiu juntar design, código e visão de negócio pra resolver um
            problema bem específico: negócios que vendem muito bem no boca a boca, mas travam na
            hora de escalar online. A gente entra exatamente nesse ponto — sem prometer mágica,
            sem contrato eterno, só sistema que funciona de verdade.
          </p>
          <p className="mt-4 text-white/60">
            Cada projeto passa pelas duas mãos: uma cuida da estratégia e do que faz sentido pro
            seu negócio, a outra cuida de como fica bonito, rápido e fácil de usar. No fim, o que
            chega pra você é um sistema pensado de ponta a ponta — não um pedaço solto.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex justify-center gap-6 lg:justify-end">
          {DUPLA.map((pessoa) => (
            <div
              key={pessoa.iniciais}
              className="flex w-40 flex-col items-center gap-4 rounded-3xl border border-white/10 bg-surface p-6 text-center"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-2xl font-extrabold text-ink">
                {pessoa.iniciais}
              </span>
              <p className="text-xs font-medium text-white/55">{pessoa.papel}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
