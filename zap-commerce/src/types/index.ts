export interface Produto {
  id: string;
  tenantId: string;
  nome: string;
  precoVarejo: number;
  precoAtacado: number;
  categorias: string[];
  tamanhosDisponiveis: string[];
  imageUrl: string;
  instagramReelsUrl?: string;
  isUltimasPecas: boolean;
  isAtivo: boolean;
  criadoEm: number;
}

export type TipoPontoRetirada = "maos" | "excursao" | "correios";

export interface PontoRetirada {
  id: string;
  tipo: TipoPontoRetirada;
  nome: string;
  descricao?: string;
}

export type TipoRegraAtacado = "quantidade" | "valor";

export interface RegraAtacado {
  tipo: TipoRegraAtacado;
  minimo: number;
}

export interface LojaConfig {
  slug: string;
  nomeLoja: string;
  aberto: boolean;
  whatsappNumero: string;
  mensagemSaudacao: string;
  regraAtacado: RegraAtacado;
  pontosRetirada: PontoRetirada[];
  corDestaque?: string;
}

export interface ItemCarrinho {
  produtoId: string;
  tamanho: string;
  quantidade: number;
}

export type MetodoEntrega =
  | { tipo: "maos"; pontoId: string }
  | { tipo: "excursao"; guia: string; placaOnibus: string; estacionamento: string }
  | { tipo: "correios"; cep: string; endereco?: string; cidade?: string; uf?: string };

export interface DadosComprador {
  nome: string;
  cidade: string;
}
