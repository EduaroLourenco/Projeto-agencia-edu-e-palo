import { ArrowUpRight } from "lucide-react";
import { ZAP_COMMERCE_URL } from "../data/content";
import { rastrear } from "../lib/analytics";
import { PhoneMockup } from "./PhoneMockup";
import { Reveal } from "./Reveal";
import { BTN_SECUNDARIO_ESCURO, CabecalhoSecao } from "./ui";

const ZAP_RESULTADOS = [
  "Vitrine que carrega rápido mesmo em 3G/4G",
  "Preço de atacado calculado sozinho conforme a sacola enche",
  "Pedido chega pronto e formatado no WhatsApp do lojista",
  "Entrega por excursão, retirada ou Correios, do jeito que a região já compra",
];

const OS_RECURSOS = [
  { titulo: "SLA e gargalos", texto: "Alerta de diagnóstico atrasado e aprovação pendente." },
  { titulo: "Funil de orçamentos", texto: "Do “aguardando aprovação” ao fechamento." },
  { titulo: "Programação", texto: "Agenda dos técnicos com arrastar e soltar." },
  { titulo: "App do técnico", texto: "Execução, laudo e fotos no celular, em campo." },
];

function Rotulo({ children }: { children: string }) {
  return <p className="text-sm font-semibold text-brand-light">{children}</p>;
}

export function CaseStudy() {
  return (
    <section id="cases" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <CabecalhoSecao numero="02" rotulo="Cases" titulo="Sistemas que já rodam no dia a dia de clientes." escuro />

        {/* Case 1 */}
        <article className="mt-14 grid grid-cols-1 items-center gap-10 border-t border-line-dark pt-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-5 md:col-start-2">
            <PhoneMockup />
          </Reveal>
          <Reveal className="md:col-span-6" delay={0.05}>
            <Rotulo>Atacado de moda · Catálogo com pedido no WhatsApp</Rotulo>
            <h3 className="mt-3 font-display text-2xl font-bold leading-snug tracking-[-0.02em] sm:text-3xl">
              Zap-Commerce: da foto solta no grupo ao pedido pronto.
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              A loja perdia pedido porque o cliente mandava foto no grupo e ninguém calculava o desconto de
              atacado na hora. Construímos o catálogo completo: vitrine, preço em tempo real e checkout que
              termina com a mensagem pronta no WhatsApp do lojista.
            </p>
            <ul className="mt-6 border-t border-line-dark">
              {ZAP_RESULTADOS.map((r) => (
                <li key={r} className="border-b border-line-dark py-3 text-[15px] text-white/85">
                  {r}
                </li>
              ))}
            </ul>
            <a
              href={ZAP_COMMERCE_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => rastrear("case_zapcommerce_click")}
              className={`${BTN_SECUNDARIO_ESCURO} mt-8`}
            >
              Navegar no catálogo ao vivo
              <ArrowUpRight size={16} aria-hidden />
            </a>
          </Reveal>
        </article>

        {/* Case 2 */}
        <article className="mt-16 grid grid-cols-1 gap-10 border-t border-line-dark pt-12 md:grid-cols-12 md:gap-8">
          <Reveal className="md:col-span-4">
            <Rotulo>Assistência técnica · Sistema sob medida</Rotulo>
            <h3 className="mt-3 font-display text-2xl font-bold leading-snug tracking-[-0.02em] sm:text-3xl">
              Ordens de serviço do diagnóstico ao faturamento.
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              No computador do administrador e no celular do técnico, com o mesmo dado nos dois.
            </p>
            <dl className="mt-6 border-t border-line-dark">
              {OS_RECURSOS.map((r) => (
                <div key={r.titulo} className="border-b border-line-dark py-3">
                  <dt className="text-[15px] font-semibold text-white">{r.titulo}</dt>
                  <dd className="mt-0.5 text-sm text-white/65">{r.texto}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="md:col-span-8" delay={0.05}>
            <div className="grid grid-cols-[1fr_auto] items-end gap-3 sm:gap-4">
              <figure>
                <img
                  src="/cases/memo/01-dashboard.png"
                  alt="Painel operacional: capacidade da oficina, ordens concluídas e status por técnico"
                  width={1917}
                  height={901}
                  loading="lazy"
                  decoding="async"
                  className="w-full border border-line-dark bg-white"
                />
                <figcaption className="mt-2 text-xs text-white/60">Painel do administrador</figcaption>
              </figure>
              <figure className="w-[26vw] max-w-[150px] sm:w-[150px]">
                <img
                  src="/cases/memo/06-app-tecnico.png"
                  alt="App do técnico com agenda e execução da ordem de serviço"
                  width={472}
                  height={806}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-lg border border-line-dark bg-white"
                />
                <figcaption className="mt-2 text-xs text-white/60">App do técnico</figcaption>
              </figure>
            </div>
            <img
              src="/cases/memo/05-kanban-os.png"
              alt="Kanban com o ciclo completo da ordem de serviço: aberta, diagnóstico, aprovação, execução e faturamento"
              width={1601}
              height={822}
              loading="lazy"
              decoding="async"
              className="mt-4 hidden w-full border border-line-dark bg-white sm:block"
            />
          </Reveal>
        </article>
      </div>
    </section>
  );
}
