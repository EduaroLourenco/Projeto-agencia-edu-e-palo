import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { AGENCIA, PRODUTOS, SITRA_URL, TIME, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";

const LINK_TOPO = "inline-flex min-h-[44px] items-center gap-0.5 font-medium underline-offset-4 hover:underline";

export function Cabecalho() {
  return (
    <header className="sticky top-0 z-20 bg-white">
      <div className="wrap flex h-16 items-center justify-between">
        <a href="#inicio" aria-label={`${AGENCIA.nome}, início`} className="text-[1.65rem] font-bold leading-none tracking-[-0.04em]">
          BEPA
        </a>
        <nav aria-label="Principal" className="flex gap-5 sm:gap-8">
          <a href="#time" className={LINK_TOPO}>
            Time
          </a>
          <a href={SITRA_URL} target="_blank" rel="noopener" onClick={() => rastrear("sitra_click", { origem: "topo" })} className={LINK_TOPO}>
            Sitra
            <ArrowUpRight size={17} aria-hidden />
          </a>
          <a href="#contato" className={LINK_TOPO}>
            Contato
          </a>
        </nav>
      </div>
    </header>
  );
}

export function Trabalho() {
  return (
    <section id="trabalho" className="wrap colunas items-center py-[clamp(4rem,9vw,8rem)]">
      <img
        src="/time/grupo.webp"
        alt="Paloma, Eduardo e Volpe trabalhando juntos"
        width={805}
        height={690}
        loading="lazy"
        className="h-auto w-full rounded-[20px]"
      />
      <div>
        <h2 className="sr-only">Como trabalhamos</h2>
        <p className="texto-grande">
          Primeiro entendemos onde seu negócio trava. Depois você recebe um plano com escopo, prazo e investimento. Aí colocamos no ar e
          seguimos por perto.
        </p>
        <p className="mt-6 text-[1.2rem] text-suave">Dá para começar por uma coisa só.</p>
      </div>
    </section>
  );
}

export function Time() {
  const [ativo, setAtivo] = useState(0);
  const pessoa = TIME[ativo];

  useEffect(() => {
    for (const p of TIME) new Image().src = p.foto;
  }, []);

  return (
    <section id="time" className="wrap grid items-end gap-8 pb-[clamp(5rem,11vw,10rem)] lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
      <div>
        <h2 className="sr-only">Quem faz parte do time</h2>
        <ul>
          {TIME.map((p, i) => (
            <li key={p.nome}>
              <button
                onClick={() => setAtivo(i)}
                onMouseEnter={() => setAtivo(i)}
                onFocus={() => setAtivo(i)}
                aria-pressed={i === ativo}
                className={`min-h-[44px] py-1 text-left text-[clamp(2.15rem,5vw,5rem)] font-semibold leading-[1.04] tracking-[-0.03em] transition-colors ${
                  i === ativo ? "" : "text-apagado hover:text-tinta"
                }`}
              >
                {p.nome}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-7 min-h-[5.5rem] max-w-[34rem]">
          <p className="font-semibold">{pessoa.papel}</p>
          <p className="mt-0.5 text-suave">{pessoa.bio}</p>
        </div>
      </div>

      <div className="order-first w-[min(77.5vw,543px)] lg:order-last">
        <img
          key={pessoa.foto}
          src={pessoa.foto}
          alt={pessoa.nome}
          width={pessoa.largura}
          height={pessoa.altura}
          className="revelar h-[min(88vw,620px)] w-auto rounded-[20px]"
        />
      </div>
    </section>
  );
}

export function Sitra() {
  return (
    <section id="sitra" className="wrap colunas pb-[clamp(4rem,8vw,7rem)]">
      <h2 className="sr-only">Sitra e novos produtos</h2>
      <div className="lg:col-start-2">
        <a href={SITRA_URL} target="_blank" rel="noopener" onClick={() => rastrear("sitra_click", { origem: "bloco" })} className="group block">
          <img src="/sitra-logo.webp" alt="Sitra" width={270} height={91} loading="lazy" className="h-[clamp(2.3rem,3.6vw,3.2rem)] w-auto" />
          <span className="texto-grande mt-5 block">
            Site ou sistema? Quem faz é a Sitra, a nossa frente de desenvolvimento.{" "}
            <span className="whitespace-nowrap underline decoration-2 underline-offset-[0.14em] group-hover:decoration-4">
              Ver exemplos
              <ArrowUpRight aria-hidden className="ml-0.5 inline h-[0.85em] w-[0.85em] align-[-0.06em]" />
            </span>
          </span>
        </a>
        <p className="mt-10 text-[1.2rem] text-suave">Dois novos produtos em desenvolvimento. Em breve, aqui.</p>
        {PRODUTOS.map((p) => (
          <a key={p.url} href={p.url} target="_blank" rel="noopener" className="mr-6 mt-2 inline-flex min-h-[44px] items-center font-semibold underline underline-offset-4">
            {p.nome}
          </a>
        ))}
      </div>
    </section>
  );
}

export function Contato() {
  return (
    <section id="contato" className="bg-marca">
      <div className="wrap pb-8 pt-[clamp(3.5rem,7vw,6rem)]">
        <h2 className="text-[1.2rem] font-medium">Prefere falar direto?</h2>
        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noreferrer"
          onClick={() => rastrear("whatsapp_click", { origem: "contato_direto" })}
          className="mt-2 block whitespace-nowrap text-[min(10.6vw,10.5rem)] font-bold leading-[1.05] tracking-[-0.04em] hover:underline hover:decoration-[0.06em] hover:underline-offset-[0.1em]"
        >
          {AGENCIA.whatsappVisivel}
        </a>
        <footer className="mt-[clamp(3rem,6vw,5rem)] flex flex-wrap justify-between gap-x-8 gap-y-1">
          <p>
            © {new Date().getFullYear()} {AGENCIA.nomeCompleto}
          </p>
          <a href={SITRA_URL} target="_blank" rel="noopener" onClick={() => rastrear("sitra_click", { origem: "rodape" })} className="font-medium underline underline-offset-4">
            Sitra
          </a>
        </footer>
      </div>
    </section>
  );
}
