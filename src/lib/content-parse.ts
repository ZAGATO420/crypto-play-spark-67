export type Item = {
  id: string;
  section: string;
  kind: "P" | "S" | "X" | "POST" | "NOTE";
  text: string;
  meta?: string;
};

export type Doc = {
  key: string;
  title: string;
  blurb: string;
  items: Item[];
  raw: string;
};

/** Reply library: "## 1. Topic" sections with "1. `[P]` text" lines. */
export function parseReplies(raw: string): Item[] {
  const items: Item[] = [];
  let section = "Allgemein";
  let i = 0;
  for (const line of raw.split("\n")) {
    const h = line.match(/^##\s+(.*)$/);
    if (h) {
      section = (h[1] ?? "").replace(/^\d+\.\s*/, "").trim();
      continue;
    }
    const m = line.match(/^\s*\d+\.\s+`\[(P|S|X)\]`\s+(.+)$/);
    if (m) {
      items.push({
        id: `r${i++}`,
        section,
        kind: m[1] as "P" | "S" | "X",
        text: (m[2] ?? "").trim(),
      });
    }
  }
  return items;
}

/** Calendar: "### Tag N — `[Type]`" then "**Post:**" body until next "**". */
export function parseCalendar(raw: string): Item[] {
  const items: Item[] = [];
  const lines = raw.split("\n");
  let section = "";
  let meta = "";
  let i = 0;
  for (let l = 0; l < lines.length; l++) {
    const cur = lines[l] ?? "";
    const h3 = cur.match(/^###\s+(.*)$/);
    if (h3) {
      const t = h3[1] ?? "";
      section = t.replace(/`?\[[^\]]+\]`?/g, "").replace(/[—-]\s*$/, "").trim();
      const k = t.match(/`\[([^\]]+)\]`/);
      meta = k?.[1] ?? "";
      continue;
    }
    if (/^\*\*Post:\*\*/.test(cur) && section) {
      const body: string[] = [];
      const inline = cur.replace(/^\*\*Post:\*\*\s*/, "");
      if (inline.trim()) body.push(inline.trim());
      for (let j = l + 1; j < lines.length; j++) {
        const nl = lines[j] ?? "";
        if (/^\*\*/.test(nl) || /^###?\s/.test(nl) || /^---/.test(nl)) break;
        body.push(nl);
      }
      const text = body.join("\n").trim();
      if (text) items.push({ id: `c${i++}`, section, kind: "POST", text, meta });
    }
  }
  return items;
}

/** Playbook / notes: split into "## " chunks, keep the whole chunk copyable. */
export function parseSections(raw: string): Item[] {
  const items: Item[] = [];
  const parts = raw.split(/\n(?=##\s)/);
  let i = 0;
  for (const p of parts) {
    const first = p.split("\n")[0] ?? "";
    const title = first.replace(/^#+\s*/, "").trim();
    const body = p.split("\n").slice(1).join("\n").replace(/^\s*---\s*$/gm, "").trim();
    if (!body) continue;
    items.push({
      id: `s${i++}`,
      section: title || "Intro",
      kind: "NOTE",
      text: body,
    });
  }
  return items;
}

export const KIND_LABEL: Record<Item["kind"], string> = {
  P: "Pure",
  S: "Soft Hook",
  X: "Pitch",
  POST: "Post",
  NOTE: "Guide",
};