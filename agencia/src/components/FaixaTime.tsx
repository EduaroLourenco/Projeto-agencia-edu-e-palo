import { TIME } from "../data/content";

/**
 * Rosto, nome e profissão logo no primeiro scroll.
 *
 * Quem chega no site não sabe se está falando com uma empresa de verdade ou
 * com um template. Ver três pessoas com nome e profissão resolve isso antes
 * de qualquer texto — e é o tipo de prova que um concorrente não copia.
 *
 * Retrato 4:5, não avatar redondo de 48px: um selo pequeno some no meio do
 * hero e não convence ninguém. Aqui a foto é grande o bastante pra você
 * reconhecer a pessoa se cruzar com ela na rua.
 */
export function FaixaTime() {
  return (
    <div className="mt-9 border-t border-white/[0.08] pt-6 lg:mt-10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Quem faz</p>

      <ul className="mt-4 grid grid-cols-3 gap-2.5 sm:gap-4">
        {TIME.map((pessoa) => (
          <li key={pessoa.nome} className="group">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-2">
              <img
                src={pessoa.foto}
                alt={`Foto de ${pessoa.nome}`}
                width={680}
                height={850}
                loading="eager"
                decoding="async"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>
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
