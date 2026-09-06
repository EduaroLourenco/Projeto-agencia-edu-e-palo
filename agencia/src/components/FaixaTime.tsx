import { RetratoTime } from "./RetratoTime";
import { TIME } from "../data/content";

/* Degrau também aqui, mas ao contrário do Quem somos: sobe da esquerda pra
   direita. Uma fileira de três retângulos alinhados fica parada demais. */
const DEGRAU = ["translate-y-3", "translate-y-1.5", "translate-y-0"];

/**
 * Rosto, nome e profissão logo no primeiro scroll.
 *
 * Quem chega no site não sabe se está falando com uma empresa de verdade ou
 * com um template. Ver três pessoas com nome e profissão resolve isso antes
 * de qualquer texto — e é o tipo de prova que um concorrente não copia.
 */
export function FaixaTime() {
  return (
    <div className="mt-9 border-t border-white/[0.08] pt-6 lg:mt-10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Quem faz</p>

      <ul className="mt-4 grid grid-cols-3 items-end gap-2.5 sm:gap-4">
        {TIME.map((pessoa, i) => (
          <li key={pessoa.nome} className={`group ${DEGRAU[i]}`}>
            <RetratoTime
              src={pessoa.foto}
              alt={`Foto de ${pessoa.nome}`}
              intensidade={5}
              prioridade
              className="aspect-[4/5] rounded-2xl border border-white/[0.08]"
            />
            <p className="mt-2.5 text-xs font-bold leading-tight text-white sm:text-sm">
              {pessoa.nome}
            </p>
            <p className="mt-1 text-[11px] leading-tight text-white/45">{pessoa.profissao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
