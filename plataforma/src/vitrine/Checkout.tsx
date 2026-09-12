import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, MessageCircle } from "lucide-react";
import type { ClienteIdentificado, DadosCheckout, ErroCheckout, Loja, ResumoSacola } from "../nucleo/tipos";
import { passosDoCheckout, validarPasso } from "../nucleo/checkout";
import { linkWhatsApp, montarMensagem } from "../nucleo/mensagem";
import { formatarReal } from "../nucleo/preco";
import { salvarPedido } from "../nucleo/pedidos";
import { Aviso, Botao, Folha } from "../design/Primitivos";

/**
 * A esteira.
 *
 * Um passo por vez, porque no celular formulário comprido faz a pessoa
 * desistir no meio. O núcleo só sabe abrir, avançar e fechar — o conteúdo
 * de cada passo é do módulo que registrou ele.
 *
 * A validação roda ao tentar avançar, não ao digitar: corrigir enquanto a
 * pessoa ainda está escrevendo é o que faz formulário parecer hostil.
 */
export function Checkout({
  aberto,
  onFechar,
  loja,
  resumo,
  onEnviado,
  onCliente,
}: {
  aberto: boolean;
  onFechar: () => void;
  loja: Loja;
  resumo: ResumoSacola;
  onEnviado: () => void;
  onCliente: (c: ClienteIdentificado | undefined) => void;
}) {
  const [indice, setIndice] = useState(0);
  const [dados, setDados] = useState<DadosCheckout>({});
  const [erros, setErros] = useState<ErroCheckout[]>([]);

  const passos = useMemo(() => passosDoCheckout(loja, resumo.linhas), [loja, resumo.linhas]);

  if (!aberto) return null;

  // Loja sem nenhum módulo de checkout: manda direto, sem cerimônia.
  if (passos.length === 0) {
    return (
      <Folha aberta onFechar={onFechar} titulo="Enviar pedido" rodape={<BotaoEnviar />}>
        <Revisao resumo={resumo} />
      </Folha>
    );
  }

  const ultimo = indice >= passos.length;
  const passo = passos[indice];

  function avancar() {
    const encontrados = validarPasso(passo, dados, loja, resumo.linhas);
    if (encontrados.length) {
      setErros(encontrados);
      return;
    }
    setErros([]);
    setIndice((i) => i + 1);
  }

  function voltar() {
    setErros([]);
    setIndice((i) => Math.max(0, i - 1));
  }

  function enviar() {
    const mensagem = montarMensagem({ loja, linhas: resumo.linhas, total: resumo.total, passos, dados });
    // Grava E abre o WhatsApp. Sem o histórico não existe "repetir pedido",
    // que é o botão que o comprador B2B mais usa.
    salvarPedido({ lojaSlug: loja.slug, linhas: resumo.linhas, total: resumo.total, passos: dados, mensagem });
    window.open(linkWhatsApp(loja.whatsapp, mensagem), "_blank", "noopener");
    onEnviado();
  }

  function BotaoEnviar() {
    return (
      <Botao largo onClick={enviar}>
        <MessageCircle size={18} />
        Enviar no WhatsApp
      </Botao>
    );
  }

  return (
    <Folha
      aberta
      onFechar={onFechar}
      altura="quase-cheia"
      titulo={ultimo ? "Conferir e enviar" : passo.titulo}
      subtitulo={ultimo ? "Última olhada antes de mandar." : passo.subtitulo}
      rodape={
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-tinta-45">
              {resumo.totalItens} {resumo.totalItens === 1 ? "item" : "itens"}
            </span>
            <span className="num-tab font-display text-[18px] font-extrabold tracking-tight">
              {formatarReal(resumo.total)}
            </span>
          </div>

          <div className="flex gap-2.5">
            {indice > 0 && (
              <Botao tom="contorno" onClick={voltar} aria-label="Voltar">
                <ArrowLeft size={17} />
              </Botao>
            )}
            {ultimo ? (
              <BotaoEnviar />
            ) : (
              <Botao largo onClick={avancar}>
                Continuar
                <ArrowRight size={17} />
              </Botao>
            )}
          </div>
        </div>
      }
    >
      {/* Onde estou na esteira. Sem isso a pessoa não sabe se falta muito. */}
      <div className="mb-5 flex gap-1.5 pt-1">
        {[...passos, { id: "revisao" }].map((p, i) => (
          <span
            key={p.id}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= indice ? "bg-[var(--marca-grafico)]" : "bg-papel-3"
            }`}
          />
        ))}
      </div>

      {erros.length > 0 && (
        <div className="mb-4 flex flex-col gap-2">
          {erros
            .filter((e) => !e.campo)
            .map((e, i) => (
              <Aviso key={i} nivel="erro">
                {e.mensagem}
              </Aviso>
            ))}
        </div>
      )}

      {ultimo ? (
        <Revisao resumo={resumo} />
      ) : (
        <passo.Componente
          dados={dados[passo.id] ?? {}}
          definir={(patch) =>
            setDados((prev) => {
              const atualizado = { ...prev, [passo.id]: { ...(prev[passo.id] ?? {}), ...patch } };
              // Identificou o comprador? O preço recalcula antes de ele avançar.
              if (passo.identificarCliente) {
                onCliente(passo.identificarCliente(atualizado[passo.id]) ?? undefined);
              }
              return atualizado;
            })
          }
          erros={erros}
          loja={loja}
          linhas={resumo.linhas}
        />
      )}
    </Folha>
  );
}

function Revisao({ resumo }: { resumo: ResumoSacola }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col divide-y divide-borda border border-borda bg-papel px-4" style={{ borderRadius: "var(--canto-g)" }}>
        {resumo.linhas.map((l) => (
          <div key={l.linha.chave} className="flex items-start justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-[13.5px] font-semibold leading-tight">
                <span className="num-tab text-tinta-45">{l.linha.quantidade}× </span>
                {l.oferta.nome}
              </p>
              {l.resumoSelecao && <p className="mt-0.5 text-[12.5px] text-tinta-45">{l.resumoSelecao}</p>}
            </div>
            <p className="num-tab shrink-0 text-[13.5px] font-semibold">{formatarReal(l.subtotal)}</p>
          </div>
        ))}
      </div>

      <p className="text-[12.5px] leading-relaxed text-tinta-45">
        Ao enviar, abrimos o WhatsApp com esta mensagem pronta. Nada é cobrado agora — o valor final é
        confirmado na conversa.
      </p>
    </div>
  );
}
