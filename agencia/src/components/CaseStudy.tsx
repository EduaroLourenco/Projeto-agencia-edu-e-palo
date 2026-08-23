import { ArrowUpRight, Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { PhoneMockup } from "./PhoneMockup";
import { MagneticButton } from "./MagneticButton";
import { ZAP_COMMERCE_URL } from "../data/content";
import { rastrear } from "../lib/analytics";

const RESULTADOS = [
  "Vitrine mobile-first carregando instantaneamente, mesmo em 3G/4G",
  "Preço de atacado calculado sozinho conforme a sacola enche",
  "Pedido chega pronto e formatado no WhatsApp do lojista",
  "Entrega por excursão, retirada ou Correios, do jeito que a região já compra",
];

export function CaseStudy() {
  return (
    <section id="case" className="relative overflow-hidden py-16 sm:py-28">

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <Reveal className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <PhoneMockup />
          </Reveal>

          <div className="order-1 lg:order-2">
            <Reveal>
              {/* Case é prova → azul. O rosa fica só no botão, pra ele ser
                  a única coisa "clicável" que o olho encontra na seção. */}
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">Case ao vivo</p>
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
                    <Check size={16} className="mt-0.5 shrink-0 text-blue-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.18}>
              <MagneticButton
                href={ZAP_COMMERCE_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => rastrear("case_zapcommerce_click")}
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-pink-400 px-7 py-3.5 text-sm font-bold text-ink shadow-lg shadow-pink-400/25 transition-transform hover:scale-105"
              >
                Clique aqui e confira o case ao vivo
                <ArrowUpRight size={18} />
              </MagneticButton>
              <p className="mt-3 text-xs text-white/35">Sistema 100% funcional, livre pra você navegar.</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
