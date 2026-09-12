import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, Package, Receipt, Settings, Store, Wand2 } from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { formatarReal } from "../nucleo/preco";
import { listarPedidos } from "../nucleo/pedidos";
import { modulosAtivos } from "../nucleo/registro";
import { aplicarMarca } from "../nucleo/tema";
import { salvarLoja } from "../nucleo/loja";
import { Catalogo } from "./Catalogo";
import { Configuracoes } from "./Configuracoes";
import { Sobrescrito } from "../design/Primitivos";

/**
 * O backstage.
 *
 * As telas que um módulo acrescenta entram na navegação junto com as do
 * núcleo — o painel não sabe quais existem, ele pergunta ao registro.
 */
export function Painel({ loja: lojaInicial }: { loja: Loja }) {
  const [aba, setAba] = useState("pedidos");
  const [loja, setLoja] = useState(lojaInicial);
  const [salvo, setSalvo] = useState<null | "ok" | string>(null);
  const relogio = useRef<number | null>(null);

  // Só a marca: o painel tem interface própria e não herda o papel da loja.
  useEffect(() => {
    aplicarMarca(document.documentElement, loja.tema);
  }, [loja.tema]);

  /**
   * Painel salva na hora, sem botão de publicar.
   *
   * Preço de produto e telefone da loja não são "layout em construção".
   * Quem mexe aqui mexeu de verdade — o rascunho é coisa do estúdio.
   */
  function alterar(proxima: Loja) {
    setLoja(proxima);
    const r = salvarLoja(proxima);
    setSalvo(r.ok ? "ok" : r.erro);
    if (relogio.current) window.clearTimeout(relogio.current);
    relogio.current = window.setTimeout(() => setSalvo(null), r.ok ? 1800 : 8000);
  }

  const telasDeModulos = useMemo(
    () => modulosAtivos(loja.modulos).flatMap((m) => m.telasPainel ?? []),
    [loja.modulos],
  );

  const abas = [
    { id: "pedidos", nome: "Pedidos", icone: Receipt },
    { id: "itens", nome: `Catálogo · ${loja.ofertas.length}`, icone: Package },
    { id: "loja", nome: "Loja", icone: Store },
    ...telasDeModulos.map((t) => ({ id: t.id, nome: t.nome, icone: t.icone })),
    { id: "ajuda", nome: "Como funciona", icone: Settings },
  ];

  return (
    <div className="mx-auto min-h-dvh w-full max-w-lg bg-papel">
      <header className="sticky top-0 z-30 border-b border-borda bg-papel/95 backdrop-blur">
        <div className="flex items-center gap-1 px-2 py-2">
          <Link to="/app" aria-label="Voltar" className="flex h-10 w-10 items-center justify-center text-tinta-70">
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

      {salvo && (
        <div
          className={`anima-surgir fixed inset-x-0 bottom-4 z-40 mx-auto flex w-fit max-w-[92%] items-center gap-2 px-4 py-2.5 text-[13px] font-semibold shadow-[var(--sombra-3)] ${
            salvo === "ok" ? "bg-tinta text-white" : "bg-erro text-white"
          }`}
          style={{ borderRadius: "999px" }}
          role="status"
        >
          {salvo === "ok" ? (
            <>
              <Check size={15} strokeWidth={3} />
              Salvo
            </>
          ) : (
            salvo
          )}
        </div>
      )}

      <main className="px-4 py-5">
        {aba === "pedidos" && <Pedidos loja={loja} />}
        {aba === "itens" && <Catalogo loja={loja} onMudar={alterar} />}
        {aba === "loja" && <Configuracoes loja={loja} onMudar={alterar} />}
        {aba === "ajuda" && <Ajuda />}
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

function Ajuda() {
  const passos = [
    ["Catálogo", "Cadastre produto ou serviço. O que aparece na ficha muda conforme os recursos ligados no estúdio."],
    ["Estúdio", "Monte as telas com blocos, pinte as seções e escolha as cores. Só vai pro ar quando você publicar."],
    ["Loja", "Nome, recado e o WhatsApp que recebe os pedidos."],
    ["Pedidos", "Tudo que sair da vitrine cai aqui, com a mensagem exata que foi pro WhatsApp."],
  ];
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] leading-relaxed text-tinta-70">
        Esta é a mesa de trabalho do lojista. A vitrine é o que o cliente vê.
      </p>
      {passos.map(([titulo, texto], i) => (
        <div key={titulo} className="flex gap-3 border border-borda bg-papel p-3.5" style={{ borderRadius: "var(--canto-g)" }}>
          <span
            className="num-tab flex h-7 w-7 shrink-0 items-center justify-center bg-[var(--marca-50)] text-[12px] font-bold text-[var(--marca-700)]"
            style={{ borderRadius: "999px" }}
          >
            {i + 1}
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-bold">{titulo}</span>
            <span className="mt-0.5 block text-[12.5px] leading-snug text-tinta-45">{texto}</span>
          </span>
        </div>
      ))}
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
