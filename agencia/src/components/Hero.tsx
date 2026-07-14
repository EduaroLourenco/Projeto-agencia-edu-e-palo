import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { linkWhatsApp } from "../data/content";
import { PhoneMockup } from "./PhoneMockup";
import { MagneticButton } from "./MagneticButton";
import { Counter } from "./Counter";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-32 sm:pt-40">
      <div className="grid-fade pointer-events-none absolute inset-0 top-0 h-[700px]" />
      <div className="glow-violet animate-drift pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full" />
      <div className="glow-cyan animate-drift-slow pointer-events-none absolute right-0 top-60 h-[400px] w-[400px] rounded-full" />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-violet-300"
          >
            <Sparkles size={14} />
            Sistemas, sites e marketing sob um teto só
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
            className="mt-12 flex items-center gap-8 border-t border-white/10 pt-6 text-white/40"
          >
            <div>
              <p className="font-display text-2xl font-bold text-white">
                <Counter to={4} />
              </p>
              <p className="text-xs">módulos de serviço</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">
                <Counter to={5} />
              </p>
              <p className="text-xs">etapas até o ar</p>
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">
                <Counter to={100} suffix="%" />
              </p>
              <p className="text-xs">sob medida, sem molde</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="animate-float">
            <PhoneMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
