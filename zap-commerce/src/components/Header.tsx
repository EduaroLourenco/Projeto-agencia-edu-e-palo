import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, Share2, Check } from "lucide-react";
import type { LojaConfig } from "../types";

export function Header({
  loja,
  totalPecas,
  onAbrirSacola,
  onBuscar,
}: {
  loja: LojaConfig;
  totalPecas: number;
  onAbrirSacola: () => void;
  onBuscar?: (termo: string) => void;
}) {
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
  const [compartilhado, setCompartilhado] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Foca o input quando a busca abre
  useEffect(() => {
    if (buscaAberta) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [buscaAberta]);

  function handleBusca(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTermoBusca(val);
    onBuscar?.(val);
  }

  function fecharBusca() {
    setBuscaAberta(false);
    setTermoBusca("");
    onBuscar?.("");
  }

  async function compartilhar() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: loja.nomeLoja, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCompartilhado(true);
        setTimeout(() => setCompartilhado(false), 2200);
      }
    } catch {
      // usuário cancelou o share — ignora silenciosamente
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-paper/90 backdrop-blur">
      {/* Linha principal */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        {buscaAberta ? (
          /* Modo busca: campo expande */
          <div className="flex flex-1 items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2">
            <Search size={15} className="shrink-0 text-ink/40" />
            <input
              ref={inputRef}
              value={termoBusca}
              onChange={handleBusca}
              placeholder={`Buscar em ${loja.nomeLoja}...`}
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
            />
            <button
              onClick={fecharBusca}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-black/8 text-ink/50"
              aria-label="Fechar busca"
            >
              <X size={11} />
            </button>
          </div>
        ) : (
          /* Modo normal: logo + nome */
          <Link to="." className="flex min-w-0 items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-500 font-display text-sm font-bold text-white">
              {loja.nomeLoja.slice(0, 1)}
            </div>
            <div className="min-w-0 text-left">
              <p className="truncate font-display text-sm font-semibold leading-tight">{loja.nomeLoja}</p>
              <p className="flex items-center gap-1 text-xs text-ink/50">
                <span className={`h-1.5 w-1.5 rounded-full ${loja.aberto ? "bg-ok-500" : "bg-ink/30"}`} />
                {loja.aberto ? "Aberto agora" : "Fechado no momento"}
              </p>
            </div>
          </Link>
        )}

        {/* Ações do lado direito */}
        <div className="flex shrink-0 items-center gap-2">
          {!buscaAberta && (
            <>
              {/* Botão busca */}
              <button
                onClick={() => setBuscaAberta(true)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-white/80 text-ink/60 transition-colors hover:bg-white hover:text-ink"
                aria-label="Buscar produtos"
              >
                <Search size={16} />
              </button>

              {/* Botão compartilhar */}
              <button
                onClick={compartilhar}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-white/80 text-ink/60 transition-colors hover:bg-white hover:text-ink"
                aria-label="Compartilhar loja"
              >
                {compartilhado ? (
                  <Check size={15} className="text-ok-500" />
                ) : (
                  <Share2 size={15} />
                )}
              </button>
            </>
          )}

          {/* Botão sacola */}
          <button
            onClick={onAbrirSacola}
            className={`relative flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95 ${
              totalPecas > 0 ? "animate-cart-bounce" : ""
            }`}
            key={totalPecas} // força re-mount para reanimar ao adicionar item
          >
            Sacola
            {totalPecas > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold animate-pop">
                {totalPecas}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Toast "Link copiado" */}
      {compartilhado && (
        <div className="animate-toast-in absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white shadow-lg">
          Link copiado! ✓
        </div>
      )}
    </header>
  );
}
