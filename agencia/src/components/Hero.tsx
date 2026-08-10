import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { linkWhatsApp } from "../data/content";
import { PhoneMockup } from "./PhoneMockup";
import { MagneticButton } from "./MagneticButton";
import { Counter } from "./Counter";
import { rastrear } from "../lib/analytics";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBlobs = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yMockup = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <motion.section
      ref={ref}
      id="top"
      style={{ opacity: opacityHero }}
      className="relative overflow-hidden pb-20 pt-32 sm:pt-40"
    >
      <div className="grid-fade pointer-events-none absolute inset-0 top-0 h-[700px]" />
      <motion.div
        style={{ y: yBlobs }}
        className="glow-violet animate-drift pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
      />
      <motion.div
        style={{ y: yBlobs }}
        className="glow-cyan animate-drift-slow pointer-events-none absolute right-0 top-60 h-[400px] w-[400px] rounded-full"
      />
      {/* Glow amarelo Goiânia */}
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(250,204,21,0.5) 0%, transparent 70%)" }} />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-300"
          >
            <Sparkles size={14} />
            Sistemas, sites e marketing sob um teto só
          </motion.div>

          {/* Badge Goiânia */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3.5 py-1 text-xs font-semibold text-yellow-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
            Especialistas em Goiânia
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.4rem]"
          >
            Sua empresa <span className="text-gradient">vendendo online</span> em semanas, não em meses.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg"
          >
            Construímos catálogos com pedido pelo WhatsApp, sites e sistemas sob medida, marketing
            digital e automação — pra negócios que vendem bem no boca a boca e querem parar de
            perder pedido em mensagem solta no grupo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <MagneticButton
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "hero" })}
              className="group flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink"
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-12 flex items-center gap-4 border-t border-white/10 pt-6 text-white/40 sm:gap-8"
          >
            <div>
              <p className="font-display text-xl font-bold text-white sm:text-2xl">
                <Counter to={8} />
              </p>
              <p className="text-[11px] sm:text-xs">módulos de serviço</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white sm:text-2xl">
                <Counter to={5} />
              </p>
              <p className="text-[11px] sm:text-xs">etapas até o ar</p>
            </div>
            <div>
              <p className="font-display text-xl font-bold text-white sm:text-2xl">
                <Counter to={100} suffix="%" />
              </p>
              <p className="text-[11px] sm:text-xs">sob medida, sem molde</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ y: yMockup }}
          className="flex justify-center lg:justify-end"
        >
          <div className="animate-float">
            <PhoneMockup />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
