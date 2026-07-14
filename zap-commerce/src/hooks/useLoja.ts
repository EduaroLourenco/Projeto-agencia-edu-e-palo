import { useEffect, useState } from "react";
import type { LojaConfig } from "../types";
import { buscarLoja } from "../lib/api";

export function useLoja(slug: string) {
  const [loja, setLoja] = useState<LojaConfig | null | undefined>(undefined);

  useEffect(() => {
    let ativo = true;
    setLoja(undefined);
    buscarLoja(slug)
      .then((data) => {
        if (ativo) setLoja(data);
      })
      .catch(() => {
        if (ativo) setLoja(null);
      });
    return () => {
      ativo = false;
    };
  }, [slug]);

  return loja;
}
