import { ArrowUpRight, Check, Clock, Music2, CalendarDays, UtensilsCrossed, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { PhoneMockup } from "./PhoneMockup";
import { ZAP_COMMERCE_URL } from "../data/content";
import { rastrear } from "../lib/analytics";

const RESULTADOS = [
  "Vitrine mobile-first carregando instantaneamente, mesmo em 3G/4G",
  "Preço de atacado calculado sozinho conforme a sacola enche",
  "Pedido chega pronto e formatado no WhatsApp do lojista",
  "Entrega por excursão, retirada ou Correios — do jeito que a região já compra",
];

interface CaseFuturo {
  icon: ReactNode;
  titulo: string;
  nicho: string;
  preview: string;
  cor: string;
  textCor: string;
}

const CASES_FUTUROS: CaseFuturo[] = [
  {
    icon: <Music2 size={18} />,
    titulo: "VIP List — Vida Noturna",
    nicho: "Baladas & Eventos",
    preview: "Lista VIP com QR Code, mapa de lounges e check-in pelo celular do segurança.",
    cor: "bg-violet-500/10 border-violet-500/20",
    textCor: "text-violet-300",
  },
  {
    icon: <CalendarDays size={18} />,
    titulo: "Agenda Online",
    nicho: "Salões & Clínicas",
    preview: "O cliente agenda sozinho enquanto você atende. Zero mensagem de 'que horas tem?'",
    cor: "bg-lime-500/10 border-lime-500/20",
    textCor: "text-lime-300",
  },
  {
    icon: <UtensilsCrossed size={18} />,
    titulo: "Cardápio Sem Taxa",
    nicho: "Alimentação & Bebidas",
    preview: "Cardápio digital com frete por CEP — sem pagar % pro iFood.",
    cor: "bg-cyan-400/10 border-cyan-400/20",
    textCor: "text-cyan-300",
  },
  {
    icon: <Truck size={18} />,
    titulo: "Logística da 44",
    nicho: "Frete & Excursões",
    preview: "Rastreamento de fardos, bilhete eletrônico e notificação automática pro comprador.",
    cor: "bg-yellow-400/10 border-yellow-400/20",
    textCor: "text-yellow-300",
  },
];

export function CaseStudy() {
  return (
    <section id="case" className="relative overflow-hidden py-24 sm:py-32">
      <div className="glow-lime pointer-events-none absolute left-0 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-60" />

      <div className="relative mx-auto max-w-6xl px-5">
        {/* Case principal — Zap-Commerce */}
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <PhoneMockup />
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-widest text-violet-400">Case · Módulo 01</p>
              <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Zap-Commerce: de mensagem perdida no grupo a sistema no ar.
              </h2>
              <p className="mt-5 text-white/60">
                Uma loja de atacado de moda vivia perdendo pedido porque cliente mandava foto solta
                no grupo de WhatsApp e ninguém calculava o desconto de atacado na hora certa.
                Construímos um catálogo digital completo: vitrine, calculadora de preço em tempo
                real e checkout que termina com a mensagem pronta no WhatsApp do lojista.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-7 flex flex-col gap-3">
                {RESULTADOS.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-white/75">
                    <Check size={16} className="mt-0.5 shrink-0 text-lime-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.18}>
              <a
                href={ZAP_COMMERCE_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => rastrear("case_zapcommerce_click")}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
              >
                Ver o case funcionando
                <ArrowUpRight size={16} />
              </a>
            </Reveal>
          </div>
        </div>

        {/* Divisor */}
        <Reveal>
          <div className="mt-24 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Próximos módulos em construção
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>
          <p className="mt-4 text-center text-sm text-white/40">
            Cada nicho tem seu próprio sistema — feito pra resolver o problema real de cada operação.
          </p>
        </Reveal>

        {/* Cards de cases futuros */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CASES_FUTUROS.map((c, i) => (
            <Reveal key={c.titulo} delay={i * 0.08}>
              <div className={`group relative overflow-hidden rounded-2xl border bg-surface/50 p-5 transition-all hover:bg-surface ${c.cor}`}>
                {/* Badge Em breve */}
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-white/40">
                  <Clock size={9} />
                  Em breve
                </div>

                <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ${c.textCor}`}>
                  {c.icon}
                </span>
                <p className={`mt-3 font-display text-sm font-bold text-white`}>{c.titulo}</p>
                <p className={`mt-0.5 text-[11px] font-semibold ${c.textCor}`}>{c.nicho}</p>
                <p className="mt-3 text-xs leading-relaxed text-white/45">{c.preview}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
