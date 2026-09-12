import { registrarModulo } from "../nucleo/registro";
import { moduloVariantes } from "./variantes";
import { moduloB2B } from "./b2b";
import { moduloEntrega } from "./entrega";
import { moduloAgendamento } from "./agendamento";
import { moduloPagamento } from "./pagamento";

/**
 * Registrar ≠ ligar.
 *
 * Todos os módulos ficam disponíveis aqui; cada loja liga os que quer em
 * `loja.modulos`. Um módulo desligado não gera bloco no catálogo, não
 * aparece no checkout e não tem as tabelas dele consultadas.
 */
let feito = false;

export function registrarModulos() {
  if (feito) return;
  feito = true;
  [moduloVariantes, moduloB2B, moduloEntrega, moduloAgendamento, moduloPagamento].forEach(registrarModulo);
}
