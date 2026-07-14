import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { PhoneMockup } from "./PhoneMockup";

const RESULTADOS = [
  "Vitrine mobile-first carregando instantaneamente, mesmo em 3G/4G",
  "Preço de atacado calculado sozinho conforme a sacola enche",
  "Pedido chega pronto e formatado no WhatsApp do lojista",
  "Entrega por excursão, retirada ou Correios — do jeito que a região já compra",
];

export function CaseStudy() {
  return (
    <section id="case" className="relative py-24 sm:py-32">
      <div className="glow-lime pointer-events-none absolute left-0 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-60" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2">
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
              href="http://localhost:5173/bella-atacado"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              Ver o case funcionando
              <ArrowUpRight size={16} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
