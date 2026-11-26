
export function BrandLogo({
  size = 32,
  withWordmark = true,
  wordmarkClass = "",
}: {
  size?: number;
  withWordmark?: boolean;
  wordmarkClass?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src="/favicon.png"
        alt="EspritAccess logo"
        width={size}
        height={size}
        loading="eager"
        decoding="async"
        fetchPriority="high"
        className="shrink-0 rounded-lg object-contain"
        style={{ width: size, height: size }}
      />

      {withWordmark && (
        <span
          className={`font-display text-lg font-extrabold tracking-tight text-foreground ${wordmarkClass}`}
        >
          Esprit<span className="text-primary">Access</span>
        </span>
      )}
    </span>
  );
}
