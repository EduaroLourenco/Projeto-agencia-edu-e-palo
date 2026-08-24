import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

// Links simplificados — menos é mais. Sem dropdown "Mais".
const LINKS = [
  { href: "/#quem-somos", label: "Quem somos" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/servicos", label: "Todos os serviços" },
  { href: "/#case", label: "Cases" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#faq", label: "FAQ" },
];

// No desktop, os mais importantes.
const LINKS_DESKTOP = [
  { href: "/#quem-somos", label: "Quem somos" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/servicos", label: "Catálogo completo" },
  { href: "/#case", label: "Cases" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#faq", label: "FAQ" },
];

function isActiveLink(href: string, pathname: string, secaoAtiva: string) {
  if (!href.includes("#")) return pathname === href;
  return pathname === "/" && href.split("#")[1] === secaoAtiva;
}

export function Nav() {
  const [aberto, setAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState("");
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") {
      setSecaoAtiva("");
      return;
    }

    const ids = LINKS.filter((l) => l.href.includes("#")).map((l) => l.href.split("#")[1]);
    let frame = 0;

    function calcular() {
      frame = 0;
      const linhaDeLeitura = window.innerHeight * 0.35;

      const fim = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (fim) {
        setSecaoAtiva(ids[ids.length - 1]);
        return;
      }

      const secoes = ids
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, topo: el.getBoundingClientRect().top } : null;
        })
        .filter((s): s is { id: string; topo: number } => s !== null)
        .sort((a, b) => a.topo - b.topo);

      let ativa = "";
      for (const secao of secoes) {
        if (secao.topo <= linhaDeLeitura) ativa = secao.id;
      }
      setSecaoAtiva(ativa);
    }

    function agendar() {
      if (frame) return;
      frame = requestAnimationFrame(calcular);
    }

    calcular();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const rotuloDaSecaoAtiva =
    pathname === "/" ? LINKS.find((l) => l.href === `/#${secaoAtiva}`)?.label : null;

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex min-h-[44px] shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-pink-500 to-blue-400 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/25">
            {AGENCIA.iniciais}
          </span>
          <span className="whitespace-nowrap font-display text-base font-bold tracking-tight text-white">
            {AGENCIA.nome}
          </span>
        </Link>

        {/* "Você está aqui", só no celular. */}
        {rotuloDaSecaoAtiva && (
          <span
            aria-live="polite"
            className="ml-3 min-w-0 flex-1 truncate text-right text-xs font-semibold text-white/45 lg:hidden"
          >
            {rotuloDaSecaoAtiva}
          </span>
        )}

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS_DESKTOP.map((l) => {
            const ativo = isActiveLink(l.href, pathname, secaoAtiva);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative whitespace-nowrap text-sm font-medium transition-colors ${
                  ativo ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
                {ativo && (
                  <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-violet-400 via-pink-400 to-blue-400" />
                )}
              </a>
            );
          })}
        </nav>

        <MagneticButton
          href={linkWhatsApp()}
          target="_blank"
          rel="noreferrer"
          onClick={() => rastrear("whatsapp_click", { origem: "nav_desktop" })}
          className="hidden rounded-full bg-pink-400 px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105 lg:block"
        >
          Falar no WhatsApp
        </MagneticButton>

      </div>
    </header>

      {/* Barra de ação inferior mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-ink/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border border-white/[0.08] bg-white/5 text-white"
          >
            <Menu size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Menu</span>
          </button>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "barra_inferior_mobile" })}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-pink-400 text-sm font-bold text-ink"
          >
            Falar no WhatsApp
            <ArrowUpRight size={16} />
          </a>
        </div>
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
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[82vh] flex-col rounded-t-3xl border-t border-white/[0.08] bg-surface px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 lg:hidden"
            >
              <span className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-white/15" />
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

              <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pb-2">
                {LINKS.map((l) => {
                  const ativo = isActiveLink(l.href, pathname, secaoAtiva);
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setAberto(false)}
                      className={`rounded-xl px-3 py-3.5 text-base font-medium ${
                        ativo ? "bg-violet-500/15 text-white" : "text-white/70"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
