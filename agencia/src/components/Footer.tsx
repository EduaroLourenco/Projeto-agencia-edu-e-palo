import { AGENCIA, SITRA_URL } from "../data/content";
import { rastrear } from "../lib/analytics";

const LINKS = [
  { href: "/#a-bepa", label: "A BEPA" },
  { href: "/#frentes", label: "Frentes" },
  { href: "/#produtos", label: "Produtos" },
  { href: "/#equipe", label: "Equipe" },
  { href: "/#contato", label: "Contato" },
];

export function Footer() {
  return (
    <footer className="wrap flex flex-wrap items-start justify-between gap-x-8 gap-y-3 py-6 text-[0.91rem]">
      <div>
        <p className="font-[650]">{AGENCIA.nomeCompleto}</p>
        <p className="mt-0.5 text-[0.82rem] text-muted">
          © {new Date().getFullYear()} {AGENCIA.nome}. Todos os direitos reservados.
        </p>
      </div>
      <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} className="inline-flex min-h-[44px] items-center font-[620] hover:text-brand">
            {l.label}
          </a>
        ))}
        <a
          href={SITRA_URL}
          target="_blank"
          rel="noopener"
          onClick={() => rastrear("sitra_click", { origem: "rodape" })}
          className="inline-flex min-h-[44px] items-center font-[620] text-brand hover:underline"
        >
          Sitra ↗
        </a>
      </nav>
    </footer>
  );
}
