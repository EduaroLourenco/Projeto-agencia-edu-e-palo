import { CalendarCog, Plus, Trash2 } from "lucide-react";
import type { Loja } from "../nucleo/tipos";
import { Botao, Campo, Entrada, Selecao, Sobrescrito } from "../design/Primitivos";
import type { ConfigAgendamento, Profissional } from "./agendamento";

/**
 * A AGENDA DO LOJISTA
 *
 * Esta tela faltava, e a falta era fatal pra quem vende serviço: o módulo de
 * agendamento lia dias, horários e profissionais da configuração da loja, e
 * não existia lugar nenhum pra escrever isso. Toda loja de serviço nascia com
 * "Profissional 1", segunda a sábado, 9h às 18h — e ficava assim pra sempre.
 *
 * O que se decide aqui é o que a vitrine oferece: se o salão não trabalha
 * segunda, segunda não aparece; se a Bárbara não atende barba, o horário dela
 * some quando o cliente escolhe barba.
 */

const DIAS = [
  { n: 0, curto: "Dom", longo: "domingo" },
  { n: 1, curto: "Seg", longo: "segunda" },
  { n: 2, curto: "Ter", longo: "terça" },
  { n: 3, curto: "Qua", longo: "quarta" },
  { n: 4, curto: "Qui", longo: "quinta" },
  { n: 5, curto: "Sex", longo: "sexta" },
  { n: 6, curto: "Sáb", longo: "sábado" },
];

const PADRAO: ConfigAgendamento = {
  profissionais: [],
  diasAtendidos: [1, 2, 3, 4, 5],
  horaInicio: "09:00",
  horaFim: "18:00",
  intervalo: 30,
  janelaDias: 30,
};

export function TelaAgenda({ loja, onMudar }: { loja: Loja; onMudar: (loja: Loja) => void }) {
  const cfg: ConfigAgendamento = { ...PADRAO, ...((loja.config.agendamento as ConfigAgendamento) ?? {}) };

  function salvar(patch: Partial<ConfigAgendamento>) {
    onMudar({ ...loja, config: { ...loja.config, agendamento: { ...cfg, ...patch } } });
  }

  function mudarProfissional(id: string, patch: Partial<Profissional>) {
    salvar({ profissionais: cfg.profissionais.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }

  function adicionar() {
    const novo: Profissional = {
      id: `p_${Date.now().toString(36)}`,
      nome: "",
      papel: "",
    };
    salvar({ profissionais: [...cfg.profissionais, novo] });
  }

  function remover(id: string) {
    salvar({ profissionais: cfg.profissionais.filter((p) => p.id !== id) });
  }

  function alternarDia(n: number) {
    const tem = cfg.diasAtendidos.includes(n);
    // Nunca deixa zerar: sem nenhum dia atendido a agenda some da vitrine e
    // o lojista fica sem entender por que ninguém consegue marcar.
    if (tem && cfg.diasAtendidos.length === 1) return;
    salvar({
      diasAtendidos: tem
        ? cfg.diasAtendidos.filter((d) => d !== n)
        : [...cfg.diasAtendidos, n].sort((a, b) => a - b),
    });
  }

  const horaRuim = cfg.horaFim <= cfg.horaInicio;

  return (
    <div className="flex flex-col gap-7">
      <header>
        <h2 className="font-display text-[19px] font-bold tracking-[-0.02em]">Sua agenda</h2>
        <p className="mt-1 text-[13.5px] leading-relaxed text-tinta-70">
          É isto que decide os horários que o cliente vê na hora de marcar.
        </p>
      </header>

      {/* ---------- quem atende ---------- */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Sobrescrito>Quem atende</Sobrescrito>
          <span className="num-tab text-[12px] text-tinta-45">
            {cfg.profissionais.length} {cfg.profissionais.length === 1 ? "pessoa" : "pessoas"}
          </span>
        </div>

        {cfg.profissionais.length === 0 ? (
          <p className="border border-dashed border-borda-forte px-4 py-5 text-center text-[13px] leading-relaxed text-tinta-45"
             style={{ borderRadius: "var(--canto-m)" }}>
            Ninguém cadastrado ainda. Enquanto estiver assim, o cliente marca sem escolher com quem —
            o que serve para quem atende sozinho.
          </p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {cfg.profissionais.map((p) => (
              <div
                key={p.id}
                className="flex items-start gap-2.5 border border-borda p-3"
                style={{ borderRadius: "var(--canto-m)" }}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Campo rotulo="Nome">
                    {(cp) => (
                      <Entrada
                        {...cp}
                        value={p.nome}
                        placeholder="Bárbara"
                        onChange={(e) => mudarProfissional(p.id, { nome: e.target.value })}
                      />
                    )}
                  </Campo>
                  <Campo rotulo="O que faz" dica="Aparece embaixo do nome. Ex.: colorista, clínico geral.">
                    {(cp) => (
                      <Entrada
                        {...cp}
                        value={p.papel ?? ""}
                        placeholder="Colorista"
                        onChange={(e) => mudarProfissional(p.id, { papel: e.target.value })}
                      />
                    )}
                  </Campo>
                </div>
                <button
                  onClick={() => remover(p.id)}
                  aria-label={`Remover ${p.nome || "profissional"}`}
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-tinta-45 transition hover:text-erro"
                  style={{ borderRadius: "var(--canto-p)" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <Botao tom="contorno" onClick={adicionar}>
          <Plus size={16} />
          Adicionar quem atende
        </Botao>
      </section>

      {/* ---------- dias ---------- */}
      <section className="flex flex-col gap-3">
        <Sobrescrito>Dias que você atende</Sobrescrito>
        <div className="flex flex-wrap gap-2">
          {DIAS.map((d) => {
            const ativo = cfg.diasAtendidos.includes(d.n);
            return (
              <button
                key={d.n}
                onClick={() => alternarDia(d.n)}
                aria-pressed={ativo}
                aria-label={d.longo}
                className={`min-h-[44px] min-w-[52px] border px-3 text-[13.5px] font-semibold transition ${
                  ativo
                    ? "border-transparent bg-[var(--marca-500)] text-[var(--sobre-marca)]"
                    : "border-borda bg-papel text-tinta-45 hover:border-borda-forte"
                }`}
                style={{ borderRadius: "var(--canto-p)" }}
              >
                {d.curto}
              </button>
            );
          })}
        </div>
        <p className="text-[12.5px] text-tinta-45">
          Dia desligado não aparece pro cliente escolher.
        </p>
      </section>

      {/* ---------- horário ---------- */}
      <section className="flex flex-col gap-3">
        <Sobrescrito>Horário</Sobrescrito>
        <div className="grid grid-cols-2 gap-3">
          <Campo rotulo="Abre às">
            {(cp) => (
              <Entrada
                {...cp}
                type="time"
                value={cfg.horaInicio}
                onChange={(e) => salvar({ horaInicio: e.target.value })}
              />
            )}
          </Campo>
          <Campo rotulo="Fecha às" erro={horaRuim ? "Tem que ser depois da abertura." : undefined}>
            {(cp) => (
              <Entrada
                {...cp}
                type="time"
                value={cfg.horaFim}
                aria-invalid={horaRuim}
                onChange={(e) => salvar({ horaFim: e.target.value })}
              />
            )}
          </Campo>
        </div>

        <Campo
          rotulo="De quanto em quanto tempo começa um atendimento"
          dica="30 minutos significa 9:00, 9:30, 10:00. Não é a duração do serviço — essa fica em cada item."
        >
          {(cp) => (
            <Selecao
              {...cp}
              value={String(cfg.intervalo)}
              onChange={(e) => salvar({ intervalo: Number(e.target.value) })}
            >
              <option value="15">15 minutos</option>
              <option value="20">20 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
            </Selecao>
          )}
        </Campo>

        <Campo
          rotulo="Até quantos dias pra frente o cliente pode marcar"
          dica="Janela curta enche a agenda mais perto; janela longa dá previsibilidade."
        >
          {(cp) => (
            <Selecao
              {...cp}
              value={String(cfg.janelaDias ?? 30)}
              onChange={(e) => salvar({ janelaDias: Number(e.target.value) })}
            >
              <option value="7">7 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
              <option value="60">60 dias</option>
              <option value="90">90 dias</option>
            </Selecao>
          )}
        </Campo>
      </section>

      <p className="border-t border-borda pt-4 text-[12.5px] leading-relaxed text-tinta-45">
        A duração de cada serviço é cadastrada no próprio item, em Catálogo. É ela que decide
        quantos horários seguidos ficam ocupados.
      </p>
    </div>
  );
}

export const telaAgenda = {
  id: "agenda",
  nome: "Agenda",
  icone: CalendarCog,
  Componente: TelaAgenda,
};
