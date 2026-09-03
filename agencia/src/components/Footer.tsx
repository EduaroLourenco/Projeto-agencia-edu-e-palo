import { Link } from "react-router-dom";
import { Globe, ExternalLink, MessageCircle, Share2 } from "lucide-react";
import { AGENCIA, TIME, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";

const LINKS_NAV = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/servicos", label: "Catálogo completo" },
  { href: "/#case", label: "Cases" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#faq", label: "FAQ" },
];

const REDES = [
  {
    href: AGENCIA.instagram,
    icon: <Globe size={16} />,
    label: "Instagram",
  },
  {
    href: AGENCIA.linkedin,
    icon: <ExternalLink size={16} />,
    label: "LinkedIn",
  },
  {
    href: linkWhatsApp(),
    icon: <MessageCircle size={16} />,
    label: "WhatsApp",
  },
  {
    href: `mailto:${AGENCIA.email}`,
    icon: <Share2 size={16} />,
    label: "E-mail",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/5 pt-14 pb-8">
      <div className="mx-auto max-w-6xl px-5">
        {/* Linha principal */}
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex min-h-[44px] items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-pink-500 to-blue-400 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/20">
                {AGENCIA.iniciais}
              </span>
              <span className="font-display text-base font-bold text-white">{AGENCIA.nome}</span>
            </Link>
            <p className="text-xs text-white/40">{AGENCIA.tagline}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-white/30">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400/70" />
              Feito em Goiânia, GO
            </p>
          </div>

          {/* Navegação */}
          <div className="flex flex-col gap-2">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Navegação</p>
            {LINKS_NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="flex min-h-[44px] items-center text-sm font-medium text-white/50 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Redes sociais */}
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Contato</p>
            {REDES.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                onClick={() => r.label === "WhatsApp" && rastrear("whatsapp_click", { origem: "footer" })}
                className="flex min-h-[44px] items-center gap-2 text-sm font-medium text-white/50 transition-colors hover:text-white"
              >
                {r.icon}
                {r.label}
              </a>
            ))}
          </div>

          {/* Quem somos — compacto */}
          <div className="flex flex-col gap-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">Quem somos</p>
            {TIME.map((pessoa) => (
              <div key={pessoa.nome} className="flex items-center gap-2.5">
                <img
                  src={pessoa.fotoQuadrada}
                  alt={`Foto de ${pessoa.nome}`}
                  width={320}
                  height={320}
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-9 shrink-0 rounded-lg border border-white/10 object-cover"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/70">{pessoa.nome}</p>
                  <p className="truncate text-[11px] text-white/40">{pessoa.profissao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linha de copyright */}
        <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/5 pt-6 sm:flex-row sm:justify-between">
          <p className="text-[11px] text-white/25">
            © {new Date().getFullYear()} {AGENCIA.nome}. Todos os direitos reservados.
          </p>
          <p className="text-[11px] text-white/20">
            Tecnologia, estratégia e resultado · Goiânia, GO
          </p>
        </div>
      </div>
    </footer>
  );
}
