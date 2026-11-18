import { useEffect, useRef, useState } from "react";
import { rastrear } from "../lib/analytics";

/*
 * Roteiro (segundos)
 * 0,0  a 3,2  A rotina: problemas caem na tela, um a um, e viram bagunça.
 * 3,3  a 6,1  A BEPA: um risco de marca-texto passa por cada problema e ele vira um serviço.
 * 6,1  a 7,7  A ordem: os serviços ficam alinhados, todos marcados.
 * 7,7  a 9,0  A virada: as marcas se juntam na lacuna da frase da primeira tela.
 * 9,0  a 9,5  O site aparece em volta da frase, que já está no lugar certo.
 */

const CHAVE = "bepa-abertura-vista";
const FIM = 9.5;
const RISCO_INICIO = 3.3;
const RISCO_FIM = 6.1;
const VIRADA = 7.7;
const REVELA = 9;
const FONTE = '"Familjen Grotesk Variable", "Segoe UI", Arial, sans-serif';
const TINTA = [17, 17, 15];
const MARCA = [255, 225, 0];

const PARES = [
  ["pedido perdido no WhatsApp", "Catálogo no WhatsApp"],
  ["planilha que ninguém entende", "Painel de indicadores"],
  ["boleto vencido", "Contas a pagar e receber"],
  ["cliente sem resposta", "Atendimento automático"],
  ["horário marcado duas vezes", "Agendamento online"],
  ["sobrou quanto no mês?", "Fluxo de caixa"],
  ["venda só no balcão", "Marketplaces"],
];

// x, y (0 a 1), rotação em graus, escala do texto.
const VAGAS_PAISAGEM = [
  [0.3, 0.2, -5, 1.15],
  [0.7, 0.17, 4, 0.95],
  [0.2, 0.5, 6, 1.35],
  [0.55, 0.41, -3, 1.1],
  [0.81, 0.53, -6, 0.9],
  [0.37, 0.69, 3, 1.25],
  [0.68, 0.73, -4, 1.05],
];
const VAGAS_RETRATO = [
  [0.47, 0.16, -4, 1],
  [0.53, 0.26, 3, 0.92],
  [0.34, 0.37, 6, 1.4],
  [0.58, 0.47, -3, 1.04],
  [0.48, 0.57, -5, 0.92],
  [0.46, 0.67, 3, 1.14],
  [0.58, 0.77, -3, 1.08],
];
const ORDEM_PAISAGEM = [0, 1, 4, 3, 2, 5, 6];
const ORDEM_RETRATO = [0, 1, 2, 3, 4, 5, 6];

// O ritmo acelera até a bagunça parar de repente, um instante antes do risco entrar.
const POUSOS = [0.5, 0.92, 1.28, 1.58, 1.83, 2.04, 2.22];
const RUIDOS = ["urgente", "cadê?", "de novo?", "quem ficou de ver isso?", "me liga", "até quando?"];
const POUSOS_RUIDO = [2.36, 2.48, 2.59, 2.69, 2.78, 2.86];
const VAGAS_RUIDO_PAISAGEM = [
  [0.09, 0.34, -8],
  [0.46, 0.29, 5],
  [0.91, 0.33, 7],
  [0.5, 0.57, -6],
  [0.11, 0.79, 5],
  [0.89, 0.79, -5],
];
const VAGAS_RUIDO_RETRATO = [
  [0.2, 0.215, -7],
  [0.8, 0.325, 6],
  [0.2, 0.525, 5],
  [0.82, 0.62, -6],
  [0.2, 0.735, -4],
  [0.74, 0.86, 5],
];

const LEGENDAS: [number, number, string][] = [
  [0.2, 3.05, "Uma terça-feira na sua empresa."],
  [3.25, 6.3, "Aí entra a BEPA."],
  [6.45, 7.75, "Vendas, sistemas e finanças em um só time."],
  [7.95, 9.1, "Agora é com você."],
];

const limite = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const mistura = (a: number, b: number, p: number) => a + (b - a) * p;
const saida = (p: number) => 1 - (1 - p) ** 3;
const suave = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
const elastico = (p: number) => 1 + 2.2 * (p - 1) ** 3 + 1.2 * (p - 1) ** 2;
const fonte = (peso: number | string, tamanho: number) => `${peso} ${tamanho}px ${FONTE}`;

interface Ponto {
  x: number;
  y: number;
  s: number;
}

interface Item {
  problema: string;
  solucao: string;
  x: number;
  y: number;
  giro: number;
  tamanho: number;
  largura: number;
  fase: number;
  pouso: number;
  troca: number;
  alvoX: number;
  alvoY: number;
  larguraSolucao: number;
}

interface Ruido {
  texto: string;
  x: number;
  y: number;
  giro: number;
  tamanho: number;
  pouso: number;
  some: number;
}

interface Palavra {
  texto: string;
  x: number;
  base: number;
}

interface Cena {
  W: number;
  H: number;
  margem: number;
  itens: Item[];
  ruidos: Ruido[];
  caminho: Ponto[];
  total: number;
  cauda: number;
  espessura: number;
  tamanhoLista: number;
  frase: { palavras: Palavra[]; tamanho: number; peso: string; espaco: number } | null;
  lacuna: DOMRect | null;
}

function medirFrase(ctx: CanvasRenderingContext2D) {
  const paragrafo = document.querySelector<HTMLElement>("#inicio p[aria-live]");
  if (!paragrafo) return null;
  const estilo = getComputedStyle(paragrafo);
  const tamanho = parseFloat(estilo.fontSize);
  const espaco = parseFloat(estilo.letterSpacing) || 0;
  ctx.font = fonte(estilo.fontWeight, tamanho);
  const medida = ctx.measureText("Ág");
  const palavras: Palavra[] = [];
  const nos = document.createTreeWalker(paragrafo, NodeFilter.SHOW_TEXT);
  while (nos.nextNode()) {
    const no = nos.currentNode as Text;
    if (no.parentElement?.closest(".sr-only")) continue;
    for (const achado of no.data.matchAll(/\S+/g)) {
      const trecho = document.createRange();
      trecho.setStart(no, achado.index);
      trecho.setEnd(no, achado.index + achado[0].length);
      const r = trecho.getBoundingClientRect();
      const folga = (r.height - medida.fontBoundingBoxAscent - medida.fontBoundingBoxDescent) / 2;
      palavras.push({ texto: achado[0], x: r.left, base: r.top + folga + medida.fontBoundingBoxAscent });
    }
  }
  return { palavras, tamanho, peso: estilo.fontWeight, espaco };
}

function montarCena(ctx: CanvasRenderingContext2D, W: number, H: number): Cena {
  const retrato = W < 700 || W < H * 0.9;
  const margem = limite(W * 0.04, 20, 56);
  const vagas = retrato ? VAGAS_RETRATO : VAGAS_PAISAGEM;
  const ordem = retrato ? ORDEM_RETRATO : ORDEM_PAISAGEM;
  const base = retrato ? limite(W * 0.066, 21, 32) : limite(W * 0.034, 26, 54);

  let tamanhoLista = Math.min(H / 11.5, 62);
  ctx.font = fonte(600, tamanhoLista);
  const maisLarga = Math.max(...PARES.map(([, s]) => ctx.measureText(s).width));
  tamanhoLista = Math.min(tamanhoLista, (tamanhoLista * (W - margem * 2 - 8)) / maisLarga);
  const linha = tamanhoLista * 1.5;
  const topo = (H - linha * PARES.length) / 2 - H * 0.02 + linha / 2;

  const itens: Item[] = PARES.map(([problema, solucao], i) => {
    const [vx, vy, giro, escala] = vagas[i];
    let tamanho = base * escala;
    ctx.font = fonte(600, tamanho);
    let largura = ctx.measureText(problema).width;
    if (largura > W * 0.86) {
      tamanho *= (W * 0.86) / largura;
      largura = W * 0.86;
    }
    const x = limite(vx * W, largura / 2 + 12, W - largura / 2 - 12);
    ctx.font = fonte(600, tamanhoLista);
    const larguraSolucao = ctx.measureText(solucao).width;
    return {
      problema,
      solucao,
      x,
      y: vy * H,
      giro: (giro * Math.PI) / 180,
      tamanho,
      largura,
      fase: i * 2.4,
      pouso: POUSOS[i],
      troca: 0,
      alvoX: margem + larguraSolucao / 2,
      alvoY: topo + i * linha,
      larguraSolucao,
    };
  });

  // O caminho percorre cada frase por inteiro, como quem marca um texto de verdade.
  const espessura = base * 1.5;
  const caminho: Ponto[] = [];
  const marcos: [Item, number][] = [];
  let total = 0;
  const adicionar = (x: number, y: number) => {
    const anterior = caminho.at(-1);
    if (anterior) total += Math.hypot(x - anterior.x, y - anterior.y);
    caminho.push({ x, y, s: total });
  };
  const curva = (ax: number, ay: number, dx: number, dy: number, bx: number, by: number, ex: number, ey: number) => {
    const k = Math.hypot(bx - ax, by - ay) * 0.42;
    for (let n = 1; n <= 28; n++) {
      const p = n / 28;
      const q = 1 - p;
      const c1x = ax + dx * k;
      const c1y = ay + dy * k;
      const c2x = bx - ex * k;
      const c2y = by - ey * k;
      adicionar(
        q ** 3 * ax + 3 * q * q * p * c1x + 3 * q * p * p * c2x + p ** 3 * bx,
        q ** 3 * ay + 3 * q * q * p * c1y + 3 * q * p * p * c2y + p ** 3 * by,
      );
    }
  };

  let atualX = -espessura * 2;
  let atualY = itens[ordem[0]].y - H * 0.08;
  let dirX = 1;
  let dirY = 0;
  adicionar(atualX, atualY);
  for (const indice of ordem) {
    const item = itens[indice];
    const meia = item.largura / 2 + item.tamanho * 0.25;
    const cos = Math.cos(item.giro);
    const sen = Math.sin(item.giro);
    const ax = item.x - cos * meia;
    const ay = item.y - sen * meia;
    const bx = item.x + cos * meia;
    const by = item.y + sen * meia;
    const aPrimeiro = Math.hypot(ax - atualX, ay - atualY) <= Math.hypot(bx - atualX, by - atualY);
    const [sx, sy, fx, fy] = aPrimeiro ? [ax, ay, bx, by] : [bx, by, ax, ay];
    const novoX = aPrimeiro ? cos : -cos;
    const novoY = aPrimeiro ? sen : -sen;
    curva(atualX, atualY, dirX, dirY, sx, sy, novoX, novoY);
    adicionar(fx, fy);
    marcos.push([item, total]);
    atualX = fx;
    atualY = fy;
    dirX = novoX;
    dirY = novoY;
  }
  curva(atualX, atualY, dirX, dirY, W + espessura * 2, atualY + H * 0.08, 1, 0);

  const cauda = Math.min(total * 0.2, W * 0.9);
  const quandoPassa = (s: number) => mistura(RISCO_INICIO, RISCO_FIM, Math.acos(1 - (2 * s) / (total + cauda)) / Math.PI);
  for (const [item, s] of marcos) item.troca = quandoPassa(s);

  // Cada ruído some quando o risco passa mais perto dele.
  const vagasRuido = retrato ? VAGAS_RUIDO_RETRATO : VAGAS_RUIDO_PAISAGEM;
  const ruidos: Ruido[] = RUIDOS.map((texto, i) => {
    const [vx, vy, giro] = vagasRuido[i];
    const tamanho = base * 0.62;
    ctx.font = fonte(500, tamanho);
    const meia = ctx.measureText(texto).width / 2 + 10;
    const x = limite(vx * W, meia, W - meia);
    const y = vy * H;
    let perto = caminho[0];
    for (const ponto of caminho) {
      if (Math.hypot(ponto.x - x, ponto.y - y) < Math.hypot(perto.x - x, perto.y - y)) perto = ponto;
    }
    return { texto, x, y, giro: (giro * Math.PI) / 180, tamanho, pouso: POUSOS_RUIDO[i], some: quandoPassa(perto.s) };
  });

  return {
    W,
    H,
    margem,
    itens,
    ruidos,
    caminho,
    total,
    cauda,
    espessura,
    tamanhoLista,
    frase: medirFrase(ctx),
    lacuna: document.querySelector("#inicio .lacuna")?.getBoundingClientRect() ?? null,
  };
}

function desenharRisco(ctx: CanvasRenderingContext2D, c: Cena, t: number) {
  const p = limite((t - RISCO_INICIO) / (RISCO_FIM - RISCO_INICIO));
  if (p <= 0 || p >= 1) return;
  const percorrido = ((1 - Math.cos(Math.PI * p)) / 2) * (c.total + c.cauda);
  const ponta = Math.min(percorrido, c.total);
  const fim = Math.max(0, percorrido - c.cauda);
  ctx.beginPath();
  let comecou = false;
  for (const ponto of c.caminho) {
    if (ponto.s < fim || ponto.s > ponta) continue;
    if (comecou) ctx.lineTo(ponto.x, ponto.y);
    else ctx.moveTo(ponto.x, ponto.y);
    comecou = true;
  }
  ctx.lineWidth = c.espessura;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = `rgb(${MARCA})`;
  ctx.stroke();
}

function desenharRuido(ctx: CanvasRenderingContext2D, ruido: Ruido, t: number) {
  const chegada = limite((t - ruido.pouso) / 0.16);
  const saidaRuido = limite((t - ruido.some) / 0.12);
  if (chegada <= 0 || saidaRuido >= 1) return;
  const escala = mistura(1.3, 1, saida(chegada)) * (1 - saidaRuido * 0.4);
  ctx.save();
  ctx.globalAlpha = chegada * (1 - saidaRuido);
  ctx.translate(ruido.x, ruido.y);
  ctx.rotate(ruido.giro);
  ctx.scale(escala, escala);
  ctx.font = fonte(500, ruido.tamanho);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = `rgb(${TINTA})`;
  ctx.fillText(ruido.texto, 0, 0);
  ctx.restore();
}

function desenharProblema(ctx: CanvasRenderingContext2D, c: Cena, item: Item, indice: number, t: number) {
  const u = t - item.pouso;
  if (u <= 0 || t >= item.troca + 0.1) return;
  const chegada = limite(u / 0.3);
  // Cada frase nova empurra as que já estão na tela.
  let empurraX = 0;
  let empurraY = 0;
  c.itens.slice(indice + 1).forEach((outra) => {
    const v = t - outra.pouso;
    if (v <= 0) return;
    const dx = item.x - outra.x;
    const dy = item.y - outra.y;
    const d = Math.hypot(dx, dy) || 1;
    const forca = (Math.exp(-5 * v) * Math.sin(17 * v) * 26) / (1 + d / 190);
    empurraX += (dx / d) * forca;
    empurraY += (dy / d) * forca;
  });
  const tensao = limite((t - 1.9) / 1) * (1 - limite((t - 3.02) / 0.08));
  const zoom = 1 + 0.035 * suave(limite(t / RISCO_INICIO));
  const x = c.W / 2 + (item.x - c.W / 2) * zoom + empurraX + Math.sin(t * 19 + item.fase) * 1.4 * tensao;
  const y = c.H / 2 + (item.y - c.H / 2) * zoom + empurraY + Math.cos(t * 23 + item.fase) * 1.4 * tensao;
  const achata = 1 - limite((t - item.troca) / 0.1);

  ctx.save();
  ctx.globalAlpha = chegada;
  ctx.translate(x, y);
  ctx.rotate(item.giro + Math.sin(t * 1.3 + item.fase) * 0.012);
  ctx.scale(mistura(1.26, 1, saida(chegada)), mistura(1.26, 1, saida(chegada)) * achata);
  ctx.font = fonte(600, item.tamanho);
  ctx.letterSpacing = `${item.tamanho * -0.02}px`;
  ctx.fillStyle = `rgb(${TINTA})`;
  ctx.fillText(item.problema, 0, 0);
  ctx.restore();
}

function desenharSolucao(ctx: CanvasRenderingContext2D, c: Cena, item: Item, indice: number, t: number) {
  const u = t - item.troca - 0.08;
  if (u <= 0) return;
  const virada = t - VIRADA - indice * 0.05;
  const voo = suave(limite(virada / 0.72));
  const p = elastico(limite(u / 0.62));
  const tamanhoAtual = mistura(item.tamanho, c.tamanhoLista, limite(p, 0, 1.08));
  const escala = tamanhoAtual / c.tamanhoLista;
  const x = mistura(item.x, item.alvoX, p);
  const y = mistura(item.y, item.alvoY, p);
  const giro = item.giro * (1 - limite(p, 0, 1));
  const abre = saida(limite(u / 0.14));
  const risco = saida(limite((u - 0.04) / 0.3));
  const alturaMarca = c.tamanhoLista * 1.2 * escala;
  const larguraMarca = (item.larguraSolucao + c.tamanhoLista * 0.24) * escala;

  // Na virada, cada marca voa para a lacuna da frase e vira o traço onde a pessoa vai escolher.
  if (voo > 0 && c.lacuna) {
    const l = c.lacuna;
    const cor = limite((t - 8.55) / 0.3);
    const rgb = MARCA.map((v, n) => Math.round(mistura(v, TINTA[n], cor)));
    const cx = mistura(x, l.left + l.width / 2, voo);
    const cy = mistura(y, l.top + l.height / 2, voo);
    const w = mistura(larguraMarca, l.width, voo);
    const h = mistura(alturaMarca, l.height, voo);
    ctx.fillStyle = `rgb(${rgb})`;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2, 6));
    ctx.fill();
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(giro);
  if (voo <= 0) {
    ctx.fillStyle = `rgb(${MARCA})`;
    ctx.beginPath();
    ctx.roundRect(-larguraMarca / 2, -alturaMarca / 2, larguraMarca * risco, alturaMarca, 5);
    ctx.fill();
  }
  const some = 1 - limite(virada / 0.24);
  if (some > 0) {
    ctx.globalAlpha = some;
    ctx.translate(0, -8 * (1 - some));
    ctx.scale(escala, escala * abre);
    ctx.font = fonte(600, c.tamanhoLista);
    ctx.letterSpacing = `${c.tamanhoLista * -0.02}px`;
    ctx.fillStyle = `rgb(${TINTA})`;
    ctx.fillText(item.solucao, 0, 0);
  }
  ctx.restore();
}

function desenharFrase(ctx: CanvasRenderingContext2D, c: Cena, t: number) {
  if (!c.frase) return;
  const { palavras, tamanho, peso, espaco } = c.frase;
  ctx.save();
  ctx.font = fonte(peso, tamanho);
  ctx.letterSpacing = `${espaco}px`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = `rgb(${TINTA})`;
  palavras.forEach((palavra, i) => {
    const p = saida(limite((t - 7.95 - i * 0.075) / 0.42));
    if (p <= 0) return;
    ctx.globalAlpha = p;
    ctx.fillText(palavra.texto, palavra.x, palavra.base + (1 - p) * tamanho * 0.3);
  });
  ctx.restore();
}

function desenharLegenda(ctx: CanvasRenderingContext2D, c: Cena, t: number) {
  const legenda = LEGENDAS.find(([inicio, fim]) => t >= inicio && t <= fim);
  if (!legenda) return;
  const [inicio, fim, texto] = legenda;
  const p = Math.min(limite((t - inicio) / 0.24), limite((fim - t) / 0.2));
  let tamanho = limite(c.W * 0.022, 19, 30);
  ctx.font = fonte(500, tamanho);
  const largura = ctx.measureText(texto).width;
  if (largura > c.W - c.margem * 2) tamanho *= (c.W - c.margem * 2) / largura;
  ctx.save();
  ctx.font = fonte(500, tamanho);
  ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.globalAlpha = saida(p);
  ctx.fillStyle = `rgb(${TINTA})`;
  ctx.fillText(texto, c.margem, c.H - Math.max(c.margem, 34) + (1 - saida(p)) * 8);
  ctx.restore();
}

function desenhar(ctx: CanvasRenderingContext2D, c: Cena, t: number) {
  const revela = limite((t - REVELA) / (FIM - REVELA - 0.08));
  ctx.clearRect(0, 0, c.W, c.H);
  ctx.fillStyle = `rgba(255, 255, 255, ${1 - saida(revela)})`;
  ctx.fillRect(0, 0, c.W, c.H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  desenharRisco(ctx, c, t);
  c.ruidos.forEach((ruido) => desenharRuido(ctx, ruido, t));
  c.itens.forEach((item, i) => desenharProblema(ctx, c, item, i, t));
  c.itens.forEach((item, i) => desenharSolucao(ctx, c, item, i, t));
  desenharFrase(ctx, c, t);
  desenharLegenda(ctx, c, t);
}

function deveMostrar() {
  try {
    return (
      !matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.scrollY <= 64 &&
      !location.hash &&
      sessionStorage.getItem(CHAVE) !== "1"
    );
  } catch {
    return false;
  }
}

export function Abertura() {
  const [ativa, setAtiva] = useState(deveMostrar);
  const [saindo, setSaindo] = useState(false);
  const camada = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const botaoPular = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const canvas = tela.current;
    const ctx = canvas?.getContext("2d");
    if (!ativa || !canvas || !ctx) return;
    const pintura = canvas;
    const pincel = ctx;

    let cena: Cena | null = null;
    let quadro = 0;
    let temporizador = 0;
    let t = 0;
    let anterior = 0;
    let encerrada = false;

    try {
      sessionStorage.setItem(CHAVE, "1");
    } catch {
      // Sem armazenamento, a abertura pode repetir nesta sessão.
    }

    function ajustar() {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const densidade = Math.min(window.devicePixelRatio || 1, 2);
      pintura.width = Math.round(W * densidade);
      pintura.height = Math.round(H * densidade);
      pincel.setTransform(densidade, 0, 0, densidade, 0, 0);
      cena = montarCena(pincel, W, H);
    }

    function encerrar(pulada: boolean) {
      if (encerrada) return;
      encerrada = true;
      cancelAnimationFrame(quadro);
      removerEventos();
      rastrear("abertura", { fim: pulada ? "pulada" : "vista", segundo: Math.round(t) });
      if (pulada) {
        setSaindo(true);
        temporizador = window.setTimeout(() => setAtiva(false), 220);
      } else {
        setAtiva(false);
      }
    }

    const pular = () => encerrar(true);

    function passo(agora: number) {
      // Com a aba em segundo plano o tempo não corre: o filme continua de onde parou.
      t += Math.min(agora - (anterior || agora), 50) / 1000;
      anterior = agora;
      if (cena) desenhar(pincel, cena, t);
      // O menu real aparece nesse mesmo canto quando o site é revelado.
      if (t >= REVELA - 0.1 && botaoPular.current) botaoPular.current.style.visibility = "hidden";
      if (t >= FIM) encerrar(false);
      else quadro = requestAnimationFrame(passo);
    }

    function removerEventos() {
      window.removeEventListener("pointerdown", pular);
      window.removeEventListener("keydown", pular);
      window.removeEventListener("wheel", pular);
      window.removeEventListener("touchmove", pular);
      window.removeEventListener("resize", ajustar);
    }

    window.addEventListener("pointerdown", pular, { passive: true });
    window.addEventListener("keydown", pular);
    window.addEventListener("wheel", pular, { passive: true });
    window.addEventListener("touchmove", pular, { passive: true });
    window.addEventListener("resize", ajustar);

    const espera = new Promise((pronto) => {
      temporizador = window.setTimeout(pronto, 1500);
    });
    void Promise.race([document.fonts.load(fonte(600, 40), "Olá, BEPA").then(() => document.fonts.ready), espera]).then(() => {
      if (encerrada) return;
      ajustar();
      if (camada.current) camada.current.style.background = "transparent";
      quadro = requestAnimationFrame(passo);
    });

    return () => {
      encerrada = true;
      cancelAnimationFrame(quadro);
      window.clearTimeout(temporizador);
      removerEventos();
    };
  }, [ativa]);

  if (!ativa) return null;

  return (
    <div ref={camada} className={`fixed inset-0 z-50 bg-white transition-opacity duration-200 ${saindo ? "opacity-0" : ""}`}>
      <canvas ref={tela} aria-hidden className="absolute inset-0 h-full w-full" />
      <button ref={botaoPular} className="wrap absolute right-0 top-0 inline-flex h-12 items-center text-[0.94rem] font-medium underline underline-offset-4">
        Pular
      </button>
    </div>
  );
}
