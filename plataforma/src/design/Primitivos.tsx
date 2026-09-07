import { useEffect, useId, useRef, type ReactNode } from "react";
import { Minus, Plus, X } from "lucide-react";

/* ============================================================
   FOLHA — sobe de baixo. É a caixa de diálogo do celular.
   ============================================================ */

export function Folha({
  aberta,
  onFechar,
  titulo,
  subtitulo,
  children,
  rodape,
  altura = "auto",
}: {
  aberta: boolean;
  onFechar: () => void;
  titulo?: string;
  subtitulo?: string;
  children: ReactNode;
  rodape?: ReactNode;
  altura?: "auto" | "quase-cheia";
}) {
  const fecharRef = useRef(onFechar);
  fecharRef.current = onFechar;

  useEffect(() => {
    if (!aberta) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharRef.current();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener("keydown", aoTeclar);
    };
  }, [aberta]);

  if (!aberta) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        aria-label="Fechar"
        onClick={onFechar}
        className="anima-surgir absolute inset-0 h-full w-full cursor-default bg-tinta/45"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className={`anima-subir relative mx-auto flex w-full max-w-lg flex-col bg-papel shadow-2xl ${
          altura === "quase-cheia" ? "h-[88dvh]" : "max-h-[88dvh]"
        }`}
        style={{ borderTopLeftRadius: "var(--canto-g)", borderTopRightRadius: "var(--canto-g)" }}
      >
        <div className="flex shrink-0 flex-col items-center pt-2.5">
          <span className="h-1 w-9 rounded-full bg-tinta-25" />
        </div>

        {titulo && (
          <div className="flex shrink-0 items-start gap-3 px-5 pb-3 pt-3">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-[17px] font-bold leading-tight tracking-tight">{titulo}</h2>
              {subtitulo && <p className="mt-0.5 text-[13px] text-tinta-45">{subtitulo}</p>}
            </div>
            <button
              onClick={onFechar}
              aria-label="Fechar"
              className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-tinta-45 hover:bg-papel-3 hover:text-tinta"
            >
              <X size={19} />
            </button>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5">{children}</div>

        {rodape && (
          <div
            className="shrink-0 border-t border-borda bg-papel px-5 pt-3"
            style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
          >
            {rodape}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   BOTÃO
   ============================================================ */

type TomBotao = "marca" | "contorno" | "fantasma" | "perigo";

export function Botao({
  children,
  tom = "marca",
  largo = false,
  pequeno = false,
  ...resto
}: {
  children: ReactNode;
  tom?: TomBotao;
  largo?: boolean;
  pequeno?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const tons: Record<TomBotao, string> = {
    marca: "text-[var(--sobre-marca)] bg-[var(--marca-500)] hover:brightness-95 disabled:bg-tinta-25 disabled:text-papel",
    contorno: "border border-borda-forte bg-papel text-tinta hover:bg-papel-2",
    fantasma: "text-tinta-70 hover:bg-papel-3 hover:text-tinta",
    perigo: "border border-erro/30 bg-erro-fraco text-erro hover:bg-erro/10",
  };
  return (
    <button
      {...resto}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed ${
        pequeno ? "min-h-[38px] px-3 text-[13px]" : "min-h-[48px] px-5 text-[15px]"
      } ${largo ? "w-full" : ""} ${tons[tom]} ${resto.className ?? ""}`}
      style={{ borderRadius: "var(--canto-m)", ...resto.style }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   STEPPER — o controle mais importante do B2B.
   Quem compra 48 unidades não pode tocar 48 vezes.
   ============================================================ */

export function Stepper({
  valor,
  onMudar,
  passo = 1,
  min = 0,
  max = 9999,
  compacto = false,
}: {
  valor: number;
  onMudar: (n: number) => void;
  passo?: number;
  min?: number;
  max?: number;
  compacto?: boolean;
}) {
  const limitar = (n: number) => Math.max(min, Math.min(max, n));
  const id = useId();

  return (
    <div
      className="inline-flex items-stretch border border-borda-forte bg-papel"
      style={{ borderRadius: "var(--canto-m)" }}
    >
      <button
        onClick={() => onMudar(limitar(valor - passo))}
        disabled={valor <= min}
        aria-label={`Diminuir ${passo}`}
        className={`flex items-center justify-center text-tinta-70 disabled:text-tinta-25 ${
          compacto ? "h-9 w-9" : "h-11 w-11"
        }`}
      >
        <Minus size={16} strokeWidth={2.5} />
      </button>

      <label htmlFor={id} className="sr-only">
        Quantidade
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        value={valor}
        min={min}
        max={max}
        onChange={(e) => onMudar(limitar(Number(e.target.value) || 0))}
        className={`num-tab border-x border-borda bg-transparent text-center font-semibold text-tinta [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
          compacto ? "w-12 text-[14px]" : "w-14 text-[15px]"
        }`}
      />

      <button
        onClick={() => onMudar(limitar(valor + passo))}
        disabled={valor >= max}
        aria-label={`Aumentar ${passo}`}
        className={`flex items-center justify-center text-tinta-70 disabled:text-tinta-25 ${
          compacto ? "h-9 w-9" : "h-11 w-11"
        }`}
      >
        <Plus size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ============================================================
   CHIP
   ============================================================ */

export function Chip({
  children,
  ativo = false,
  onClick,
  ...resto
}: { children: ReactNode; ativo?: boolean; onClick?: () => void } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      {...resto}
      className={`inline-flex min-h-[40px] shrink-0 items-center gap-1.5 whitespace-nowrap border px-3.5 text-[13.5px] font-semibold transition ${
        ativo
          ? "border-transparent bg-[var(--marca-500)] text-[var(--sobre-marca)]"
          : "border-borda bg-papel text-tinta-70 hover:border-borda-forte hover:text-tinta"
      } ${resto.className ?? ""}`}
      style={{ borderRadius: "999px", ...resto.style }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   CAMPO — rótulo visível sempre. Placeholder não é rótulo.
   ============================================================ */

export function Campo({
  rotulo,
  dica,
  erro,
  children,
}: {
  rotulo: string;
  dica?: string;
  erro?: string;
  children: (props: { id: string; "aria-invalid"?: boolean }) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-tinta-70">
        {rotulo}
      </label>
      {children({ id, "aria-invalid": erro ? true : undefined })}
      {erro ? (
        <p className="text-[12.5px] font-medium text-erro">{erro}</p>
      ) : dica ? (
        <p className="text-[12.5px] text-tinta-45">{dica}</p>
      ) : null}
    </div>
  );
}

export const estiloEntrada =
  "min-h-[48px] w-full border border-borda-forte bg-papel px-3.5 text-tinta placeholder:text-tinta-25 aria-[invalid=true]:border-erro";

export function Entrada(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${estiloEntrada} ${props.className ?? ""}`} style={{ borderRadius: "var(--canto-m)", ...props.style }} />;
}

export function Selecao(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`${estiloEntrada} appearance-none bg-[length:16px] bg-[right_0.9rem_center] bg-no-repeat pr-10 ${props.className ?? ""}`}
      style={{
        borderRadius: "var(--canto-m)",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237c7589' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        ...props.style,
      }}
    />
  );
}

/* ============================================================
   AVISO
   ============================================================ */

export function Aviso({
  nivel,
  children,
  acao,
}: {
  nivel: "erro" | "atencao" | "dica" | "ok";
  children: ReactNode;
  acao?: ReactNode;
}) {
  const tons = {
    erro: "bg-erro-fraco text-erro border-erro/20",
    atencao: "bg-atencao-fraco text-atencao border-atencao/20",
    dica: "bg-papel-3 text-tinta-70 border-borda",
    ok: "bg-ok-fraco text-ok border-ok/20",
  };
  return (
    <div
      className={`flex items-start gap-3 border px-3.5 py-3 text-[13px] font-medium ${tons[nivel]}`}
      style={{ borderRadius: "var(--canto-m)" }}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {acao}
    </div>
  );
}

/* ============================================================
   ESQUELETO — nunca um spinner girando sem dizer nada
   ============================================================ */

export function Esqueleto({ className = "" }: { className?: string }) {
  return <div className={`anima-pulsar bg-papel-3 ${className}`} style={{ borderRadius: "var(--canto-p)" }} />;
}

/* ============================================================
   RÓTULO DE SEÇÃO
   ============================================================ */

export function Sobrescrito({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-tinta-45">{children}</p>
  );
}
