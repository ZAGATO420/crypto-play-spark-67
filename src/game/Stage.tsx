import { useEffect, useRef, useState } from "react";

/** Presentation only: the quarter decision drawn as a stage. No game state lives here. */

export function StageBoss({ src, mood }: { src: string; mood: string }) {
  return (
    <div className={`cy-stage-boss is-${mood}`} aria-hidden>
      <img key={src} src={src} alt="" />
    </div>
  );
}

export function StageHeadline({ title, sub, show }: { title: string; sub: string; show: boolean }) {
  const [open, setOpen] = useState(show);
  useEffect(() => {
    if (!show) { setOpen(false); return; }
    setOpen(true);
    const t = window.setTimeout(() => setOpen(false), 2600);
    return () => window.clearTimeout(t);
  }, [show, title]);
  if (!open) return null;
  return (
    <button type="button" className="cy-stage-head" onClick={() => setOpen(false)} aria-label="Skip">
      <strong>{title}</strong>
      <span>{sub}</span>
    </button>
  );
}

export type Pulse = { x: number; y: number; label: string; id: number };

export function TapPulse({ pulse }: { pulse: Pulse | null }) {
  if (!pulse) return null;
  return (
    <i key={pulse.id} className={`cy-stage-pulse${pulse.x < 20 ? " is-left" : pulse.x > 80 ? " is-right" : ""}`} style={{ left: `${pulse.x}%`, top: `${pulse.y}%` }} aria-hidden>
      <b>{pulse.label}</b>
    </i>
  );
}

/**
 * Stage dressing for the big moment sheets (decisions, presales, boss duels):
 * the Boss looms behind the dialog and the title makes one entrance.
 * Pure presentation — the sheet keeps every handler and value it had.
 */
export function SheetStage({ src, mood, title, sub }: { src: string; mood: string; title: string; sub: string }) {
  return (
    <>
      <div className={`cy-sheet-stage is-${mood}`} aria-hidden>
        <img src={src} alt="" />
      </div>
      <StageHeadline title={title} sub={sub} show />
    </>
  );
}

/** Short +/− flash next to a number whenever it changes materially. */
export function Delta({ value }: { value: number }) {
  const prev = useRef(value);
  const [d, setD] = useState<{ v: number; id: number } | null>(null);
  useEffect(() => {
    const diff = value - prev.current;
    prev.current = value;
    if (Math.abs(diff) < Math.max(5, Math.abs(value) * 0.005)) return;
    setD({ v: diff, id: Date.now() });
    const t = window.setTimeout(() => setD(null), 1300);
    return () => window.clearTimeout(t);
  }, [value]);
  if (!d) return null;
  const s = Math.round(Math.abs(d.v)).toLocaleString("en-US");
  return <em key={d.id} className={`cy-stage-delta ${d.v > 0 ? "positive" : "negative"}`}>{d.v > 0 ? "+" : "−"}${s}</em>;
}
