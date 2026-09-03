import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { linkWhatsApp } from "../data/content";
import { PhoneMockup } from "./PhoneMockup";
import { FaixaTime } from "./FaixaTime";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

/**
 * Hero direto ao ponto: título, subtítulo com capacidades e CTAs.
 * Sem seletor de setor — os ServiceCards logo abaixo cumprem esse papel.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacityHero = useTransform(scrollYProgress, [0, 0.85], [1, 0.45]);

  return (
    <motion.section
      ref={ref}
      id="top"
      style={{ opacity: opacityHero }}
      className="relative overflow-hidden pb-10 pt-20 sm:pb-16 sm:pt-36"
    >
      <div className="grid-fade pointer-events-none absolute inset-0 top-0 h-[560px]" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-14">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-[2rem] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]"
          >
            Tecnologia, estratégia e resultado para o seu negócio.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/60 sm:mt-6 sm:text-lg"
          >
            Sistemas sob medida, e-commerce, marketplace, consultoria financeira,
            automação com IA e marketing digital. Tudo num só lugar.
          </motion.p>

          {/* Chips das macro-capacidades */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 flex flex-wrap gap-2"
          >
            {[
              "Sistemas",
              "E-commerce",
              "Finanças",
              "Automação",
              "Marketing",
              "Consultoria",
            ].map((cap) => (
              <span
                key={cap}
                className="rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60"
              >
                {cap}
              </span>
            ))}
          </motion.div>

          {/* Botões só no desktop: no celular a barra inferior já tem o
              WhatsApp fixo, e repetir aqui custaria meia tela. */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 hidden gap-3 lg:flex"
          >
            <MagneticButton
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "hero" })}
              className="group flex items-center justify-center gap-2 rounded-full bg-pink-400 px-7 py-3.5 text-sm font-bold text-ink"
            >
              Falar no WhatsApp
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <a
              href="#servicos"
              className="flex items-center justify-center gap-2 rounded-full border border-white/[0.12] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              Ver o que fazemos
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <FaixaTime />
          </motion.div>
        </div>

        {/* Um único <video> na página: duplicar o mockup pra "versão mobile"
            colocaria dois tocando ao mesmo tempo, dobrando o download. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 flex justify-center lg:mt-0 lg:justify-end"
        >
          <PhoneMockup comVideo />
        </motion.div>
      </div>
    </motion.section>
  );
}
