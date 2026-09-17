import { Building2, Plus, Trash2 } from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { Botao, Campo, Entrada, Sobrescrito } from "../design/Primitivos";
import { formatarReal } from "../nucleo/preco";
import type { ConfigB2B, Faixa } from "./b2b";

/**
 * AS REGRAS DO ATACADO
 *
 * Pedido mínimo e faixa de desconto nasciam cravados no modelo — R$ 300 e
 * dois degraus — e não havia onde mexer. Quem trabalha com mínimo de R$ 1.000
 * ou dá desconto diferente simplesmente não conseguia usar o recurso.
 */

export function TelaAtacado({ loja, onMudar }: { loja: Loja; onMudar: (loja: Loja) => void }) {
  const cfg: ConfigB2B = (loja.config.b2b as ConfigB2B) ?? {};
  const faixas = cfg.faixas ?? [];

  function salvar(patch: Partial<ConfigB2B>) {
    onMudar({ ...loja, config: { ...loja.config, b2b: { ...cfg, ...patch } } });
  }

  function mudarFaixa(i: number, patch: Partial<Faixa>) {
    salvar({ faixas: faixas.map((f, n) => (n === i ? { ...f, ...patch } : f)) });
  }

  // Ordenadas na exibição, não na gravação: reordenar enquanto a pessoa
  // digita faria o campo pular de lugar embaixo do dedo dela.
  const foraDeOrdem = faixas.some((f, i) => i > 0 && f.min <= faixas[i - 1].min);

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h2 className="font-display text-[19px] font-bold tracking-[-0.02em]">Regras de atacado</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-tinta-70">
          Valem para a loja inteira. Caixa fechada e quantidade mínima de cada item ficam no
          próprio item, em Catálogo.
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <Sobrescrito>Pedido mínimo</Sobrescrito>
        <Campo
          rotulo="Valor mínimo do pedido"
          dica="Abaixo disso a sacola avisa e não deixa fechar. Deixe 0 para não exigir mínimo."
        >
          {(cp) => (
            <Entrada
              {...cp}
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              className="num-tab"
              value={cfg.pedidoMinimo ?? 0}
              onChange={(e) => salvar({ pedidoMinimo: Math.max(0, Number(e.target.value) || 0) })}
            />
          )}
        </Campo>
        {(cfg.pedidoMinimo ?? 0) > 0 && (
          <p className="text-[12.5px] text-tinta-45">
            O cliente vê: “Faltam X para o mínimo de {formatarReal(cfg.pedidoMinimo ?? 0)}”.
          </p>
        )}

        <label className="flex min-h-[52px] cursor-pointer items-center gap-3 border border-borda px-3.5"
               style={{ borderRadius: "var(--canto-m)" }}>
          <input
            type="checkbox"
            className="h-5 w-5 shrink-0 accent-[var(--marca-500)]"
            checked={Boolean(cfg.exigirIdentificacao)}
            onChange={(e) => salvar({ exigirIdentificacao: e.target.checked })}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-semibold">Exigir identificação do comprador</span>
            <span className="mt-0.5 block text-[12px] text-tinta-45">
              Pede CNPJ ou código de cliente antes de fechar.
            </span>
          </span>
        </label>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Sobrescrito>Desconto por quantidade</Sobrescrito>
          <span className="num-tab text-[12px] text-tinta-45">
            {faixas.length} {faixas.length === 1 ? "faixa" : "faixas"}
          </span>
        </div>
        <p className="text-[12.5px] leading-relaxed text-tinta-45">
          “A partir de N peças no pedido, X% de desconto.” Vale a faixa mais alta que o pedido
          alcançar.
        </p>

        {faixas.length > 0 && (
          <div className="flex flex-col gap-2.5">
            {faixas.map((f, i) => (
              <div key={i} className="flex items-end gap-2.5 border border-borda p-3"
                   style={{ borderRadius: "var(--canto-m)" }}>
                <div className="min-w-0 flex-1">
                  <Campo rotulo="A partir de">
                    {(cp) => (
                      <Entrada
                        {...cp}
                        type="number"
                        inputMode="numeric"
                        min={1}
                        className="num-tab"
                        value={f.min}
                        onChange={(e) => mudarFaixa(i, { min: Math.max(1, Number(e.target.value) || 1) })}
                      />
                    )}
                  </Campo>
                </div>
                <div className="min-w-0 flex-1">
                  <Campo rotulo="Desconto %">
                    {(cp) => (
                      <Entrada
                        {...cp}
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={90}
                        className="num-tab"
                        value={f.desconto}
                        onChange={(e) =>
                          mudarFaixa(i, { desconto: Math.min(90, Math.max(0, Number(e.target.value) || 0)) })
                        }
                      />
                    )}
                  </Campo>
                </div>
                <button
                  onClick={() => salvar({ faixas: faixas.filter((_, n) => n !== i) })}
                  aria-label={`Remover faixa a partir de ${f.min}`}
                  className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center text-tinta-45 transition hover:text-erro"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {foraDeOrdem && (
          <p className="text-[12.5px] font-semibold text-atencao">
            As faixas precisam subir: cada “a partir de” tem que ser maior que o anterior.
          </p>
        )}

        <Botao
          tom="contorno"
          onClick={() => {
            const ultima = faixas[faixas.length - 1];
            salvar({
              faixas: [
                ...faixas,
                { min: ultima ? ultima.min + 30 : 30, desconto: ultima ? ultima.desconto + 3 : 3 },
              ],
            });
          }}
        >
          <Plus size={16} />
          Adicionar faixa
        </Botao>
      </section>
    </div>
  );
}

export const telaAtacado = {
  id: "atacado-cfg",
  nome: "Atacado",
  icone: Building2,
  Componente: TelaAtacado,
};
