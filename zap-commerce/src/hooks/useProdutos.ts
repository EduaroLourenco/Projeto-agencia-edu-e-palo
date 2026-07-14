import { useEffect, useState } from "react";
import type { Produto } from "../types";
import { listarProdutosPublico } from "../lib/api";

export function useProdutos(slug: string): Produto[] {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    let ativo = true;
    listarProdutosPublico(slug)
      .then((data) => {
        if (ativo) setProdutos(data);
      })
      .catch(() => {
        if (ativo) setProdutos([]);
      });
    return () => {
      ativo = false;
    };
  }, [slug]);

  return produtos;
}
