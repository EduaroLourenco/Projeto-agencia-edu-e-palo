import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { AGENCIA, SITRA_URL, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";

const LINKS = [
  { href: "/#a-bepa", label: "A BEPA" },
  { href: "/#frentes", label: "Frentes" },
  { href: "/#produtos", label: "Produtos" },
  { href: "/#equipe", label: "Equipe" },
];

export function Logo() {
  return (
    <a href="/#inicio" aria-label={`${AGENCIA.nome}, início`} className="inline-flex min-h-[44px] items-center gap-[3px]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-xl font-bold leading-none text-white">
        B
      </span>
      <span className="text-[1.72rem] font-[620] leading-none tracking-[-0.02em] text-ink">EPA</span>
    </a>
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

  const linkSitra = (
    <a
      href={SITRA_URL}
      target="_blank"
      rel="noopener"
      onClick={() => rastrear("sitra_click", { origem: "menu" })}
      className="inline-flex min-h-[44px] items-center gap-1.5 text-[0.91rem] font-[620] text-brand hover:underline"
    >
      Sitra
      <ArrowUpRight size={15} aria-hidden />
    </a>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="wrap flex h-[74px] items-center justify-between gap-2 sm:gap-5">
        <Logo />

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="py-2 text-[0.91rem] font-[620] hover:text-brand">
              {l.label}
            </a>
          ))}
          {linkSitra}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button
            ref={botao}
            onClick={() => setAberto((v) => !v)}
            aria-expanded={aberto}
            aria-controls="menu-celular"
            className="inline-flex min-h-[44px] items-center gap-2 px-1 text-[0.95rem] font-[620] md:hidden"
          >
            Menu
            {aberto ? <X size={19} aria-hidden /> : <Menu size={19} aria-hidden />}
          </button>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "menu" })}
            className="btn-contorno"
          >
            WhatsApp
            <ArrowUpRight size={15} aria-hidden className="max-[359px]:hidden" />
          </a>
        </div>
      </div>

      {aberto && (
        <nav id="menu-celular" aria-label="Principal" className="border-t border-line bg-paper md:hidden">
          <div className="wrap flex flex-col py-2">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setAberto(false)}
                className="border-b border-line py-3.5 text-lg font-[620]"
              >
                {l.label}
              </a>
            ))}
            <div className="py-2 [&_a]:text-lg">{linkSitra}</div>
          </div>
        </nav>
      )}
    </header>
  );
}
