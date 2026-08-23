/**
 * Sistema de cores do site.
 *
 * A base é quase preta com fundo levemente arroxeado (--color-ink e as
 * superfícies em index.css) — é ela que faz os três acentos acenderem.
 * Cada acento tem UM significado. Usar um acento fora do papel dele não
 * é "variedade": é ruído que ensina o visitante a ignorar a cor.
 *
 *   ROXO  (violet-*)  → o que a Sigma é e vende.
 *                       Serviços, módulos, setores, processo, quem somos.
 *
 *   AZUL  (blue-*)    → prova e resultado.
 *                       Case, projetos, conversas reais, números.
 *
 *   ROSA  (pink-*)    → ação, e só.
 *                       Reservado ao que é clicável de verdade: o CTA do
 *                       WhatsApp e o botão do case ao vivo. Nada
 *                       decorativo (kicker, checkmark, borda, ícone de
 *                       card) pode usar rosa — cada uso a mais rouba
 *                       atenção do único lugar que precisa dela.
 *
 * Exceção deliberada: o verde #25D366 dentro do PhoneMockup. Ali não é
 * paleta nossa — é a UI do WhatsApp sendo reproduzida, num bloco
 * aria-hidden que é ilustração, não conteúdo.
 *
 * Piso de contraste (WCAG AA em fundo escuro):
 *   texto secundário  → text-white/60
 *   texto de apoio    → text-white/50
 * Abaixo de /50 o texto reprova em AA no tamanho em que usamos.
 */

export const PAPEL_DAS_CORES = {
  roxo: "oferta — o que vendemos",
  azul: "prova — o que já entregamos",
  rosa: "ação — só o que é clicável",
} as const;
