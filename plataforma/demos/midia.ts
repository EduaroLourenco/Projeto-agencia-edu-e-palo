import type { Midia } from "../src/nucleo/tipos";

/**
 * As fotos das demos entram pelo empacotador, não pela pasta pública.
 *
 * Isso resolve duas coisas de uma vez: no build normal cada foto vira um
 * arquivo com hash (cache eterno, sem invalidação errada), e num build de
 * demonstração — uma página só, pra mandar por link pro cliente — dá pra
 * embutir tudo em base64 sem tocar em nenhum destes arquivos.
 */
const arquivos = import.meta.glob<string>("./fotos/*.jpg", {
  eager: true,
  import: "default",
  query: "?url",
});

const porNome = new Map<string, string>(
  Object.entries(arquivos).map(([caminho, url]) => [
    caminho.replace("./fotos/", "").replace(".jpg", ""),
    url,
  ]),
);

/** URL da foto pelo nome do arquivo, sem extensão. */
export function urlFoto(arquivo: string): string {
  const url = porNome.get(arquivo);
  if (!url) throw new Error(`Foto da demo não encontrada: ${arquivo}`);
  return url;
}

/** O formato que uma oferta espera: uma foto quadrada com texto alternativo. */
export function foto(arquivo: string, alt: string): Midia[] {
  return [{ url: urlFoto(arquivo), alt, largura: 600, altura: 600 }];
}
