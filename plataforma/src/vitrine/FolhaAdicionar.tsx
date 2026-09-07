import { useEffect, useMemo, useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Loja, Oferta } from "../nucleo/tipos";
import { modulosAtivos } from "../nucleo/registro";
import { formatarReal } from "../nucleo/preco";
import { Botao, Folha, Stepper } from "../design/Primitivos";
import { Foto } from "../blocos/pecas";

/**
 * A folha de escolha, aberta pelo "+" de qualquer cartão.
 *
 * Ela não sabe se está pedindo tamanho ou horário: pergunta ao módulo qual
 * é o configurador da oferta e desenha ele. É o mesmo componente pra uma
 * calça e pra um corte de cabelo.
 */
export function FolhaAdicionar({
  oferta,
  loja,
  onFechar,
  onAdicionar,
}: {
  oferta: Oferta | null;
  loja: Loja;
  onFechar: () => void;
  onAdicionar: (oferta: Oferta, selecao: Record<string, unknown>, quantidade: number) => void;
}) {
  const [selecao, setSelecao] = useState<Record<string, unknown>>({});
  const [quantidade, setQuantidade] = useState(1);

  // Cada oferta abre limpa: seleção de uma não vaza pra outra.
  useEffect(() => {
    setSelecao({});
    setQuantidade(1);
  }, [oferta?.id]);

  const configurador = useMemo(
    () => (oferta ? modulosAtivos(loja.modulos).find((m) => m.configurador?.aplicaA(oferta))?.configurador : undefined),
    [oferta, loja.modulos],
  );

  if (!oferta) return null;
  const completo = configurador ? configurador.completo(oferta, selecao) : true;

  return (
    <Folha
      aberta
      onFechar={onFechar}
      titulo={oferta.nome}
      subtitulo={oferta.resumo}
      rodape={
        <div className="flex items-center gap-3">
          <Stepper valor={quantidade} onMudar={setQuantidade} min={1} />
          <Botao
            largo
            disabled={!completo}
            onClick={() => {
              onAdicionar(oferta, selecao, quantidade);
              onFechar();
            }}
          >
            <ShoppingBag size={17} />
            {completo ? `Adicionar · ${formatarReal(oferta.precoBase * quantidade)}` : "Escolha as opções"}
          </Botao>
        </div>
      }
    >
      <div className="flex flex-col gap-5 pt-1">
        <div className="flex items-center gap-3.5">
          <Foto oferta={oferta} className="h-20 w-20 shrink-0" prioridade />
          <div className="min-w-0">
            <p className="num-tab font-display text-[20px] font-extrabold tracking-tight">
              {formatarReal(oferta.precoBase)}
            </p>
            {oferta.tipo === "servico" && <p className="text-[12.5px] text-tinta-45">por sessão</p>}
          </div>
        </div>

        {configurador && (
          <configurador.Componente
            oferta={oferta}
            selecao={selecao}
            definir={(patch) => setSelecao((prev) => ({ ...prev, ...patch }))}
            loja={loja}
          />
        )}

        {oferta.descricao && (
          <p className="whitespace-pre-line border-t border-borda pt-4 text-[13.5px] leading-relaxed text-tinta-70">
            {oferta.descricao}
          </p>
        )}
      </div>
    </Folha>
  );
}
