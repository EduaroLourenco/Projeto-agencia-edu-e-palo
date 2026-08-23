import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisivel(window.scrollY > 800);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao topo"
      /* No celular sobe acima da barra de ação inferior pra não colidir. */
      className={`fixed bottom-24 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-surface/90 text-white shadow-lg backdrop-blur transition-all duration-300 hover:bg-surface lg:bottom-6 ${
        visivel ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
