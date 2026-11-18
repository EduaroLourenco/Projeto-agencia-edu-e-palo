import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Plus, Search, Send, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { linkWhatsApp } from "../data/content";
import { GRUPOS, SERVICOS, TOTAL, buscarServicos, type ServicoCompleto } from "../data/servicos";
import { rastrear } from "../lib/analytics";
import { mensagemDaLista, useLista } from "../lib/lista";
import { IconeServico } from "./IconeServico";
import { Reveal } from "./Reveal";

const LIMITE_HOME = 9;

function BotaoLista({ id, titulo, grande = false }: { id: string; titulo: string; grande?: boolean }) {
  const { ids, alternar } = useLista();
  const marcado = ids.includes(id);

  if (grande) {
    return (
      <button onClick={() => alternar(id)} aria-pressed={marcado} className="btn-linha w-full sm:w-auto">
        {marcado ? <Check size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
        {marcado ? "Na minha lista" : "Adicionar à lista"}
      </button>
    );
  }

  return (
    <button
      onClick={() => alternar(id)}
      aria-pressed={marcado}
      aria-label={`${marcado ? "Remover da lista" : "Adicionar à lista"}: ${titulo}`}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors ${
        marcado ? "border-brand bg-brand text-white" : "border-line-strong text-ink hover:border-brand hover:text-brand"
      }`}
    >
      {marcado ? <Check size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
    </button>
  );
}

function CartaoServico({ servico }: { servico: ServicoCompleto }) {
  const { abrir } = useLista();
  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="cartao group flex h-full flex-col p-5 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
          <IconeServico nome={servico.icone} />
        </span>
        <BotaoLista id={servico.id} titulo={servico.titulo} />
      </div>
      <p className="mt-4 text-[0.84rem] font-[560] text-body">{servico.grupoNome}</p>
      <h3 className="mt-1 text-[1.17rem] font-[640] leading-snug tracking-[-0.012em]">{servico.titulo}</h3>
      <p className="mt-2 line-clamp-3 text-[0.97rem] leading-relaxed text-body">{servico.resumo}</p>
      <button
        onClick={() => abrir(servico.id)}
        aria-haspopup="dialog"
        className="mt-auto inline-flex min-h-[44px] items-center gap-1.5 self-start pt-3 font-[620] text-brand"
      >
        Ver detalhes
        <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </motion.article>
  );
}

export function Catalogo({ completo = false }: { completo?: boolean }) {
  const [grupo, setGrupo] = useState("todos");
  const [termo, setTermo] = useState("");
  const [expandido, setExpandido] = useState(completo);

  const achados = useMemo(() => {
    const base = grupo === "todos" ? SERVICOS : SERVICOS.filter((s) => s.grupoId === grupo);
    return buscarServicos(termo, base);
  }, [grupo, termo]);

  const filtrando = grupo !== "todos" || termo.trim() !== "";
  const visiveis = expandido || filtrando ? achados : achados.slice(0, LIMITE_HOME);
  const atual = GRUPOS.find((g) => g.id === grupo);
  const Titulo = completo ? "h1" : "h2";

  return (
    <section id="servicos" className={`bg-soft ${completo ? "pb-20 pt-32 sm:pt-36" : "secao"}`}>
      <div className="wrap">
        <Reveal className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="etiqueta !bg-white">Catálogo completo</p>
            <Titulo className="titulo mt-4">{TOTAL} formas de destravar seu negócio.</Titulo>
          </div>
          <p className="sub max-w-md">Filtre pela sua necessidade, abra os detalhes e monte sua lista para receber uma proposta.</p>
        </Reveal>

        <div className="mt-9 flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="relative xl:w-80 xl:shrink-0">
            <Search size={18} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand" />
            <input
              type="search"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Buscar serviço"
              aria-label="Buscar serviço no catálogo"
              className="campo !rounded-full !pl-11"
            />
          </div>
          <div role="group" aria-label="Filtrar por frente" className="-mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] xl:mx-0 xl:flex-wrap xl:px-0">
            {[{ id: "todos", nome: "Todos" }, ...GRUPOS].map((g) => {
              const ativo = grupo === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGrupo(g.id)}
                  aria-pressed={ativo}
                  className={`relative min-h-[46px] shrink-0 whitespace-nowrap rounded-full px-4 text-[0.94rem] font-[600] transition-colors ${
                    ativo ? "text-white" : "bg-white text-ink hover:bg-soft-2"
                  }`}
                >
                  {ativo && (
                    <motion.span layoutId="filtro-ativo" transition={{ duration: 0.2 }} className="absolute inset-0 rounded-full bg-brand" />
                  )}
                  <span className="relative">{g.nome}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2" aria-live="polite">
          <p className="font-[580] text-body">
            {achados.length} {achados.length === 1 ? "serviço" : "serviços"}
            {atual ? ` em ${atual.nome}` : ""}
          </p>
          {atual && <p className="text-body">{atual.promessa}</p>}
        </div>

        {achados.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visiveis.map((s) => (
                <CartaoServico key={s.id} servico={s} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="cartao mt-5 p-8 text-center">
            <p className="text-xl font-[640]">Nada encontrado para “{termo}”.</p>
            <p className="mt-2 text-body">Boa parte do que fazemos é sob medida. Vale perguntar.</p>
            <a
              href={linkWhatsApp(`Olá! Procurei por "${termo.trim()}" no site da BEPA. Vocês fazem isso?`)}
              target="_blank"
              rel="noreferrer"
              className="btn mt-5"
            >
              Perguntar no WhatsApp
            </a>
          </div>
        )}

        {!completo && !filtrando && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {!expandido && (
              <button onClick={() => setExpandido(true)} className="btn">
                Ver todos os {TOTAL} serviços
                <Plus size={18} aria-hidden />
              </button>
            )}
            <Link to="/servicos" className="btn-linha bg-white">
              Abrir catálogo em página própria
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export function ModalServico({ id, onClose }: { id: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const servico = SERVICOS.find((s) => s.id === id);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (servico && !el.open) el.showModal();
    if (!servico && el.open) el.close();
  }, [servico]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-titulo"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="modal"
    >
      {servico && (
        <>
          <div className="flex items-start gap-3 border-b border-line p-5 sm:p-6">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <IconeServico nome={servico.icone} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-[560] text-body">{servico.grupoNome}</p>
              <h3 id="modal-titulo" className="text-xl font-[650] leading-snug tracking-[-0.015em]">
                {servico.titulo}
              </h3>
            </div>
            <button onClick={onClose} aria-label="Fechar" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-soft-2">
              <X size={19} aria-hidden />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
            <p className="text-[1.05rem] leading-relaxed text-body">{servico.resumo}</p>
            <h4 className="mt-5 font-[640]">O que entra</h4>
            <ul className="mt-2 space-y-2.5">
              {servico.itens.map((item) => (
                <li key={item} className="flex gap-2.5 leading-snug">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <Check size={13} aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 border-t border-line p-4 sm:flex-row sm:justify-end sm:p-5">
            <BotaoLista id={servico.id} titulo={servico.titulo} grande />
            <a
              href={linkWhatsApp(`Olá! Vim pelo site da BEPA e quero falar sobre: ${servico.titulo}.`)}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "servico", servico: servico.id })}
              className="btn"
            >
              Falar sobre isso
              <ArrowRight size={17} aria-hidden />
            </a>
          </div>
        </>
      )}
    </dialog>
  );
}

export function BarraLista() {
  const { ids, limpar } = useLista();
  const titulos = SERVICOS.filter((s) => ids.includes(s.id)).map((s) => s.titulo);

  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.aside
          aria-label="Minha lista de serviços"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="sobre-escuro fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-xl items-center gap-2 rounded-full bg-ink py-2 pl-5 pr-2 text-white shadow-lift"
        >
          <p className="min-w-0 flex-1 truncate font-[600]" aria-live="polite">
            {ids.length} {ids.length === 1 ? "serviço" : "serviços"} na lista
          </p>
          <button onClick={limpar} aria-label="Limpar lista" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/15">
            <Trash2 size={18} aria-hidden />
          </button>
          <a
            href={linkWhatsApp(mensagemDaLista(titulos))}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "minha_lista", total: ids.length })}
            className="btn btn-claro !min-h-[44px] !px-4 text-[0.94rem]"
          >
            <Send size={16} aria-hidden />
            Enviar
          </a>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
