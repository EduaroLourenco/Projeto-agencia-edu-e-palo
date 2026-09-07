import { Truck } from "lucide-react";
import type { Modulo } from "../nucleo/tipos";
import { Campo, Entrada, Sobrescrito } from "../design/Primitivos";

/**
 * MÓDULO ENTREGA — os métodos deixam de ser cravados no código.
 *
 * No v1 eram três, fixos e específicos de sacoleira ("mãos", "excursão",
 * "correios"). Aqui cada loja declara os seus em `config.entrega.metodos`,
 * e cada método diz que campos pede.
 */

export interface MetodoEntrega {
  id: string;
  nome: string;
  descricao?: string;
  /** Campos extras que este método pede. */
  pede?: ("endereco" | "cep" | "observacao")[];
}

export interface ConfigEntrega {
  metodos: MetodoEntrega[];
}

function metodosDa(loja: { config: Record<string, unknown> }): MetodoEntrega[] {
  return ((loja.config.entrega as ConfigEntrega) ?? { metodos: [] }).metodos ?? [];
}

export const moduloEntrega: Modulo = {
  id: "entrega",
  nome: "Entrega",
  descricao: "Como o pedido chega. Cada loja define os métodos.",
  icone: Truck,

  passos: [
    {
      id: "entrega",
      titulo: "Entrega",
      subtitulo: "Como você quer receber.",
      ordem: 40,
      // Serviço agendado não precisa de entrega; produto sim.
      visivelQuando: ({ linhas, loja }) =>
        metodosDa(loja).length > 0 && linhas.some((l) => l.oferta.tipo === "produto"),

      validar: (dados, { loja }) => {
        const erros = [];
        const metodo = metodosDa(loja).find((m) => m.id === dados.metodoId);
        if (!metodo) {
          erros.push({ campo: "metodoId", mensagem: "Escolha como quer receber." });
          return erros;
        }
        if (metodo.pede?.includes("cep")) {
          const cep = String(dados.cep ?? "").replace(/\D/g, "");
          if (cep.length !== 8) erros.push({ campo: "cep", mensagem: "O CEP tem 8 dígitos." });
        }
        if (metodo.pede?.includes("endereco") && String(dados.endereco ?? "").trim().length < 6) {
          erros.push({ campo: "endereco", mensagem: "Escreva rua, número e bairro." });
        }
        return erros;
      },

      Componente: ({ dados, definir, erros, loja }) => {
        const metodos = metodosDa(loja);
        const metodo = metodos.find((m) => m.id === dados.metodoId);
        const erro = (campo: string) => erros.find((e) => e.campo === campo)?.mensagem;

        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Sobrescrito>Como receber</Sobrescrito>
              {erro("metodoId") && <p className="text-[12.5px] font-medium text-erro">{erro("metodoId")}</p>}

              <div className="flex flex-col gap-2">
                {metodos.map((m) => {
                  const ativo = m.id === dados.metodoId;
                  return (
                    <button
                      key={m.id}
                      onClick={() => definir({ metodoId: m.id })}
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
                        {ativo && <span className="h-2 w-2 rounded-full bg-[var(--marca-500)]" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-semibold">{m.nome}</span>
                        {m.descricao && <span className="mt-0.5 block text-[12.5px] text-tinta-45">{m.descricao}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {metodo?.pede?.includes("cep") && (
              <Campo rotulo="CEP" erro={erro("cep")}>
                {(p) => (
                  <Entrada
                    {...p}
                    value={String(dados.cep ?? "")}
                    onChange={(e) => definir({ cep: e.target.value })}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                  />
                )}
              </Campo>
            )}

            {metodo?.pede?.includes("endereco") && (
              <Campo rotulo="Endereço" erro={erro("endereco")}>
                {(p) => (
                  <Entrada
                    {...p}
                    value={String(dados.endereco ?? "")}
                    onChange={(e) => definir({ endereco: e.target.value })}
                    autoComplete="street-address"
                    placeholder="Rua, número, bairro"
                  />
                )}
              </Campo>
            )}

            {metodo?.pede?.includes("observacao") && (
              <Campo rotulo="Alguma observação?" dica="Horário que pode receber, ponto de referência…">
                {(p) => (
                  <Entrada
                    {...p}
                    value={String(dados.observacao ?? "")}
                    onChange={(e) => definir({ observacao: e.target.value })}
                    placeholder="Opcional"
                  />
                )}
              </Campo>
            )}
          </div>
        );
      },

      paraMensagem: (dados, { loja }) => {
        const metodo = metodosDa(loja).find((m) => m.id === dados.metodoId);
        const linhas: string[] = [];
        if (metodo) linhas.push(`Forma: ${metodo.nome}`);
        if (dados.cep) linhas.push(`CEP: ${dados.cep}`);
        if (dados.endereco) linhas.push(`Endereço: ${dados.endereco}`);
        if (dados.observacao) linhas.push(`Obs: ${dados.observacao}`);
        return linhas;
      },
    },
  ],
};
