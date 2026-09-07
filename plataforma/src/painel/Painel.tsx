import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Receipt, Wand2 } from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { formatarReal } from "../nucleo/preco";
import { listarPedidos } from "../nucleo/pedidos";
import { modulosAtivos } from "../nucleo/registro";
import { aplicarTema, garantirFontes } from "../nucleo/tema";
import { Sobrescrito } from "../design/Primitivos";
import { Foto } from "../blocos/pecas";

/**
 * O backstage.
 *
 * As telas que um módulo acrescenta entram na navegação junto com as do
 * núcleo — o painel não sabe quais existem, ele pergunta ao registro.
 */
export function Painel({ loja }: { loja: Loja }) {
  const [aba, setAba] = useState("pedidos");

  useMemo(() => {
    aplicarTema(document.documentElement, loja.tema);
    garantirFontes(loja.tema.fontes);
    return null;
  }, [loja.tema]);

  const telasDeModulos = useMemo(
    () => modulosAtivos(loja.modulos).flatMap((m) => m.telasPainel ?? []),
    [loja.modulos],
  );

  const abas = [
    { id: "pedidos", nome: "Pedidos", icone: Receipt },
    { id: "itens", nome: "Itens", icone: Package },
    ...telasDeModulos.map((t) => ({ id: t.id, nome: t.nome, icone: t.icone })),
  ];

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg bg-papel">
      <header className="sticky top-0 z-30 border-b border-borda bg-papel/95 backdrop-blur">
        <div className="flex items-center gap-1 px-2 py-2">
          <Link to="/" aria-label="Voltar" className="flex h-10 w-10 items-center justify-center text-tinta-70">
            <ArrowLeft size={19} />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-bold leading-tight">{loja.nome}</p>
            <p className="text-[11px] text-tinta-45">Painel do lojista</p>
          </div>
          <Link
            to={`/${loja.slug}/estudio`}
            className="flex min-h-[38px] items-center gap-1.5 border border-borda-forte px-3 text-[12.5px] font-semibold text-tinta-70"
            style={{ borderRadius: "var(--canto-m)" }}
          >
            <Wand2 size={14} />
            Estúdio
          </Link>
        </div>

        <div className="sem-barra flex gap-1.5 overflow-x-auto px-3 pb-2">
          {abas.map((a) => {
            const Icone = a.icone;
            return (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                aria-pressed={aba === a.id}
                className={`flex min-h-[34px] shrink-0 items-center gap-1.5 whitespace-nowrap px-3 text-[12.5px] font-semibold ${
                  aba === a.id ? "bg-tinta text-white" : "bg-papel-3 text-tinta-70"
                }`}
                style={{ borderRadius: "999px" }}
              >
                <Icone size={13} />
                {a.nome}
              </button>
            );
          })}
        </div>
      </header>

      <main className="px-4 py-5">
        {aba === "pedidos" && <Pedidos loja={loja} />}
        {aba === "itens" && <Itens loja={loja} />}
        {telasDeModulos.map((t) => aba === t.id && <t.Componente key={t.id} loja={loja} />)}
      </main>
    </div>
  );
}

function Pedidos({ loja }: { loja: Loja }) {
  const pedidos = useMemo(() => listarPedidos(loja.slug), [loja.slug]);
  const [aberto, setAberto] = useState<string | null>(null);

  if (!pedidos.length) {
    return (
      <div className="py-16 text-center">
        <Receipt size={28} className="mx-auto text-tinta-25" strokeWidth={1.5} />
        <p className="mt-3 text-[14.5px] font-semibold">Nenhum pedido ainda</p>
        <p className="mx-auto mt-1 max-w-xs text-[13px] leading-relaxed text-tinta-45">
          Faça um pedido na vitrine pra ver como ele chega aqui — e como vira a mensagem do WhatsApp.
        </p>
        <Link to={`/${loja.slug}`} className="mt-4 inline-block text-[13.5px] font-semibold text-[var(--marca-600)]">
          Ir pra vitrine →
        </Link>
      </div>
    );
  }

  const faturado = pedidos.reduce((a, p) => a + p.total, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Indicador rotulo="Pedidos" valor={String(pedidos.length)} />
        <Indicador rotulo="Somando" valor={formatarReal(faturado)} />
      </div>

      <div className="flex flex-col gap-2">
        {pedidos.map((p) => {
          const expandido = aberto === p.id;
          return (
            <div key={p.id} className="border border-borda bg-papel" style={{ borderRadius: "var(--canto-g)" }}>
              <button
                onClick={() => setAberto(expandido ? null : p.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="num-tab text-[13.5px] font-semibold">
                    {new Date(p.criadoEm).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="num-tab mt-0.5 text-[12.5px] text-tinta-45">
                    {p.linhas.length} {p.linhas.length === 1 ? "item" : "itens"}
                  </p>
                </div>
                <p className="num-tab shrink-0 font-display text-[16px] font-bold tracking-tight">
                  {formatarReal(p.total)}
                </p>
              </button>

              {expandido && (
                <div className="border-t border-borda p-4">
                  <Sobrescrito>Mensagem enviada</Sobrescrito>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words bg-papel-2 p-3 text-[12px] leading-relaxed text-tinta-70" style={{ borderRadius: "var(--canto-m)" }}>
                    {p.mensagem}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Itens({ loja }: { loja: Loja }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] text-tinta-45">
        {loja.ofertas.length} itens no catálogo. Editar item ainda é feito no arquivo da loja — entra no
        painel quando a API estiver de pé.
      </p>

      <div className="border border-borda bg-papel px-3.5" style={{ borderRadius: "var(--canto-g)" }}>
        {loja.ofertas.map((o) => (
          <div key={o.id} className="flex items-center gap-3 border-b border-borda py-2.5 last:border-b-0">
            <Foto oferta={o} className="h-11 w-11 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold leading-tight">{o.nome}</p>
              <p className="mt-0.5 truncate text-[12px] text-tinta-45">
                {o.categorias.join(", ")} · {o.tipo === "servico" ? "serviço" : "produto"}
              </p>
            </div>
            <p className="num-tab shrink-0 text-[13px] font-semibold">{formatarReal(o.precoBase)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Indicador({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="border border-borda bg-papel px-4 py-3" style={{ borderRadius: "var(--canto-g)" }}>
      <Sobrescrito>{rotulo}</Sobrescrito>
      <p className="num-tab mt-1 font-display text-[20px] font-extrabold tracking-tight">{valor}</p>
    </div>
  );
}
