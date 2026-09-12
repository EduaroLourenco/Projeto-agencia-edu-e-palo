import { bloco as buscarBloco, propsPadrao } from "../nucleo/registro";
import { PAGINAS } from "../paginas/definicoes";
import type { BlocoNaPagina, Loja, Oferta, TipoPagina } from "../nucleo/tipos";
import { vestirBloco } from "./estiloDeBloco";

/**
 * Monta uma página a partir da lista de blocos.
 *
 * As âncoras não estão na lista salva da loja — elas vêm da definição da
 * página e são intercaladas na ordem certa. É isso que impede alguém de
 * apagar o botão de comprar arrastando errado no estúdio.
 */

export function ordenarComAncoras(pagina: TipoPagina, blocos: BlocoNaPagina[]): BlocoNaPagina[] {
  const def = PAGINAS[pagina];
  const saida: BlocoNaPagina[] = [];

  // Âncora não entra nos espaços livres: ela tem lugar próprio.
  const tiposAncora = new Set(def.ancoras);
  const livres = blocos.filter((b) => !tiposAncora.has(b.tipo));
  const noEspaco = (espacoId: string) => livres.filter((b) => (b.props.__espaco ?? "corpo") === espacoId);

  // Antes da primeira âncora
  const primeiro = def.espacos.find((e) => e.depoisDaAncora === null);
  if (primeiro) saida.push(...noEspaco(primeiro.id));

  for (const ancora of def.ancoras) {
    // Âncora também tem campos com valor padrão — a busca do catálogo é um
    // deles. Injetar `props: {}` fazia esses padrões nunca chegarem.
    // Se a loja salvou uma configuração pra esta âncora, ela ganha.
    const salva = blocos.find((b) => b.tipo === ancora);
    const definicao = buscarBloco(ancora);
    saida.push(
      salva ?? {
        id: `ancora-${ancora}`,
        tipo: ancora,
        props: definicao ? propsPadrao(definicao) : {},
      },
    );
    const espaco = def.espacos.find((e) => e.depoisDaAncora === ancora);
    if (espaco) saida.push(...noEspaco(espaco.id));
  }

  // Página sem âncora nenhuma (início): tudo é livre.
  if (def.ancoras.length === 0 && !primeiro) saida.push(...blocos);

  return saida;
}

export function Montador({
  pagina,
  blocos,
  loja,
  ofertas,
  oferta,
  editando = false,
  envolver,
}: {
  pagina: TipoPagina;
  blocos: BlocoNaPagina[];
  loja: Loja;
  ofertas: Oferta[];
  oferta?: Oferta;
  editando?: boolean;
  /** O estúdio usa pra pôr a moldura de edição em volta de cada bloco. */
  envolver?: (b: BlocoNaPagina, conteudo: React.ReactNode, ehAncora: boolean) => React.ReactNode;
}) {
  /**
   * Bloco escondido some da loja — mas não do editor.
   *
   * Tirar ele daqui no modo de edição era um caminho sem volta: o lojista
   * tocava no olho, o bloco desaparecia inteiro e não existia mais botão
   * pra trazer de volta. No estúdio ele continua na lista, apagado.
   */
  const lista = ordenarComAncoras(pagina, editando ? blocos : blocos.filter((b) => !b.oculto));

  return (
    <div className="flex flex-col" style={{ gap: "var(--gap)" }}>
      {lista.map((b) => {
        const def = buscarBloco(b.tipo);
        if (!def) {
          return editando ? (
            <div key={b.id} className="border border-dashed border-erro/40 bg-erro-fraco px-4 py-3 text-[12.5px] text-erro" style={{ borderRadius: "var(--canto-m)" }}>
              Bloco "{b.tipo}" não existe mais.
            </div>
          ) : null;
        }

        const Componente = def.Componente;
        const conteudo = (
          <Componente
            props={b.props as never}
            loja={loja}
            ofertas={ofertas}
            oferta={oferta}
            editando={editando}
          />
        );

        // O estilo da seção (fundo, respiro, moldura) veste o conteúdo por
        // fora. O invólucro de edição do estúdio vem depois, por cima — se
        // fosse antes, a moldura de seleção herdava o fundo do bloco.
        const vestido = vestirBloco(b.estilo);
        const vestido_conteudo = vestido ? (
          <div style={vestido.estilo}>
            <div style={vestido.interno}>{conteudo}</div>
          </div>
        ) : (
          conteudo
        );

        return (
          <div key={b.id}>
            {envolver ? envolver(b, vestido_conteudo, Boolean(def.ancora)) : vestido_conteudo}
          </div>
        );
      })}
    </div>
  );
}
