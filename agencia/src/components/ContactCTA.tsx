import { ArrowRight, Check, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { AGENCIA, NICHOS, linkWhatsApp } from "../data/content";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";
import { setorLembrado } from "../lib/preferencias";

export function ContactCTA() {
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [problema, setProblema] = useState("");
  const [enviado, setEnviado] = useState(false);

  // Se o visitante já escolheu o setor lá em cima (ou numa visita
  // anterior), o campo chega preenchido. Um campo a menos pra responder.
  useEffect(() => {
    const salvo = setorLembrado();
    if (salvo && NICHOS.some((n) => n.id === salvo)) setSetor(salvo);
  }, []);

  const nomeDoSetor = NICHOS.find((n) => n.id === setor)?.nome ?? "";

  function mensagem() {
    const base = `Oi! Me chamo ${nome.trim()} e tenho um negócio de ${nomeDoSetor}.`;
    const dor = problema.trim() ? ` Meu principal problema hoje é: ${problema.trim()}.` : "";
    return `${base}${dor} Quero entender como vocês podem me ajudar.`;
  }

  const pronto = nome.trim().length > 1 && setor !== "";

  return (
    <section className="relative overflow-hidden py-16 sm:py-28">
      <div className="relative mx-auto max-w-5xl px-5">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Bora tirar sua ideia do papel?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-white/60">
            Conta pra gente o que você vende e onde está travando. Em 2 minutos a gente já sabe se
            consegue ajudar.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-white/[0.08] bg-surface p-6 sm:p-8">
            {enviado ? (
              /* Confirmação: antes, clicar abria o WhatsApp e a página ficava
                 exatamente igual. Quem tivesse o WhatsApp bloqueado ou numa
                 outra aba não sabia se tinha funcionado. */
              <div className="py-4 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
                  <Check size={22} />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-white">
                  Abrimos o WhatsApp com sua mensagem pronta.
                </p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/60">
                  Se nada abriu, o navegador pode ter bloqueado a janela. Dá pra tentar de novo
                  ou copiar a mensagem.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href={linkWhatsApp(mensagem())}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-pink-400 px-6 text-sm font-bold text-ink"
                  >
                    Abrir de novo
                    <ArrowRight size={15} />
                  </a>
                  <button
                    onClick={() => setEnviado(false)}
                    className="min-h-[44px] rounded-xl border border-white/[0.12] px-6 text-sm font-bold text-white transition-colors hover:bg-white/5"
                  >
                    Corrigir os dados
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mb-5 text-sm font-semibold text-white/60">Monte seu diagnóstico rápido:</p>

                <div className="flex flex-col gap-5">
                  {/* Rótulo visível, não só placeholder: placeholder some quando
                      a pessoa começa a digitar, e aí ela não sabe mais o que é
                      cada campo. text-base = 16px porque abaixo disso o Safari
                      do iPhone dá zoom sozinho e desalinha a página. */}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-white/60">Seu nome</span>
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      name="nome"
                      autoComplete="name"
                      enterKeyHint="next"
                      placeholder="Como podemos te chamar?"
                      className="min-h-[48px] w-full rounded-xl border border-white/[0.08] bg-white/5 px-4 py-3 text-base text-white transition-colors placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-white/60">Seu setor</span>
                    <select
                      value={setor}
                      onChange={(e) => setSetor(e.target.value)}
                      name="setor"
                      className="min-h-[48px] w-full appearance-none rounded-xl border border-white/[0.08] bg-white/5 px-4 py-3 text-base text-white transition-colors focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="" disabled>
                        Escolha o seu setor
                      </option>
                      {NICHOS.map((n) => (
                        <option key={n.id} value={n.id} className="bg-[#100a1d]">
                          {n.nome}
                        </option>
                      ))}
                      <option value="outro" className="bg-[#100a1d]">
                        Outro
                      </option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold text-white/60">
                      O que está travando hoje? <span className="text-white/40">(opcional)</span>
                    </span>
                    <textarea
                      value={problema}
                      onChange={(e) => setProblema(e.target.value)}
                      name="problema"
                      rows={3}
                      placeholder="Ex: perco pedido no meio das mensagens do WhatsApp"
                      className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/5 px-4 py-3 text-base text-white transition-colors placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
                    />
                  </label>

                  <a
                    href={pronto ? linkWhatsApp(mensagem()) : undefined}
                    target={pronto ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-disabled={!pronto}
                    onClick={(e) => {
                      if (!pronto) {
                        e.preventDefault();
                        return;
                      }
                      rastrear("whatsapp_click", { origem: "diagnostico", setor });
                      setEnviado(true);
                    }}
                    className={`group flex min-h-[48px] items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all ${
                      pronto
                        ? "cursor-pointer bg-pink-400 text-ink hover:brightness-110"
                        : "cursor-not-allowed bg-white/10 text-white/35"
                    }`}
                  >
                    <Send size={15} />
                    Enviar diagnóstico pelo WhatsApp
                    {pronto && (
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    )}
                  </a>

                  {!pronto && (
                    <p className="text-center text-xs text-white/45">
                      Preencha nome e setor para continuar
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs text-white/45">Ou fale direto, sem formulário:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticButton
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "cta_final" })}
              className="group flex min-h-[44px] items-center gap-2 rounded-full border border-white/[0.12] px-6 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              Falar no WhatsApp
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <a
              href={`mailto:${AGENCIA.email}`}
              className="flex min-h-[44px] items-center text-sm font-semibold text-white/50 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              ou envie um e-mail
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
