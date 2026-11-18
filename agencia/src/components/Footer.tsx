import { Link } from "react-router-dom";
import { AGENCIA, SITRA_URL, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";
import { Logo } from "./Nav";

const LINKS = [
  { to: "/servicos", label: "Catálogo" },
  { to: "/#setores", label: "Setores" },
  { to: "/#case", label: "Case" },
  { to: "/#produtos", label: "Produtos" },
  { to: "/#equipe", label: "Equipe" },
  { to: "/#faq", label: "FAQ" },
];

const LINK = "inline-flex min-h-[44px] items-center font-[560] text-white hover:underline underline-offset-4";

export function Footer() {
  return (
    <footer className="sobre-escuro bg-ink text-white">
      <div className="wrap flex flex-wrap items-start justify-between gap-8 py-12">
        <div>
          <Logo claro />
          <p className="mt-2 max-w-xs text-white">{AGENCIA.nomeCompleto}</p>
        </div>
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-10 sm:grid-cols-3">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={LINK}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col">
          <a href={linkWhatsApp()} target="_blank" rel="noreferrer" onClick={() => rastrear("whatsapp_click", { origem: "rodape" })} className={LINK}>
            WhatsApp
          </a>
          <a href={SITRA_URL} target="_blank" rel="noopener" onClick={() => rastrear("sitra_click", { origem: "rodape" })} className={LINK}>
            Sitra ↗
          </a>
        </div>
      </div>
      <p className="wrap border-t border-white/20 py-5 text-sm text-white">
        © {new Date().getFullYear()} {AGENCIA.nome}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
