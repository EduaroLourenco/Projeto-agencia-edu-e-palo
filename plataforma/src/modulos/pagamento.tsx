import { CreditCard } from "lucide-react";
import type { Modulo } from "../nucleo/tipos";
import { Sobrescrito } from "../design/Primitivos";

/**
 * MÓDULO PAGAMENTO — só a combinação, não a cobrança.
 *
 * Aqui não passa cartão nem gera PIX: o pedido vai pro WhatsApp e o
 * lojista fecha por lá, como já fecha hoje. O que este passo faz é
 * registrar a forma combinada, pra não virar discussão depois.
 */

export interface FormaPagamento {
  id: string;
  nome: string;
  descricao?: string;
}

interface ConfigPagamento {
  formas: FormaPagamento[];
}

function formasDe(loja: { config: Record<string, unknown> }): FormaPagamento[] {
  return ((loja.config.pagamento as ConfigPagamento) ?? { formas: [] }).formas ?? [];
}

export const moduloPagamento: Modulo = {
  id: "pagamento",
  nome: "Pagamento",
  descricao: "PIX, boleto, prazo. Combina a forma; a cobrança segue no WhatsApp.",
  icone: CreditCard,

  passos: [
    {
      id: "pagamento",
      titulo: "Pagamento",
      subtitulo: "Como você prefere pagar.",
      ordem: 50,
      visivelQuando: ({ loja }) => formasDe(loja).length > 0,

      validar: (dados, { loja }) =>
        formasDe(loja).some((f) => f.id === dados.formaId)
          ? []
          : [{ campo: "formaId", mensagem: "Escolha a forma de pagamento." }],

      Componente: ({ dados, definir, erros, loja }) => {
        const formas = formasDe(loja);
        const erro = erros.find((e) => e.campo === "formaId")?.mensagem;

        return (
          <div className="flex flex-col gap-2">
            <Sobrescrito>Forma de pagamento</Sobrescrito>
            {erro && <p className="text-[12.5px] font-medium text-erro">{erro}</p>}

            {formas.map((f) => {
              const ativo = f.id === dados.formaId;
              return (
                <button
                  key={f.id}
                  onClick={() => definir({ formaId: f.id })}
                  aria-pressed={ativo}
                  className={`flex items-start gap-3 border px-4 py-3.5 text-left transition ${
                    ativo ? "border-[var(--marca-500)] bg-[var(--marca-50)]" : "border-borda-forte bg-papel hover:border-tinta-45"
                  }`}
                  style={{ borderRadius: "var(--canto-m)" }}
                >
                  <span
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                      ativo ? "border-[var(--marca-500)]" : "border-borda-forte"
                    }`}
                  >
                    {ativo && <span className="h-2 w-2 rounded-full bg-[var(--marca-grafico)]" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[14px] font-semibold">{f.nome}</span>
                    {f.descricao && <span className="mt-0.5 block text-[12.5px] text-tinta-45">{f.descricao}</span>}
                  </span>
                </button>
              );
            })}
          </div>
        );
      },

      paraMensagem: (dados, { loja }) => {
        const forma = formasDe(loja).find((f) => f.id === dados.formaId);
        return forma ? [`Forma: ${forma.nome}`] : [];
      },
    },
  ],
};
