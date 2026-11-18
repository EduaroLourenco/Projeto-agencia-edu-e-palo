import { useCallback, useMemo, useState } from "react";
import { MotionConfig } from "framer-motion";
import { Navigate, Route, Routes } from "react-router-dom";
import { BarraLista, ModalServico } from "./components/Catalogo";
import { Footer } from "./components/Footer";
import { Nav } from "./components/Nav";
import { ScrollDepthTracker } from "./components/ScrollDepthTracker";
import { ScrollToTop } from "./components/ScrollToTop";
import { ListaContext } from "./lib/lista";
import { HomePage } from "./pages/HomePage";
import { ServicosPage } from "./pages/ServicosPage";

export default function App() {
  const [ids, setIds] = useState<string[]>([]);
  const [aberto, setAberto] = useState<string | null>(null);
  const fechar = useCallback(() => setAberto(null), []);

  const lista = useMemo(
    () => ({
      ids,
      alternar: (id: string) => setIds((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id])),
      limpar: () => setIds([]),
      abrir: setAberto,
    }),
    [ids],
  );

  return (
    <MotionConfig reducedMotion="user">
      <ListaContext.Provider value={lista}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-3"
        >
          Pular para o conteúdo
        </a>
        <ScrollDepthTracker />
        <ScrollToTop />
        <Nav />
        <main id="conteudo">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicos" element={<ServicosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        {ids.length > 0 && <div aria-hidden className="h-20 bg-ink" />}
        <ModalServico id={aberto} onClose={fechar} />
        <BarraLista />
      </ListaContext.Provider>
    </MotionConfig>
  );
}
