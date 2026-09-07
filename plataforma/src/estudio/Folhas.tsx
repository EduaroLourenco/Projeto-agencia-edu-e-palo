import { useMemo } from "react";
import { Check, Search } from "lucide-react";
import type { BlocoNaPagina, DefinicaoBloco, Loja, TipoPagina } from "../nucleo/tipos";
import { bloco as buscarBloco, blocosDisponiveis, propsPadrao, todosOsModulos } from "../nucleo/registro";
import { PARES_DE_FONTE, escalaDaMarca, textoSobreMarca } from "../nucleo/tema";
import { PAGINAS } from "../paginas/definicoes";
import { Folha, Sobrescrito } from "../design/Primitivos";
import { ControleCampo } from "./Controles";

/* ============================================================
   CATÁLOGO DE BLOCOS — o que o "+" abre

   Com miniatura e nome, não uma lista de texto: você escolhe
   vendo, não lendo.
   ============================================================ */

export function CatalogoBlocos({
  aberto,
  onFechar,
  pagina,
  loja,
  onEscolher,
}: {
  aberto: boolean;
  onFechar: () => void;
  pagina: TipoPagina;
  loja: Loja;
  onEscolher: (def: DefinicaoBloco<never>, espaco: string) => void;
}) {
  const def = PAGINAS[pagina];
  const disponiveis = useMemo(() => blocosDisponiveis(pagina, loja.modulos), [pagina, loja.modulos]);
  const espacoPadrao = def.espacos[def.espacos.length - 1]?.id ?? "corpo";

  return (
    <Folha
      aberta={aberto}
      onFechar={onFechar}
      altura="quase-cheia"
      titulo="Adicionar bloco"
      subtitulo={`Em ${def.nome.toLowerCase()}`}
    >
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {disponiveis.map((b) => {
          const Icone = b.icone;
          return (
            <button
              key={b.tipo}
              onClick={() => {
                onEscolher(b, espacoPadrao);
                onFechar();
              }}
              className="flex flex-col gap-2 border border-borda bg-papel p-3.5 text-left transition hover:border-borda-forte"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <span
                className="flex h-10 w-10 items-center justify-center bg-papel-3 text-tinta-70"
                style={{ borderRadius: "var(--canto-p)" }}
              >
                <Icone size={19} />
              </span>
              <span className="text-[13.5px] font-bold leading-tight">{b.nome}</span>
              <span className="text-[12px] leading-snug text-tinta-45">{b.descricao}</span>
            </button>
          );
        })}
      </div>

      {disponiveis.length === 0 && (
        <p className="py-10 text-center text-[13.5px] text-tinta-45">
          Esta página não aceita blocos livres.
        </p>
      )}
    </Folha>
  );
}

/* ============================================================
   PROPRIEDADES DE UM BLOCO
   ============================================================ */

export function FolhaPropriedades({
  blocoNaPagina,
  loja,
  pagina,
  onMudar,
  onFechar,
}: {
  blocoNaPagina: BlocoNaPagina | null;
  loja: Loja;
  pagina: TipoPagina;
  onMudar: (props: Record<string, unknown>) => void;
  onFechar: () => void;
}) {
  const def = blocoNaPagina ? buscarBloco(blocoNaPagina.tipo) : undefined;

  const imagens = useMemo(
    () => [...new Set(loja.ofertas.flatMap((o) => o.midia.map((m) => m.url)))].slice(0, 40),
    [loja.ofertas],
  );

  const espacos = PAGINAS[pagina].espacos;

  if (!blocoNaPagina || !def) return null;
  const props = blocoNaPagina.props;

  return (
    <Folha aberta onFechar={onFechar} altura="quase-cheia" titulo={def.nome} subtitulo={def.descricao}>
      <div className="flex flex-col gap-4 pt-1">
        {def.variantes && def.variantes.length > 0 && (
          <ControleCampo
            campo={{
              tipo: "escolha",
              rotulo: "Layout",
              opcoes: def.variantes.map((v) => ({ valor: v.valor, nome: v.nome })),
              padrao: def.variantes[0].valor,
            }}
            valor={props.variante}
            onMudar={(v) => onMudar({ ...props, variante: v })}
            imagensDisponiveis={imagens}
          />
        )}

        {Object.entries(def.campos).map(([chave, campo]) => (
          <ControleCampo
            key={chave}
            campo={campo}
            valor={props[chave]}
            onMudar={(v) => onMudar({ ...props, [chave]: v })}
            imagensDisponiveis={imagens}
          />
        ))}

        {espacos.length > 1 && (
          <div className="border-t border-borda pt-4">
            <ControleCampo
              campo={{
                tipo: "escolha",
                rotulo: "Onde na página",
                opcoes: espacos.map((e) => ({ valor: e.id, nome: e.nome })),
                padrao: espacos[0].id,
              }}
              valor={props.__espaco ?? espacos[0].id}
              onMudar={(v) => onMudar({ ...props, __espaco: v })}
              imagensDisponiveis={imagens}
            />
          </div>
        )}

        {Object.keys(def.campos).length === 0 && !def.variantes && (
          <p className="py-6 text-center text-[13.5px] text-tinta-45">
            Este bloco não tem nada pra configurar — ele mostra o conteúdo da loja.
          </p>
        )}
      </div>
    </Folha>
  );
}

/* ============================================================
   TEMA E MÓDULOS

   Poucos eixos, de propósito: uma cor, uma densidade, um canto,
   um par de fontes. Sem "cor do texto do botão".
   ============================================================ */

const CORES_SUGERIDAS = [
  "#1f7a4d", "#0f6fae", "#4b3a8f", "#7b4bd8", "#e0356f",
  "#c2410c", "#a16207", "#15803d", "#0e7490", "#be123c",
];

export function FolhaTema({
  aberto,
  onFechar,
  loja,
  onMudar,
}: {
  aberto: boolean;
  onFechar: () => void;
  loja: Loja;
  onMudar: (patch: Partial<Loja>) => void;
}) {
  const escala = escalaDaMarca(loja.tema.corMarca);
  const modulos = todosOsModulos();

  return (
    <Folha aberta={aberto} onFechar={onFechar} altura="quase-cheia" titulo="Aparência e recursos">
      <div className="flex flex-col gap-6 pt-1">
        <section className="flex flex-col gap-3">
          <Sobrescrito>Cor da marca</Sobrescrito>
          <p className="-mt-1.5 text-[12.5px] text-tinta-45">
            Você escolhe uma. A escala inteira é gerada a partir dela, com contraste garantido.
          </p>

          <div className="flex flex-wrap gap-2">
            {CORES_SUGERIDAS.map((cor) => (
              <button
                key={cor}
                onClick={() => onMudar({ tema: { ...loja.tema, corMarca: cor } })}
                aria-label={`Cor ${cor}`}
                aria-pressed={loja.tema.corMarca === cor}
                className="flex h-11 w-11 items-center justify-center"
                style={{ background: cor, borderRadius: "var(--canto-m)", color: textoSobreMarca(cor) }}
              >
                {loja.tema.corMarca === cor && <Check size={17} strokeWidth={3} />}
              </button>
            ))}

            <label
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-dashed border-borda-forte text-tinta-45"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <Search size={16} />
              <input
                type="color"
                value={loja.tema.corMarca}
                onChange={(e) => onMudar({ tema: { ...loja.tema, corMarca: e.target.value } })}
                className="sr-only"
              />
            </label>
          </div>

          <div className="flex overflow-hidden" style={{ borderRadius: "var(--canto-p)" }}>
            {Object.entries(escala).map(([grau, cor]) => (
              <span key={grau} className="h-6 flex-1" style={{ background: cor }} title={grau} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <Sobrescrito>Densidade</Sobrescrito>
          <ControleCampo
            campo={{
              tipo: "escolha",
              rotulo: "",
              opcoes: [
                { valor: "confortavel", nome: "Confortável" },
                { valor: "media", nome: "Média" },
                { valor: "compacta", nome: "Compacta" },
              ],
              padrao: "media",
            }}
            valor={loja.tema.densidade}
            onMudar={(v) => onMudar({ tema: { ...loja.tema, densidade: v as never } })}
            imagensDisponiveis={[]}
          />
        </section>

        <section className="flex flex-col gap-3">
          <Sobrescrito>Cantos</Sobrescrito>
          <ControleCampo
            campo={{
              tipo: "escolha",
              rotulo: "",
              opcoes: [
                { valor: "reto", nome: "Reto" },
                { valor: "suave", nome: "Suave" },
                { valor: "redondo", nome: "Redondo" },
              ],
              padrao: "suave",
            }}
            valor={loja.tema.canto}
            onMudar={(v) => onMudar({ tema: { ...loja.tema, canto: v as never } })}
            imagensDisponiveis={[]}
          />
        </section>

        <section className="flex flex-col gap-3">
          <Sobrescrito>Fontes</Sobrescrito>
          <div className="flex flex-col gap-2">
            {Object.entries(PARES_DE_FONTE).map(([id, par]) => {
              const ativo = loja.tema.fontes === id;
              return (
                <button
                  key={id}
                  onClick={() => onMudar({ tema: { ...loja.tema, fontes: id as never } })}
                  aria-pressed={ativo}
                  className={`flex items-center justify-between gap-3 border px-4 py-3 text-left ${
                    ativo ? "border-[var(--marca-500)] bg-[var(--marca-50)]" : "border-borda bg-papel"
                  }`}
                  style={{ borderRadius: "var(--canto-m)" }}
                >
                  <span className="min-w-0">
                    <span className="block text-[16px] font-bold" style={{ fontFamily: par.display }}>
                      {loja.nome}
                    </span>
                    <span className="mt-0.5 block text-[12px] text-tinta-45">{par.nome}</span>
                  </span>
                  {ativo && <Check size={17} className="shrink-0 text-[var(--marca-600)]" />}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3 border-t border-borda pt-5">
          <Sobrescrito>Recursos da loja</Sobrescrito>
          <p className="-mt-1.5 text-[12.5px] text-tinta-45">
            Ligar um recurso traz os blocos, os passos do checkout e as telas dele de uma vez.
          </p>

          <div className="flex flex-col gap-2">
            {modulos.map((m) => {
              const ligado = loja.modulos.includes(m.id);
              const Icone = m.icone;
              return (
                <button
                  key={m.id}
                  onClick={() =>
                    onMudar({
                      modulos: ligado ? loja.modulos.filter((x) => x !== m.id) : [...loja.modulos, m.id],
                    })
                  }
                  role="switch"
                  aria-checked={ligado}
                  className="flex items-center gap-3 border border-borda bg-papel px-3.5 py-3 text-left"
                  style={{ borderRadius: "var(--canto-m)" }}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center ${
                      ligado ? "bg-[var(--marca-100)] text-[var(--marca-700)]" : "bg-papel-3 text-tinta-45"
                    }`}
                    style={{ borderRadius: "var(--canto-p)" }}
                  >
                    <Icone size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-semibold">{m.nome}</span>
                    <span className="mt-0.5 block text-[12px] leading-snug text-tinta-45">{m.descricao}</span>
                  </span>
                  <span
                    className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors ${
                      ligado ? "bg-[var(--marca-500)]" : "bg-borda-forte"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] h-5 w-5 rounded-full bg-white shadow transition-all ${
                        ligado ? "left-[23px]" : "left-[3px]"
                      }`}
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </Folha>
  );
}

export { propsPadrao };
