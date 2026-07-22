import { useState } from "react";
import type { Produto } from "../../types";
import { BottomSheet } from "../../components/BottomSheet";
import { enviarImagem, resolveImageUrl } from "../../lib/api";

const CATEGORIAS_SUGERIDAS = ["Novidades", "Jeans", "Blusas", "Saias", "Vestidos"];

export function ProductForm({
  aberto,
  onFechar,
  produto,
  token,
  salvando,
  onSalvar,
}: {
  aberto: boolean;
  onFechar: () => void;
  produto: Produto | null;
  token: string;
  salvando: boolean;
  onSalvar: (dados: Omit<Produto, "id" | "tenantId" | "criadoEm">) => void;
}) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [precoVarejo, setPrecoVarejo] = useState(produto?.precoVarejo?.toString() ?? "");
  const [precoAtacado, setPrecoAtacado] = useState(produto?.precoAtacado?.toString() ?? "");
  const [categorias, setCategorias] = useState<string[]>(produto?.categorias ?? []);
  const [tamanhos, setTamanhos] = useState(produto?.tamanhosDisponiveis.join(", ") ?? "P, M, G");
  const [imageUrl, setImageUrl] = useState(produto?.imageUrl ?? "");
  const [reelsUrl, setReelsUrl] = useState(produto?.instagramReelsUrl ?? "");
  const [ultimasPecas, setUltimasPecas] = useState(produto?.isUltimasPecas ?? false);
  const [ativo, setAtivo] = useState(produto?.isAtivo ?? true);
  const [enviandoImagem, setEnviandoImagem] = useState(false);
  const [erroImagem, setErroImagem] = useState("");

  function toggleCategoria(cat: string) {
    setCategorias((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  }

  async function handleImagem(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setEnviandoImagem(true);
    setErroImagem("");
    try {
      const url = await enviarImagem(token, file);
      setImageUrl(url);
    } catch {
      setErroImagem("Não foi possível enviar a foto. Tente outra imagem.");
    } finally {
      setEnviandoImagem(false);
    }
  }

  const valido =
    nome.trim().length > 1 &&
    Number(precoVarejo) > 0 &&
    Number(precoAtacado) > 0 &&
    tamanhos.trim().length > 0 &&
    imageUrl.length > 0 &&
    !enviandoImagem;

  function handleSalvar() {
    if (!valido) return;
    onSalvar({
      nome: nome.trim(),
      precoVarejo: Number(precoVarejo),
      precoAtacado: Number(precoAtacado),
      categorias,
      tamanhosDisponiveis: tamanhos.split(",").map((t) => t.trim()).filter(Boolean),
      imageUrl,
      instagramReelsUrl: reelsUrl.trim() || undefined,
      isUltimasPecas: ultimasPecas,
      isAtivo: ativo,
    });
  }

  return (
    <BottomSheet aberto={aberto} onFechar={onFechar} titulo={produto ? "Editar Peça" : "Nova Peça"}>
      <div className="flex flex-col gap-4 px-5 py-4">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink/40">
            Foto da peça
          </label>
          <label className="flex aspect-square w-28 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-black/15 bg-black/5 text-center text-xs text-ink/40">
            {imageUrl ? (
              <img src={resolveImageUrl(imageUrl)} alt="" className="h-full w-full object-cover" />
            ) : enviandoImagem ? (
              "Enviando..."
            ) : (
              "📷 Tirar Foto / Galeria"
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImagem} />
          </label>
          {erroImagem && <p className="mt-1 text-[11px] text-brand-600">{erroImagem}</p>}
          <p className="mt-1 text-[11px] text-ink/35">
            Foto de até 2MB — fica salva direto no banco de dados. Pra fotos maiores e otimização
            automática, o próximo passo é conectar a Cloudinary.
          </p>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink/50">
          Nome da peça
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Cropped Linho Premium"
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm font-normal text-ink"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink/50">
            Preço Varejo (R$)
            <input
              value={precoVarejo}
              onChange={(e) => setPrecoVarejo(e.target.value)}
              inputMode="decimal"
              placeholder="49.90"
              className="rounded-xl border border-black/10 px-3.5 py-3 text-sm font-normal text-ink"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink/50">
            Preço Atacado (R$)
            <input
              value={precoAtacado}
              onChange={(e) => setPrecoAtacado(e.target.value)}
              inputMode="decimal"
              placeholder="39.90"
              className="rounded-xl border border-black/10 px-3.5 py-3 text-sm font-normal text-ink"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink/50">
          Tamanhos disponíveis (separados por vírgula)
          <input
            value={tamanhos}
            onChange={(e) => setTamanhos(e.target.value)}
            placeholder="P, M, G"
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm font-normal text-ink"
          />
        </label>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-ink/50">Categorias</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIAS_SUGERIDAS.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategoria(cat)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                  categorias.includes(cat)
                    ? "border-ink bg-ink text-white"
                    : "border-black/10 text-ink/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-xs font-semibold text-ink/50">
          Link do Reels/TikTok (opcional)
          <input
            value={reelsUrl}
            onChange={(e) => setReelsUrl(e.target.value)}
            placeholder="instagram.com/reel/..."
            className="rounded-xl border border-black/10 px-3.5 py-3 text-sm font-normal text-ink"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-sm font-medium">
          Ativar gatilho "Últimas Peças" ⚠️
          <input
            type="checkbox"
            checked={ultimasPecas}
            onChange={(e) => setUltimasPecas(e.target.checked)}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between rounded-xl border border-black/10 px-3.5 py-3 text-sm font-medium">
          Peça visível na vitrine
          <input
            type="checkbox"
            checked={ativo}
            onChange={(e) => setAtivo(e.target.checked)}
            className="h-5 w-5"
          />
        </label>

        <button
          disabled={!valido || salvando}
          onClick={handleSalvar}
          className="mb-2 rounded-xl bg-brand-500 py-3.5 text-sm font-bold text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </BottomSheet>
  );
}
