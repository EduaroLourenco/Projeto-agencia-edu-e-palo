import { useState } from "react";
import type { LojaConfig, PontoRetirada, TipoPontoRetirada } from "../../types";
import { ApiError, atualizarLoja } from "../../lib/api";
import { ErrorToast } from "../../components/ErrorToast";

const ROTULOS: Record<TipoPontoRetirada, string> = {
  maos: "Retirada em Mãos",
  excursao: "Envio por Excursão",
  correios: "Transportadora/Correios",
};

function uid() {
  return `pr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function StoreSettings({
  token,
  loja,
  onMudou,
}: {
  token: string;
  loja: LojaConfig;
  onMudou: () => void;
}) {
  const [rascunho, setRascunho] = useState<LojaConfig>(loja);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erroApi, setErroApi] = useState<string | null>(null);

  async function salvar() {
    setSalvando(true);
    try {
      await atualizarLoja(token, rascunho);
      setSalvo(true);
      onMudou();
      setTimeout(() => setSalvo(false), 1800);
    } catch (e) {
      setErroApi(
        e instanceof ApiError ? e.message : "Não foi possível salvar. Confira sua conexão e tente de novo.",
      );
    } finally {
      setSalvando(false);
    }
  }

  function atualizarPonto(id: string, patch: Partial<PontoRetirada>) {
    setRascunho((r) => ({
      ...r,
      pontosRetirada: r.pontosRetirada.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  }

  function removerPonto(id: string) {
    setRascunho((r) => ({ ...r, pontosRetirada: r.pontosRetirada.filter((p) => p.id !== id) }));
  }

  function adicionarPonto(tipo: TipoPontoRetirada) {
    setRascunho((r) => ({
      ...r,
      pontosRetirada: [...r.pontosRetirada, { id: uid(), tipo, nome: ROTULOS[tipo], descricao: "" }],
    }));
  }

  return (
    <div className="flex flex-col gap-6 px-4 pb-28 pt-4 lg:max-w-2xl lg:px-0 lg:pb-8 lg:pt-0">
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold lg:text-xl">Dados da loja</h2>
        <label className="flex items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-sm font-medium">
          Loja aberta para pedidos
          <input
            type="checkbox"
            checked={rascunho.aberto}
            onChange={(e) => setRascunho((r) => ({ ...r, aberto: e.target.checked }))}
            className="h-5 w-5"
          />
        </label>
        <input
          value={rascunho.nomeLoja}
          onChange={(e) => setRascunho((r) => ({ ...r, nomeLoja: e.target.value }))}
          placeholder="Nome da loja"
          className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
        />
        <input
          value={rascunho.whatsappNumero}
          onChange={(e) => setRascunho((r) => ({ ...r, whatsappNumero: e.target.value.replace(/\D/g, "") }))}
          placeholder="WhatsApp (só números, com DDI+DDD)"
          className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold">Regra de atacado</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setRascunho((r) => ({ ...r, regraAtacado: { ...r.regraAtacado, tipo: "quantidade" } }))}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold ${
              rascunho.regraAtacado.tipo === "quantidade" ? "border-ink bg-ink text-white" : "border-black/10"
            }`}
          >
            Por quantidade
          </button>
          <button
            onClick={() => setRascunho((r) => ({ ...r, regraAtacado: { ...r.regraAtacado, tipo: "valor" } }))}
            className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold ${
              rascunho.regraAtacado.tipo === "valor" ? "border-ink bg-ink text-white" : "border-black/10"
            }`}
          >
            Por valor mínimo
          </button>
        </div>
        <input
          value={rascunho.regraAtacado.minimo}
          onChange={(e) =>
            setRascunho((r) => ({
              ...r,
              regraAtacado: { ...r.regraAtacado, minimo: Number(e.target.value) || 0 },
            }))
          }
          inputMode="numeric"
          placeholder={rascunho.regraAtacado.tipo === "quantidade" ? "Mínimo de peças (ex: 6)" : "Valor mínimo em R$ (ex: 300)"}
          className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-display text-base font-bold">Pontos de entrega</h2>
        {rascunho.pontosRetirada.map((p) => (
          <div key={p.id} className="flex flex-col gap-2 rounded-xl border border-black/10 p-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-ink/40">
              {ROTULOS[p.tipo]}
            </span>
            <input
              value={p.nome}
              onChange={(e) => atualizarPonto(p.id, { nome: e.target.value })}
              className="rounded-lg border border-black/10 px-3 py-2 text-sm"
              placeholder="Nome do ponto"
            />
            <input
              value={p.descricao ?? ""}
              onChange={(e) => atualizarPonto(p.id, { descricao: e.target.value })}
              className="rounded-lg border border-black/10 px-3 py-2 text-sm"
              placeholder="Descrição (opcional)"
            />
            <button
              onClick={() => removerPonto(p.id)}
              className="self-start text-xs font-semibold text-brand-600"
            >
              Remover ponto
            </button>
          </div>
        ))}
        <div className="flex gap-2">
          {(["maos", "excursao", "correios"] as TipoPontoRetirada[]).map((t) => (
            <button
              key={t}
              onClick={() => adicionarPonto(t)}
              className="flex-1 rounded-lg border border-dashed border-black/20 py-2 text-xs font-semibold text-ink/60"
            >
              + {ROTULOS[t]}
            </button>
          ))}
        </div>
      </section>

      <button
        onClick={salvar}
        disabled={salvando}
        className={`rounded-xl py-3.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:opacity-60 ${
          salvo ? "bg-ok-500" : "bg-brand-500"
        }`}
      >
        {salvando ? "Salvando..." : salvo ? "Configurações salvas ✓" : "Salvar configurações"}
      </button>

      <ErrorToast mensagem={erroApi} onFechar={() => setErroApi(null)} />
    </div>
  );
}
