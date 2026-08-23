import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { linkWhatsApp } from "../data/content";
import { PhoneMockup } from "./PhoneMockup";
import { MagneticButton } from "./MagneticButton";
import { SeletorSetor } from "./SeletorSetor";
import { rastrear } from "../lib/analytics";

/**
 * Primeira tela pensada pra resolver tudo sem rolagem no celular:
 * o que é (título), a prova de que funciona (vídeo real do sistema) e
 * o primeiro gesto possível (escolher o próprio setor).
 *
 * O que saiu daqui e por quê:
 * - parágrafo de 6 linhas → 2: ninguém lê um bloco denso na primeira tela;
 * - "8 módulos / 5 etapas / 100%": números que não provam nada e comiam
 *   a altura que o vídeo precisava — foram pro desktop só;
 * - CTA duplicado no celular: a barra inferior já carrega o WhatsApp fixo.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBlobs = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  return (
    <motion.section
      ref={ref}
      id="top"
      style={{ opacity: opacityHero }}
      className="relative overflow-hidden pb-12 pt-24 sm:pb-20 sm:pt-40"
    >
      <div className="grid-fade pointer-events-none absolute inset-0 top-0 h-[700px]" />
      <motion.div
        style={{ y: yBlobs }}
        className="glow-violet animate-drift pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
      />
      <motion.div
        style={{ y: yBlobs }}
        className="glow-pink animate-drift-slow pointer-events-none absolute -right-20 top-72 h-[380px] w-[380px] rounded-full"
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-5 lg:grid-cols-2 lg:gap-14">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-[2rem] font-extrabold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Sua empresa <span className="text-gradient">vendendo online</span> em semanas, não em
            meses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/60 sm:mt-6 sm:text-lg"
          >
            Catálogo digital, sistema sob medida, e-commerce, finanças e automação com IA — do
            código ao caixa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-7"
          >
            <SeletorSetor />
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
              href="#modulos"
              className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              Ver os módulos
            </a>
          </motion.div>
        </div>

        {/* Um único <video> na página: duplicar o mockup pra "versão mobile"
            colocaria dois tocando ao mesmo tempo, dobrando o download. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-8 flex justify-center lg:mt-0 lg:justify-end"
        >
          <div className="animate-float">
            <PhoneMockup comVideo />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
