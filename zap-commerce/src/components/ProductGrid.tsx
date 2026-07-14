import type { Produto } from "../types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  produtos,
  atacadoAtivo,
  onAdicionar,
}: {
  produtos: Produto[];
  atacadoAtivo: boolean;
  onAdicionar: (produto: Produto, tamanho: string, quantidade: number) => void;
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
      {produtos.map((p) => (
        <ProductCard
          key={p.id}
          produto={p}
          atacadoAtivo={atacadoAtivo}
          onAdicionar={(tamanho, quantidade) => onAdicionar(p, tamanho, quantidade)}
        />
      ))}
    </div>
  );
}
