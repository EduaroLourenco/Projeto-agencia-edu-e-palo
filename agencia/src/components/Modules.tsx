import { useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
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
  ArrowRight,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MODULOS, type Modulo } from "../data/content";
import { Reveal } from "./Reveal";
import { Carousel } from "./Carousel";

const ICONES: Record<string, ReactNode> = {
  "comercio-whatsapp": <MessageCircle size={22} />,
  "sites-sistemas": <Code2 size={22} />,
  "marketing-digital": <Megaphone size={22} />,
  "marketplace-ecommerce": <Store size={22} />,
  financas: <Wallet size={22} />,
  "consultoria-automacao": <Workflow size={22} />,
  "vida-noturna": <Music2 size={22} />,
  agendamento: <CalendarDays size={22} />,
  alimentacao: <UtensilsCrossed size={22} />,
  "logistica-44": <Truck size={22} />,
};

// Módulo é oferta → roxo, sempre. Rosa fica reservado pra ação (o CTA do
// WhatsApp): usar rosa aqui, num card decorativo, dilui o sinal de clique.
const CORES: Record<Modulo["cor"], { bg: string; text: string; ring: string }> = {
  violet: { bg: "bg-violet-500/15", text: "text-violet-300", ring: "hover:border-violet-500/40" },
  pink: { bg: "bg-violet-500/15", text: "text-violet-300", ring: "hover:border-violet-500/40" },
  blue: { bg: "bg-violet-500/15", text: "text-violet-300", ring: "hover:border-violet-500/40" },
};

function ModalModulo({ modulo, onClose }: { modulo: Modulo; onClose: () => void }) {
  const cor = CORES[modulo.cor];
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-3xl border border-white/[0.08] bg-surface p-7 sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${cor.bg} ${cor.text}`}>
            {ICONES[modulo.id]}
          </span>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-white">{modulo.titulo}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{modulo.resumo}</p>
        <ul className="mt-5 flex flex-col gap-2.5 border-t border-white/[0.08] pt-5">
          {modulo.itens.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-white/75">
              <Check size={15} className={`mt-0.5 shrink-0 ${cor.text}`} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  );
}

export function Modules() {
  const [aberto, setAberto] = useState<Modulo | null>(null);

  return (
    <section id="modulos" className="relative py-16 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400">O que oferecemos</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Contrate o módulo que resolve o seu problema agora.
          </h2>
          <p className="mt-4 max-w-xl text-white/55">
            Nada de pacote fechado genérico. Cada módulo pode ser contratado sozinho ou combinado com os
            outros, conforme o momento do seu negócio. Arraste pra ver todos.
          </p>
        </Reveal>

        <div className="mt-12">
          <Carousel ariaLabel="Módulos de serviço">
            {MODULOS.map((m) => {
              const cor = CORES[m.cor];
              return (
                <article
                  key={m.id}
                  className={`flex h-full w-[82%] shrink-0 snap-center flex-col rounded-2xl border border-white/[0.08] bg-surface p-6 transition-all hover:shadow-xl sm:w-[46%] lg:w-[31%] ${cor.ring}`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${cor.bg} ${cor.text}`}>
                      {ICONES[m.id]}
                    </span>
                    <span className="font-display text-2xl font-extrabold text-white/10">{m.numero}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">{m.titulo}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{m.resumo}</p>
                  <button
                    onClick={() => setAberto(m)}
                    className={`-mb-2 mt-3 flex min-h-[44px] items-center gap-1.5 self-start text-sm font-bold ${cor.text}`}
                  >
                    Saiba mais
                    <ArrowRight size={14} />
                  </button>
                </article>
              );
            })}
          </Carousel>
        </div>

        {aberto && <ModalModulo modulo={aberto} onClose={() => setAberto(null)} />}

        {/* CTA pra página completa de serviços */}
        <Reveal>
          <div className="mt-14 flex justify-center">
            <Link
              to="/servicos"
              className="flex items-center gap-2 rounded-full border border-white/[0.12] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              Ver todos os serviços
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
