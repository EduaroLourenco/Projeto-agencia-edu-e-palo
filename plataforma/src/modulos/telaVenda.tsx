import { Banknote, Plus, Trash2, Truck } from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { Botao, Campo, Entrada, Sobrescrito } from "../design/Primitivos";
import type { ConfigEntrega, MetodoEntrega } from "./entrega";
import type { FormaPagamento } from "./pagamento";

/**
 * AS TELAS DE ENTREGA, PAGAMENTO E ATACADO
 *
 * Todas existiam só dentro do modelo que criou a loja: nasciam com "Retirar
 * na loja / Entrega" e "PIX / Cartão" e o lojista não tinha onde mexer. Quem
 * só entrega, quem só aceita PIX, quem cobra taxa fixa — nenhum deles
 * conseguia dizer isso, e o checkout perguntava o que não devia.
 */

/* ============================================================
   ENTREGA
   ============================================================ */

const PEDIDOS_DE_CAMPO = [
  { id: "endereco", nome: "Endereço completo" },
  { id: "cep", nome: "CEP" },
  { id: "observacao", nome: "Ponto de referência" },
] as const;

export function TelaEntrega({ loja, onMudar }: { loja: Loja; onMudar: (loja: Loja) => void }) {
  const cfg: ConfigEntrega = (loja.config.entrega as ConfigEntrega) ?? { metodos: [] };
  const modos = cfg.metodos ?? [];

  function salvar(proximos: MetodoEntrega[]) {
    onMudar({ ...loja, config: { ...loja.config, entrega: { ...cfg, metodos: proximos } } });
  }

  function mudar(id: string, patch: Partial<MetodoEntrega>) {
    salvar(modos.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function alternarPede(m: MetodoEntrega, campo: (typeof PEDIDOS_DE_CAMPO)[number]["id"]) {
    const atual = m.pede ?? [];
    mudar(m.id, {
      pede: atual.includes(campo) ? atual.filter((c) => c !== campo) : [...atual, campo],
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-[19px] font-bold tracking-[-0.02em]">Como o cliente recebe</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-tinta-70">
          Cada opção aqui vira uma escolha no fechamento do pedido. Só pergunte endereço em quem
          realmente vai receber em casa.
        </p>
      </header>

      {modos.length === 0 ? (
        <p className="border border-dashed border-borda-forte px-4 py-5 text-center text-[13px] leading-relaxed text-tinta-45"
           style={{ borderRadius: "var(--canto-m)" }}>
          Nenhuma forma cadastrada. Sem nenhuma, o cliente fecha o pedido sem dizer como quer receber.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {modos.map((m) => (
            <div key={m.id} className="flex flex-col gap-2.5 border border-borda p-3.5"
                 style={{ borderRadius: "var(--canto-m)" }}>
              <div className="flex items-start gap-2.5">
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Campo rotulo="Nome que o cliente vê">
                    {(cp) => (
                      <Entrada {...cp} value={m.nome} placeholder="Entrega na sua região"
                               onChange={(e) => mudar(m.id, { nome: e.target.value })} />
                    )}
                  </Campo>
                  <Campo rotulo="Explicação curta" dica="Prazo, região, condição. Uma linha.">
                    {(cp) => (
                      <Entrada {...cp} value={m.descricao ?? ""} placeholder="Até 48h · frete a combinar"
                               onChange={(e) => mudar(m.id, { descricao: e.target.value })} />
                    )}
                  </Campo>
                </div>
                <button
                  onClick={() => salvar(modos.filter((x) => x.id !== m.id))}
                  aria-label={`Remover ${m.nome}`}
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-tinta-45 transition hover:text-erro"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div>
                <Sobrescrito>O que pedir nesta opção</Sobrescrito>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PEDIDOS_DE_CAMPO.map((c) => {
                    const ativo = (m.pede ?? []).includes(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => alternarPede(m, c.id)}
                        aria-pressed={ativo}
                        className={`min-h-[40px] border px-3 text-[12.5px] font-semibold transition ${
                          ativo
                            ? "border-transparent bg-[var(--marca-500)] text-[var(--sobre-marca)]"
                            : "border-borda bg-papel text-tinta-45 hover:border-borda-forte"
                        }`}
                        style={{ borderRadius: "999px" }}
                      >
                        {c.nome}
                      </button>
                    );
                  })}
                </div>
                {(m.pede ?? []).length === 0 && (
                  <p className="mt-2 text-[12px] text-tinta-45">
                    Nada marcado: serve para retirada no balcão.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Botao
        tom="contorno"
        onClick={() =>
          salvar([...modos, { id: `e_${Date.now().toString(36)}`, nome: "", descricao: "", pede: [] }])
        }
      >
        <Plus size={16} />
        Adicionar forma de receber
      </Botao>
    </div>
  );
}

export const telaEntrega = { id: "entrega-cfg", nome: "Entrega", icone: Truck, Componente: TelaEntrega };

/* ============================================================
   PAGAMENTO
   ============================================================ */

const SUGESTOES = ["PIX", "Cartão na entrega", "Dinheiro", "Boleto 28 dias", "Cartão no local"];

export function TelaPagamento({ loja, onMudar }: { loja: Loja; onMudar: (loja: Loja) => void }) {
  const cfg = (loja.config.pagamento as { formas?: FormaPagamento[] }) ?? {};
  const formas = cfg.formas ?? [];

  function salvar(proximas: FormaPagamento[]) {
    onMudar({ ...loja, config: { ...loja.config, pagamento: { ...cfg, formas: proximas } } });
  }

  const jaTem = (nome: string) => formas.some((f) => f.nome.toLowerCase() === nome.toLowerCase());

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="font-display text-[19px] font-bold tracking-[-0.02em]">Como o cliente paga</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-tinta-70">
          Estas opções aparecem no fechamento e vão escritas na mensagem do WhatsApp. O pagamento
          em si continua sendo combinado por lá.
        </p>
      </header>

      {formas.length === 0 ? (
        <p className="border border-dashed border-borda-forte px-4 py-5 text-center text-[13px] leading-relaxed text-tinta-45"
           style={{ borderRadius: "var(--canto-m)" }}>
          Sem nenhuma forma cadastrada, o passo de pagamento nem aparece no fechamento.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {formas.map((f) => (
            <div key={f.id} className="flex items-start gap-2.5 border border-borda p-3"
                 style={{ borderRadius: "var(--canto-m)" }}>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Campo rotulo="Forma">
                  {(cp) => (
                    <Entrada
                      {...cp}
                      value={f.nome}
                      placeholder="PIX"
                      onChange={(e) => salvar(formas.map((x) => (x.id === f.id ? { ...x, nome: e.target.value } : x)))}
                    />
                  )}
                </Campo>
                <Campo rotulo="Instrução" dica="Ex.: a chave vai na confirmação. Deixe vazio se não precisar.">
                  {(cp) => (
                    <Entrada
                      {...cp}
                      value={f.descricao ?? ""}
                      placeholder="Mandamos a chave na confirmação"
                      onChange={(e) =>
                        salvar(formas.map((x) => (x.id === f.id ? { ...x, descricao: e.target.value } : x)))
                      }
                    />
                  )}
                </Campo>
              </div>
              <button
                onClick={() => salvar(formas.filter((x) => x.id !== f.id))}
                aria-label={`Remover ${f.nome}`}
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-tinta-45 transition hover:text-erro"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <Sobrescrito>Adicionar rápido</Sobrescrito>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGESTOES.filter((s) => !jaTem(s)).map((s) => (
            <button
              key={s}
              onClick={() => salvar([...formas, { id: `f_${Date.now().toString(36)}`, nome: s }])}
              className="min-h-[40px] border border-borda bg-papel px-3 text-[12.5px] font-semibold text-tinta-70 transition hover:border-borda-forte"
              style={{ borderRadius: "999px" }}
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      <Botao
        tom="contorno"
        onClick={() => salvar([...formas, { id: `f_${Date.now().toString(36)}`, nome: "" }])}
      >
        <Plus size={16} />
        Outra forma
      </Botao>
    </div>
  );
}

export const telaPagamento = {
  id: "pagamento-cfg",
  nome: "Pagamento",
  icone: Banknote,
  Componente: TelaPagamento,
};
