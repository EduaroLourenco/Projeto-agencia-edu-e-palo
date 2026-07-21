import { ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { Reveal } from "./Reveal";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

const SETORES = [
  "Moda & Atacado",
  "Distribuidora / Alimentação",
  "Salão / Estética",
  "Balada / Evento",
  "Oficina / Auto",
  "Logística / Frete",
  "Lanchonete",
  "Outro",
];

export function ContactCTA() {
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [problema, setProblema] = useState("");

  function gerarLinkWhatsApp() {
    const msg = `Oi! Me chamo ${nome || "…"} e tenho um negócio de ${setor || "…"}. Meu principal problema hoje é: ${problema || "…"}. Quero entender como vocês podem me ajudar.`;
    return linkWhatsApp(msg);
  }

  const pronto = nome.trim().length > 1 && setor;

  return (
    <section className="relative py-24 sm:py-32">
      <div className="glow-violet animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50" />

      <div className="relative mx-auto max-w-5xl px-5">
        <Reveal className="text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            Bora tirar sua ideia <span className="text-gradient">do papel</span>?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-white/60">
            Conta pra gente o que você vende e onde está travando. Em 2 minutos a gente já sabe se
            consegue ajudar.
          </p>
        </Reveal>

        {/* Formulário que gera a mensagem do WhatsApp */}
        <Reveal delay={0.15}>
          <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-white/10 bg-surface p-8">
            <p className="mb-5 text-sm font-semibold text-white/60">Monte seu diagnóstico rápido:</p>

            <div className="flex flex-col gap-4">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-colors"
              />

              <select
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-colors appearance-none"
                style={{ colorScheme: "dark" }}
              >
                <option value="" disabled>Qual é o seu setor?</option>
                {SETORES.map((s) => (
                  <option key={s} value={s} className="bg-[#0e0e17]">{s}</option>
                ))}
              </select>

              <textarea
                value={problema}
                onChange={(e) => setProblema(e.target.value)}
                placeholder="Qual é o seu maior problema hoje? (opcional)"
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30 transition-colors"
              />

              <a
                href={pronto ? gerarLinkWhatsApp() : undefined}
                target={pronto ? "_blank" : undefined}
                rel="noreferrer"
                onClick={(e) => {
                  if (!pronto) {
                    e.preventDefault();
                    return;
                  }
                  rastrear("whatsapp_click", { origem: "diagnostico", setor });
                }}
                className={`group flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all ${
                  pronto
                    ? "bg-white text-ink hover:bg-white/90 cursor-pointer"
                    : "cursor-not-allowed bg-white/10 text-white/30"
                }`}
              >
                <Send size={15} />
                Enviar diagnóstico pelo WhatsApp
                {pronto && (
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                )}
              </a>

              {!pronto && (
                <p className="text-center text-xs text-white/30">Preencha nome e setor para continuar</p>
              )}
            </div>
          </div>
        </Reveal>

        {/* Alternativa direta */}
        <Reveal delay={0.2} className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs text-white/30">Ou fale direto, sem formulário:</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagneticButton
              href={linkWhatsApp()}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("whatsapp_click", { origem: "cta_final" })}
              className="group flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/5"
            >
              Falar no WhatsApp
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <a
              href={`mailto:${AGENCIA.email}`}
              className="text-sm font-semibold text-white/40 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              ou envie um e-mail
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
