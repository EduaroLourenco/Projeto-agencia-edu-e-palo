import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, CreditCard, Loader2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { PLANOS, criarConta, entrar, type Plano } from "./sessao";
import { BotaoP, CampoP, EntradaP } from "../app/Pecas";

/**
 * A porta de entrada.
 *
 * Duas telas: entrar e criar conta. A de criar tem quatro passos, e a
 * barra de progresso existe porque formulário longo sem fim à vista é o
 * lugar onde mais gente desiste.
 *
 * O pagamento é encenado de propósito — o gateway entra depois. O que esta
 * tela prova hoje é o CAMINHO: dados, plano, pagamento, dentro.
 */

/** A marca, no tamanho que ela aparece nas telas de fora. */
function Marca({ grande = false }: { grande?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="flex items-center justify-center rounded-[10px] text-white shadow-[0_4px_16px_-4px_rgba(123,92,255,.7)]"
        style={{
          width: grande ? 38 : 30,
          height: grande ? 38 : 30,
          background: "linear-gradient(150deg,var(--p-acento-claro),var(--p-acento))",
        }}
      >
        <Sparkles size={grande ? 19 : 15} strokeWidth={2.4} />
      </span>
      <span
        className={`font-display font-bold tracking-[-0.03em] ${grande ? "text-[20px]" : "text-[16px]"}`}
      >
        Zap Commerce
      </span>
    </span>
  );
}

/**
 * O fundo das telas de fora.
 *
 * Duas manchas de luz muito grandes e muito fracas, quase invisíveis. É o
 * que dá profundidade sem virar papel de parede — o erro mais comum quando
 * se tenta fazer tela escura parecer cara.
 */
function Atmosfera() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute -left-[30%] -top-[20%] h-[70vh] w-[90vw] rounded-full opacity-[0.22] blur-[90px]"
        style={{ background: "radial-gradient(circle, #7b5cff 0%, transparent 65%)" }}
      />
      <div
        className="absolute -bottom-[25%] -right-[25%] h-[60vh] w-[80vw] rounded-full opacity-[0.16] blur-[90px]"
        style={{ background: "radial-gradient(circle, #2f6bff 0%, transparent 65%)" }}
      />
    </div>
  );
}

/* ============================================================
   ENTRAR
   ============================================================ */

export function Entrar() {
  const navegar = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [indo, setIndo] = useState(false);

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setIndo(true);
    const r = entrar(email, senha);
    if (r.ok) navegar("/app");
    else {
      setErro(r.erro);
      setIndo(false);
    }
  }

  return (
    <div className="painel relative flex min-h-dvh flex-col">
      <Atmosfera />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-14">
        <Marca grande />

        <div className="anima-entrar mt-12">
          <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.035em]">
            Entrar
          </h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--p-texto-2)]">
            Sua loja, seus pedidos e o estúdio — tudo do lado de dentro.
          </p>
        </div>

        <form onSubmit={enviar} className="anima-entrar mt-8 flex flex-col gap-4" style={{ animationDelay: "60ms" }}>
          <CampoP rotulo="E-mail">
            {(p) => (
              <EntradaP
                {...p}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
              />
            )}
          </CampoP>

          <CampoP rotulo="Senha" erro={erro ?? undefined}>
            {(p) => (
              <EntradaP
                {...p}
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••"
              />
            )}
          </CampoP>

          <BotaoP largo type="submit" disabled={indo || !email || !senha} className="mt-1">
            {indo ? <Loader2 size={17} className="animate-spin" /> : <Lock size={16} />}
            Entrar
          </BotaoP>
        </form>

        {/* Conta de teste à mão: ninguém decora e-mail de demonstração. */}
        <button
          onClick={() => {
            setEmail("demo@zap.com");
            setSenha("123456");
          }}
          className="anima-entrar mt-4 rounded-[13px] border border-dashed border-[var(--p-borda-forte)] px-4 py-3 text-left transition hover:bg-[var(--p-superficie-2)]"
          style={{ animationDelay: "120ms" }}
        >
          <p className="text-[12.5px] font-semibold text-[var(--p-texto-2)]">Testar sem cadastrar</p>
          <p className="num-tab mt-0.5 text-[12px] text-[var(--p-texto-3)]">
            demo@zap.com · senha 123456 — toque pra preencher
          </p>
        </button>

        <p className="mt-auto pt-10 text-center text-[13.5px] text-[var(--p-texto-3)]">
          Ainda não tem conta?{" "}
          <Link to="/criar-conta" className="font-semibold text-[var(--p-acento-claro)]">
            Criar agora
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   CRIAR CONTA — quatro passos
   ============================================================ */

const PASSOS = ["Seus dados", "Plano", "Pagamento", "Pronto"];

export function CriarConta() {
  const navegar = useNavigate();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState("");
  const [negocio, setNegocio] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [plano, setPlano] = useState<Plano>("profissional");
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const escolhido = PLANOS.find((p) => p.id === plano)!;
  const dadosOk = nome.trim().length >= 2 && /.+@.+\..+/.test(email) && senha.length >= 6;

  /** O pagamento encenado. O gateway entra aqui depois, e só aqui. */
  function pagar() {
    setErro(null);
    setProcessando(true);
    window.setTimeout(() => {
      const r = criarConta({ nome: nome.trim(), email, senha, telefone, negocio, plano });
      setProcessando(false);
      if (r.ok) setPasso(3);
      else setErro(r.erro);
    }, 1600);
  }

  return (
    <div className="painel relative flex min-h-dvh flex-col">
      <Atmosfera />
      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-10 pt-8">
        <div className="flex items-center gap-3">
          {passo > 0 && passo < 3 ? (
            <button
              onClick={() => setPasso((p) => p - 1)}
              aria-label="Voltar"
              className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--p-texto-2)] hover:bg-[var(--p-superficie-2)]"
            >
              <ArrowLeft size={19} />
            </button>
          ) : (
            <Link
              to="/entrar"
              aria-label="Voltar"
              className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-[var(--p-texto-2)] hover:bg-[var(--p-superficie-2)]"
            >
              <ArrowLeft size={19} />
            </Link>
          )}
          <Marca />
        </div>

        {/* Progresso: quatro traços. Diz onde está e quanto falta sem ocupar
            uma linha de texto. */}
        <div className="mt-7 flex gap-1.5">
          {PASSOS.map((nomePasso, i) => (
            <div key={nomePasso} className="flex-1">
              <div
                className="h-[3px] rounded-full transition-colors duration-300"
                style={{ background: i <= passo ? "var(--p-acento)" : "var(--p-superficie-3)" }}
              />
              <p
                className={`mt-2 text-[10.5px] font-semibold transition-colors ${
                  i === passo ? "text-[var(--p-texto)]" : "text-[var(--p-texto-3)]"
                }`}
              >
                {nomePasso}
              </p>
            </div>
          ))}
        </div>

        <div key={passo} className="anima-entrar mt-8 flex flex-1 flex-col">
          {passo === 0 && (
            <>
              <h1 className="font-display text-[27px] font-bold leading-[1.12] tracking-[-0.034em]">
                Vamos abrir sua conta
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--p-texto-2)]">
                Leva um minuto. Depois você já cai no estúdio montando a loja.
              </p>

              <div className="mt-7 flex flex-col gap-4">
                <CampoP rotulo="Seu nome">
                  {(p) => <EntradaP {...p} autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria Silva" />}
                </CampoP>
                <CampoP rotulo="Nome do negócio" dica="Dá pra mudar depois.">
                  {(p) => <EntradaP {...p} value={negocio} onChange={(e) => setNegocio(e.target.value)} placeholder="Mercearia do Bairro" />}
                </CampoP>
                <CampoP rotulo="E-mail">
                  {(p) => <EntradaP {...p} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />}
                </CampoP>
                <CampoP rotulo="WhatsApp">
                  {(p) => <EntradaP {...p} type="tel" inputMode="numeric" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(16) 92009-3456" className="num-tab" />}
                </CampoP>
                <CampoP rotulo="Senha" dica="Pelo menos 6 caracteres.">
                  {(p) => <EntradaP {...p} type="password" autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="••••••" />}
                </CampoP>
              </div>

              <BotaoP largo disabled={!dadosOk} onClick={() => setPasso(1)} className="mt-7">
                Continuar
                <ArrowRight size={17} />
              </BotaoP>
            </>
          )}

          {passo === 1 && (
            <>
              <h1 className="font-display text-[27px] font-bold leading-[1.12] tracking-[-0.034em]">
                Escolha o plano
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--p-texto-2)]">
                Troca quando quiser, sem multa.
              </p>

              <div className="mt-7 flex flex-col gap-3">
                {PLANOS.map((pl) => {
                  const ativo = plano === pl.id;
                  return (
                    <button
                      key={pl.id}
                      onClick={() => setPlano(pl.id)}
                      aria-pressed={ativo}
                      className={`relative rounded-[18px] border p-4 text-left transition ${
                        ativo
                          ? "border-[var(--p-acento)] bg-[var(--p-acento-fundo)]"
                          : "border-[var(--p-borda)] bg-[var(--p-superficie)] hover:border-[var(--p-borda-forte)]"
                      }`}
                    >
                      {pl.destaque && (
                        <span className="absolute -top-2 right-4 rounded-full bg-[var(--p-acento)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Mais escolhido
                        </span>
                      )}
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-[17px] font-bold tracking-[-0.02em]">{pl.nome}</span>
                        <span className="num-tab shrink-0 font-display text-[19px] font-bold tracking-[-0.03em]">
                          R$ {pl.preco}
                          <span className="text-[12px] font-medium text-[var(--p-texto-3)]">/mês</span>
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] text-[var(--p-texto-2)]">{pl.chamada}</p>
                      <ul className="mt-3 flex flex-col gap-1.5">
                        {pl.inclui.map((i) => (
                          <li key={i} className="flex items-center gap-2 text-[12.5px] text-[var(--p-texto-2)]">
                            <Check size={13} className="shrink-0 text-[var(--p-acento-claro)]" strokeWidth={3} />
                            {i}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              <BotaoP largo onClick={() => setPasso(2)} className="mt-7">
                Continuar
                <ArrowRight size={17} />
              </BotaoP>
            </>
          )}

          {passo === 2 && (
            <>
              <h1 className="font-display text-[27px] font-bold leading-[1.12] tracking-[-0.034em]">
                Pagamento
              </h1>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--p-texto-2)]">
                {escolhido.nome} · R$ {escolhido.preco}/mês. Primeiros 14 dias sem cobrança.
              </p>

              {/* Encenação declarada. Esconder que é simulado seria pior do
                  que mostrar: quem testa precisa saber o que é real. */}
              <div className="mt-6 flex items-start gap-2.5 rounded-[13px] border border-[var(--p-atencao)]/25 bg-[var(--p-atencao)]/10 p-3.5">
                <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[var(--p-atencao)]" />
                <p className="text-[12.5px] leading-snug text-[var(--p-texto-2)]">
                  <strong className="font-semibold text-[var(--p-texto)]">Cobrança simulada.</strong> Nenhum
                  dado de cartão é enviado ou guardado. O gateway entra numa próxima etapa.
                </p>
              </div>

              <div className="mt-5 flex flex-col gap-4">
                <CampoP rotulo="Número do cartão">
                  {(p) => (
                    <div className="relative">
                      <EntradaP {...p} inputMode="numeric" defaultValue="4111 1111 1111 1111" className="num-tab pr-11" />
                      <CreditCard size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--p-texto-3)]" />
                    </div>
                  )}
                </CampoP>
                <div className="grid grid-cols-2 gap-3">
                  <CampoP rotulo="Validade">{(p) => <EntradaP {...p} defaultValue="12/30" className="num-tab" />}</CampoP>
                  <CampoP rotulo="CVV">{(p) => <EntradaP {...p} defaultValue="123" className="num-tab" />}</CampoP>
                </div>
                <CampoP rotulo="Nome no cartão">{(p) => <EntradaP {...p} defaultValue={nome} />}</CampoP>
              </div>

              {erro && <p className="mt-3 text-[12.5px] font-semibold text-[var(--p-erro)]">{erro}</p>}

              <BotaoP largo disabled={processando} onClick={pagar} className="mt-7">
                {processando ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Confirmando…
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Pagar e entrar
                  </>
                )}
              </BotaoP>
              <p className="mt-3 text-center text-[11.5px] text-[var(--p-texto-3)]">
                Você pode cancelar a qualquer momento nos 14 dias.
              </p>
            </>
          )}

          {passo === 3 && (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-full text-white"
                style={{ background: "linear-gradient(150deg,var(--p-acento-claro),var(--p-acento))" }}
              >
                <Check size={30} strokeWidth={3} />
              </span>
              <h1 className="mt-6 font-display text-[27px] font-bold leading-[1.12] tracking-[-0.034em]">
                Conta criada
              </h1>
              <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-[var(--p-texto-2)]">
                Bem-vindo, {nome.split(" ")[0]}. Agora é escolher um modelo e montar a sua loja.
              </p>
              <BotaoP largo onClick={() => navegar("/app")} className="mt-8">
                Entrar na plataforma
                <ArrowRight size={17} />
              </BotaoP>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
