import type { RegraAtacado } from "../types";
import { formatarReal } from "../lib/format";

export function WholesaleProgressBar({
  regra,
  progressoAtual,
}: {
  regra: RegraAtacado;
  progressoAtual: number;
}) {
  const meta = regra.minimo;
  const pct = Math.min(100, Math.round((progressoAtual / meta) * 100));
  const atingiu = progressoAtual >= meta;

  const restante = Math.max(0, meta - progressoAtual);
  const mensagem = atingiu
    ? "🎉 Preço de atacado liberado em toda a sacola!"
    : regra.tipo === "quantidade"
      ? `Adicione mais ${restante} peça${restante === 1 ? "" : "s"} para pagar preço de atacado`
      : `Faltam ${formatarReal(restante)} para liberar o preço de atacado`;

  return (
    <div className="mx-4 mb-3 rounded-2xl border border-brand-100 bg-brand-50 p-3">
      <p className="mb-2 text-xs font-semibold text-brand-700">{mensagem}</p>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white">
        <div
          className={`h-full rounded-full transition-all duration-500 ${atingiu ? "bg-ok-500" : "bg-brand-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
