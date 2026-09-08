import { CalendarClock, Clock, UserRound } from "lucide-react";
import type { DefinicaoBloco, Modulo, Oferta, PropsBloco } from "../nucleo/tipos";
import { Sobrescrito } from "../design/Primitivos";
import { VazioNoEstudio } from "../blocos/pecas";

/**
 * MÓDULO AGENDAMENTO — a prova de que o desenho aguenta.
 *
 * Este módulo não toca em nenhum arquivo do núcleo. Ele só registra um
 * configurador (que grava data e profissional na `selecao` genérica da
 * linha), um passo de checkout e um bloco. Serviço e produto convivem na
 * mesma sacola porque o núcleo nunca soube a diferença.
 */

export interface Profissional {
  id: string;
  nome: string;
  papel?: string;
  foto?: string;
}

export interface ConfigAgendamento {
  profissionais: Profissional[];
  /** 0 = domingo. */
  diasAtendidos: number[];
  horaInicio: string;
  horaFim: string;
  /** Minutos entre um horário e outro. */
  intervalo: number;
  /** Quantos dias pra frente dá pra marcar. */
  janelaDias?: number;
}

export interface DadosAgendamentoDaOferta {
  duracaoMin: number;
  /** Vazio = qualquer profissional atende. */
  profissionaisIds?: string[];
}

function config(loja: { config: Record<string, unknown> }): ConfigAgendamento | null {
  return (loja.config.agendamento as ConfigAgendamento) ?? null;
}

function dadosDa(oferta: Oferta): DadosAgendamentoDaOferta | null {
  return (oferta.dadosModulo.agendamento as DadosAgendamentoDaOferta) ?? null;
}

function profissionaisDe(oferta: Oferta, cfg: ConfigAgendamento): Profissional[] {
  const ids = dadosDa(oferta)?.profissionaisIds;
  if (!ids?.length) return cfg.profissionais;
  return cfg.profissionais.filter((p) => ids.includes(p.id));
}

/** Os próximos dias em que a loja atende. */
export function proximosDias(cfg: ConfigAgendamento, quantos = 14): Date[] {
  const dias: Date[] = [];
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const janela = cfg.janelaDias ?? 45;

  for (let i = 0; i < janela && dias.length < quantos; i++) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    if (cfg.diasAtendidos.includes(d.getDay())) dias.push(d);
  }
  return dias;
}

/**
 * Ocupação simulada, estável por dia.
 *
 * Sem isto a agenda mostra o mesmo número de vagas em todos os dias, o que
 * denuncia demonstração na hora. Quando a agenda real entrar (API), esta
 * função sai e o horário ocupado vem do banco.
 */
function ocupado(dia: Date, minutos: number): boolean {
  const semente = dia.getDate() * 137 + dia.getMonth() * 31 + minutos * 7;
  return ((semente * 2654435761) % 1000) / 1000 < 0.42;
}

/** Os horários de um dia, já descontando o que passou se for hoje. */
export function horariosDoDia(cfg: ConfigAgendamento, dia: Date, duracaoMin: number): string[] {
  const [hi, mi] = cfg.horaInicio.split(":").map(Number);
  const [hf, mf] = cfg.horaFim.split(":").map(Number);
  const inicio = hi * 60 + mi;
  const fim = hf * 60 + mf;

  const agora = new Date();
  const ehHoje = dia.toDateString() === agora.toDateString();
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  const out: string[] = [];
  for (let m = inicio; m + duracaoMin <= fim; m += cfg.intervalo) {
    if (ehHoje && m <= minutosAgora + 60) continue; // não oferece daqui a 10 minutos
    if (ocupado(dia, m)) continue;
    out.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return out;
}

const DIA_CURTO = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

function rotularQuando(iso: string): string {
  const d = new Date(iso);
  const dia = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  const hora = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return `${DIA_CURTO[d.getDay()]} ${dia} às ${hora}`;
}

/* ---------- bloco: próximos horários ---------- */

function ProximosHorarios({ props, loja, ofertas, editando }: PropsBloco<{ titulo: string }>) {
  const cfg = config(loja);
  const servicos = ofertas.filter((o) => o.ativa && o.tipo === "servico");
  if (!cfg || !servicos.length) {
    return editando ? <VazioNoEstudio>Aparece quando a loja tiver serviços e a agenda configurada.</VazioNoEstudio> : null;
  }

  const dias = proximosDias(cfg, 5);
  const menorDuracao = Math.min(...servicos.map((o) => dadosDa(o)?.duracaoMin ?? 30));

  return (
    <div className="placa p-4" style={{ borderRadius: "var(--canto-g)" }}>
      <Sobrescrito>{props.titulo || "Próximos horários"}</Sobrescrito>
      <div className="sem-barra mt-3 flex gap-2 overflow-x-auto">
        {dias.map((d) => {
          const livres = horariosDoDia(cfg, d, menorDuracao).length;
          return (
            <div
              key={d.toISOString()}
              className="flex w-[76px] shrink-0 flex-col items-center gap-0.5 border border-borda px-2 py-2.5"
              style={{ borderRadius: "var(--canto-m)" }}
            >
              <span className="text-[11px] font-semibold uppercase text-tinta-45">{DIA_CURTO[d.getDay()]}</span>
              <span className="num-tab font-display text-[17px] font-bold">{d.getDate()}</span>
              <span className={`num-tab text-[10.5px] font-semibold ${livres ? "text-ok" : "text-tinta-25"}`}>
                {livres ? `${livres} livres` : "cheio"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const blocoProximosHorarios: DefinicaoBloco<{ titulo: string }> = {
  tipo: "proximos-horarios",
  nome: "Próximos horários",
  descricao: "A agenda dos próximos dias, de relance.",
  paginas: ["inicio", "catalogo", "oferta"],
  icone: CalendarClock,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Próximos horários" },
  },
  Componente: ProximosHorarios,
};

/* ---------- o módulo ---------- */

export const moduloAgendamento: Modulo = {
  id: "agendamento",
  nome: "Agenda",
  descricao: "Data, hora e profissional. Liga o serviço no mesmo checkout.",
  icone: CalendarClock,
  blocos: [blocoProximosHorarios as unknown as DefinicaoBloco<never>],

  configurador: {
    aplicaA: (oferta) => oferta.tipo === "servico" && dadosDa(oferta) !== null,

    completo: (_oferta, selecao) => Boolean(selecao.inicio),

    resumir: (_oferta, selecao) => {
      if (!selecao.inicio) return "";
      const quando = rotularQuando(String(selecao.inicio));
      return selecao.profissionalNome ? `${quando} · ${selecao.profissionalNome}` : quando;
    },

    Componente: ({ oferta, selecao, definir, loja }) => {
      const cfg = config(loja);
      const dados = dadosDa(oferta);
      if (!cfg || !dados) return null;

      const equipe = profissionaisDe(oferta, cfg);
      const dias = proximosDias(cfg, 10);
      const diaEscolhido = selecao.dia ? new Date(String(selecao.dia)) : dias[0];
      const horarios = diaEscolhido ? horariosDoDia(cfg, diaEscolhido, dados.duracaoMin) : [];

      function escolherHora(hora: string) {
        const [h, m] = hora.split(":").map(Number);
        const quando = new Date(diaEscolhido);
        quando.setHours(h, m, 0, 0);
        definir({ inicio: quando.toISOString(), hora });
      }

      return (
        <div className="flex flex-col gap-5">
          {equipe.length > 1 && (
            <div className="flex flex-col gap-2">
              <Sobrescrito>Com quem</Sobrescrito>
              <div className="sem-barra -mx-1 flex gap-2 overflow-x-auto px-1">
                {equipe.map((p) => {
                  const ativo = selecao.profissionalId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => definir({ profissionalId: p.id, profissionalNome: p.nome })}
                      aria-pressed={ativo}
                      className={`flex w-[92px] shrink-0 flex-col items-center gap-1.5 border px-2 py-3 transition ${
                        ativo ? "border-[var(--marca-500)] bg-[var(--marca-50)]" : "border-borda bg-papel"
                      }`}
                      style={{ borderRadius: "var(--canto-m)" }}
                    >
                      {p.foto ? (
                        <img src={p.foto} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-papel-3 text-tinta-45">
                          <UserRound size={19} />
                        </span>
                      )}
                      <span className="w-full truncate text-center text-[12px] font-semibold">{p.nome}</span>
                      {p.papel && <span className="w-full truncate text-center text-[10.5px] text-tinta-45">{p.papel}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Sobrescrito>Que dia</Sobrescrito>
            <div className="sem-barra -mx-1 flex gap-2 overflow-x-auto px-1">
              {dias.map((d) => {
                const ativo = diaEscolhido?.toDateString() === d.toDateString();
                return (
                  <button
                    key={d.toISOString()}
                    onClick={() => definir({ dia: d.toISOString(), inicio: undefined, hora: undefined })}
                    aria-pressed={ativo}
                    className={`flex w-[62px] shrink-0 flex-col items-center gap-0.5 border py-2.5 transition ${
                      ativo ? "border-transparent bg-tinta text-white" : "border-borda bg-papel text-tinta-70"
                    }`}
                    style={{ borderRadius: "var(--canto-m)" }}
                  >
                    <span className="text-[10.5px] font-semibold uppercase opacity-70">{DIA_CURTO[d.getDay()]}</span>
                    <span className="num-tab font-display text-[17px] font-bold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Sobrescrito>Que horas</Sobrescrito>
            {horarios.length === 0 ? (
              <p className="text-[13px] text-tinta-45">Sem horário livre neste dia. Tente outro.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {horarios.map((h) => {
                  const ativo = selecao.hora === h;
                  return (
                    <button
                      key={h}
                      onClick={() => escolherHora(h)}
                      aria-pressed={ativo}
                      className={`num-tab min-h-[42px] border text-[13.5px] font-semibold transition ${
                        ativo
                          ? "border-transparent bg-[var(--marca-500)] text-[var(--sobre-marca)]"
                          : "border-borda-forte bg-papel text-tinta-70"
                      }`}
                      style={{ borderRadius: "var(--canto-m)" }}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            )}
            {dados.duracaoMin > 0 && (
              <p className="flex items-center gap-1.5 text-[12px] text-tinta-45">
                <Clock size={12} />
                Dura cerca de {dados.duracaoMin} minutos
              </p>
            )}
          </div>
        </div>
      );
    },
  },

  passos: [
    {
      id: "agendamento",
      titulo: "Seu horário",
      subtitulo: "Confira antes de mandar.",
      ordem: 30,
      visivelQuando: ({ linhas }) => linhas.some((l) => l.oferta.tipo === "servico"),
      validar: () => [],

      Componente: ({ linhas }) => {
        const marcados = linhas.filter((l) => l.oferta.tipo === "servico");
        return (
          <div className="flex flex-col gap-2">
            {marcados.map((l) => (
              <div
                key={l.linha.chave}
                className="flex items-center gap-3 border border-borda bg-papel px-4 py-3"
                style={{ borderRadius: "var(--canto-m)" }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--marca-100)] text-[var(--marca-700)]" style={{ borderRadius: "var(--canto-p)" }}>
                  <CalendarClock size={17} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-semibold">{l.oferta.nome}</p>
                  <p className="truncate text-[12.5px] text-tinta-45">{l.resumoSelecao || "Sem horário"}</p>
                </div>
              </div>
            ))}
          </div>
        );
      },

      paraMensagem: () => [],
    },
  ],

  // As linhas do horário já vão no resumo de cada item da mensagem, pelo
  // `resumir` do configurador. Não precisa repetir aqui.
};
