import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { carregarLoja, carregarRascunho } from "./nucleo/loja";
import { Vitrine } from "./vitrine/Vitrine";
import { Estudio } from "./estudio/Estudio";
import { Painel } from "./painel/Painel";
import { Galeria } from "./Galeria";

function NaoEncontrada() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="font-display text-[17px] font-bold">Loja não encontrada</p>
      <p className="text-[13.5px] text-tinta-45">Confira o link ou volte pra lista de demonstrações.</p>
      <a href="/" className="mt-3 text-[13.5px] font-semibold text-[var(--marca-600)]">
        Ver as demonstrações
      </a>
    </div>
  );
}

function RotaVitrine() {
  const { slug = "" } = useParams();
  const loja = carregarLoja(slug);
  return loja ? <Vitrine loja={loja} /> : <NaoEncontrada />;
}

function RotaEstudio() {
  const { slug = "" } = useParams();
  const loja = carregarRascunho(slug);
  return loja ? <Estudio lojaInicial={loja} /> : <NaoEncontrada />;
}

function RotaPainel() {
  const { slug = "" } = useParams();
  const loja = carregarLoja(slug);
  return loja ? <Painel loja={loja} /> : <NaoEncontrada />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Galeria />} />
      <Route path="/:slug" element={<RotaVitrine />} />
      <Route path="/:slug/estudio" element={<RotaEstudio />} />
      <Route path="/:slug/painel" element={<RotaPainel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
