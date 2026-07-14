import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { MagneticButton } from "./MagneticButton";

const LINKS = [
  { href: "#modulos", label: "Serviços" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#case", label: "Cases" },
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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-sm font-bold text-ink">
            EP
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-white">
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
          className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105 md:block"
        >
          Falar no WhatsApp
        </MagneticButton>

        <button
          onClick={() => setAberto((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white md:hidden"
          aria-label="Menu"
        >
          {aberto ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {aberto && (
        <div className="border-t border-white/5 bg-ink px-5 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className="rounded-lg px-2 py-3 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-ink"
            >
              Falar no WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
