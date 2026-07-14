import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Modules } from "./components/Modules";
import { Differentiators } from "./components/Differentiators";
import { HowItWorks } from "./components/HowItWorks";
import { CaseStudy } from "./components/CaseStudy";
import { FAQ } from "./components/FAQ";
import { About } from "./components/About";
import { ContactCTA } from "./components/ContactCTA";
import { Footer } from "./components/Footer";
import { CursorGlow } from "./components/CursorGlow";
import { ScrollProgress } from "./components/ScrollProgress";

export default function App() {
  return (
    <div className="relative min-h-screen bg-ink text-white">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[70]" />
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Modules />
        <Differentiators />
        <HowItWorks />
        <CaseStudy />
        <FAQ />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
