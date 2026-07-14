import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ItemCarrinho } from "../types";

interface CartContextValue {
  itens: ItemCarrinho[];
  adicionarItem: (produtoId: string, tamanho: string, quantidade: number) => void;
  removerItem: (produtoId: string, tamanho: string) => void;
  atualizarQuantidade: (produtoId: string, tamanho: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalPecas: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function chaveStorage(tenantId: string) {
  return `zc:carrinho:${tenantId}`;
}

export function CartProvider({ tenantId, children }: { tenantId: string; children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>(() => {
    try {
      const raw = localStorage.getItem(chaveStorage(tenantId));
      return raw ? (JSON.parse(raw) as ItemCarrinho[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(chaveStorage(tenantId), JSON.stringify(itens));
  }, [itens, tenantId]);

  const adicionarItem = useCallback((produtoId: string, tamanho: string, quantidade: number) => {
    setItens((prev) => {
      const existente = prev.find((i) => i.produtoId === produtoId && i.tamanho === tamanho);
      if (existente) {
        return prev.map((i) =>
          i.produtoId === produtoId && i.tamanho === tamanho
            ? { ...i, quantidade: i.quantidade + quantidade }
            : i,
        );
      }
      return [...prev, { produtoId, tamanho, quantidade }];
    });
  }, []);

  const removerItem = useCallback((produtoId: string, tamanho: string) => {
    setItens((prev) => prev.filter((i) => !(i.produtoId === produtoId && i.tamanho === tamanho)));
  }, []);

  const atualizarQuantidade = useCallback((produtoId: string, tamanho: string, quantidade: number) => {
    setItens((prev) => {
      if (quantidade <= 0) {
        return prev.filter((i) => !(i.produtoId === produtoId && i.tamanho === tamanho));
      }
      return prev.map((i) =>
        i.produtoId === produtoId && i.tamanho === tamanho ? { ...i, quantidade } : i,
      );
    });
  }, []);

  const limparCarrinho = useCallback(() => setItens([]), []);

  const totalPecas = useMemo(() => itens.reduce((acc, i) => acc + i.quantidade, 0), [itens]);

  const value = useMemo(
    () => ({ itens, adicionarItem, removerItem, atualizarQuantidade, limparCarrinho, totalPecas }),
    [itens, adicionarItem, removerItem, atualizarQuantidade, limparCarrinho, totalPecas],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de CartProvider");
  return ctx;
}
