import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SITRA_URL, linkWhatsApp } from "../data/content";
import { GRUPOS, TOTAL, type Grupo, type Servico } from "../data/servicos";
import { rastrear } from "../lib/analytics";
import { BTN_PRIMARIO, CabecalhoSecao } from "./ui";

/** Grupo cujo trabalho de site é feito pela Sitra. */
const GRUPO_SITRA = "site-marketing";

export function LinhaServico({ servico, grupo }: { servico: Servico; grupo?: string }) {
  return (
    <li className="border-b border-line last:border-b-0">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
          <span>
            <span className="block text-base font-semibold leading-snug text-ink">{servico.titulo}</span>
            {grupo && <span className="mt-1 block text-sm text-muted">{grupo}</span>}
          </span>
          <ChevronDown
            size={18}
            aria-hidden
            className="mt-0.5 shrink-0 text-muted transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="pb-5">
          <p className="text-sm leading-relaxed text-muted">{servico.resumo}</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {servico.itens.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/85">
                <span className="mt-[0.6rem] h-px w-3 shrink-0 bg-brand" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  );
}

function PainelGrupo({ grupo, onClose }: { grupo: Grupo; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 sm:items-center sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="painel-titulo"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-xl bg-paper sm:max-w-xl sm:rounded-lg"
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-7">
          <div>
            <p className="text-sm font-semibold text-muted">
              {grupo.itens.length} serviços nesta frente
            </p>
            <h3 id="painel-titulo" className="mt-1 font-display text-xl font-bold leading-snug text-ink">
              {grupo.nome}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            autoFocus
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-ink hover:bg-paper-2"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
          {grupo.itens.map((s) => (
            <LinhaServico key={s.id} servico={s} />
          ))}
        </ul>

        <div className="flex flex-col gap-3 border-t border-line px-5 py-5 sm:px-7">
          {grupo.id === GRUPO_SITRA && (
            <a
              href={SITRA_URL}
              target="_blank"
              rel="noopener"
              onClick={() => rastrear("sitra_click", { origem: "painel_servicos" })}
              className="flex items-center justify-between gap-3 rounded-md border border-ink/20 px-4 py-3 text-sm"
            >
              <span>
                <span className="font-semibold text-ink">Sites e landing pages ficam com a Sitra.</span>{" "}
                <span className="text-muted">Veja templates e exemplos.</span>
              </span>
              <ArrowUpRight size={16} className="shrink-0 text-ink" aria-hidden />
            </a>
          )}
          <a
            href={linkWhatsApp(
              `Oi! Vi no site de vocês a área de ${grupo.nome} e quero entender o que dá pra fazer no meu caso.`,
            )}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "grupo_servico", grupo: grupo.id })}
            className={`${BTN_PRIMARIO} w-full`}
          >
            Falar sobre {grupo.nome.toLowerCase()}
            <ArrowRight size={16} aria-hidden />
          </a>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/** As seis frentes como lista editorial; cada linha abre o painel com os serviços. */
export function ListaGrupos() {
  const [aberto, setAberto] = useState<Grupo | null>(null);
  const gatilho = useRef<HTMLButtonElement | null>(null);
  const fechar = useCallback(() => {
    setAberto(null);
    gatilho.current?.focus();
  }, []);

  return (
    <>
      <ul className="border-t border-line">
        {GRUPOS.map((g) => (
          <li key={g.id} className="border-b border-line">
            <button
              onClick={(e) => {
                gatilho.current = e.currentTarget;
                setAberto(g);
              }}
              aria-haspopup="dialog"
              className="group grid w-full grid-cols-[1fr_auto] items-start gap-x-4 py-6 text-left transition-colors hover:bg-paper-2 sm:grid-cols-[1fr_8rem_auto] sm:px-3 sm:py-7"
            >
              <span>
                <span className="block font-display text-xl font-bold leading-snug tracking-[-0.015em] text-ink transition-colors group-hover:text-brand sm:text-2xl">
                  {g.nome}
                </span>
                <span className="mt-1.5 block max-w-xl text-[15px] leading-relaxed text-muted">
                  {g.promessa}
                </span>
                <span className="mt-2 block text-sm text-muted sm:hidden">{g.itens.length} serviços</span>
              </span>
              <span className="hidden pt-1.5 text-sm text-muted sm:block">{g.itens.length} serviços</span>
              <ArrowRight
                size={20}
                aria-hidden
                className="mt-1 text-ink transition-transform group-hover:translate-x-1 group-hover:text-brand"
              />
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>{aberto && <PainelGrupo grupo={aberto} onClose={fechar} />}</AnimatePresence>
    </>
  );
}

/** Seção de serviços da home. */
export function SecaoServicos() {
  return (
    <section id="servicos" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CabecalhoSecao numero="01" rotulo="Serviços" titulo={`Seis frentes, ${TOTAL} serviços.`}>
          Organizadas pelo problema que você tem, não pelo nome técnico do que a gente faz. Escolha
          uma frente para ver tudo o que cabe nela.
        </CabecalhoSecao>

        <div className="mt-12 md:ml-[25%]">
          <ListaGrupos />
          <Link
            to="/servicos"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            Buscar no catálogo completo
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
