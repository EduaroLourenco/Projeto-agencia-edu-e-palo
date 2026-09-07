import { Plus, Check } from "lucide-react";
import { formatarReal } from "../nucleo/preco";
import { modulosAtivos } from "../nucleo/registro";
import type { Loja, Oferta } from "../nucleo/tipos";
import { Stepper } from "../design/Primitivos";
import { useVitrine } from "../vitrine/contexto";

/** A oferta exige escolha antes de entrar na sacola? */
export function precisaEscolher(oferta: Oferta, loja: Loja): boolean {
  return modulosAtivos(loja.modulos).some((m) => m.configurador?.aplicaA(oferta));
}

export function Foto({
  oferta,
  className = "",
  prioridade = false,
}: {
  oferta: Oferta;
  className?: string;
  prioridade?: boolean;
}) {
  const m = oferta.midia[0];
  if (!m) {
    return <div className={`bg-papel-3 ${className}`} aria-hidden="true" />;
  }
  return (
    <img
      src={m.url}
      alt={m.alt}
      width={m.largura}
      height={m.altura}
      loading={prioridade ? "eager" : "lazy"}
      decoding="async"
      className={`bg-papel-3 object-cover ${className}`}
    />
  );
}

/** Preço com a etapa que pegou, quando pegou alguma. */
export function Preco({ oferta, compacto = false }: { oferta: Oferta; compacto?: boolean }) {
  return (
    <p className={`num-tab font-display font-bold tracking-tight ${compacto ? "text-[14px]" : "text-[15px]"}`}>
      {formatarReal(oferta.precoBase)}
      {oferta.tipo === "servico" && <span className="ml-1 text-[11px] font-medium text-tinta-45">/sessão</span>}
    </p>
  );
}

/* ============================================================
   CARTÃO — modo vitrine, pra descobrir
   ============================================================ */

export function CartaoOferta({ oferta, prioridade = false }: { oferta: Oferta; prioridade?: boolean }) {
  const { loja, abrirOferta, abrirAdicionar, somar, quantidadeNaSacola } = useVitrine();
  const naSacola = quantidadeNaSacola(oferta.id);
  const escolher = precisaEscolher(oferta, loja);

  return (
    <div
      className="group flex flex-col overflow-hidden border border-borda bg-papel transition hover:border-borda-forte"
      style={{ borderRadius: "var(--canto-g)" }}
    >
      <button
        onClick={() => abrirOferta(oferta)}
        className="relative block aspect-square w-full overflow-hidden text-left"
        aria-label={`Ver ${oferta.nome}`}
      >
        <Foto oferta={oferta} prioridade={prioridade} className="h-full w-full transition duration-500 group-hover:scale-[1.03]" />
        {naSacola > 0 && (
          <span className="num-tab absolute left-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[var(--marca-500)] px-1.5 text-[11px] font-bold text-[var(--sobre-marca)]">
            {naSacola}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <button onClick={() => abrirOferta(oferta)} className="text-left">
          <p className="line-clamp-2 text-[13.5px] font-semibold leading-snug">{oferta.nome}</p>
        </button>

        <div className="mt-auto flex items-center justify-between gap-2">
          <Preco oferta={oferta} compacto />
          <button
            onClick={() => (escolher ? abrirAdicionar(oferta) : somar(oferta, 1))}
            aria-label={`Adicionar ${oferta.nome}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--marca-500)] text-[var(--sobre-marca)] transition hover:brightness-95"
            style={{ borderRadius: "var(--canto-m)" }}
          >
            {naSacola > 0 ? <Check size={16} strokeWidth={2.6} /> : <Plus size={17} strokeWidth={2.6} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   LINHA — modo lista rápida, pra recomprar

   Comprar 40 itens numa grade de fotos são 40 telas. Aqui a
   quantidade se resolve na própria linha, sem sair do lugar.
   ============================================================ */

export function LinhaOferta({ oferta }: { oferta: Oferta }) {
  const { loja, abrirOferta, abrirAdicionar, somar, quantidadeNaSacola } = useVitrine();
  const quantidade = quantidadeNaSacola(oferta.id);
  const escolher = precisaEscolher(oferta, loja);

  return (
    <div className="flex items-center gap-3 border-b border-borda py-2.5 last:border-b-0">
      <button onClick={() => abrirOferta(oferta)} className="shrink-0" aria-label={`Ver ${oferta.nome}`}>
        <Foto oferta={oferta} className="h-12 w-12" />
      </button>

      <button onClick={() => abrirOferta(oferta)} className="min-w-0 flex-1 text-left">
        {/* Duas linhas, não corte: o que distingue "500g" de "1kg" mora no fim do nome. */}
        <p className="line-clamp-2 text-[13.5px] font-semibold leading-tight">{oferta.nome}</p>
        <p className="num-tab mt-0.5 text-[12.5px] text-tinta-45">{formatarReal(oferta.precoBase)}</p>
      </button>

      {escolher ? (
        <button
          onClick={() => abrirAdicionar(oferta)}
          className="shrink-0 border border-borda-forte px-3 py-2 text-[12.5px] font-semibold text-tinta-70"
          style={{ borderRadius: "var(--canto-m)" }}
        >
          Escolher
        </button>
      ) : (
        <div className="shrink-0">
          <Stepper valor={quantidade} onMudar={(n) => somar(oferta, n - quantidade)} compacto />
        </div>
      )}
    </div>
  );
}

/**
 * O que o estúdio mostra no lugar de um bloco que, na loja de verdade,
 * ainda não tem o que mostrar. Sem isso o lojista vê um buraco e acha
 * que quebrou.
 */
export function VazioNoEstudio({ children }: { children: string }) {
  return (
    <div
      className="border border-dashed border-borda-forte px-4 py-5 text-center text-[12.5px] leading-snug text-tinta-45"
      style={{ borderRadius: "var(--canto-g)" }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   CABEÇALHO DE BLOCO — título + link, repetido em vários blocos
   ============================================================ */

export function TituloBloco({
  titulo,
  subtitulo,
  acao,
}: {
  titulo?: string;
  subtitulo?: string;
  acao?: { rotulo: string; onClick: () => void };
}) {
  if (!titulo && !subtitulo && !acao) return null;
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div className="min-w-0">
        {titulo && <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight">{titulo}</h2>}
        {subtitulo && <p className="mt-0.5 text-[13px] text-tinta-45">{subtitulo}</p>}
      </div>
      {acao && (
        <button
          onClick={acao.onClick}
          className="shrink-0 whitespace-nowrap text-[13px] font-semibold text-[var(--marca-600)]"
        >
          {acao.rotulo}
        </button>
      )}
    </div>
  );
}

/** Recorte de ofertas por regra, usado pelos blocos de grade e carrossel. */
export function filtrarOfertas(
  ofertas: Oferta[],
  regra: string,
  categoria: string,
  limite: number,
): Oferta[] {
  let lista = ofertas.filter((o) => o.ativa);
  if (regra === "categoria" && categoria) {
    lista = lista.filter((o) => o.categorias.includes(categoria));
  } else if (regra === "destaques") {
    lista = lista.filter((o) => o.destaque);
  } else if (regra === "servicos") {
    lista = lista.filter((o) => o.tipo === "servico");
  } else if (regra === "produtos") {
    lista = lista.filter((o) => o.tipo === "produto");
  }
  return limite > 0 ? lista.slice(0, limite) : lista;
}
