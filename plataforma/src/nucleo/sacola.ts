import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { LinhaSacola } from "./tipos";

/**
 * A sacola do v1, generalizada.
 *
 * Duas mudanças em relação ao Zap-Commerce: a linha guarda uma `selecao`
 * genérica (tamanho, horário, o que o módulo escrever) em vez de um campo
 * `tamanho`, e a identidade da linha passou a ser uma chave derivada dessa
 * seleção — mesma oferta com escolhas diferentes vira linha diferente.
 *
 * Continua em localStorage: em B2B a sacola se monta ao longo de dias, não
 * de minutos, e perder ela é perder o pedido.
 */

interface ValorSacola {
  linhas: LinhaSacola[];
  adicionar: (ofertaId: string, selecao: Record<string, unknown>, quantidade: number) => void;
  definirQuantidade: (chave: string, quantidade: number) => void;
  remover: (chave: string) => void;
  limpar: () => void;
  substituir: (linhas: LinhaSacola[]) => void;
  totalItens: number;
}

const Ctx = createContext<ValorSacola | null>(null);

/** Mesma oferta + mesma seleção = mesma linha. A ordem das chaves não conta. */
export function chaveDaLinha(ofertaId: string, selecao: Record<string, unknown>): string {
  const partes = Object.keys(selecao)
    .sort()
    .map((k) => `${k}=${String(selecao[k])}`);
  return partes.length ? `${ofertaId}|${partes.join("&")}` : ofertaId;
}

function chaveStorage(slug: string) {
  return `plataforma:sacola:${slug}`;
}

export function ProvedorSacola({ slug, children }: { slug: string; children: ReactNode }) {
  const [linhas, setLinhas] = useState<LinhaSacola[]>([]);

  // Lê ao trocar de loja. Sacola de uma loja nunca vaza pra outra.
  useEffect(() => {
    try {
      const bruto = localStorage.getItem(chaveStorage(slug));
      setLinhas(bruto ? (JSON.parse(bruto) as LinhaSacola[]) : []);
    } catch {
      setLinhas([]);
    }
  }, [slug]);

  useEffect(() => {
    try {
      localStorage.setItem(chaveStorage(slug), JSON.stringify(linhas));
    } catch {
      /* modo privado, cota cheia: seguir sem persistir é melhor que quebrar */
    }
  }, [linhas, slug]);

  const adicionar = useCallback(
    (ofertaId: string, selecao: Record<string, unknown>, quantidade: number) => {
      const chave = chaveDaLinha(ofertaId, selecao);
      setLinhas((prev) => {
        const existe = prev.find((l) => l.chave === chave);
        if (existe) {
          return prev.map((l) => (l.chave === chave ? { ...l, quantidade: l.quantidade + quantidade } : l));
        }
        return [...prev, { chave, ofertaId, quantidade, selecao }];
      });
    },
    [],
  );

  const definirQuantidade = useCallback((chave: string, quantidade: number) => {
    setLinhas((prev) =>
      quantidade <= 0
        ? prev.filter((l) => l.chave !== chave)
        : prev.map((l) => (l.chave === chave ? { ...l, quantidade } : l)),
    );
  }, []);

  const remover = useCallback((chave: string) => {
    setLinhas((prev) => prev.filter((l) => l.chave !== chave));
  }, []);

  const limpar = useCallback(() => setLinhas([]), []);
  const substituir = useCallback((novas: LinhaSacola[]) => setLinhas(novas), []);

  const totalItens = useMemo(() => linhas.reduce((acc, l) => acc + l.quantidade, 0), [linhas]);

  const valor = useMemo(
    () => ({ linhas, adicionar, definirQuantidade, remover, limpar, substituir, totalItens }),
    [linhas, adicionar, definirQuantidade, remover, limpar, substituir, totalItens],
  );

  return createElement(Ctx.Provider, { value: valor }, children);
}

export function useSacola(): ValorSacola {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSacola precisa estar dentro de <ProvedorSacola>");
  return ctx;
}
