const ITENS = [
  "Comércio no WhatsApp",
  "Sites sob medida",
  "Marketing Digital",
  "Consultoria & Automação",
  "Design",
  "Código",
  "Resultado",
];

function Faixa() {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {ITENS.map((item) => (
        <span key={item} className="flex items-center gap-6 whitespace-nowrap">
          <span className="font-display text-lg font-bold text-white/25">{item}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500/50" />
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-surface/40 py-5">
      <div className="animate-marquee flex w-max">
        <Faixa />
        <Faixa />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
