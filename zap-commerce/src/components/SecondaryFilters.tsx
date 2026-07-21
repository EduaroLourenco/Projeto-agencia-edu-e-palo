import { Flame } from "lucide-react";

export function SecondaryFilters({
  tamanhos,
  tamanhoAtivo,
  somenteUltimasPecas,
  onSelecionarTamanho,
  onAlternarUltimasPecas,
}: {
  tamanhos: string[];
  tamanhoAtivo: string | null;
  somenteUltimasPecas: boolean;
  onSelecionarTamanho: (tamanho: string | null) => void;
  onAlternarUltimasPecas: () => void;
}) {
  if (tamanhos.length === 0) return null;

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
      <button
        onClick={onAlternarUltimasPecas}
        className={`flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
          somenteUltimasPecas
            ? "border-gold-500 bg-gold-500 text-white"
            : "border-black/10 bg-white text-ink/60"
        }`}
      >
        <Flame size={12} />
        Últimas peças
      </button>

      <span className="my-auto h-4 w-px shrink-0 bg-black/10" />

      {tamanhos.map((t) => (
        <button
          key={t}
          onClick={() => onSelecionarTamanho(tamanhoAtivo === t ? null : t)}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            tamanhoAtivo === t ? "border-ink bg-ink text-white" : "border-black/10 bg-white text-ink/60"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
