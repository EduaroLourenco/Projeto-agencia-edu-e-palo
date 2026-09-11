import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BarChart3, ChevronDown, LayoutGrid, Package, Plus, Receipt, Sparkles, Store, Wand2 } from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { listarLojas } from "../nucleo/loja";
import { contaAtual, sair, type Conta } from "../conta/sessao";
import { BotaoP, Vazio } from "./Pecas";
import { Visao } from "./Visao";
import { PedidosApp } from "./Pedidos";
import { EstudioApp } from "./Estudio";
import { Mais } from "./Mais";
import { Catalogo } from "../painel/Catalogo";
import { salvarLoja } from "../nucleo/loja";
import { BotaoDuvida } from "./Ajuda";

/**
 * A plataforma: o lado de dentro.
 *
 * Uma casca só, cinco destinos na barra de baixo, e a loja atual escolhida
 * no topo. Tudo o que a pessoa faz aqui é sobre UMA loja de cada vez —
 * misturar lojas na mesma tela é o que faz painel de agência virar planilha.
 */

const CHAVE_LOJA_ATUAL = "plataforma:loja-atual";

type Aba = "visao" | "produtos" | "pedidos" | "estudio" | "mais";

export function Plataforma() {
  const navegar = useNavigate();
  const [conta, setConta] = useState<Conta | null>(() => contaAtual());
  const [aba, setAba] = useState<Aba>("visao");
  const [trocando, setTrocando] = useState(false);
  const [versao, setVersao] = useState(0);

  const minhasLojas = useMemo(() => {
    if (!conta) return [];
    // Conta de agência enxerga as demos; conta nova, só o que ela criou.
    return listarLojas().filter((l) => conta.lojas.includes(l.loja.slug) || l.propria);
  }, [conta, versao]);

  const [slugAtual, setSlugAtual] = useState<string | null>(() => localStorage.getItem(CHAVE_LOJA_ATUAL));
  const escolhida = minhasLojas.find((l) => l.loja.slug === slugAtual) ?? minhasLojas[0];
  const loja = escolhida?.loja ?? null;

  useEffect(() => {
    if (loja) localStorage.setItem(CHAVE_LOJA_ATUAL, loja.slug);
  }, [loja]);

  if (!conta) return <Navigate to="/entrar" replace />;

  function alterarLoja(proxima: Loja) {
    salvarLoja(proxima);
    setVersao((v) => v + 1);
  }

  const destinos: { id: Aba; nome: string; icone: typeof BarChart3 }[] = [
    { id: "visao", nome: "Visão", icone: BarChart3 },
    { id: "produtos", nome: "Itens", icone: Package },
    { id: "pedidos", nome: "Pedidos", icone: Receipt },
    { id: "estudio", nome: "Estúdio", icone: Wand2 },
    { id: "mais", nome: "Mais", icone: LayoutGrid },
  ];

  return (
    <div className="painel flex min-h-dvh flex-col">
      {/* ---------- topo: marca, loja atual, conta ---------- */}
      <header className="sticky top-0 z-30 border-b border-[var(--p-borda)] bg-[var(--p-fundo)]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-lg items-center gap-2 px-4 py-2.5">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] text-white"
            style={{ background: "linear-gradient(150deg,var(--p-acento-claro),var(--p-acento))" }}
          >
            <Sparkles size={15} strokeWidth={2.4} />
          </span>

          {loja ? (
            <button
              onClick={() => setTrocando(true)}
              className="flex min-w-0 flex-1 items-center gap-1.5 rounded-[10px] px-2 py-1.5 text-left transition hover:bg-[var(--p-superficie-2)]"
            >
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-semibold leading-tight">{loja.nome}</span>
                <span className="block text-[11px] text-[var(--p-texto-3)]">
                  {minhasLojas.length} {minhasLojas.length === 1 ? "loja" : "lojas"} · toque pra trocar
                </span>
              </span>
              <ChevronDown size={15} className="shrink-0 text-[var(--p-texto-3)]" />
            </button>
          ) : (
            <span className="min-w-0 flex-1 truncate text-[14px] font-semibold">{conta.nome}</span>
          )}

          <Link
            to="/lojas"
            title="Ver as lojas públicas"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[var(--p-texto-3)] transition hover:bg-[var(--p-superficie-2)] hover:text-[var(--p-texto)]"
          >
            <Store size={17} />
          </Link>
        </div>
      </header>

      {/* ---------- conteúdo ---------- */}
      <main className="mx-auto w-full max-w-lg flex-1 px-4 pb-28 pt-5">
        {/* Sem loja, o estúdio continua aberto — é justamente lá que se cria
            a primeira. Cobrir TODAS as abas com o convite deixava a conta
            nova sem nenhum caminho pra sair do lugar. */}
        <div key={aba} className="anima-entrar">
          {!loja && aba !== "estudio" ? (
            <PrimeiraLoja onCriar={() => setAba("estudio")} />
          ) : (
            <>
              {aba === "visao" && loja && <Visao loja={loja} conta={conta} onIr={setAba} />}
              {aba === "produtos" && loja && (
                <div className="no-painel">
                  <Catalogo loja={loja} onMudar={alterarLoja} />
                </div>
              )}
              {aba === "pedidos" && loja && <PedidosApp loja={loja} />}
              {aba === "estudio" && (
                <EstudioApp
                  lojas={minhasLojas}
                  conta={conta}
                  atual={loja}
                  onEscolher={(slug) => {
                    setSlugAtual(slug);
                    setVersao((v) => v + 1);
                  }}
                  onMudou={() => setVersao((v) => v + 1)}
                />
              )}
              {aba === "mais" && loja && (
                <Mais
                  conta={conta}
                  loja={loja}
                  onMudar={alterarLoja}
                  onSair={() => {
                    sair();
                    setConta(null);
                    navegar("/entrar");
                  }}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* ---------- barra de baixo ---------- */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--p-borda)] bg-[var(--p-fundo)]/92 backdrop-blur-xl"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex w-full max-w-lg items-stretch px-2 pt-1.5">
          {destinos.map((d) => {
            const Icone = d.icone;
            const ativo = aba === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setAba(d.id)}
                aria-current={ativo ? "page" : undefined}
                className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
              >
                {/* O traço em cima do ícone ativo: mais discreto e mais
                    legível que pintar o ícone inteiro. */}
                <span
                  className={`absolute -top-1.5 h-[2px] w-7 rounded-full transition-opacity ${ativo ? "opacity-100" : "opacity-0"}`}
                  style={{ background: "var(--p-acento)" }}
                />
                <Icone
                  size={19}
                  strokeWidth={ativo ? 2.3 : 1.8}
                  className={ativo ? "text-[var(--p-texto)]" : "text-[var(--p-texto-3)]"}
                />
                <span
                  className={`text-[10px] font-semibold ${ativo ? "text-[var(--p-texto)]" : "text-[var(--p-texto-3)]"}`}
                >
                  {d.nome}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ---------- troca de loja ---------- */}
      {trocando && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <button
            aria-label="Fechar"
            onClick={() => setTrocando(false)}
            className="anima-surgir absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="anima-subir relative mx-auto w-full max-w-lg rounded-t-[22px] border-t border-[var(--p-borda-forte)] bg-[var(--p-superficie)] p-4 pb-8">
            <p className="rotulo-p mb-3">Suas lojas</p>
            <div className="flex flex-col gap-1.5">
              {minhasLojas.map(({ loja: l }) => (
                <button
                  key={l.slug}
                  onClick={() => {
                    setSlugAtual(l.slug);
                    setTrocando(false);
                  }}
                  className={`flex items-center gap-3 rounded-[13px] border px-3 py-3 text-left transition ${
                    l.slug === loja?.slug
                      ? "border-[var(--p-acento)] bg-[var(--p-acento-fundo)]"
                      : "border-[var(--p-borda)] hover:bg-[var(--p-superficie-2)]"
                  }`}
                >
                  <span
                    className="h-9 w-9 shrink-0 rounded-[10px]"
                    style={{ background: l.tema.corMarca }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold">{l.nome}</span>
                    <span className="num-tab block text-[11.5px] text-[var(--p-texto-3)]">
                      {l.ofertas.length} itens · /{l.slug}
                    </span>
                  </span>
                </button>
              ))}
            </div>
            <BotaoP
              largo
              tom="contorno"
              className="mt-3"
              onClick={() => {
                setTrocando(false);
                setAba("estudio");
              }}
            >
              <Plus size={16} />
              Criar outra loja
            </BotaoP>
          </div>
        </div>
      )}

      {/* Sempre no mesmo canto, em qualquer aba. */}
      <BotaoDuvida />
    </div>
  );
}

/** Conta nova, sem loja nenhuma. */
function PrimeiraLoja({ onCriar }: { onCriar: () => void }) {
  return (
    <Vazio
      icone={Store}
      titulo="Sua primeira loja"
      texto="Escolha um modelo pronto e ajuste, ou comece do zero. Leva menos de um minuto."
      acao={
        <BotaoP onClick={onCriar}>
          <Wand2 size={16} />
          Abrir o estúdio
        </BotaoP>
      }
    />
  );
}

