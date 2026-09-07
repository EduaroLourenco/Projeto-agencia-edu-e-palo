import { useMemo } from "react";
import { LayoutGrid, Rows3, Tags, RotateCcw, GalleryHorizontalEnd } from "lucide-react";
import type { DefinicaoBloco, PropsBloco } from "../nucleo/tipos";
import { CartaoOferta, LinhaOferta, TituloBloco, VazioNoEstudio, filtrarOfertas } from "./pecas";
import { useVitrine } from "../vitrine/contexto";
import { ultimoPedido } from "../nucleo/pedidos";
import { useSacola } from "../nucleo/sacola";
import { formatarReal } from "../nucleo/preco";

const CAMPO_REGRA = {
  tipo: "escolha" as const,
  rotulo: "O que mostrar",
  padrao: "todas",
  opcoes: [
    { valor: "todas", nome: "Tudo" },
    { valor: "destaques", nome: "Só os destaques" },
    { valor: "categoria", nome: "Uma categoria" },
    { valor: "produtos", nome: "Só produtos" },
    { valor: "servicos", nome: "Só serviços" },
  ],
};

/* ============================================================
   GRADE DE OFERTAS
   ============================================================ */

interface PropsGrade {
  titulo: string;
  regra: string;
  categoria: string;
  limite: number;
  colunas: string;
}

function GradeOfertas({ props, ofertas, editando }: PropsBloco<PropsGrade>) {
  const { irPara } = useVitrine();
  const lista = useMemo(
    () => filtrarOfertas(ofertas, props.regra, props.categoria, props.limite),
    [ofertas, props.regra, props.categoria, props.limite],
  );

  if (!lista.length) return editando ? <VazioNoEstudio>Nenhum item bate com este filtro.</VazioNoEstudio> : null;
  const colunas = props.colunas === "3" ? "grid-cols-3" : "grid-cols-2";

  return (
    <div>
      <TituloBloco titulo={props.titulo} acao={{ rotulo: "Ver tudo", onClick: () => irPara("catalogo") }} />
      <div className={`grid gap-3 ${colunas}`}>
        {lista.map((o, i) => (
          <CartaoOferta key={o.id} oferta={o} prioridade={i < 4} />
        ))}
      </div>
    </div>
  );
}

export const blocoGradeOfertas: DefinicaoBloco<PropsGrade> = {
  tipo: "grade-ofertas",
  nome: "Grade de itens",
  descricao: "Foto grande, pra descobrir.",
  paginas: ["inicio", "catalogo", "oferta", "confirmacao"],
  icone: LayoutGrid,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Destaques" },
    regra: CAMPO_REGRA,
    categoria: { tipo: "texto", rotulo: "Categoria", padrao: "", dica: 'Só quando "uma categoria" estiver escolhido.' },
    limite: { tipo: "numero", rotulo: "Quantos mostrar", padrao: 6, min: 0, max: 60, sufixo: "itens" },
    colunas: {
      tipo: "escolha",
      rotulo: "Por linha",
      padrao: "2",
      opcoes: [
        { valor: "2", nome: "2 por linha" },
        { valor: "3", nome: "3 por linha" },
      ],
    },
  },
  Componente: GradeOfertas,
};

/* ============================================================
   CARROSSEL DE OFERTAS
   ============================================================ */

function CarrosselOfertas({ props, ofertas, editando }: PropsBloco<Omit<PropsGrade, "colunas">>) {
  const lista = useMemo(
    () => filtrarOfertas(ofertas, props.regra, props.categoria, props.limite),
    [ofertas, props.regra, props.categoria, props.limite],
  );
  if (!lista.length) return editando ? <VazioNoEstudio>Nenhum item bate com este filtro.</VazioNoEstudio> : null;

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div className="sem-barra -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1">
        {lista.map((o) => (
          <div key={o.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]">
            <CartaoOferta oferta={o} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const blocoCarrosselOfertas: DefinicaoBloco<Omit<PropsGrade, "colunas">> = {
  tipo: "carrossel-ofertas",
  nome: "Carrossel de itens",
  descricao: "Desliza com o dedo. Ocupa menos tela que a grade.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: GalleryHorizontalEnd,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Novidades" },
    regra: CAMPO_REGRA,
    categoria: { tipo: "texto", rotulo: "Categoria", padrao: "" },
    limite: { tipo: "numero", rotulo: "Quantos mostrar", padrao: 10, min: 0, max: 40, sufixo: "itens" },
  },
  Componente: CarrosselOfertas,
};

/* ============================================================
   LISTA RÁPIDA

   O bloco que separa a gente de todo mundo. Comprar 40 itens numa
   grade de fotos são 40 telas; aqui cabem 12 na primeira.
   ============================================================ */

interface PropsLista {
  titulo: string;
  regra: string;
  categoria: string;
  limite: number;
  esconderNaSacola: boolean;
}

function ListaRapida({ props, ofertas, editando }: PropsBloco<PropsLista>) {
  const { resumo } = useVitrine();
  const lista = useMemo(() => {
    const base = filtrarOfertas(ofertas, props.regra, props.categoria, 0);
    // "Esqueceu algo?" não pode sugerir o que a pessoa não esqueceu.
    const naSacola = new Set(resumo.linhas.map((l) => l.oferta.id));
    const filtrada = props.esconderNaSacola ? base.filter((o) => !naSacola.has(o.id)) : base;
    return props.limite > 0 ? filtrada.slice(0, props.limite) : filtrada;
  }, [ofertas, props.regra, props.categoria, props.limite, props.esconderNaSacola, resumo.linhas]);
  if (!lista.length) return editando ? <VazioNoEstudio>Nenhum item bate com este filtro.</VazioNoEstudio> : null;

  return (
    <div>
      <TituloBloco titulo={props.titulo} subtitulo="Some a quantidade sem sair daqui" />
      <div className="border border-borda bg-papel px-3.5" style={{ borderRadius: "var(--canto-g)" }}>
        {lista.map((o) => (
          <LinhaOferta key={o.id} oferta={o} />
        ))}
      </div>
    </div>
  );
}

export const blocoListaRapida: DefinicaoBloco<PropsLista> = {
  tipo: "lista-rapida",
  nome: "Lista rápida",
  descricao: "Linha compacta com mais e menos. Pra quem recompra.",
  paginas: ["inicio", "catalogo", "oferta", "sacola"],
  icone: Rows3,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Compre de novo" },
    regra: CAMPO_REGRA,
    categoria: { tipo: "texto", rotulo: "Categoria", padrao: "" },
    limite: { tipo: "numero", rotulo: "Quantos mostrar", padrao: 12, min: 0, max: 80, sufixo: "itens" },
    esconderNaSacola: {
      tipo: "simNao",
      rotulo: "Esconder o que já está na sacola",
      padrao: false,
      dica: "Ligue quando o bloco for uma sugestão de \"esqueceu algo?\".",
    },
  },
  Componente: ListaRapida,
};

/* ============================================================
   FAIXA DE CATEGORIAS
   ============================================================ */

function FaixaCategorias({ props, ofertas, editando }: PropsBloco<{ titulo: string; estilo: string }>) {
  const { irPara } = useVitrine();
  const categorias = useMemo(() => {
    const set = new Set<string>();
    ofertas.filter((o) => o.ativa).forEach((o) => o.categorias.forEach((c) => set.add(c)));
    return [...set];
  }, [ofertas]);

  if (!categorias.length) return editando ? <VazioNoEstudio>Aparece quando o catálogo tiver categorias.</VazioNoEstudio> : null;

  if (props.estilo === "cartoes") {
    const capa = (cat: string) => ofertas.find((o) => o.categorias.includes(cat))?.midia[0];
    return (
      <div>
        <TituloBloco titulo={props.titulo} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categorias.map((c) => {
            const m = capa(c);
            return (
              <button
                key={c}
                onClick={() => irPara("catalogo")}
                className="relative aspect-[4/3] overflow-hidden text-left"
                style={{ borderRadius: "var(--canto-g)" }}
              >
                {m ? (
                  <img src={m.url} alt="" width={m.largura} height={m.altura} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-papel-3" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 text-[13.5px] font-bold text-white">{c}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div className="sem-barra -mx-1 flex gap-2 overflow-x-auto px-1">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => irPara("catalogo")}
            className="min-h-[40px] shrink-0 whitespace-nowrap border border-borda bg-papel px-4 text-[13.5px] font-semibold text-tinta-70"
            style={{ borderRadius: "999px" }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

export const blocoFaixaCategorias: DefinicaoBloco<{ titulo: string; estilo: string }> = {
  tipo: "faixa-categorias",
  nome: "Categorias",
  descricao: "Os caminhos principais da loja.",
  paginas: ["inicio", "catalogo"],
  icone: Tags,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "" },
    estilo: {
      tipo: "escolha",
      rotulo: "Estilo",
      padrao: "pilulas",
      opcoes: [
        { valor: "pilulas", nome: "Pílulas que deslizam" },
        { valor: "cartoes", nome: "Cartões com foto" },
      ],
    },
  },
  Componente: FaixaCategorias,
};

/* ============================================================
   REPETIR ÚLTIMO PEDIDO

   O botão que o comprador B2B mais usa, e que quase nenhuma
   plataforma coloca na primeira tela.
   ============================================================ */

function RepetirPedido({ props, loja, editando }: PropsBloco<{ titulo: string }>) {
  const { substituir } = useSacola();
  const { irPara } = useVitrine();
  const pedido = useMemo(() => ultimoPedido(loja.slug), [loja.slug]);

  if (!pedido) {
    // No estúdio o lojista precisa ver o bloco pra saber que ele existe;
    // na loja de verdade, sem histórico não há o que repetir.
    return editando ? (
      <div className="border border-dashed border-borda-forte px-4 py-5 text-center text-[13px] text-tinta-45" style={{ borderRadius: "var(--canto-g)" }}>
        Aparece pra quem já fez um pedido nesta loja.
      </div>
    ) : null;
  }

  const quando = new Date(pedido.criadoEm).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  return (
    <button
      onClick={() => {
        substituir(pedido.linhas.map((l) => l.linha));
        irPara("sacola");
      }}
      className="flex w-full items-center gap-3.5 border border-borda bg-papel p-4 text-left transition hover:border-borda-forte"
      style={{ borderRadius: "var(--canto-g)" }}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center bg-[var(--marca-100)] text-[var(--marca-700)]"
        style={{ borderRadius: "var(--canto-m)" }}
      >
        <RotateCcw size={19} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-bold leading-tight">{props.titulo || "Repetir último pedido"}</span>
        <span className="num-tab mt-0.5 block text-[12.5px] text-tinta-45">
          {quando} · {pedido.linhas.length} {pedido.linhas.length === 1 ? "item" : "itens"} · {formatarReal(pedido.total)}
        </span>
      </span>
    </button>
  );
}

export const blocoRepetirPedido: DefinicaoBloco<{ titulo: string }> = {
  tipo: "repetir-pedido",
  nome: "Repetir último pedido",
  descricao: "Um toque e a sacola volta como no último pedido.",
  paginas: ["inicio", "catalogo", "sacola"],
  icone: RotateCcw,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Repetir último pedido" },
  },
  Componente: RepetirPedido,
};
