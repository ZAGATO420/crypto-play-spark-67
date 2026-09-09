// Audio engine: two produced hip-hop loops for music, short HD one-shots for actions.
// Nothing is synthesised at runtime — only the generated files are played.
import mMenu from "@/assets/audio/m-menu.mp3.asset.json";
import mRun from "@/assets/audio/m-run.mp3.asset.json";
import sBuy from "@/assets/audio/s-buy.mp3.asset.json";
import sCare from "@/assets/audio/s-care.mp3.asset.json";
import sClick from "@/assets/audio/s-click.mp3.asset.json";
import sCrash from "@/assets/audio/s-crash.mp3.asset.json";
import sHit from "@/assets/audio/s-hit.mp3.asset.json";
import sLevel from "@/assets/audio/s-level.mp3.asset.json";
import sQuarter from "@/assets/audio/s-quarter.mp3.asset.json";
import sSell from "@/assets/audio/s-sell.mp3.asset.json";
import sVault from "@/assets/audio/s-vault.mp3.asset.json";
import sWin from "@/assets/audio/s-win.mp3.asset.json";

export type TrackId = "menu" | "run";
export type SfxId = "buy" | "sell" | "win" | "crash" | "level" | "care" | "vault" | "quarter" | "click" | "hit";

const TRACKS: Record<TrackId, string> = { menu: mMenu.url, run: mRun.url };
const SFX: Record<SfxId, string> = {
  buy: sBuy.url, sell: sSell.url, win: sWin.url, crash: sCrash.url, level: sLevel.url,
  care: sCare.url, vault: sVault.url, quarter: sQuarter.url, click: sClick.url, hit: sHit.url,
};

const SFX_GAIN: Record<SfxId, number> = {
  buy: 0.9, sell: 0.9, win: 1, crash: 1, level: 1, care: 0.8, vault: 0.85, quarter: 0.8, click: 0.45, hit: 0.7,
};

const KEY_MUSIC = "tcfb_music_vol";
const KEY_SFX = "tcfb_sfx_vol";
const KEY_MUTE = "tcfb_muted";
const FADE = 2;

type State = {
  ctx: AudioContext | null;
  musicBus: GainNode | null;
  moodFilter: BiquadFilterNode | null;
  sfxBus: GainNode | null;
  players: Partial<Record<TrackId, { el: HTMLAudioElement; gain: GainNode }>>;
  buffers: Partial<Record<SfxId, AudioBuffer>>;
  loading: Partial<Record<SfxId, Promise<AudioBuffer | null>>>;
  track: TrackId | null;
  ready: boolean;
};

const s: State = { ctx: null, musicBus: null, moodFilter: null, sfxBus: null, players: {}, buffers: {}, loading: {}, track: null, ready: false };

/** The music leans with the market: hyped in a bull, thin and tense in a crash. */
export type Mood = "calm" | "hype" | "tense";
const MOOD: Record<Mood, { cut: number; gain: number }> = {
  calm: { cut: 16_000, gain: 1 },
  hype: { cut: 20_000, gain: 1.15 },
  tense: { cut: 900, gain: 0.72 },
};
let mood: Mood = "calm";


const num = (key: string, fallback: number) => {
  if (typeof localStorage === "undefined") return fallback;
  const stored = localStorage.getItem(key);
  if (stored === null || stored === "") return fallback;
  const raw = Number(stored);
  return Number.isFinite(raw) && raw >= 0 && raw <= 1 ? raw : fallback;
};

let musicVol = 0.35;
let sfxVol = 0.6;
let muted = false;

export function readSettings() {
  musicVol = num(KEY_MUSIC, 0.35);
  sfxVol = num(KEY_SFX, 0.6);
  muted = typeof localStorage !== "undefined" && localStorage.getItem(KEY_MUTE) === "1";
  return { musicVol, sfxVol, muted };
}

const applyBuses = () => {
  if (!s.ctx || !s.musicBus || !s.sfxBus) return;
  const t = s.ctx.currentTime;
  s.musicBus.gain.setTargetAtTime(muted ? 0 : musicVol * MOOD[mood].gain, t, 0.2);
  s.sfxBus.gain.setTargetAtTime(muted ? 0 : sfxVol, t, 0.05);
  if (s.moodFilter) s.moodFilter.frequency.setTargetAtTime(MOOD[mood].cut, t, 0.6);
};

/** Called by the run: bull market opens the music up, a crash chokes it. */
export function setMood(next: Mood) {
  if (mood === next) return;
  mood = next;
  applyBuses();
}

export function initAudio() {
  if (typeof window === "undefined") return;
  readSettings();
  if (!s.ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    s.ctx = new Ctor();
    s.musicBus = s.ctx.createGain();
    s.sfxBus = s.ctx.createGain();
    s.moodFilter = s.ctx.createBiquadFilter();
    s.moodFilter.type = "lowpass";
    s.moodFilter.frequency.value = MOOD[mood].cut;
    s.musicBus.connect(s.moodFilter).connect(s.ctx.destination);
    s.sfxBus.connect(s.ctx.destination);
    s.ready = true;
  }
  void s.ctx.resume();
  applyBuses();
  if (s.track) void setTrack(s.track);
}


function player(id: TrackId) {
  if (!s.ctx || !s.musicBus) return null;
  const existing = s.players[id];
  if (existing) return existing;
  const el = new Audio(TRACKS[id]);
  el.loop = true;
  el.crossOrigin = "anonymous";
  el.preload = "auto";
  const src = s.ctx.createMediaElementSource(el);
  const gain = s.ctx.createGain();
  gain.gain.value = 0;
  src.connect(gain).connect(s.musicBus);
  const made = { el, gain };
  s.players[id] = made;
  return made;
}

export async function setTrack(id: TrackId | null) {
  s.track = id;
  if (!s.ctx || !s.ready) return;
  const now = s.ctx.currentTime;
  for (const key of Object.keys(s.players) as TrackId[]) {
    if (key === id) continue;
    const p = s.players[key];
    if (!p) continue;
    p.gain.gain.cancelScheduledValues(now);
    p.gain.gain.setTargetAtTime(0, now, FADE / 3);
    window.setTimeout(() => { if (s.track !== key) p.el.pause(); }, FADE * 1000);
  }
  if (!id) return;
  const p = player(id);
  if (!p) return;
  try { await p.el.play(); } catch { return; }
  p.gain.gain.cancelScheduledValues(now);
  p.gain.gain.setTargetAtTime(1, now, FADE / 3);
}

async function buffer(id: SfxId) {
  if (!s.ctx) return null;
  const cached = s.buffers[id];
  if (cached) return cached;
  const pending = s.loading[id];
  if (pending) return pending;
  const job = (async () => {
    try {
      const res = await fetch(SFX[id]);
      const raw = await res.arrayBuffer();
      const decoded = await s.ctx!.decodeAudioData(raw);
      s.buffers[id] = decoded;
      return decoded;
    } catch {
      return null;
    }
  })();
  s.loading[id] = job;
  return job;
}

export function preloadSfx() {
  if (!s.ctx) return;
  for (const id of Object.keys(SFX) as SfxId[]) void buffer(id);
}

export function playSfx(id: SfxId) {
  const ctx = s.ctx;
  if (muted || !ctx || !s.sfxBus) return;
  void (async () => {
    if (ctx.state === "suspended") await ctx.resume().catch(() => {});
    const buf = await buffer(id);
    if (!buf || !s.ctx || !s.sfxBus || muted) return;
    const src = s.ctx.createBufferSource();
    const gain = s.ctx.createGain();
    gain.gain.value = SFX_GAIN[id];
    src.buffer = buf;
    src.connect(gain).connect(s.sfxBus);
    src.start();
  })();
}

export function setMuted(next: boolean) {
  muted = next;
  if (typeof localStorage !== "undefined") localStorage.setItem(KEY_MUTE, next ? "1" : "0");
  applyBuses();
  if (!next) initAudio();
}

export function setMusicVol(v: number) {
  musicVol = Math.max(0, Math.min(1, v));
  if (typeof localStorage !== "undefined") localStorage.setItem(KEY_MUSIC, String(musicVol));
  applyBuses();
}

export function setSfxVol(v: number) {
  sfxVol = Math.max(0, Math.min(1, v));
  if (typeof localStorage !== "undefined") localStorage.setItem(KEY_SFX, String(sfxVol));
  applyBuses();
}

export const isMuted = () => muted;
export const getVolumes = () => ({ musicVol, sfxVol });

let wired = false;
export function wireAudio() {
  if (wired || typeof window === "undefined") return;
  wired = true;
  readSettings();
  const unlock = () => {
    initAudio();
    preloadSfx();
    if (!s.track) void setTrack("menu");
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
    window.removeEventListener("touchstart", unlock);
  };
  window.addEventListener("touchstart", unlock, { once: false });
  window.addEventListener("pointerdown", unlock, { once: false });
  window.addEventListener("keydown", unlock, { once: false });
  document.addEventListener("visibilitychange", () => {
    if (!s.ctx) return;
    if (document.hidden) void s.ctx.suspend();
    else void s.ctx.resume();
  });
}
