import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";

export function Hero() {
  return (
    <section
      id="inicio"
      className="wrap grid grid-cols-1 items-center gap-[clamp(1.8rem,5.3vw,6rem)] py-[clamp(3rem,6vw,6rem)] md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.94fr)]"
    >
      <div>
        <p className="flex items-center gap-2.5 text-[0.9rem] font-[630] text-muted">
          <span className="block h-0.5 w-[1.65rem] bg-brand" aria-hidden />
          {AGENCIA.tagline}
        </p>
        <h1 className="titulo-hero mt-[0.18em]">
          Colocamos <span className="text-brand">vendas, números e equipe</span> em ordem.
        </h1>
        <p className="apoio mt-5">
          A BEPA entra na operação da sua empresa e começa pelo que mais pesa hoje. Site ou sistema? A Sitra, nossa
          frente de digitalização, assume.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a href="#frentes" className="btn">
            Ver as frentes
            <ArrowDownRight size={18} aria-hidden />
          </a>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "hero" })}
            className="link-seta"
          >
            Falar no WhatsApp
            <ArrowUpRight size={17} aria-hidden />
          </a>
        </div>
      </div>

      <figure className="min-w-0 bg-lilac-100 p-[clamp(0.85rem,2vw,1.8rem)]">
        <img
          src="/time/grupo.webp"
          alt="Paloma, Eduardo e Volpe, do time BEPA"
          width={805}
          height={690}
          fetchPriority="high"
          className="aspect-[1.17/1] w-full object-cover object-[52%_38%]"
        />
        <figcaption className="flex flex-wrap justify-between gap-x-4 gap-y-1 pt-3.5 text-[0.84rem] font-[625] text-[#413951]">
          <span>Paloma, Eduardo e Volpe</span>
          <span>Parte do time BEPA</span>
        </figcaption>
      </figure>
    </section>
  );
}
