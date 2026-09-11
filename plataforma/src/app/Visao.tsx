import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Package, Receipt, Wand2 } from "lucide-react";
import type { Loja, Pedido } from "../nucleo/tipos";
import { listarPedidos } from "../nucleo/pedidos";
import { formatarReal } from "../nucleo/preco";
import type { Conta } from "../conta/sessao";
import { Barrinhas, Etiqueta, Indicador, Secao } from "./Pecas";

/**
 * A primeira tela de dentro.
 *
 * Quatro números e um gráfico — a pesquisa de painéis que envelhecem bem
 * (Stripe, Linear) converge nisso: poucos indicadores acima da dobra e
 * nada disputando atenção com eles. O resto é atalho.
 */

const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function seteDias(pedidos: Pedido[]) {
  const hoje = new Date();
  const caixas: { rotulo: string; total: number; qtd: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const fim = d.getTime() + 86400000;
    const doDia = pedidos.filter((p) => p.criadoEm >= d.getTime() && p.criadoEm < fim);
    caixas.push({
      rotulo: DIAS[d.getDay()],
      total: doDia.reduce((a, p) => a + p.total, 0),
      qtd: doDia.length,
    });
  }
  return caixas;
}

export function Visao({
  loja,
  conta,
  onIr,
}: {
  loja: Loja;
  conta: Conta;
  onIr: (aba: "visao" | "produtos" | "pedidos" | "estudio" | "mais") => void;
}) {
  const pedidos = useMemo(() => listarPedidos(loja.slug), [loja.slug]);

  const semana = useMemo(() => seteDias(pedidos), [pedidos]);
  const faturadoSemana = semana.reduce((a, d) => a + d.total, 0);
  const pedidosSemana = semana.reduce((a, d) => a + d.qtd, 0);
  const ticket = pedidosSemana ? faturadoSemana / pedidosSemana : 0;
  const novos = pedidos.filter((p) => (p.status ?? "novo") === "novo").length;

  // Semana anterior, pra ter com o que comparar. Sem comparação, número
  // grande não diz nada: R$ 4.200 é bom ou ruim?
  const anterior = useMemo(() => {
    const corte = Date.now() - 7 * 86400000;
    const antes = pedidos.filter((p) => p.criadoEm < corte && p.criadoEm >= corte - 7 * 86400000);
    return antes.reduce((a, p) => a + p.total, 0);
  }, [pedidos]);
  const variacao = anterior > 0 ? ((faturadoSemana - anterior) / anterior) * 100 : undefined;

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="flex flex-col gap-7">
      <header>
        <p className="text-[13px] text-[var(--p-texto-3)]">
          {saudacao}, {conta.nome.split(" ")[0]}
        </p>
        <h1 className="mt-1 font-display text-[26px] font-bold leading-[1.12] tracking-[-0.034em]">
          {novos > 0 ? `${novos} ${novos === 1 ? "pedido novo" : "pedidos novos"}` : "Tudo em dia por aqui"}
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Indicador rotulo="7 dias" valor={formatarReal(faturadoSemana)} variacao={variacao} />
        <Indicador rotulo="Pedidos" valor={String(pedidosSemana)} sufixo="na semana" />
        <Indicador rotulo="Ticket médio" valor={formatarReal(ticket)} />
        <Indicador rotulo="No catálogo" valor={String(loja.ofertas.filter((o) => o.ativa).length)} sufixo="ativos" />
      </div>

      <Secao
        titulo="Vendas na semana"
        acao={
          <span className="num-tab text-[12px] font-semibold text-[var(--p-texto-2)]">
            {formatarReal(faturadoSemana)}
          </span>
        }
      >
        <div className="placa-p rounded-[16px] p-4">
          <Barrinhas valores={semana.map((d) => d.total)} rotulos={semana.map((d) => d.rotulo)} />
        </div>
      </Secao>

      <Secao
        titulo="Últimos pedidos"
        acao={
          <button onClick={() => onIr("pedidos")} className="text-[12px] font-semibold text-[var(--p-acento-claro)]">
            Ver todos
          </button>
        }
      >
        {pedidos.length === 0 ? (
          <div className="placa-p rounded-[16px] px-4 py-7 text-center">
            <p className="text-[13.5px] font-semibold">Nenhum pedido ainda</p>
            <p className="mx-auto mt-1 max-w-[16rem] text-[12.5px] leading-relaxed text-[var(--p-texto-3)]">
              Abra a sua loja, monte uma sacola e finalize — o pedido cai aqui na hora.
            </p>
          </div>
        ) : (
          <div className="placa-p divide-y divide-[var(--p-borda)] overflow-hidden rounded-[16px]">
            {pedidos.slice(0, 4).map((p) => (
              <button
                key={p.id}
                onClick={() => onIr("pedidos")}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-[var(--p-superficie-2)]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-semibold">
                    {p.cliente?.nome || `Pedido de ${new Date(p.criadoEm).toLocaleDateString("pt-BR")}`}
                  </span>
                  <span className="num-tab mt-0.5 block text-[11.5px] text-[var(--p-texto-3)]">
                    {p.linhas.length} {p.linhas.length === 1 ? "item" : "itens"} ·{" "}
                    {new Date(p.criadoEm).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </span>
                <span className="num-tab shrink-0 font-display text-[14px] font-bold tracking-[-0.02em]">
                  {formatarReal(p.total)}
                </span>
              </button>
            ))}
          </div>
        )}
      </Secao>

      <Secao titulo="Atalhos">
        <div className="grid grid-cols-2 gap-3">
          {[
            { nome: "Montar a loja", texto: "Blocos, cores e telas", icone: Wand2, ir: "estudio" as const, destaque: true },
            { nome: "Cadastrar item", texto: "Produto ou serviço", icone: Package, ir: "produtos" as const },
            { nome: "Ver pedidos", texto: "Status e mensagens", icone: Receipt, ir: "pedidos" as const },
            { nome: "Abrir a loja", texto: "Como o cliente vê", icone: ArrowUpRight, ir: "link" as const },
          ].map((a) => {
            const Icone = a.icone;
            const corpo = (
              <>
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-[11px]"
                  style={
                    a.destaque
                      ? { background: "linear-gradient(150deg,var(--p-acento-claro),var(--p-acento))", color: "#fff" }
                      : { background: "var(--p-superficie-3)", color: "var(--p-texto-2)" }
                  }
                >
                  <Icone size={17} />
                </span>
                <span className="mt-3 block text-[13.5px] font-bold leading-tight">{a.nome}</span>
                <span className="mt-0.5 block text-[11.5px] text-[var(--p-texto-3)]">{a.texto}</span>
              </>
            );
            return a.ir === "link" ? (
              <Link key={a.nome} to={`/${loja.slug}`} className="placa-p rounded-[16px] p-4 text-left transition hover:bg-[var(--p-superficie-2)]">
                {corpo}
              </Link>
            ) : (
              <button key={a.nome} onClick={() => onIr(a.ir)} className="placa-p rounded-[16px] p-4 text-left transition hover:bg-[var(--p-superficie-2)]">
                {corpo}
              </button>
            );
          })}
        </div>
      </Secao>

      <div className="flex items-center justify-between gap-3 rounded-[16px] border border-dashed border-[var(--p-borda-forte)] px-4 py-3.5">
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold">Plano {conta.plano}</p>
          <p className="mt-0.5 text-[11.5px] text-[var(--p-texto-3)]">
            Tudo guardado neste navegador — o servidor entra na próxima etapa.
          </p>
        </div>
        <Etiqueta tom="acento">ativo</Etiqueta>
      </div>
    </div>
  );
}
