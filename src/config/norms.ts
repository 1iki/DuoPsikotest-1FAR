// ============================================================
// Norm thresholds for categorising each metric
// TODO: ganti dengan norma resmi dari referensi psikologi
// Nilai di bawah ini adalah placeholder semata.
// ============================================================
import type { CategoryLevel, TestType } from '@/types';

export interface NormThresholds {
  /** Boundaries: [SangatRendah|Rendah, Rendah|Sedang, Sedang|Tinggi, Tinggi|SangatTinggi] */
  boundaries: [number, number, number, number];
  /** true  = higher is better (speed)
   *  false = lower is better  (accuracy errors, consistency range) */
  higherIsBetter: boolean;
}

// TODO: ganti dengan norma resmi — nilai berikut hanya placeholder
const KRAEPELIN_NORMS: Record<string, NormThresholds> = {
  speed: {
    boundaries: [10, 15, 20, 25],
    higherIsBetter: true,
  },
  accuracy: {
    boundaries: [5, 10, 20, 35],
    higherIsBetter: false, // lower error% is better
  },
  consistency: {
    boundaries: [3, 5, 8, 12],
    higherIsBetter: false, // lower range is better
  },
  endurance: {
    boundaries: [-5, -2, 0, 2],
    higherIsBetter: true, // positive slope means maintained/improved
  },
};

// TODO: ganti dengan norma resmi — nilai berikut hanya placeholder
const PAULI_NORMS: Record<string, NormThresholds> = {
  speed: {
    boundaries: [15, 20, 28, 35],
    higherIsBetter: true,
  },
  accuracy: {
    boundaries: [5, 10, 20, 35],
    higherIsBetter: false,
  },
  consistency: {
    boundaries: [3, 6, 10, 15],
    higherIsBetter: false,
  },
  endurance: {
    boundaries: [-5, -2, 0, 2],
    higherIsBetter: true,
  },
};

const NORMS: Record<TestType, Record<string, NormThresholds>> = {
  kraepelin: KRAEPELIN_NORMS,
  pauli: PAULI_NORMS,
};

const LEVELS: CategoryLevel[] = [
  'Sangat Rendah',
  'Rendah',
  'Sedang',
  'Tinggi',
  'Sangat Tinggi',
];

/**
 * Categorise a raw metric value into one of 5 levels.
 */
export function categorise(
  testType: TestType,
  metric: string,
  value: number,
): CategoryLevel {
  const norm = NORMS[testType]?.[metric];
  if (!norm) return 'Sedang'; // fallback

  const { boundaries, higherIsBetter } = norm;

  if (higherIsBetter) {
    if (value < boundaries[0]) return LEVELS[0];
    if (value < boundaries[1]) return LEVELS[1];
    if (value < boundaries[2]) return LEVELS[2];
    if (value < boundaries[3]) return LEVELS[3];
    return LEVELS[4];
  } else {
    // Lower is better → reverse mapping
    if (value > boundaries[3]) return LEVELS[0]; // very high error = sangat rendah performance
    if (value > boundaries[2]) return LEVELS[1];
    if (value > boundaries[1]) return LEVELS[2];
    if (value > boundaries[0]) return LEVELS[3];
    return LEVELS[4];
  }
}

export function getNorms(testType: TestType) {
  return NORMS[testType];
}

