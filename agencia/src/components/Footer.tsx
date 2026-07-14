import { AGENCIA, linkWhatsApp } from "../data/content";

const LINKS = [
  { href: "#modulos", label: "Serviços" },
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#case", label: "Cases" },
  { href: "#quem-somos", label: "Quem somos" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <a href="#top" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-cyan-400 font-display text-sm font-bold text-ink">
              EP
            </span>
            <span className="font-display text-sm font-bold text-white">{AGENCIA.nome}</span>
          </a>
          <p className="text-xs text-white/40">{AGENCIA.tagline}</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-xs font-medium text-white/50 hover:text-white">
              {l.label}
            </a>
          ))}
          <a href={linkWhatsApp()} target="_blank" rel="noreferrer" className="text-xs font-medium text-white/50 hover:text-white">
            WhatsApp
          </a>
          <a href={`mailto:${AGENCIA.email}`} className="text-xs font-medium text-white/50 hover:text-white">
            {AGENCIA.email}
          </a>
        </nav>
      </div>

      <p className="mt-10 text-center text-[11px] text-white/25">
        © {new Date().getFullYear()} {AGENCIA.nome}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
