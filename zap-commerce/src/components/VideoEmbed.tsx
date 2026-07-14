function detectarPlataforma(url: string): "instagram" | "tiktok" | null {
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com/.test(url)) return "tiktok";
  return null;
}

export function VideoEmbed({ url, imagemCapa }: { url: string; imagemCapa: string }) {
  const plataforma = detectarPlataforma(url);
  if (!plataforma) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-t-2xl bg-ink"
    >
      <img
        src={imagemCapa}
        loading="lazy"
        alt=""
        className="h-full w-full object-cover opacity-80 transition-opacity group-active:opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-ink">
        Shop the look · {plataforma === "instagram" ? "Reels" : "TikTok"}
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-active:scale-90">
          <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-ink">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
