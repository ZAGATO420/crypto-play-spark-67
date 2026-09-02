import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Copy, Search } from "lucide-react";

import replyRaw from "@/content/x-reply-library.md?raw";
import calendarRaw from "@/content/x-30-day-calendar.md?raw";
import playbookRaw from "@/content/x-playbook.md?raw";
import {
  KIND_LABEL,
  parseCalendar,
  parseReplies,
  parseSections,
  type Item,
} from "@/lib/content-parse";

const BASE_URL = "https://thecryptofinalboss.app";

const COLLECTION_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "TCFB Content Center",
  url: `${BASE_URL}/content`,
  description:
    "Durchsuchbare Zentrale für die TCFB X-Strategie: Replies, 30-Tage-Post-Kalender und Growth-Playbook.",
  isPartOf: {
    "@type": "WebSite",
    name: "The Crypto Final Boss",
    url: `${BASE_URL}/`,
  },
  hasPart: [
    {
      "@type": "WebPage",
      name: "Reply-Bibliothek",
      description: "Sammlung durchsuchbarer X-Replies für das TCFB Game.",
    },
    {
      "@type": "WebPage",
      name: "30-Tage-Kalender",
      description: "30 Tage Content-Ideen für den TCFB X-Account.",
    },
    {
      "@type": "WebPage",
      name: "Playbook",
      description: "Growth-Playbook für die TCFB Community.",
    },
  ],
});

export const Route = createFileRoute("/content")({
  head: () => ({
    meta: [
      { title: "TCFB Content Center — Replies, Kalender & Playbook" },
      {
        name: "description",
        content:
          "Durchsuchbare Zentrale für die TCFB X-Strategie: 300+ Replies, 30-Tage-Post-Kalender und Growth-Playbook, alles mit einem Klick kopierbar.",
      },
      { property: "og:title", content: "TCFB Content Center" },
      {
        property: "og:description",
        content: "Replies, Post-Kalender und Playbook für @CryptoBossFInal — suchen, filtern, kopieren.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
      { "script:ld+json": JSON.parse(COLLECTION_LD) } as any,
    ],
  }),
  component: ContentCenter,
});

const TABS = [
  { key: "replies", label: "Reply-Bibliothek" },
  { key: "calendar", label: "30-Tage-Kalender" },
  { key: "playbook", label: "Playbook" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function ContentCenter() {
  const docs = useMemo(
    () => ({
      replies: parseReplies(replyRaw),
      calendar: parseCalendar(calendarRaw),
      playbook: parseSections(playbookRaw),
    }),
    [],
  );

  const [tab, setTab] = useState<TabKey>("replies");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "P" | "S" | "X">("all");
  const [section, setSection] = useState("all");
  const [copied, setCopied] = useState<string | null>(null);

  const items = docs[tab];
  const sections = useMemo(
    () => Array.from(new Set(items.map((i) => i.section))),
    [items],
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((i) => {
      if (section !== "all" && i.section !== section) return false;
      if (tab === "replies" && kind !== "all" && i.kind !== kind) return false;
      if (!needle) return true;
      return (i.text + " " + i.section).toLowerCase().includes(needle);
    });
  }, [items, q, kind, section, tab]);

  const copy = async (item: Item) => {
    try {
      await navigator.clipboard.writeText(item.text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = item.text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(item.id);
    window.setTimeout(() => setCopied((c) => (c === item.id ? null : c)), 1400);
  };

  const switchTab = (k: TabKey) => {
    setTab(k);
    setSection("all");
    setKind("all");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-card/40 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              TCFB Content Center
            </h1>
            <p className="text-sm text-muted-foreground">
              Suchen, filtern, mit einem Klick kopieren.
            </p>
          </div>
          <Link
            to="/"
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            zurück zum Game
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => switchTab(t.key)}
              className={
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors " +
                (tab === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground")
              }
            >
              {t.label}
              <span className="ml-2 opacity-70">{docs[t.key].length}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Inhalte durchsuchen"
              placeholder="durchsuchen, z.B. luna, airdrop, rekt"
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            aria-label="Nach Thema filtern"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          >
            <option value="all">alle Themen</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {tab === "replies" && (
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as typeof kind)}
              aria-label="Nach Typ filtern"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="all">alle Typen</option>
              <option value="P">Pure</option>
              <option value="S">Soft Hook</option>
              <option value="X">Pitch</option>
            </select>
          )}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {filtered.length} Einträge
        </p>

        <ul className="mt-4 space-y-3">
          {filtered.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-border/70 bg-card/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide">
                    <span className="rounded bg-primary/15 px-2 py-0.5 font-semibold text-primary">
                      {item.meta || KIND_LABEL[item.kind]}
                    </span>
                    <span className="text-muted-foreground">{item.section}</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copy(item)}
                  aria-label="kopieren"
                  className="shrink-0 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  {copied === item.id ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> kopiert
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3.5 w-3.5" /> kopieren
                    </span>
                  )}
                </button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              nichts gefunden. andere Suche probieren.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}