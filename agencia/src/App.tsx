import { Navigate, Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { ScrollDepthTracker } from "./components/ScrollDepthTracker";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-warm focus:px-4 focus:py-3"
      >
        Pular para o conteúdo
      </a>
      <ScrollDepthTracker />
      <ScrollToTop />
      <Nav />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* O catálogo antigo pode estar em links já compartilhados. */}
          <Route path="/servicos" element={<Navigate to="/#frentes" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
