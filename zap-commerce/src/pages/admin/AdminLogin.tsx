import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { LojaConfig } from "../../types";
import { ApiError, buscarLoja, login, registrar } from "../../lib/api";
import { setToken } from "../../lib/auth";

export function AdminLogin({ onAutenticar }: { onAutenticar: (loja: LojaConfig) => void }) {
  const { slug = "" } = useParams();
  const navigate = useNavigate();

  const [lojaExistente, setLojaExistente] = useState<LojaConfig | null | undefined>(undefined);

  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [nomeLoja, setNomeLoja] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  useEffect(() => {
    buscarLoja(slug).then(setLojaExistente);
  }, [slug]);

  async function handleEntrar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const { token, loja } = await login(slug, senha);
      setToken(slug, token);
      onAutenticar(loja);
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (!nomeLoja.trim() || !whatsapp.trim() || !novaSenha.trim()) return;
    setErro("");
    setCarregando(true);
    try {
      const { token, loja } = await registrar({
        slug,
        nomeLoja: nomeLoja.trim(),
        whatsappNumero: whatsapp,
        senha: novaSenha,
      });
      setToken(slug, token);
      onAutenticar(loja);
      navigate(`/${slug}/admin`, { replace: true });
    } catch (e) {
      setErro(e instanceof ApiError ? e.message : "Não foi possível criar a loja. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6 py-10">
      <div>
        <Link to="/" className="text-xs font-semibold text-brand-600">
          ← ZAP-COMMERCE
        </Link>
        <h1 className="mt-2 font-display text-2xl font-bold">
          {lojaExistente ? `Entrar · ${lojaExistente.nomeLoja}` : `Criar loja "${slug}"`}
        </h1>
        <p className="mt-1 text-sm text-ink/50">
          {lojaExistente === undefined
            ? "Verificando..."
            : lojaExistente
              ? "Digite a senha do painel para gerenciar produtos e configurações."
              : "Essa URL ainda não tem loja. Preencha os dados para criar em segundos."}
        </p>
      </div>

      {lojaExistente ? (
        <form onSubmit={handleEntrar} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Senha do painel"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
            autoFocus
          />
          {erro && <p className="text-xs font-medium text-brand-600">{erro}</p>}
          <button
            disabled={carregando}
            className="rounded-xl bg-ink py-3.5 text-sm font-bold text-white active:scale-95 transition-transform disabled:opacity-50"
          >
            {carregando ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      ) : lojaExistente === null ? (
        <form onSubmit={handleCriar} className="flex flex-col gap-3">
          <input
            placeholder="Nome da loja"
            value={nomeLoja}
            onChange={(e) => setNomeLoja(e.target.value)}
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
          />
          <input
            placeholder="WhatsApp com DDD (ex: 62999998888)"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            inputMode="numeric"
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
          />
          <input
            type="password"
            placeholder="Crie uma senha para o painel"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm"
          />
          {erro && <p className="text-xs font-medium text-brand-600">{erro}</p>}
          <button
            disabled={carregando}
            className="rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white active:scale-95 transition-transform disabled:opacity-50"
          >
            {carregando ? "Criando..." : "Criar minha loja grátis"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
