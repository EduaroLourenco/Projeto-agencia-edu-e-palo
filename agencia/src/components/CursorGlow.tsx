import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function handleMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", handleMove);

    let raf: number;
    function loop() {
      current.current.x += (pos.current.x - current.current.x) * 0.12;
      current.current.y += (pos.current.y - current.current.y) * 0.12;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.current.x - 250}px, ${current.current.y - 250}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[500px] w-[500px] rounded-full opacity-[0.15] mix-blend-screen sm:block"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,0.9) 0%, rgba(34,211,238,0.5) 45%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
