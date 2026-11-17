import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { linkWhatsApp } from "../data/content";
import { LinhaServico, ListaGrupos } from "../components/Servicos";
import { GRUPOS, TOTAL } from "../data/servicos";
import { Sitra } from "../components/Sitra";
import { rastrear } from "../lib/analytics";
import { BTN_PRIMARIO } from "../components/ui";

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function ServicosPage() {
  const [busca, setBusca] = useState("");

  useEffect(() => {
    document.title = "Serviços — BEPA | Consultoria, Assessoria e Serviços";
    return () => {
      document.title = "BEPA — Consultoria, Assessoria e Serviços | Sistemas, sites e marketing digital";
    };
  }, []);

  // A busca atravessa as frentes: quem já sabe o que quer não precisa adivinhar onde mora.
  const resultados = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return null;
    return GRUPOS.flatMap((g) =>
      g.itens
        .filter((s) => normalizar(`${s.titulo} ${s.resumo} ${s.itens.join(" ")} ${g.nome}`).includes(termo))
        .map((s) => ({ servico: s, grupo: g.nome })),
    );
  }, [busca]);

  return (
    <>
      <section className="border-b border-line pb-12 pt-28 sm:pb-16 sm:pt-36">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="flex items-center gap-3 text-sm font-semibold text-muted">
            <span className="h-px w-8 bg-brand" aria-hidden />
            Catálogo completo
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-[2.6rem] font-bold leading-[1.04] tracking-[-0.035em] text-ink sm:text-6xl">
            {TOTAL} serviços em seis frentes.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Comece pela frente que resolve o seu problema, ou busque direto pelo que você precisa.
          </p>

          <div className="relative mt-10 max-w-xl">
            <Search
              size={18}
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Estoque, boleto, agendamento…"
              aria-label="Buscar serviço"
              className="min-h-[52px] w-full rounded-md border border-ink/20 bg-white pl-12 pr-12 text-base text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {busca && (
              <button
                onClick={() => setBusca("")}
                aria-label="Limpar busca"
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:text-ink"
              >
                <X size={18} aria-hidden />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20" aria-live="polite">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {!resultados && <ListaGrupos />}

          {resultados && resultados.length > 0 && (
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-muted">
                {resultados.length} {resultados.length === 1 ? "serviço encontrado" : "serviços encontrados"}
              </p>
              <ul className="mt-4 border-t border-line">
                {resultados.map(({ servico, grupo }) => (
                  <LinhaServico key={servico.id} servico={servico} grupo={grupo} />
                ))}
              </ul>
            </div>
          )}

          {resultados && resultados.length === 0 && (
            <div className="max-w-xl border-t border-line pt-8">
              <p className="font-display text-2xl font-bold text-ink">Nenhum serviço com “{busca}”.</p>
              <p className="mt-3 text-base leading-relaxed text-muted">
                Boa parte do que fazemos é sob medida, então vale perguntar mesmo assim.
              </p>
              <a
                href={linkWhatsApp(`Oi! Procurei por "${busca}" no site de vocês e não achei. Vocês fazem isso?`)}
                target="_blank"
                rel="noreferrer"
                onClick={() => rastrear("whatsapp_click", { origem: "servicos_sem_resultado", busca })}
                className={`${BTN_PRIMARIO} mt-6`}
              >
                Perguntar no WhatsApp
                <ArrowRight size={16} aria-hidden />
              </a>
            </div>
          )}
        </div>
      </section>

      <Sitra />

      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-xl font-display text-3xl font-bold leading-[1.1] tracking-[-0.025em] sm:text-4xl">
              Não sabe por onde começar?
            </h2>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/70">
              No diagnóstico a gente indica os dois ou três serviços que resolvem primeiro. O resto espera.
            </p>
          </div>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "servicos_footer" })}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 text-sm font-semibold text-ink transition-colors hover:bg-brand-soft"
          >
            Pedir meu diagnóstico
            <ArrowRight size={16} aria-hidden />
          </a>
        </div>
      </section>
    </>
  );
}
