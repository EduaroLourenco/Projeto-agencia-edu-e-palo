import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Image as ImagemIcone,
  Layers,
  Plus,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { apagarLoja, criarLoja, duplicarLoja, temRascunho } from "../nucleo/loja";
import { ESTILOS, MODELOS, estilo as acharEstilo, type IdEstilo, type IdModelo } from "../nucleo/modelos";
import { paletaDoPapel, PARES_DE_FONTE, CORES_SUGERIDAS } from "../nucleo/tema";
import { apagarFoto, guardarFoto, listarFotos, TETO_KB, type Foto } from "../nucleo/fotos";
import { limiteDeLojas, vincularLoja, type Conta } from "../conta/sessao";
import { BotaoP, CampoP, EntradaP, Etiqueta, Secao } from "./Pecas";

/**
 * O ESTÚDIO — a aba mais importante.
 *
 * Aqui não se edita bloco: aqui se decide QUE loja vai existir. Uma loja
 * nasce de dois cruzamentos — o modelo (o que ela faz) e o estilo (a cara
 * dela) — e só depois disso o editor abre. Separar essas duas perguntas foi
 * o que tirou daqui a sensação de "escolher entre três templates".
 */

type Tela = "hub" | "criar" | "fotos";

export function EstudioApp({
  lojas,
  conta,
  atual,
  onEscolher,
  onMudou,
}: {
  lojas: { loja: Loja; propria: boolean }[];
  conta: Conta;
  /** Nulo enquanto a conta não tem loja nenhuma. */
  atual: Loja | null;
  onEscolher: (slug: string) => void;
  onMudou: () => void;
}) {
  // Sem loja nenhuma, o hub não tem o que mostrar: entra direto na criação.
  const [tela, setTela] = useState<Tela>(lojas.length === 0 ? "criar" : "hub");

  if (tela === "criar") {
    return (
      <Criar
        conta={conta}
        quantas={lojas.length}
        onCancelar={() => setTela("hub")}
        onCriada={(slug) => {
          onEscolher(slug);
          onMudou();
          setTela("hub");
        }}
      />
    );
  }
  if (tela === "fotos") return <BancoDeFotos onVoltar={() => setTela("hub")} />;

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h1 className="font-display text-[26px] font-bold leading-[1.12] tracking-[-0.034em]">Estúdio</h1>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--p-texto-3)]">
          Monte a loja bloco por bloco, troque as cores e publique quando estiver do jeito que você quer.
        </p>
      </header>

      {/* A ação principal, do tamanho de ação principal. */}
      <button
        onClick={() => setTela("criar")}
        className="relative overflow-hidden rounded-[20px] p-5 text-left"
        style={{
          background: "linear-gradient(140deg,#241a4d 0%,#141222 55%,#0f0f18 100%)",
          border: "1px solid var(--p-borda-forte)",
        }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full opacity-55 blur-3xl"
          style={{ background: "var(--p-acento)" }}
        />
        <span className="relative flex items-start gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-white"
            style={{ background: "linear-gradient(150deg,var(--p-acento-claro),var(--p-acento))" }}
          >
            <Wand2 size={20} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[17px] font-bold tracking-[-0.025em]">Montar uma loja</span>
            <span className="mt-1 block text-[12.5px] leading-relaxed text-[var(--p-texto-2)]">
              Escolha o que ela vende e a cara que ela tem. Sai pronta, com páginas montadas e itens de exemplo.
            </span>
            <span className="mt-3 flex flex-wrap gap-1.5">
              {ESTILOS.slice(0, 4).map((e) => (
                <span
                  key={e.id}
                  className="rounded-full border border-[var(--p-borda-forte)] px-2.5 py-1 text-[11px] font-semibold text-[var(--p-texto-2)]"
                >
                  {e.nome}
                </span>
              ))}
              <span className="rounded-full border border-[var(--p-borda-forte)] px-2.5 py-1 text-[11px] font-semibold text-[var(--p-texto-3)]">
                +{ESTILOS.length - 4}
              </span>
            </span>
          </span>
        </span>
      </button>

      <Secao
        titulo={`Suas lojas · ${lojas.length}`}
        acao={
          <button onClick={() => setTela("criar")} className="text-[12px] font-semibold text-[var(--p-acento-claro)]">
            Nova
          </button>
        }
      >
        <div className="flex flex-col gap-2.5">
          {lojas.map(({ loja, propria }) => (
            <FichaLoja
              key={loja.slug}
              loja={loja}
              propria={propria}
              atual={loja.slug === atual?.slug}
              onEscolher={() => onEscolher(loja.slug)}
              onMudou={onMudou}
            />
          ))}
        </div>
      </Secao>

      <button
        onClick={() => setTela("fotos")}
        className="placa-p flex items-center gap-3.5 rounded-[16px] p-4 text-left transition hover:bg-[var(--p-superficie-2)]"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--p-superficie-3)] text-[var(--p-texto-2)]">
          <ImagemIcone size={18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold">Banco de fotos</span>
          <span className="mt-0.5 block text-[12px] text-[var(--p-texto-3)]">
            Suba uma vez, use em qualquer bloco de qualquer loja.
          </span>
        </span>
        <Etiqueta>{listarFotos().length}</Etiqueta>
      </button>

      <p className="text-center text-[11.5px] leading-relaxed text-[var(--p-texto-3)]">
        Plano {conta.plano} · até {limiteDeLojas(conta.plano) > 90 ? "ilimitadas" : limiteDeLojas(conta.plano)} lojas
      </p>
    </div>
  );
}

/* ============================================================
   A FICHA DE CADA LOJA
   ============================================================ */

function FichaLoja({
  loja,
  propria,
  atual,
  onEscolher,
  onMudou,
}: {
  loja: Loja;
  propria: boolean;
  atual: boolean;
  onEscolher: () => void;
  onMudou: () => void;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const pendente = temRascunho(loja.slug);

  return (
    <div
      className={`overflow-hidden rounded-[18px] border transition ${
        atual ? "border-[var(--p-acento)] bg-[var(--p-acento-fundo)]" : "border-[var(--p-borda)] bg-[var(--p-superficie)]"
      }`}
    >
      <button onClick={onEscolher} className="flex w-full items-center gap-3 p-3.5 text-left">
        <Miniatura loja={loja} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-[14.5px] font-bold">{loja.nome}</span>
            {pendente && <Etiqueta tom="atencao">rascunho</Etiqueta>}
          </span>
          <span className="num-tab mt-0.5 block truncate text-[11.5px] text-[var(--p-texto-3)]">
            /{loja.slug} · {loja.ofertas.length} itens · {propria ? "sua" : "demonstração"}
          </span>
        </span>
        {atual && <Check size={17} className="shrink-0 text-[var(--p-acento-claro)]" />}
      </button>

      <div className="flex divide-x divide-[var(--p-borda)] border-t border-[var(--p-borda)] text-[12.5px] font-semibold">
        <Link
          to={`/${loja.slug}/estudio`}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[var(--p-acento-claro)] transition hover:bg-[var(--p-superficie-2)]"
        >
          <Layers size={14} />
          Montar
        </Link>
        <Link
          to={`/${loja.slug}`}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[var(--p-texto-2)] transition hover:bg-[var(--p-superficie-2)]"
        >
          <ExternalLink size={14} />
          Ver
        </Link>
        <button
          onClick={() => {
            const r = duplicarLoja(loja.slug, `${loja.nome} cópia`);
            if (r.ok) {
              vincularLoja(r.slug);
              onMudou();
            }
          }}
          className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-[var(--p-texto-2)] transition hover:bg-[var(--p-superficie-2)]"
        >
          <Copy size={14} />
          Copiar
        </button>
        {propria && (
          <button
            onClick={() => {
              if (!confirmando) {
                setConfirmando(true);
                window.setTimeout(() => setConfirmando(false), 4000);
                return;
              }
              apagarLoja(loja.slug);
              onMudou();
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 transition ${
              confirmando ? "bg-[var(--p-erro)]/15 text-[var(--p-erro)]" : "text-[var(--p-texto-3)] hover:bg-[var(--p-superficie-2)]"
            }`}
          >
            <Trash2 size={14} />
            {confirmando ? "Confirmar" : "Apagar"}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * A miniatura da loja, desenhada com o tema dela.
 *
 * Renderizar a vitrine de verdade num quadradinho de 52px custa caro e não
 * se enxerga. Três traços na cor certa comunicam a mesma coisa: esta loja é
 * clara, esta é escura, esta é dourada.
 */
function Miniatura({ loja }: { loja: Loja }) {
  const papel = loja.tema.corPapel ?? "#ffffff";
  const p = paletaDoPapel(papel);
  return (
    <span
      className="flex h-12 w-12 shrink-0 flex-col justify-center gap-[3px] overflow-hidden rounded-[12px] px-2"
      style={{ background: p.papel, border: `1px solid ${p.borda}` }}
      aria-hidden
    >
      <span className="block h-[4px] w-5 rounded-full" style={{ background: loja.tema.corMarca }} />
      <span className="block h-[3px] w-full rounded-full" style={{ background: p.tintas["tinta-25"] }} />
      <span className="block h-[3px] w-3/4 rounded-full" style={{ background: p.tintas["tinta-12"] }} />
    </span>
  );
}

/* ============================================================
   CRIAR — modelo, estilo, nome
   ============================================================ */

const PASSOS = ["O que vende", "A cara", "O nome"];

function Criar({
  conta,
  quantas,
  onCancelar,
  onCriada,
}: {
  conta: Conta;
  quantas: number;
  onCancelar: () => void;
  onCriada: (slug: string) => void;
}) {
  const [passo, setPasso] = useState(0);
  const [modelo, setModelo] = useState<IdModelo>("produtos");
  const [idEstilo, setIdEstilo] = useState<IdEstilo>("essencial");
  const [cor, setCor] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [zap, setZap] = useState(conta.telefone ?? "");
  const [erro, setErro] = useState<string | null>(null);

  const cheio = quantas >= limiteDeLojas(conta.plano);
  const digitos = zap.replace(/\D/g, "");
  const podeCriar = nome.trim().length >= 2 && digitos.length >= 12 && digitos.length <= 13;

  function criar() {
    setErro(null);
    if (cheio) {
      setErro(`O plano ${conta.plano} vai até ${limiteDeLojas(conta.plano)} loja(s). Troque de plano em "Mais".`);
      return;
    }
    const r = criarLoja({
      nome: nome.trim(),
      whatsapp: digitos,
      modelo,
      estilo: idEstilo,
      corMarca: cor ?? undefined,
    });
    if (!r.ok) {
      setErro(r.erro);
      return;
    }
    vincularLoja(r.slug);
    onCriada(r.slug);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-2">
        <button
          onClick={() => (passo === 0 ? onCancelar() : setPasso((p) => p - 1))}
          aria-label="Voltar"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--p-texto-2)] hover:bg-[var(--p-superficie-2)]"
        >
          <ArrowLeft size={19} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="rotulo-p">
            Passo {passo + 1} de {PASSOS.length}
          </p>
          <h1 className="font-display text-[20px] font-bold tracking-[-0.028em]">{PASSOS[passo]}</h1>
        </div>
      </header>

      <div className="flex gap-1.5">
        {PASSOS.map((_, i) => (
          <span
            key={i}
            className="h-[3px] flex-1 rounded-full transition-colors"
            style={{ background: i <= passo ? "var(--p-acento)" : "var(--p-superficie-3)" }}
          />
        ))}
      </div>

      {passo === 0 && (
        <div className="flex flex-col gap-2.5">
          <p className="text-[13px] leading-relaxed text-[var(--p-texto-2)]">
            Isto liga as ferramentas certas: agenda, caixa fechada, variação de tamanho. Dá pra mudar depois.
          </p>
          {MODELOS.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setModelo(m.id);
                setPasso(1);
              }}
              className={`flex items-start gap-3 rounded-[16px] border p-4 text-left transition ${
                modelo === m.id
                  ? "border-[var(--p-acento)] bg-[var(--p-acento-fundo)]"
                  : "border-[var(--p-borda)] bg-[var(--p-superficie)] hover:bg-[var(--p-superficie-2)]"
              }`}
            >
              <span className="h-9 w-9 shrink-0 rounded-[11px]" style={{ background: m.corMarca }} />
              <span className="min-w-0 flex-1">
                <span className="block text-[14.5px] font-bold">{m.nome}</span>
                <span className="mt-0.5 block text-[12.5px] leading-snug text-[var(--p-texto-3)]">{m.descricao}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {passo === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-[13px] leading-relaxed text-[var(--p-texto-2)]">
            Cada um é um jeito diferente de montar a página: quanto ar, onde tem caixa, que fonte. Toque pra ver.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {ESTILOS.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setIdEstilo(e.id);
                  setCor(null);
                }}
                className={`overflow-hidden rounded-[16px] border text-left transition ${
                  idEstilo === e.id ? "border-[var(--p-acento)]" : "border-[var(--p-borda)] hover:border-[var(--p-borda-forte)]"
                }`}
              >
                <AmostraEstilo id={e.id} cor={idEstilo === e.id ? cor ?? undefined : undefined} />
                <span className="block px-3 py-2.5">
                  <span className="block text-[13px] font-bold">{e.nome}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[var(--p-texto-3)]">{e.descricao}</span>
                </span>
              </button>
            ))}
          </div>

          <div>
            <p className="rotulo-p mb-2">Cor da marca</p>
            <div className="sem-barra -mx-4 flex gap-2 overflow-x-auto px-4">
              <button
                onClick={() => setCor(null)}
                aria-pressed={cor === null}
                className={`flex h-10 shrink-0 items-center rounded-full border px-3 text-[12px] font-semibold ${
                  cor === null ? "border-[var(--p-acento)] text-[var(--p-texto)]" : "border-[var(--p-borda)] text-[var(--p-texto-3)]"
                }`}
              >
                Do estilo
              </button>
              {CORES_SUGERIDAS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCor(c)}
                  aria-label={`Cor ${c}`}
                  className={`h-10 w-10 shrink-0 rounded-full border-2 transition ${
                    cor === c ? "border-[var(--p-texto)]" : "border-transparent"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <BotaoP largo onClick={() => setPasso(2)}>
            Continuar
          </BotaoP>
        </div>
      )}

      {passo === 2 && (
        <div className="flex flex-col gap-4">
          <CampoP rotulo="Nome da loja" dica="É o que aparece no topo e no link.">
            {(p) => (
              <EntradaP
                {...p}
                value={nome}
                autoFocus
                placeholder="Ateliê da Nara"
                onChange={(ev) => setNome(ev.target.value)}
              />
            )}
          </CampoP>
          <CampoP rotulo="WhatsApp que recebe os pedidos" dica="Com país e DDD: 55 + 16 + o número.">
            {(p) => (
              <EntradaP
                {...p}
                type="tel"
                inputMode="numeric"
                className="num-tab"
                value={zap}
                placeholder="5516999998888"
                onChange={(ev) => setZap(ev.target.value)}
              />
            )}
          </CampoP>

          <div className="placa-p flex items-center gap-3 rounded-[16px] p-3.5">
            <AmostraEstilo id={idEstilo} cor={cor ?? undefined} pequena />
            <div className="min-w-0 flex-1 text-[12px] leading-snug text-[var(--p-texto-3)]">
              <p className="text-[13px] font-semibold text-[var(--p-texto)]">
                {MODELOS.find((m) => m.id === modelo)?.nome}
              </p>
              <p className="mt-0.5">
                estilo {acharEstilo(idEstilo).nome} · fonte {PARES_DE_FONTE[acharEstilo(idEstilo).tema.fontes].nome}
              </p>
            </div>
          </div>

          {erro && <p className="text-[12.5px] font-semibold text-[var(--p-erro)]">{erro}</p>}

          <BotaoP largo disabled={!podeCriar} onClick={criar}>
            <Plus size={17} />
            Criar a loja
          </BotaoP>
          <p className="text-center text-[11.5px] text-[var(--p-texto-3)]">
            Ela nasce fechada pra visita? Não — nasce no ar, com itens de exemplo pra você trocar.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * A amostra do estilo.
 *
 * É uma página inteira em miniatura, não um quadrado de cor: capa, título,
 * dois cartões e um botão, cada um vestido com a vestimenta do estilo. É
 * como se enxerga que "elegante" não é "marrom" — é o ar entre as coisas.
 */
function AmostraEstilo({ id, cor, pequena = false }: { id: IdEstilo; cor?: string; pequena?: boolean }) {
  const e = acharEstilo(id);
  const marca = cor ?? e.tema.corMarca ?? "#0f6fae";
  const p = paletaDoPapel(e.tema.corPapel ?? "#ffffff");
  const serif = e.tema.fontes === "fraunces-inter";
  const raio = e.tema.canto === "reto" ? 0 : e.tema.canto === "redondo" ? 7 : e.tema.canto === "pilula" ? 999 : 4;
  const cartoes = e.vestimenta.colunas === "3" ? 3 : 2;

  return (
    <span
      className={`flex flex-col justify-center gap-[5px] overflow-hidden ${
        pequena ? "h-16 w-16 shrink-0 rounded-[12px] px-2" : "h-[104px] px-3.5"
      }`}
      style={{ background: p.papel }}
      aria-hidden
    >
      {/* capa */}
      <span
        className="flex flex-col gap-[3px] px-2 py-[7px]"
        style={{
          borderRadius: raio,
          background:
            e.vestimenta.abertura.fundo === "marca"
              ? marca
              : e.vestimenta.abertura.fundo === "marca-suave"
                ? `color-mix(in oklab, ${marca} 16%, ${p.papel})`
                : e.vestimenta.abertura.fundo === "papel"
                  ? p.papel
                  : e.vestimenta.abertura.fundo === "suave"
                    ? p.papel2
                    : "transparent",
          border: e.vestimenta.abertura.borda ? `1px solid ${p.borda}` : "none",
          boxShadow: e.vestimenta.abertura.sombra === "leve" ? `0 2px 6px ${p.borda}` : "none",
          alignItems: e.vestimenta.abertura.alinhamento === "esquerda" ? "flex-start" : "center",
        }}
      >
        <span
          className="block"
          style={{
            height: serif ? 5 : 4,
            width: "58%",
            borderRadius: 999,
            background: e.vestimenta.abertura.fundo === "marca" ? "rgba(255,255,255,.92)" : p.tintas.tinta,
          }}
        />
        <span
          className="block"
          style={{
            height: 2,
            width: "40%",
            borderRadius: 999,
            background: e.vestimenta.abertura.fundo === "marca" ? "rgba(255,255,255,.6)" : p.tintas["tinta-45"],
          }}
        />
      </span>

      {/* vitrine */}
      <span className="flex gap-[4px]">
        {Array.from({ length: cartoes }).map((_, i) => (
          <span
            key={i}
            className="flex-1"
            style={{
              height: pequena ? 12 : 26,
              borderRadius: raio,
              background: p.papel2,
              border: e.vestimenta.secao.borda ? `1px solid ${p.borda}` : `1px solid transparent`,
              boxShadow: e.tema.sombra === "elevada" ? `0 3px 8px ${p.borda}` : "none",
            }}
          />
        ))}
      </span>

      {/* botão */}
      {!pequena && (
        <span
          className="mt-[1px] block"
          style={{
            height: 9,
            width: "46%",
            borderRadius: e.tema.canto === "reto" ? 0 : 999,
            background: e.tema.estiloBotao === "contorno" ? "transparent" : marca,
            border: e.tema.estiloBotao === "contorno" ? `1px solid ${marca}` : "none",
          }}
        />
      )}
    </span>
  );
}

/* ============================================================
   BANCO DE FOTOS
   ============================================================ */

function BancoDeFotos({ onVoltar }: { onVoltar: () => void }) {
  const [fotos, setFotos] = useState<Foto[]>(() => listarFotos());
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiada, setCopiada] = useState<string | null>(null);
  const entrada = useRef<HTMLInputElement>(null);

  const peso = useMemo(() => fotos.reduce((a, f) => a + f.kb, 0), [fotos]);

  async function subir(arquivos: FileList | null) {
    if (!arquivos?.length) return;
    setErro(null);
    setOcupado(true);
    for (const arquivo of Array.from(arquivos)) {
      const r = await guardarFoto(arquivo);
      if (!r.ok) {
        setErro(r.erro);
        break;
      }
    }
    setFotos(listarFotos());
    setOcupado(false);
    if (entrada.current) entrada.current.value = "";
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-2">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--p-texto-2)] hover:bg-[var(--p-superficie-2)]"
        >
          <ArrowLeft size={19} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-[20px] font-bold tracking-[-0.028em]">Banco de fotos</h1>
          <p className="num-tab text-[11.5px] text-[var(--p-texto-3)]">
            {fotos.length} {fotos.length === 1 ? "foto" : "fotos"} · {peso} de {TETO_KB} KB
          </p>
        </div>
      </header>

      {/* Quanto já foi gasto. O limite do navegador é real e chega rápido. */}
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--p-superficie-3)]">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${Math.min(100, (peso / TETO_KB) * 100)}%`,
            background:
              peso / TETO_KB > 0.85
                ? "var(--p-erro)"
                : "linear-gradient(90deg,var(--p-acento-claro),var(--p-acento))",
          }}
        />
      </div>

      <label className="flex min-h-[92px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[16px] border border-dashed border-[var(--p-borda-forte)] text-[13px] font-semibold text-[var(--p-texto-2)] transition hover:bg-[var(--p-superficie-2)]">
        {ocupado ? (
          <span className="anima-pulsar">Preparando…</span>
        ) : (
          <>
            <Upload size={19} />
            Subir fotos
            <span className="text-[11.5px] font-medium text-[var(--p-texto-3)]">
              Reduzimos pra ~80 KB antes de guardar
            </span>
          </>
        )}
        <input
          ref={entrada}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => subir(e.target.files)}
        />
      </label>

      {erro && <p className="text-[12.5px] font-semibold text-[var(--p-erro)]">{erro}</p>}

      {fotos.length === 0 ? (
        <p className="px-6 py-8 text-center text-[12.5px] leading-relaxed text-[var(--p-texto-3)]">
          Ainda não tem nenhuma foto aqui. Suba as suas e elas aparecem na hora de escolher a imagem de qualquer bloco —
          em qualquer loja.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {fotos.map((f) => (
            <div key={f.id} className="relative overflow-hidden rounded-[13px] bg-[var(--p-superficie-2)]">
              <img src={f.url} alt={f.nome} className="aspect-square w-full object-cover" />
              <button
                onClick={() => {
                  apagarFoto(f.id);
                  setFotos(listarFotos());
                }}
                aria-label={`Apagar ${f.nome}`}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(f.url);
                  setCopiada(f.id);
                  window.setTimeout(() => setCopiada(null), 1500);
                }}
                className="num-tab absolute inset-x-0 bottom-0 bg-black/55 py-1 text-[10px] font-semibold text-white backdrop-blur-sm"
              >
                {copiada === f.id ? "copiada" : `${f.kb} KB`}
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-[11.5px] leading-relaxed text-[var(--p-texto-3)]">
        As fotos ficam neste navegador. A conexão com a galeria do celular entra numa próxima etapa.
      </p>
    </div>
  );
}
