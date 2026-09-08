import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, RotateCcw, Wand2 } from "lucide-react";
import { DEMOS } from "../demos/indice";
import { modulo as buscarModulo } from "./nucleo/registro";
import { escalaDaMarca, textoSobreMarca } from "./nucleo/tema";
import { restaurarDemo } from "./nucleo/loja";
import type { Loja } from "./nucleo/tipos";

/**
 * A tela de onde a demonstração começa.
 *
 * Existe pra uma cena específica: você abre o celular na frente do cliente,
 * escolhe o ramo dele e a loja já está montada. Não é parte do produto que
 * o lojista usa — some quando a plataforma virar SaaS de verdade.
 */

/**
 * A capa da loja é o banner que ela mesma já tem — não uma inicial num
 * quadrado colorido.
 *
 * Prefere a arte de computador: o cartão aqui é deitado, e a arte de
 * celular é em pé. Cortar uma vertical num quadro horizontal decepa a
 * cabeça dos produtos.
 */
function capa(loja: Loja): string | undefined {
  for (const bloco of loja.paginas.inicio ?? []) {
    if (bloco.tipo !== "banner") continue;
    const url = bloco.props.imagemDesktop || bloco.props.imagemCelular;
    if (typeof url === "string" && url) return url;
  }
  return undefined;
}

export function Galeria() {
  const lojas = Object.values(DEMOS);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-3xl px-5 pb-14 pt-10">
      <header className="mb-8">
        <p className="rotulo text-tinta-45">Zap Commerce · demonstrações</p>
        <h1 className="mt-2.5 font-display text-[clamp(28px,8vw,38px)] font-extrabold leading-[1.06] tracking-[-0.028em]">
          Três ramos,
          <br />
          um sistema só
        </h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-tinta-70">
          As três lojas rodam o mesmo código. O que muda entre elas é um arquivo de
          configuração: quais blocos aparecem, quais módulos estão ligados e o tema.
        </p>
      </header>

      <div className="flex flex-col gap-5">
        {lojas.map((loja) => {
          const escala = escalaDaMarca(loja.tema.corMarca);
          const modulos = loja.modulos.map((id) => buscarModulo(id)).filter(Boolean);
          const sobre = textoSobreMarca(loja.tema.corMarca);
          const imagem = capa(loja);

          return (
            <article
              key={loja.slug}
              className="group overflow-hidden border border-borda bg-papel shadow-[var(--sombra-1)] transition-shadow hover:shadow-[var(--sombra-2)]"
              style={{ borderRadius: "20px" }}
            >
              {/* A capa é link e é a maior área clicável do cartão: numa lista
                  de três, o polegar procura a foto, não o botão. */}
              <Link to={`/${loja.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                {imagem ? (
                  <img
                    src={imagem}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-full w-full" style={{ background: escala["100"] }} />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(20,17,13,0.88) 0%, rgba(20,17,13,0.66) 26%, rgba(20,17,13,0.18) 58%, transparent 84%)" }}
                />
                {/* Fundo escuro, não branco translúcido: a arte é clara em
                    cima, e branco sobre claro some. */}
                <span
                  className="num-tab absolute right-3 top-3 px-2.5 py-1 text-[11px] font-bold backdrop-blur-md"
                  style={{ background: "rgba(22,19,15,0.55)", color: "#fff", borderRadius: "999px" }}
                >
                  {loja.ofertas.length} itens
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h2 className="font-display text-[20px] font-extrabold leading-tight tracking-[-0.022em] text-white">
                    {loja.nome}
                  </h2>
                  <p className="mt-1 text-[13px] leading-snug text-white/85">{loja.descricao}</p>
                </div>
              </Link>

              <div className="p-4">
                <div className="flex flex-wrap gap-1.5">
                  {modulos.map((m) => (
                    <span
                      key={m!.id}
                      className="inline-flex items-center px-2.5 py-1 text-[11.5px] font-semibold"
                      style={{ background: escala["50"], color: escala["800"], borderRadius: "999px" }}
                    >
                      {m!.nome}
                    </span>
                  ))}
                </div>

                {/* Uma linha pro que 9 em cada 10 pessoas vão tocar, outra pro
                    resto. Os quatro na mesma linha quebravam o rótulo em duas. */}
                <Link
                  to={`/${loja.slug}`}
                  className="mt-3.5 flex min-h-[46px] items-center justify-center gap-1.5 text-[14.5px] font-bold"
                  style={{ background: loja.tema.corMarca, color: sobre, borderRadius: "12px" }}
                >
                  Ver a loja
                  <ArrowRight size={16} strokeWidth={2.6} />
                </Link>

                <div className="mt-2 flex gap-2">
                  <Link
                    to={`/${loja.slug}/estudio`}
                    className="flex min-h-[42px] flex-1 items-center justify-center gap-1.5 border border-borda-forte text-[13.5px] font-semibold text-tinta-70"
                    style={{ borderRadius: "11px" }}
                  >
                    <Wand2 size={15} />
                    Estúdio
                  </Link>
                  <Link
                    to={`/${loja.slug}/painel`}
                    className="flex min-h-[42px] flex-1 items-center justify-center gap-1.5 border border-borda-forte text-[13.5px] font-semibold text-tinta-70"
                    style={{ borderRadius: "11px" }}
                  >
                    <LayoutDashboard size={15} />
                    Painel
                  </Link>
                  <button
                    onClick={() => {
                      restaurarDemo(loja.slug);
                      location.reload();
                    }}
                    title="Voltar esta loja ao estado de fábrica"
                    aria-label={`Restaurar ${loja.nome}`}
                    className="flex h-[42px] w-[42px] shrink-0 items-center justify-center border border-borda-forte text-tinta-45"
                    style={{ borderRadius: "11px" }}
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-[12.5px] leading-relaxed text-tinta-45">
        O que você editar no estúdio fica guardado no seu navegador. O botão de restaurar
        devolve a loja ao estado original — use antes de mostrar pra outra pessoa.
      </p>
    </div>
  );
}
