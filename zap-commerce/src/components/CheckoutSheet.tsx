import { useMemo, useState } from "react";
import type { DadosComprador, LojaConfig, MetodoEntrega, PontoRetirada } from "../types";
import type { LinhaPedido } from "../lib/whatsapp";
import { linkWhatsApp, montarMensagemPedido } from "../lib/whatsapp";
import { buscarEnderecoPorCep } from "../lib/cep";
import { BottomSheet } from "./BottomSheet";

const rotuloTipo: Record<PontoRetirada["tipo"], string> = {
  maos: "Retirada em Mãos",
  excursao: "Envio por Excursão",
  correios: "Transportadora / Correios",
};

export function CheckoutSheet({
  aberto,
  onFechar,
  loja,
  linhas,
  atacadoAtivo,
  regraDescricao,
  total,
  onPedidoEnviado,
}: {
  aberto: boolean;
  onFechar: () => void;
  loja: LojaConfig;
  linhas: LinhaPedido[];
  atacadoAtivo: boolean;
  regraDescricao: string;
  total: number;
  onPedidoEnviado: () => void;
}) {
  const [pontoId, setPontoId] = useState(loja.pontosRetirada[0]?.id ?? "");
  const [guia, setGuia] = useState("");
  const [placaOnibus, setPlacaOnibus] = useState("");
  const [estacionamento, setEstacionamento] = useState("");
  const [cep, setCep] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [cidadeCep, setCidadeCep] = useState("");
  const [ufCep, setUfCep] = useState("");
  const [comprador, setComprador] = useState<DadosComprador>({ nome: "", cidade: "" });

  const pontoSelecionado = useMemo(
    () => loja.pontosRetirada.find((p) => p.id === pontoId),
    [loja.pontosRetirada, pontoId],
  );

  async function handleCepBlur() {
    if (cep.replace(/\D/g, "").length !== 8) return;
    setBuscandoCep(true);
    const dados = await buscarEnderecoPorCep(cep);
    setBuscandoCep(false);
    if (dados) {
      setEndereco(`${dados.logradouro}, ${dados.bairro}`);
      setCidadeCep(dados.localidade);
      setUfCep(dados.uf);
      if (!comprador.cidade) {
        setComprador((c) => ({ ...c, cidade: `${dados.localidade} - ${dados.uf}` }));
      }
    }
  }

  const formValido =
    comprador.nome.trim().length > 1 &&
    comprador.cidade.trim().length > 1 &&
    !!pontoSelecionado &&
    (pontoSelecionado.tipo !== "excursao" || (guia && placaOnibus)) &&
    (pontoSelecionado.tipo !== "correios" || cep.replace(/\D/g, "").length === 8);

  function handleEnviar() {
    if (!pontoSelecionado || !formValido) return;

    let metodo: MetodoEntrega;
    if (pontoSelecionado.tipo === "maos") {
      metodo = { tipo: "maos", pontoId: pontoSelecionado.id };
    } else if (pontoSelecionado.tipo === "excursao") {
      metodo = { tipo: "excursao", guia, placaOnibus, estacionamento: estacionamento || "não informado" };
    } else {
      metodo = { tipo: "correios", cep, endereco, cidade: cidadeCep, uf: ufCep };
    }

    const mensagem = montarMensagemPedido({
      linhas,
      atacadoAplicado: atacadoAtivo,
      regraDescricao,
      total,
      metodo,
      comprador,
      pontoNome: pontoSelecionado.tipo === "maos" ? pontoSelecionado.nome : undefined,
    });

    window.open(linkWhatsApp(loja.whatsappNumero, mensagem), "_blank");
    onPedidoEnviado();
  }

  return (
    <BottomSheet aberto={aberto} onFechar={onFechar} titulo="Finalizar Pedido">
      <div className="flex flex-col gap-5 px-5 py-4">
        <section>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/40">
            Como você quer receber?
          </h3>
          <div className="flex flex-col gap-2">
            {loja.pontosRetirada.map((p) => (
              <label
                key={p.id}
                className={`flex cursor-pointer flex-col rounded-xl border p-3 text-sm transition-colors ${
                  pontoId === p.id ? "border-brand-500 bg-brand-50" : "border-black/10 bg-white"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  <input
                    type="radio"
                    name="ponto"
                    checked={pontoId === p.id}
                    onChange={() => setPontoId(p.id)}
                  />
                  {rotuloTipo[p.tipo]}
                </span>
                <span className="mt-0.5 pl-5 text-xs text-ink/50">{p.nome}</span>
              </label>
            ))}
          </div>
        </section>

        {pontoSelecionado?.tipo === "excursao" && (
          <section className="flex flex-col gap-2.5">
            <input
              placeholder="Nome do Guia"
              value={guia}
              onChange={(e) => setGuia(e.target.value)}
              className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
            />
            <input
              placeholder="Placa do Ônibus"
              value={placaOnibus}
              onChange={(e) => setPlacaOnibus(e.target.value.toUpperCase())}
              className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
            />
            <input
              placeholder="Estacionamento (ex: Centro Oeste)"
              value={estacionamento}
              onChange={(e) => setEstacionamento(e.target.value)}
              className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
            />
          </section>
        )}

        {pontoSelecionado?.tipo === "correios" && (
          <section className="flex flex-col gap-2.5">
            <input
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur}
              inputMode="numeric"
              className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
            />
            {buscandoCep && <p className="text-xs text-ink/40">Buscando endereço...</p>}
            {endereco && (
              <p className="rounded-lg bg-black/5 px-3 py-2 text-xs text-ink/60">
                {endereco} — {cidadeCep}/{ufCep}
              </p>
            )}
            <p className="text-xs text-ink/40">Frete calculado e combinado no chat.</p>
          </section>
        )}

        <section className="flex flex-col gap-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wide text-ink/40">Seus dados</h3>
          <input
            placeholder="Seu nome completo"
            value={comprador.nome}
            onChange={(e) => setComprador((c) => ({ ...c, nome: e.target.value }))}
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
          />
          <input
            placeholder="Sua cidade"
            value={comprador.cidade}
            onChange={(e) => setComprador((c) => ({ ...c, cidade: e.target.value }))}
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
          />
        </section>

        <button
          disabled={!formValido}
          onClick={handleEnviar}
          className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-ok-500 py-3.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar pedido pelo WhatsApp
        </button>
      </div>
    </BottomSheet>
  );
}
