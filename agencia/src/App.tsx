import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { CursorGlow } from "./components/CursorGlow";
import { ScrollProgress } from "./components/ScrollProgress";
import { BackToTop } from "./components/BackToTop";
import { ScrollDepthTracker } from "./components/ScrollDepthTracker";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./pages/HomePage";
import { ServicosPage } from "./pages/ServicosPage";

export default function App() {
  return (
    /* pb no celular: espaço pro conteúdo não terminar atrás da barra de ação inferior. */
    <div className="relative min-h-screen bg-ink pb-20 text-white lg:pb-0">
      <ScrollProgress />
      <CursorGlow />
      <ScrollDepthTracker />
      <ScrollToTop />
      <Nav />
      <main className="relative z-10">
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
