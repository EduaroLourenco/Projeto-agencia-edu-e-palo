import { formatarReal } from "./preco";
import type { DadosCheckout, LinhaResolvida, Loja, PassoCheckout } from "./tipos";

/**
 * A mensagem do WhatsApp se monta sozinha.
 *
 * O núcleo escreve só o cabeçalho, os itens e o total. Cada passo do checkout
 * contribui as próprias linhas pelo `paraMensagem`. Ligar o módulo de agenda
 * faz "Data: 10/09 às 14h" aparecer no texto sem ninguém editar template.
 */
export function montarMensagem(params: {
  loja: Loja;
  linhas: LinhaResolvida[];
  total: number;
  passos: PassoCheckout[];
  dados: DadosCheckout;
}): string {
  const { loja, linhas, total, passos, dados } = params;

  const itens = linhas.map((l) => {
    const sel = l.resumoSelecao ? ` (${l.resumoSelecao})` : "";
    return `• ${l.linha.quantidade}x ${l.oferta.nome}${sel} — ${formatarReal(l.preco.unitario)}/un`;
  });

  // Se alguma linha teve desconto, vale dizer qual regra pegou: é a
  // informação que o lojista confere antes de confirmar.
  const regrasUsadas = new Set<string>();
  linhas.forEach((l) =>
    l.preco.etapas
      // Arredondamento é passo interno da cadeia: não diz nada pro comprador.
      .filter((e) => e.rotulo !== "Arredondamento")
      .forEach((e) => regrasUsadas.add(e.rotulo)),
  );

  const blocos: string[] = [
    `Olá! Montei meu pedido no catálogo da ${loja.nome}:`,
    "",
    "*ITENS*",
    itens.join("\n"),
  ];

  if (regrasUsadas.size) {
    blocos.push("", `_Preço aplicado: ${[...regrasUsadas].join(", ")}_`);
  }

  blocos.push("", `*TOTAL: ${formatarReal(total)}*`);

  for (const passo of passos) {
    const linhasDoPasso = passo.paraMensagem(dados[passo.id] ?? {}, { loja });
    if (!linhasDoPasso.length) continue;
    blocos.push("", `*${passo.titulo.toUpperCase()}*`, linhasDoPasso.join("\n"));
  }

  blocos.push("", "Pode confirmar disponibilidade?");
  return blocos.join("\n");
}

export function linkWhatsApp(numero: string, mensagem: string): string {
  return `https://wa.me/${numero.replace(/\D/g, "")}?text=${encodeURIComponent(mensagem)}`;
}
