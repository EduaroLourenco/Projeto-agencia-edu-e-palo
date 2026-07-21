import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Zap,
  ShoppingBag,
  BarChart3,
  ArrowRight,
  Smartphone,
  Store,
  Package,
} from "lucide-react";
import { slugify } from "../lib/slug";
import { TENANT_DEMO } from "../lib/constants";

const FEATURES = [
  {
    icon: <Smartphone size={20} />,
    cor: "text-brand-500 bg-brand-50",
    titulo: "Vitrine que parece app nativo",
    texto:
      "Mobile-first, carregamento instantâneo, vídeo de Reels/TikTok integrado direto no produto.",
  },
  {
    icon: <BarChart3 size={20} />,
    cor: "text-violet-600 bg-violet-50",
    titulo: "Calculadora de atacado em tempo real",
    texto:
      "Barra de progresso mostra quanto falta para o cliente destravar o preço de atacado — sem cadastro, sem app.",
  },
  {
    icon: <Package size={20} />,
    cor: "text-amber-600 bg-amber-50",
    titulo: "Feito para a rota da 44",
    texto:
      "Entrega por excursão de ônibus, guarda-volumes da rodoviária ou Correios — do jeito que o interior de Goiás já compra.",
  },
  {
    icon: <MessageCircle size={20} />,
    cor: "text-green-600 bg-green-50",
    titulo: "Pedido pronto no WhatsApp",
    texto:
      "Sem checkout, sem gateway. O cliente confirma e paga no PIX direto com você, como já faz hoje.",
  },
];

const STATS = [
  { valor: "0%", label: "taxa de plataforma" },
  { valor: "100%", label: "pedidos via WhatsApp" },
  { valor: "3G", label: "carrega em qualquer rede" },
];

export function Home() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [criando, setCriando] = useState(false);

  function criarLoja(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(nome || "minha-loja");
    if (!slug) return;
    setCriando(true);
    setTimeout(() => navigate(`/${slug}/admin`), 400);
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <div className="relative overflow-hidden bg-ink px-6 pb-20 pt-14">
        {/* Glows decorativos */}
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(242,46,105,0.45) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-md">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-bold text-brand-400">
            <Zap size={11} />
            Zap-Commerce · Powered by Edu &amp; Paloma
          </div>

          <h1 className="font-display text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            O catálogo de atacado que{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #f22e69, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              fecha o pedido sozinho
            </span>{" "}
            no WhatsApp.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Feito para lojistas da Rua 44 e clientes do interior de Goiás: vitrine mobile
            ultrarrápida, preço de atacado calculado na hora, e entrega combinada do jeito que a
            região já compra.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`/${TENANT_DEMO}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white transition-transform active:scale-95"
            >
              <Store size={16} />
              Ver vitrine de demonstração
              <ArrowRight size={15} />
            </a>
            <a
              href={`/${TENANT_DEMO}/admin`}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-3.5 text-sm font-bold text-white/90 transition-colors hover:bg-white/10 active:scale-95"
            >
              <ShoppingBag size={15} />
              Painel do lojista{" "}
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-white/50">
                senha: 1234
              </span>
            </a>
          </div>

          {/* Stats rápidos */}
          <div className="mt-8 grid grid-cols-3 gap-2">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/8 bg-white/5 px-3 py-3 text-center"
              >
                <p className="font-display text-lg font-extrabold text-white">{s.valor}</p>
                <p className="mt-0.5 text-[10px] leading-tight text-white/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 py-10">
        <div className="mx-auto max-w-md">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/40">
            Por que o Zap-Commerce?
          </p>
          <div className="mt-5 flex flex-col gap-3">
            {FEATURES.map((f) => (
              <div
                key={f.titulo}
                className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${f.cor}`}>
                  {f.icon}
                </span>
                <div>
                  <h3 className="font-display text-sm font-bold text-ink">{f.titulo}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-ink/55">{f.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Criar loja de teste */}
      <div className="px-6 pb-16">
        <div className="mx-auto max-w-md">
          <div className="overflow-hidden rounded-2xl bg-ink">
            <div className="bg-gradient-to-r from-brand-600 to-violet-600 px-5 py-4">
              <h2 className="font-display text-base font-bold text-white">
                Criar sua própria loja de teste
              </h2>
              <p className="mt-1 text-xs text-white/70">
                Sem custo, sem cadastro de cartão — roda 100% no navegador.
              </p>
            </div>
            <div className="px-5 py-5">
              <form onSubmit={criarLoja} className="flex gap-2">
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome da sua loja"
                  className="flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-brand-500/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={criando}
                  className="shrink-0 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-60"
                >
                  {criando ? "..." : "Criar"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé com link para agência */}
      <div className="border-t border-black/5 px-6 py-8 text-center">
        <p className="text-[11px] text-ink/30">
          Sistema desenvolvido por{" "}
          <a
            href="http://localhost:5174"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-ink/50 underline decoration-ink/20 underline-offset-2 hover:text-ink"
          >
            Edu &amp; Paloma Digital
          </a>{" "}
          · Goiânia, GO
        </p>
      </div>
    </div>
  );
}
