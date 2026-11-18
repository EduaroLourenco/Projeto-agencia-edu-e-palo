import { Catalogo } from "../components/Catalogo";
import { Contato } from "../components/Contato";
import { Hero } from "../components/Hero";
import { CaseOS, Equipe, FaixaServicos, FaixaSitra, Perguntas, Processo, Produtos, Setores } from "../components/Secoes";

export function HomePage() {
  return (
    <>
      <Hero />
      <FaixaServicos />
      <Catalogo />
      <Setores />
      <FaixaSitra />
      <CaseOS />
      <Processo />
      <Produtos />
      <Equipe />
      <Perguntas />
      <Contato />
    </>
  );
}
