import { useEffect, useMemo, useState } from "react";
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
import { CATEGORIAS_SERVICOS, RESUMOS_SERVICOS } from "../data/servicos";
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
};

interface ItemCatalogo {
  id: string;
  icone: string;
  titulo: string;
  resumo: string;
  itens: string[];
  categoriaId: string;
  categoriaNome: string;
}

/**
 * Catálogo achatado numa lista só. Antes a página era uma pilha de seções
 * fixas (25 telas de rolagem, sem índice); agora tudo vira uma coleção
 * filtrável, então o visitante chega no que interessa em 1 clique.
 */
const CATALOGO: ItemCatalogo[] = [
  ...MODULOS.map((m) => ({
    id: m.id,
    icone: m.id,
    titulo: m.titulo,
    resumo: RESUMOS_SERVICOS[m.id] ?? m.resumo,
    itens: m.itens,
    categoriaId: "modulos",
    categoriaNome: "Módulos principais",
  })),
  ...CATEGORIAS_SERVICOS.flatMap((c) =>
    c.servicos.map((s) => ({
      id: s.id,
      icone: s.icone,
      titulo: s.titulo,
      resumo: s.resumo,
      itens: s.itens,
      categoriaId: c.id,
      categoriaNome: c.titulo,
    })),
  ),
];

const CATEGORIAS = [
  { id: "modulos", nome: "Módulos principais" },
  ...CATEGORIAS_SERVICOS.map((c) => ({ id: c.id, nome: c.titulo })),
];

function normalizar(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // tira acento: buscar "financas" acha "Finanças"
}

function CartaoServico({ item }: { item: ItemCatalogo }) {
  const [aberto, setAberto] = useState(false);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-surface p-6 transition-colors hover:border-violet-500/40">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          {ICONES[item.icone]}
        </span>
        <span className="rounded-full border border-white/8 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/55">
          {item.categoriaNome}
        </span>
      </div>

      <h3 className="mt-4 font-display text-base font-bold leading-snug text-white">{item.titulo}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{item.resumo}</p>

      {/* Os 126 bullets da página ficavam todos abertos ao mesmo tempo.
          Agora só abrem quando o visitante pede. */}
      <button
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="mt-5 flex items-center gap-1.5 self-start text-sm font-bold text-violet-300 transition-colors hover:text-violet-200"
      >
        {aberto ? "Ocultar detalhes" : "O que inclui"}
        <ChevronDown size={14} className={`transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
          {item.itens.map((i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-white/65">
              <Check size={13} className="mt-0.5 shrink-0 text-violet-300" />
              {i}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

/** Quantos cards aparecem antes do "ver mais" — segura a primeira dobra. */
const LOTE = 12;

export function ServicosPage() {
  const [categoria, setCategoria] = useState("todos");
  const [busca, setBusca] = useState("");
  const [limite, setLimite] = useState(LOTE);

  useEffect(() => {
    document.title = "Serviços — Sigma | Consultoria, Assessoria e Serviços";
    return () => {
      document.title = "Sigma — Consultoria, Assessoria e Serviços | Sistemas, sites e marketing digital";
    };
  }, []);

  const visiveis = useMemo(() => {
    const termo = normalizar(busca.trim());
    return CATALOGO.filter((item) => {
      if (categoria !== "todos" && item.categoriaId !== categoria) return false;
      if (!termo) return true;
      const alvo = normalizar(`${item.titulo} ${item.resumo} ${item.itens.join(" ")} ${item.categoriaNome}`);
      return alvo.includes(termo);
    });
  }, [categoria, busca]);

  // Trocar de filtro recomeça a contagem — senão o "ver mais" de um filtro
  // anterior vaza pro próximo e a lista abre já gigante.
  useEffect(() => {
    setLimite(LOTE);
  }, [categoria, busca]);

  const filtrando = categoria !== "todos" || busca.trim().length > 0;
  const mostrados = visiveis.slice(0, limite);
  const restantes = visiveis.length - mostrados.length;

  return (
    <div className="pb-24 pt-32 sm:pt-40">
      {/* Cabeçalho */}
      <section className="relative overflow-hidden pb-10">
        <div className="grid-fade pointer-events-none absolute inset-0 top-0 h-[420px]" />
        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Todos os serviços</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              Ache o que resolve o seu problema.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60">
              São {CATALOGO.length} frentes de trabalho. Filtre pela área ou busque pelo que está travando seu
              negócio hoje — não precisa ler tudo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Barra de filtro — gruda no topo pra o visitante nunca "se perder" na lista */}
      <div className="sticky top-[68px] z-30 border-y border-white/8 bg-ink/85 py-4 backdrop-blur-lg">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar: estoque, boleto, agendamento, marketplace…"
              aria-label="Buscar serviço"
              className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-11 text-sm text-white placeholder:text-white/35 transition-colors focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
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

          <div className="no-scrollbar mt-3 -mx-5 flex gap-2 overflow-x-auto px-5">
            {[{ id: "todos", nome: "Todos" }, ...CATEGORIAS].map((c) => {
              const ativo = categoria === c.id;
              const total =
                c.id === "todos" ? CATALOGO.length : CATALOGO.filter((i) => i.categoriaId === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoria(c.id)}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition-colors ${
                    ativo
                      ? "border-violet-400/50 bg-violet-500/20 text-violet-200"
                      : "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {c.nome}
                  <span className={`ml-1.5 ${ativo ? "text-violet-300/80" : "text-white/35"}`}>{total}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resultados */}
      <section className="relative py-10">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-white/55">
              {restantes > 0
                ? `${mostrados.length} de ${visiveis.length} serviços`
                : `${visiveis.length} ${visiveis.length === 1 ? "serviço" : "serviços"}`}
            </p>
            {filtrando && (
              <button
                onClick={() => {
                  setCategoria("todos");
                  setBusca("");
                }}
                className="text-sm font-semibold text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
              >
                limpar filtros
              </button>
            )}
          </div>

          {visiveis.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-white/15 px-6 py-14 text-center">
              <p className="font-display text-lg font-bold text-white">Nada encontrado por aqui.</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-white/55">
                Não achou o que precisa? Provavelmente a gente resolve mesmo assim — a maior parte do que
                fazemos é sob medida.
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
            <>
              <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {mostrados.map((item) => (
                  <CartaoServico key={`${item.categoriaId}-${item.id}`} item={item} />
                ))}
              </div>

              {restantes > 0 && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setLimite((l) => l + LOTE)}
                    className="flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
                  >
                    Ver mais {Math.min(restantes, LOTE)}
                    <ChevronDown size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA final */}
      <section className="relative py-14">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Reveal>
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Não sabe por onde começar? A gente ajuda a escolher.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/60">
              No diagnóstico a gente olha o que está travando sua venda hoje e indica os 2 ou 3 serviços que
              resolvem isso primeiro — o resto pode esperar.
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
