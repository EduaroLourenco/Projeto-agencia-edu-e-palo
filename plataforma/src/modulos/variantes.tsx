import { Shirt } from "lucide-react";
import type { Modulo, Oferta } from "../nucleo/tipos";
import { Sobrescrito } from "../design/Primitivos";

/**
 * MÓDULO VARIANTES — N eixos, não só "tamanho".
 *
 * O v1 tinha `tamanhosJson`: um eixo, cravado no banco. Aqui a oferta declara
 * quantos eixos quiser (tamanho, cor, voltagem, embalagem) e o configurador
 * se desenha a partir deles.
 */

export interface Eixo {
  nome: string;
  valores: string[];
}

export interface DadosVariantes {
  eixos: Eixo[];
  /** Combinações indisponíveis, no formato "M|Azul". Ausente = tudo disponível. */
  esgotadas?: string[];
}

export function eixosDa(oferta: Oferta): Eixo[] {
  const dados = oferta.dadosModulo.variantes as DadosVariantes | undefined;
  return dados?.eixos ?? [];
}

function combinacao(oferta: Oferta, selecao: Record<string, unknown>): string {
  return eixosDa(oferta)
    .map((e) => String(selecao[e.nome] ?? ""))
    .join("|");
}

function esgotada(oferta: Oferta, selecao: Record<string, unknown>): boolean {
  const dados = oferta.dadosModulo.variantes as DadosVariantes | undefined;
  if (!dados?.esgotadas?.length) return false;
  return dados.esgotadas.includes(combinacao(oferta, selecao));
}

export const moduloVariantes: Modulo = {
  id: "variantes",
  nome: "Variações",
  descricao: "Tamanho, cor, voltagem — quantos eixos o item precisar.",
  icone: Shirt,

  camposDaOferta: {
    campos: {
      eixos: {
        tipo: "lista",
        rotulo: "Opções que o cliente escolhe",
        max: 3,
        de: {
          nome: { tipo: "texto", rotulo: "Nome da opção", padrao: "Tamanho" },
          valores: { tipo: "texto", rotulo: "Valores", padrao: "P, M, G", dica: "Separados por vírgula." },
        },
        padrao: [],
      },
    },
    paraFormulario: (dados) => ({
      eixos: ((dados as DadosVariantes | undefined)?.eixos ?? []).map((e) => ({
        nome: e.nome,
        valores: e.valores.join(", "),
      })),
    }),
    paraDados: (form) => ({
      eixos: ((form.eixos as { nome?: string; valores?: string }[]) ?? [])
        .filter((e) => e.nome?.trim())
        .map((e) => ({
          nome: String(e.nome).trim(),
          valores: String(e.valores ?? "")
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
        }))
        .filter((e) => e.valores.length > 0),
    }),
  },

  configurador: {
    aplicaA: (oferta) => eixosDa(oferta).length > 0,

    completo: (oferta, selecao) =>
      eixosDa(oferta).every((e) => Boolean(selecao[e.nome])) && !esgotada(oferta, selecao),

    queFalta: (oferta, selecao) => {
      const eixo = eixosDa(oferta).find((e) => !selecao[e.nome]);
      if (eixo) return eixo.nome.toLowerCase();
      return esgotada(oferta, selecao) ? "outra combinação" : undefined;
    },

    resumir: (oferta, selecao) =>
      eixosDa(oferta)
        .map((e) => selecao[e.nome])
        .filter(Boolean)
        .join(" · "),

    Componente: ({ oferta, selecao, definir }) => {
      const eixos = eixosDa(oferta);
      if (!eixos.length) return null;

      return (
        <div className="flex flex-col gap-4">
          {eixos.map((eixo) => (
            <div key={eixo.nome} className="flex flex-col gap-2">
              <Sobrescrito>{eixo.nome}</Sobrescrito>
              <div className="flex flex-wrap gap-2">
                {eixo.valores.map((valor) => {
                  const ativo = selecao[eixo.nome] === valor;
                  const fora = esgotada(oferta, { ...selecao, [eixo.nome]: valor });
                  return (
                    <button
                      key={valor}
                      onClick={() => definir({ [eixo.nome]: valor })}
                      disabled={fora}
                      aria-pressed={ativo}
                      className={`min-h-[44px] min-w-[52px] border px-3.5 text-[13.5px] font-semibold transition ${
                        ativo
                          ? "border-transparent bg-[var(--marca-500)] text-[var(--sobre-marca)]"
                          : fora
                            ? "border-borda text-tinta-25 line-through"
                            : "border-borda-forte bg-papel text-tinta-70 hover:border-tinta-45"
                      }`}
                      style={{ borderRadius: "var(--canto-m)" }}
                    >
                      {valor}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
    },
  },
};
