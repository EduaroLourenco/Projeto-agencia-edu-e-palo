import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

interface Props {
  src: string;
  alt: string;
  /** Quanto a foto desliza dentro da moldura, em % da própria altura. */
  intensidade?: number;
  prioridade?: boolean;
  className?: string;
}

/**
 * Retrato com paralaxe de rolagem.
 *
 * A foto é 22% mais alta que a moldura e escorrega dentro dela conforme a
 * página rola. O movimento é o que dá vida — as fotos são de celular, em
 * cenários diferentes, e ficar paradas num grid deixava a seção estática.
 *
 * A folga vertical é o que permite o deslocamento sem mostrar buraco: a
 * imagem nunca sai de dentro da moldura porque só 22% dela sobra.
 */
export function RetratoTime({ src, alt, intensidade = 8, prioridade = false, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const semMovimento = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // A mola tira o "grude" do scroll: sem ela o movimento acompanha o dedo
  // ponto a ponto e parece travado.
  const suave = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const y = useTransform(suave, [0, 1], [`-${intensidade}%`, `${intensidade}%`]);

  return (
    // top -11% centra a sobra: 11% de folga pra cada lado, e o deslocamento
    // máximo (8% de 122% = 9,8% da moldura) cabe dentro dela.
    <div ref={ref} className={`relative overflow-hidden bg-surface-2 ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        width={680}
        height={850}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        style={semMovimento ? undefined : { y }}
        className="absolute left-0 top-[-11%] h-[122%] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
    </div>
  );
}
