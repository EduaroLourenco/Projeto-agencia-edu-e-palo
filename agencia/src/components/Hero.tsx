import { ArrowRight } from "lucide-react";
import { AGENCIA, TIME, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";
import { BTN_PRIMARIO, BTN_SECUNDARIO } from "./ui";

const FRENTES = ["Sistemas", "E-commerce", "Finanças", "Automação", "Marketing", "Consultoria"];

export function Hero() {
  return (
    <section id="top" className="border-b border-line pb-14 pt-24 sm:pb-20 sm:pt-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-3 text-sm font-semibold text-muted">
            <span className="h-px w-8 bg-brand" aria-hidden />
            {AGENCIA.tagline}
          </p>

          <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[4.4rem]">
            Tecnologia, estratégia e <span className="text-brand">resultado</span> para o seu negócio.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Sistemas sob medida, e-commerce e marketplace, consultoria financeira, automação com IA e
            marketing digital. Um time só cuidando do que hoje trava a sua operação.
          </p>

          <div className="mt-8 hidden flex-wrap gap-3 sm:flex">
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "hero" })}
              className={BTN_PRIMARIO}
            >
              Falar no WhatsApp
              <ArrowRight size={16} aria-hidden />
            </a>
            <a href="#servicos" className={BTN_SECUNDARIO}>
              Ver o que fazemos
            </a>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-5 text-sm font-medium text-muted">
            {FRENTES.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        {/* Gente de verdade logo na primeira tela: é o que separa uma
            empresa de um template. */}
        <figure className="bg-brand-soft p-4 sm:p-6 lg:col-span-5">
          <ul className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {TIME.map((pessoa) => (
              <li key={pessoa.nome}>
                <img
                  src={pessoa.foto}
                  alt={`Retrato de ${pessoa.nome}`}
                  width={680}
                  height={850}
                  loading="eager"
                  decoding="async"
                  className="aspect-[4/5] w-full bg-paper-2 object-cover"
                />
                <p className="mt-2.5 text-sm font-semibold leading-tight text-ink">
                  {pessoa.nome.split(" ")[0]}
                </p>
                <p className="mt-0.5 text-xs leading-snug text-muted">{pessoa.profissao}</p>
              </li>
            ))}
          </ul>
          <figcaption className="mt-5 flex justify-between border-t border-brand/15 pt-3 text-xs font-semibold text-ink">
            <span>Quem atende você</span>
            <a href="#quem-somos" className="text-brand hover:underline">
              Conhecer o time
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
