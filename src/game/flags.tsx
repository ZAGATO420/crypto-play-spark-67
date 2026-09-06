import { COUNTRY_FLAGS } from "./journey-data";

/**
 * Flags are drawn as tiny inline SVGs on purpose: emoji flags render as bare
 * letters ("DE") on Windows, so every player would see abbreviations instead.
 */
export function Flag({ code, size = 20 }: { code: string; size?: number }) {
  const spec = COUNTRY_FLAGS[code] ?? { name: code, kind: "h" as const, colors: ["#1c2733", "#3a4b5c", "#1c2733"] };
  const w = size;
  const h = Math.round(size * 0.68);
  const [a, b, c] = spec.colors;

  return (
    <svg className="cy-flag" width={w} height={h} viewBox="0 0 30 20" role="img" aria-label={spec.name} focusable="false">
      {spec.kind === "h" && (
        <>
          <rect x="0" y="0" width="30" height="6.67" fill={a} />
          <rect x="0" y="6.67" width="30" height="6.66" fill={b ?? a} />
          <rect x="0" y="13.33" width="30" height="6.67" fill={c ?? a} />
        </>
      )}
      {spec.kind === "v" && (
        <>
          <rect x="0" y="0" width="10" height="20" fill={a} />
          <rect x="10" y="0" width="10" height="20" fill={b ?? a} />
          <rect x="20" y="0" width="10" height="20" fill={c ?? a} />
        </>
      )}
      {spec.kind === "cross" && (
        <>
          <rect x="0" y="0" width="30" height="20" fill={a} />
          <rect x="0" y="8" width="30" height="4" fill={b ?? "#fff"} />
          <rect x="11" y="0" width="4" height="20" fill={b ?? "#fff"} />
        </>
      )}
      {spec.kind === "circle" && (
        <>
          <rect x="0" y="0" width="30" height="20" fill={a} />
          <circle cx="15" cy="10" r="5.5" fill={b ?? "#fff"} />
        </>
      )}
      {spec.kind === "usa" && (
        <>
          <rect x="0" y="0" width="30" height="20" fill={b ?? "#fff"} />
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x="0" y={i * 4} width="30" height="2" fill={a} />)}
          <rect x="0" y="0" width="13" height="10" fill={c ?? "#3c3b6e"} />
        </>
      )}
      <rect x="0.5" y="0.5" width="29" height="19" fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="1" />
    </svg>
  );
}
