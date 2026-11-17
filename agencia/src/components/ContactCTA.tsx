import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";
import { AGENCIA, NICHOS, linkWhatsApp } from "../data/content";
import { Reveal } from "./Reveal";
import { rastrear } from "../lib/analytics";
import { BTN_PRIMARIO, BTN_SECUNDARIO } from "./ui";

const CAMPO =
  "min-h-[48px] w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function ContactCTA() {
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [problema, setProblema] = useState("");
  const [enviado, setEnviado] = useState(false);

  const nomeDoSetor = setor === "outro" ? "outro setor" : (NICHOS.find((n) => n.id === setor)?.nome ?? "");

  function mensagem() {
    const base = `Oi! Me chamo ${nome.trim()} e tenho um negócio de ${nomeDoSetor}.`;
    const dor = problema.trim() ? ` Meu principal problema hoje é: ${problema.trim()}.` : "";
    return `${base}${dor} Quero entender como vocês podem me ajudar.`;
  }

  const pronto = nome.trim().length > 1 && setor !== "";

  return (
    <section id="contato" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="text-sm font-semibold text-white/70">
            <span className="tabular-nums text-brand-light">06</span>
            <span className="mx-2" aria-hidden>
              —
            </span>
            Contato
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Conte o que está travando.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70">
            Em uma conversa a gente já sabe se consegue ajudar e por onde começar. Sem compromisso.
          </p>

          <ul className="mt-10 border-t border-line-dark">
            <li className="border-b border-line-dark">
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noreferrer"
                onClick={() => rastrear("whatsapp_click", { origem: "cta_final" })}
                className="flex items-center justify-between py-4 text-base font-semibold hover:text-brand-light"
              >
                WhatsApp, sem formulário
                <ArrowUpRight size={18} aria-hidden />
              </a>
            </li>
            <li className="border-b border-line-dark">
              <a
                href={`mailto:${AGENCIA.email}`}
                className="flex items-center justify-between py-4 text-base font-semibold hover:text-brand-light"
              >
                {AGENCIA.email}
                <ArrowUpRight size={18} aria-hidden />
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.05}>
          <div className="rounded-lg bg-paper p-6 text-ink sm:p-8">
            {enviado ? (
              <div className="py-6" role="status">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-soft text-brand">
                  <Check size={22} aria-hidden />
                </span>
                <p className="mt-5 font-display text-xl font-bold">Abrimos o WhatsApp com sua mensagem.</p>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
                  Se nada abriu, o navegador pode ter bloqueado a janela. Tente de novo ou ajuste os dados.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href={linkWhatsApp(mensagem())} target="_blank" rel="noreferrer" className={BTN_PRIMARIO}>
                    Abrir de novo
                    <ArrowRight size={16} aria-hidden />
                  </a>
                  <button onClick={() => setEnviado(false)} className={BTN_SECUNDARIO}>
                    Corrigir os dados
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!pronto) return;
                  rastrear("whatsapp_click", { origem: "diagnostico", setor });
                  window.open(linkWhatsApp(mensagem()), "_blank", "noreferrer");
                  setEnviado(true);
                }}
                className="flex flex-col gap-5"
              >
                <p className="font-display text-lg font-bold">Diagnóstico rápido</p>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">Seu nome</span>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    name="nome"
                    autoComplete="name"
                    enterKeyHint="next"
                    required
                    minLength={2}
                    placeholder="Como podemos te chamar?"
                    className={CAMPO}
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">Seu setor</span>
                  <select
                    value={setor}
                    onChange={(e) => setSetor(e.target.value)}
                    name="setor"
                    required
                    className={CAMPO}
                  >
                    <option value="" disabled>
                      Escolha o seu setor
                    </option>
                    {NICHOS.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.nome}
                      </option>
                    ))}
                    <option value="outro">Outro</option>
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold">
                    O que está travando hoje? <span className="font-normal text-muted">(opcional)</span>
                  </span>
                  <textarea
                    value={problema}
                    onChange={(e) => setProblema(e.target.value)}
                    name="problema"
                    rows={3}
                    placeholder="Ex.: perco pedido no meio das mensagens do WhatsApp"
                    className={`${CAMPO} resize-none`}
                  />
                </label>

                <button type="submit" disabled={!pronto} className={`${BTN_PRIMARIO} disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/50`}>
                  Enviar pelo WhatsApp
                  <ArrowRight size={16} aria-hidden />
                </button>
                {!pronto && <p className="text-sm text-muted">Preencha nome e setor para continuar.</p>}
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
