import { createContext, useContext, type ReactNode } from "react";
import type { Loja, Oferta, ResumoSacola, TipoPagina } from "../nucleo/tipos";

/**
 * O que os blocos podem fazer, sem saber nada de rotas.
 *
 * Bloco não importa react-router. Ele pede "abre esta oferta" e quem decide
 * como é a vitrine — ou o estúdio, que intercepta e não navega pra lugar
 * nenhum enquanto você está editando.
 */
export interface ValorVitrine {
  loja: Loja;
  resumo: ResumoSacola;
  editando: boolean;
  irPara: (pagina: TipoPagina, ofertaId?: string) => void;
  abrirOferta: (oferta: Oferta) => void;
  /** Abre a folha de escolha (tamanho, horário…) antes de somar na sacola. */
  abrirAdicionar: (oferta: Oferta) => void;
  /** Soma direto, pra oferta que não precisa de escolha nenhuma. */
  somar: (oferta: Oferta, quantidade: number) => void;
  quantidadeNaSacola: (ofertaId: string) => number;
}

const Ctx = createContext<ValorVitrine | null>(null);

export function ProvedorVitrine({ valor, children }: { valor: ValorVitrine; children: ReactNode }) {
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useVitrine(): ValorVitrine {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useVitrine precisa estar dentro de <ProvedorVitrine>");
  return ctx;
}
