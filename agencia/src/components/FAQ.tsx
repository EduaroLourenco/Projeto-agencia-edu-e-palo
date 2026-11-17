import { Plus } from "lucide-react";
import { FAQ as PERGUNTAS } from "../data/content";
import { CabecalhoSecao } from "./ui";

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CabecalhoSecao numero="05" rotulo="Perguntas frequentes" titulo="Antes de começar." />

        <div className="mt-12 border-t border-line md:ml-[25%]">
          {PERGUNTAS.map((item, i) => (
            <details key={item.pergunta} open={i === 0} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <span className="font-display text-lg font-semibold text-ink sm:text-xl">{item.pergunta}</span>
                <Plus
                  size={20}
                  aria-hidden
                  className="shrink-0 text-ink transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 text-base leading-relaxed text-muted">{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
