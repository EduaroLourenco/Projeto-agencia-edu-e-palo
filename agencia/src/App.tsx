import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Modules } from "./components/Modules";
import { Nichos } from "./components/Nichos";
import { Differentiators } from "./components/Differentiators";
import { HowItWorks } from "./components/HowItWorks";
import { CaseStudy } from "./components/CaseStudy";
import { Testimonials } from "./components/Testimonials";
import { FAQ } from "./components/FAQ";
import { About } from "./components/About";
import { ContactCTA } from "./components/ContactCTA";
import { Footer } from "./components/Footer";
import { CursorGlow } from "./components/CursorGlow";
import { ScrollProgress } from "./components/ScrollProgress";
import { BackToTop } from "./components/BackToTop";
import { ScrollDepthTracker } from "./components/ScrollDepthTracker";

export default function App() {
  return (
    <div className="relative min-h-screen bg-ink text-white">
      <div className="noise-overlay pointer-events-none fixed inset-0 z-[70]" />
      <ScrollProgress />
      <CursorGlow />
      <ScrollDepthTracker />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Testimonials />
        <Modules />
        <Nichos />
        <Differentiators />
        <HowItWorks />
        <CaseStudy />
        <FAQ />
        <About />
        <ContactCTA />
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}
