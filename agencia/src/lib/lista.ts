import { createContext, useContext } from "react";

export interface ListaCtx {
  ids: string[];
  alternar: (id: string) => void;
  limpar: () => void;
  abrir: (id: string) => void;
}

export const ListaContext = createContext<ListaCtx | null>(null);

export function useLista() {
  const ctx = useContext(ListaContext);
  if (!ctx) throw new Error("useLista precisa de ListaContext");
  return ctx;
}

export function mensagemDaLista(titulos: string[]) {
  return `Olá! Vim pelo site da BEPA e tenho interesse em:\n${titulos.map((t) => `• ${t}`).join("\n")}`;
}
