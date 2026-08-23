import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  ChevronDown,
  Search,
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
import type { GrupoServicos } from "../data/servicos";
import { Reveal } from "../components/Reveal";
import { MagneticButton } from "../components/MagneticButton";
import { rastrear } from "../lib/analytics";

const ICONES: Record<string, ReactNode> = {
  // módulos
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
  // serviços especializados
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

/** Grupos já resolvidos: os ids viram os serviços de verdade. */
const GRUPOS = GRUPOS_SERVICOS.map((g) => ({
  ...g,
  itens: g.servicos.map((id) => POR_ID[id]).filter(Boolean),
}));

type GrupoResolvido = (typeof GRUPOS)[number];

const TOTAL = GRUPOS.reduce((soma, g) => soma + g.itens.length, 0);

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // tira acento: buscar "financas" acha "Finanças"
}

/** Linha de serviço com os detalhes recolhidos. */
function LinhaServico({ servico, grupo }: { servico: Servico; grupo?: GrupoServicos }) {
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
          {grupo && (
            <span className="mt-1 block text-[11px] font-semibold text-violet-300/80">{grupo.nome}</span>
          )}
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
            className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-ink"
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

export function ServicosPage() {
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState<GrupoResolvido | null>(null);

  useEffect(() => {
    document.title = "Serviços — BEPA | Consultoria, Assessoria e Serviços";
    return () => {
      document.title = "BEPA — Consultoria, Assessoria e Serviços | Sistemas, sites e marketing digital";
    };
  }, []);

  // A busca fura os grupos: quem já sabe o que quer não deve ter que
  // adivinhar em qual área aquilo mora.
  const resultados = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return null;
    return GRUPOS.flatMap((g) =>
      g.itens
        .filter((s) =>
          normalizar(`${s.titulo} ${s.resumo} ${s.itens.join(" ")} ${g.nome}`).includes(termo),
        )
        .map((s) => ({ servico: s, grupo: g })),
    );
  }, [busca]);

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      {/* Cabeçalho */}
      <section className="relative overflow-hidden pb-8">
        <div className="grid-fade pointer-events-none absolute inset-0 top-0 h-[420px]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400">O que fazemos</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Seis frentes. {TOTAL} serviços por trás delas.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
              Comece pela área que resolve o seu problema. A lista completa está lá dentro, pra quando
              você quiser entrar no detalhe.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Busca */}
      <div className="mx-auto max-w-2xl px-5">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Ou busque direto: estoque, boleto, agendamento…"
            aria-label="Buscar serviço"
            className="w-full rounded-full border border-white/[0.08] bg-white/5 py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/35 transition-colors focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
              className="absolute right-3.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/70 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-5">
          {resultados ? (
            /* ---- modo busca: lista achatada ---- */
            resultados.length === 0 ? (
              <div className="mx-auto max-w-md rounded-2xl border border-dashed border-white/[0.12] px-6 py-14 text-center">
                <p className="font-display text-lg font-bold text-white">Nada encontrado por aqui.</p>
                <p className="mt-2 text-sm text-white/55">
                  Provavelmente a gente resolve mesmo assim: a maior parte do que fazemos é sob medida.
                </p>
                <MagneticButton
                  href={linkWhatsApp(
                    `Oi! Procurei por "${busca}" no site de vocês e não achei. Vocês conseguem resolver isso?`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => rastrear("whatsapp_click", { origem: "servicos_sem_resultado", busca })}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink"
                >
                  Perguntar no WhatsApp
                  <ArrowRight size={15} />
                </MagneticButton>
              </div>
            ) : (
              <div className="mx-auto max-w-2xl">
                <p className="text-sm text-white/55">
                  {resultados.length} {resultados.length === 1 ? "serviço encontrado" : "serviços encontrados"}
                </p>
                <ul className="mt-4 flex flex-col rounded-2xl border border-white/[0.08] bg-surface px-6">
                  {resultados.map(({ servico, grupo }) => (
                    <LinhaServico key={servico.id} servico={servico} grupo={grupo} />
                  ))}
                </ul>
              </div>
            )
          ) : (
            /* ---- modo padrão: as 6 áreas ---- */
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {GRUPOS.map((g, i) => (
                <Reveal key={g.id} delay={i * 0.05} className="h-full">
                  <button
                    onClick={() => setAberto(g)}
                    className="flex h-full w-full flex-col rounded-2xl border border-white/[0.08] bg-surface p-6 text-left transition-colors hover:border-violet-500/45"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                        {ICONES[g.icone]}
                      </span>
                      <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-white/55">
                        {g.itens.length} serviços
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-lg font-bold leading-snug text-white">{g.nome}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">{g.promessa}</p>

                    {/* Os nomes ficam à vista: é o que mostra o repertório
                        sem obrigar ninguém a ler 44 descrições. */}
                    <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
                      {g.itens.slice(0, 5).map((s) => (
                        <li
                          key={s.id}
                          className="rounded-md border border-white/8 bg-white/[0.04] px-2 py-1 text-[11px] font-medium text-white/60"
                        >
                          {s.titulo.length > 34 ? `${s.titulo.slice(0, 32)}…` : s.titulo}
                        </li>
                      ))}
                      {g.itens.length > 5 && (
                        <li className="px-1 py-1 text-[11px] font-semibold text-white/40">
                          +{g.itens.length - 5}
                        </li>
                      )}
                    </ul>

                    <span className="mt-5 flex items-center gap-1.5 text-sm font-bold text-violet-300">
                      Ver os {g.itens.length} serviços
                      <ArrowRight size={14} />
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {aberto && <PainelGrupo grupo={aberto} onClose={() => setAberto(null)} />}
      </AnimatePresence>

      {/* CTA final */}
      <section className="relative py-12">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Não sabe por onde começar? A gente ajuda a escolher.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/60">
              No diagnóstico a gente olha o que está travando sua venda hoje e indica os 2 ou 3 serviços que
              resolvem isso primeiro. O resto pode esperar.
            </p>
            <MagneticButton
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "servicos_footer" })}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink"
            >
              Pedir meu diagnóstico
              <ArrowRight size={16} />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
