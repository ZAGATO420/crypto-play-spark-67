/**
 * Deterministic randomness. Tournament runs share a season seed, so every
 * player faces the same crashes, launches, drainers and minigame layouts.
 * Free runs get a random seed and behave exactly like before.
 */

export const hashString = (input: string): number => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const mix = (seed: number, tag: string): number => {
  let h = hashString(tag) ^ (seed >>> 0);
  h = Math.imul(h ^ (h >>> 15), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
};

/** Stable value in [0,1) for a seed and a label. Same inputs, same number. */
export const det = (seed: number, tag: string): number => mix(seed, tag) / 4294967296;

export const randomSeed = (): number => Math.floor(Math.random() * 4294967296);
