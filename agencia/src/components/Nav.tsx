import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AGENCIA, SITRA_URL, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";

const LINKS = [
  { to: "/#servicos", label: "Serviços" },
  { to: "/#setores", label: "Setores" },
  { to: "/#case", label: "Case" },
  { to: "/#produtos", label: "Produtos" },
  { to: "/#equipe", label: "Equipe" },
  { to: "/#faq", label: "FAQ" },
];

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <Link to="/#inicio" aria-label={`${AGENCIA.nome}, início`} className="inline-flex min-h-[44px] items-center gap-1">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold ${
          claro ? "bg-white text-brand" : "bg-brand text-white"
        }`}
      >
        B
      </span>
      <span className={`text-[1.55rem] font-[650] leading-none tracking-[-0.02em] ${claro ? "text-white" : "text-ink"}`}>
        EPA
      </span>
    </Link>
  );
}

export function Nav() {
  const [aberto, setAberto] = useState(false);
  const botao = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setAberto(false);
      botao.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto]);

  return (
    <header className="sticky top-3 z-50 mt-3">
      <div className="wrap">
        <div className="flex min-h-[64px] items-center justify-between gap-3 rounded-full border border-line bg-white/95 py-1.5 pl-4 pr-2 shadow-card backdrop-blur">
          <Logo />

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3.5 py-2 text-[0.94rem] font-[580] text-ink transition-colors hover:bg-soft-2"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={SITRA_URL}
              target="_blank"
              rel="noopener"
              onClick={() => rastrear("sitra_click", { origem: "menu" })}
              className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[0.94rem] font-[620] text-brand transition-colors hover:bg-brand-soft"
            >
              Sitra
              <ArrowUpRight size={15} aria-hidden />
            </a>
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "menu" })}
              className="btn !min-h-[46px] !px-4 text-[0.94rem] sm:!px-5"
            >
              WhatsApp
            </a>
            <button
              ref={botao}
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="menu-celular"
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-soft-2 text-ink lg:hidden"
            >
              {aberto ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {aberto && (
            <motion.nav
              id="menu-celular"
              aria-label="Principal"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.16 }}
              className="cartao mt-2 flex flex-col p-2 lg:hidden"
            >
              {[{ to: "/servicos", label: "Catálogo completo" }, ...LINKS].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setAberto(false)}
                  className="rounded-2xl px-4 py-3 text-[1.05rem] font-[580] hover:bg-soft"
                >
                  {l.label}
                </Link>
              ))}
              <a
                href={SITRA_URL}
                target="_blank"
                rel="noopener"
                onClick={() => rastrear("sitra_click", { origem: "menu_celular" })}
                className="mt-1 flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-3 text-[1.05rem] font-[620] text-brand-dark"
              >
                Sites e sistemas na Sitra
                <ArrowUpRight size={18} aria-hidden />
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
