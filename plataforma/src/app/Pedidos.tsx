import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Check, ChevronRight, Copy, MessageCircle, Receipt, X } from "lucide-react";
import type { Loja, Pedido, StatusPedido } from "../nucleo/tipos";
import { atualizarStatus, listarPedidos } from "../nucleo/pedidos";
import { formatarReal } from "../nucleo/preco";
import { BotaoP, Etiqueta, Vazio } from "./Pecas";

/**
 * Os pedidos, com status.
 *
 * O status é o que transforma uma lista de comprovantes numa ferramenta de
 * trabalho: o lojista precisa saber o que já separou e o que ainda não.
 * Cinco estados, um toque pra avançar — no balcão não dá pra navegar menu.
 */

const STATUS: { id: StatusPedido; nome: string; tom: "neutro" | "ok" | "atencao" | "acento" | "erro" }[] = [
  { id: "novo", nome: "Novo", tom: "acento" },
  { id: "confirmado", nome: "Confirmado", tom: "atencao" },
  { id: "separando", nome: "Separando", tom: "atencao" },
  { id: "entregue", nome: "Entregue", tom: "ok" },
  { id: "cancelado", nome: "Cancelado", tom: "erro" },
];

const PROXIMO: Partial<Record<StatusPedido, StatusPedido>> = {
  novo: "confirmado",
  confirmado: "separando",
  separando: "entregue",
};

export function PedidosApp({ loja }: { loja: Loja }) {
  const [versao, setVersao] = useState(0);
  const [filtro, setFiltro] = useState<StatusPedido | "todos">("todos");
  const [aberto, setAberto] = useState<Pedido | null>(null);

  const pedidos = useMemo(() => listarPedidos(loja.slug), [loja.slug, versao]);
  const lista = useMemo(
    () => (filtro === "todos" ? pedidos : pedidos.filter((p) => (p.status ?? "novo") === filtro)),
    [pedidos, filtro],
  );

  function mudar(id: string, status: StatusPedido) {
    atualizarStatus(loja.slug, id, status);
    setVersao((v) => v + 1);
    setAberto((a) => (a && a.id === id ? { ...a, status } : a));
  }

  const contagem = (s: StatusPedido) => pedidos.filter((p) => (p.status ?? "novo") === s).length;

  if (pedidos.length === 0) {
    return (
      <Vazio
        icone={Receipt}
        titulo="Nenhum pedido ainda"
        texto="Abra a sua loja, monte uma sacola e finalize. O pedido cai aqui com a mensagem exata que foi pro WhatsApp."
        acao={
          <Link to={`/${loja.slug}`}>
            <BotaoP tom="contorno">Abrir a loja</BotaoP>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <h1 className="font-display text-[24px] font-bold leading-tight tracking-[-0.032em]">Pedidos</h1>
        <p className="num-tab mt-1 text-[13px] text-[var(--p-texto-3)]">
          {pedidos.length} no total · {formatarReal(pedidos.reduce((a, p) => a + p.total, 0))} somando
        </p>
      </header>

      <div className="sem-barra -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {([["todos", `Todos ${pedidos.length}`], ...STATUS.map((s) => [s.id, `${s.nome} ${contagem(s.id)}`])] as [
          StatusPedido | "todos",
          string,
        ][]).map(([id, nome]) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            aria-pressed={filtro === id}
            className={`num-tab min-h-[34px] shrink-0 whitespace-nowrap rounded-full px-3 text-[12.5px] font-semibold transition ${
              filtro === id
                ? "bg-[var(--p-texto)] text-[var(--p-fundo)]"
                : "bg-[var(--p-superficie-2)] text-[var(--p-texto-2)]"
            }`}
          >
            {nome}
          </button>
        ))}
      </div>

      {lista.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-[var(--p-texto-3)]">Nada com esse filtro.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {lista.map((p) => {
            const status = p.status ?? "novo";
            const def = STATUS.find((s) => s.id === status)!;
            const proximo = PROXIMO[status];
            return (
              <div key={p.id} className="placa-p overflow-hidden rounded-[16px]">
                <button onClick={() => setAberto(p)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-semibold">
                        {p.cliente?.nome || "Cliente não identificado"}
                      </span>
                      <Etiqueta tom={def.tom}>{def.nome}</Etiqueta>
                    </span>
                    <span className="num-tab mt-1 block text-[11.5px] text-[var(--p-texto-3)]">
                      {new Date(p.criadoEm).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      · {p.linhas.length} {p.linhas.length === 1 ? "item" : "itens"}
                    </span>
                  </span>
                  <span className="num-tab shrink-0 font-display text-[15px] font-bold tracking-[-0.02em]">
                    {formatarReal(p.total)}
                  </span>
                  <ChevronRight size={16} className="shrink-0 text-[var(--p-texto-3)]" />
                </button>

                {proximo && (
                  <button
                    onClick={() => mudar(p.id, proximo)}
                    className="flex w-full items-center justify-center gap-1.5 border-t border-[var(--p-borda)] py-2.5 text-[12.5px] font-semibold text-[var(--p-acento-claro)] transition hover:bg-[var(--p-superficie-2)]"
                  >
                    <Check size={14} strokeWidth={2.6} />
                    Marcar como {STATUS.find((s) => s.id === proximo)!.nome.toLowerCase()}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {aberto && <FichaPedido pedido={aberto} loja={loja} onFechar={() => setAberto(null)} onStatus={mudar} />}
    </div>
  );
}

function FichaPedido({
  pedido,
  loja,
  onFechar,
  onStatus,
}: {
  pedido: Pedido;
  loja: Loja;
  onFechar: () => void;
  onStatus: (id: string, s: StatusPedido) => void;
}) {
  const [copiado, setCopiado] = useState(false);
  const status = pedido.status ?? "novo";

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button aria-label="Fechar" onClick={onFechar} className="anima-surgir absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="anima-subir relative mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-[22px] border-t border-[var(--p-borda-forte)] bg-[var(--p-superficie)]">
        <div className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-5">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[18px] font-bold tracking-[-0.025em]">
              {pedido.cliente?.nome || "Pedido"}
            </h2>
            <p className="num-tab mt-0.5 text-[12px] text-[var(--p-texto-3)]">
              {new Date(pedido.criadoEm).toLocaleString("pt-BR")}
              {pedido.cliente?.telefone && ` · ${pedido.cliente.telefone}`}
            </p>
          </div>
          <button onClick={onFechar} aria-label="Fechar" className="-mr-1 -mt-1 flex h-9 w-9 items-center justify-center rounded-full text-[var(--p-texto-3)] hover:bg-[var(--p-superficie-2)]">
            <X size={19} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <p className="rotulo-p mb-2">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {STATUS.map((s) => (
              <button
                key={s.id}
                onClick={() => onStatus(pedido.id, s.id)}
                aria-pressed={status === s.id}
                className={`min-h-[36px] rounded-[10px] px-3 text-[12.5px] font-semibold transition ${
                  status === s.id
                    ? "bg-[var(--p-texto)] text-[var(--p-fundo)]"
                    : "bg-[var(--p-superficie-2)] text-[var(--p-texto-2)] hover:bg-[var(--p-superficie-3)]"
                }`}
              >
                {s.nome}
              </button>
            ))}
          </div>

          <p className="rotulo-p mb-2 mt-6">Itens</p>
          <div className="divide-y divide-[var(--p-borda)] rounded-[13px] bg-[var(--p-superficie-2)]">
            {pedido.linhas.map((l, i) => (
              <div key={i} className="flex items-start gap-3 px-3.5 py-2.5">
                <span className="num-tab mt-0.5 shrink-0 text-[12px] font-bold text-[var(--p-texto-3)]">
                  {l.linha.quantidade}×
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-snug">
                  {l.oferta.nome}
                  {l.resumoSelecao && (
                    <span className="mt-0.5 block text-[11.5px] text-[var(--p-texto-3)]">{l.resumoSelecao}</span>
                  )}
                </span>
                <span className="num-tab shrink-0 text-[12.5px] font-semibold">{formatarReal(l.subtotal)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-3.5 py-3">
              <span className="text-[13px] font-semibold">Total</span>
              <span className="num-tab font-display text-[17px] font-bold tracking-[-0.02em]">
                {formatarReal(pedido.total)}
              </span>
            </div>
          </div>

          <p className="rotulo-p mb-2 mt-6">Mensagem enviada</p>
          <pre className="whitespace-pre-wrap break-words rounded-[13px] bg-[var(--p-superficie-2)] p-3.5 text-[12px] leading-relaxed text-[var(--p-texto-2)]">
            {pedido.mensagem}
          </pre>
        </div>

        <div
          className="flex shrink-0 gap-2 border-t border-[var(--p-borda)] px-5 pt-3"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <BotaoP
            tom="contorno"
            onClick={() => {
              navigator.clipboard?.writeText(pedido.mensagem);
              setCopiado(true);
              window.setTimeout(() => setCopiado(false), 1600);
            }}
          >
            {copiado ? <Check size={16} /> : <Copy size={15} />}
            {copiado ? "Copiado" : "Copiar"}
          </BotaoP>
          <a
            href={`https://wa.me/${(pedido.cliente?.telefone ?? loja.whatsapp).replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <BotaoP largo>
              <MessageCircle size={16} />
              Responder no WhatsApp
            </BotaoP>
          </a>
        </div>
      </div>
    </div>
  );
}
