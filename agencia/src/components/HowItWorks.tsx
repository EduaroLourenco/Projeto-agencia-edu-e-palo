import { ETAPAS } from "../data/content";
import { Reveal } from "./Reveal";
import { CabecalhoSecao } from "./ui";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CabecalhoSecao numero="03" rotulo="Como funciona" titulo="Do primeiro papo ao sistema no ar, em cinco etapas.">
          Prazo e investimento ficam fechados na proposta, antes de qualquer linha de código.
        </CabecalhoSecao>

        <Reveal>
          <ol className="mt-14 grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-5 lg:gap-x-0">
            {ETAPAS.map((etapa) => (
              <li
                key={etapa.numero}
                className="border-t-2 border-ink py-6 lg:border-l lg:border-l-line lg:px-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="font-display text-sm font-semibold tabular-nums text-brand">{etapa.numero}</span>
                <h3 className="mt-3 font-display text-xl font-bold text-ink">{etapa.titulo}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{etapa.descricao}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
