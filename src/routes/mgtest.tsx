import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Minigame, type MiniKind } from "@/game/minigames";

export const Route = createFileRoute("/mgtest")({ component: Page });

function Page() {
  const [kind, setKind] = useState<MiniKind>("whale");
  const [out, setOut] = useState("");
  return (
    <div className="journey-root" style={{ padding: 16 }}>
      <div className="cy-sheet">
        {(["whale", "airdrop", "hodl"] as MiniKind[]).map((k) => (
          <button key={k} onClick={() => { setKind(k); setOut(""); }} data-t={k}>{k}</button>
        ))}
        <Minigame key={kind} kind={kind} hard={false} roll={0.42} onResult={(r) => setOut(`${r.label} ${r.quality}`)} />
        <p data-out>{out}</p>
      </div>
    </div>
  );
}
