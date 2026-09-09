/**
 * Foto que o lojista sobe do celular.
 *
 * Não existe servidor: a foto vira base64 e mora no navegador junto com a
 * loja. Uma foto de celular tem 4 MB — jogar isso no localStorage estoura o
 * limite na segunda. Então toda imagem passa por aqui antes: reduz pro lado
 * maior pedido, corta pro quadrado quando é foto de produto, e sai em JPEG.
 *
 * O resultado fica perto de 60–90 KB, que é o tamanho de uma foto de
 * catálogo de verdade — e continua bom em tela de retina.
 */

export interface OpcoesImagem {
  /** Maior lado, em pixels. */
  lado?: number;
  /** Corta no centro pra ficar quadrada. Produto sim, banner não. */
  quadrada?: boolean;
  qualidade?: number;
}

export const LIMITE_ARQUIVO = 12 * 1024 * 1024;

export async function prepararImagem(
  arquivo: File,
  { lado = 900, quadrada = false, qualidade = 0.82 }: OpcoesImagem = {},
): Promise<{ url: string; largura: number; altura: number }> {
  if (!arquivo.type.startsWith("image/")) {
    throw new Error("Isso não é uma imagem.");
  }
  if (arquivo.size > LIMITE_ARQUIVO) {
    throw new Error("Imagem grande demais. Tente uma abaixo de 12 MB.");
  }

  const bitmap = await carregar(arquivo);

  // Quadrada: recorta o centro antes de reduzir. Recortar depois deforma.
  const origem = quadrada
    ? (() => {
        const l = Math.min(bitmap.width, bitmap.height);
        return { x: (bitmap.width - l) / 2, y: (bitmap.height - l) / 2, w: l, h: l };
      })()
    : { x: 0, y: 0, w: bitmap.width, h: bitmap.height };

  const escala = Math.min(1, lado / Math.max(origem.w, origem.h));
  const largura = Math.round(origem.w * escala);
  const altura = Math.round(origem.h * escala);

  const tela = document.createElement("canvas");
  tela.width = largura;
  tela.height = altura;
  const ctx = tela.getContext("2d");
  if (!ctx) throw new Error("Não consegui processar a imagem neste navegador.");

  // Fundo branco: PNG com transparência vira preto no JPEG sem isto.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, largura, altura);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, origem.x, origem.y, origem.w, origem.h, 0, 0, largura, altura);

  return { url: tela.toDataURL("image/jpeg", qualidade), largura, altura };
}

function carregar(arquivo: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(arquivo);
  }
  // Safari antigo não tem createImageBitmap com File.
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não consegui abrir esta imagem."));
    };
    img.src = url;
  });
}

/** Quantos KB uma data URI ocupa, pra mostrar pro lojista. */
export function pesoEmKB(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.round((base64.length * 3) / 4 / 1024);
}
