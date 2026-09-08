import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Lock,
  Palette,
  Plus,
  Redo2,
  Trash2,
  Undo2,
} from "lucide-react";
import type { BlocoNaPagina, DefinicaoBloco, Loja, TipoPagina } from "../nucleo/tipos";
import { bloco as buscarDefinicao, propsPadrao } from "../nucleo/registro";
import { publicar, salvarRascunho, temRascunho } from "../nucleo/loja";
import { ORDEM_PAGINAS, PAGINAS } from "../paginas/definicoes";
import { aplicarTema, garantirFontes } from "../nucleo/tema";
import { Botao } from "../design/Primitivos";
import { Vitrine } from "../vitrine/Vitrine";
import { CatalogoBlocos, FolhaPropriedades, FolhaTema } from "./Folhas";
import { useReordenar } from "./useReordenar";

/**
 * O ESTÚDIO
 *
 * Todo editor de loja que existe é feito pra desktop, com uma janelinha do
 * lado simulando o celular. Aqui é o contrário: um app de celular que edita
 * um app de celular. O que você toca é a loja de verdade, no tamanho de
 * verdade — porque é assim que você vai mostrar pro cliente, na mesa dele.
 */

const LIMITE_HISTORICO = 40;

export function Estudio({ lojaInicial }: { lojaInicial: Loja }) {
  const [historico, setHistorico] = useState<Loja[]>([lojaInicial]);
  const [posicao, setPosicao] = useState(0);
  const [pagina, setPagina] = useState<TipoPagina>("inicio");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [catalogoAberto, setCatalogoAberto] = useState(false);
  const [temaAberto, setTemaAberto] = useState(false);
  const [verComoCliente, setVerComoCliente] = useState(false);
  const [publicado, setPublicado] = useState(false);
  const [pendente, setPendente] = useState(() => temRascunho(lojaInicial.slug));

  const loja = historico[posicao];

  useEffect(() => {
    aplicarTema(document.documentElement, loja.tema);
    garantirFontes(loja.tema.fontes);
  }, [loja.tema]);

  /** Toda mudança entra no histórico e salva o rascunho — nunca publica. */
  const alterar = useCallback(
    (proxima: Loja) => {
      setHistorico((h) => [...h.slice(Math.max(0, posicao + 1 - LIMITE_HISTORICO), posicao + 1), proxima]);
      setPosicao((p) => Math.min(p + 1, LIMITE_HISTORICO - 1));
      salvarRascunho(proxima);
      setPendente(true);
      setPublicado(false);
    },
    [posicao],
  );

  const blocosDaPagina = loja.paginas[pagina] ?? [];

  const definirBlocos = useCallback(
    (novos: BlocoNaPagina[]) => alterar({ ...loja, paginas: { ...loja.paginas, [pagina]: novos } }),
    [alterar, loja, pagina],
  );

  function adicionar(def: DefinicaoBloco<never>, espaco: string) {
    const novo: BlocoNaPagina = {
      id: `b_${Date.now().toString(36)}`,
      tipo: def.tipo,
      props: { ...propsPadrao(def), __espaco: espaco },
    };
    definirBlocos([...blocosDaPagina, novo]);
    setEditandoId(novo.id);
  }

  function duplicar(id: string) {
    const alvo = blocosDaPagina.find((b) => b.id === id);
    if (!alvo) return;
    const copia = { ...alvo, id: `b_${Date.now().toString(36)}`, props: { ...alvo.props } };
    const i = blocosDaPagina.findIndex((b) => b.id === id);
    definirBlocos([...blocosDaPagina.slice(0, i + 1), copia, ...blocosDaPagina.slice(i + 1)]);
  }

  const emEdicao = blocosDaPagina.find((b) => b.id === editandoId) ?? null;

  /**
   * Âncora só existe na lista salva depois que alguém mexe nela. No primeiro
   * toque ela é materializada com os padrões, e a partir daí é um bloco
   * normal — só que sem alça de arrastar nem lixeira.
   */
  function abrirPropriedades(id: string) {
    if (!id.startsWith("ancora-")) {
      setEditandoId(id);
      return;
    }
    const tipo = id.slice("ancora-".length);
    const jaExiste = blocosDaPagina.find((b) => b.tipo === tipo);
    if (jaExiste) {
      setEditandoId(jaExiste.id);
      return;
    }
    const def = buscarDefinicao(tipo);
    if (!def) return;
    const novo: BlocoNaPagina = { id: `a_${tipo}`, tipo, props: propsPadrao(def) };
    definirBlocos([...blocosDaPagina, novo]);
    setEditandoId(novo.id);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-papel-2">
      {!verComoCliente && (
        <BarraSuperior
          loja={loja}
          pagina={pagina}
          setPagina={setPagina}
          podeDesfazer={posicao > 0}
          podeRefazer={posicao < historico.length - 1}
          onDesfazer={() => setPosicao((p) => Math.max(0, p - 1))}
          onRefazer={() => setPosicao((p) => Math.min(historico.length - 1, p + 1))}
        />
      )}

      <div className={verComoCliente ? "" : "px-2 pb-32 pt-2"}>
        <div
          className={verComoCliente ? "" : "overflow-hidden bg-papel shadow-sm ring-1 ring-borda"}
          style={verComoCliente ? undefined : { borderRadius: "16px" }}
        >
          <PreviaEditavel
            loja={loja}
            pagina={pagina}
            editando={!verComoCliente}
            blocos={blocosDaPagina}
            onDefinirBlocos={definirBlocos}
            onAbrirPropriedades={abrirPropriedades}
            onDuplicar={duplicar}
          />
        </div>
      </div>

      <BarraInferior
        verComoCliente={verComoCliente}
        pendente={pendente}
        publicado={publicado}
        onAdicionar={() => setCatalogoAberto(true)}
        onTema={() => setTemaAberto(true)}
        onAlternarVista={() => setVerComoCliente((v) => !v)}
        onPublicar={() => {
          publicar(loja);
          setPendente(false);
          setPublicado(true);
          setTimeout(() => setPublicado(false), 2600);
        }}
      />

      <CatalogoBlocos
        aberto={catalogoAberto}
        onFechar={() => setCatalogoAberto(false)}
        pagina={pagina}
        loja={loja}
        onEscolher={adicionar}
      />

      {emEdicao && (
        <FolhaPropriedades
          blocoNaPagina={emEdicao}
          loja={loja}
          pagina={pagina}
          onFechar={() => setEditandoId(null)}
          onMudar={(props) =>
            definirBlocos(blocosDaPagina.map((b) => (b.id === emEdicao.id ? { ...b, props } : b)))
          }
        />
      )}

      <FolhaTema
        aberto={temaAberto}
        onFechar={() => setTemaAberto(false)}
        loja={loja}
        onMudar={(patch) => alterar({ ...loja, ...patch })}
      />
    </div>
  );
}

/* ============================================================
   PRÉVIA COM MOLDURA DE EDIÇÃO
   ============================================================ */

function PreviaEditavel({
  loja,
  pagina,
  editando,
  blocos,
  onDefinirBlocos,
  onAbrirPropriedades,
  onDuplicar,
}: {
  loja: Loja;
  pagina: TipoPagina;
  editando: boolean;
  blocos: BlocoNaPagina[];
  onDefinirBlocos: (b: BlocoNaPagina[]) => void;
  onAbrirPropriedades: (id: string) => void;
  onDuplicar: (id: string) => void;
}) {
  const container = useRef<HTMLDivElement>(null);

  // Estável: sem isto o efeito de pointer se remove e recoloca a cada
  // render, no meio do arrasto.
  const aoSoltar = useCallback(
    (de: number, para: number) => {
      const copia = [...blocos];
      const [item] = copia.splice(de, 1);
      copia.splice(para, 0, item);
      onDefinirBlocos(copia);
    },
    [blocos, onDefinirBlocos],
  );

  const ids = useMemo(() => blocos.map((b) => b.id), [blocos]);
  const { arrastandoId, alvoIndice, iniciar } = useReordenar({ ids, container, onSoltar: aoSoltar });

  if (!editando) {
    return <Vitrine loja={loja} paginaInicial={pagina} />;
  }

  return (
    <div ref={container}>
      <Vitrine
        loja={loja}
        paginaInicial={pagina}
        editando
        envolverBloco={(b, conteudo, ehAncora) => {
          const indice = blocos.findIndex((x) => x.id === b.id);
          const arrastando = arrastandoId === b.id;
          const mostrarGuia = alvoIndice === indice && arrastandoId !== null && !arrastando;

          return (
            <>
              {mostrarGuia && <div className="my-1 h-1 rounded-full bg-[var(--marca-grafico)]" />}

              <div
                data-bloco={b.id}
                className={`relative transition-opacity ${arrastando ? "opacity-35" : ""}`}
              >
                {/* Barra de controles do bloco. Âncora mostra cadeado em vez
                    de alça: ela existe, mas não sai do lugar. */}
                <div className="mb-1 flex items-center gap-1">
                  {ehAncora ? (
                    <span className="flex items-center gap-1 bg-papel-3 px-2 py-1 text-[10.5px] font-bold uppercase tracking-wider text-tinta-45" style={{ borderRadius: "6px" }}>
                      <Lock size={10} />
                      fixo
                    </span>
                  ) : (
                    <button
                      onPointerDown={(e) => iniciar(e, b.id, indice)}
                      aria-label="Arrastar pra reordenar"
                      className="flex h-8 w-8 cursor-grab touch-none items-center justify-center text-tinta-25 active:cursor-grabbing"
                    >
                      <GripVertical size={16} />
                    </button>
                  )}

                  <div className="flex-1" />

                  {!ehAncora && (
                    <>
                      <button
                        onClick={() =>
                          onDefinirBlocos(blocos.map((x) => (x.id === b.id ? { ...x, oculto: !x.oculto } : x)))
                        }
                        aria-label={b.oculto ? "Mostrar" : "Esconder"}
                        className="flex h-8 w-8 items-center justify-center text-tinta-25 hover:text-tinta-70"
                      >
                        {b.oculto ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => onDuplicar(b.id)}
                        aria-label="Duplicar"
                        className="flex h-8 w-8 items-center justify-center text-tinta-25 hover:text-tinta-70"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => onDefinirBlocos(blocos.filter((x) => x.id !== b.id))}
                        aria-label="Apagar"
                        className="flex h-8 w-8 items-center justify-center text-tinta-25 hover:text-erro"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>

                {/* O alvo de toque é uma camada por cima, não um <button> em
                    volta. O bloco tem botões dentro dele ("Ver tudo", "+"), e
                    botão dentro de botão é HTML inválido: o navegador pode
                    tirar o de dentro do lugar e desmontar o layout. */}
                <div className="relative">
                  <div className={b.oculto ? "pointer-events-none opacity-40" : "pointer-events-none"}>
                    {conteudo}
                  </div>
                  <button
                    onClick={() => onAbrirPropriedades(b.id)}
                    aria-label="Editar este bloco"
                    className="absolute inset-0 cursor-pointer outline-2 outline-offset-4 outline-transparent transition-all hover:outline-[var(--marca-300)]"
                    style={{ borderRadius: "var(--canto-m)" }}
                  />
                </div>
              </div>
            </>
          );
        }}
      />
    </div>
  );
}

/* ============================================================
   BARRAS
   ============================================================ */

function BarraSuperior({
  loja,
  pagina,
  setPagina,
  podeDesfazer,
  podeRefazer,
  onDesfazer,
  onRefazer,
}: {
  loja: Loja;
  pagina: TipoPagina;
  setPagina: (p: TipoPagina) => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  onDesfazer: () => void;
  onRefazer: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-borda bg-papel/95 backdrop-blur">
      <div className="flex items-center gap-1 px-2 py-2">
        <Link to="/" aria-label="Voltar" className="flex h-10 w-10 items-center justify-center text-tinta-70">
          <ArrowLeft size={19} />
        </Link>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold leading-tight">{loja.nome}</p>
          <p className="text-[11px] text-tinta-45">Estúdio</p>
        </div>

        {/* Desfazer sempre à mão: mexer sem medo é o que faz a ferramenta
            ser gostosa de usar. */}
        <button
          onClick={onDesfazer}
          disabled={!podeDesfazer}
          aria-label="Desfazer"
          className="flex h-10 w-10 items-center justify-center text-tinta-70 disabled:text-tinta-12"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={onRefazer}
          disabled={!podeRefazer}
          aria-label="Refazer"
          className="flex h-10 w-10 items-center justify-center text-tinta-70 disabled:text-tinta-12"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div className="sem-barra flex gap-1.5 overflow-x-auto px-3 pb-2">
        {ORDEM_PAGINAS.map((p) => (
          <button
            key={p}
            onClick={() => setPagina(p)}
            aria-pressed={p === pagina}
            className={`min-h-[34px] shrink-0 whitespace-nowrap px-3 text-[12.5px] font-semibold transition ${
              p === pagina ? "bg-tinta text-white" : "bg-papel-3 text-tinta-70"
            }`}
            style={{ borderRadius: "999px" }}
          >
            {PAGINAS[p].nome}
          </button>
        ))}
      </div>
    </header>
  );
}

function BarraInferior({
  verComoCliente,
  pendente,
  publicado,
  onAdicionar,
  onTema,
  onAlternarVista,
  onPublicar,
}: {
  verComoCliente: boolean;
  pendente: boolean;
  publicado: boolean;
  onAdicionar: () => void;
  onTema: () => void;
  onAlternarVista: () => void;
  onPublicar: () => void;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg border-t border-borda bg-papel/95 px-3 pt-2.5 backdrop-blur"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-2">
        {!verComoCliente && (
          <>
            <button
              onClick={onAdicionar}
              aria-label="Adicionar bloco"
              className="flex h-12 w-12 shrink-0 items-center justify-center bg-tinta text-white"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <Plus size={21} />
            </button>
            <button
              onClick={onTema}
              aria-label="Aparência e recursos"
              className="flex h-12 w-12 shrink-0 items-center justify-center border border-borda-forte bg-papel text-tinta-70"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <Palette size={19} />
            </button>
          </>
        )}

        {/* Editando, a barra tem quatro coisas e 390px: "Ver como cliente"
            por extenso empurrava "Publicar" pra fora da tela. Na prévia
            sobra espaço, e aí o rótulo longo volta. */}
        <button
          onClick={onAlternarVista}
          aria-label={verComoCliente ? "Voltar a editar" : "Ver como cliente"}
          className="flex h-12 shrink-0 items-center gap-1.5 border border-borda-forte bg-papel px-3.5 text-[13px] font-semibold text-tinta-70"
          style={{ borderRadius: "var(--canto-m)" }}
        >
          {verComoCliente ? <EyeOff size={16} /> : <Eye size={16} />}
          {verComoCliente ? "Voltar a editar" : "Prévia"}
        </button>

        <div className="min-w-0 flex-1">
          <Botao largo onClick={onPublicar} disabled={!pendente && !publicado}>
            {publicado ? (
              <>
                <Check size={17} strokeWidth={2.6} /> No ar
              </>
            ) : pendente ? (
              "Publicar"
            ) : (
              "Publicado"
            )}
          </Botao>
        </div>
      </div>
    </div>
  );
}
