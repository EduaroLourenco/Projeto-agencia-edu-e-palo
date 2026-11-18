import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { AGENCIA, NICHOS, linkWhatsApp } from "../data/content";
import { SERVICOS } from "../data/servicos";
import { rastrear } from "../lib/analytics";
import { useLista } from "../lib/lista";

export function Contato() {
  const { ids } = useLista();
  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [problema, setProblema] = useState("");
  const [enviado, setEnviado] = useState(false);

  const escolhidos = SERVICOS.filter((s) => ids.includes(s.id)).map((s) => s.titulo);
  const nomeSetor = setor === "outro" ? "outro setor" : NICHOS.find((n) => n.id === setor)?.nome;
  const pronto = nome.trim().length > 1 && setor !== "";

  function mensagem() {
    return [
      `Olá! Me chamo ${nome.trim()} e tenho um negócio de ${nomeSetor}.`,
      problema.trim() && `Hoje meu principal desafio é: ${problema.trim()}.`,
      escolhidos.length > 0 && `Tenho interesse em: ${escolhidos.join(", ")}.`,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <section id="contato" className="wrap pb-[clamp(4rem,8vw,7rem)]">
      <div className="sobre-escuro grid items-center gap-8 rounded-[36px] bg-ink p-6 text-white sm:p-12 lg:grid-cols-2">
        <div>
          <h2 className="titulo">Vamos encontrar sua próxima oportunidade?</h2>
          <p className="mt-4 max-w-lg text-[1.12rem] leading-relaxed text-white">
            Conte o momento da sua empresa. A conversa continua no WhatsApp, já com tudo escrito.
          </p>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "contato_direto" })}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-[1.1rem] font-[620] underline underline-offset-4"
          >
            {AGENCIA.whatsappVisivel}
          </a>
        </div>

        <div className="rounded-[28px] bg-white p-5 text-ink sm:p-7">
          {enviado ? (
            <div role="status" className="py-5">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                <Check size={24} aria-hidden />
              </span>
              <p className="mt-4 text-xl font-[650]">Abrimos o WhatsApp com sua mensagem.</p>
              <p className="mt-2 text-body">Se nada abriu, o navegador pode ter bloqueado a janela.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={linkWhatsApp(mensagem())} target="_blank" rel="noreferrer" className="btn">
                  Abrir de novo
                </a>
                <button onClick={() => setEnviado(false)} className="btn-linha">
                  Corrigir dados
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pronto) return;
                rastrear("whatsapp_click", { origem: "formulario", setor });
                window.open(linkWhatsApp(mensagem()), "_blank", "noreferrer");
                setEnviado(true);
              }}
              className="flex flex-col gap-4"
            >
              <label className="flex flex-col gap-1.5 font-[600]">
                Seu nome
                <input value={nome} onChange={(e) => setNome(e.target.value)} name="nome" autoComplete="name" required minLength={2} placeholder="Como podemos te chamar?" className="campo font-normal" />
              </label>
              <label className="flex flex-col gap-1.5 font-[600]">
                Seu setor
                <select value={setor} onChange={(e) => setSetor(e.target.value)} name="setor" required className="campo font-normal">
                  <option value="" disabled>
                    Escolha o setor
                  </option>
                  {NICHOS.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.nome}
                    </option>
                  ))}
                  <option value="outro">Outro</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5 font-[600]">
                <span>
                  Maior desafio hoje <span className="font-normal text-body">(opcional)</span>
                </span>
                <textarea value={problema} onChange={(e) => setProblema(e.target.value)} name="problema" rows={3} placeholder="Ex.: perco pedidos no WhatsApp" className="campo resize-none font-normal" />
              </label>
              {escolhidos.length > 0 && (
                <p className="rounded-2xl bg-brand-soft p-3 text-[0.95rem] font-[560] text-brand-dark">
                  {escolhidos.length} {escolhidos.length === 1 ? "serviço da sua lista será incluído" : "serviços da sua lista serão incluídos"}.
                </p>
              )}
              <button type="submit" disabled={!pronto} className="btn w-full">
                Enviar pelo WhatsApp
                <ArrowRight size={17} aria-hidden />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
