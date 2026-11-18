import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Plus, RotateCcw } from "lucide-react";
import { ETAPAS, FAQ, NICHOS, PRODUTOS, SITRA_URL, TIME, linkWhatsApp, type Produto } from "../data/content";
import { SERVICOS } from "../data/servicos";
import { rastrear } from "../lib/analytics";
import { Reveal } from "./Reveal";

export function FaixaServicos() {
  const titulos = SERVICOS.slice(0, 18).map((s) => s.titulo);
  return (
    <div aria-hidden className="overflow-hidden border-y border-line bg-white py-4">
      <div className="faixa-movel flex w-max">
        {[...titulos, ...titulos].map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap font-[580] text-ink">
            {t}
            <span className="mx-6 h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Setores() {
  const [id, setId] = useState(NICHOS[0].id);
  const nicho = NICHOS.find((n) => n.id === id) ?? NICHOS[0];

  return (
    <section id="setores" className="secao">
      <div className="wrap">
        <Reveal className="max-w-3xl">
          <p className="etiqueta">Oportunidades por setor</p>
          <h2 className="titulo mt-4">Veja o que dá para melhorar no seu negócio.</h2>
        </Reveal>

        <div className="mt-9 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div role="group" aria-label="Escolha seu setor" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:p-0">
            {NICHOS.map((n) => {
              const ativo = n.id === id;
              return (
                <button
                  key={n.id}
                  onClick={() => setId(n.id)}
                  aria-pressed={ativo}
                  className={`min-h-[54px] shrink-0 rounded-2xl border-[1.5px] px-4 py-2.5 text-left font-[600] leading-snug transition-colors ${
                    ativo ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand"
                  }`}
                >
                  {n.nome}
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[28px] bg-soft-2 p-6 sm:p-9">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={nicho.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <p className="font-[600] text-brand-dark">{nicho.descricao}</p>
                <h3 className="mt-2 text-[clamp(1.45rem,2.6vw,2.05rem)] font-[640] leading-tight tracking-[-0.025em]">{nicho.dor}</h3>
                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {nicho.entregas.map((e) => (
                    <li key={e} className="flex gap-2.5 rounded-2xl bg-white p-3.5 font-[540] leading-snug">
                      <Check size={18} aria-hidden className="mt-0.5 shrink-0 text-brand" />
                      {e}
                    </li>
                  ))}
                </ul>
                <a
                  href={linkWhatsApp(`Olá! Tenho um negócio de ${nicho.nome} e quero entender o que a BEPA pode fazer.`)}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => rastrear("whatsapp_click", { origem: "setor", setor: nicho.id })}
                  className="btn mt-6"
                >
                  Quero isso no meu negócio
                  <ArrowRight size={17} aria-hidden />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export function FaixaSitra() {
  return (
    <section aria-labelledby="sitra-titulo" className="wrap pb-[clamp(4rem,8vw,7rem)]">
      <Reveal className="sobre-escuro grid items-center gap-8 rounded-[36px] bg-brand p-7 text-white sm:p-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <span className="inline-flex rounded-xl bg-white px-3 py-2">
            <img src="/sitra-logo.webp" alt="Sitra" width={105} height={35} loading="lazy" className="h-7 w-auto" />
          </span>
          <h2 id="sitra-titulo" className="titulo mt-6">
            Precisa de um site ou sistema?
          </h2>
          <p className="mt-4 max-w-xl text-[1.12rem] leading-relaxed text-white">
            A Sitra é a nossa frente de digitalização. Explore exemplos prontos antes de decidir.
          </p>
          <a
            href={SITRA_URL}
            target="_blank"
            rel="noopener"
            onClick={() => rastrear("sitra_click", { origem: "faixa" })}
            className="btn btn-claro mt-7"
          >
            Conhecer a Sitra
            <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
        <ul className="grid gap-2.5">
          {["Landing pages", "Sites institucionais", "Software sob medida"].map((t) => (
            <li key={t} className="flex items-center gap-3 rounded-2xl bg-white/12 p-4 text-[1.12rem] font-[600]">
              <Check size={19} aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

const COLUNAS = [
  { nome: "Aberta", texto: "O chamado entra com cliente, equipamento e prioridade." },
  { nome: "Diagnóstico", texto: "O técnico registra laudo e fotos direto no celular." },
  { nome: "Aprovação", texto: "O orçamento fica no funil, com alerta se atrasar." },
  { nome: "Execução", texto: "A agenda distribui o trabalho sem choque de horário." },
  { nome: "Faturamento", texto: "O serviço concluído vira dado financeiro." },
];

export function CaseOS() {
  const [etapa, setEtapa] = useState(1);
  const fim = etapa === COLUNAS.length - 1;

  return (
    <section id="case" className="secao bg-soft">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Reveal>
          <p className="etiqueta !bg-white">Case de sistema sob medida</p>
          <h2 className="titulo mt-4">Uma assistência técnica inteira em um só fluxo.</h2>
          <p className="sub mt-4">
            Criamos a gestão de ordens de serviço, do diagnóstico ao faturamento, no computador e no celular do técnico.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Dashboard", "SLA", "Orçamentos", "Agenda", "App do técnico"].map((t) => (
              <span key={t} className="rounded-full bg-white px-3.5 py-2 text-[0.92rem] font-[580]">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="cartao p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-[640]">Experimente o fluxo</p>
            <p className="text-sm font-[540] text-body">Demonstração com dados fictícios</p>
          </div>

          <ol className="mt-4 grid gap-2 md:grid-cols-5">
            {COLUNAS.map((c, i) => {
              const aqui = i === etapa;
              return (
                <li key={c.nome} className={`rounded-2xl p-2 md:min-h-[150px] ${aqui ? "bg-brand-soft" : "bg-soft"}`}>
                  <button onClick={() => setEtapa(i)} aria-current={aqui ? "step" : undefined} className="min-h-[44px] w-full rounded-lg px-1 text-left text-[0.88rem] font-[630]">
                    {c.nome}
                  </button>
                  {aqui && (
                    <motion.div layoutId="ordem" transition={{ type: "spring", stiffness: 420, damping: 34 }} className="mt-1 rounded-xl bg-brand p-2.5 text-white shadow-lift">
                      <p className="text-xs font-[600]">OS-128</p>
                      <p className="text-sm font-[640] leading-tight">Equipamento X</p>
                    </motion.div>
                  )}
                </li>
              );
            })}
          </ol>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite" className="text-[1.02rem] font-[520] leading-snug">
              {COLUNAS[etapa].texto}
            </p>
            <button onClick={() => setEtapa(fim ? 0 : etapa + 1)} className="btn shrink-0">
              {fim ? "Recomeçar" : "Avançar ordem"}
              {fim ? <RotateCcw size={17} aria-hidden /> : <ArrowRight size={17} aria-hidden />}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Processo() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const escala = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <section id="como-funciona" className="secao">
      <div className="wrap grid gap-10 lg:grid-cols-2">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <p className="etiqueta">Como funciona</p>
          <h2 className="titulo mt-4">Do primeiro papo ao projeto no ar.</h2>
          <p className="sub mt-4">Prazo e investimento ficam claros antes de começar.</p>
        </Reveal>
        <ol ref={ref} className="relative space-y-3 pl-11">
          <span aria-hidden className="absolute bottom-5 left-[15px] top-5 w-0.5 bg-line" />
          <motion.span aria-hidden style={{ scaleY: escala }} className="absolute bottom-5 left-[15px] top-5 w-0.5 origin-top bg-brand" />
          {ETAPAS.map((e, i) => (
            <li key={e.numero} className="cartao relative p-5">
              <span className="absolute -left-11 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-[650] text-white">{i + 1}</span>
              <h3 className="text-xl font-[640]">{e.titulo}</h3>
              <p className="mt-1 text-[1.02rem] text-body">{e.descricao}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CartaoProduto({ produto }: { produto: Produto }) {
  const corpo = (
    <>
      <span className={`etiqueta ${produto.url ? "" : "!bg-white"}`}>
        <span className={`h-2 w-2 rounded-full bg-brand ${produto.url ? "" : "pulso"}`} />
        {produto.url ? "Disponível" : "Em desenvolvimento"}
      </span>
      <h3 className="mt-14 text-[clamp(1.9rem,3.5vw,2.8rem)] font-[650] leading-none tracking-[-0.035em]">{produto.nome}</h3>
      <p className="mt-3 text-[1.05rem] text-body">{produto.descricao}</p>
      {produto.url && (
        <span className="mt-4 inline-flex items-center gap-1.5 font-[620] text-brand">
          Acessar produto <ArrowUpRight size={17} aria-hidden />
        </span>
      )}
    </>
  );
  const classe = "block h-full rounded-[28px] border-[1.5px] border-dashed border-line-strong bg-soft p-7";

  return produto.url ? (
    <a href={produto.url} target="_blank" rel="noopener" onClick={() => rastrear("produto_click", { produto: produto.nome })} className={`${classe} !border-solid transition-colors hover:border-brand`}>
      {corpo}
    </a>
  ) : (
    <div className={classe}>{corpo}</div>
  );
}

export function Produtos() {
  return (
    <section id="produtos" className="wrap pb-[clamp(4rem,8vw,7rem)]">
      <Reveal className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="etiqueta">Produtos BEPA</p>
          <h2 className="titulo mt-4">Novos produtos a caminho.</h2>
        </div>
        {PRODUTOS.some((p) => !p.url) && (
          <a
            href={linkWhatsApp("Olá! Quero saber quando os novos produtos da BEPA forem lançados.")}
            target="_blank"
            rel="noreferrer"
            onClick={() => rastrear("whatsapp_click", { origem: "produtos" })}
            className="btn-linha"
          >
            Quero ser avisado
            <ArrowRight size={17} aria-hidden />
          </a>
        )}
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {PRODUTOS.map((p, i) => (
          <Reveal key={p.nome} delay={i * 0.06} className="h-full">
            <CartaoProduto produto={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Equipe() {
  return (
    <section id="equipe" className="secao bg-soft">
      <div className="wrap">
        <Reveal className="max-w-3xl">
          <p className="etiqueta !bg-white">Quem faz</p>
          <h2 className="titulo mt-4">Gente de verdade cuidando do seu projeto.</h2>
        </Reveal>
        <Reveal>
        <ul className="mt-9 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {TIME.map((p) => (
              <li key={p.nome} className="cartao group h-full overflow-hidden">
                <div className="overflow-hidden">
                  <img
                    src={p.foto}
                    alt={`Retrato de ${p.nome}`}
                    width={p.largura}
                    height={p.altura}
                    loading="lazy"
                    style={{ objectPosition: p.foco }}
                    className="aspect-[1/1.02] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-[640] leading-tight">{p.nome}</h3>
                  <p className="mt-1 font-[600] leading-snug text-brand">{p.papel}</p>
                  <p className="mt-2.5 leading-relaxed text-body">{p.bio}</p>
                </div>
              </li>
          ))}
        </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function Perguntas() {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section id="faq" className="secao">
      <div className="wrap grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <p className="etiqueta">Perguntas frequentes</p>
          <h2 className="titulo mt-4">Antes de começar.</h2>
        </Reveal>
        <div className="space-y-2.5">
          {FAQ.map((f, i) => {
            const ativa = aberta === i;
            return (
              <div key={f.pergunta} className="cartao overflow-hidden !shadow-none">
                <h3>
                  <button
                    onClick={() => setAberta(ativa ? null : i)}
                    aria-expanded={ativa}
                    className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-3 text-left text-[1.1rem] font-[620]"
                  >
                    {f.pergunta}
                    <Plus size={20} aria-hidden className={`shrink-0 text-brand transition-transform ${ativa ? "rotate-45" : ""}`} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {ativa && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-[1.03rem] leading-relaxed text-body">{f.resposta}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
