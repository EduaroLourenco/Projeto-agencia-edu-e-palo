import { Plus } from "lucide-react";
import { DUVIDAS, ETAPAS, TIME } from "../data/content";

export function ABepa() {
  return (
    <section id="a-bepa" className="border-t border-line">
      <div className="wrap py-[clamp(3.4rem,6vw,6rem)]">
        <div className="cabecalho !items-start">
          <h2 className="titulo-secao">A BEPA</h2>
          <div className="apoio">
            <p>
              Somos uma empresa de consultoria, assessoria e serviços. Organizamos o que vende, o que entra no caixa e
              como a equipe atende.
            </p>
            <p className="mt-3.5">Primeiro entendemos a operação. Depois decidimos juntos o que vem antes.</p>
          </div>
        </div>
        <ol className="mt-[clamp(2.2rem,4vw,3.5rem)] grid grid-cols-1 gap-x-[clamp(1.2rem,3vw,3rem)] md:grid-cols-3">
          {ETAPAS.map((etapa) => (
            <li key={etapa.titulo} className="border-t border-line py-4">
              <h3 className="text-[1.3rem] font-[650] tracking-[-0.02em]">{etapa.titulo}</h3>
              <p className="mt-1.5 max-w-[34ch] text-muted">{etapa.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Equipe() {
  return (
    <section id="equipe" className="wrap border-t border-line py-[clamp(3.2rem,6vw,5.8rem)]">
      <div className="cabecalho">
        <h2 className="titulo-secao">Quem faz a BEPA</h2>
        <p className="apoio">Você fala com quem cuida do trabalho.</p>
      </div>
      <ul className="mt-[clamp(2rem,4vw,3.2rem)] grid grid-cols-2 gap-x-[clamp(0.85rem,2.5vw,2.2rem)] gap-y-7 lg:grid-cols-4">
        {Object.values(TIME).map((p) => (
          <li key={p.nome}>
            <img
              src={p.foto}
              alt={`Retrato de ${p.nome}`}
              width={p.largura}
              height={p.altura}
              loading="lazy"
              style={{ objectPosition: p.foco }}
              className="aspect-[1/1.08] w-full bg-lilac-100 object-cover"
            />
            <h3 className="mt-3 text-[clamp(1.2rem,2vw,1.48rem)] font-[650] leading-tight tracking-[-0.024em]">
              {p.nome}
            </h3>
            <p className="mt-0.5 text-[0.9rem] text-muted">{p.papel}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Duvidas() {
  return (
    <section id="duvidas" className="border-t border-line">
      <div className="wrap cabecalho !items-start py-[clamp(3.2rem,6vw,5.8rem)]">
        <h2 className="titulo-secao">Dúvidas comuns</h2>
        <div className="border-b border-line">
          {DUVIDAS.map((d) => (
            <details key={d.pergunta} className="group border-t border-line">
              <summary className="flex min-h-[58px] items-center justify-between gap-5 py-3 text-[1.12rem] font-[630]">
                {d.pergunta}
                <Plus size={19} aria-hidden className="shrink-0 text-brand transition-transform group-open:rotate-45" />
              </summary>
              <p className="max-w-[48ch] pb-5 text-muted">{d.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
