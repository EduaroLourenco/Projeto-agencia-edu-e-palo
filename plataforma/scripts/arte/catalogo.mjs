import * as f from "./formas.mjs";

/**
 * O catálogo das demos, item por item.
 *
 * `fundo` é a cor do estúdio atrás do objeto — anda junto com a cor do
 * produto, mas bem mais lavada. É o que dá unidade à grade: 37 fundos
 * diferentes, todos da mesma família de luz.
 */

const p = (arquivo, fundo, desenhar) => ({ arquivo, fundo, desenhar });

export const CATALOGO = [
  /* ---- Vale Verde: mercearia ---- */
  p("arroz", "#e9e2d2", () => f.saco({ cor: "#e4c76a", marca: "AGULHINHA", linha: "Tipo 1", peso: "5 kg" })),
  p("feijao", "#e6dfd4", () => f.saco({ cor: "#b4643c", marca: "CARIOCA", linha: "Selecionado", peso: "1 kg" })),
  p("acucar", "#eae6dc", () => f.saco({ cor: "#e8e2d6", marca: "REFINADO", linha: "União fina", peso: "1 kg" })),
  p("farinha", "#e9e4d6", () => f.saco({ cor: "#dcd0b4", marca: "TRIGO", linha: "Sem fermento", peso: "1 kg" })),
  p("macarrao", "#eae2cf", () => f.saco({ cor: "#d8a03e", marca: "ESPAGUETE", linha: "Sêmola", peso: "500 g" })),
  p("cafe", "#e5ddd2", () => f.caixa({ cor: "#6d3b2a", marca: "TORRADO", linha: "Moído", peso: "500 g", largura: 168, altura: 296 })),
  p("biscoito", "#eae3d3", () => f.caixa({ cor: "#c8823c", marca: "CREAM", linha: "Cracker", peso: "400 g", largura: 196, altura: 268 })),
  p("leite", "#e4e7e6", () => f.caixa({ cor: "#3f6ea8", marca: "INTEGRAL", linha: "Longa vida", peso: "1 L", largura: 148, altura: 322 })),
  p("oleo", "#eae5d1", () => f.garrafa({ cor: "#e0b545", marca: "SOJA", linha: "Tipo 1", peso: "900 ml" })),
  p("molho", "#e9dfd7", () => f.pote({ cor: "#b1452f", marca: "TOMATE", linha: "Tradicional", peso: "2 kg" })),

  /* ---- Vale Verde: bebidas ---- */
  p("refrigerante", "#e5dcd8", () => f.garrafa({ cor: "#8c2f2a", marca: "COLA", linha: "Original", peso: "2 L", ombro: 196 })),
  p("agua", "#dee8ea", () => f.garrafa({ cor: "#cfe2e6", marca: "MINERAL", linha: "Sem gás", peso: "500 ml", corTampa: "#3b7f95", ombro: 226 })),
  p("suco", "#e6dee6", () => f.garrafa({ cor: "#6b3060", marca: "UVA", linha: "Integral", peso: "1 L" })),

  /* ---- Vale Verde: limpeza e descartáveis ---- */
  p("detergente", "#e2e8e2", () => f.frasco({ cor: "#4f9a63", marca: "NEUTRO", linha: "Coco", peso: "500 ml" })),
  p("sanitaria", "#e3e7ea", () => f.galao({ cor: "#4a7fb0", marca: "SANITÁRIA", linha: "Cloro ativo", peso: "2 L" })),
  p("copo-descartavel", "#e7e6e3", () => f.pilha({ cor: "#dcdad6", marca: "COPO", linha: "200 ml", peso: "100 un" })),
  p("guardanapo", "#eae6de", () => f.caixa({ cor: "#e2ded4", marca: "GUARDANAPO", linha: "Folha dupla", peso: "24×22", largura: 214, altura: 216 })),

  /* ---- Bella Atacado ---- */
  p("blusa-linho", "#efe7de", () => f.blusa({ cor: "#c88a5e", manga: "curta", barra: 424 })),
  p("blusa-tricot", "#ece2e2", () => f.blusa({ cor: "#c98f9a", manga: "longa", barra: 430 })),
  p("cropped", "#ebe4ee", () => f.blusa({ cor: "#a98bc8", manga: "curta", barra: 352 })),
  p("calca-wide", "#e4e6ec", () => f.calca({ cor: "#5878a4", largura: 1.7 })),
  p("calca-alfaiataria", "#e8e6e2", () => f.calca({ cor: "#3b3a38", largura: 0.7 })),
  p("saia-envelope", "#eee5da", () => f.saia({ cor: "#b8834a" })),
  p("saia-plissada", "#e9e4ef", () => f.saia({ cor: "#7f5fa8", pregas: true })),
  p("vestido-midi", "#ece0e2", () => f.vestido({ cor: "#8e3b4c" })),
  p("vestido-longo", "#e8e2e4", () => f.vestido({ cor: "#3a2f33", barra: 470 })),

  /* ---- Studio Nara: serviços ---- */
  p("corte", "#ece7f2", () => f.motivo({ cor: "#8b6fc8", desenho: "tesoura" })),
  p("coloracao", "#f0e5ec", () => f.motivo({ cor: "#b1618f", desenho: "tigela" })),
  p("escova", "#eae6f0", () => f.motivo({ cor: "#7d6bbe", desenho: "escova" })),
  p("hidratacao", "#e4ecf0", () => f.motivo({ cor: "#4e8ba8", desenho: "gota" })),
  p("manicure", "#f2e6e8", () => f.motivo({ cor: "#c26377", desenho: "esmalte" })),
  p("pedicure", "#eee7ea", () => f.motivo({ cor: "#a8698c", desenho: "lotus" })),
  p("design-sobrancelha", "#ece7e2", () => f.motivo({ cor: "#8a6b52", desenho: "sobrancelha" })),
  p("limpeza-pele", "#e6eeea", () => f.motivo({ cor: "#5a927e", desenho: "rosto" })),
  p("home-care", "#ece8f0", () => f.motivo({ cor: "#7b62b4", desenho: "vidros" })),
];
