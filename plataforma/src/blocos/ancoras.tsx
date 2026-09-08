import { useMemo, useState } from "react";
import {
  Anchor,
  Check,
  Images,
  Layers,
  LayoutGrid,
  Rows3,
  Search,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import type { DefinicaoBloco, PropsBloco } from "../nucleo/tipos";
import { modulosAtivos } from "../nucleo/registro";
import { formatarReal } from "../nucleo/preco";
import { useSacola } from "../nucleo/sacola";
import { Aviso, Botao, Chip, Entrada, Preco as PrecoTipografico, Sobrescrito, Stepper } from "../design/Primitivos";
import { CartaoOferta, Foto, LinhaOferta, filtrarOfertas } from "./pecas";
import { useVitrine } from "../vitrine/contexto";

/* ============================================================
   CATÁLOGO — os dois modos de ver

   Vitrine pra descobrir, Lista pra recomprar. A chave fica no
   topo e o modo escolhido é lembrado.
   ============================================================ */

const CHAVE_MODO = "plataforma:modo-catalogo";

function CatalogoLista({ props, ofertas }: PropsBloco<{ mostrarBusca: boolean; modoPadrao: string }>) {
  const [modo, setModo] = useState<string>(() => {
    try {
      return localStorage.getItem(CHAVE_MODO) ?? props.modoPadrao ?? "vitrine";
    } catch {
      return props.modoPadrao ?? "vitrine";
    }
  });
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  function trocarModo(novo: string) {
    setModo(novo);
    try {
      localStorage.setItem(CHAVE_MODO, novo);
    } catch {
      /* sem persistir é melhor que travar */
    }
  }

  const categorias = useMemo(() => {
    const set = new Set<string>();
    ofertas.filter((o) => o.ativa).forEach((o) => o.categorias.forEach((c) => set.add(c)));
    return ["Todas", ...set];
  }, [ofertas]);

  const semAcento = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const lista = useMemo(() => {
    const termo = semAcento(busca.trim());
    return ofertas
      .filter((o) => o.ativa)
      .filter((o) => categoria === "Todas" || o.categorias.includes(categoria))
      .filter((o) => !termo || semAcento(`${o.nome} ${o.resumo ?? ""}`).includes(termo));
  }, [ofertas, categoria, busca]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {props.mostrarBusca && (
          <div className="relative min-w-0 flex-1">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-45" />
            <Entrada
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar item ou código"
              aria-label="Buscar"
              className="pl-9"
            />
          </div>
        )}

        {/* A chave dos dois modos. */}
        <div className="flex shrink-0 border border-borda-forte bg-papel p-0.5" style={{ borderRadius: "var(--canto-m)" }}>
          {[
            { valor: "vitrine", icone: LayoutGrid, rotulo: "Ver em fotos" },
            { valor: "lista", icone: Rows3, rotulo: "Ver em lista" },
          ].map(({ valor, icone: Icone, rotulo }) => (
            <button
              key={valor}
              onClick={() => trocarModo(valor)}
              aria-label={rotulo}
              aria-pressed={modo === valor}
              className={`flex h-[42px] w-[42px] items-center justify-center transition ${
                modo === valor ? "bg-tinta text-white" : "text-tinta-45"
              }`}
              style={{ borderRadius: "calc(var(--canto-m) - 2px)" }}
            >
              <Icone size={17} />
            </button>
          ))}
        </div>
      </div>

      {categorias.length > 2 && (
        <div className="sem-barra -mx-1 flex gap-2 overflow-x-auto px-1">
          {categorias.map((c) => (
            <Chip key={c} ativo={c === categoria} onClick={() => setCategoria(c)}>
              {c}
            </Chip>
          ))}
        </div>
      )}

      <p className="num-tab rotulo text-tinta-45">
        {lista.length} {lista.length === 1 ? "item" : "itens"}
      </p>

      {lista.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[14px] font-semibold">Nada com esse filtro</p>
          <p className="mt-1 text-[13px] text-tinta-45">Tente outra palavra ou volte pra "Todas".</p>
        </div>
      ) : modo === "lista" ? (
        <div className="flex flex-col">
          {lista.map((o) => (
            <LinhaOferta key={o.id} oferta={o} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-6 sm:grid-cols-3">
          {lista.map((o, i) => (
            <CartaoOferta key={o.id} oferta={o} prioridade={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}

export const blocoCatalogoLista: DefinicaoBloco<{ mostrarBusca: boolean; modoPadrao: string }> = {
  tipo: "catalogo-lista",
  nome: "Lista do catálogo",
  descricao: "Busca, filtro e os dois modos de ver.",
  paginas: ["catalogo"],
  ancora: true,
  icone: Layers,
  campos: {
    mostrarBusca: { tipo: "simNao", rotulo: "Mostrar busca", padrao: true },
    modoPadrao: {
      tipo: "escolha",
      rotulo: "Começa em",
      padrao: "vitrine",
      opcoes: [
        { valor: "vitrine", nome: "Fotos" },
        { valor: "lista", nome: "Lista compacta" },
      ],
    },
  },
  Componente: CatalogoLista,
};

/* ============================================================
   PÁGINA DA OFERTA — as três âncoras
   ============================================================ */

function OfertaGaleria({ oferta }: PropsBloco<Record<string, never>>) {
  const [ativa, setAtiva] = useState(0);
  if (!oferta) return null;
  const midia = oferta.midia.length ? oferta.midia : [];

  if (!midia.length) return <div className="aspect-square w-full bg-papel-3" style={{ borderRadius: "var(--canto-g)" }} />;

  return (
    <div className="flex flex-col gap-2">
      <div
        onScroll={(e) => setAtiva(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="sem-barra flex snap-x snap-mandatory overflow-x-auto"
        style={{ borderRadius: "var(--canto-g)" }}
      >
        {midia.map((m, i) => (
          <img
            key={m.url}
            src={m.url}
            alt={m.alt}
            width={m.largura}
            height={m.altura}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className="aspect-square w-full shrink-0 snap-center bg-papel-3 object-cover"
          />
        ))}
      </div>

      {midia.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {midia.map((m, i) => (
            <span
              key={m.url}
              className={`h-1.5 rounded-full transition-all ${i === ativa ? "w-5 bg-[var(--marca-grafico)]" : "w-1.5 bg-tinta-25"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const blocoOfertaGaleria: DefinicaoBloco<Record<string, never>> = {
  tipo: "oferta-galeria",
  nome: "Fotos do item",
  descricao: "As fotos, deslizando.",
  paginas: ["oferta"],
  ancora: true,
  icone: Images,
  campos: {},
  Componente: OfertaGaleria,
};

function OfertaCabecalho({ oferta }: PropsBloco<Record<string, never>>) {
  if (!oferta) return null;
  return (
    <div className="flex flex-col gap-2">
      {oferta.categorias.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {oferta.categorias.map((c) => (
            <span key={c} className="rotulo inline-flex items-center gap-1 text-tinta-45">
              <Tag size={10} />
              {c}
            </span>
          ))}
        </div>
      )}
      <h1 className="font-display text-[length:var(--t-secao)] font-extrabold leading-[1.1] tracking-[var(--tr-secao)]">
        {oferta.nome}
      </h1>
      {oferta.resumo && (
        <p className="text-[length:var(--t-corpo)] leading-relaxed text-tinta-70">{oferta.resumo}</p>
      )}
      <div className="pt-1">
        <PrecoTipografico
          valor={oferta.precoBase}
          tamanho="gg"
          sufixo={oferta.tipo === "servico" ? "por sessão" : undefined}
        />
      </div>
    </div>
  );
}

export const blocoOfertaCabecalho: DefinicaoBloco<Record<string, never>> = {
  tipo: "oferta-cabecalho",
  nome: "Nome e preço",
  descricao: "Identificação do item.",
  paginas: ["oferta"],
  ancora: true,
  icone: Anchor,
  campos: {},
  Componente: OfertaCabecalho,
};

/**
 * COMPRAR — a âncora que não sai.
 *
 * O configurador (tamanho, horário, profissional) vem do módulo ligado.
 * Este bloco não sabe o que está escolhendo: só pergunta ao módulo se a
 * escolha está completa antes de liberar o botão.
 */
function OfertaComprar({ oferta, loja }: PropsBloco<{ rotulo: string }>) {
  const { adicionar } = useSacola();
  const { irPara } = useVitrine();
  const [selecao, setSelecao] = useState<Record<string, unknown>>({});
  const [quantidade, setQuantidade] = useState(1);
  const [somado, setSomado] = useState(false);

  const configurador = useMemo(
    () => (oferta ? modulosAtivos(loja.modulos).find((m) => m.configurador?.aplicaA(oferta))?.configurador : undefined),
    [oferta, loja.modulos],
  );

  if (!oferta) return null;
  const completo = configurador ? configurador.completo(oferta, selecao) : true;

  return (
    <div className="flex flex-col gap-4">
      {configurador && (
        <configurador.Componente
          oferta={oferta}
          selecao={selecao}
          definir={(patch) => setSelecao((prev) => ({ ...prev, ...patch }))}
          loja={loja}
        />
      )}

      <div className="flex items-center gap-3">
        <Stepper valor={quantidade} onMudar={setQuantidade} min={1} />
        <Botao
          largo
          disabled={!completo}
          onClick={() => {
            adicionar(oferta.id, selecao, quantidade);
            setSomado(true);
            setTimeout(() => setSomado(false), 2200);
          }}
        >
          {somado ? (
            <>
              <Check size={17} strokeWidth={2.6} /> Na sacola
            </>
          ) : (
            <>
              <ShoppingBag size={17} /> {completo ? "Adicionar" : "Escolha as opções"}
            </>
          )}
        </Botao>
      </div>

      {somado && (
        <button onClick={() => irPara("sacola")} className="text-[13.5px] font-semibold text-[var(--marca-600)]">
          Ver a sacola →
        </button>
      )}
    </div>
  );
}

export const blocoOfertaComprar: DefinicaoBloco<{ rotulo: string }> = {
  tipo: "oferta-comprar",
  nome: "Escolha e botão de comprar",
  descricao: "As opções do item e o botão. Não pode ser removido.",
  paginas: ["oferta"],
  ancora: true,
  icone: ShoppingBag,
  campos: {
    rotulo: { tipo: "texto", rotulo: "Texto do botão", padrao: "Adicionar" },
  },
  Componente: OfertaComprar,
};

/* ============================================================
   SACOLA — onde o erro morre antes de virar pedido
   ============================================================ */

function SacolaItens({ loja }: PropsBloco<Record<string, never>>) {
  const { definirQuantidade, remover } = useSacola();
  const { resumo, irPara } = useVitrine();

  if (!resumo.linhas.length) {
    return (
      <div className="py-14 text-center">
        <ShoppingBag size={30} className="mx-auto text-tinta-25" strokeWidth={1.5} />
        <p className="mt-3 text-[15px] font-semibold">Sacola vazia</p>
        <p className="mt-1 text-[13px] text-tinta-45">Escolha os itens e eles aparecem aqui.</p>
        <Botao tom="contorno" onClick={() => irPara("catalogo")} className="mt-5">
          Ver o catálogo
        </Botao>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {resumo.avisos.length > 0 && (
        <div className="flex flex-col gap-2">
          {resumo.avisos.map((a, i) => (
            <Aviso key={i} nivel={a.nivel === "dica" ? "dica" : a.nivel}>
              {a.mensagem}
            </Aviso>
          ))}
        </div>
      )}

      <div className="flex flex-col divide-y divide-borda">
        {resumo.linhas.map((l) => (
          <div key={l.linha.chave} className="flex gap-3.5 py-4 first:pt-0">
            <Foto
              oferta={l.oferta}
              className="h-[72px] w-[72px] shrink-0"
              style={{ borderRadius: "var(--canto-m)" }}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[length:var(--t-menor)] font-medium leading-snug tracking-[var(--tr-corpo)]">
                    {l.oferta.nome}
                  </p>
                  {l.resumoSelecao && (
                    <p className="mt-0.5 text-[length:var(--t-mini)] text-tinta-45">{l.resumoSelecao}</p>
                  )}
                </div>
                <button
                  onClick={() => remover(l.linha.chave)}
                  aria-label={`Tirar ${l.oferta.nome}`}
                  className="-mr-1 -mt-1 flex h-8 w-8 shrink-0 items-center justify-center text-tinta-25 hover:text-erro"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Por que o preço é esse. É o que o comprador B2B pergunta. */}
              {l.preco.etapas.some((e) => e.rotulo !== "Arredondamento") && (
                <div className="flex flex-wrap gap-1">
                  {l.preco.etapas.filter((e) => e.rotulo !== "Arredondamento").map((e, i) => (
                    <span key={i} className="bg-ok-fraco px-1.5 py-0.5 text-[11px] font-semibold text-ok" style={{ borderRadius: "4px" }}>
                      {e.rotulo}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between gap-2">
                <Stepper valor={l.linha.quantidade} onMudar={(n) => definirQuantidade(l.linha.chave, n)} compacto />
                <div className="text-right">
                  <PrecoTipografico valor={l.subtotal} tamanho="p" />
                  <p className="num-tab mt-0.5 text-[11px] text-tinta-45">
                    {formatarReal(l.preco.unitario)}/un
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between border-t-2 border-tinta pt-3.5">
        <span className="num-tab rotulo text-tinta-45">
          {resumo.totalItens} {resumo.totalItens === 1 ? "item" : "itens"}
        </span>
        <PrecoTipografico valor={resumo.total} tamanho="g" />
      </div>

      <p className="text-[12px] text-tinta-45">
        {loja.nome} confirma disponibilidade e o valor final pelo WhatsApp antes de você pagar.
      </p>
    </div>
  );
}

export const blocoSacolaItens: DefinicaoBloco<Record<string, never>> = {
  tipo: "sacola-itens",
  nome: "Itens da sacola",
  descricao: "O que está na sacola, com os avisos.",
  paginas: ["sacola"],
  ancora: true,
  icone: ShoppingBag,
  campos: {},
  Componente: SacolaItens,
};

/* ============================================================
   CONFIRMAÇÃO
   ============================================================ */

function ConfirmacaoRecibo({ props, ofertas }: PropsBloco<{ titulo: string; texto: string }>) {
  const { irPara } = useVitrine();
  const sugestoes = useMemo(() => filtrarOfertas(ofertas, "destaques", "", 4), [ofertas]);

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <span
          className="mx-auto flex h-14 w-14 items-center justify-center bg-ok-fraco text-ok"
          style={{ borderRadius: "999px" }}
        >
          <Check size={26} strokeWidth={2.5} />
        </span>
        <h1 className="mt-4 font-display text-[length:var(--t-secao)] font-extrabold leading-[1.1] tracking-[var(--tr-secao)]">
          {props.titulo || "Pedido enviado"}
        </h1>
        <p className="mx-auto mt-2.5 max-w-sm text-[length:var(--t-corpo)] leading-relaxed text-tinta-70">
          {props.texto || "Abrimos o WhatsApp com o pedido pronto. Confirme o envio na conversa."}
        </p>
      </div>

      <Botao tom="contorno" largo onClick={() => irPara("catalogo")}>
        Continuar comprando
      </Botao>

      {sugestoes.length > 0 && (
        <div>
          <div className="mb-3">
            <Sobrescrito>Costumam pedir junto</Sobrescrito>
          </div>
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-6">
            {sugestoes.map((o) => (
              <CartaoOferta key={o.id} oferta={o} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const blocoConfirmacaoRecibo: DefinicaoBloco<{ titulo: string; texto: string }> = {
  tipo: "confirmacao-recibo",
  nome: "Confirmação",
  descricao: "O que acontece depois do pedido.",
  paginas: ["confirmacao"],
  ancora: true,
  icone: Check,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Pedido enviado" },
    texto: { tipo: "texto", rotulo: "Texto", linhas: 3, padrao: "Abrimos o WhatsApp com o pedido pronto. Confirme o envio na conversa." },
  },
  Componente: ConfirmacaoRecibo,
};
