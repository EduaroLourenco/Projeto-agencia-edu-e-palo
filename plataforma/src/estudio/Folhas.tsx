import { useMemo, useState } from "react";
import { Check, Search } from "lucide-react";
import type { BlocoNaPagina, DefinicaoBloco, EstiloBloco, Loja, TipoPagina } from "../nucleo/tipos";
import { bloco as buscarBloco, blocosDisponiveis, propsPadrao, todosOsModulos } from "../nucleo/registro";
import {
  CORES_SUGERIDAS,
  PAPEIS_SUGERIDOS,
  PARES_DE_FONTE,
  contrasteEntre,
  escalaDaMarca,
  paletaDoPapel,
  temaCompleto,
  textoSobre,
  textoSobreMarca,
} from "../nucleo/tema";
import { PAGINAS } from "../paginas/definicoes";
import { Folha, Sobrescrito } from "../design/Primitivos";
import { ControleCampo } from "./Controles";
import { CAMPOS_ESTILO } from "../vitrine/estiloDeBloco";

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
  onMudarEstilo,
  onFechar,
}: {
  blocoNaPagina: BlocoNaPagina | null;
  loja: Loja;
  pagina: TipoPagina;
  onMudar: (props: Record<string, unknown>) => void;
  onMudarEstilo: (estilo: EstiloBloco) => void;
  onFechar: () => void;
}) {
  const [aba, setAba] = useState<"conteudo" | "estilo">("conteudo");
  const def = blocoNaPagina ? buscarBloco(blocoNaPagina.tipo) : undefined;

  const imagens = useMemo(
    () => [...new Set(loja.ofertas.flatMap((o) => o.midia.map((m) => m.url)))].slice(0, 40),
    [loja.ofertas],
  );

  const espacos = PAGINAS[pagina].espacos;

  if (!blocoNaPagina || !def) return null;
  const props = blocoNaPagina.props;
  const estilo = blocoNaPagina.estilo ?? {};
  const semConteudo = Object.keys(def.campos).length === 0 && !def.variantes;

  const campoEstilo = (chave: keyof typeof CAMPOS_ESTILO) => (
    <ControleCampo
      key={chave}
      campo={CAMPOS_ESTILO[chave]}
      valor={(estilo as Record<string, unknown>)[chave]}
      onMudar={(v) => {
        // Escolher um fundo sem respiro cola o texto na borda da cor. Então
        // o primeiro fundo já traz um respiro junto — o lojista pode tirar
        // depois, mas nunca vê a versão feia primeiro.
        if (chave === "fundo" && estilo.respiro === undefined) {
          onMudarEstilo({ ...estilo, fundo: v as never, respiro: v === "nenhum" ? undefined : "m" });
          return;
        }
        onMudarEstilo({ ...estilo, [chave]: v });
      }}
      imagensDisponiveis={imagens}
    />
  );

  return (
    <Folha aberta onFechar={onFechar} altura="quase-cheia" titulo={def.nome} subtitulo={def.descricao}>
      {/* Duas abas em vez de uma lista longa: quem entrou pra trocar um
          título não devia rolar por dez controles de cor pra achar. */}
      <div className="sticky top-0 z-10 -mx-5 mb-4 bg-papel px-5 pb-3 pt-1">
        <div className="flex gap-1 bg-papel-3 p-1" style={{ borderRadius: "var(--canto-m)" }}>
          {([
            ["conteudo", "Conteúdo"],
            ["estilo", "Estilo"],
          ] as const).map(([id, nome]) => (
            <button
              key={id}
              onClick={() => setAba(id)}
              aria-pressed={aba === id}
              className={`min-h-[38px] flex-1 text-[13px] font-bold transition ${
                aba === id ? "bg-papel text-tinta shadow-[var(--sombra-1)]" : "text-tinta-45"
              }`}
              style={{ borderRadius: "calc(var(--canto-m) - 2px)" }}
            >
              {nome}
            </button>
          ))}
        </div>
      </div>

      {aba === "conteudo" ? (
        <div className="flex flex-col gap-4">
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

          {semConteudo && (
            <p className="py-6 text-center text-[13.5px] text-tinta-45">
              Este bloco não tem nada pra configurar — ele mostra o conteúdo da loja.
              <br />
              Use a aba <strong className="font-semibold text-tinta-70">Estilo</strong> pra dar
              fundo e respiro a ele.
            </p>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {campoEstilo("fundo")}
          {estilo.fundo === "propria" && campoEstilo("corFundo")}
          {campoEstilo("respiro")}
          {campoEstilo("alinhamento")}

          <div className="border-t border-borda pt-4" />
          {campoEstilo("canto")}
          {campoEstilo("sombra")}
          {campoEstilo("borda")}
          {campoEstilo("sangrar")}
          {campoEstilo("espacoDepois")}

          <button
            onClick={() => onMudarEstilo({})}
            className="mt-1 min-h-[44px] border border-borda-forte text-[13px] font-semibold text-tinta-70"
            style={{ borderRadius: "var(--canto-m)" }}
          >
            Voltar ao estilo padrão
          </button>
        </div>
      )}
    </Folha>
  );
}

/* ============================================================
   TEMA E MÓDULOS

   Poucos eixos, de propósito: uma cor, uma densidade, um canto,
   um par de fontes. Sem "cor do texto do botão".
   ============================================================ */

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
  const tema = temaCompleto(loja.tema);
  const papel = tema.corPapel;
  const escala = escalaDaMarca(tema.corMarca, papel);
  const paleta = paletaDoPapel(papel);
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
          <Sobrescrito>Cor de fundo</Sobrescrito>
          <p className="-mt-1.5 text-[12.5px] text-tinta-45">
            Escolher um fundo escuro vira modo escuro inteiro: as tintas, as bordas e a
            escala da marca são recalculadas contra ele.
          </p>

          <div className="flex flex-wrap gap-2">
            {PAPEIS_SUGERIDOS.map((cor) => (
              <button
                key={cor}
                onClick={() => onMudar({ tema: { ...loja.tema, corPapel: cor } })}
                aria-label={`Fundo ${cor}`}
                aria-pressed={papel === cor}
                className="flex h-11 w-11 items-center justify-center border border-borda-forte"
                style={{ background: cor, borderRadius: "var(--canto-m)", color: textoSobre(cor) }}
              >
                {papel === cor && <Check size={17} strokeWidth={3} />}
              </button>
            ))}

            <label
              className="flex h-11 w-11 cursor-pointer items-center justify-center border border-dashed border-borda-forte text-tinta-45"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <Search size={16} />
              <input
                type="color"
                value={papel}
                onChange={(e) => onMudar({ tema: { ...loja.tema, corPapel: e.target.value } })}
                className="sr-only"
              />
            </label>
          </div>

          {/* Prévia com contraste medido: o lojista vê o número, não só a cor. */}
          <div
            className="flex items-center justify-between gap-3 border border-borda-forte px-4 py-3"
            style={{ background: paleta.papel, borderRadius: "var(--canto-m)" }}
          >
            <span className="min-w-0">
              <span className="block text-[14px] font-bold" style={{ color: paleta.tintas.tinta }}>
                {loja.nome}
              </span>
              <span className="block text-[12px]" style={{ color: paleta.tintas["tinta-45"] }}>
                texto secundário
              </span>
            </span>
            <span
              className="shrink-0 px-3 py-2 text-[12.5px] font-bold"
              style={{
                background: escala["500"],
                color: textoSobreMarca(loja.tema.corMarca),
                borderRadius: "var(--canto-m)",
              }}
            >
              Botão
            </span>
          </div>
          <p className="num-tab -mt-1 text-[11.5px] text-tinta-45">
            Contraste do texto: {contrasteEntre(paleta.tintas.tinta, paleta.papel).toFixed(1)}:1 ·
            secundário {contrasteEntre(paleta.tintas["tinta-45"], paleta.papel).toFixed(1)}:1
          </p>
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
                { valor: "pilula", nome: "Pílula" },
              ],
              padrao: "suave",
            }}
            valor={loja.tema.canto}
            onMudar={(v) => onMudar({ tema: { ...loja.tema, canto: v as never } })}
            imagensDisponiveis={[]}
          />
        </section>

        <section className="flex flex-col gap-3">
          <Sobrescrito>Botões</Sobrescrito>
          <ControleCampo
            campo={{
              tipo: "escolha",
              rotulo: "",
              opcoes: [
                { valor: "solido", nome: "Cheio" },
                { valor: "contorno", nome: "Contorno" },
                { valor: "suave", nome: "Suave" },
              ],
              padrao: "solido",
            }}
            valor={tema.estiloBotao}
            onMudar={(v) => onMudar({ tema: { ...loja.tema, estiloBotao: v as never } })}
            imagensDisponiveis={[]}
          />
        </section>

        <section className="flex flex-col gap-3">
          <Sobrescrito>Tamanho do texto</Sobrescrito>
          <ControleCampo
            campo={{
              tipo: "escolha",
              rotulo: "",
              opcoes: [
                { valor: "pequeno", nome: "Menor" },
                { valor: "normal", nome: "Normal" },
                { valor: "grande", nome: "Maior" },
              ],
              padrao: "normal",
            }}
            valor={tema.escalaTexto}
            onMudar={(v) => onMudar({ tema: { ...loja.tema, escalaTexto: v as never } })}
            imagensDisponiveis={[]}
          />
        </section>

        <section className="flex flex-col gap-3">
          <Sobrescrito>Profundidade</Sobrescrito>
          <ControleCampo
            campo={{
              tipo: "escolha",
              rotulo: "",
              opcoes: [
                { valor: "plana", nome: "Plana" },
                { valor: "suave", nome: "Suave" },
                { valor: "elevada", nome: "Elevada" },
              ],
              padrao: "suave",
            }}
            valor={tema.sombra}
            onMudar={(v) => onMudar({ tema: { ...loja.tema, sombra: v as never } })}
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
