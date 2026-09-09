import { useMemo, useState } from "react";
import { Check, Copy, Package, Plus, Search, Sparkles, Trash2, Wrench } from "lucide-react";
import type { Loja, Oferta, TipoOferta } from "../nucleo/tipos";
import { modulosAtivos } from "../nucleo/registro";
import { formatarReal } from "../nucleo/preco";
import { Botao, Campo, Entrada, Folha, Sobrescrito } from "../design/Primitivos";
import { ControleCampo } from "../estudio/Controles";
import { Foto } from "../blocos/pecas";

/**
 * O cadastro de itens.
 *
 * É a peça que faltava pra isto ser um estúdio de loja e não uma
 * demonstração: antes, criar um produto era editar um arquivo TypeScript.
 *
 * O formulário é montado a partir do que os MÓDULOS declaram. Ligar
 * "Atacado" faz aparecer pedido mínimo e caixa fechada; ligar "Agenda" faz
 * aparecer duração e quem atende. Esta tela não conhece nenhum dos dois.
 */

function novaOferta(tipo: TipoOferta): Oferta {
  return {
    id: `item-${Date.now().toString(36)}`,
    tipo,
    nome: "",
    resumo: "",
    descricao: "",
    midia: [],
    categorias: [],
    precoBase: 0,
    ativa: true,
    destaque: false,
    dadosModulo: {},
  };
}

export function Catalogo({ loja, onMudar }: { loja: Loja; onMudar: (loja: Loja) => void }) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<"todos" | "produto" | "servico" | "inativos">("todos");
  const [editando, setEditando] = useState<Oferta | null>(null);
  const [novo, setNovo] = useState(false);

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return loja.ofertas.filter((o) => {
      if (filtro === "inativos" ? o.ativa : filtro !== "todos" && o.tipo !== filtro) return false;
      if (!termo) return true;
      return `${o.nome} ${o.categorias.join(" ")}`.toLowerCase().includes(termo);
    });
  }, [loja.ofertas, busca, filtro]);

  function salvar(oferta: Oferta) {
    const existe = loja.ofertas.some((o) => o.id === oferta.id);
    onMudar({
      ...loja,
      ofertas: existe ? loja.ofertas.map((o) => (o.id === oferta.id ? oferta : o)) : [oferta, ...loja.ofertas],
    });
    setEditando(null);
  }

  function apagar(id: string) {
    onMudar({ ...loja, ofertas: loja.ofertas.filter((o) => o.id !== id) });
    setEditando(null);
  }

  function duplicar(o: Oferta) {
    const copia = { ...o, id: `item-${Date.now().toString(36)}`, nome: `${o.nome} (cópia)` };
    onMudar({ ...loja, ofertas: [copia, ...loja.ofertas] });
    setEditando(copia);
  }

  const filtros = [
    ["todos", `Todos ${loja.ofertas.length}`],
    ["produto", "Produtos"],
    ["servico", "Serviços"],
    ["inativos", "Desligados"],
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      <Botao largo onClick={() => setNovo(true)}>
        <Plus size={18} strokeWidth={2.6} />
        Novo item
      </Botao>

      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta-25" />
        <Entrada
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou categoria"
          aria-label="Buscar item"
          className="pl-10"
        />
      </div>

      <div className="sem-barra -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {filtros.map(([id, nome]) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            aria-pressed={filtro === id}
            className={`num-tab min-h-[34px] shrink-0 whitespace-nowrap px-3 text-[12.5px] font-semibold ${
              filtro === id ? "bg-tinta text-white" : "bg-papel-3 text-tinta-70"
            }`}
            style={{ borderRadius: "999px" }}
          >
            {nome}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="py-14 text-center">
          <Package size={26} className="mx-auto text-tinta-25" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-semibold">
            {loja.ofertas.length === 0 ? "Catálogo vazio" : "Nada com esse filtro"}
          </p>
          <p className="mx-auto mt-1 max-w-xs text-[12.5px] leading-relaxed text-tinta-45">
            {loja.ofertas.length === 0
              ? "Toque em Novo item pra cadastrar o primeiro produto ou serviço."
              : "Troque o filtro ou limpe a busca."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {lista.map((o) => (
            <button
              key={o.id}
              onClick={() => setEditando(o)}
              className="flex items-center gap-3 border-b border-borda py-2.5 text-left last:border-b-0"
            >
              {o.midia[0] ? (
                <Foto oferta={o} className="h-12 w-12 shrink-0" style={{ borderRadius: "var(--canto-p)" }} />
              ) : (
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center bg-papel-3 text-tinta-25"
                  style={{ borderRadius: "var(--canto-p)" }}
                >
                  {o.tipo === "servico" ? <Wrench size={16} /> : <Package size={16} />}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[13.5px] font-semibold leading-tight">
                    {o.nome || "Sem nome"}
                  </span>
                  {o.destaque && <Sparkles size={12} className="shrink-0 text-[var(--marca-600)]" />}
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-tinta-45">
                  {o.categorias.join(", ") || "sem categoria"} · {o.tipo === "servico" ? "serviço" : "produto"}
                  {!o.ativa && " · desligado"}
                </span>
              </span>
              <span className="num-tab shrink-0 text-[13px] font-semibold">{formatarReal(o.precoBase)}</span>
            </button>
          ))}
        </div>
      )}

      {novo && (
        <Folha aberta onFechar={() => setNovo(false)} titulo="O que você vai cadastrar?">
          <div className="flex flex-col gap-2.5 pb-2 pt-1">
            {(
              [
                ["produto", Package, "Produto", "Tem estoque, quantidade e vai numa caixa."],
                ["servico", Wrench, "Serviço", "Tem duração, horário e quem atende."],
              ] as const
            ).map(([tipo, Icone, nome, texto]) => (
              <button
                key={tipo}
                onClick={() => {
                  setNovo(false);
                  setEditando(novaOferta(tipo));
                }}
                className="flex items-center gap-3.5 border border-borda-forte p-4 text-left"
                style={{ borderRadius: "var(--canto-g)" }}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center bg-[var(--marca-50)] text-[var(--marca-700)]"
                  style={{ borderRadius: "var(--canto-m)" }}
                >
                  <Icone size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-bold">{nome}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-tinta-45">{texto}</span>
                </span>
              </button>
            ))}
          </div>
        </Folha>
      )}

      {editando && (
        <FichaDoItem
          oferta={editando}
          loja={loja}
          onFechar={() => setEditando(null)}
          onSalvar={salvar}
          onApagar={apagar}
          onDuplicar={duplicar}
        />
      )}
    </div>
  );
}

/* ============================================================
   A FICHA
   ============================================================ */

function FichaDoItem({
  oferta,
  loja,
  onFechar,
  onSalvar,
  onApagar,
  onDuplicar,
}: {
  oferta: Oferta;
  loja: Loja;
  onFechar: () => void;
  onSalvar: (o: Oferta) => void;
  onApagar: (id: string) => void;
  onDuplicar: (o: Oferta) => void;
}) {
  const [rascunho, setRascunho] = useState<Oferta>(oferta);
  const [confirmandoApagar, setConfirmandoApagar] = useState(false);
  const novo = !loja.ofertas.some((o) => o.id === oferta.id);

  const imagens = useMemo(
    () => [...new Set(loja.ofertas.flatMap((o) => o.midia.map((m) => m.url)))].slice(0, 40),
    [loja.ofertas],
  );

  // Os módulos ligados que têm algo a dizer sobre um item deste tipo.
  const extras = useMemo(
    () =>
      modulosAtivos(loja.modulos).filter(
        (m) => m.camposDaOferta && (m.camposDaOferta.aplicaA?.(rascunho.tipo) ?? true),
      ),
    [loja.modulos, rascunho.tipo],
  );

  const mudar = (patch: Partial<Oferta>) => setRascunho((o) => ({ ...o, ...patch }));

  function mudarModulo(idModulo: string, chave: string, valor: unknown) {
    const modulo = extras.find((m) => m.id === idModulo);
    if (!modulo?.camposDaOferta) return;
    const atual = modulo.camposDaOferta.paraFormulario
      ? modulo.camposDaOferta.paraFormulario(rascunho.dadosModulo[idModulo])
      : ((rascunho.dadosModulo[idModulo] as Record<string, unknown>) ?? {});
    const proximo = { ...atual, [chave]: valor };
    const dados = modulo.camposDaOferta.paraDados ? modulo.camposDaOferta.paraDados(proximo) : proximo;
    mudar({ dadosModulo: { ...rascunho.dadosModulo, [idModulo]: dados } });
  }

  const podeSalvar = rascunho.nome.trim().length > 0;

  return (
    <Folha
      aberta
      onFechar={onFechar}
      altura="quase-cheia"
      titulo={novo ? "Novo item" : rascunho.nome || "Item"}
      subtitulo={rascunho.tipo === "servico" ? "Serviço" : "Produto"}
      rodape={
        <div className="flex gap-2">
          {!novo && (
            <button
              onClick={() => (confirmandoApagar ? onApagar(rascunho.id) : setConfirmandoApagar(true))}
              className={`flex h-[50px] items-center gap-1.5 border px-3.5 text-[13px] font-semibold ${
                confirmandoApagar ? "border-erro bg-erro-fraco text-erro" : "border-borda-forte text-tinta-45"
              }`}
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <Trash2 size={16} />
              {confirmandoApagar ? "Apagar mesmo" : ""}
            </button>
          )}
          <Botao largo disabled={!podeSalvar} onClick={() => onSalvar(rascunho)}>
            <Check size={17} strokeWidth={2.6} />
            {podeSalvar ? "Salvar item" : "Falta o nome"}
          </Botao>
        </div>
      }
    >
      <div className="flex flex-col gap-4 pt-1">
        <ControleCampo
          campo={{ tipo: "imagem", rotulo: "Foto do item", dica: "Fica quadrada. Suba do celular ou reaproveite." }}
          valor={rascunho.midia[0]?.url ?? ""}
          onMudar={(v) =>
            mudar({
              midia: v ? [{ url: String(v), alt: rascunho.nome, largura: 900, altura: 900 }] : [],
            })
          }
          imagensDisponiveis={imagens}
        />

        <Campo rotulo="Nome">
          {(p) => (
            <Entrada
              {...p}
              value={rascunho.nome}
              onChange={(e) => mudar({ nome: e.target.value })}
              placeholder={rascunho.tipo === "servico" ? "Corte + Finalização" : "Arroz Agulhinha · 5kg"}
            />
          )}
        </Campo>

        <Campo rotulo="Resumo" dica="Uma linha que aparece embaixo do nome.">
          {(p) => (
            <Entrada
              {...p}
              value={rascunho.resumo ?? ""}
              onChange={(e) => mudar({ resumo: e.target.value })}
              placeholder="Fardo com 6 pacotes"
            />
          )}
        </Campo>

        <Campo rotulo="Preço">
          {(p) => (
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-tinta-45">R$</span>
              <Entrada
                {...p}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={String(rascunho.precoBase)}
                onChange={(e) => mudar({ precoBase: Number(e.target.value) || 0 })}
                className="num-tab"
              />
              {rascunho.tipo === "servico" && (
                <span className="shrink-0 text-[13px] text-tinta-45">/ sessão</span>
              )}
            </div>
          )}
        </Campo>

        <Campo rotulo="Categorias" dica="Separadas por vírgula. É o que monta a faixa de categorias.">
          {(p) => (
            <Entrada
              {...p}
              value={rascunho.categorias.join(", ")}
              onChange={(e) =>
                mudar({
                  categorias: e.target.value
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean),
                })
              }
              placeholder="Mercearia, Promoção"
            />
          )}
        </Campo>

        <Campo rotulo="Descrição">
          {(p) => (
            <textarea
              {...p}
              rows={3}
              value={rascunho.descricao ?? ""}
              onChange={(e) => mudar({ descricao: e.target.value })}
              className="w-full resize-y border border-borda-forte bg-papel px-3.5 py-2.5 text-tinta placeholder:text-tinta-25"
              style={{ borderRadius: "var(--canto-m)" }}
              placeholder="O que o cliente precisa saber antes de comprar."
            />
          )}
        </Campo>

        <ControleCampo
          campo={{ tipo: "simNao", rotulo: "Aparece na loja", dica: "Desligue pra guardar sem publicar." }}
          valor={rascunho.ativa}
          onMudar={(v) => mudar({ ativa: Boolean(v) })}
          imagensDisponiveis={[]}
        />
        <ControleCampo
          campo={{ tipo: "simNao", rotulo: "É destaque", dica: "Entra nos blocos de destaque da vitrine." }}
          valor={rascunho.destaque ?? false}
          onMudar={(v) => mudar({ destaque: Boolean(v) })}
          imagensDisponiveis={[]}
        />

        {/* O que cada módulo ligado acrescenta. Esta tela não sabe o que é. */}
        {extras.map((m) => {
          const form = m.camposDaOferta!.paraFormulario
            ? m.camposDaOferta!.paraFormulario(rascunho.dadosModulo[m.id])
            : ((rascunho.dadosModulo[m.id] as Record<string, unknown>) ?? {});
          const Icone = m.icone;
          return (
            <section key={m.id} className="flex flex-col gap-4 border-t border-borda pt-4">
              <Sobrescrito>
                <span className="inline-flex items-center gap-1.5">
                  <Icone size={13} />
                  {m.nome}
                </span>
              </Sobrescrito>
              {Object.entries(m.camposDaOferta!.campos).map(([chave, campo]) => (
                <ControleCampo
                  key={chave}
                  campo={campo}
                  valor={form[chave]}
                  onMudar={(v) => mudarModulo(m.id, chave, v)}
                  imagensDisponiveis={imagens}
                />
              ))}
            </section>
          );
        })}

        {!novo && (
          <button
            onClick={() => onDuplicar(rascunho)}
            className="mt-1 flex min-h-[44px] items-center justify-center gap-1.5 border border-borda-forte text-[13px] font-semibold text-tinta-70"
            style={{ borderRadius: "var(--canto-m)" }}
          >
            <Copy size={15} />
            Duplicar este item
          </button>
        )}
      </div>
    </Folha>
  );
}
