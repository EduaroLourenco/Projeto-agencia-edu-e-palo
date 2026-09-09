import type { ComponentType, ReactNode } from "react";

/* ============================================================
   OFERTA — produto e serviço são a mesma coisa aqui.
   O que muda é quem preenche `dadosModulo` e quem lê `selecao`.
   ============================================================ */

export type TipoOferta = "produto" | "servico";

export interface Midia {
  url: string;
  alt: string;
  largura: number;
  altura: number;
}

export interface Oferta {
  id: string;
  tipo: TipoOferta;
  nome: string;
  resumo?: string;
  descricao?: string;
  midia: Midia[];
  categorias: string[];
  precoBase: number;
  ativa: boolean;
  destaque?: boolean;
  /** Cada módulo grava e lê o próprio pedaço. O núcleo nunca abre. */
  dadosModulo: Record<string, unknown>;
}

/* ============================================================
   SACOLA
   ============================================================ */

export interface LinhaSacola {
  /** Identidade da linha: mesma oferta com seleção diferente = linha diferente. */
  chave: string;
  ofertaId: string;
  quantidade: number;
  /** {tamanho:"M"} ou {inicio:"2026-09-10T14:00", profissionalId:"p1"} */
  selecao: Record<string, unknown>;
}

/* ============================================================
   PREÇO — uma cadeia de regras, não um campo
   ============================================================ */

export interface ContextoPreco {
  oferta: Oferta;
  linha: LinhaSacola;
  /** Somatório de todas as linhas, pra regras que olham o pedido inteiro. */
  totalItens: number;
  totalValor: number;
  loja: Loja;
  cliente?: ClienteIdentificado;
}

export interface EtapaPreco {
  /** Nome que aparece pro comprador quando o preço muda. */
  rotulo: string;
  de: number;
  para: number;
}

export interface RegraPreco {
  id: string;
  /** Menor roda primeiro. Tabela (10) → faixa (20) → campanha (30) → arredondar (90). */
  ordem: number;
  aplicar: (preco: number, ctx: ContextoPreco) => { preco: number; rotulo?: string } | null;
}

export interface PrecoResolvido {
  unitario: number;
  base: number;
  etapas: EtapaPreco[];
}

/* ============================================================
   CLIENTE (módulo b2b) — o núcleo só conhece o mínimo
   ============================================================ */

export interface ClienteIdentificado {
  id: string;
  nome: string;
  documento?: string;
  tabelaId?: string;
}

/* ============================================================
   BLOCO — um pedaço visual de uma página
   ============================================================ */

export type TipoPagina = "inicio" | "catalogo" | "oferta" | "sacola" | "confirmacao";

export type CampoBloco =
  | { tipo: "texto"; rotulo: string; padrao?: string; linhas?: number; dica?: string }
  | { tipo: "numero"; rotulo: string; padrao?: number; min?: number; max?: number; sufixo?: string }
  | { tipo: "simNao"; rotulo: string; padrao?: boolean; dica?: string }
  | { tipo: "escolha"; rotulo: string; opcoes: { valor: string; nome: string }[]; padrao?: string }
  | { tipo: "cor"; rotulo: string; padrao?: string }
  | { tipo: "imagem"; rotulo: string; padrao?: string; dica?: string }
  | { tipo: "lista"; rotulo: string; de: Record<string, CampoBloco>; max?: number; padrao?: unknown[] };

export interface PropsBloco<P = Record<string, unknown>> {
  props: P;
  loja: Loja;
  ofertas: Oferta[];
  /** Presente só na página de oferta. */
  oferta?: Oferta;
  /** True dentro do estúdio: bloco evita efeito que atrapalha a edição. */
  editando: boolean;
}

export interface DefinicaoBloco<P = Record<string, unknown>> {
  tipo: string;
  nome: string;
  descricao: string;
  /** Onde este bloco pode ser inserido. */
  paginas: TipoPagina[];
  /** Âncoras não podem ser removidas nem reordenadas pelo lojista. */
  ancora?: boolean;
  /** Só aparece no catálogo se o módulo estiver ligado. */
  exigeModulo?: string;
  campos: Record<string, CampoBloco>;
  /** Variações de layout, em vez de CSS solto. */
  variantes?: { valor: string; nome: string }[];
  icone: ComponentType<{ size?: number | string; strokeWidth?: number }>;
  Componente: ComponentType<PropsBloco<P>>;
}

export interface BlocoNaPagina {
  /** id único da instância, pra arrastar e editar. */
  id: string;
  tipo: string;
  props: Record<string, unknown>;
  oculto?: boolean;
  /** Fundo, respiro e moldura desta seção. Ver `EstiloBloco`. */
  estilo?: EstiloBloco;
}

/* ============================================================
   PÁGINA — âncoras fixas + espaços livres
   ============================================================ */

export interface DefinicaoPagina {
  tipo: TipoPagina;
  nome: string;
  descricao: string;
  /** Blocos obrigatórios, na ordem em que sempre aparecem. */
  ancoras: string[];
  /** Onde os blocos livres podem entrar, relativo às âncoras. */
  espacos: { id: string; nome: string; depoisDaAncora: string | null }[];
}

/* ============================================================
   CHECKOUT — uma esteira de passos que os módulos registram
   ============================================================ */

export interface DadosCheckout {
  [passoId: string]: Record<string, unknown>;
}

export interface ErroCheckout {
  campo?: string;
  mensagem: string;
}

export interface PropsPasso {
  dados: Record<string, unknown>;
  definir: (patch: Record<string, unknown>) => void;
  erros: ErroCheckout[];
  loja: Loja;
  linhas: LinhaResolvida[];
  cliente?: ClienteIdentificado;
}

export interface PassoCheckout {
  id: string;
  titulo: string;
  /** Uma frase do que se resolve aqui, mostrada abaixo do título. */
  subtitulo?: string;
  ordem: number;
  visivelQuando: (ctx: { linhas: LinhaResolvida[]; loja: Loja }) => boolean;
  validar: (dados: Record<string, unknown>, ctx: { loja: Loja; linhas: LinhaResolvida[] }) => ErroCheckout[];
  Componente: ComponentType<PropsPasso>;
  /** As linhas que este passo contribui pra mensagem do WhatsApp. */
  paraMensagem: (dados: Record<string, unknown>, ctx: { loja: Loja }) => string[];
  /**
   * Quando este passo identifica quem está comprando, devolve o cliente —
   * e a cadeia de preço recalcula na hora, com a tabela dele. Sem isto, a
   * pessoa escolhe a tabela e continua vendo o preço de tabelado padrão.
   */
  identificarCliente?: (dados: Record<string, unknown>) => ClienteIdentificado | null;
}

/* ============================================================
   MÓDULO — capacidade completa: dados, blocos, passos, telas
   ============================================================ */

export interface AvisoSacola {
  nivel: "erro" | "atencao" | "dica";
  mensagem: string;
  /** Quando presente, a sacola mostra um atalho pra resolver. */
  acao?: { rotulo: string; para: string };
}

export interface Modulo {
  id: string;
  nome: string;
  descricao: string;
  icone: ComponentType<{ size?: number | string; strokeWidth?: number }>;
  blocos?: DefinicaoBloco<never>[];
  passos?: PassoCheckout[];
  regrasPreco?: RegraPreco[];
  /** Roda antes do checkout: é aqui que os 33% de pedido com erro morrem. */
  validarSacola?: (ctx: { linhas: LinhaResolvida[]; loja: Loja }) => AvisoSacola[];
  /** O que o comprador precisa escolher pra adicionar esta oferta. */
  configurador?: {
    aplicaA: (oferta: Oferta) => boolean;
    Componente: ComponentType<{
      oferta: Oferta;
      selecao: Record<string, unknown>;
      definir: (patch: Record<string, unknown>) => void;
      loja: Loja;
    }>;
    /** Impede adicionar sem escolher. */
    completo: (oferta: Oferta, selecao: Record<string, unknown>) => boolean;
    /**
     * O que ainda falta escolher, em uma palavra ("tamanho", "horário").
     *
     * Vira o rótulo do botão travado. "Escolha as opções" não diz nada e
     * ainda quebra em duas linhas; "Escolha o tamanho" resolve a dúvida na
     * hora em que ela aparece.
     */
    queFalta?: (oferta: Oferta, selecao: Record<string, unknown>) => string | undefined;
    /** Texto curto da escolha, pra sacola e mensagem. */
    resumir: (oferta: Oferta, selecao: Record<string, unknown>) => string;
  };
  /** Telas que o módulo acrescenta no painel do lojista. */
  telasPainel?: { id: string; nome: string; icone: ComponentType<{ size?: number | string }>; Componente: ComponentType<{ loja: Loja }> }[];
}

/* ============================================================
   TEMA — poucos eixos, de propósito (ver Seção 09 da proposta)
   ============================================================ */

export type Densidade = "confortavel" | "media" | "compacta";
export type Canto = "reto" | "suave" | "redondo" | "pilula";
export type ParFontes = "sora-inter" | "fraunces-inter" | "archivo-inter" | "instrument-inter";
export type EstiloBotao = "solido" | "contorno" | "suave";
export type NivelSombra = "plana" | "suave" | "elevada";
export type EscalaTexto = "pequeno" | "normal" | "grande";

export interface Tema {
  corMarca: string;
  densidade: Densidade;
  canto: Canto;
  fontes: ParFontes;

  /**
   * Os eixos abaixo entraram depois. São opcionais porque loja salva antes
   * deles existir tem que continuar abrindo — `temaCompleto()` preenche.
   */

  /** O papel da loja. Escolher um escuro produz modo escuro inteiro: as
   *  tintas, bordas e a escala da marca são recalculadas contra ele. */
  corPapel?: string;
  estiloBotao?: EstiloBotao;
  sombra?: NivelSombra;
  escalaTexto?: EscalaTexto;
}

/* ============================================================
   ESTILO DE BLOCO

   Cada seção pode ter fundo, respiro e moldura próprios. É o que
   permite fazer uma faixa escura no meio de uma loja clara sem
   inventar um bloco novo pra cada combinação.

   A cor do texto NÃO está aqui de propósito: ela é derivada do fundo
   escolhido, senão volta o problema de texto claro em fundo claro.
   ============================================================ */

export type FundoBloco =
  | "nenhum"
  | "papel"
  | "suave"
  | "marca-suave"
  | "marca"
  | "escuro"
  | "propria";

export interface EstiloBloco {
  fundo?: FundoBloco;
  /** Só quando `fundo` é "propria". */
  corFundo?: string;
  respiro?: "nenhum" | "p" | "m" | "g";
  canto?: "herdar" | "reto" | "suave" | "redondo";
  borda?: boolean;
  sombra?: "nenhuma" | "leve" | "media";
  /** Ocupa a largura toda da tela, ignorando a margem da página. */
  sangrar?: boolean;
  alinhamento?: "esquerda" | "centro";
  /** Espaço extra depois do bloco, pra separar seções. */
  espacoDepois?: "nenhum" | "normal" | "grande";
}

/* ============================================================
   LOJA — tudo que define uma loja cabe aqui
   ============================================================ */

export interface Loja {
  slug: string;
  nome: string;
  descricao: string;
  logoUrl?: string;
  whatsapp: string;
  aberta: boolean;
  tema: Tema;
  modulos: string[];
  paginas: Record<TipoPagina, BlocoNaPagina[]>;
  ofertas: Oferta[];
  /** Configuração livre por módulo: `config.b2b`, `config.entrega`… */
  config: Record<string, unknown>;
}

/* ============================================================
   RESOLVIDOS — o que a UI consome
   ============================================================ */

export interface LinhaResolvida {
  linha: LinhaSacola;
  oferta: Oferta;
  preco: PrecoResolvido;
  subtotal: number;
  /** "Tam. M" ou "10/09 às 14h · Bárbara" */
  resumoSelecao: string;
}

export interface ResumoSacola {
  linhas: LinhaResolvida[];
  totalItens: number;
  total: number;
  avisos: AvisoSacola[];
  /** Bloqueia o checkout enquanto houver erro. */
  podeFechar: boolean;
}

export interface Pedido {
  id: string;
  criadoEm: number;
  lojaSlug: string;
  linhas: LinhaResolvida[];
  total: number;
  passos: DadosCheckout;
  mensagem: string;
}

export type { ReactNode };
