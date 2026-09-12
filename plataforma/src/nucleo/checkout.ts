import { modulosAtivos } from "./registro";
import type { DadosCheckout, ErroCheckout, LinhaResolvida, Loja, PassoCheckout } from "./tipos";

/**
 * O checkout é uma esteira, não uma tela.
 *
 * O núcleo abre e fecha a esteira; tudo no meio vem dos módulos. Adicionar
 * agendamento não toca em nenhum arquivo daqui — o passo aparece porque o
 * módulo registrou ele e disse quando quer ser visto.
 */

export function passosDoCheckout(loja: Loja, linhas: LinhaResolvida[]): PassoCheckout[] {
  return modulosAtivos(loja.modulos)
    .flatMap((m) => m.passos ?? [])
    .filter((p) => p.visivelQuando({ linhas, loja }))
    .sort((a, b) => a.ordem - b.ordem);
}

export function validarPasso(
  passo: PassoCheckout,
  dados: DadosCheckout,
  loja: Loja,
  linhas: LinhaResolvida[],
): ErroCheckout[] {
  return passo.validar(dados[passo.id] ?? {}, { loja, linhas });
}

export function validarTudo(
  passos: PassoCheckout[],
  dados: DadosCheckout,
  loja: Loja,
  linhas: LinhaResolvida[],
): Record<string, ErroCheckout[]> {
  const out: Record<string, ErroCheckout[]> = {};
  for (const passo of passos) {
    const erros = validarPasso(passo, dados, loja, linhas);
    if (erros.length) out[passo.id] = erros;
  }
  return out;
}
