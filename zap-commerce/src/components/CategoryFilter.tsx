export function CategoryFilter({
  categorias,
  ativa,
  onSelecionar,
}: {
  categorias: string[];
  ativa: string;
  onSelecionar: (categoria: string) => void;
}) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      {["Todas", ...categorias].map((cat) => {
        const selecionada = cat === ativa;
        return (
          <button
            key={cat}
            onClick={() => onSelecionar(cat)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              selecionada
                ? "border-ink bg-ink text-white"
                : "border-black/10 bg-white text-ink/70"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
