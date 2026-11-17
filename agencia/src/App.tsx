import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { ScrollProgress } from "./components/ScrollProgress";
import { BackToTop } from "./components/BackToTop";
import { ScrollDepthTracker } from "./components/ScrollDepthTracker";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { ServicosPage } from "./pages/ServicosPage";

export default function App() {
  return (
    /* pb no celular: o conteúdo não termina atrás da barra de ação inferior. */
    <div className="min-h-screen bg-paper pb-20 text-ink lg:pb-0">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <ScrollProgress />
      <ScrollDepthTracker />
      <ScrollToTop />
      <Nav />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicos" element={<ServicosPage />} />
        </Routes>
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}
