import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AGENCIA, SITRA_URL, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";

const LINKS = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/servicos", label: "Catálogo" },
  { href: "/#cases", label: "Cases" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#quem-somos", label: "Quem somos" },
  { href: "/#faq", label: "FAQ" },
];

// No desktop, "Como funciona" fica de fora para caber em 1024px.
const LINKS_DESKTOP = LINKS.filter((l) => l.href !== "/#como-funciona");

function isActiveLink(href: string, pathname: string, secaoAtiva: string) {
  if (!href.includes("#")) return pathname === href;
  return pathname === "/" && href.split("#")[1] === secaoAtiva;
}

export function Logo() {
  return (
    <Link to="/" className="flex min-h-[44px] shrink-0 items-center gap-2.5" aria-label="BEPA, página inicial">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand font-display text-sm font-bold text-white">
        {AGENCIA.iniciais}
      </span>
      <span className="font-display text-lg font-bold tracking-[-0.02em] text-ink">{AGENCIA.nome}</span>
    </Link>
  );
}

export function Nav() {
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const fecharMenu = () => {
    setAberto(false);
    botaoMenu.current?.focus();
  };
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
      let ativa = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= linhaDeLeitura) ativa = id;
      }
      setSecaoAtiva(ativa);
    }

    function agendar() {
      if (!frame) frame = requestAnimationFrame(calcular);
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
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") fecharMenu();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [aberto]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
          <Logo />

          <nav aria-label="Principal" className="hidden items-center gap-6 lg:flex">
            {LINKS_DESKTOP.map((l) => {
              const ativo = isActiveLink(l.href, pathname, secaoAtiva);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={ativo ? "page" : undefined}
                  className={`whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                    ativo ? "text-brand" : "text-ink/75 hover:text-ink"
                  }`}
                >
                  {l.label}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={SITRA_URL}
              target="_blank"
              rel="noopener"
              onClick={() => rastrear("sitra_click", { origem: "nav_desktop" })}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-md border border-ink/20 px-4 text-sm font-semibold text-ink transition-colors hover:border-ink/50"
            >
              Sites com a Sitra
              <ArrowUpRight size={15} aria-hidden />
            </a>
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "nav_desktop" })}
              className="inline-flex min-h-[40px] items-center rounded-md bg-brand px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-strong"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Barra de ação inferior no celular: o contato fica sempre a um toque. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            ref={botaoMenu}
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            aria-expanded={aberto}
            className="flex h-12 shrink-0 items-center gap-2 rounded-md border border-ink/20 px-4 text-sm font-semibold text-ink"
          >
            <Menu size={18} aria-hidden />
            Menu
          </button>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "barra_inferior_mobile" })}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-white"
          >
            Falar no WhatsApp
            <ArrowUpRight size={16} aria-hidden />
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
              onClick={() => fecharMenu()}
              className="fixed inset-0 z-[60] bg-ink/40 lg:hidden"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[85vh] flex-col rounded-t-xl border-t border-line bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-base font-bold text-ink">Menu</span>
                <button
                  onClick={() => fecharMenu()}
                  aria-label="Fechar menu"
                  autoFocus
                  className="flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-paper-2"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>

              <nav aria-label="Principal" className="mt-2 flex min-h-0 flex-1 flex-col overflow-y-auto">
                {LINKS.map((l) => {
                  const ativo = isActiveLink(l.href, pathname, secaoAtiva);
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setAberto(false)}
                      aria-current={ativo ? "page" : undefined}
                      className={`border-b border-line py-3.5 text-lg font-medium ${
                        ativo ? "text-brand" : "text-ink"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </nav>

              <a
                href={SITRA_URL}
                target="_blank"
                rel="noopener"
                onClick={() => rastrear("sitra_click", { origem: "nav_mobile" })}
                className="mt-4 flex items-center justify-between rounded-md border border-ink/20 px-4 py-3.5"
              >
                <span>
                  <span className="block text-sm font-semibold text-ink">Precisa de um site?</span>
                  <span className="block text-sm text-muted">Conheça a Sitra, nossa frente de sites</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 text-ink" aria-hidden />
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
