import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CartProvider, useCart } from "../context/CartContext";
import { Header } from "../components/Header";
import { CategoryFilter } from "../components/CategoryFilter";
import { WholesaleProgressBar } from "../components/WholesaleProgressBar";
import { ProductGrid } from "../components/ProductGrid";
import { CartDrawer } from "../components/CartDrawer";
import { CheckoutSheet } from "../components/CheckoutSheet";
import { calcularResumoPedido } from "../lib/pedido";
import { useLoja } from "../hooks/useLoja";
import { useProdutos } from "../hooks/useProdutos";

function StorefrontInner() {
  const { slug = "" } = useParams();
  const loja = useLoja(slug);
  const produtos = useProdutos(slug);
  const { itens, adicionarItem, atualizarQuantidade, totalPecas, limparCarrinho } = useCart();

  const [categoria, setCategoria] = useState("Todas");
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false);

  const categorias = useMemo(() => {
    const set = new Set<string>();
    produtos.forEach((p) => p.categorias.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [produtos]);

  const produtosFiltrados = useMemo(
    () =>
      produtos.filter(
        (p) => p.isAtivo && (categoria === "Todas" || p.categorias.includes(categoria)),
      ),
    [produtos, categoria],
  );

  const resumo = useMemo(
    () => (loja ? calcularResumoPedido(itens, produtos, loja.regraAtacado) : null),
    [itens, produtos, loja],
  );

  if (loja === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-ink/40">Carregando vitrine...</p>
      </div>
    );
  }

  if (loja === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="font-display text-lg font-bold">Loja não encontrada</p>
        <p className="text-sm text-ink/50">
          Confira o link enviado pelo lojista ou volte para a loja de demonstração.
        </p>
        <Link to="/bella-atacado" className="mt-3 rounded-full bg-ink px-5 py-2.5 text-sm text-white">
          Ver loja de demonstração
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper pb-8">
      <Header loja={loja} totalPecas={totalPecas} onAbrirSacola={() => setCarrinhoAberto(true)} />

      <CategoryFilter categorias={categorias} ativa={categoria} onSelecionar={setCategoria} />

      {itens.length === 0 && (
        <div className="px-4 pb-1">
          <p className="mb-1 text-xs text-ink/40">
            Regra de atacado:{" "}
            {loja.regraAtacado.tipo === "quantidade"
              ? `a partir de ${loja.regraAtacado.minimo} peças`
              : `pedidos acima de R$ ${loja.regraAtacado.minimo}`}
          </p>
        </div>
      )}

      {resumo && itens.length > 0 && (
        <WholesaleProgressBar regra={loja.regraAtacado} progressoAtual={resumo.progressoAtual} />
      )}

      <ProductGrid
        produtos={produtosFiltrados}
        atacadoAtivo={resumo?.atacadoAtivo ?? false}
        onAdicionar={(produto, tamanho, quantidade) =>
          adicionarItem(produto.id, tamanho, quantidade)
        }
      />

      <div className="fixed inset-x-0 bottom-4 z-20 mx-auto w-full max-w-md px-4">
        <Link
          to={`/${slug}/admin`}
          className="pointer-events-auto ml-auto block w-fit rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink/50 shadow backdrop-blur"
        >
          Sou lojista →
        </Link>
      </div>

      {resumo && (
        <CartDrawer
          aberto={carrinhoAberto}
          onFechar={() => setCarrinhoAberto(false)}
          linhas={resumo.linhas}
          subtotal={resumo.subtotal}
          regra={loja.regraAtacado}
          progressoAtual={resumo.progressoAtual}
          atacadoAtivo={resumo.atacadoAtivo}
          onAtualizarQuantidade={atualizarQuantidade}
          onIrParaCheckout={() => {
            setCarrinhoAberto(false);
            setCheckoutAberto(true);
          }}
        />
      )}

      {resumo && (
        <CheckoutSheet
          aberto={checkoutAberto}
          onFechar={() => setCheckoutAberto(false)}
          loja={loja}
          linhas={resumo.linhas}
          atacadoAtivo={resumo.atacadoAtivo}
          regraDescricao={resumo.regraDescricao}
          total={resumo.subtotal}
          onPedidoEnviado={() => {
            setCheckoutAberto(false);
            setPedidoConfirmado(true);
            limparCarrinho();
            setTimeout(() => setPedidoConfirmado(false), 4000);
          }}
        />
      )}

      {pedidoConfirmado && (
        <div className="fixed inset-x-4 top-4 z-50 animate-slide-up rounded-2xl bg-ink px-4 py-3 text-center text-sm font-semibold text-white shadow-xl">
          Pedido enviado! Confira o WhatsApp para confirmar com {loja.nomeLoja}. 🎉
        </div>
      )}
    </div>
  );
}

export function Storefront() {
  const { slug = "" } = useParams();
  return (
    <CartProvider tenantId={slug}>
      <StorefrontInner />
    </CartProvider>
  );
}
