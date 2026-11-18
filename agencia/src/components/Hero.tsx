import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AGENCIA, NICHOS, TIME, linkWhatsApp } from "../data/content";
import { GRUPOS, TOTAL, buscarServicos } from "../data/servicos";
import { useLista } from "../lib/lista";
import { IconeServico } from "./IconeServico";

const OBJETIVOS = ["vender mais.", "lucrar melhor.", "atender rápido.", "crescer online."];
const SUGESTOES = ["Estoque", "Fluxo de caixa", "Agendamento", "Marketplace", "Automação"];

function Contador({ ate }: { ate: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visivel = useInView(ref, { once: true });
  const reduzir = useReducedMotion();
  const [valor, setValor] = useState(reduzir ? ate : 0);

  useEffect(() => {
    if (!visivel || reduzir) return;
    const controle = animate(0, ate, { duration: 1, ease: "easeOut", onUpdate: (v) => setValor(Math.round(v)) });
    return () => controle.stop();
  }, [visivel, reduzir, ate]);

  return <span ref={ref}>{valor}</span>;
}

function BuscaServicos() {
  const { abrir } = useLista();
  const [termo, setTermo] = useState("");
  const [foco, setFoco] = useState(false);
  const achados = termo.trim() ? buscarServicos(termo) : [];
  const mostrar = foco && termo.trim().length > 0;

  return (
    <div
      className="relative mt-7 max-w-xl"
      onFocus={() => setFoco(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFoco(false);
      }}
    >
      <label htmlFor="busca-hero" className="mb-2 block text-[0.95rem] font-[620]">
        O que você precisa resolver?
      </label>
      <div className="relative">
        <Search size={20} aria-hidden className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brand" />
        <input
          id="busca-hero"
          type="search"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && achados[0]) abrir(achados[0].id);
            if (e.key === "Escape") setTermo("");
          }}
          placeholder={`Busque entre ${TOTAL} serviços`}
          autoComplete="off"
          className="campo !min-h-[60px] !rounded-full !pl-13 !pr-13 shadow-card [&::-webkit-search-cancel-button]:hidden"
        />
        {termo && (
          <button
            onClick={() => setTermo("")}
            aria-label="Limpar busca"
            className="absolute right-2.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-soft-2"
          >
            <X size={18} aria-hidden />
          </button>
        )}
      </div>

      <AnimatePresence>
        {mostrar && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.14 }}
            className="cartao absolute inset-x-0 top-full z-30 mt-2 max-h-[340px] overflow-y-auto p-2 !shadow-lift"
          >
            <p aria-live="polite" className="px-3 py-2 text-sm font-[560] text-body">
              {achados.length} {achados.length === 1 ? "serviço encontrado" : "serviços encontrados"}
            </p>
            {achados.slice(0, 6).map((s) => (
              <button
                key={s.id}
                onClick={() => abrir(s.id)}
                className="flex w-full items-center gap-3 rounded-2xl p-2.5 text-left hover:bg-soft"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <IconeServico nome={s.icone} size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block font-[620] leading-snug">{s.titulo}</span>
                  <span className="block truncate text-sm text-body">{s.grupoNome}</span>
                </span>
              </button>
            ))}
            {achados.length === 0 && (
              <a
                href={linkWhatsApp(`Olá! Procurei por "${termo.trim()}" no site da BEPA. Vocês fazem isso?`)}
                target="_blank"
                rel="noreferrer"
                className="m-1 flex items-center justify-between rounded-2xl bg-brand-soft p-3 font-[620] text-brand-dark"
              >
                Perguntar no WhatsApp
                <ArrowRight size={17} aria-hidden />
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGESTOES.map((s) => (
          <button
            key={s}
            onClick={() => {
              setTermo(s);
              document.getElementById("busca-hero")?.focus();
            }}
            className="min-h-[40px] rounded-full border border-line-strong bg-white px-3.5 text-sm font-[560] transition-colors hover:border-brand hover:text-brand"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const [indice, setIndice] = useState(0);
  const reduzir = useReducedMotion();

  useEffect(() => {
    if (reduzir) return;
    const id = setInterval(() => setIndice((i) => (i + 1) % OBJETIVOS.length), 2400);
    return () => clearInterval(id);
  }, [reduzir]);

  const destaques = [GRUPOS[0], GRUPOS[2]];

  return (
    <section id="inicio" className="fundo-hero -mt-[79px] pb-14 pt-[calc(79px+clamp(2.5rem,6vw,5rem))]">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <div>
          <p className="etiqueta">{AGENCIA.tagline}</p>
          <h1 className="mt-5 text-[clamp(2.75rem,6vw,5.2rem)] font-[660] leading-[1.03] tracking-[-0.04em]">
            <span className="sr-only">Tecnologia e estratégia para vender mais, lucrar melhor e crescer online.</span>
            <span aria-hidden>
              Tecnologia e estratégia para
              <span className="relative block h-[1.1em] overflow-hidden text-brand">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={OBJETIVOS[indice]}
                    initial={{ y: "70%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-70%", opacity: 0 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="absolute left-0 top-0 whitespace-nowrap"
                  >
                    {OBJETIVOS[indice]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>
          <p className="sub mt-4">
            Sistemas, e-commerce, marketplace, finanças, dados e automação para empresas que querem crescer com controle.
          </p>

          <BuscaServicos />

          <dl className="mt-9 flex flex-wrap gap-x-9 gap-y-4">
            {[
              { n: TOTAL, t: "serviços" },
              { n: GRUPOS.length, t: "frentes" },
              { n: NICHOS.length, t: "setores mapeados" },
            ].map((s) => (
              <div key={s.t}>
                <dd className="text-[2rem] font-[660] leading-none tracking-[-0.03em]">
                  <Contador ate={s.n} />
                </dd>
                <dt className="mt-1 text-[0.95rem] text-body">{s.t}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative pb-8 pt-4 lg:pl-4">
          <img
            src="/time/grupo.webp"
            alt="Paloma, Eduardo e Volpe, parte do time BEPA"
            width={805}
            height={690}
            fetchPriority="high"
            className="aspect-[1.05/1] w-full rounded-[36px] object-cover object-[52%_38%] shadow-lift"
          />
          {destaques.map((g, i) => (
            <motion.div key={g.id} animate={{ y: [0, -7, 0] }} transition={{ duration: 5, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }} className={`absolute ${i === 0 ? "-left-1 top-10 lg:-left-6" : "-right-1 bottom-20 lg:-right-4"}`}>
              <Link
                to="/#servicos"
                className="cartao flex items-center gap-2.5 !rounded-2xl py-2 pl-2 pr-4 !shadow-lift transition-colors hover:border-brand"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                  <IconeServico nome={g.icone} size={18} />
                </span>
                <span>
                  <span className="block max-w-[13.5rem] truncate text-sm font-[640]">{g.nome}</span>
                  <span className="block text-xs text-body">{g.itens.length} serviços</span>
                </span>
              </Link>
            </motion.div>
          ))}
          <div className="absolute bottom-0 left-5 flex items-center gap-2.5 rounded-full border border-line bg-white py-1.5 pl-1.5 pr-4 shadow-card">
            <span className="flex -space-x-2">
              {TIME.map((p) => (
                <img
                  key={p.nome}
                  src={p.foto}
                  alt=""
                  width={36}
                  height={36}
                  style={{ objectPosition: p.foco }}
                  className="h-9 w-9 rounded-full border-2 border-white object-cover"
                />
              ))}
            </span>
            <span className="text-sm font-[620]">{TIME.length} pessoas no time</span>
          </div>
        </div>
      </div>
    </section>
  );
}
