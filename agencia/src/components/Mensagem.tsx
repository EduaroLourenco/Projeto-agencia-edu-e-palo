import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { AREAS, linkWhatsApp, listaPtBr, mensagem, minuscula } from "../data/content";
import { rastrear } from "../lib/analytics";

function Lista({ itens }: { itens: { chave: string; conteudo: ReactNode }[] }) {
  return listaPtBr.formatToParts(itens.map((i) => i.chave)).map((parte, indice) =>
    parte.type === "element" ? (
      <Fragment key={parte.value}>{itens.find((i) => i.chave === parte.value)?.conteudo}</Fragment>
    ) : (
      <Fragment key={indice}>{parte.value}</Fragment>
    ),
  );
}

export function Mensagem({ ids, onIds }: { ids: string[]; onIds: (ids: string[]) => void }) {
  const [area, setArea] = useState(AREAS[0].id);
  const [botaoVisivel, setBotaoVisivel] = useState(true);
  const botao = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!botao.current) return;
    // A margem evita a barra piscar quando o botão fica bem na borda da tela.
    const observador = new IntersectionObserver(([item]) => setBotaoVisivel(item.isIntersecting), { rootMargin: "96px 0px" });
    observador.observe(botao.current);
    return () => observador.disconnect();
  }, []);

  const atual = AREAS.find((a) => a.id === area) ?? AREAS[0];
  const texto = mensagem(ids, area);
  const link = linkWhatsApp(texto);
  const enviar = () => rastrear("whatsapp_click", { origem: "mensagem", total: ids.length });
  const naFrase = AREAS.filter((a) => a.id === area || a.servicos.some((s) => ids.includes(s.id)));
  const tamanho =
    texto.length > 130
      ? "text-[clamp(1.75rem,2.8vw,2.8rem)]"
      : texto.length > 70
        ? "text-[clamp(2.05rem,3.7vw,3.7rem)]"
        : "text-[clamp(2.5rem,5.2vw,5.2rem)]";

  return (
    <section id="inicio" className="wrap colunas !grid-cols-1 pb-16 pt-5 lg:!grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:pb-24 lg:pt-10">
      <div className="lg:sticky lg:top-16 lg:self-start">
        <h1 className="max-w-[30rem] text-[1.15rem] font-medium leading-snug">
          BEPA é consultoria em vendas, sistemas e finanças.{" "}
          <span className="text-suave">Toque no que você precisa e a mensagem se escreve aqui.</span>
        </h1>

        <p aria-live="polite" className={`mt-8 min-h-[3.3em] font-semibold leading-[1.05] tracking-[-0.03em] lg:mt-12 ${tamanho}`}>
          Olá, BEPA. Quero{" "}
          <Lista
            itens={naFrase.map((a) => {
              const escolhidos = a.servicos.filter((s) => ids.includes(s.id));
              return {
                chave: a.id,
                conteudo: (
                  <>
                    {minuscula(a.nome)} com{" "}
                    {escolhidos.length > 0 ? (
                      <Lista
                        itens={escolhidos.map((s) => ({
                          chave: s.id,
                          conteudo: <mark className="marca">{minuscula(s.titulo)}</mark>,
                        }))}
                      />
                    ) : (
                      <>
                        <span aria-hidden className="lacuna" />
                        <span className="sr-only">escolha um serviço</span>
                      </>
                    )}
                  </>
                ),
              };
            })}
          />
          {/* Com a lacuna no fim, o ponto ficaria sozinho na linha de baixo. */}
          {naFrase.at(-1)?.servicos.some((s) => ids.includes(s.id)) && "."}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a ref={botao} href={link} target="_blank" rel="noreferrer" onClick={enviar} className="btn w-full sm:w-auto">
            Enviar no WhatsApp
          </a>
          {ids.length > 0 && (
            <button onClick={() => onIds([])} className="min-h-[44px] font-medium underline underline-offset-4">
              Limpar escolhas
            </button>
          )}
        </div>
      </div>

      <div>
        <div role="group" aria-label="O que você quer" className="grid grid-cols-2 gap-x-5">
          {AREAS.map((a) => {
            const ativa = a.id === area;
            const total = a.servicos.filter((s) => ids.includes(s.id)).length;
            return (
              <button
                key={a.id}
                onClick={() => setArea(a.id)}
                aria-pressed={ativa}
                className={`min-h-[54px] border-b-[3px] py-2 text-left font-semibold leading-tight transition-colors ${
                  ativa ? "border-tinta" : "border-transparent text-suave hover:text-tinta"
                }`}
              >
                {a.nome}
                {total > 0 && ` (${total})`}
              </button>
            );
          })}
        </div>

        <ul key={area} className="-mx-3 mt-5 space-y-1">
          {atual.servicos.map((s, i) => {
            const marcado = ids.includes(s.id);
            return (
              <li key={s.id} className="entrar" style={{ animationDelay: `${i * 30}ms` }}>
                <button
                  onClick={() => onIds(marcado ? ids.filter((x) => x !== s.id) : [...ids, s.id])}
                  aria-pressed={marcado}
                  className={`flex min-h-[84px] w-full items-center gap-4 rounded-[10px] px-3 py-3 text-left transition-colors ${
                    marcado ? "bg-marca" : "hover:bg-areia"
                  }`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.5rem] font-semibold leading-tight tracking-[-0.015em]">{s.titulo}</span>
                    <span className={`mt-0.5 block ${marcado ? "" : "text-suave"}`}>{s.texto}</span>
                  </span>
                  {marcado ? <Minus size={24} aria-hidden /> : <Plus size={24} aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        data-oculto={ids.length === 0 || botaoVisivel}
        className="vidro vidro-base fixed inset-x-0 bottom-0 z-30 flex h-12 items-center gap-4 pl-5 pr-2 text-[0.94rem]"
      >
        <p className="min-w-0 flex-1 truncate">{texto.replace("Olá, BEPA. ", "")}</p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          onClick={enviar}
          className="inline-flex min-h-[44px] shrink-0 items-center px-3 font-bold underline underline-offset-4"
        >
          Enviar
        </a>
      </div>
    </section>
  );
}
