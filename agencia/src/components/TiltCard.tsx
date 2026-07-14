import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode, MouseEvent } from "react";

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const [ativo, setAtivo] = useState(false);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const springConfig = { stiffness: 150, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [7, -7]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-7, 7]), springConfig);
  const glowX = useTransform(x, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(y, [0, 1], ["0%", "100%"]);
  const background = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(280px circle at ${gx} ${gy}, rgba(139,92,246,0.16), transparent 70%)`,
  );

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setAtivo(true)}
      onMouseLeave={() => {
        setAtivo(false);
        x.set(0.5);
        y.set(0.5);
      }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={`relative ${className ?? ""}`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
        style={{ background, opacity: ativo ? 1 : 0 }}
      />
      {children}
    </motion.div>
  );
}
