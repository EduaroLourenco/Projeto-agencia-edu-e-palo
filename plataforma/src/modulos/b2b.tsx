import { Building2, TrendingUp } from "lucide-react";
import type {
  AvisoSacola,
  DefinicaoBloco,
  Modulo,
  Oferta,
  PropsBloco,
  RegraPreco,
} from "../nucleo/tipos";
import { formatarReal } from "../nucleo/preco";
import { Campo, Entrada, Selecao, Sobrescrito } from "../design/Primitivos";
import { useVitrine } from "../vitrine/contexto";
import { VazioNoEstudio } from "../blocos/pecas";

/**
 * MÓDULO B2B — o diferencial de venda.
 *
 * Traz o que o v1 não tinha: comprador identificado, tabela de preço por
 * cliente, faixa de quantidade, mínimo por item e múltiplo de caixa. E,
 * principalmente, traz a validação que impede o pedido errado de sair —
 * 33% dos pedidos B2B online saem com erro e é isso que faz o comprador
 * voltar pro telefone.
 */

export interface Faixa {
  /** A partir de quantas unidades no pedido. */
  min: number;
  /** Percentual de desconto sobre o preço-base. */
  desconto: number;
}

export interface TabelaPreco {
  id: string;
  nome: string;
  desconto: number;
}

export interface ConfigB2B {
  pedidoMinimo?: number;
  exigirIdentificacao?: boolean;
  faixas?: Faixa[];
  tabelas?: TabelaPreco[];
}

export interface DadosB2BdaOferta {
  /** Não vende menos que isso. */
  minimo?: number;
  /** Só vende de N em N (caixa fechada). */
  multiplo?: number;
  unidadeCaixa?: string;
}

function config(loja: { config: Record<string, unknown> }): ConfigB2B {
  return (loja.config.b2b as ConfigB2B) ?? {};
}

function dadosDa(oferta: Oferta): DadosB2BdaOferta {
  return (oferta.dadosModulo.b2b as DadosB2BdaOferta) ?? {};
}

/** A faixa que o pedido alcançou, e a próxima que falta. */
export function faixaAtual(faixas: Faixa[], totalItens: number) {
  const ordenadas = [...faixas].sort((a, b) => a.min - b.min);
  let atual: Faixa | null = null;
  let proxima: Faixa | null = null;
  for (const f of ordenadas) {
    if (totalItens >= f.min) atual = f;
    else if (!proxima) proxima = f;
  }
  return { atual, proxima };
}

/* ---------- regras de preço ---------- */

const regraTabelaDoCliente: RegraPreco = {
  id: "tabela",
  ordem: 10,
  aplicar: (preco, ctx) => {
    const { tabelas } = config(ctx.loja);
    const tabela = tabelas?.find((t) => t.id === ctx.cliente?.tabelaId);
    if (!tabela || tabela.desconto <= 0) return null;
    return { preco: preco * (1 - tabela.desconto / 100), rotulo: tabela.nome };
  },
};

const regraFaixaDeQuantidade: RegraPreco = {
  id: "faixa",
  ordem: 20,
  aplicar: (preco, ctx) => {
    const { faixas } = config(ctx.loja);
    if (!faixas?.length) return null;
    const { atual } = faixaAtual(faixas, ctx.totalItens);
    if (!atual || atual.desconto <= 0) return null;
    return { preco: preco * (1 - atual.desconto / 100), rotulo: `A partir de ${atual.min} un` };
  },
};

/* ---------- bloco: barra da faixa de preço ---------- */

function BarraFaixaPreco({ props, loja, editando }: PropsBloco<{ titulo: string }>) {
  const { resumo } = useVitrine();
  const { faixas } = config(loja);

  if (!faixas?.length) {
    return editando ? (
      <VazioNoEstudio>Ligue as faixas de quantidade no recurso Atacado pra esta barra aparecer.</VazioNoEstudio>
    ) : null;
  }
  if (resumo.totalItens === 0) {
    return editando ? (
      <VazioNoEstudio>Aparece assim que o cliente põe o primeiro item na sacola.</VazioNoEstudio>
    ) : null;
  }

  const { atual, proxima } = faixaAtual(faixas, resumo.totalItens);
  const teto = proxima?.min ?? atual?.min ?? 1;
  const progresso = Math.min(100, (resumo.totalItens / teto) * 100);

  return (
    <div className="placa p-4" style={{ borderRadius: "var(--canto-g)" }}>
      <div className="flex items-center justify-between gap-3">
        <Sobrescrito>{props.titulo || "Sua faixa de preço"}</Sobrescrito>
        {atual && (
          <span className="num-tab bg-ok-fraco px-2 py-0.5 text-[11.5px] font-bold text-ok" style={{ borderRadius: "999px" }}>
            −{atual.desconto}% aplicado
          </span>
        )}
      </div>

      <div className="mt-3 h-[7px] w-full overflow-hidden bg-papel-3" style={{ borderRadius: "999px" }}>
        <div
          className="h-full bg-[var(--marca-grafico)] transition-[width] duration-500"
          style={{ width: `${progresso}%`, borderRadius: "999px" }}
        />
      </div>

      <p className="num-tab mt-2.5 text-[13px] text-tinta-70">
        {proxima ? (
          <>
            Faltam <strong className="font-bold text-tinta">{proxima.min - resumo.totalItens} unidades</strong> pra
            desbloquear <strong className="font-bold text-tinta">−{proxima.desconto}%</strong>
          </>
        ) : (
          <>Você já está no melhor preço da tabela.</>
        )}
      </p>
    </div>
  );
}

const blocoBarraFaixa: DefinicaoBloco<{ titulo: string }> = {
  tipo: "barra-faixa-preco",
  nome: "Barra de faixa de preço",
  descricao: "Mostra quanto falta pro próximo desconto.",
  paginas: ["inicio", "catalogo", "oferta", "sacola"],
  icone: TrendingUp,
  campos: {
    titulo: { tipo: "texto", rotulo: "Título", padrao: "Sua faixa de preço" },
  },
  Componente: BarraFaixaPreco,
};

/* ---------- passo do checkout: identificação ---------- */

const passoIdentificacao: Modulo["passos"] = [
  {
    id: "b2b-cliente",
    titulo: "Quem está comprando",
    subtitulo: "Pra aplicar sua tabela e emitir a nota certa.",
    ordem: 10,
    visivelQuando: ({ loja }) => Boolean(config(loja).exigirIdentificacao),
    validar: (dados) => {
      const erros = [];
      const nome = String(dados.nome ?? "").trim();
      const doc = String(dados.documento ?? "").replace(/\D/g, "");
      if (nome.length < 3) erros.push({ campo: "nome", mensagem: "Escreva o nome da empresa ou o seu." });
      if (doc && doc.length !== 11 && doc.length !== 14) {
        erros.push({ campo: "documento", mensagem: "CPF tem 11 dígitos e CNPJ tem 14." });
      }
      return erros;
    },
    Componente: ({ dados, definir, erros, loja }) => {
      const { tabelas } = config(loja);
      const erro = (campo: string) => erros.find((e) => e.campo === campo)?.mensagem;

      return (
        <div className="flex flex-col gap-4">
          <Campo rotulo="Empresa ou seu nome" erro={erro("nome")}>
            {(p) => (
              <Entrada
                {...p}
                value={String(dados.nome ?? "")}
                onChange={(e) => definir({ nome: e.target.value })}
                autoComplete="organization"
                placeholder="Mercado do Bairro Ltda"
              />
            )}
          </Campo>

          <Campo rotulo="CNPJ ou CPF" dica="Opcional. Ajuda na nota fiscal." erro={erro("documento")}>
            {(p) => (
              <Entrada
                {...p}
                value={String(dados.documento ?? "")}
                onChange={(e) => definir({ documento: e.target.value })}
                inputMode="numeric"
                placeholder="00.000.000/0001-00"
              />
            )}
          </Campo>

          {tabelas && tabelas.length > 0 && (
            <Campo rotulo="Sua tabela" dica="Se não souber, deixe na padrão que a gente confere.">
              {(p) => (
                <Selecao {...p} value={String(dados.tabelaId ?? "")} onChange={(e) => definir({ tabelaId: e.target.value })}>
                  <option value="">Tabela padrão</option>
                  {tabelas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome} {t.desconto > 0 ? `(−${t.desconto}%)` : ""}
                    </option>
                  ))}
                </Selecao>
              )}
            </Campo>
          )}
        </div>
      );
    },
    identificarCliente: (dados) => {
      const nome = String(dados.nome ?? "").trim();
      if (!nome) return null;
      return {
        id: "comprador",
        nome,
        documento: String(dados.documento ?? "") || undefined,
        tabelaId: String(dados.tabelaId ?? "") || undefined,
      };
    },

    paraMensagem: (dados, { loja }) => {
      const linhas: string[] = [];
      if (dados.nome) linhas.push(`Comprador: ${dados.nome}`);
      if (dados.documento) linhas.push(`Documento: ${dados.documento}`);
      const t = config(loja).tabelas?.find((x) => x.id === dados.tabelaId);
      if (t) linhas.push(`Tabela: ${t.nome}`);
      return linhas;
    },
  },
];

/* ---------- validação da sacola ---------- */

function validarSacola({ linhas, loja }: Parameters<NonNullable<Modulo["validarSacola"]>>[0]): AvisoSacola[] {
  const avisos: AvisoSacola[] = [];
  const cfg = config(loja);

  for (const l of linhas) {
    const d = dadosDa(l.oferta);
    const un = d.unidadeCaixa ?? "un";

    const abaixoDoMinimo = Boolean(d.minimo && l.linha.quantidade < d.minimo);

    if (abaixoDoMinimo) {
      avisos.push({
        nivel: "erro",
        mensagem: `${l.oferta.nome}: o mínimo é ${d.minimo} ${un}. Você colocou ${l.linha.quantidade}.`,
      });
    }

    // Só cobra o múltiplo depois que o mínimo estiver resolvido: com os dois
    // errados ao mesmo tempo, as duas mensagens mandam o mesmo ajuste.
    if (!abaixoDoMinimo && d.multiplo && d.multiplo > 1 && l.linha.quantidade % d.multiplo !== 0) {
      const acima = Math.ceil(l.linha.quantidade / d.multiplo) * d.multiplo;
      avisos.push({
        nivel: "erro",
        mensagem: `${l.oferta.nome}: vendido de ${d.multiplo} em ${d.multiplo} ${un}. Ajuste pra ${acima}.`,
      });
    }
  }

  const total = linhas.reduce((acc, l) => acc + l.subtotal, 0);
  if (cfg.pedidoMinimo && total > 0 && total < cfg.pedidoMinimo) {
    avisos.push({
      nivel: "erro",
      mensagem: `Pedido mínimo de ${formatarReal(cfg.pedidoMinimo)}. Faltam ${formatarReal(cfg.pedidoMinimo - total)}.`,
    });
  }

  // Dica, não erro: empurra pra próxima faixa sem travar o pedido.
  const totalItens = linhas.reduce((acc, l) => acc + l.linha.quantidade, 0);
  if (cfg.faixas?.length && totalItens > 0) {
    const { proxima } = faixaAtual(cfg.faixas, totalItens);
    if (proxima && proxima.min - totalItens <= 6) {
      avisos.push({
        nivel: "dica",
        mensagem: `Mais ${proxima.min - totalItens} un e o pedido inteiro cai ${proxima.desconto}%.`,
      });
    }
  }

  return avisos;
}

export const moduloB2B: Modulo = {
  id: "b2b",
  nome: "Atacado (B2B)",
  descricao: "Tabela por cliente, faixa de quantidade, mínimo e caixa fechada.",
  icone: Building2,
  camposDaOferta: {
    aplicaA: (tipo) => tipo === "produto",
    campos: {
      minimo: { tipo: "numero", rotulo: "Quantidade mínima", padrao: 0, min: 0, max: 999, sufixo: "unidades" },
      multiplo: { tipo: "numero", rotulo: "Vende de N em N", padrao: 0, min: 0, max: 999, sufixo: "caixa fechada" },
      unidadeCaixa: { tipo: "texto", rotulo: "Como chama a unidade", padrao: "un", dica: "un, pct, cx, fardo…" },
    },
  },

  regrasPreco: [regraTabelaDoCliente, regraFaixaDeQuantidade],
  blocos: [blocoBarraFaixa as unknown as DefinicaoBloco<never>],
  passos: passoIdentificacao,
  validarSacola,
};
