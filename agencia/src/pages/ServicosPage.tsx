import { useEffect } from "react";
import {
  Check,
  ArrowRight,
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
import { CATEGORIAS_SERVICOS, RESUMOS_SERVICOS } from "../data/servicos";
import { Reveal } from "../components/Reveal";
import { TiltCard } from "../components/TiltCard";
import { MagneticButton } from "../components/MagneticButton";
import { rastrear } from "../lib/analytics";

const ICONES_MODULO: Record<string, ReactNode> = {
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
};

const ICONES_EXTRA: Record<string, ReactNode> = {
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
};

const CORES: Record<"violet" | "lime" | "cyan", { bg: string; text: string; ring: string }> = {
  violet: { bg: "bg-violet-500/15", text: "text-violet-300", ring: "hover:border-violet-500/40" },
  lime: { bg: "bg-lime-500/15", text: "text-lime-300", ring: "hover:border-lime-500/40" },
  cyan: { bg: "bg-cyan-400/15", text: "text-cyan-300", ring: "hover:border-cyan-400/40" },
};

const CORE_MODULES = [
  "comercio-whatsapp",
  "sites-sistemas",
  "marketing-digital",
  "marketplace-ecommerce",
  "financas",
  "consultoria-automacao",
];

export function ServicosPage() {
  useEffect(() => {
    document.title = "Serviços — Sigma | Consultoria, Assessoria e Serviços";
    return () => {
      document.title = "Sigma — Consultoria, Assessoria e Serviços | Sistemas, sites e marketing digital";
    };
  }, []);

  const coreModules = MODULOS.filter((m) => CORE_MODULES.includes(m.id));
  const nicheModules = MODULOS.filter((m) => !CORE_MODULES.includes(m.id));
  const totalServicos =
    MODULOS.length + CATEGORIAS_SERVICOS.reduce((acc, c) => acc + c.servicos.length, 0);

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      {/* Header */}
      <section className="relative overflow-hidden pb-16">
        <div className="grid-fade pointer-events-none absolute inset-0 top-0 h-[500px]" />
        <div className="relative mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
              Todos os serviços
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Cada parte do seu negócio digital, num só lugar.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              Dos módulos principais aos serviços especializados de dados, marca, automação e
              sistemas — {totalServicos} frentes de trabalho pra resolver o que hoje trava seu
              negócio online. Contrate o que resolve o problema de agora, sem pacote fechado.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <MagneticButton
                href={linkWhatsApp()}
                target="_blank"
                rel="noreferrer"
                onClick={() => rastrear("whatsapp_click", { origem: "servicos_header" })}
                className="flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink"
              >
                Falar no WhatsApp
                <ArrowRight size={16} />
              </MagneticButton>
              <a
                href="#modulos-principais"
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
              >
                Ver os módulos
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Módulos principais */}
      <section id="modulos-principais" className="relative py-14">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Módulos principais
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              A base de qualquer negócio que quer vender melhor online.
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {coreModules.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.05} className="h-full">
                <TiltCard className="h-full">
                  <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-surface p-6 transition-all hover:border-white/20">
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                        {ICONES_MODULO[m.id]}
                      </span>
                      <span className="font-display text-2xl font-extrabold text-white/10">
                        {m.numero}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-white">{m.titulo}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      {RESUMOS_SERVICOS[m.id] ?? m.resumo}
                    </p>
                    <ul className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                      {m.itens.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-white/65">
                          <Check size={13} className="mt-0.5 shrink-0 text-lime-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Módulos de nicho */}
      <section className="relative py-14">
        <div className="mx-auto max-w-6xl px-5">
          <Reveal>
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <p className="text-xs font-bold uppercase tracking-widest text-lime-400">
                Módulos de nicho · Goiânia
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {nicheModules.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.05} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-white/8 bg-surface/60 p-5 transition-all hover:border-white/20 hover:bg-surface">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-300">
                    {ICONES_MODULO[m.id]}
                  </span>
                  <h3 className="mt-3 font-display text-sm font-bold text-white">{m.titulo}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-white/50">
                    {RESUMOS_SERVICOS[m.id] ?? m.resumo}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categorias de serviços especializados */}
      {CATEGORIAS_SERVICOS.map((categoria, ci) => {
        const cor = CORES[categoria.cor];
        return (
          <section key={categoria.id} id={categoria.id} className="relative py-14">
            <div className="mx-auto max-w-6xl px-5">
              <Reveal>
                <p className={`text-xs font-bold uppercase tracking-widest ${cor.text}`}>
                  {String(ci + 1).padStart(2, "0")} · {categoria.titulo}
                </p>
                <h2 className="mt-3 max-w-2xl font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {categoria.descricao}
                </h2>
              </Reveal>

              <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {categoria.servicos.map((s, i) => (
                  <Reveal key={s.id} delay={i * 0.05} className="h-full">
                    <TiltCard className="h-full">
                      <article
                        className={`flex h-full flex-col rounded-3xl border border-white/10 bg-surface p-6 transition-all hover:shadow-xl ${cor.ring}`}
                      >
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${cor.bg} ${cor.text}`}
                        >
                          {ICONES_EXTRA[s.icone]}
                        </span>
                        <h3 className="mt-4 font-display text-base font-bold text-white">
                          {s.titulo}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/55">{s.resumo}</p>
                        <ul className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                          {s.itens.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs text-white/65">
                              <Check size={13} className={`mt-0.5 shrink-0 ${cor.text}`} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </article>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA final */}
      <section className="relative py-14">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Não sabe por onde começar? A gente ajuda a escolher.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/55">
              Com {totalServicos} frentes de trabalho, o primeiro passo é o diagnóstico: contamos o
              que está travando sua venda hoje e indicamos os 2 ou 3 serviços que resolvem isso
              primeiro.
            </p>
            <MagneticButton
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "servicos_footer" })}
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink"
            >
              Falar no WhatsApp
              <ArrowRight size={16} />
            </MagneticButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
