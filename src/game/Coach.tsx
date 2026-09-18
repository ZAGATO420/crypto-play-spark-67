import { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export type CoachStep = { sel: string; title: string; body: string };

const KEY = "tcfb_coach_v2";

export const coachSeen = (): boolean => {
  try { return localStorage.getItem(KEY) === "1"; } catch { return true; }
};
export const markCoachSeen = () => {
  try { localStorage.setItem(KEY, "1"); } catch { /* private mode */ }
};

export const FIRST_RUN_STEPS: CoachStep[] = [
  { sel: ".cy-core", title: "1 · THIS IS YOUR MONEY", body: "Net worth is your score. The Boss grows every quarter — stay above him or he takes the throne. Stress and hunger kill you if you ignore them." },
  { sel: ".cy-goal", title: "2 · YOUR JOB THIS QUARTER", body: "Every quarter gives you one clear task and a mission for bonus XP. When you don't know what to do, do this line." },
  { sel: ".cy-market-visual", title: "3 · THE PRICE IS LIVE", body: "Real 2020–2026 prices. The yellow dot walks through the quarter while you think, so entry timing matters. The line turns pink when it bleeds." },
  { sel: ".cy-main-trade", title: "4 · ONE TAP = ONE TRADE", body: "The big yellow button is always the main move of the quarter: buy, exit, hunt a presale, move funds to cold storage or fight the Boss." },
  { sel: ".cy-toolbelt", title: "5 · TIME AND SURVIVAL", body: "You get 2 moves per quarter. SURVIVE buys food and calm, BOOKS shows every dollar in and out, END QUARTER jumps 3 months forward — and the market answers." },
];

export default function Coach({ steps, onDone }: { steps: CoachStep[]; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const step = steps[i];

  useLayoutEffect(() => {
    if (!step) return;
    const el = document.querySelector(step.sel) as HTMLElement | null;
    if (!el) { setBox(null); return; }
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    measure();
    const t = window.setTimeout(measure, 320);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => { window.clearTimeout(t); window.removeEventListener("resize", measure); window.removeEventListener("scroll", measure, true); };
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onDone(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  if (!step) return null;
  const below = !box || box.top < window.innerHeight * 0.42;

  return (
    <div className="coach" role="dialog" aria-label="How to play">
      <div className="coach-veil" onClick={() => setI((v) => (v + 1 < steps.length ? v + 1 : (onDone(), v)))} />
      {box && <div className="coach-ring" style={{ top: box.top - 6, left: box.left - 6, width: box.width + 12, height: box.height + 12 }} />}
      <div className={`coach-tip${below ? " is-below" : " is-above"}`} style={box ? (below ? { top: Math.min(window.innerHeight - 190, box.top + box.height + 14) } : { bottom: Math.min(window.innerHeight - 190, window.innerHeight - box.top + 14) }) : { top: "40%" }}>
        <p className="coach-step">{step.title}</p>
        <p className="coach-body">{step.body}</p>
        <div className="coach-foot">
          <div className="coach-dots">{steps.map((_, n) => <i key={n} className={n <= i ? "is-on" : ""} />)}</div>
          <button className="coach-skip" onClick={() => { markCoachSeen(); onDone(); }}>SKIP</button>
          <Button className="coach-next" onClick={() => { if (i + 1 < steps.length) setI(i + 1); else { markCoachSeen(); onDone(); } }}>
            {i + 1 < steps.length ? <>NEXT <ChevronRight /></> : <>LET&apos;S TRADE <ChevronRight /></>}
          </Button>
        </div>
      </div>
    </div>
  );
}
