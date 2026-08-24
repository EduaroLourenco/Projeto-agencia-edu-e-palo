import { Hero } from "../components/Hero";
import { ServiceCards } from "../components/ServiceCards";
import { CaseStudy } from "../components/CaseStudy";
import { HowItWorks } from "../components/HowItWorks";
import { About } from "../components/About";
import { FAQ } from "../components/FAQ";
import { ContactCTA } from "../components/ContactCTA";

/**
 * Nova ordem: direto ao ponto.
 *
 * 1. Hero — título + subtítulo + CTAs
 * 2. ServiceCards — os 6 grupos macro, em grid, logo de cara
 * 3. Case — prova social (Zap-Commerce)
 * 4. Diferenciais — compactos
 * 5. Como funciona — as 5 etapas
 * 6. FAQ
 * 7. CTA final — formulário
 *
 * Seções removidas da home:
 * - Modules (carrossel) → substituído por ServiceCards
 * - OutrosProjetos → compacta com CaseStudy ou sai
 * - ConversasReais → prova social secundária
 * - About → info do time vai compacta no footer
 */
export function HomePage() {
  return (
    <>
      <Hero />
      <ServiceCards />
      <CaseStudy />
      <HowItWorks />
      <About />
      <FAQ />
      <ContactCTA />
    </>
  );
}
