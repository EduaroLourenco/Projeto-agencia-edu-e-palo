import { bloco as buscarBloco } from "../nucleo/registro";
import { PAGINAS } from "../paginas/definicoes";
import type { BlocoNaPagina, Loja, Oferta, TipoPagina } from "../nucleo/tipos";

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

  const noEspaco = (espacoId: string) => blocos.filter((b) => (b.props.__espaco ?? "corpo") === espacoId);

  // Antes da primeira âncora
  const primeiro = def.espacos.find((e) => e.depoisDaAncora === null);
  if (primeiro) saida.push(...noEspaco(primeiro.id));

  for (const ancora of def.ancoras) {
    saida.push({ id: `ancora-${ancora}`, tipo: ancora, props: {} });
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
  const lista = ordenarComAncoras(pagina, blocos.filter((b) => !b.oculto));

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

        return (
          <div key={b.id}>{envolver ? envolver(b, conteudo, Boolean(def.ancora)) : conteudo}</div>
        );
      })}
    </div>
  );
}
