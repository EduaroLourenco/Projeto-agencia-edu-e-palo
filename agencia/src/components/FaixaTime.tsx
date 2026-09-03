import { TIME } from "../data/content";

/**
 * Rosto, nome e profissão logo no primeiro scroll.
 *
 * Quem chega no site não sabe se está falando com uma empresa de verdade ou
 * com um template. Ver três pessoas com nome e profissão resolve isso antes
 * de qualquer texto — e é o tipo de prova que um concorrente não copia.
 *
 * As fotos são `eager`: estão na primeira tela, então adiar o download só
 * faria o bloco piscar vazio. São 55 KB no total, cabe.
 */
export function FaixaTime() {
  return (
    <div className="mt-9 border-t border-white/[0.08] pt-6 lg:mt-10">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
        Quem faz
      </p>

      {/* Empilhado nos três tamanhos. Na horizontal, "Engenheiro de Software"
          quebrava em três linhas ao lado de uma foto de 48px — o nome ficava
          espremido e a foto, pequena demais pra servir de prova. */}
      <ul className="mt-4 grid grid-cols-3 gap-3 sm:gap-6">
        {TIME.map((pessoa) => (
          <li key={pessoa.nome} className="flex flex-col items-center text-center">
            <img
              src={pessoa.fotoQuadrada}
              alt={`Foto de ${pessoa.nome}`}
              width={320}
              height={320}
              loading="eager"
              decoding="async"
              className="h-20 w-20 shrink-0 rounded-2xl border border-white/12 object-cover saturate-[0.9] sm:h-24 sm:w-24"
            />
            <p className="mt-2.5 text-xs font-bold leading-tight text-white sm:text-[13px]">
              {pessoa.nome}
            </p>
            <p className="mt-1 text-[11px] leading-tight text-white/45">{pessoa.profissao}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
