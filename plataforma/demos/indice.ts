import type { Loja } from "../src/nucleo/tipos";
import { distribuidora } from "./distribuidora";
import { moda } from "./moda";
import { salao } from "./salao";

/**
 * As lojas de demonstração.
 *
 * Cada arquivo aqui é uma loja inteira — blocos, módulos ligados, tema e
 * catálogo. É a arma comercial: você chega na reunião com a loja do nicho
 * dele já montada no celular, não com um slide.
 *
 * Pra criar um nicho novo: copie um arquivo, troque o conteúdo. Nenhuma
 * linha de componente muda.
 */
export const DEMOS: Record<string, Loja> = {
  [distribuidora.slug]: distribuidora,
  [moda.slug]: moda,
  [salao.slug]: salao,
};

export const VITRINE_PADRAO = distribuidora.slug;
