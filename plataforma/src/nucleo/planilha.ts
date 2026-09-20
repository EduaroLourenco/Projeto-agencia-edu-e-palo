/**
 * PLANILHA — ler e escrever CSV
 *
 * Existe por um motivo prático: ninguém cadastra 200 peças uma a uma. Quem
 * tem catálogo grande já tem ele numa planilha, e obrigar a redigitar é o
 * jeito mais rápido de perder o cliente na primeira semana.
 *
 * Duas decisões que parecem detalhe e não são:
 *
 * 1. O separador é DESCOBERTO, não fixado. O Excel em português salva CSV
 *    com ponto e vírgula, porque a vírgula já é o separador decimal. Fixar
 *    em vírgula faria toda planilha brasileira chegar aqui como uma coluna
 *    só — e o lojista não teria como saber por quê.
 *
 * 2. O preço aceita os dois formatos. "1.234,56" e "1234.56" são a mesma
 *    coisa, e quem digita não pensa nisso.
 */

/** Acha o separador contando qual aparece mais na linha do cabeçalho. */
function separadorDe(texto: string): string {
  const primeira = texto.slice(0, texto.indexOf("\n") + 1 || texto.length);
  const candidatos = [";", ",", "\t"];
  let melhor = ";";
  let mais = -1;
  for (const c of candidatos) {
    const quantos = primeira.split(c).length - 1;
    if (quantos > mais) {
      mais = quantos;
      melhor = c;
    }
  }
  return melhor;
}

/**
 * Quebra o CSV respeitando aspas.
 *
 * Um campo entre aspas pode conter o separador e até quebra de linha — é o
 * caso comum da descrição do produto. Quebrar por `split` estraga esses.
 */
export function lerCSV(texto: string): string[][] {
  const sep = separadorDe(texto);
  const linhas: string[][] = [];
  let campo = "";
  let linha: string[] = [];
  let dentroDeAspas = false;

  // Remove o BOM que o Excel põe no começo do arquivo; sem isto a primeira
  // coluna do cabeçalho vem com um caractere invisível grudado e nunca casa.
  const t = texto.replace(/^﻿/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (dentroDeAspas) {
      if (c === '"') {
        if (t[i + 1] === '"') {
          campo += '"';
          i++;
        } else {
          dentroDeAspas = false;
        }
      } else {
        campo += c;
      }
      continue;
    }
    if (c === '"') dentroDeAspas = true;
    else if (c === sep) {
      linha.push(campo);
      campo = "";
    } else if (c === "\n") {
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = "";
    } else campo += c;
  }
  if (campo !== "" || linha.length) {
    linha.push(campo);
    linhas.push(linha);
  }
  return linhas.filter((l) => l.some((c) => c.trim() !== ""));
}

/** Gera CSV com ponto e vírgula, que é o que o Excel brasileiro abre direto. */
export function escreverCSV(linhas: (string | number)[][]): string {
  const escapar = (v: string | number) => {
    const s = String(v ?? "");
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  // O BOM faz o Excel reconhecer acento. Sem ele, "Sabão" abre como "SabÃ£o".
  return "﻿" + linhas.map((l) => l.map(escapar).join(";")).join("\r\n");
}

/** "1.234,56", "1234.56", "R$ 49,90" → 1234.56 / 49.9 */
export function lerPreco(bruto: string): number {
  const limpo = String(bruto ?? "").replace(/[^\d.,-]/g, "").trim();
  if (!limpo) return 0;
  const temVirgula = limpo.includes(",");
  const temPonto = limpo.includes(".");
  let normal = limpo;
  if (temVirgula && temPonto) {
    // O que vier por último é o decimal: "1.234,56" e "1,234.56".
    normal = limpo.lastIndexOf(",") > limpo.lastIndexOf(".")
      ? limpo.replace(/\./g, "").replace(",", ".")
      : limpo.replace(/,/g, "");
  } else if (temVirgula) {
    normal = limpo.replace(",", ".");
  }
  const n = Number(normal);
  return Number.isFinite(n) ? n : 0;
}

/** Tira acento e caixa pra casar cabeçalho escrito de qualquer jeito. */
function chave(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Os nomes de coluna que a gente entende.
 *
 * Vários sinônimos por campo de propósito: o lojista não vai renomear a
 * planilha dele pra encaixar no nosso vocabulário, e não deveria precisar.
 */
const SINONIMOS: Record<string, string[]> = {
  nome: ["nome", "produto", "item", "descricao", "titulo", "servico"],
  preco: ["preco", "valor", "precovenda", "precounitario", "precobase", "rs"],
  categoria: ["categoria", "secao", "grupo", "tipo", "departamento", "linha"],
  resumo: ["resumo", "detalhe", "observacao", "obs", "subtitulo"],
  codigo: ["codigo", "sku", "ref", "referencia", "cod"],
  variacoes: ["variacoes", "variacao", "tamanhos", "tamanho", "cores", "cor", "grade", "opcoes"],
  estoque: ["estoque", "quantidade", "qtd", "saldo"],
};

export interface ColunasMapeadas {
  nome?: number;
  preco?: number;
  categoria?: number;
  resumo?: number;
  codigo?: number;
  variacoes?: number;
  estoque?: number;
}

/** Olha o cabeçalho e adivinha qual coluna é o quê. */
export function mapearColunas(cabecalho: string[]): ColunasMapeadas {
  const mapa: ColunasMapeadas = {};
  cabecalho.forEach((titulo, i) => {
    const k = chave(titulo);
    if (!k) return;
    for (const [campo, nomes] of Object.entries(SINONIMOS)) {
      if (mapa[campo as keyof ColunasMapeadas] !== undefined) continue;
      // Casa exato primeiro; só depois aceita "preço de venda" contendo "preco".
      if (nomes.includes(k) || nomes.some((n) => k.startsWith(n) && n.length > 3)) {
        mapa[campo as keyof ColunasMapeadas] = i;
        return;
      }
    }
  });
  return mapa;
}

export interface LinhaLida {
  nome: string;
  preco: number;
  categoria: string;
  resumo: string;
  codigo: string;
  /** "P, M, G" ou "P,M,G | Azul,Preto" — cada trecho separado por | é um eixo. */
  variacoes: string;
  estoque?: number;
  /** Por que esta linha não entra. Vazio = entra. */
  problema?: string;
}

/**
 * Transforma as linhas cruas no que o catálogo entende, dizendo o que há de
 * errado em cada uma — em vez de recusar o arquivo inteiro por causa de uma.
 */
export function interpretar(linhas: string[][], mapa: ColunasMapeadas): LinhaLida[] {
  const pegar = (l: string[], i?: number) => (i === undefined ? "" : (l[i] ?? "").trim());

  return linhas.map((l) => {
    const nome = pegar(l, mapa.nome);
    const precoBruto = pegar(l, mapa.preco);
    const preco = lerPreco(precoBruto);
    const estoqueBruto = pegar(l, mapa.estoque);

    let problema: string | undefined;
    if (!nome) problema = "sem nome";
    else if (mapa.preco === undefined) problema = "não achei a coluna de preço";
    else if (!precoBruto) problema = "sem preço";
    else if (preco <= 0) problema = `preço não entendido: "${precoBruto}"`;

    return {
      nome,
      preco,
      categoria: pegar(l, mapa.categoria),
      resumo: pegar(l, mapa.resumo),
      codigo: pegar(l, mapa.codigo),
      variacoes: pegar(l, mapa.variacoes),
      estoque: estoqueBruto ? Number(estoqueBruto.replace(/\D/g, "")) : undefined,
      problema,
    };
  });
}

/** "P, M, G | Azul, Preto" → dois eixos com os valores de cada um. */
export function lerVariacoes(bruto: string): { nome: string; valores: string[] }[] {
  if (!bruto.trim()) return [];
  const eixos = bruto.split("|");
  return eixos
    .map((e, i) => {
      const [talvezNome, talvezValores] = e.includes(":") ? e.split(":") : [null, e];
      const valores = (talvezValores ?? "")
        .split(/[,/]/)
        .map((v) => v.trim())
        .filter(Boolean);
      return {
        nome: (talvezNome ?? (i === 0 ? "Tamanho" : "Cor")).trim(),
        valores,
      };
    })
    .filter((e) => e.valores.length > 0);
}

/** O modelo que o lojista baixa pra preencher. */
export function modeloDeProdutos(): string {
  return escreverCSV([
    ["Nome", "Preço", "Categoria", "Resumo", "Código", "Variações", "Estoque"],
    ["Camiseta lisa", "49,90", "Camisetas", "Algodão penteado", "CAM-001", "P, M, G | Branco, Preto", "20"],
    ["Calça jeans", "159,90", "Calças", "Cintura alta", "CAL-014", "36, 38, 40, 42", "8"],
    ["Bolsa de palha", "89,00", "Acessórios", "Feita à mão", "BOL-003", "", ""],
  ]);
}
