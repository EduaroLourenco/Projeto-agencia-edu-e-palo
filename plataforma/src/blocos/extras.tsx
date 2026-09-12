import { useEffect, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Clock,
  CreditCard,
  ExternalLink,
  HelpCircle,
  Images,
  Link2,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Store,
  Timer,
  Truck,
  Wallet,
} from "lucide-react";
import type { DefinicaoBloco, PropsBloco } from "../nucleo/tipos";
import { TituloBloco, VazioNoEstudio } from "./pecas";

/**
 * Blocos que não dependem do catálogo.
 *
 * São os que fazem a loja parecer uma loja de verdade em vez de uma grade de
 * produtos: o que a gente promete, quando abre, onde fica, o que costumam
 * perguntar. Nenhum deles inventa dado — todos são preenchidos pelo lojista
 * no estúdio.
 */

/* ============================================================
   SELOS — as promessas da loja, em fila
   ============================================================ */

const ICONES = {
  entrega: Truck,
  garantia: ShieldCheck,
  pagamento: CreditCard,
  prazo: Clock,
  caixa: Package,
  troca: RotateCcw,
  atendimento: Phone,
  qualidade: BadgeCheck,
  loja: Store,
  carteira: Wallet,
  brilho: Sparkles,
};

const CAMPO_ICONE = {
  tipo: "escolha" as const,
  rotulo: "Ícone",
  padrao: "entrega",
  opcoes: [
    { valor: "entrega", nome: "Caminhão" },
    { valor: "garantia", nome: "Escudo" },
    { valor: "pagamento", nome: "Cartão" },
    { valor: "prazo", nome: "Relógio" },
    { valor: "caixa", nome: "Caixa" },
    { valor: "troca", nome: "Troca" },
    { valor: "atendimento", nome: "Telefone" },
    { valor: "qualidade", nome: "Selo" },
    { valor: "loja", nome: "Loja" },
    { valor: "carteira", nome: "Carteira" },
    { valor: "brilho", nome: "Brilho" },
  ],
};

interface Selo {
  icone?: string;
  titulo?: string;
  texto?: string;
}

function Selos({ props, editando }: PropsBloco<{ titulo: string; selos: Selo[]; variante: string }>) {
  const lista = (props.selos ?? []).filter((s) => s.titulo || s.texto);
  if (!lista.length) {
    return editando ? <VazioNoEstudio>Adicione pelo menos um selo.</VazioNoEstudio> : null;
  }

  // Em fila que desliza ou em grade de dois. No celular a fila ganha quando
  // são muitos: quatro selos numa grade viram quatro caixas minúsculas.
  const emFila = props.variante !== "grade";

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div
        className={
          emFila
            ? "sem-barra sangra flex gap-2.5 overflow-x-auto pb-1"
            : "grid grid-cols-2 gap-2.5"
        }
      >
        {lista.map((s, i) => {
          const Icone = ICONES[(s.icone ?? "entrega") as keyof typeof ICONES] ?? Truck;
          return (
            <div
              key={i}
              className={`flex flex-col gap-2 border border-borda bg-papel p-3.5 ${emFila ? "w-[62%] shrink-0 sm:w-[34%]" : ""}`}
              style={{ borderRadius: "var(--canto-g)" }}
            >
              <span
                className="flex h-9 w-9 items-center justify-center bg-[var(--marca-50)] text-[var(--marca-700)]"
                style={{ borderRadius: "var(--canto-p)" }}
              >
                <Icone size={18} />
              </span>
              {s.titulo && <p className="text-[13.5px] font-bold leading-tight">{s.titulo}</p>}
              {s.texto && <p className="text-[12.5px] leading-snug text-tinta-45">{s.texto}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const blocoSelos: DefinicaoBloco<{ titulo: string; selos: Selo[]; variante: string }> = {
  tipo: "selos",
  nome: "Selos de confiança",
  descricao: "Entrega, prazo, garantia — o que a loja promete.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: ShieldCheck,
  variantes: [
    { valor: "fila", nome: "Em fila que desliza" },
    { valor: "grade", nome: "Em grade" },
  ],
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "" },
    selos: {
      tipo: "lista",
      rotulo: "Selos",
      max: 8,
      de: {
        icone: CAMPO_ICONE,
        titulo: { tipo: "texto", rotulo: "Título", padrao: "Entrega em 48h" },
        texto: { tipo: "texto", rotulo: "Detalhe", padrao: "Na rota da sua região." },
      },
      padrao: [
        { icone: "entrega", titulo: "Entrega em 48h", texto: "Na rota da sua região." },
        { icone: "pagamento", titulo: "Boleto a prazo", texto: "Pra cliente cadastrado." },
        { icone: "troca", titulo: "Troca sem dor", texto: "Avariou, a gente repõe." },
      ],
    },
  },
  Componente: Selos,
};

/* ============================================================
   PERGUNTAS FREQUENTES
   ============================================================ */

interface Pergunta {
  pergunta?: string;
  resposta?: string;
}

function Perguntas({ props, editando }: PropsBloco<{ titulo: string; perguntas: Pergunta[] }>) {
  const lista = (props.perguntas ?? []).filter((p) => p.pergunta);
  const [aberta, setAberta] = useState<number | null>(0);
  if (!lista.length) {
    return editando ? <VazioNoEstudio>Adicione pelo menos uma pergunta.</VazioNoEstudio> : null;
  }

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div className="flex flex-col gap-2">
        {lista.map((p, i) => {
          const expandida = aberta === i;
          return (
            <div
              key={i}
              className="border border-borda bg-papel"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <button
                onClick={() => setAberta(expandida ? null : i)}
                aria-expanded={expandida}
                className="flex min-h-[52px] w-full items-center gap-3 px-4 py-3 text-left"
              >
                <span className="min-w-0 flex-1 text-[13.5px] font-semibold leading-snug">
                  {p.pergunta}
                </span>
                <ChevronDown
                  size={17}
                  className={`shrink-0 text-tinta-45 transition-transform ${expandida ? "rotate-180" : ""}`}
                />
              </button>
              {expandida && p.resposta && (
                <p className="anima-surgir px-4 pb-4 text-[13px] leading-relaxed text-tinta-70">
                  {p.resposta}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const blocoPerguntas: DefinicaoBloco<{ titulo: string; perguntas: Pergunta[] }> = {
  tipo: "perguntas",
  nome: "Perguntas frequentes",
  descricao: "Responde antes de virar mensagem no WhatsApp.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: HelpCircle,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Perguntas frequentes" },
    perguntas: {
      tipo: "lista",
      rotulo: "Perguntas",
      max: 12,
      de: {
        pergunta: { tipo: "texto", rotulo: "Pergunta", padrao: "" },
        resposta: { tipo: "texto", rotulo: "Resposta", linhas: 3, padrao: "" },
      },
      padrao: [
        { pergunta: "Qual o pedido mínimo?", resposta: "R$ 300 por pedido, misturando o que quiser do catálogo." },
        { pergunta: "Em quanto tempo chega?", resposta: "Até 48h nas cidades da rota. Fora dela, combinamos no chat." },
        { pergunta: "Como faço pra pagar?", resposta: "PIX na entrega ou boleto a prazo, pra quem já tem cadastro." },
      ],
    },
  },
  Componente: Perguntas,
};

/* ============================================================
   HORÁRIO E ENDEREÇO
   ============================================================ */

interface PropsLocal {
  titulo: string;
  endereco: string;
  horarios: { dia?: string; hora?: string }[];
  linkMapa: string;
}

function Local({ props, editando }: PropsBloco<PropsLocal>) {
  const horarios = (props.horarios ?? []).filter((h) => h.dia);
  if (!props.endereco && !horarios.length) {
    return editando ? <VazioNoEstudio>Escreva o endereço ou os horários.</VazioNoEstudio> : null;
  }

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div className="flex flex-col gap-3 border border-borda bg-papel p-4" style={{ borderRadius: "var(--canto-g)" }}>
        {props.endereco && (
          <div className="flex gap-3">
            <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--marca-600)]" />
            <div className="min-w-0 flex-1">
              <p className="whitespace-pre-line text-[13.5px] leading-snug">{props.endereco}</p>
              {props.linkMapa && (
                <a
                  href={props.linkMapa}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[var(--marca-600)]"
                >
                  Abrir no mapa
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>
        )}

        {horarios.length > 0 && (
          <div className="flex gap-3 border-t border-borda pt-3">
            <Clock size={17} className="mt-0.5 shrink-0 text-[var(--marca-600)]" />
            <dl className="min-w-0 flex-1">
              {horarios.map((h, i) => (
                <div key={i} className="flex items-baseline justify-between gap-3 py-0.5">
                  <dt className="text-[13px] text-tinta-70">{h.dia}</dt>
                  <dd className="num-tab shrink-0 text-[13px] font-semibold">{h.hora}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

export const blocoLocal: DefinicaoBloco<PropsLocal> = {
  tipo: "local",
  nome: "Endereço e horário",
  descricao: "Onde fica e quando abre.",
  paginas: ["inicio", "catalogo", "sacola", "confirmacao"],
  icone: MapPin,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Onde a gente fica" },
    endereco: { tipo: "texto", rotulo: "Endereço", linhas: 2, padrao: "" },
    linkMapa: { tipo: "texto", rotulo: "Link do mapa", padrao: "", dica: "Cole o link do Google Maps." },
    horarios: {
      tipo: "lista",
      rotulo: "Horários",
      max: 7,
      de: {
        dia: { tipo: "texto", rotulo: "Dia", padrao: "Segunda a sexta" },
        hora: { tipo: "texto", rotulo: "Horário", padrao: "8h às 18h" },
      },
      padrao: [
        { dia: "Segunda a sexta", hora: "8h às 18h" },
        { dia: "Sábado", hora: "8h às 12h" },
        { dia: "Domingo", hora: "Fechado" },
      ],
    },
  },
  Componente: Local,
};

/* ============================================================
   CONTAGEM REGRESSIVA
   ============================================================ */

function restante(ateISO: string) {
  const alvo = new Date(ateISO).getTime();
  const agora = Date.now();
  const ms = Math.max(0, alvo - agora);
  return {
    acabou: ms === 0 || Number.isNaN(alvo),
    dias: Math.floor(ms / 86400000),
    horas: Math.floor((ms % 86400000) / 3600000),
    minutos: Math.floor((ms % 3600000) / 60000),
    segundos: Math.floor((ms % 60000) / 1000),
  };
}

function Contagem({ props, editando }: PropsBloco<{ titulo: string; ate: string; textoFim: string }>) {
  const [agora, setAgora] = useState(() => restante(props.ate));

  useEffect(() => {
    setAgora(restante(props.ate));
    const id = setInterval(() => setAgora(restante(props.ate)), 1000);
    return () => clearInterval(id);
  }, [props.ate]);

  if (!props.ate) {
    return editando ? <VazioNoEstudio>Escolha a data e a hora em que a promoção acaba.</VazioNoEstudio> : null;
  }
  if (agora.acabou && !editando) return null;

  const caixas: [string, number][] = [
    ["dias", agora.dias],
    ["horas", agora.horas],
    ["min", agora.minutos],
    ["seg", agora.segundos],
  ];

  return (
    <div
      className="flex flex-col items-center gap-3 bg-[var(--marca-50)] px-4 py-5 text-center"
      style={{ borderRadius: "var(--canto-g)" }}
    >
      <p className="flex items-center gap-1.5 text-[13.5px] font-bold text-[var(--marca-800)]">
        <Timer size={16} />
        {agora.acabou ? props.textoFim || "Acabou" : props.titulo}
      </p>

      {!agora.acabou && (
        <div className="flex gap-2">
          {caixas.map(([rotulo, valor]) => (
            <div
              key={rotulo}
              className="flex w-[62px] flex-col items-center bg-papel px-2 py-2 shadow-[var(--sombra-1)]"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <span className="num-tab font-display text-[length:var(--t-secao)] font-extrabold leading-none tracking-[var(--tr-secao)]">
                {String(valor).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-wider text-tinta-45">
                {rotulo}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const blocoContagem: DefinicaoBloco<{ titulo: string; ate: string; textoFim: string }> = {
  tipo: "contagem",
  nome: "Contagem regressiva",
  descricao: "O relógio da promoção, correndo.",
  paginas: ["inicio", "catalogo", "oferta", "sacola"],
  icone: Timer,
  campos: {
    titulo: { tipo: "texto", rotulo: "Chamada", padrao: "A condição acaba em" },
    ate: {
      tipo: "texto",
      rotulo: "Acaba em",
      padrao: "",
      dica: "Formato 2026-12-25T18:00 — ano-mês-dia, T, hora:minuto.",
    },
    textoFim: { tipo: "texto", rotulo: "Quando acabar", padrao: "Promoção encerrada" },
  },
  Componente: Contagem,
};

/* ============================================================
   GALERIA DE IMAGENS
   ============================================================ */

function Galeria({ props, editando }: PropsBloco<{ titulo: string; imagens: { url?: string; legenda?: string }[]; variante: string }>) {
  const lista = (props.imagens ?? []).filter((i) => i.url);
  if (!lista.length) {
    return editando ? <VazioNoEstudio>Escolha as imagens da galeria.</VazioNoEstudio> : null;
  }
  const deslizando = props.variante !== "grade";

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div
        className={
          deslizando
            ? "sem-barra sangra flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1"
            : "grid grid-cols-2 gap-2.5"
        }
      >
        {lista.map((im, i) => (
          <figure
            key={i}
            className={`relative overflow-hidden ${deslizando ? "w-[72%] shrink-0 snap-start sm:w-[38%]" : ""}`}
            style={{ borderRadius: "var(--canto-g)" }}
          >
            <img
              src={im.url}
              alt={im.legenda ?? ""}
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full bg-papel-3 object-cover"
            />
            {im.legenda && (
              <figcaption
                className="absolute inset-x-0 bottom-0 px-3 py-2 text-[12px] font-semibold text-white"
                style={{ background: "linear-gradient(to top, rgba(16,13,10,0.82), transparent)" }}
              >
                {im.legenda}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}

export const blocoGaleria: DefinicaoBloco<{ titulo: string; imagens: { url?: string; legenda?: string }[]; variante: string }> = {
  tipo: "galeria",
  nome: "Galeria de fotos",
  descricao: "Bastidor, loja, entrega — o que não é produto.",
  paginas: ["inicio", "catalogo", "oferta", "confirmacao"],
  icone: Images,
  variantes: [
    { valor: "deslizando", nome: "Deslizando" },
    { valor: "grade", nome: "Em grade" },
  ],
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Por dentro da loja" },
    imagens: {
      tipo: "lista",
      rotulo: "Imagens",
      max: 12,
      de: {
        url: { tipo: "imagem", rotulo: "Imagem" },
        legenda: { tipo: "texto", rotulo: "Legenda", padrao: "" },
      },
      padrao: [],
    },
  },
  Componente: Galeria,
};

/* ============================================================
   BOTÕES DE LINK
   ============================================================ */

function Links({ props, editando }: PropsBloco<{ titulo: string; links: { rotulo?: string; url?: string }[] }>) {
  const lista = (props.links ?? []).filter((l) => l.rotulo);
  if (!lista.length) {
    return editando ? <VazioNoEstudio>Adicione pelo menos um link.</VazioNoEstudio> : null;
  }

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div className="flex flex-col gap-2">
        {lista.map((l, i) => (
          <a
            key={i}
            href={l.url || "#"}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[50px] items-center gap-3 border border-borda-forte bg-papel px-4 text-[14px] font-semibold"
            style={{ borderRadius: "var(--canto-m)" }}
          >
            <Link2 size={16} className="shrink-0 text-tinta-45" />
            <span className="min-w-0 flex-1 truncate">{l.rotulo}</span>
            <ExternalLink size={15} className="shrink-0 text-tinta-25" />
          </a>
        ))}
      </div>
    </div>
  );
}

export const blocoLinks: DefinicaoBloco<{ titulo: string; links: { rotulo?: string; url?: string }[] }> = {
  tipo: "links",
  nome: "Botões de link",
  descricao: "Instagram, tabela em PDF, catálogo antigo.",
  paginas: ["inicio", "catalogo", "sacola", "confirmacao"],
  icone: Link2,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "" },
    links: {
      tipo: "lista",
      rotulo: "Links",
      max: 10,
      de: {
        rotulo: { tipo: "texto", rotulo: "Texto do botão", padrao: "" },
        url: { tipo: "texto", rotulo: "Endereço", padrao: "https://" },
      },
      padrao: [],
    },
  },
  Componente: Links,
};
