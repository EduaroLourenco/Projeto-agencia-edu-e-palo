import { Link } from "react-router-dom";
import { ArrowRight, LayoutDashboard, RotateCcw, Wand2 } from "lucide-react";
import { DEMOS } from "../demos/indice";
import { modulo as buscarModulo } from "./nucleo/registro";
import { escalaDaMarca, textoSobreMarca } from "./nucleo/tema";
import { restaurarDemo } from "./nucleo/loja";

/**
 * A tela de onde a demonstração começa.
 *
 * Existe pra uma cena específica: você abre o celular na frente do cliente,
 * escolhe o ramo dele e a loja já está montada. Não é parte do produto que
 * o lojista usa — some quando a plataforma virar SaaS de verdade.
 */
export function Galeria() {
  const lojas = Object.values(DEMOS);

  return (
    <div className="mx-auto min-h-dvh w-full max-w-3xl px-5 py-10">
      <header className="mb-9">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-tinta-45">Plataforma · demonstrações</p>
        <h1 className="mt-2 font-display text-[27px] font-extrabold leading-tight tracking-tight">
          Três ramos, um sistema só
        </h1>
        <p className="mt-2 max-w-xl text-[14.5px] leading-relaxed text-tinta-70">
          As três lojas rodam o mesmo código. O que muda entre elas é um arquivo de
          configuração: quais blocos aparecem, quais módulos estão ligados e o tema.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {lojas.map((loja) => {
          const escala = escalaDaMarca(loja.tema.corMarca);
          const modulos = loja.modulos.map((id) => buscarModulo(id)).filter(Boolean);

          return (
            <div
              key={loja.slug}
              className="overflow-hidden border border-borda bg-papel"
              style={{ borderRadius: "18px" }}
            >
              <div className="flex items-start gap-4 p-5" style={{ background: escala["50"] }}>
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center font-display text-[19px] font-extrabold"
                  style={{
                    background: loja.tema.corMarca,
                    color: textoSobreMarca(loja.tema.corMarca),
                    borderRadius: "12px",
                  }}
                >
                  {loja.nome.slice(0, 1)}
                </span>

                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight">{loja.nome}</h2>
                  <p className="mt-0.5 text-[13px] text-tinta-70">{loja.descricao}</p>

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {modulos.map((m) => (
                      <span
                        key={m!.id}
                        className="inline-flex items-center gap-1 border border-borda bg-papel px-2 py-0.5 text-[11px] font-semibold text-tinta-70"
                        style={{ borderRadius: "999px" }}
                      >
                        {m!.nome}
                      </span>
                    ))}
                    <span className="num-tab inline-flex items-center px-2 py-0.5 text-[11px] font-medium text-tinta-45">
                      {loja.ofertas.length} itens
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-borda px-4 py-3">
                <Link
                  to={`/${loja.slug}`}
                  className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-1.5 px-4 text-[14px] font-bold"
                  style={{
                    background: loja.tema.corMarca,
                    color: textoSobreMarca(loja.tema.corMarca),
                    borderRadius: "10px",
                  }}
                >
                  Ver a loja
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to={`/${loja.slug}/estudio`}
                  className="inline-flex min-h-[42px] items-center gap-1.5 border border-borda-forte px-3.5 text-[13.5px] font-semibold text-tinta-70"
                  style={{ borderRadius: "10px" }}
                >
                  <Wand2 size={15} />
                  Estúdio
                </Link>

                <Link
                  to={`/${loja.slug}/painel`}
                  className="inline-flex min-h-[42px] items-center gap-1.5 border border-borda-forte px-3.5 text-[13.5px] font-semibold text-tinta-70"
                  style={{ borderRadius: "10px" }}
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
                  className="inline-flex h-[42px] w-[42px] items-center justify-center border border-borda-forte text-tinta-45"
                  style={{ borderRadius: "10px" }}
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            </div>
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
