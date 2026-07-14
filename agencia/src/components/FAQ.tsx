import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { FAQ as PERGUNTAS } from "../data/content";
import { Reveal } from "./Reveal";

export function FAQ() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section className="relative border-y border-white/5 bg-surface/40 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-lime-400">Perguntas frequentes</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Antes de mandar mensagem, talvez isso já responda.
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col divide-y divide-white/10 border-y border-white/10">
          {PERGUNTAS.map((item, i) => {
            const estaAberta = aberta === i;
            return (
              <div key={item.pergunta}>
                <button
                  onClick={() => setAberta(estaAberta ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-display text-base font-semibold text-white sm:text-lg">
                    {item.pergunta}
                  </span>
                  <motion.span
                    animate={{ rotate: estaAberta ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white"
                  >
                    <Plus size={16} />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {estaAberta && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-sm leading-relaxed text-white/60">{item.resposta}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
