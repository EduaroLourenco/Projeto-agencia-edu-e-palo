import { ArrowUpRight } from "lucide-react";
import { SITRA_URL } from "../data/content";
import { rastrear } from "../lib/analytics";
import { Reveal } from "./Reveal";

const OFERTAS = [
  { titulo: "Página de serviço", texto: "Uma página para divulgar um serviço e receber contatos." },
  { titulo: "Site da empresa", texto: "Para apresentar quem vocês são, o que fazem e como chegar." },
  { titulo: "Sistema da operação", texto: "Para organizar pedidos, agenda ou atendimento num lugar só." },
];

/**
 * Ponte para a Sitra, a frente de sites da BEPA. Usa a cor e o desenho da
 * própria Sitra: quem clica deve reconhecer a página onde vai chegar.
 */
export function Sitra() {
  return (
    <section aria-labelledby="sitra-titulo" className="pb-20 sm:pb-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="grid grid-cols-1 gap-10 border border-line bg-white p-6 sm:p-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <p className="flex items-center font-display text-2xl font-bold tracking-[-0.03em] text-ink" aria-label="Sitra by BEPA">
              <span className="mr-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-sitra text-lg text-white" aria-hidden>
                S
              </span>
              <span aria-hidden>itra</span>
              <span className="ml-2 self-end pb-1 text-xs font-semibold tracking-normal text-muted" aria-hidden>
                by BEPA
              </span>
            </p>

            <h2
              id="sitra-titulo"
              className="mt-6 font-display text-3xl font-bold leading-[1.1] tracking-[-0.025em] text-ink sm:text-4xl"
            >
              Precisa de um site? A Sitra cuida disso.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              É a nossa frente dedicada a sites e sistemas para empresas. Lá você vê templates e exemplos
              prontos antes de decidir, e define com o time o que precisa ficar pronto primeiro.
            </p>

            <a
              href={SITRA_URL}
              target="_blank"
              rel="noopener"
              onClick={() => rastrear("sitra_click", { origem: "secao_sitra" })}
              className="mt-8 inline-flex min-h-[48px] items-center gap-2 bg-sitra px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Conhecer a Sitra
              <ArrowUpRight size={16} aria-hidden />
            </a>
            <p className="mt-3 text-sm text-muted">sitra.agenciabepa.com.br</p>
          </div>

          <ul className="border-t border-line lg:col-span-6 lg:self-end">
            {OFERTAS.map((o) => (
              <li key={o.titulo} className="border-b border-line py-5">
                <p className="font-display text-lg font-bold text-ink">{o.titulo}</p>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{o.texto}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
