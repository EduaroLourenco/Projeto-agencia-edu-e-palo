import { useId, type ReactNode } from "react";

/**
 * Os primitivos do painel.
 *
 * Separados dos primitivos da loja de propósito: a loja é do cliente e muda
 * de cara por tema; o painel é nosso e tem uma cara só. Misturar os dois faz
 * o painel herdar a cor da loja aberta, que é como se perde a identidade da
 * ferramenta.
 */

export function BotaoP({
  children,
  tom = "acento",
  largo = false,
  pequeno = false,
  ...resto
}: {
  children: ReactNode;
  tom?: "acento" | "contorno" | "fantasma" | "perigo";
  largo?: boolean;
  pequeno?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const tons: Record<string, string> = {
    // Degradê de dois pontos muito próximos: não lê como degradê, lê como
    // superfície curva. É o truque que separa botão chapado de botão caro.
    acento:
      "text-white [background:linear-gradient(180deg,var(--p-acento-claro),var(--p-acento))] " +
      "shadow-[0_1px_0_rgba(255,255,255,.18)_inset,0_6px_20px_-8px_rgba(123,92,255,.7)] hover:brightness-110",
    contorno: "text-[var(--p-texto)] bg-[var(--p-superficie-2)] border border-[var(--p-borda-forte)] hover:bg-[var(--p-superficie-3)]",
    fantasma: "text-[var(--p-texto-2)] hover:text-[var(--p-texto)] hover:bg-[var(--p-superficie-2)]",
    perigo: "text-[var(--p-erro)] border border-[var(--p-erro)]/30 bg-[var(--p-erro)]/10 hover:bg-[var(--p-erro)]/20",
  };
  return (
    <button
      {...resto}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
        pequeno ? "min-h-[36px] rounded-[10px] px-3 text-[13px]" : "min-h-[50px] rounded-[13px] px-5 text-[15px]"
      } ${largo ? "w-full" : ""} ${tons[tom]} ${resto.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function CampoP({
  rotulo,
  dica,
  erro,
  children,
}: {
  rotulo: string;
  dica?: string;
  erro?: string;
  children: (props: { id: string }) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12.5px] font-semibold text-[var(--p-texto-2)]">
        {rotulo}
      </label>
      {children({ id })}
      {erro ? (
        <p className="text-[12px] font-medium text-[var(--p-erro)]">{erro}</p>
      ) : dica ? (
        <p className="text-[12px] leading-snug text-[var(--p-texto-3)]">{dica}</p>
      ) : null}
    </div>
  );
}

export function EntradaP(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-[50px] w-full rounded-[13px] border border-[var(--p-borda)] bg-[var(--p-superficie-2)] px-4 text-[15px] text-[var(--p-texto)] outline-none transition placeholder:text-[var(--p-texto-3)] focus:border-[var(--p-acento)] focus:ring-2 focus:ring-[var(--p-acento)]/25 ${props.className ?? ""}`}
    />
  );
}

/** O número que importa. Grande, tabular, com o rótulo pequeno em cima. */
export function Indicador({
  rotulo,
  valor,
  variacao,
  sufixo,
}: {
  rotulo: string;
  valor: string;
  variacao?: number;
  sufixo?: string;
}) {
  return (
    <div className="placa-p rounded-[16px] p-4">
      <p className="rotulo-p">{rotulo}</p>
      <p className="num-tab mt-2 flex items-baseline gap-1 font-display text-[26px] font-bold leading-none tracking-[-0.03em]">
        {valor}
        {sufixo && <span className="text-[13px] font-medium text-[var(--p-texto-3)]">{sufixo}</span>}
      </p>
      {variacao !== undefined && (
        <p
          className={`num-tab mt-2 text-[12px] font-semibold ${
            variacao >= 0 ? "text-[var(--p-ok)]" : "text-[var(--p-erro)]"
          }`}
        >
          {variacao >= 0 ? "▲" : "▼"} {Math.abs(variacao).toFixed(0)}%
          <span className="ml-1 font-medium text-[var(--p-texto-3)]">vs. semana passada</span>
        </p>
      )}
    </div>
  );
}

/**
 * Gráfico de barras minúsculo.
 *
 * Sem eixo, sem grade, sem legenda: num painel de celular o que a pessoa lê
 * é a forma, não o valor exato. O valor exato está no indicador em cima.
 */
export function Barrinhas({ valores, rotulos }: { valores: number[]; rotulos?: string[] }) {
  const max = Math.max(...valores, 1);
  return (
    <div className="flex h-24 items-end gap-1.5">
      {valores.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-[4px] transition-[height] duration-500"
            style={{
              height: `${Math.max(4, (v / max) * 76)}px`,
              background:
                i === valores.length - 1
                  ? "linear-gradient(180deg,var(--p-acento-claro),var(--p-acento))"
                  : "var(--p-superficie-3)",
            }}
          />
          {rotulos && <span className="text-[9.5px] font-medium text-[var(--p-texto-3)]">{rotulos[i]}</span>}
        </div>
      ))}
    </div>
  );
}

export function Etiqueta({ children, tom = "neutro" }: { children: ReactNode; tom?: "neutro" | "ok" | "atencao" | "acento" | "erro" }) {
  const tons: Record<string, string> = {
    neutro: "bg-[var(--p-superficie-3)] text-[var(--p-texto-2)]",
    ok: "bg-[var(--p-ok)]/12 text-[var(--p-ok)]",
    atencao: "bg-[var(--p-atencao)]/12 text-[var(--p-atencao)]",
    acento: "bg-[var(--p-acento-fundo)] text-[var(--p-acento-claro)]",
    erro: "bg-[var(--p-erro)]/12 text-[var(--p-erro)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${tons[tom]}`}>
      {children}
    </span>
  );
}

/** O que aparece onde ainda não tem nada — sem parecer erro. */
export function Vazio({ icone: Icone, titulo, texto, acao }: { icone: React.ComponentType<{ size?: number; strokeWidth?: number }>; titulo: string; texto: string; acao?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--p-superficie-2)] text-[var(--p-texto-3)]">
        <Icone size={24} strokeWidth={1.5} />
      </span>
      <p className="mt-4 font-display text-[16px] font-bold tracking-[-0.02em]">{titulo}</p>
      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-[var(--p-texto-3)]">{texto}</p>
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  );
}

/** Cabeçalho de seção: rótulo pequeno + ação à direita. */
export function Secao({ titulo, acao, children }: { titulo: string; acao?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="rotulo-p">{titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}
