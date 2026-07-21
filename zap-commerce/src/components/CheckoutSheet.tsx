import { useEffect, useMemo, useState } from "react";
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

const REGEX_PLACA = /^[A-Z]{3}[-\s]?\d[A-Z0-9]\d{2}$/;

function chaveComprador(slug: string) {
  return `zc:comprador:${slug}`;
}

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
  const [placaTocada, setPlacaTocada] = useState(false);
  const [estacionamento, setEstacionamento] = useState("");
  const [cep, setCep] = useState("");
  const [cepTocado, setCepTocado] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [cidadeCep, setCidadeCep] = useState("");
  const [ufCep, setUfCep] = useState("");
  const [comprador, setComprador] = useState<DadosComprador>({ nome: "", cidade: "" });
  const [dadosTocados, setDadosTocados] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(chaveComprador(loja.slug));
      if (salvo) setComprador(JSON.parse(salvo));
    } catch {
      // ignora dado corrompido
    }
  }, [loja.slug]);

  const pontoSelecionado = useMemo(
    () => loja.pontosRetirada.find((p) => p.id === pontoId),
    [loja.pontosRetirada, pontoId],
  );

  async function handleCepBlur() {
    setCepTocado(true);
    if (cep.replace(/\D/g, "").length !== 8) return;
    setBuscandoCep(true);
    setCepNaoEncontrado(false);
    const dados = await buscarEnderecoPorCep(cep);
    setBuscandoCep(false);
    if (dados) {
      setEndereco(`${dados.logradouro}, ${dados.bairro}`);
      setCidadeCep(dados.localidade);
      setUfCep(dados.uf);
      if (!comprador.cidade) {
        setComprador((c) => ({ ...c, cidade: `${dados.localidade} - ${dados.uf}` }));
      }
    } else {
      setCepNaoEncontrado(true);
    }
  }

  const nomeValido = comprador.nome.trim().length > 1;
  const cidadeValida = comprador.cidade.trim().length > 1;
  const cepValido = cep.replace(/\D/g, "").length === 8;
  const excursaoValida = !pontoSelecionado || pontoSelecionado.tipo !== "excursao" || (guia.trim().length > 1 && placaOnibus.trim().length >= 6);

  const formValido =
    nomeValido &&
    cidadeValida &&
    !!pontoSelecionado &&
    excursaoValida &&
    (pontoSelecionado.tipo !== "correios" || cepValido);

  function handleEnviar() {
    setDadosTocados(true);
    setCepTocado(true);
    setPlacaTocada(true);
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

    try {
      localStorage.setItem(chaveComprador(loja.slug), JSON.stringify(comprador));
    } catch {
      // localStorage indisponível — segue sem salvar
    }

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
              onBlur={() => setPlacaTocada(true)}
              className={`rounded-xl border px-3.5 py-3 text-sm ${
                placaTocada && guia.trim().length <= 1 ? "border-brand-400" : "border-black/10"
              }`}
            />
            {placaTocada && guia.trim().length <= 1 && (
              <p className="-mt-1.5 text-xs text-brand-600">Informe o nome do guia da excursão.</p>
            )}
            <input
              placeholder="Placa do Ônibus"
              value={placaOnibus}
              onChange={(e) => setPlacaOnibus(e.target.value.toUpperCase())}
              onBlur={() => setPlacaTocada(true)}
              className={`rounded-xl border px-3.5 py-3 text-sm ${
                placaTocada && placaOnibus.trim().length < 6 ? "border-brand-400" : "border-black/10"
              }`}
            />
            {placaTocada && placaOnibus.trim().length >= 6 && !REGEX_PLACA.test(placaOnibus.replace(/\s/g, "")) && (
              <p className="-mt-1.5 text-xs text-gold-500">
                Confira a placa — formato esperado: ABC1234 ou ABC1D23.
              </p>
            )}
            {placaTocada && placaOnibus.trim().length < 6 && (
              <p className="-mt-1.5 text-xs text-brand-600">Informe a placa do ônibus.</p>
            )}
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
              className={`rounded-xl border px-3.5 py-3 text-sm ${
                cepTocado && !cepValido ? "border-brand-400" : "border-black/10"
              }`}
            />
            {cepTocado && !cepValido && (
              <p className="-mt-1.5 text-xs text-brand-600">Digite um CEP com 8 números.</p>
            )}
            {buscandoCep && <p className="text-xs text-ink/40">Buscando endereço...</p>}
            {endereco && (
              <p className="rounded-lg bg-black/5 px-3 py-2 text-xs text-ink/60">
                {endereco} — {cidadeCep}/{ufCep}
              </p>
            )}
            {cepNaoEncontrado && (
              <p className="rounded-lg bg-gold-500/10 px-3 py-2 text-xs text-gold-500">
                Não encontramos esse CEP, mas tudo bem — o frete é combinado no chat mesmo assim.
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
            onBlur={() => setDadosTocados(true)}
            className={`rounded-xl border px-3.5 py-3 text-sm ${
              dadosTocados && !nomeValido ? "border-brand-400" : "border-black/10"
            }`}
          />
          {dadosTocados && !nomeValido && (
            <p className="-mt-1.5 text-xs text-brand-600">Digite seu nome completo.</p>
          )}
          <input
            placeholder="Sua cidade"
            value={comprador.cidade}
            onChange={(e) => setComprador((c) => ({ ...c, cidade: e.target.value }))}
            onBlur={() => setDadosTocados(true)}
            className={`rounded-xl border px-3.5 py-3 text-sm ${
              dadosTocados && !cidadeValida ? "border-brand-400" : "border-black/10"
            }`}
          />
          {dadosTocados && !cidadeValida && (
            <p className="-mt-1.5 text-xs text-brand-600">Digite sua cidade.</p>
          )}
        </section>

        <button
          onClick={handleEnviar}
          className={`mb-2 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-transform active:scale-95 ${
            formValido ? "bg-ok-500" : "bg-ink/30"
          }`}
        >
          Enviar pedido pelo WhatsApp
        </button>
      </div>
    </BottomSheet>
  );
}
