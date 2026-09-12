import { useState } from "react";
import { CircleHelp, MessageCircle, X } from "lucide-react";

/**
 * O BOTÃO DE DÚVIDA
 *
 * Fica em cima de tudo, sempre no mesmo canto. A regra que ele obedece é
 * uma só: quem abre aqui não quer ler manual, quer saber qual é o próximo
 * toque. Por isso são seis passos numerados e nenhuma palavra de sistema —
 * nada de "bloco", "instância", "publicar rascunho".
 */

export const PASSOS_AJUDA: { titulo: string; texto: string }[] = [
  {
    titulo: "Escolha o que a loja vende",
    texto:
      "Na aba Estúdio, toque em Montar uma loja. Produtos, serviços com agenda ou atacado — isso liga as ferramentas certas pra você.",
  },
  {
    titulo: "Escolha a cara dela",
    texto:
      "Seis estilos prontos: do mais direto ao mais elegante. Dá pra trocar a cor da marca ali mesmo, e mudar tudo depois.",
  },
  {
    titulo: "Cadastre os seus itens",
    texto:
      "Na aba Itens, apague os exemplos e coloque os seus: nome, foto, preço. A foto entra pelo celular e é reduzida sozinha.",
  },
  {
    titulo: "Monte as páginas",
    texto:
      "No Estúdio, toque em Montar. Cada pedaço da página é um bloco: toque pra editar, segure pra arrastar, use o + pra colocar outro.",
  },
  {
    titulo: "Publique",
    texto:
      "Enquanto você mexe, nada muda pro cliente. Quando gostar, toque em Publicar — aí sim a loja no ar vira o que você montou.",
  },
  {
    titulo: "Receba os pedidos",
    texto:
      "O cliente monta a sacola e finaliza no WhatsApp. O pedido cai na aba Pedidos com a mensagem inteira, e você vai marcando: confirmado, separando, entregue.",
  },
];

export function BotaoDuvida() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        aria-label="Como funciona"
        className="fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-[var(--p-borda-forte)] bg-[var(--p-superficie-2)]/92 text-[var(--p-texto-2)] shadow-[0_8px_24px_-8px_rgba(0,0,0,.7)] backdrop-blur-xl transition hover:text-[var(--p-texto)]"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.6rem)" }}
      >
        <CircleHelp size={21} />
      </button>

      {aberto && <FolhaAjuda onFechar={() => setAberto(false)} />}
    </>
  );
}

export function FolhaAjuda({ onFechar }: { onFechar: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button aria-label="Fechar" onClick={onFechar} className="anima-surgir absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="anima-subir relative mx-auto flex max-h-[88dvh] w-full max-w-lg flex-col rounded-t-[22px] border-t border-[var(--p-borda-forte)] bg-[var(--p-superficie)]">
        <div className="flex shrink-0 items-start gap-3 px-5 pb-2 pt-5">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[19px] font-bold tracking-[-0.028em]">Como funciona</h2>
            <p className="mt-0.5 text-[12.5px] text-[var(--p-texto-3)]">Seis passos, do zero à primeira venda.</p>
          </div>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="-mr-1 -mt-1 flex h-9 w-9 items-center justify-center rounded-full text-[var(--p-texto-3)] hover:bg-[var(--p-superficie-2)]"
          >
            <X size={19} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-2">
          <PassoAPasso />

          <a
            href="https://wa.me/5516999999999"
            target="_blank"
            rel="noreferrer"
            className="mt-6 flex items-center gap-3 rounded-[16px] border border-dashed border-[var(--p-borda-forte)] px-4 py-3.5 transition hover:bg-[var(--p-superficie-2)]"
          >
            <MessageCircle size={18} className="shrink-0 text-[var(--p-acento-claro)]" />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-semibold">Ainda ficou com dúvida?</span>
              <span className="mt-0.5 block text-[11.5px] text-[var(--p-texto-3)]">
                Chama a gente no WhatsApp que a gente monta junto.
              </span>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * A lista numerada.
 *
 * O fio vertical ligando os números existe porque a pessoa precisa ler isto
 * como uma ordem, não como seis dicas soltas.
 */
export function PassoAPasso() {
  return (
    <ol className="flex flex-col">
      {PASSOS_AJUDA.map((p, i) => (
        <li key={p.titulo} className="relative flex gap-3.5 pb-5 last:pb-0">
          {i < PASSOS_AJUDA.length - 1 && (
            <span aria-hidden className="absolute left-[13px] top-8 bottom-1 w-px bg-[var(--p-borda-forte)]" />
          )}
          <span
            className="num-tab relative z-10 flex h-[27px] w-[27px] shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
            style={{ background: "linear-gradient(150deg,var(--p-acento-claro),var(--p-acento))" }}
          >
            {i + 1}
          </span>
          <span className="min-w-0 flex-1 pt-0.5">
            <span className="block text-[14px] font-bold leading-tight">{p.titulo}</span>
            <span className="mt-1 block text-[12.5px] leading-relaxed text-[var(--p-texto-2)]">{p.texto}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}
