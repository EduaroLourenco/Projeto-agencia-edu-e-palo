/**
 * Camada mínima de analytics. Sem VITE_GA_MEASUREMENT_ID configurado, os eventos
 * só aparecem no console (em dev) — nada é enviado a lugar nenhum. Configurando
 * a variável de ambiente, o gtag.js real é carregado e os mesmos eventos passam
 * a ir para o Google Analytics 4, sem mudar nenhuma chamada de rastrear(...).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let gaCarregado = false;

function carregarGA() {
  if (gaCarregado || !GA_ID) return;
  gaCarregado = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}

if (typeof window !== "undefined" && GA_ID) {
  carregarGA();
}

export function rastrear(evento: string, props: Record<string, unknown> = {}) {
  if (import.meta.env.DEV) {
    console.debug(`[analytics] ${evento}`, props);
  }
  window.gtag?.("event", evento, props);
}
