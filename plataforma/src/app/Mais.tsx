import { useState } from "react";
import {
  ArrowLeft,
  Bot,
  ChevronRight,
  CircleHelp,
  CreditCard,
  ExternalLink,
  LogOut,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import type { Conta } from "../conta/sessao";
import { PLANOS, limiteDeLojas } from "../conta/sessao";
import { Configuracoes } from "../painel/Configuracoes";
import { BotaoP, Etiqueta, Secao } from "./Pecas";
import { PassoAPasso } from "./Ajuda";

/**
 * O RESTO.
 *
 * A barra de baixo cabe cinco destinos e o quinto é sempre este: o que não
 * é do dia a dia. O que ainda não existe aparece aqui também, dito com
 * todas as letras — esconder o que está por vir é o que faz o cliente achar
 * que o produto acabou.
 */

type Tela = "menu" | "loja" | "ajuda" | "plano";

export function Mais({
  conta,
  loja,
  onMudar,
  onSair,
}: {
  conta: Conta;
  loja: Loja;
  onMudar: (loja: Loja) => void;
  onSair: () => void;
}) {
  const [tela, setTela] = useState<Tela>("menu");

  if (tela !== "menu") {
    return (
      <div className="flex flex-col gap-5">
        <header className="flex items-center gap-2">
          <button
            onClick={() => setTela("menu")}
            aria-label="Voltar"
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--p-texto-2)] hover:bg-[var(--p-superficie-2)]"
          >
            <ArrowLeft size={19} />
          </button>
          <h1 className="font-display text-[20px] font-bold tracking-[-0.028em]">
            {tela === "loja" ? "Dados da loja" : tela === "ajuda" ? "Como funciona" : "Seu plano"}
          </h1>
        </header>

        {tela === "loja" && (
          <div className="no-painel">
            <Configuracoes loja={loja} onMudar={onMudar} />
          </div>
        )}
        {tela === "ajuda" && (
          <>
            <PassoAPasso />
            <a
              href="https://wa.me/5516999999999"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-[16px] border border-dashed border-[var(--p-borda-forte)] px-4 py-3.5 text-[13px] font-semibold"
            >
              <ExternalLink size={16} className="text-[var(--p-acento-claro)]" />
              Falar com a gente no WhatsApp
            </a>
          </>
        )}
        {tela === "plano" && <Planos conta={conta} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <header className="flex items-center gap-3.5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] font-display text-[18px] font-bold text-white"
          style={{ background: "linear-gradient(150deg,var(--p-acento-claro),var(--p-acento))" }}
        >
          {conta.nome.trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-[19px] font-bold tracking-[-0.028em]">{conta.nome}</h1>
          <p className="truncate text-[12.5px] text-[var(--p-texto-3)]">{conta.email}</p>
        </div>
      </header>

      <Secao titulo="Sua conta">
        <div className="placa-p divide-y divide-[var(--p-borda)] overflow-hidden rounded-[16px]">
          <Linha
            icone={Settings}
            nome="Dados da loja"
            texto="Nome, recado, WhatsApp e se está aberta"
            onClique={() => setTela("loja")}
          />
          <Linha
            icone={CreditCard}
            nome={`Plano ${conta.plano}`}
            texto={`Até ${limiteDeLojas(conta.plano) > 90 ? "lojas ilimitadas" : `${limiteDeLojas(conta.plano)} loja(s)`}`}
            onClique={() => setTela("plano")}
          />
          <Linha
            icone={CircleHelp}
            nome="Como funciona"
            texto="O passo a passo, do zero à primeira venda"
            onClique={() => setTela("ajuda")}
          />
        </div>
      </Secao>

      <Secao titulo="Em breve">
        <div className="flex flex-col gap-2.5">
          <EmBreve
            icone={Users}
            nome="CRM"
            texto="Todo mundo que já comprou, o que comprou e quando — com aniversário, recompra e a lista de quem sumiu."
          />
          <EmBreve
            icone={Bot}
            nome="Ajuda com IA"
            texto="Escrever descrição de produto, responder o cliente e montar a loja inteira a partir de uma frase sua."
          />
        </div>
        <p className="text-[11.5px] leading-relaxed text-[var(--p-texto-3)]">
          As duas dependem do banco de dados, que é a próxima etapa. Enquanto isso, tudo o que você monta aqui fica
          guardado neste navegador.
        </p>
      </Secao>

      <BotaoP tom="contorno" largo onClick={onSair}>
        <LogOut size={16} />
        Sair da conta
      </BotaoP>

      <p className="text-center text-[11px] text-[var(--p-texto-3)]">Zap Commerce · versão de demonstração</p>
    </div>
  );
}

function Linha({
  icone: Icone,
  nome,
  texto,
  onClique,
}: {
  icone: React.ComponentType<{ size?: number }>;
  nome: string;
  texto: string;
  onClique: () => void;
}) {
  return (
    <button
      onClick={onClique}
      className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[var(--p-superficie-2)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[var(--p-superficie-3)] text-[var(--p-texto-2)]">
        <Icone size={17} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-semibold">{nome}</span>
        <span className="mt-0.5 block truncate text-[11.5px] text-[var(--p-texto-3)]">{texto}</span>
      </span>
      <ChevronRight size={16} className="shrink-0 text-[var(--p-texto-3)]" />
    </button>
  );
}

/**
 * O que ainda não existe.
 *
 * Opaco de propósito, e sem toque nenhum: um cartão que parece clicável e
 * não faz nada é pior do que não ter o cartão.
 */
function EmBreve({
  icone: Icone,
  nome,
  texto,
}: {
  icone: React.ComponentType<{ size?: number }>;
  nome: string;
  texto: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[16px] border border-dashed border-[var(--p-borda-forte)] p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[var(--p-superficie-2)] text-[var(--p-texto-3)]">
        <Icone size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13.5px] font-bold text-[var(--p-texto-2)]">{nome}</p>
          <Etiqueta tom="acento">em breve</Etiqueta>
        </div>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--p-texto-3)]">{texto}</p>
      </div>
    </div>
  );
}

function Planos({ conta }: { conta: Conta }) {
  return (
    <div className="flex flex-col gap-3">
      {PLANOS.map((p) => {
        const atual = p.id === conta.plano;
        return (
          <div
            key={p.id}
            className={`rounded-[18px] border p-4 ${
              atual ? "border-[var(--p-acento)] bg-[var(--p-acento-fundo)]" : "border-[var(--p-borda)] bg-[var(--p-superficie)]"
            }`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-[16px] font-bold tracking-[-0.02em]">{p.nome}</p>
              <p className="num-tab text-[14px] font-bold">
                R$ {p.preco}
                <span className="text-[11px] font-medium text-[var(--p-texto-3)]">/mês</span>
              </p>
            </div>
            <p className="mt-1 text-[12.5px] text-[var(--p-texto-3)]">{p.chamada}</p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {p.inclui.map((i) => (
                <li key={i} className="flex items-center gap-2 text-[12.5px] text-[var(--p-texto-2)]">
                  <Sparkles size={13} className="shrink-0 text-[var(--p-acento-claro)]" />
                  {i}
                </li>
              ))}
            </ul>
            {atual && (
              <p className="mt-3">
                <Etiqueta tom="acento">seu plano</Etiqueta>
              </p>
            )}
          </div>
        );
      })}
      <p className="text-center text-[11.5px] leading-relaxed text-[var(--p-texto-3)]">
        A troca de plano entra junto com o pagamento de verdade. Aqui a cobrança é simulada.
      </p>
    </div>
  );
}
