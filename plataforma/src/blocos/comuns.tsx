import { useEffect, useRef, useState } from "react";
import {
  Image as IconeImagem,
  GalleryHorizontal,
  Megaphone,
  Minus,
  Quote,
  Type as IconeTexto,
  MessageCircle,
  PlayCircle,
} from "lucide-react";
import type { DefinicaoBloco, PropsBloco } from "../nucleo/tipos";
import { TituloBloco, VazioNoEstudio } from "./pecas";

/* ============================================================
   BANNER

   Duas imagens: uma pro celular (vertical) e uma pro desktop.
   Sem isso, todo banner corta cabeça no retrato — é o erro nº 1
   das lojas que só têm uma arte.
   ============================================================ */

interface PropsBanner {
  imagemCelular: string;
  imagemDesktop: string;
  titulo: string;
  texto: string;
  rotuloBotao: string;
  linkBotao: string;
  variante: string;
  altura: string;
}

const ALTURAS: Record<string, string> = {
  baixa: "aspect-[16/7] sm:aspect-[21/6]",
  media: "aspect-[4/3] sm:aspect-[21/8]",
  alta: "aspect-[3/4] sm:aspect-[16/7]",
};

function Banner({ props, editando }: PropsBloco<PropsBanner>) {
  const { imagemCelular, imagemDesktop, titulo, texto, rotuloBotao, linkBotao, variante, altura } = props;
  const celular = imagemCelular || imagemDesktop;
  const desktop = imagemDesktop || imagemCelular;
  const temTexto = Boolean(titulo || texto || rotuloBotao);

  const arte = (
    <div className={`relative w-full overflow-hidden ${ALTURAS[altura] ?? ALTURAS.media}`} style={{ borderRadius: "var(--canto-g)" }}>
      {celular ? (
        <picture>
          <source media="(min-width: 640px)" srcSet={desktop} />
          <img src={celular} alt={titulo || "Banner"} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        </picture>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-papel-3 text-[13px] font-medium text-tinta-45">
          {editando ? "Escolha uma imagem" : ""}
        </div>
      )}

      {variante === "sobreposto" && temTexto && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 via-tinta/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            {titulo && <h2 className="font-display text-[22px] font-extrabold leading-tight tracking-tight text-white">{titulo}</h2>}
            {texto && <p className="mt-1 max-w-sm text-[13.5px] leading-snug text-white/85">{texto}</p>}
            {rotuloBotao && (
              <a
                href={linkBotao || "#"}
                className="mt-3 inline-flex min-h-[42px] items-center bg-white px-4 text-[14px] font-bold text-tinta"
                style={{ borderRadius: "var(--canto-m)" }}
              >
                {rotuloBotao}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (variante === "sobreposto" || !temTexto) return arte;

  return (
    <div className="flex flex-col gap-3">
      {arte}
      <div>
        {titulo && <h2 className="font-display text-[18px] font-bold leading-tight tracking-tight">{titulo}</h2>}
        {texto && <p className="mt-1 text-[13.5px] leading-snug text-tinta-70">{texto}</p>}
        {rotuloBotao && (
          <a
            href={linkBotao || "#"}
            className="mt-2.5 inline-flex min-h-[42px] items-center bg-[var(--marca-500)] px-4 text-[14px] font-bold text-[var(--sobre-marca)]"
            style={{ borderRadius: "var(--canto-m)" }}
          >
            {rotuloBotao}
          </a>
        )}
      </div>
    </div>
  );
}

export const blocoBanner: DefinicaoBloco<PropsBanner> = {
  tipo: "banner",
  nome: "Banner",
  descricao: "Uma arte com título e botão. Imagem separada pro celular.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: IconeImagem,
  campos: {
    imagemCelular: { tipo: "imagem", rotulo: "Imagem no celular", dica: "Vertical. É a que a maioria vai ver." },
    imagemDesktop: { tipo: "imagem", rotulo: "Imagem no computador", dica: "Deitada. Se vazia, usa a do celular." },
    titulo: { tipo: "texto", rotulo: "Título", padrao: "" },
    texto: { tipo: "texto", rotulo: "Texto", linhas: 2, padrao: "" },
    rotuloBotao: { tipo: "texto", rotulo: "Texto do botão", padrao: "" },
    linkBotao: { tipo: "texto", rotulo: "Link do botão", padrao: "" },
    altura: {
      tipo: "escolha",
      rotulo: "Altura",
      padrao: "media",
      opcoes: [
        { valor: "baixa", nome: "Baixa" },
        { valor: "media", nome: "Média" },
        { valor: "alta", nome: "Alta" },
      ],
    },
  },
  variantes: [
    { valor: "sobreposto", nome: "Texto sobre a imagem" },
    { valor: "abaixo", nome: "Texto abaixo" },
    { valor: "so-imagem", nome: "Só a imagem" },
  ],
  Componente: Banner,
};

/* ============================================================
   CARROSSEL DE BANNERS
   ============================================================ */

interface Slide {
  imagemCelular?: string;
  imagemDesktop?: string;
  titulo?: string;
  link?: string;
}

interface PropsCarrossel {
  slides: Slide[];
  automatico: boolean;
  altura: string;
}

function CarrosselBanners({ props, editando }: PropsBloco<PropsCarrossel>) {
  const trilho = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState(0);
  const slides = props.slides ?? [];

  // Avanço automático: pausa quando o dedo está no trilho e quando a
  // pessoa pediu menos movimento no sistema.
  useEffect(() => {
    if (!props.automatico || editando || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const el = trilho.current;
      if (!el) return;
      const proximo = (Math.round(el.scrollLeft / el.clientWidth) + 1) % slides.length;
      el.scrollTo({ left: proximo * el.clientWidth, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(id);
  }, [props.automatico, editando, slides.length]);

  if (!slides.length) {
    return (
      <div className="flex aspect-[16/7] items-center justify-center bg-papel-3 text-[13px] text-tinta-45" style={{ borderRadius: "var(--canto-g)" }}>
        {editando ? "Adicione slides" : ""}
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={trilho}
        onScroll={(e) => setAtivo(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        className="sem-barra flex snap-x snap-mandatory overflow-x-auto"
        style={{ borderRadius: "var(--canto-g)" }}
      >
        {slides.map((s, i) => (
          <a
            key={i}
            href={s.link || "#"}
            className={`relative w-full shrink-0 snap-center overflow-hidden ${ALTURAS[props.altura] ?? ALTURAS.media}`}
          >
            <picture>
              <source media="(min-width: 640px)" srcSet={s.imagemDesktop || s.imagemCelular} />
              <img
                src={s.imagemCelular || s.imagemDesktop}
                alt={s.titulo || `Slide ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
            {s.titulo && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-tinta/75 to-transparent" />
                <p className="absolute inset-x-0 bottom-0 p-4 font-display text-[19px] font-extrabold leading-tight tracking-tight text-white">
                  {s.titulo}
                </p>
              </>
            )}
          </a>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => trilho.current?.scrollTo({ left: i * trilho.current.clientWidth, behavior: "smooth" })}
              aria-label={`Ir pro slide ${i + 1}`}
              aria-current={i === ativo}
              className="flex h-6 w-6 items-center justify-center"
            >
              <span className={`h-1.5 rounded-full transition-all ${i === ativo ? "w-5 bg-[var(--marca-500)]" : "w-1.5 bg-tinta-25"}`} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export const blocoCarrosselBanners: DefinicaoBloco<PropsCarrossel> = {
  tipo: "carrossel-banners",
  nome: "Carrossel de banners",
  descricao: "Vários banners que deslizam com o dedo.",
  paginas: ["inicio", "catalogo"],
  icone: GalleryHorizontal,
  campos: {
    slides: {
      tipo: "lista",
      rotulo: "Slides",
      max: 6,
      de: {
        imagemCelular: { tipo: "imagem", rotulo: "Imagem no celular" },
        imagemDesktop: { tipo: "imagem", rotulo: "Imagem no computador" },
        titulo: { tipo: "texto", rotulo: "Título sobre a arte" },
        link: { tipo: "texto", rotulo: "Link" },
      },
      padrao: [],
    },
    automatico: { tipo: "simNao", rotulo: "Passar sozinho", padrao: false, dica: "A cada 5 segundos." },
    altura: {
      tipo: "escolha",
      rotulo: "Altura",
      padrao: "media",
      opcoes: [
        { valor: "baixa", nome: "Baixa" },
        { valor: "media", nome: "Média" },
        { valor: "alta", nome: "Alta" },
      ],
    },
  },
  Componente: CarrosselBanners,
};

/* ============================================================
   FAIXA DE AVISO
   ============================================================ */

interface PropsFaixa {
  texto: string;
  tom: string;
}

function FaixaAviso({ props, editando }: PropsBloco<PropsFaixa>) {
  if (!props.texto) return editando ? <VazioNoEstudio>Escreva o texto da faixa.</VazioNoEstudio> : null;
  const tons: Record<string, string> = {
    marca: "bg-[var(--marca-500)] text-[var(--sobre-marca)]",
    escuro: "bg-tinta text-white",
    claro: "bg-papel-3 text-tinta-70",
  };
  return (
    <div
      className={`px-4 py-2.5 text-center text-[13px] font-semibold ${tons[props.tom] ?? tons.marca}`}
      style={{ borderRadius: "var(--canto-m)" }}
    >
      {props.texto}
    </div>
  );
}

export const blocoFaixaAviso: DefinicaoBloco<PropsFaixa> = {
  tipo: "faixa-aviso",
  nome: "Faixa de aviso",
  descricao: "Uma linha curta: frete, prazo, horário.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: Megaphone,
  campos: {
    texto: { tipo: "texto", rotulo: "Texto", padrao: "Frete grátis acima de R$ 800" },
    tom: {
      tipo: "escolha",
      rotulo: "Cor",
      padrao: "marca",
      opcoes: [
        { valor: "marca", nome: "Cor da marca" },
        { valor: "escuro", nome: "Escuro" },
        { valor: "claro", nome: "Discreto" },
      ],
    },
  },
  Componente: FaixaAviso,
};

/* ============================================================
   TEXTO
   ============================================================ */

interface PropsTexto {
  titulo: string;
  corpo: string;
  alinhamento: string;
}

function Texto({ props, editando }: PropsBloco<PropsTexto>) {
  const alinha = props.alinhamento === "centro" ? "text-center" : "text-left";
  if (!props.titulo && !props.corpo) return editando ? <VazioNoEstudio>Escreva um título ou um texto.</VazioNoEstudio> : null;
  return (
    <div className={alinha}>
      {props.titulo && <h2 className="font-display text-[18px] font-bold leading-tight tracking-tight">{props.titulo}</h2>}
      {props.corpo && (
        <p className="mt-2 whitespace-pre-line text-[14px] leading-relaxed text-tinta-70">{props.corpo}</p>
      )}
    </div>
  );
}

export const blocoTexto: DefinicaoBloco<PropsTexto> = {
  tipo: "texto",
  nome: "Texto",
  descricao: "Um título e um parágrafo.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: IconeTexto,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "" },
    corpo: { tipo: "texto", rotulo: "Texto", linhas: 5, padrao: "" },
    alinhamento: {
      tipo: "escolha",
      rotulo: "Alinhamento",
      padrao: "esquerda",
      opcoes: [
        { valor: "esquerda", nome: "À esquerda" },
        { valor: "centro", nome: "Centralizado" },
      ],
    },
  },
  Componente: Texto,
};

/* ============================================================
   PROVA SOCIAL
   ============================================================ */

interface Depoimento {
  texto?: string;
  autor?: string;
  papel?: string;
  foto?: string;
}

function ProvaSocial({ props, editando }: PropsBloco<{ titulo: string; depoimentos: Depoimento[] }>) {
  const lista = props.depoimentos ?? [];
  if (!lista.length) return editando ? <VazioNoEstudio>Adicione pelo menos um depoimento.</VazioNoEstudio> : null;
  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      <div className="sem-barra flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
        {lista.map((d, i) => (
          <figure
            key={i}
            className="flex w-[82%] shrink-0 snap-center flex-col gap-3 border border-borda bg-papel p-4 sm:w-[46%]"
            style={{ borderRadius: "var(--canto-g)" }}
          >
            <Quote size={18} className="text-[var(--marca-400)]" />
            <blockquote className="flex-1 text-[13.5px] leading-relaxed text-tinta-70">{d.texto}</blockquote>
            <figcaption className="flex items-center gap-2.5">
              {d.foto && <img src={d.foto} alt="" width={36} height={36} loading="lazy" className="h-9 w-9 rounded-full object-cover" />}
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-semibold">{d.autor}</span>
                {d.papel && <span className="block truncate text-[12px] text-tinta-45">{d.papel}</span>}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export const blocoProvaSocial: DefinicaoBloco<{ titulo: string; depoimentos: Depoimento[] }> = {
  tipo: "prova-social",
  nome: "Depoimentos",
  descricao: "Quem já compra, contando.",
  paginas: ["inicio", "oferta", "confirmacao"],
  icone: Quote,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Quem já compra" },
    depoimentos: {
      tipo: "lista",
      rotulo: "Depoimentos",
      max: 8,
      de: {
        texto: { tipo: "texto", rotulo: "Depoimento", linhas: 3 },
        autor: { tipo: "texto", rotulo: "Nome" },
        papel: { tipo: "texto", rotulo: "Empresa ou cargo" },
        foto: { tipo: "imagem", rotulo: "Foto" },
      },
      padrao: [],
    },
  },
  Componente: ProvaSocial,
};

/* ============================================================
   VÍDEO — Reels, TikTok, YouTube. Vem do v1.
   ============================================================ */

function Video({ props, editando }: PropsBloco<{ titulo: string; url: string }>) {
  const [tocando, setTocando] = useState(false);
  const url = props.url ?? "";

  const incorporado = (() => {
    const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
    const ig = url.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/);
    if (ig) return `https://www.instagram.com/p/${ig[1]}/embed`;
    return null;
  })();

  if (!incorporado) {
    return editando ? (
      <div className="flex aspect-[9/16] max-h-[420px] items-center justify-center bg-papel-3 text-[13px] text-tinta-45" style={{ borderRadius: "var(--canto-g)" }}>
        Cole o link do Reels, Shorts ou YouTube
      </div>
    ) : null;
  }

  return (
    <div>
      <TituloBloco titulo={props.titulo} />
      {/* O iframe só entra depois do toque: vídeo de terceiro carrega
          centenas de KB e a gente não paga isso por quem não vai assistir. */}
      <div className="relative mx-auto aspect-[9/16] max-h-[520px] w-full max-w-[300px] overflow-hidden bg-tinta" style={{ borderRadius: "var(--canto-g)" }}>
        {tocando ? (
          <iframe
            src={incorporado}
            title={props.titulo || "Vídeo"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <button onClick={() => setTocando(true)} className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/90">
            <PlayCircle size={44} strokeWidth={1.5} />
            <span className="text-[13px] font-semibold">Assistir</span>
          </button>
        )}
      </div>
    </div>
  );
}

export const blocoVideo: DefinicaoBloco<{ titulo: string; url: string }> = {
  tipo: "video",
  nome: "Vídeo",
  descricao: "Reels, Shorts ou YouTube.",
  paginas: ["inicio", "oferta"],
  icone: PlayCircle,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "" },
    url: { tipo: "texto", rotulo: "Link do vídeo", padrao: "", dica: "Instagram, YouTube ou Shorts." },
  },
  Componente: Video,
};

/* ============================================================
   CONTATO
   ============================================================ */

function Contato({ props, loja }: PropsBloco<{ titulo: string; texto: string; rotuloBotao: string }>) {
  return (
    <div className="border border-borda bg-papel p-5 text-center" style={{ borderRadius: "var(--canto-g)" }}>
      <h2 className="font-display text-[17px] font-bold tracking-tight">{props.titulo}</h2>
      {props.texto && <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-tinta-70">{props.texto}</p>}
      <a
        href={`https://wa.me/${loja.whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-[46px] items-center gap-2 bg-[var(--marca-500)] px-5 text-[14.5px] font-bold text-[var(--sobre-marca)]"
        style={{ borderRadius: "var(--canto-m)" }}
      >
        <MessageCircle size={17} />
        {props.rotuloBotao || "Falar no WhatsApp"}
      </a>
    </div>
  );
}

export const blocoContato: DefinicaoBloco<{ titulo: string; texto: string; rotuloBotao: string }> = {
  tipo: "contato",
  nome: "Contato",
  descricao: "Botão de WhatsApp com um recado.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: MessageCircle,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Ficou com dúvida?" },
    texto: { tipo: "texto", rotulo: "Texto", linhas: 2, padrao: "Chama no WhatsApp que a gente responde na hora." },
    rotuloBotao: { tipo: "texto", rotulo: "Texto do botão", padrao: "Falar no WhatsApp" },
  },
  Componente: Contato,
};

/* ============================================================
   DIVISOR
   ============================================================ */

function Divisor({ props }: PropsBloco<{ estilo: string }>) {
  if (props.estilo === "espaco") return <div className="h-4" aria-hidden="true" />;
  return <hr className="border-t border-borda" />;
}

export const blocoDivisor: DefinicaoBloco<{ estilo: string }> = {
  tipo: "divisor",
  nome: "Divisor",
  descricao: "Uma linha ou um respiro entre blocos.",
  paginas: ["inicio", "catalogo", "oferta", "sacola", "confirmacao"],
  icone: Minus,
  campos: {
    estilo: {
      tipo: "escolha",
      rotulo: "Estilo",
      padrao: "linha",
      opcoes: [
        { valor: "linha", nome: "Linha" },
        { valor: "espaco", nome: "Só espaço" },
      ],
    },
  },
  Componente: Divisor,
};
