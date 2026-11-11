// ============================================================
// Deterministic PRNG (Mulberry32) and column generator
// ============================================================

/**
 * Mulberry32: a fast, high-quality 32-bit PRNG.
 * Returns a function that produces the next pseudo-random float [0, 1).
 */
export function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Generate a single column of random digits (0-9) given a seed and column index.
 * Each column uses a unique sub-seed derived from the session seed + column index.
 */
export function generateColumn(
  sessionSeed: number,
  columnIndex: number,
  count: number,
): number[] {
  const subSeed = sessionSeed * 1000 + columnIndex;
  const rng = mulberry32(subSeed);
  const digits: number[] = [];
  for (let i = 0; i < count; i++) {
    digits.push(Math.floor(rng() * 10));
  }
  return digits;
}

/**
 * Generate all columns for a session.
 */
export function generateAllColumns(
  sessionSeed: number,
  totalColumns: number,
  numbersPerColumn: number,
): number[][] {
  const columns: number[][] = [];
  for (let i = 0; i < totalColumns; i++) {
    columns.push(generateColumn(sessionSeed, i, numbersPerColumn));
  }
  return columns;
}

/**
 * Create a new random session seed.
 * Should only be called server-side.
 */
export function createSessionSeed(): number {
  return Math.floor(Math.random() * 2147483647) + 1;
}

