import { AGENCIA, SITRA_URL, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";
import { Logo } from "./Nav";

const NAVEGACAO = [
  { href: "/#servicos", label: "Serviços" },
  { href: "/servicos", label: "Catálogo completo" },
  { href: "/#cases", label: "Cases" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#quem-somos", label: "Quem somos" },
  { href: "/#faq", label: "FAQ" },
];

const TITULO = "mb-3 text-sm font-semibold text-ink";
const LINK = "flex min-h-[40px] items-center text-[15px] text-muted transition-colors hover:text-ink";

export function Footer() {
  return (
    <footer className="border-t border-line pb-10 pt-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <Logo />
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">{AGENCIA.nomeCompleto}</p>
          </div>

          <nav aria-label="Rodapé" className="md:col-span-3">
            <p className={TITULO}>Navegação</p>
            {NAVEGACAO.map((l) => (
              <a key={l.href} href={l.href} className={LINK}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="md:col-span-2">
            <p className={TITULO}>Contato</p>
            <a
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "footer" })}
              className={LINK}
            >
              WhatsApp
            </a>
            <a href={`mailto:${AGENCIA.email}`} className={LINK}>
              E-mail
            </a>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className={TITULO}>Da mesma casa</p>
            <a
              href={SITRA_URL}
              target="_blank"
              rel="noopener"
              onClick={() => rastrear("sitra_click", { origem: "footer" })}
              className="block border border-line bg-white p-4 transition-colors hover:border-ink/40"
            >
              <span className="block font-display text-base font-bold text-ink">Sitra ↗</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">
                Sites, landing pages e sistemas para empresas.
              </span>
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {AGENCIA.nome}. Todos os direitos reservados.
          </p>
          <p>Tecnologia, estratégia e resultado.</p>
        </div>
      </div>
    </footer>
  );
}
