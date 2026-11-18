import { ArrowUpRight } from "lucide-react";
import { FRENTES, linkWhatsApp, type Frente } from "../data/content";
import { rastrear } from "../lib/analytics";

/* Largura alternada e capa própria: a mesma vitrine assimétrica dos exemplos da Sitra. */
const ESTILO: Record<string, { coluna: string; capa: string; texto: string }> = {
  vendas: { coluna: "lg:col-span-7", capa: "bg-night", texto: "text-warm" },
  financas: { coluna: "lg:col-span-5", capa: "bg-brand", texto: "text-white" },
  atendimento: { coluna: "lg:col-span-5", capa: "bg-lilac-200", texto: "text-ink" },
  sitra: { coluna: "lg:col-span-7", capa: "bg-warm", texto: "text-ink" },
};

function CartaoFrente({ frente }: { frente: Frente }) {
  const estilo = ESTILO[frente.id];
  const externo = frente.url ?? linkWhatsApp(frente.mensagem);

  return (
    <article className={`flex min-w-0 flex-col ${estilo.coluna}`}>
      <div className="grid h-[clamp(190px,21vw,300px)] grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden">
        <div className={`flex min-h-0 flex-col justify-end p-[clamp(0.9rem,2vw,1.8rem)] ${estilo.capa} ${estilo.texto}`}>
          {frente.id === "sitra" && (
            <img
              src="/sitra-logo.webp"
              alt="Sitra"
              width={105}
              height={35}
              loading="lazy"
              className="mb-auto w-[clamp(4.5rem,8vw,6rem)] mix-blend-multiply"
            />
          )}
          <p className="text-[clamp(1.45rem,2.7vw,2.5rem)] font-[640] leading-[1.02] tracking-[-0.04em]">
            {frente.ritmo.map((verbo) => (
              <span key={verbo} className="block">
                {verbo}
              </span>
            ))}
          </p>
        </div>
        <img
          src={frente.pessoa.foto}
          alt={`Retrato de ${frente.pessoa.nome}`}
          width={frente.pessoa.largura}
          height={frente.pessoa.altura}
          loading="lazy"
          style={{ objectPosition: frente.pessoa.foco }}
          className="h-full w-full object-cover"
        />
      </div>

      <p className="mt-3.5 text-[0.84rem] text-muted">
        {frente.area} · com {frente.pessoa.nome}
      </p>
      <h3 className="mt-1 text-[1.45rem] font-[650] leading-tight tracking-[-0.024em]">{frente.nome}</h3>
      <p className="mt-2 max-w-[46ch] text-muted">{frente.resumo}</p>
      <ul className="mt-3 mb-3 text-[0.95rem] font-[550]">
        {frente.entregas.map((item) => (
          <li key={item} className="border-t border-brand-line/70 py-2">
            {item}
          </li>
        ))}
      </ul>
      <a
        href={externo}
        target="_blank"
        rel={frente.url ? "noopener" : "noreferrer"}
        onClick={() =>
          frente.url
            ? rastrear("sitra_click", { origem: "frente" })
            : rastrear("whatsapp_click", { origem: "frente", frente: frente.id })
        }
        className="link-seta mt-auto self-start"
      >
        {frente.acao}
        <ArrowUpRight size={17} aria-hidden />
      </a>
    </article>
  );
}

export function Frentes() {
  return (
    <section id="frentes" className="bg-lilac-50 py-[clamp(3.1rem,6vw,5.8rem)]">
      <div className="wrap">
        <div className="cabecalho">
          <h2 className="titulo-secao">Quatro frentes, uma empresa.</h2>
          <p className="apoio">Cada frente tem uma pessoa responsável. Você contrata só a que precisa agora.</p>
        </div>
        <div className="mt-[clamp(2.2rem,4vw,3.5rem)] grid grid-cols-1 gap-x-[clamp(1.2rem,2.5vw,2.2rem)] gap-y-12 lg:grid-cols-12">
          {FRENTES.map((f) => (
            <CartaoFrente key={f.id} frente={f} />
          ))}
        </div>
      </div>
    </section>
  );
}
