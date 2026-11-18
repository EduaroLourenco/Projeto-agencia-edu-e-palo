import { ArrowUpRight } from "lucide-react";
import { AGENCIA, FRENTES, linkWhatsApp } from "../data/content";
import { rastrear } from "../lib/analytics";

const LINHA =
  "flex min-h-[62px] items-center justify-between gap-3 border-t border-night-line py-2.5 text-[clamp(1rem,2vw,1.25rem)] hover:underline";

/** Cada dor já abre a conversa certa: o visitante não preenche nada. */
export function Contato() {
  return (
    <section id="contato" className="bg-night py-[clamp(2.7rem,5vw,4.7rem)] text-warm">
      <div className="wrap cabecalho !items-center">
        <div>
          <h2 className="titulo-secao">Por onde começar?</h2>
          <p className="mt-3 max-w-[44ch] text-night-muted">
            Escolha o que mais pesa hoje. A conversa já abre com isso escrito.
          </p>
        </div>

        <div>
          {FRENTES.map((f) => (
            <a
              key={f.id}
              href={f.url ?? linkWhatsApp(f.mensagem)}
              target="_blank"
              rel={f.url ? "noopener" : "noreferrer"}
              onClick={() =>
                f.url
                  ? rastrear("sitra_click", { origem: "contato" })
                  : rastrear("whatsapp_click", { origem: "contato", frente: f.id })
              }
              className={LINHA}
            >
              <span>
                <small className="block text-[0.76rem] text-night-muted">{f.nome}</small>
                {f.dor}
              </span>
              <ArrowUpRight size={18} aria-hidden className="shrink-0" />
            </a>
          ))}
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "contato" })}
            className={LINHA}
          >
            <span>
              <small className="block text-[0.76rem] text-night-muted">Outro assunto · WhatsApp</small>
              {AGENCIA.whatsappVisivel}
            </span>
            <ArrowUpRight size={18} aria-hidden className="shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
