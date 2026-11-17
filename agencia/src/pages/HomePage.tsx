import { Hero } from "../components/Hero";
import { SecaoServicos } from "../components/Servicos";
import { Sitra } from "../components/Sitra";
import { CaseStudy } from "../components/CaseStudy";
import { HowItWorks } from "../components/HowItWorks";
import { About } from "../components/About";
import { FAQ } from "../components/FAQ";
import { ContactCTA } from "../components/ContactCTA";

export function HomePage() {
  return (
    <>
      <Hero />
      <SecaoServicos />
      <Sitra />
      <CaseStudy />
      <HowItWorks />
      <About />
      <FAQ />
      <ContactCTA />
    </>
  );
}
