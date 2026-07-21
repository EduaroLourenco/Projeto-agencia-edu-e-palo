/** Skeleton shimmer loading para a vitrine — aparece enquanto a loja carrega */
export function SkeletonStorefront() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-paper pb-8">
      {/* Skeleton Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-black/5 bg-paper/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-full animate-shimmer bg-black/8" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-28 rounded-md animate-shimmer bg-black/8" />
            <div className="h-2.5 w-16 rounded-md animate-shimmer bg-black/5" />
          </div>
        </div>
        <div className="h-9 w-24 rounded-full animate-shimmer bg-black/8" />
      </div>

      {/* Skeleton filtros de categoria */}
      <div className="flex gap-2 overflow-hidden px-4 py-3">
        {[72, 56, 80, 60, 68].map((w, i) => (
          <div
            key={i}
            className="h-8 shrink-0 rounded-full animate-shimmer bg-black/6"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Skeleton barra de progresso atacado */}
      <div className="mx-4 mb-3 h-10 rounded-xl animate-shimmer bg-black/5" />

      {/* Skeleton grid de produtos */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white">
            {/* Imagem */}
            <div className="aspect-square w-full animate-shimmer bg-black/6" />
            {/* Info */}
            <div className="flex flex-col gap-2 p-3">
              <div className="h-3 w-3/4 rounded animate-shimmer bg-black/8" />
              <div className="h-2.5 w-1/2 rounded animate-shimmer bg-black/5" />
              <div className="mt-1 h-8 rounded-xl animate-shimmer bg-black/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
