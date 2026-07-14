import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Modules } from "./components/Modules";
import { HowItWorks } from "./components/HowItWorks";
import { CaseStudy } from "./components/CaseStudy";
import { About } from "./components/About";
import { ContactCTA } from "./components/ContactCTA";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <Nav />
      <main>
        <Hero />
        <Modules />
        <HowItWorks />
        <CaseStudy />
        <About />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
