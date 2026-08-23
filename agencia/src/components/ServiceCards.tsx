import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ChevronDown,
  X,
  Code2,
  Megaphone,
  MessageCircle,
  Music2,
  CalendarDays,
  UtensilsCrossed,
  Truck,
  Workflow,
  Store,
  Wallet,
  SearchCheck,
  LayoutDashboard,
  RefreshCw,
  BarChart3,
  UsersRound,
  CalendarCheck,
  Rocket,
  Palette,
  ShieldCheck,
  Bot,
  LineChart,
  BadgeCheck,
  PlugZap,
  MonitorSmartphone,
  SlidersHorizontal,
  Radar,
  FileText,
  Building2,
  Calculator,
  Ticket,
  ShoppingCart,
  Network,
  Gauge,
  AppWindow,
  ServerCog,
  PieChart,
  Receipt,
  Landmark,
  CreditCard,
  Percent,
  Split,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { MODULOS, linkWhatsApp } from "../data/content";
import { CATEGORIAS_SERVICOS, GRUPOS_SERVICOS, RESUMOS_SERVICOS } from "../data/servicos";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

/* ─── Mapa de ícones ─── */
const ICONES: Record<string, ReactNode> = {
  "comercio-whatsapp": <MessageCircle size={20} />,
  "sites-sistemas": <Code2 size={20} />,
  "marketing-digital": <Megaphone size={20} />,
  "marketplace-ecommerce": <Store size={20} />,
  financas: <Wallet size={20} />,
  "consultoria-automacao": <Workflow size={20} />,
  "vida-noturna": <Music2 size={20} />,
  agendamento: <CalendarDays size={20} />,
  alimentacao: <UtensilsCrossed size={20} />,
  "logistica-44": <Truck size={20} />,
  "search-check": <SearchCheck size={20} />,
  "layout-dashboard": <LayoutDashboard size={20} />,
  "refresh-cw": <RefreshCw size={20} />,
  "bar-chart-3": <BarChart3 size={20} />,
  "users-round": <UsersRound size={20} />,
  "calendar-check": <CalendarCheck size={20} />,
  rocket: <Rocket size={20} />,
  palette: <Palette size={20} />,
  "shield-check": <ShieldCheck size={20} />,
  bot: <Bot size={20} />,
  "line-chart": <LineChart size={20} />,
  "badge-check": <BadgeCheck size={20} />,
  "plug-zap": <PlugZap size={20} />,
  "monitor-smartphone": <MonitorSmartphone size={20} />,
  "sliders-horizontal": <SlidersHorizontal size={20} />,
  radar: <Radar size={20} />,
  "file-text": <FileText size={20} />,
  "building-2": <Building2 size={20} />,
  calculator: <Calculator size={20} />,
  store: <Store size={20} />,
  ticket: <Ticket size={20} />,
  "shopping-cart": <ShoppingCart size={20} />,
  network: <Network size={20} />,
  gauge: <Gauge size={20} />,
  "app-window": <AppWindow size={20} />,
  "server-cog": <ServerCog size={20} />,
  "pie-chart": <PieChart size={20} />,
  receipt: <Receipt size={20} />,
  landmark: <Landmark size={20} />,
  "credit-card": <CreditCard size={20} />,
  percent: <Percent size={20} />,
  split: <Split size={20} />,
  "trending-up": <TrendingUp size={20} />,
  megaphone: <Megaphone size={20} />,
  wallet: <Wallet size={20} />,
};

/* ─── Tipagem dos serviços ─── */
interface Servico {
  id: string;
  icone: string;
  titulo: string;
  resumo: string;
  itens: string[];
}

/** Índice de todos os serviços por id — MODULOS + categorias, sem duplicar. */
const POR_ID: Record<string, Servico> = Object.fromEntries([
  ...MODULOS.map((m) => [
    m.id,
    {
      id: m.id,
      icone: m.id,
      titulo: m.titulo,
      resumo: RESUMOS_SERVICOS[m.id] ?? m.resumo,
      itens: m.itens,
    },
  ]),
  ...CATEGORIAS_SERVICOS.flatMap((c) =>
    c.servicos.map((s) => [
      s.id,
      { id: s.id, icone: s.icone, titulo: s.titulo, resumo: s.resumo, itens: s.itens },
    ]),
  ),
]);

/** Grupos com itens resolvidos */
const GRUPOS = GRUPOS_SERVICOS.map((g) => ({
  ...g,
  itens: g.servicos.map((id) => POR_ID[id]).filter(Boolean),
}));

type GrupoResolvido = (typeof GRUPOS)[number];

const TOTAL = GRUPOS.reduce((soma, g) => soma + g.itens.length, 0);

/* ─── Cores por posição — alterna roxo, rosa, azul ─── */
const CARD_ACCENT = [
  { bg: "bg-violet-500/15", text: "text-violet-300", border: "group-hover:border-violet-500/40" },
  { bg: "bg-pink-500/15", text: "text-pink-300", border: "group-hover:border-pink-500/40" },
  { bg: "bg-blue-500/15", text: "text-blue-300", border: "group-hover:border-blue-500/40" },
  { bg: "bg-violet-500/15", text: "text-violet-300", border: "group-hover:border-violet-500/40" },
  { bg: "bg-blue-500/15", text: "text-blue-300", border: "group-hover:border-blue-500/40" },
  { bg: "bg-pink-500/15", text: "text-pink-300", border: "group-hover:border-pink-500/40" },
];

/* ─── Linha de serviço com detalhes recolhidos ─── */
function LinhaServico({ servico }: { servico: Servico }) {
  const [aberto, setAberto] = useState(false);

  return (
    <li className="border-b border-white/8 last:border-b-0">
      <button
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex w-full items-start gap-3 py-4 text-left"
      >
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/12 text-violet-300 [&>svg]:h-4 [&>svg]:w-4">
          {ICONES[servico.icone]}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="font-display text-sm font-bold leading-snug text-white">
              {servico.titulo}
            </span>
            <ChevronDown
              size={15}
              className={`mt-0.5 shrink-0 text-white/40 transition-transform ${aberto ? "rotate-180" : ""}`}
            />
          </span>
          {aberto && (
            <>
              <span className="mt-2 block text-sm leading-relaxed text-white/60">{servico.resumo}</span>
              <span className="mt-3 flex flex-col gap-2">
                {servico.itens.map((i) => (
                  <span key={i} className="flex items-start gap-2 text-xs leading-relaxed text-white/60">
                    <Check size={12} className="mt-0.5 shrink-0 text-violet-300" />
                    {i}
                  </span>
                ))}
              </span>
            </>
          )}
        </span>
      </button>
    </li>
  );
}

/* ─── Modal de grupo ─── */
function PainelGrupo({ grupo, onClose }: { grupo: GrupoResolvido; onClose: () => void }) {
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
      role="dialog"
      aria-modal="true"
      aria-label={grupo.nome}
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-5"
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88vh] w-full flex-col rounded-t-3xl border border-white/[0.08] bg-surface sm:max-w-xl sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/8 p-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
              {ICONES[grupo.icone]}
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-lg font-bold leading-snug text-white">{grupo.nome}</h3>
              <p className="mt-1 text-xs text-white/55">{grupo.itens.length} serviços nesta área</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <ul className="flex flex-col">
            {grupo.itens.map((s) => (
              <LinhaServico key={s.id} servico={s} />
            ))}
          </ul>
        </div>

        <div className="border-t border-white/8 p-6">
          <MagneticButton
            href={linkWhatsApp(
              `Oi! Vi no site de vocês a área de ${grupo.nome} e quero entender o que dá pra fazer no meu caso.`,
            )}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "grupo_servico", grupo: grupo.id })}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-pink-400 px-6 py-3.5 text-sm font-bold text-ink"
          >
            Falar sobre isso
            <ArrowRight size={15} />
          </MagneticButton>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

/* ─── Componente principal: grid de cards de serviço ─── */
export function ServiceCards() {
  const [aberto, setAberto] = useState<GrupoResolvido | null>(null);

  return (
    <section id="servicos" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">O que fazemos</p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            {TOTAL} serviços organizados em {GRUPOS.length} frentes.{" "}
            <span className="text-white/50">Clique e veja o que cabe no seu negócio.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {GRUPOS.map((g, i) => {
            const accent = CARD_ACCENT[i % CARD_ACCENT.length];
            return (
              <Reveal key={g.id} delay={i * 0.06} className="h-full">
                <button
                  onClick={() => setAberto(g)}
                  className={`card-glow group flex h-full w-full flex-col rounded-2xl border border-white/[0.08] bg-surface p-6 text-left transition-all hover:bg-surface-2 ${accent.border}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.bg} ${accent.text} transition-transform group-hover:scale-110`}>
                      {ICONES[g.icone]}
                    </span>
                    <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-white/50">
                      {g.itens.length} serviços
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold leading-snug text-white">
                    {g.nome}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{g.promessa}</p>

                  {/* Tags dos primeiros serviços — mostra o repertório */}
                  <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                    {g.itens.slice(0, 5).map((s) => (
                      <li
                        key={s.id}
                        className="rounded-md border border-white/8 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-white/55"
                      >
                        {s.titulo.length > 28 ? `${s.titulo.slice(0, 26)}…` : s.titulo}
                      </li>
                    ))}
                    {g.itens.length > 5 && (
                      <li className="px-1 py-1 text-[11px] font-semibold text-white/35">
                        +{g.itens.length - 5}
                      </li>
                    )}
                  </ul>

                  <span className={`mt-5 flex items-center gap-1.5 text-sm font-bold ${accent.text} transition-transform group-hover:translate-x-1`}>
                    Ver todos os serviços
                    <ArrowRight size={14} />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {aberto && <PainelGrupo grupo={aberto} onClose={() => setAberto(null)} />}
      </AnimatePresence>
    </section>
  );
}
