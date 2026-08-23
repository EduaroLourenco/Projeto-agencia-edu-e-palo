/**
 * Memória leve do visitante, no próprio navegador dele.
 *
 * Guarda só o setor que ele escolheu, pra quando voltar o site já abrir
 * no contexto certo em vez de recomeçar do zero. É o mesmo princípio que
 * um app de banco usa ao abrir já no saldo: a segunda visita não deveria
 * custar o mesmo trabalho que a primeira.
 *
 * Nada aqui sai do navegador do visitante, e nada aqui é essencial: se o
 * armazenamento estiver bloqueado (aba anônima, cookies desligados), as
 * funções falham em silêncio e o site funciona igual.
 */

const CHAVE = "bepa:setor";

export function lembrarSetor(id: string) {
  try {
    localStorage.setItem(CHAVE, id);
  } catch {
    // Modo privado ou armazenamento cheio: seguir sem lembrar.
  }
}

export function setorLembrado(): string | null {
  try {
    return localStorage.getItem(CHAVE);
  } catch {
    return null;
  }
}

export function esquecerSetor() {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* idem */
  }
}
