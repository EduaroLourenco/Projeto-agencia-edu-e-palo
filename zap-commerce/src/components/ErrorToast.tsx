import { AlertTriangle, X } from "lucide-react";

export function ErrorToast({ mensagem, onFechar }: { mensagem: string | null; onFechar: () => void }) {
  if (!mensagem) return null;

  return (
    <div className="fixed inset-x-4 top-4 z-50 mx-auto flex max-w-md animate-slide-up items-start gap-2.5 rounded-xl bg-ink px-4 py-3 text-white shadow-xl">
      <AlertTriangle size={16} className="mt-0.5 shrink-0 text-brand-400" />
      <p className="flex-1 text-sm">{mensagem}</p>
      <button onClick={onFechar} aria-label="Fechar aviso" className="shrink-0 text-white/50">
        <X size={16} />
      </button>
    </div>
  );
}
