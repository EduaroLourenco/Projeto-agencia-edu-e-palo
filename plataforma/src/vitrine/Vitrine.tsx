import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, LayoutGrid, ShoppingBag, Store } from "lucide-react";
import type { ClienteIdentificado, Loja, Oferta, TipoPagina } from "../nucleo/tipos";
import { ProvedorSacola, useSacola } from "../nucleo/sacola";
import { montarResumo } from "../nucleo/resumo";
import { modulosAtivos } from "../nucleo/registro";
import { aplicarTema, garantirFontes } from "../nucleo/tema";
import { Botao, Preco } from "../design/Primitivos";
import { ProvedorVitrine } from "./contexto";
import { Montador } from "./Montador";
import { FolhaAdicionar } from "./FolhaAdicionar";
import { Checkout } from "./Checkout";
import type { BlocoNaPagina } from "../nucleo/tipos";

/** O estúdio usa isto pra pôr a moldura de edição em volta de cada bloco. */
type EnvolverBloco = (
  b: BlocoNaPagina,
  conteudo: React.ReactNode,
  ehAncora: boolean,
) => React.ReactNode;

/**
 * A casca da loja.
 *
 * Mobile-first de verdade: a ação principal mora na barra de baixo, na zona
 * do polegar, e as folhas sobem de baixo. No desktop a loja fica numa coluna
 * central — B2B se usa muito no celular, e forçar um layout largo só pra
 * ocupar a tela piora os dois.
 */

function VitrineInterna({
  loja,
  paginaInicial = "inicio",
  editando = false,
  envolverBloco,
}: {
  loja: Loja;
  paginaInicial?: TipoPagina;
  editando?: boolean;
  envolverBloco?: EnvolverBloco;
}) {
  const { linhas, adicionar } = useSacola();
  const [pagina, setPagina] = useState<TipoPagina>(paginaInicial);
  const [ofertaAberta, setOfertaAberta] = useState<Oferta | null>(null);
  const [paraAdicionar, setParaAdicionar] = useState<Oferta | null>(null);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [cliente, setCliente] = useState<ClienteIdentificado | undefined>();

  const resumo = useMemo(() => montarResumo(linhas, loja, cliente), [linhas, loja, cliente]);

  // Trocar de página volta o scroll pro topo. Sem isso, você chega na
  // sacola olhando o meio dela.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pagina, ofertaAberta?.id]);

  const irPara = useCallback((p: TipoPagina) => {
    setOfertaAberta(null);
    setPagina(p);
  }, []);

  const abrirOferta = useCallback((o: Oferta) => {
    setOfertaAberta(o);
    setPagina("oferta");
  }, []);

  const somar = useCallback(
    (oferta: Oferta, quantidade: number) => {
      if (quantidade === 0) return;
      const atual = linhas.find((l) => l.ofertaId === oferta.id);
      if (quantidade < 0 && atual) {
        const nova = atual.quantidade + quantidade;
        if (nova <= 0) return;
      }
      adicionar(oferta.id, {}, quantidade);
    },
    [adicionar, linhas],
  );

  const quantidadeNaSacola = useCallback(
    (ofertaId: string) => linhas.filter((l) => l.ofertaId === ofertaId).reduce((a, l) => a + l.quantidade, 0),
    [linhas],
  );

  const valorVitrine = useMemo(
    () => ({
      loja,
      resumo,
      editando,
      irPara,
      abrirOferta,
      abrirAdicionar: setParaAdicionar,
      somar,
      quantidadeNaSacola,
    }),
    [loja, resumo, editando, irPara, abrirOferta, somar, quantidadeNaSacola],
  );

  const ofertasAtivas = useMemo(() => loja.ofertas.filter((o) => o.ativa), [loja.ofertas]);
  const mostrarBarra = !editando && pagina !== "confirmacao" && resumo.totalItens > 0;

  return (
    <ProvedorVitrine valor={valorVitrine}>
      <div className={`mx-auto flex w-full max-w-lg flex-col bg-papel ${editando ? "" : "min-h-dvh"}`}>
        <Cabecalho
          loja={loja}
          pagina={pagina}
          oferta={ofertaAberta}
          totalItens={resumo.totalItens}
          irPara={irPara}
          fixo={!editando}
        />

        <main className="flex-1 px-4 pb-8 pt-4" style={{ paddingBottom: mostrarBarra ? "6.5rem" : "2rem" }}>
          <Montador
            pagina={pagina}
            blocos={loja.paginas[pagina] ?? []}
            loja={loja}
            ofertas={ofertasAtivas}
            oferta={ofertaAberta ?? undefined}
            editando={editando}
            envolver={envolverBloco}
          />
        </main>

        {mostrarBarra && (
          <BarraInferior
            resumo={resumo}
            pagina={pagina}
            onVerSacola={() => irPara("sacola")}
            onFechar={() => setCheckoutAberto(true)}
          />
        )}

        <FolhaAdicionar
          oferta={paraAdicionar}
          loja={loja}
          onFechar={() => setParaAdicionar(null)}
          onAdicionar={(o, selecao, quantidade) => adicionar(o.id, selecao, quantidade)}
        />

        <Checkout
          aberto={checkoutAberto}
          onFechar={() => setCheckoutAberto(false)}
          loja={loja}
          resumo={resumo}
          onCliente={setCliente}
          onEnviado={() => {
            setCheckoutAberto(false);
            irPara("confirmacao");
          }}
        />
      </div>
    </ProvedorVitrine>
  );
}

function Cabecalho({
  loja,
  pagina,
  oferta,
  totalItens,
  irPara,
  fixo,
}: {
  loja: Loja;
  pagina: TipoPagina;
  oferta: Oferta | null;
  totalItens: number;
  irPara: (p: TipoPagina) => void;
  fixo: boolean;
}) {
  const naRaiz = pagina === "inicio";
  const titulo = pagina === "oferta" && oferta ? oferta.nome : pagina === "sacola" ? "Sua sacola" : loja.nome;

  return (
    <header
      className={`z-30 bg-papel/92 backdrop-blur-xl ${fixo ? "sticky top-0 shadow-[0_1px_0_var(--color-borda)]" : "border-b border-borda"}`}
    >
      <div className="flex items-center gap-1.5 px-3 py-2.5">
        {!naRaiz && (
          <button
            onClick={() => irPara(pagina === "oferta" ? "catalogo" : "inicio")}
            aria-label="Voltar"
            className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center text-tinta-70"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* O nome da loja é a marca. Um quadradinho com a inicial é o que
            todo template faz — e não identifica ninguém. */}
        <div className={`min-w-0 flex-1 ${naRaiz ? "pl-1" : ""}`}>
          <p
            className={`truncate font-display font-extrabold leading-none tracking-[var(--tr-secao)] ${
              naRaiz ? "text-[length:var(--t-titulo)]" : "text-[15px] font-bold tracking-[var(--tr-titulo)]"
            }`}
          >
            {titulo}
          </p>
          {naRaiz && (
            <p className="mt-1 flex items-center gap-1.5 truncate text-[length:var(--t-mini)] text-tinta-45">
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${loja.aberta ? "bg-ok" : "bg-tinta-25"}`}
              />
              {loja.aberta ? "Aberta agora" : "Fechada — pedidos ficam pra amanhã"}
            </p>
          )}
        </div>

        <button
          onClick={() => irPara("catalogo")}
          aria-label="Ver catálogo"
          className={`flex h-10 w-10 shrink-0 items-center justify-center ${
            pagina === "catalogo" ? "text-[var(--marca-600)]" : "text-tinta-45"
          }`}
        >
          <LayoutGrid size={19} />
        </button>

        <button
          onClick={() => irPara("sacola")}
          aria-label={`Sacola com ${totalItens} itens`}
          className="relative flex h-10 w-10 shrink-0 items-center justify-center text-tinta-70"
        >
          <ShoppingBag size={19} />
          {totalItens > 0 && (
            <span
              key={totalItens}
              className="num-tab anima-pipoca absolute right-0 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-tinta px-1 text-[10px] font-bold text-white"
            >
              {totalItens}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function BarraInferior({
  resumo,
  pagina,
  onVerSacola,
  onFechar,
}: {
  resumo: ReturnType<typeof montarResumo>;
  pagina: TipoPagina;
  onVerSacola: () => void;
  onFechar: () => void;
}) {
  const naSacola = pagina === "sacola";
  const bloqueado = !resumo.podeFechar;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-lg bg-papel/92 px-4 pt-3 shadow-[0_-1px_0_var(--color-borda),0_-12px_28px_-18px_rgba(22,19,15,0.25)] backdrop-blur-xl"
      style={{ paddingBottom: "max(0.85rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="num-tab rotulo text-tinta-45">
            {resumo.totalItens} {resumo.totalItens === 1 ? "item" : "itens"}
          </p>
          <div className="mt-1">
            <Preco valor={resumo.total} tamanho="m" />
          </div>
        </div>

        <Botao
          onClick={naSacola ? onFechar : onVerSacola}
          disabled={naSacola && bloqueado}
          className="min-w-[52%]"
        >
          {naSacola ? (bloqueado ? "Corrija os avisos" : "Fechar pedido") : "Ver a sacola"}
        </Botao>
      </div>
    </div>
  );
}

/** Ponto de entrada: garante tema, fontes e o provedor de sacola. */
export function Vitrine({
  loja,
  paginaInicial,
  editando,
  envolverBloco,
}: {
  loja: Loja;
  paginaInicial?: TipoPagina;
  editando?: boolean;
  envolverBloco?: EnvolverBloco;
}) {
  const raiz = useRef<HTMLDivElement>(null);

  /**
   * O tema é pintado no contêiner da loja, não no documento.
   *
   * No estúdio a loja é uma prévia dentro de uma página que tem interface
   * própria. Quando o papel virou variável, pintar o documento inteiro
   * deixava o editor escuro junto com a loja escura — e os controles
   * sumiam. Fora do estúdio, o corpo da página acompanha à parte.
   */
  useEffect(() => {
    if (raiz.current) aplicarTema(raiz.current, loja.tema);
    garantirFontes(loja.tema.fontes);
  }, [loja.tema]);

  useEffect(() => {
    if (editando || !raiz.current) return;
    const anterior = document.body.style.background;
    document.body.style.background = getComputedStyle(raiz.current).getPropertyValue("--color-papel");
    return () => {
      document.body.style.background = anterior;
    };
  }, [editando, loja.tema]);

  // Um módulo pode ter sido desligado depois que a loja foi salva.
  const lojaSegura = useMemo(
    () => ({ ...loja, modulos: loja.modulos.filter((id) => modulosAtivos([id]).length > 0) }),
    [loja],
  );

  return (
    <ProvedorSacola slug={loja.slug}>
      {/* `contents` não cria caixa: serve só de dono das variáveis do tema. */}
      <div ref={raiz} className="contents">
        <VitrineInterna
          loja={lojaSegura}
          paginaInicial={paginaInicial}
          editando={editando}
          envolverBloco={envolverBloco}
        />
      </div>
    </ProvedorSacola>
  );
}

export { Store };
