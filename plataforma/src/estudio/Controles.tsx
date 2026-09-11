import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload } from "lucide-react";
import type { CampoBloco } from "../nucleo/tipos";
import { Campo, Entrada, Selecao, Stepper } from "../design/Primitivos";
import { pesoEmKB, prepararImagem } from "../nucleo/imagem";
import { guardarFoto, urlsDoBanco } from "../nucleo/fotos";

/**
 * Os controles se desenham sozinhos.
 *
 * O estúdio não conhece nenhum bloco: ele lê a declaração de campos que
 * cada bloco publica e monta o formulário. É por isso que bloco novo
 * aparece no editor sem ninguém mexer no editor.
 */

export function ControleCampo({
  campo,
  valor,
  onMudar,
  imagensDisponiveis,
}: {
  campo: CampoBloco;
  valor: unknown;
  onMudar: (v: unknown) => void;
  imagensDisponiveis: string[];
}) {
  switch (campo.tipo) {
    case "texto":
      return (
        <Campo rotulo={campo.rotulo} dica={campo.dica}>
          {(p) =>
            (campo.linhas ?? 1) > 1 ? (
              <textarea
                {...p}
                rows={campo.linhas}
                value={String(valor ?? "")}
                onChange={(e) => onMudar(e.target.value)}
                className="w-full resize-y border border-borda-forte bg-papel px-3.5 py-2.5 text-tinta placeholder:text-tinta-25"
                style={{ borderRadius: "var(--canto-m)" }}
              />
            ) : (
              <Entrada {...p} value={String(valor ?? "")} onChange={(e) => onMudar(e.target.value)} />
            )
          }
        </Campo>
      );

    case "numero":
      return (
        <Campo rotulo={campo.rotulo}>
          {() => (
            <div className="flex items-center gap-3">
              <Stepper
                valor={Number(valor ?? 0)}
                onMudar={onMudar}
                min={campo.min ?? 0}
                max={campo.max ?? 999}
              />
              {campo.sufixo && <span className="text-[13px] text-tinta-45">{campo.sufixo}</span>}
            </div>
          )}
        </Campo>
      );

    case "simNao":
      return (
        <button
          onClick={() => onMudar(!valor)}
          role="switch"
          aria-checked={Boolean(valor)}
          className="flex w-full items-center justify-between gap-3 border border-borda bg-papel px-3.5 py-3 text-left"
          style={{ borderRadius: "var(--canto-m)" }}
        >
          <span className="min-w-0">
            <span className="block text-[13.5px] font-semibold">{campo.rotulo}</span>
            {campo.dica && <span className="mt-0.5 block text-[12px] text-tinta-45">{campo.dica}</span>}
          </span>
          <span
            className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors ${
              valor ? "bg-[var(--marca-500)]" : "bg-borda-forte"
            }`}
          >
            <span
              className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${
                valor ? "left-[23px]" : "left-[3px]"
              }`}
            />
          </span>
        </button>
      );

    case "escolha":
      return (
        <Campo rotulo={campo.rotulo}>
          {(p) => (
            <div className="flex flex-wrap gap-2">
              {campo.opcoes.map((o) => {
                const ativo = String(valor ?? campo.padrao) === o.valor;
                return (
                  <button
                    key={o.valor}
                    {...(ativo ? { id: p.id } : {})}
                    onClick={() => onMudar(o.valor)}
                    aria-pressed={ativo}
                    className={`min-h-[42px] border px-3.5 text-[13px] font-semibold transition ${
                      ativo
                        ? "border-transparent bg-tinta text-white"
                        : "border-borda-forte bg-papel text-tinta-70"
                    }`}
                    style={{ borderRadius: "var(--canto-m)" }}
                  >
                    {o.nome}
                  </button>
                );
              })}
            </div>
          )}
        </Campo>
      );

    case "cor":
      return (
        <Campo rotulo={campo.rotulo}>
          {(p) => (
            <input
              {...p}
              type="color"
              value={String(valor ?? campo.padrao ?? "#000000")}
              onChange={(e) => onMudar(e.target.value)}
              className="h-12 w-full cursor-pointer border border-borda-forte bg-papel p-1"
              style={{ borderRadius: "var(--canto-m)" }}
            />
          )}
        </Campo>
      );

    case "imagem":
      return (
        <ControleImagem
          campo={campo}
          valor={valor}
          onMudar={onMudar}
          imagensDisponiveis={imagensDisponiveis}
        />
      );

    case "lista":
      return (
        <ControleLista campo={campo} valor={valor} onMudar={onMudar} imagensDisponiveis={imagensDisponiveis} />
      );
  }
}

/**
 * Escolher uma imagem: subir do aparelho ou reaproveitar do catálogo.
 *
 * O botão de subir vem primeiro de propósito. A lista de reaproveitar
 * existia sozinha antes, e era a prova de que não dava pra montar uma loja
 * de verdade — só dava pra remontar a demo.
 */
function ControleImagem({
  campo,
  valor,
  onMudar,
  imagensDisponiveis,
}: {
  campo: Extract<CampoBloco, { tipo: "imagem" }>;
  valor: unknown;
  onMudar: (v: unknown) => void;
  imagensDisponiveis: string[];
}) {
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [banco, setBanco] = useState<string[]>(() => urlsDoBanco());

  /**
   * Subir guarda no banco de fotos além de usar aqui.
   *
   * É o que faz a mesma foto servir pra capa, pro produto e pra outra loja
   * sem subir de novo. Se o banco estiver cheio, a foto ainda entra no
   * bloco — só não fica guardada; travar a edição por causa do acervo seria
   * punir a pessoa por uma limitação nossa.
   */
  async function subir(arquivo: File | undefined) {
    if (!arquivo) return;
    setErro(null);
    setOcupado(true);
    const r = await guardarFoto(arquivo, { lado: 1000 });
    if (r.ok) {
      onMudar(r.foto.url);
      setBanco(urlsDoBanco());
    } else {
      try {
        const { url } = await prepararImagem(arquivo, { lado: 1000 });
        onMudar(url);
        setErro(r.erro);
      } catch (e) {
        setErro(e instanceof Error ? e.message : "Não consegui usar esta imagem.");
      }
    }
    setOcupado(false);
  }

  const url = String(valor ?? "");
  // O banco vem antes: é o acervo da pessoa. O catálogo é o que já está na
  // loja e costuma repetir o que ela já viu.
  const reaproveitar = [...banco, ...imagensDisponiveis.filter((u) => !banco.includes(u))];

  return (
    <Campo rotulo={campo.rotulo} dica={campo.dica}>
      {() => (
        <div className="flex flex-col gap-2">
          {url ? (
            <div className="relative">
              <img
                src={url}
                alt=""
                className="h-32 w-full object-cover"
                style={{ borderRadius: "var(--canto-m)" }}
              />
              <div className="absolute right-2 top-2 flex gap-1.5">
                {url.startsWith("data:") && (
                  <span className="num-tab flex h-8 items-center bg-tinta/70 px-2 text-[11px] font-bold text-white" style={{ borderRadius: "999px" }}>
                    {pesoEmKB(url)} KB
                  </span>
                )}
                <button
                  onClick={() => onMudar("")}
                  aria-label="Tirar imagem"
                  className="flex h-8 w-8 items-center justify-center bg-papel/90 text-tinta-70 shadow"
                  style={{ borderRadius: "999px" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ) : (
            <label
              className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-borda-forte text-[13px] font-semibold text-tinta-70"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              {ocupado ? (
                <span className="anima-pulsar">Preparando…</span>
              ) : (
                <>
                  <Upload size={18} />
                  Subir uma foto
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => subir(e.target.files?.[0])}
              />
            </label>
          )}

          {erro && <p className="text-[12px] font-semibold text-erro">{erro}</p>}

          {url && (
            <label
              className="flex min-h-[40px] cursor-pointer items-center justify-center gap-1.5 border border-borda-forte text-[12.5px] font-semibold text-tinta-70"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <Upload size={14} />
              {ocupado ? "Preparando…" : "Trocar a foto"}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => subir(e.target.files?.[0])} />
            </label>
          )}

          {reaproveitar.length > 0 && (
            <>
              <p className="mt-0.5 text-[11.5px] text-tinta-45">
                ou use uma do seu banco de fotos
              </p>
              <div className="sem-barra -mx-1 flex gap-2 overflow-x-auto px-1">
                {reaproveitar.map((u) => (
                  <button
                    key={u}
                    onClick={() => onMudar(u)}
                    className={`h-14 w-14 shrink-0 overflow-hidden border-2 ${
                      valor === u ? "border-[var(--marca-500)]" : "border-transparent"
                    }`}
                    style={{ borderRadius: "var(--canto-p)" }}
                  >
                    <img src={u} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Campo>
  );
}

function ControleLista({
  campo,
  valor,
  onMudar,
  imagensDisponiveis,
}: {
  campo: Extract<CampoBloco, { tipo: "lista" }>;
  valor: unknown;
  onMudar: (v: unknown) => void;
  imagensDisponiveis: string[];
}) {
  const itens = Array.isArray(valor) ? (valor as Record<string, unknown>[]) : [];
  const [aberto, setAberto] = useState<number | null>(itens.length ? 0 : null);

  function alterar(i: number, patch: Record<string, unknown>) {
    onMudar(itens.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function mover(i: number, delta: number) {
    const j = i + delta;
    if (j < 0 || j >= itens.length) return;
    const copia = [...itens];
    [copia[i], copia[j]] = [copia[j], copia[i]];
    onMudar(copia);
    setAberto(j);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-tinta-70">{campo.rotulo}</p>

      {itens.map((item, i) => {
        const expandido = aberto === i;
        const titulo =
          String(item.titulo ?? item.autor ?? item.nome ?? "") || `Item ${i + 1}`;

        return (
          <div key={i} className="border border-borda bg-papel" style={{ borderRadius: "var(--canto-m)" }}>
            <div className="flex items-center gap-1 px-2 py-1.5">
              <button
                onClick={() => setAberto(expandido ? null : i)}
                className="flex min-h-[40px] min-w-0 flex-1 items-center gap-2 px-1.5 text-left"
              >
                <span className="num-tab text-[11px] font-bold text-tinta-25">{i + 1}</span>
                <span className="truncate text-[13px] font-semibold">{titulo}</span>
              </button>

              <button onClick={() => mover(i, -1)} disabled={i === 0} aria-label="Subir" className="flex h-9 w-9 items-center justify-center text-tinta-45 disabled:text-tinta-12">
                <ChevronUp size={16} />
              </button>
              <button onClick={() => mover(i, 1)} disabled={i === itens.length - 1} aria-label="Descer" className="flex h-9 w-9 items-center justify-center text-tinta-45 disabled:text-tinta-12">
                <ChevronDown size={16} />
              </button>
              <button
                onClick={() => {
                  onMudar(itens.filter((_, idx) => idx !== i));
                  setAberto(null);
                }}
                aria-label="Apagar"
                className="flex h-9 w-9 items-center justify-center text-tinta-25 hover:text-erro"
              >
                <Trash2 size={15} />
              </button>
            </div>

            {expandido && (
              <div className="flex flex-col gap-3.5 border-t border-borda p-3.5">
                {Object.entries(campo.de).map(([chave, sub]) => (
                  <ControleCampo
                    key={chave}
                    campo={sub}
                    valor={item[chave]}
                    onMudar={(v) => alterar(i, { [chave]: v })}
                    imagensDisponiveis={imagensDisponiveis}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {(!campo.max || itens.length < campo.max) && (
        <button
          onClick={() => {
            onMudar([...itens, {}]);
            setAberto(itens.length);
          }}
          className="flex min-h-[44px] items-center justify-center gap-1.5 border border-dashed border-borda-forte text-[13px] font-semibold text-tinta-70"
          style={{ borderRadius: "var(--canto-m)" }}
        >
          <Plus size={15} />
          Adicionar
        </button>
      )}
    </div>
  );
}

/** Também usado pelo tema: uma escolha de opções com prévia. */
export { Selecao };
