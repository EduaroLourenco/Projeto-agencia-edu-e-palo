import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Reveal } from "./Reveal";

interface Slide {
  src: string;
  titulo: string;
  descricao: string;
  tipo: "desktop" | "mobile";
}

const SLIDES: Slide[] = [
  {
    src: "/cases/memo/01-dashboard.png",
    titulo: "Dashboard Operacional",
    descricao: "Capacidade da oficina, OS concluídas, status geral e OTs por técnico — tudo em tempo real.",
    tipo: "desktop",
  },
  {
    src: "/cases/memo/02-sla-gargalos.png",
    titulo: "SLA & Gargalos",
    descricao: "Alerta automático de diagnóstico atrasado e aprovação pendente, antes que vire prejuízo.",
    tipo: "desktop",
  },
  {
    src: "/cases/memo/03-funil-orcamentos.png",
    titulo: "Funil de Orçamentos",
    descricao: "Pipeline de orçamento por status — do 'aguardando aprovação' ao fechamento.",
    tipo: "desktop",
  },
  {
    src: "/cases/memo/04-planner.png",
    titulo: "Programação de Ordens",
    descricao: "Agenda dos técnicos com arrastar e soltar. Zero choque de horário.",
    tipo: "desktop",
  },
  {
    src: "/cases/memo/05-kanban-os.png",
    titulo: "Ordens de Serviço",
    descricao: "Kanban do ciclo completo: aberta, diagnóstico, aprovação, execução, faturamento.",
    tipo: "desktop",
  },
  {
    src: "/cases/memo/06-app-tecnico.png",
    titulo: "App do Técnico",
    descricao: "Agenda, execução, laudo e fotos direto no celular de quem está em campo.",
    tipo: "mobile",
  },
  {
    src: "/cases/memo/07-app-agenda.png",
    titulo: "Agenda do Técnico",
    descricao: "Visão semanal dos atendimentos agendados, sincronizada com o painel do administrador.",
    tipo: "mobile",
  },
];

export function OutrosProjetos() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [comErro, setComErro] = useState<Record<number, boolean>>({});

  function irPara(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const alvo = track.children[index] as HTMLElement | undefined;
    if (!alvo) return;
    track.scrollTo({ left: alvo.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setAtivo(index);
  }

  function mover(direcao: 1 | -1) {
    irPara(Math.min(Math.max(ativo + direcao, 0), SLIDES.length - 1));
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    const centro = track.scrollLeft + track.clientWidth / 2;
    let maisProximo = 0;
    let menorDistancia = Infinity;
    Array.from(track.children).forEach((filho, i) => {
      const el = filho as HTMLElement;
      const centroFilho = el.offsetLeft - track.offsetLeft + el.clientWidth / 2;
      const distancia = Math.abs(centro - centroFilho);
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        maisProximo = i;
      }
    });
    setAtivo(maisProximo);
  }

  return (
    <section id="outros-projetos" className="relative py-24 sm:py-32">
      <div className="glow-cyan pointer-events-none absolute right-0 top-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full opacity-50" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Outros projetos feitos</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Cada sistema, construído do zero pra operação real de um cliente.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/55">
            Um exemplo: sistema completo de gestão de Ordens de Serviço pra uma assistência técnica —
            do diagnóstico ao faturamento, no computador do administrador e no celular do técnico.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-14">
            {/* Setas de navegação */}
            <button
              onClick={() => mover(-1)}
              disabled={ativo === 0}
              aria-label="Projeto anterior"
              className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-surface text-white transition-opacity hover:bg-white/10 disabled:pointer-events-none disabled:opacity-0 md:flex"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => mover(1)}
              disabled={ativo === SLIDES.length - 1}
              aria-label="Próximo projeto"
              className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-surface text-white transition-opacity hover:bg-white/10 disabled:pointer-events-none disabled:opacity-0 md:flex"
            >
              <ChevronRight size={18} />
            </button>

            {/* Trilho do carrossel */}
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {SLIDES.map((s, i) => (
                <div
                  key={s.src}
                  className={`shrink-0 snap-center ${
                    s.tipo === "mobile"
                      ? "w-[62%] sm:w-[38%] lg:w-[26%]"
                      : "w-full sm:w-[85%] lg:w-[70%]"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-2 shadow-2xl shadow-black/50">
                    {/* Barra de janela */}
                    <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2.5">
                      <span className="h-2 w-2 rounded-full bg-white/15" />
                      <span className="h-2 w-2 rounded-full bg-white/15" />
                      <span className="h-2 w-2 rounded-full bg-white/15" />
                      <span className="ml-2 truncate text-[10px] font-semibold text-white/35">{s.titulo}</span>
                    </div>

                    <div
                      className={`flex items-center justify-center bg-black/50 ${
                        s.tipo === "mobile" ? "aspect-[9/14]" : "aspect-[16/10]"
                      }`}
                    >
                      {comErro[i] ? (
                        <div className="flex flex-col items-center gap-2 text-white/25">
                          <ImageOff size={28} />
                          <span className="text-xs font-semibold">Captura em breve</span>
                        </div>
                      ) : (
                        <img
                          src={s.src}
                          alt={s.titulo}
                          loading="lazy"
                          onError={() => setComErro((prev) => ({ ...prev, [i]: true }))}
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 px-1">
                    <p className="font-display text-base font-bold text-white">{s.titulo}</p>
                    <p className="mt-1 text-sm text-white/50">{s.descricao}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicadores */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  onClick={() => irPara(i)}
                  aria-label={`Ir pro projeto ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === ativo ? "w-6 bg-cyan-400" : "w-1.5 bg-white/15 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
