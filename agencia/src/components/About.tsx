import { TIME } from "../data/content";
import { Reveal } from "./Reveal";
import { CabecalhoSecao } from "./ui";

export function About() {
  return (
    <section id="quem-somos" className="border-y border-line bg-paper-2 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CabecalhoSecao
          numero="04"
          rotulo="Quem somos"
          titulo="Código, números e atendimento, nas mesmas mãos."
        >
          Juntamos engenharia de software, finanças e gestão de pessoas para atender quem vende bem no
          boca a boca e trava na hora de crescer. Cada projeto passa pelas três frentes.
        </CabecalhoSecao>

        <Reveal>
        <ul className="mt-12 border-t border-line md:ml-[25%]">
          {TIME.map((pessoa) => (
              <li
                key={pessoa.nome}
                className="grid grid-cols-[5.5rem_1fr] gap-5 border-b border-line py-7 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <img
                  src={pessoa.foto}
                  alt={`Retrato de ${pessoa.nome}`}
                  width={680}
                  height={850}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full bg-paper object-cover"
                />
                <div>
                  <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">{pessoa.nome}</h3>
                  <p className="mt-1 text-sm font-semibold text-brand">{pessoa.papel}</p>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">{pessoa.bio}</p>
                </div>
              </li>
          ))}
        </ul>
        </Reveal>
      </div>
    </section>
  );
}
