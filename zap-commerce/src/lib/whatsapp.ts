import type { DadosComprador, MetodoEntrega, Produto } from "../types";
import { formatarReal } from "./format";

export interface LinhaPedido {
  produto: Produto;
  tamanho: string;
  quantidade: number;
  precoUnitario: number;
}

export function montarMensagemPedido(params: {
  linhas: LinhaPedido[];
  atacadoAplicado: boolean;
  regraDescricao: string;
  total: number;
  metodo: MetodoEntrega;
  comprador: DadosComprador;
  pontoNome?: string;
}): string {
  const { linhas, atacadoAplicado, regraDescricao, total, metodo, comprador, pontoNome } = params;

  const itens = linhas
    .map(
      (l) =>
        `• ${l.quantidade}x ${l.produto.nome} (Tamanho ${l.tamanho}) - ${formatarReal(l.precoUnitario)}/un`,
    )
    .join("\n");

  const entregaLinhas: string[] = [];
  if (metodo.tipo === "maos") {
    entregaLinhas.push("Forma: Retirada em Mãos");
    if (pontoNome) entregaLinhas.push(`Ponto: ${pontoNome}`);
  } else if (metodo.tipo === "excursao") {
    entregaLinhas.push("Forma: Retirada na Excursão");
    entregaLinhas.push(`Guia: ${metodo.guia}`);
    entregaLinhas.push(`Ônibus: Placa ${metodo.placaOnibus} (${metodo.estacionamento})`);
  } else {
    entregaLinhas.push("Forma: Transportadora/Correios");
    entregaLinhas.push(`CEP: ${metodo.cep}`);
    if (metodo.endereco) entregaLinhas.push(`Endereço: ${metodo.endereco}`);
    if (metodo.cidade) entregaLinhas.push(`Cidade: ${metodo.cidade} - ${metodo.uf ?? ""}`.trim());
    entregaLinhas.push("Frete a combinar no chat.");
  }

  const partes = [
    "Olá! Montei meu pedido no catálogo digital:",
    "--- 📦 DETALHES DO PEDIDO ---",
    itens,
    atacadoAplicado ? `Regra Aplicada: Desconto de Atacado (${regraDescricao})` : "Regra Aplicada: Preço Varejo",
    `💵 Total do Pedido: ${formatarReal(total)}`,
    "--- 🚚 MÉTODO DE ENTREGA ---",
    entregaLinhas.join("\n"),
    "--- 👤 MEUS DADOS ---",
    `Nome: ${comprador.nome}`,
    `Cidade: ${comprador.cidade}`,
    "Por favor, confirme se tem todas as peças para eu fazer o PIX!",
  ];

  return partes.join("\n");
}

export function linkWhatsApp(numero: string, mensagem: string): string {
  const numeroLimpo = numero.replace(/\D/g, "");
  return `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
}

