import type { Produto } from "../types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  produtos,
  atacadoAtivo,
  onAdicionar,
  onAbrirZoom,
}: {
  produtos: Produto[];
  atacadoAtivo: boolean;
  onAdicionar: (produto: Produto, tamanho: string, quantidade: number) => void;
  onAbrirZoom?: (produto: Produto) => void;
}) {
  if (produtos.length === 0) {
    return (
      <div className="px-4 py-16 text-center text-sm text-ink/40">
        Nenhuma peça encontrada nessa categoria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-6">
      {produtos.map((p, i) => (
        <ProductCard
          key={p.id}
          produto={p}
          atacadoAtivo={atacadoAtivo}
          prioritario={i < 4}
          onAdicionar={(tamanho, quantidade) => onAdicionar(p, tamanho, quantidade)}
          onAbrirZoom={onAbrirZoom}
        />
      ))}
    </div>
  );
}
