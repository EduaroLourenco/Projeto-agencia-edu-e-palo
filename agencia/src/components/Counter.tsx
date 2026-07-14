import { useEffect, useRef, useState } from "react";

export function Counter({
  to,
  suffix = "",
  duration = 1.2,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const inicio = performance.now();
        let frame: number;

        function tick(agora: number) {
          const progresso = Math.min(1, (agora - inicio) / (duration * 1000));
          const facilitado = 1 - Math.pow(1 - progresso, 3);
          setValor(Math.round(facilitado * to));
          if (progresso < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      { threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref}>
      {valor}
      {suffix}
    </span>
  );
}
