import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "../lib/slug";
import { TENANT_DEMO } from "../lib/constants";

const FEATURES = [
  {
    titulo: "Vitrine que parece app nativo",
    texto: "Mobile-first, carregamento instantâneo, vídeo de Reels/TikTok integrado direto no produto.",
  },
  {
    titulo: "Calculadora de atacado em tempo real",
    texto: "Barra de progresso mostra quanto falta para o cliente destravar o preço de atacado — sem cadastro, sem app.",
  },
  {
    titulo: "Feito para a rota da 44",
    texto: "Entrega por excursão de ônibus, guarda-volumes da rodoviária ou Correios — do jeito que o interior de Goiás já compra.",
  },
  {
    titulo: "Pedido pronto no WhatsApp",
    texto: "Sem checkout, sem gateway. O cliente confirma e paga no PIX direto com você, como já faz hoje.",
  },
];

export function Home() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");

  function criarLoja(e: React.FormEvent) {
    e.preventDefault();
    const slug = slugify(nome || "minha-loja");
    if (!slug) return;
    navigate(`/${slug}/admin`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
      <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Zap-Commerce</p>
      <h1 className="mt-2 font-display text-3xl font-bold leading-tight">
        O catálogo de atacado que fecha o pedido sozinho no WhatsApp.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">
        Feito para lojistas da Rua 44 e clientes do interior de Goiás: vitrine mobile ultrarrápida,
        preço de atacado calculado na hora, e entrega combinada do jeito que a região já compra —
        excursão, guarda-volumes ou Correios.
      </p>

      <div className="mt-6 flex flex-col gap-2.5">
        <a
          href={`/${TENANT_DEMO}`}
          className="rounded-xl bg-brand-500 py-3.5 text-center text-sm font-bold text-white active:scale-95 transition-transform"
        >
          Ver vitrine de demonstração →
        </a>
        <a
          href={`/${TENANT_DEMO}/admin`}
          className="rounded-xl border border-black/10 bg-white py-3.5 text-center text-sm font-bold active:scale-95 transition-transform"
        >
          Entrar no painel do lojista (senha: 1234)
        </a>
      </div>

      <div className="my-8 flex flex-col gap-4">
        {FEATURES.map((f) => (
          <div key={f.titulo} className="rounded-2xl border border-black/5 bg-white p-4">
            <h3 className="font-display text-sm font-bold">{f.titulo}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink/55">{f.texto}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-ink p-5 text-white">
        <h3 className="font-display text-sm font-bold">Criar sua própria loja de teste</h3>
        <p className="mt-1 text-xs text-white/60">
          Sem custo, sem cadastro de cartão — roda 100% no seu navegador para você testar o fluxo.
        </p>
        <form onSubmit={criarLoja} className="mt-3 flex gap-2">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da sua loja"
            className="flex-1 rounded-lg border border-white/15 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/40"
          />
          <button className="shrink-0 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-bold">
            Criar
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-[11px] text-ink/30">
        Sistema full-stack de verdade — front-end React + API NestJS com banco de dados e login
        real. Pronto para migrar para Postgres/Supabase e Cloudinary sem trocar uma tela.
      </p>
    </div>
  );
}
