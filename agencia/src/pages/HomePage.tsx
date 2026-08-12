import { Hero } from "../components/Hero";
import { Marquee } from "../components/Marquee";
import { Modules } from "../components/Modules";
import { Nichos } from "../components/Nichos";
import { Differentiators } from "../components/Differentiators";
import { HowItWorks } from "../components/HowItWorks";
import { CaseStudy } from "../components/CaseStudy";
import { OutrosProjetos } from "../components/OutrosProjetos";
import { Testimonials } from "../components/Testimonials";
import { ConversasReais } from "../components/ConversasReais";
import { FAQ } from "../components/FAQ";
import { About } from "../components/About";
import { ContactCTA } from "../components/ContactCTA";

export function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <CaseStudy />
      <OutrosProjetos />
      <Testimonials />
      <ConversasReais />
      <Modules />
      <Nichos />
      <Differentiators />
      <HowItWorks />
      <FAQ />
      <About />
      <ContactCTA />
    </>
  );
}
