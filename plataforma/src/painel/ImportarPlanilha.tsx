import { useMemo, useState } from "react";
import { ArrowLeft, Check, FileSpreadsheet, TriangleAlert, Upload } from "lucide-react";
import type { Loja, Oferta } from "../nucleo/tipos";
import { Botao, Sobrescrito } from "../design/Primitivos";
import { formatarReal } from "../nucleo/preco";
import {
  interpretar,
  lerCSV,
  lerVariacoes,
  mapearColunas,
  modeloDeProdutos,
  type LinhaLida,
} from "../nucleo/planilha";

/**
 * IMPORTAR PLANILHA
 *
 * O caminho de quem já tem catálogo. A regra que organiza esta tela: o
 * lojista vê o que VAI entrar antes de entrar. Importação que grava direto e
 * avisa depois é a que gera 200 produtos errados e nenhuma vontade de tentar
 * de novo.
 *
 * Linha com problema não derruba o arquivo — ela fica de fora, nomeada, e o
 * resto entra.
 */

export function ImportarPlanilha({
  loja,
  onMudar,
  onVoltar,
}: {
  loja: Loja;
  onMudar: (loja: Loja) => void;
  onVoltar: () => void;
}) {
  const [linhas, setLinhas] = useState<LinhaLida[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [arquivo, setArquivo] = useState<string>("");
  const [pronto, setPronto] = useState(0);

  const boas = useMemo(() => (linhas ?? []).filter((l) => !l.problema), [linhas]);
  const ruins = useMemo(() => (linhas ?? []).filter((l) => l.problema), [linhas]);

  async function ler(f: File | undefined) {
    if (!f) return;
    setErro(null);
    setArquivo(f.name);
    try {
      const texto = await f.text();
      const cru = lerCSV(texto);
      if (cru.length < 2) {
        setErro("O arquivo parece vazio, ou tem só o cabeçalho.");
        setLinhas(null);
        return;
      }
      const mapa = mapearColunas(cru[0]);
      if (mapa.nome === undefined) {
        setErro(
          'Não achei a coluna do nome. A primeira linha precisa ter os títulos — "Nome", "Produto" ou "Item".',
        );
        setLinhas(null);
        return;
      }
      setLinhas(interpretar(cru.slice(1), mapa));
    } catch {
      setErro("Não consegui abrir este arquivo. Salve como CSV e tente de novo.");
      setLinhas(null);
    }
  }

  function importar() {
    const agora = Date.now();
    const novos: Oferta[] = boas.map((l, i) => {
      const eixos = lerVariacoes(l.variacoes);
      return {
        id: `imp-${agora.toString(36)}-${i}`,
        tipo: "produto",
        nome: l.nome,
        resumo: l.resumo,
        descricao: "",
        midia: [],
        categorias: l.categoria ? [l.categoria] : [],
        precoBase: l.preco,
        ativa: true,
        destaque: false,
        dadosModulo: eixos.length ? { variantes: { eixos } } : {},
      };
    });
    onMudar({ ...loja, ofertas: [...novos, ...loja.ofertas] });
    setPronto(novos.length);
    setLinhas(null);
  }

  /* ---------- acabou ---------- */
  if (pronto > 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center bg-ok-fraco text-ok" style={{ borderRadius: "999px" }}>
          <Check size={26} strokeWidth={2.6} />
        </span>
        <div>
          <p className="font-display text-[18px] font-bold tracking-[-0.02em]">
            {pronto} {pronto === 1 ? "item entrou" : "itens entraram"}
          </p>
          <p className="mx-auto mt-1.5 max-w-xs text-[13px] leading-relaxed text-tinta-45">
            Eles entraram sem foto e ligados. Abra os que quiser e coloque a imagem — é o que
            mais muda a venda.
          </p>
        </div>
        <Botao onClick={onVoltar}>Ver o catálogo</Botao>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-2">
        <button
          onClick={onVoltar}
          aria-label="Voltar"
          className="-ml-2 flex h-10 w-10 items-center justify-center text-tinta-70"
        >
          <ArrowLeft size={19} />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-[19px] font-bold tracking-[-0.02em]">Importar planilha</h2>
          <p className="text-[12.5px] text-tinta-45">Para cadastrar muitos itens de uma vez.</p>
        </div>
      </header>

      {/* ---------- escolher arquivo ---------- */}
      {!linhas && (
        <>
          <label
            className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-borda-forte px-5 text-center text-[13.5px] font-semibold text-tinta-70"
            style={{ borderRadius: "var(--canto-m)" }}
          >
            <Upload size={22} />
            Escolher arquivo
            <span className="text-[12px] font-medium text-tinta-45">
              Salve a sua planilha como CSV e mande aqui
            </span>
            <input
              type="file"
              accept=".csv,text/csv,text/plain"
              className="sr-only"
              onChange={(e) => ler(e.target.files?.[0])}
            />
          </label>

          {erro && (
            <p className="flex items-start gap-2 bg-erro-fraco p-3 text-[13px] leading-snug text-erro"
               style={{ borderRadius: "var(--canto-p)" }}>
              <TriangleAlert size={16} className="mt-0.5 shrink-0" />
              {erro}
            </p>
          )}

          <div className="border border-borda p-4" style={{ borderRadius: "var(--canto-m)" }}>
            <Sobrescrito>Como a planilha precisa estar</Sobrescrito>
            <p className="mt-2 text-[13px] leading-relaxed text-tinta-70">
              A primeira linha tem os títulos das colunas. Eu entendo{" "}
              <b>Nome</b>, <b>Preço</b>, <b>Categoria</b>, <b>Resumo</b>, <b>Código</b>,{" "}
              <b>Variações</b> e <b>Estoque</b> — e também os sinônimos mais comuns, como
              "Produto", "Valor" e "SKU". Só Nome e Preço são obrigatórios.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-tinta-70">
              Em <b>Variações</b>, separe os valores por vírgula e os tipos por barra vertical:
              <br />
              <code className="num-tab mt-1 inline-block bg-papel-3 px-2 py-1 text-[12px]">
                P, M, G | Branco, Preto
              </code>
            </p>
            <BaixarModelo />
          </div>
        </>
      )}

      {/* ---------- conferir antes de entrar ---------- */}
      {linhas && (
        <>
          <div className="flex items-center gap-2 text-[13px] text-tinta-70">
            <FileSpreadsheet size={16} className="shrink-0 text-tinta-45" />
            <span className="min-w-0 flex-1 truncate">{arquivo}</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-ok-fraco p-3" style={{ borderRadius: "var(--canto-p)" }}>
              <p className="num-tab font-display text-[22px] font-bold leading-none text-ok">{boas.length}</p>
              <p className="mt-1 text-[12px] font-semibold text-ok">vão entrar</p>
            </div>
            <div
              className={ruins.length ? "bg-atencao-fraco p-3" : "bg-papel-3 p-3"}
              style={{ borderRadius: "var(--canto-p)" }}
            >
              <p className={`num-tab font-display text-[22px] font-bold leading-none ${ruins.length ? "text-atencao" : "text-tinta-25"}`}>
                {ruins.length}
              </p>
              <p className={`mt-1 text-[12px] font-semibold ${ruins.length ? "text-atencao" : "text-tinta-45"}`}>
                ficam de fora
              </p>
            </div>
          </div>

          {ruins.length > 0 && (
            <div className="border border-borda p-3.5" style={{ borderRadius: "var(--canto-m)" }}>
              <Sobrescrito>Por que ficam de fora</Sobrescrito>
              <ul className="mt-2 flex flex-col gap-1.5">
                {ruins.slice(0, 6).map((l, i) => (
                  <li key={i} className="text-[12.5px] leading-snug text-tinta-70">
                    <b className="text-tinta">{l.nome || "(linha sem nome)"}</b> — {l.problema}
                  </li>
                ))}
                {ruins.length > 6 && (
                  <li className="text-[12.5px] text-tinta-45">e mais {ruins.length - 6}…</li>
                )}
              </ul>
              <p className="mt-2.5 text-[12px] leading-relaxed text-tinta-45">
                O resto entra normalmente. Corrija estas na planilha e importe de novo só elas.
              </p>
            </div>
          )}

          {boas.length > 0 && (
            <div>
              <Sobrescrito>Prévia · primeiros {Math.min(5, boas.length)}</Sobrescrito>
              <div className="mt-2 divide-y divide-borda border border-borda" style={{ borderRadius: "var(--canto-m)" }}>
                {boas.slice(0, 5).map((l, i) => {
                  const eixos = lerVariacoes(l.variacoes);
                  return (
                    <div key={i} className="flex items-start gap-3 p-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold">{l.nome}</span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-tinta-45">
                          {[l.categoria, ...eixos.map((e) => `${e.nome}: ${e.valores.join("/")}`)]
                            .filter(Boolean)
                            .join(" · ") || "sem categoria"}
                        </span>
                      </span>
                      <span className="num-tab shrink-0 text-[13px] font-bold">{formatarReal(l.preco)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Botao tom="contorno" onClick={() => setLinhas(null)}>
              Trocar arquivo
            </Botao>
            <div className="flex-1">
              <Botao largo disabled={boas.length === 0} onClick={importar}>
                Importar {boas.length} {boas.length === 1 ? "item" : "itens"}
              </Botao>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * O modelo pronto.
 *
 * Não é link de download: no navegador dentro do aplicativo o download é
 * bloqueado e o botão só não faz nada. Copiar pra área de transferência
 * funciona em todo lugar — a pessoa cola no Excel e já tem as colunas.
 */
function BaixarModelo() {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(modeloDeProdutos().replace(/^﻿/, ""));
        setCopiado(true);
        window.setTimeout(() => setCopiado(false), 2000);
      }}
      className="mt-3 flex min-h-[40px] w-full items-center justify-center gap-1.5 border border-borda-forte text-[12.5px] font-semibold text-tinta-70"
      style={{ borderRadius: "var(--canto-p)" }}
    >
      {copiado ? <Check size={15} /> : <FileSpreadsheet size={15} />}
      {copiado ? "Copiado — cole no Excel" : "Copiar um modelo pronto"}
    </button>
  );
}
