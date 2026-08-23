import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { AGENCIA, linkWhatsApp } from "../data/content";
import { MagneticButton } from "./MagneticButton";
import { rastrear } from "../lib/analytics";

// Todos os links, na ordem real das seções na página — usados pro cálculo
// de seção ativa e pro menu mobile (lista única, sem agrupar).
const LINKS = [
  { href: "/#modulos", label: "Módulos" },
  { href: "/servicos", label: "Serviços" },
  { href: "/#case", label: "Case" },
  { href: "/#outros-projetos", label: "Projetos" },
  { href: "/#conversas", label: "Na prática" },
  { href: "/#diferenciais", label: "Diferenciais" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#quem-somos", label: "Quem somos" },
];

// No desktop, só os 5 mais importantes ficam sempre visíveis — o resto
// entra num "Mais" pra não virar uma fileira quebrando linha.
const PRINCIPAIS_HREFS = ["/#modulos", "/servicos", "/#case", "/#quem-somos"];
const LINKS_PRINCIPAIS = LINKS.filter((l) => PRINCIPAIS_HREFS.includes(l.href));
const LINKS_MAIS = LINKS.filter((l) => !PRINCIPAIS_HREFS.includes(l.href));

function isActiveLink(href: string, pathname: string, secaoAtiva: string) {
  if (!href.includes("#")) return pathname === href;
  return pathname === "/" && href.split("#")[1] === secaoAtiva;
}

export function Nav() {
  const [aberto, setAberto] = useState(false);
  const [maisAberto, setMaisAberto] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState("");
  const { pathname } = useLocation();
  const maisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/") {
      setSecaoAtiva("");
      return;
    }

    // Posição, não IntersectionObserver: o observer só entrega as seções que
    // MUDARAM de estado, então pegar "a primeira que intersecta" dessa lista
    // parcial deixava o menu marcando uma seção que já saiu da tela. Aqui a
    // seção ativa é sempre a última cujo topo passou da linha de leitura.
    const ids = LINKS.filter((l) => l.href.includes("#")).map((l) => l.href.split("#")[1]);
    let frame = 0;

    function calcular() {
      frame = 0;
      const linhaDeLeitura = window.innerHeight * 0.35;

      const fim = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (fim) {
        setSecaoAtiva(ids[ids.length - 1]);
        return;
      }

      const secoes = ids
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, topo: el.getBoundingClientRect().top } : null;
        })
        .filter((s): s is { id: string; topo: number } => s !== null)
        .sort((a, b) => a.topo - b.topo);

      let ativa = "";
      for (const secao of secoes) {
        if (secao.topo <= linhaDeLeitura) ativa = secao.id;
      }
      setSecaoAtiva(ativa);
    }

    function agendar() {
      if (frame) return;
      frame = requestAnimationFrame(calcular);
    }

    calcular();
    window.addEventListener("scroll", agendar, { passive: true });
    window.addEventListener("resize", agendar);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", agendar);
      window.removeEventListener("resize", agendar);
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  // Fecha o dropdown "Mais" ao clicar fora ou rolar a página.
  useEffect(() => {
    if (!maisAberto) return;
    function fechar(e: MouseEvent) {
      if (maisRef.current && !maisRef.current.contains(e.target as Node)) setMaisAberto(false);
    }
    function fecharAoRolar() {
      setMaisAberto(false);
    }
    document.addEventListener("mousedown", fechar);
    window.addEventListener("scroll", fecharAoRolar, { passive: true });
    return () => {
      document.removeEventListener("mousedown", fechar);
      window.removeEventListener("scroll", fecharAoRolar);
    };
  }, [maisAberto]);

  const algumDoMaisAtivo = LINKS_MAIS.some((l) => isActiveLink(l.href, pathname, secaoAtiva));

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-400 font-display text-sm font-bold text-ink">
            {AGENCIA.iniciais}
          </span>
          <span className="whitespace-nowrap font-display text-sm font-bold tracking-tight text-white">
            {AGENCIA.nome}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS_PRINCIPAIS.map((l) => {
            const ativo = isActiveLink(l.href, pathname, secaoAtiva);
            return (
              <a
                key={l.href}
                href={l.href}
                className={`relative whitespace-nowrap text-sm font-medium transition-colors ${
                  ativo ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
                {ativo && (
                  <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-violet-400 to-blue-400" />
                )}
              </a>
            );
          })}

          <div ref={maisRef} className="relative">
            <button
              onClick={() => setMaisAberto((v) => !v)}
              className={`relative flex items-center gap-1 whitespace-nowrap text-sm font-medium transition-colors ${
                algumDoMaisAtivo || maisAberto ? "text-white" : "text-white/60 hover:text-white"
              }`}
            >
              Mais
              <ChevronDown size={14} className={`transition-transform ${maisAberto ? "rotate-180" : ""}`} />
              {algumDoMaisAtivo && (
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-violet-400 to-blue-400" />
              )}
            </button>

            <AnimatePresence>
              {maisAberto && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-white/10 bg-surface p-2 shadow-2xl shadow-black/50"
                >
                  {LINKS_MAIS.map((l) => {
                    const ativo = isActiveLink(l.href, pathname, secaoAtiva);
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setMaisAberto(false)}
                        className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          ativo ? "bg-white/8 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {l.label}
                      </a>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <MagneticButton
          href={linkWhatsApp()}
          target="_blank"
          rel="noreferrer"
          onClick={() => rastrear("whatsapp_click", { origem: "nav_desktop" })}
          className="hidden rounded-full bg-white px-5 py-2.5 text-sm font-bold text-ink transition-transform hover:scale-105 lg:block"
        >
          Falar no WhatsApp
        </MagneticButton>

      </div>
    </header>

      {/* Fora do <header> de propósito: ele usa backdrop-blur, e
          backdrop-filter cria bloco de contenção — dentro dele, "fixed
          bottom-0" ancoraria no fim do cabeçalho, não da tela.

          Barra de ação inferior (só no celular): menu e CTA na zona do
          polegar. O hambúrguer ficava no canto superior direito — o ponto
          mais difícil de alcançar com uma mão num celular alto. */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <button
            onClick={() => setAberto(true)}
            aria-label="Abrir menu"
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border border-white/10 bg-white/5 text-white"
          >
            <Menu size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">Menu</span>
          </button>
          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "barra_inferior_mobile" })}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-pink-400 text-sm font-bold text-ink"
          >
            Falar no WhatsApp
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {aberto && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAberto(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Folha inferior, não gaveta lateral: abre do mesmo lado de onde
                o dedo tocou, e a lista nasce perto do polegar. */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed inset-x-0 bottom-0 z-[70] flex max-h-[82vh] flex-col rounded-t-3xl border-t border-white/10 bg-surface px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 lg:hidden"
            >
              <span className="mx-auto mb-4 h-1 w-10 shrink-0 rounded-full bg-white/15" />
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white">Menu</span>
                <button
                  onClick={() => setAberto(false)}
                  aria-label="Fechar menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sem CTA de WhatsApp aqui: a barra logo abaixo já tem o
                  mesmo botão, a um centímetro de distância. */}
              <nav className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pb-2">
                {LINKS.map((l) => {
                  const ativo = isActiveLink(l.href, pathname, secaoAtiva);
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={() => setAberto(false)}
                      className={`rounded-xl px-3 py-3.5 text-base font-medium ${
                        ativo ? "bg-violet-500/15 text-white" : "text-white/70"
                      }`}
                    >
                      {l.label}
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
