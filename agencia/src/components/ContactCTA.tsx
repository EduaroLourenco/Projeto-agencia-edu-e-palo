import { ArrowRight } from "lucide-react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { Reveal } from "./Reveal";

export function ContactCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="glow-violet pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70" />

      <Reveal className="relative mx-auto max-w-3xl px-5 text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
          Bora tirar sua ideia <span className="text-gradient">do papel</span>?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-white/60">
          Manda uma mensagem contando o que você vende e onde está travando. A gente responde com
          um diagnóstico rápido e sem compromisso.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-ink transition-transform hover:scale-[1.03]"
          >
            Falar no WhatsApp agora
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href={`mailto:${AGENCIA.email}`}
            className="text-sm font-semibold text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
          >
            ou envie um email
          </a>
        </div>
      </Reveal>
    </section>
  );
}
