import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

const LINKS = [
  { href: "#modulos", label: "Serviços" },
  { href: "#setores", label: "Setores" },
  { href: "#case", label: "Cases" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#quem-somos", label: "Quem somos" },
];

export function Nav() {
  const [aberto, setAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState("");

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const elementos = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visivel = entries.find((e) => e.isIntersecting);
        if (visivel) setSecaoAtiva(`#${visivel.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex min-w-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-sm font-bold text-ink">
            EP
          </span>
          <span className="truncate font-display text-sm font-bold tracking-tight text-white">
            {AGENCIA.nome}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`relative text-sm font-medium transition-colors ${
                secaoAtiva === l.href ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              {l.label}
              {secaoAtiva === l.href && (
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
              )}
            </a>
          ))}
        </nav>

        <MagneticButton
          href={linkWhatsApp()}
          target="_blank"
          rel="noreferrer"
          onClick={() => rastrear("whatsapp_click", { origem: "nav_desktop" })}
          className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105 md:block"
        >
          Falar no WhatsApp
        </MagneticButton>

        <button
          onClick={() => setAberto(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white md:hidden"
          aria-label="Abrir menu"
        >
          <Menu size={18} />
        </button>
      </div>

      <AnimatePresence>
        {aberto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAberto(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[78%] max-w-xs flex-col border-l border-white/10 bg-surface px-6 py-6 md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white">Menu</span>
                <button
                  onClick={() => setAberto(false)}
                  aria-label="Fechar menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-1">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setAberto(false)}
                    className={`rounded-lg px-3 py-3 text-base font-medium ${
                      secaoAtiva === l.href ? "bg-white/5 text-white" : "text-white/70"
                    }`}
                  >
                    {l.label}
                  </a>
                ))}
              </nav>

              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noreferrer"
                onClick={() => rastrear("whatsapp_click", { origem: "nav_mobile" })}
                className="mt-auto rounded-full bg-white px-5 py-3.5 text-center text-sm font-bold text-ink"
              >
                Falar no WhatsApp
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
