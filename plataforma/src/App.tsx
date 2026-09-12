import { Link, Navigate, Route, Routes, useParams } from "react-router-dom";
import { carregarLoja, carregarRascunho } from "./nucleo/loja";
import { Vitrine } from "./vitrine/Vitrine";
import { Estudio } from "./estudio/Estudio";
import { Painel } from "./painel/Painel";
import { Galeria } from "./Galeria";
import { CriarConta, Entrar } from "./conta/Entrada";
import { Plataforma } from "./app/Plataforma";
import { contaAtual } from "./conta/sessao";

function NaoEncontrada() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-2 px-6 text-center">
      <p className="font-display text-[17px] font-bold">Loja não encontrada</p>
      <p className="text-[13.5px] text-tinta-45">Confira o link ou volte pra lista de demonstrações.</p>
      <Link to="/lojas" className="mt-3 text-[13.5px] font-semibold text-[var(--marca-600)]">
        Ver as demonstrações
      </Link>
    </div>
  );
}

function Porta() {
  return <Navigate to={contaAtual() ? "/app" : "/entrar"} replace />;
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
      {/* A raiz é a porta: quem já entrou vai pro painel, quem não entrou
          vê a tela de login. A galeria de lojas públicas virou /lojas —
          ela é vitrine de demonstração, não a casa de ninguém. */}
      <Route path="/" element={<Porta />} />
      <Route path="/lojas" element={<Galeria />} />
      <Route path="/entrar" element={<Entrar />} />
      <Route path="/criar-conta" element={<CriarConta />} />
      <Route path="/app" element={<Plataforma />} />
      <Route path="/:slug" element={<RotaVitrine />} />
      <Route path="/:slug/estudio" element={<RotaEstudio />} />
      <Route path="/:slug/painel" element={<RotaPainel />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
