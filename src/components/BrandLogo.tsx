import logoMark from "@/assets/logo-mark.png";

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
        src={logoMark}
        alt="EspritAccess logo"
        width={size}
        height={size}
        className="rounded-lg"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span className={`font-display text-lg font-extrabold tracking-tight text-foreground ${wordmarkClass}`}>
          Esprit<span className="text-primary">Access</span>
        </span>
      )}
    </span>
  );
}
