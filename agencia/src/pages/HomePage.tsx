import { Hero } from "../components/Hero";
import { Modules } from "../components/Modules";
import { CaseStudy } from "../components/CaseStudy";
import { OutrosProjetos } from "../components/OutrosProjetos";
import { ConversasReais } from "../components/ConversasReais";
import { Differentiators } from "../components/Differentiators";
import { HowItWorks } from "../components/HowItWorks";
import { FAQ } from "../components/FAQ";
import { About } from "../components/About";
import { ContactCTA } from "../components/ContactCTA";

/**
 * Ordem = funil. Antes o visitante passava por ~8 telas de prova antes de
 * descobrir o que a gente vende. Agora: ele se reconhece (Setores), vê a
 * oferta (Módulos) e só então recebe a prova de que funciona.
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <Modules />
      <CaseStudy />
      <OutrosProjetos />
      <ConversasReais />
      <Differentiators />
      <HowItWorks />
      <FAQ />
      <About />
      <ContactCTA />
    </>
  );
}
