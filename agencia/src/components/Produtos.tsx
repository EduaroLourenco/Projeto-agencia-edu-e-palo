import { ArrowUpRight } from "lucide-react";
import { PRODUTOS, linkWhatsApp, type Produto } from "../data/content";
import { rastrear } from "../lib/analytics";

function CartaoProduto({ produto }: { produto: Produto }) {
  const conteudo = (
    <>
      <div className="prancheta flex aspect-[2.2/1] items-end justify-between gap-3 border border-brand-line p-4 sm:p-5">
        <span className="text-[clamp(1.9rem,4vw,3.4rem)] font-[640] leading-none tracking-[-0.045em]">
          {produto.nome}
        </span>
        <span className="shrink-0 bg-paper px-2.5 py-1 text-[0.8rem] font-[630] text-brand-strong">
          {produto.url ? "Disponível" : "Em desenvolvimento"}
        </span>
      </div>
      <p className="mt-3 max-w-[46ch] text-muted">{produto.descricao}</p>
      {produto.url && (
        <span className="link-seta">
          Acessar produto
          <ArrowUpRight size={17} aria-hidden />
        </span>
      )}
    </>
  );

  if (!produto.url) return <li>{conteudo}</li>;
  return (
    <li>
      <a
        href={produto.url}
        target="_blank"
        rel="noopener"
        onClick={() => rastrear("produto_click", { produto: produto.nome })}
        className="block"
      >
        {conteudo}
      </a>
    </li>
  );
}

export function Produtos() {
  const algumEmConstrucao = PRODUTOS.some((p) => !p.url);

  return (
    <section id="produtos" className="wrap py-[clamp(3.4rem,6vw,6rem)]">
      <div className="cabecalho">
        <h2 className="titulo-secao">Novos produtos.</h2>
        <p className="apoio">Além dos serviços, estamos construindo produtos próprios.</p>
      </div>
      <ul className="mt-[clamp(2rem,4vw,3.2rem)] grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-[clamp(1.2rem,2.5vw,2.2rem)]">
        {PRODUTOS.map((p) => (
          <CartaoProduto key={p.nome} produto={p} />
        ))}
      </ul>
      {algumEmConstrucao && (
        <a
          href={linkWhatsApp("Olá! Vim pelo site da BEPA e quero saber quando os novos produtos forem lançados.")}
          target="_blank"
          rel="noreferrer"
          onClick={() => rastrear("whatsapp_click", { origem: "produtos" })}
          className="link-seta mt-4"
        >
          Quero saber quando lançar
          <ArrowUpRight size={17} aria-hidden />
        </a>
      )}
    </section>
  );
}
