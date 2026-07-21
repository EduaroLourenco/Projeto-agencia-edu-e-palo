import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LayoutGrid, Settings, ExternalLink } from "lucide-react";
import type { LojaConfig, Produto } from "../../types";
import { ApiError, buscarLoja, listarProdutosDoLojista } from "../../lib/api";
import { clearToken, getToken } from "../../lib/auth";
import { AdminLogin } from "./AdminLogin";
import { ProductsList } from "./ProductsList";
import { StoreSettings } from "./StoreSettings";

type Aba = "produtos" | "config";

export function AdminPanel() {
  const { slug = "" } = useParams();
  const [token, setTokenState] = useState<string | null>(null);
  const [loja, setLoja] = useState<LojaConfig | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState<Aba>("produtos");

  const carregarSessao = useCallback(
    async (tokenAtual: string) => {
      try {
        const [lojaData, produtosData] = await Promise.all([
          buscarLoja(slug),
          listarProdutosDoLojista(tokenAtual),
        ]);
        if (!lojaData) throw new ApiError(404, "Loja não encontrada");
        setLoja(lojaData);
        setProdutos(produtosData);
        setTokenState(tokenAtual);
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) clearToken(slug);
        setTokenState(null);
      } finally {
        setCarregando(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    setCarregando(true);
    const tokenSalvo = getToken(slug);
    if (tokenSalvo) {
      carregarSessao(tokenSalvo);
    } else {
      setCarregando(false);
    }
  }, [slug, carregarSessao]);

  function recarregarProdutos() {
    if (token) listarProdutosDoLojista(token).then(setProdutos);
  }

  function recarregarLoja() {
    buscarLoja(slug).then((l) => l && setLoja(l));
  }

  if (carregando) return null;

  if (!token || !loja) {
    return (
      <AdminLogin
        onAutenticar={(lojaAutenticada) => {
          const tokenSalvo = getToken(slug);
          if (tokenSalvo) carregarSessao(tokenSalvo);
          setLoja(lojaAutenticada);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Sidebar — apenas telas grandes */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/5 bg-white lg:flex">
        <div className="border-b border-black/5 px-5 py-5">
          <p className="text-[11px] font-semibold text-brand-600">Painel do Lojista</p>
          <h1 className="mt-0.5 truncate font-display text-lg font-bold">{loja.nomeLoja}</h1>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <button
            onClick={() => setAba("produtos")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              aba === "produtos" ? "bg-ink text-white" : "text-ink/60 hover:bg-black/5"
            }`}
          >
            <LayoutGrid size={16} />
            Produtos
          </button>
          <button
            onClick={() => setAba("config")}
            className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
              aba === "config" ? "bg-ink text-white" : "text-ink/60 hover:bg-black/5"
            }`}
          >
            <Settings size={16} />
            Configurações
          </button>
        </nav>
        <div className="border-t border-black/5 p-3">
          <Link
            to={`/${slug}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-black/5 px-3.5 py-2.5 text-sm font-semibold text-ink/70 hover:bg-black/10"
          >
            Ver vitrine
            <ExternalLink size={14} />
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Header — apenas mobile/tablet */}
        <header className="sticky top-0 z-20 border-b border-black/5 bg-paper/95 px-4 py-3.5 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-brand-600">Painel do Lojista</p>
              <h1 className="font-display text-base font-bold">{loja.nomeLoja}</h1>
            </div>
            <Link
              to={`/${slug}`}
              className="rounded-full bg-ink px-3.5 py-2 text-xs font-semibold text-white"
            >
              Ver vitrine ↗
            </Link>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setAba("produtos")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
                aba === "produtos" ? "bg-ink text-white" : "bg-black/5 text-ink/60"
              }`}
            >
              Produtos
            </button>
            <button
              onClick={() => setAba("config")}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${
                aba === "config" ? "bg-ink text-white" : "bg-black/5 text-ink/60"
              }`}
            >
              Configurações
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-5xl lg:px-8 lg:py-8">
          {aba === "produtos" ? (
            <ProductsList token={token} produtos={produtos} onMudou={recarregarProdutos} />
          ) : (
            <StoreSettings token={token} loja={loja} onMudou={recarregarLoja} />
          )}
        </div>
      </div>
    </div>
  );
}
