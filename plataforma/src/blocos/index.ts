import { registrarBloco } from "../nucleo/registro";
import type { DefinicaoBloco } from "../nucleo/tipos";

import {
  blocoBanner,
  blocoCarrosselBanners,
  blocoContato,
  blocoDivisor,
  blocoFaixaAviso,
  blocoProvaSocial,
  blocoTexto,
  blocoVideo,
} from "./comuns";

import {
  blocoCarrosselOfertas,
  blocoFaixaCategorias,
  blocoGradeOfertas,
  blocoListaRapida,
  blocoRepetirPedido,
} from "./ofertas";

import {
  blocoCatalogoLista,
  blocoConfirmacaoRecibo,
  blocoOfertaCabecalho,
  blocoOfertaComprar,
  blocoOfertaGaleria,
  blocoSacolaItens,
} from "./ancoras";

/**
 * Os blocos do núcleo. Módulos registram os deles ao serem ligados.
 *
 * O `as` aqui é a fronteira entre o bloco, que conhece as próprias props,
 * e o registro, que trabalha com todos os blocos de forma genérica.
 */
const TODOS = [
  blocoBanner,
  blocoCarrosselBanners,
  blocoCarrosselOfertas,
  blocoGradeOfertas,
  blocoListaRapida,
  blocoFaixaCategorias,
  blocoRepetirPedido,
  blocoFaixaAviso,
  blocoTexto,
  blocoProvaSocial,
  blocoVideo,
  blocoContato,
  blocoDivisor,
  // âncoras
  blocoCatalogoLista,
  blocoOfertaGaleria,
  blocoOfertaCabecalho,
  blocoOfertaComprar,
  blocoSacolaItens,
  blocoConfirmacaoRecibo,
] as unknown as DefinicaoBloco<never>[];

let registrado = false;

export function registrarBlocosDoNucleo() {
  if (registrado) return;
  registrado = true;
  TODOS.forEach(registrarBloco);
}
