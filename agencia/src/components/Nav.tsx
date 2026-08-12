import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

const LINKS = [
  { href: "/servicos", label: "Serviços" },
  { href: "/#case", label: "Case" },
  { href: "/#outros-projetos", label: "Projetos" },
  { href: "/#depoimentos", label: "Depoimentos" },
  { href: "/#conversas", label: "Na prática" },
  { href: "/#modulos", label: "Módulos" },
  { href: "/#setores", label: "Setores" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#quem-somos", label: "Quem somos" },
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

    // Posição, não IntersectionObserver: o observer só entrega as seções que
    // MUDARAM de estado, então pegar "a primeira que intersecta" dessa lista
    // parcial deixava o menu marcando uma seção que já saiu da tela. Aqui a
    // seção ativa é sempre a última cujo topo passou da linha de leitura.
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-sm font-bold text-ink">
            {AGENCIA.iniciais}
          </span>
          <span className="whitespace-nowrap font-display text-sm font-bold tracking-tight text-white">
            {AGENCIA.nome}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex">
          {LINKS.map((l) => {
            const ativo = isActiveLink(l.href, pathname, secaoAtiva);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative text-sm font-medium transition-colors ${
                  ativo ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
                {ativo && (
                  <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
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
          className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105 xl:block"
        >
          Falar no WhatsApp
        </MagneticButton>

        <button
          onClick={() => setAberto(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white xl:hidden"
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
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-y-0 right-0 z-50 flex w-[78%] max-w-xs flex-col border-l border-white/10 bg-surface px-6 py-6 xl:hidden"
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
                {LINKS.map((l) => {
                  const ativo = isActiveLink(l.href, pathname, secaoAtiva);
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setAberto(false)}
                      className={`rounded-lg px-3 py-3 text-base font-medium ${
                        ativo ? "bg-white/5 text-white" : "text-white/70"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
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
