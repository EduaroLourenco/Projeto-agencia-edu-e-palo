import { Hero } from "../components/Hero";
import { Frentes } from "../components/Frentes";
import { Produtos } from "../components/Produtos";
import { ABepa, Duvidas, Equipe } from "../components/Institucional";
import { Contato } from "../components/Contato";

export function HomePage() {
  return (
    <>
      <Hero />
      <Frentes />
      <Produtos />
      <ABepa />
      <Equipe />
      <Duvidas />
      <Contato />
    </>
  );
}
