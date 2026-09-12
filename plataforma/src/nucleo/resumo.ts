import { modulosAtivos } from "./registro";
import { regraArredondar, resolverPreco } from "./preco";
import type {
  AvisoSacola,
  ClienteIdentificado,
  LinhaResolvida,
  LinhaSacola,
  Loja,
  RegraPreco,
  ResumoSacola,
} from "./tipos";

/**
 * Junta sacola + ofertas + módulos e devolve tudo que a UI precisa.
 *
 * É a peça que substitui o `calcularResumoPedido` do v1. A diferença: o v1
 * conhecia a regra de atacado por dentro; aqui a lista de regras e a lista de
 * avisos vêm dos módulos ligados na loja.
 */
export function montarResumo(
  linhasSacola: LinhaSacola[],
  loja: Loja,
  cliente?: ClienteIdentificado,
): ResumoSacola {
  const modulos = modulosAtivos(loja.modulos);
  const porId = new Map(loja.ofertas.map((o) => [o.id, o]));

  const regras: RegraPreco[] = [
    ...modulos.flatMap((m) => m.regrasPreco ?? []),
    regraArredondar,
  ];

  // Duas passadas: a primeira precifica no preço-base pra saber o tamanho do
  // pedido; a segunda reprecifica já sabendo. É o que permite regra de faixa
  // ("acima de 48 peças") sem referência circular.
  const totalItens = linhasSacola.reduce((acc, l) => acc + l.quantidade, 0);
  const totalBase = linhasSacola.reduce((acc, l) => {
    const o = porId.get(l.ofertaId);
    return o ? acc + o.precoBase * l.quantidade : acc;
  }, 0);

  const linhas: LinhaResolvida[] = [];
  for (const linha of linhasSacola) {
    const oferta = porId.get(linha.ofertaId);
    if (!oferta) continue; // oferta saiu do ar depois que entrou na sacola

    const preco = resolverPreco(regras, {
      oferta,
      linha,
      totalItens,
      totalValor: totalBase,
      loja,
      cliente,
    });

    const configurador = modulos.find((m) => m.configurador?.aplicaA(oferta))?.configurador;

    linhas.push({
      linha,
      oferta,
      preco,
      subtotal: preco.unitario * linha.quantidade,
      resumoSelecao: configurador?.resumir(oferta, linha.selecao) ?? "",
    });
  }

  const avisos: AvisoSacola[] = modulos.flatMap((m) => m.validarSacola?.({ linhas, loja }) ?? []);

  return {
    linhas,
    totalItens,
    total: linhas.reduce((acc, l) => acc + l.subtotal, 0),
    avisos,
    podeFechar: linhas.length > 0 && !avisos.some((a) => a.nivel === "erro"),
  };
}
