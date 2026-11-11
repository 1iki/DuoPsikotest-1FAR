// ============================================================
// Metrics calculation — pure functions, fully testable
// ============================================================
import type { AnalysisMetrics, ColumnStats } from '@/types';

/**
 * Calculate all analysis metrics from column-level stats.
 */
export function calculateMetrics(columns: ColumnStats[]): AnalysisMetrics {
  if (columns.length === 0) {
    return {
      speed: 0,
      accuracy: { totalErrors: 0, errorPercentage: 0 },
      consistency: { range: 0, standardDeviation: 0 },
      endurance: { halfDifference: 0, slope: 0 },
      workCurve: [],
    };
  }

  const answeredPerColumn = columns.map((c) => c.rowsAnswered);
  const workCurve = answeredPerColumn;

  // --- Panker: Kecepatan (Speed) ---
  const speed = mean(answeredPerColumn);

  // --- Tianker: Ketelitian (Accuracy) ---
  const totalErrors = columns.reduce((sum, c) => sum + c.wrong + c.skipped, 0);
  const totalAnswered = columns.reduce((sum, c) => sum + c.rowsAnswered, 0);
  const errorPercentage =
    totalAnswered > 0 ? (totalErrors / totalAnswered) * 100 : 0;

  // --- Janker: Keajegan (Consistency) ---
  const maxAnswered = Math.max(...answeredPerColumn);
  const minAnswered = Math.min(...answeredPerColumn);
  const range = maxAnswered - minAnswered;
  const standardDeviation = stdDev(answeredPerColumn);

  // --- Hanker: Ketahanan (Endurance) ---
  const midpoint = Math.floor(columns.length / 2);
  const firstHalf = answeredPerColumn.slice(0, midpoint);
  const secondHalf = answeredPerColumn.slice(midpoint);
  const halfDifference = mean(secondHalf) - mean(firstHalf);
  const slope = linearRegressionSlope(answeredPerColumn);

  return {
    speed: round2(speed),
    accuracy: {
      totalErrors,
      errorPercentage: round2(errorPercentage),
    },
    consistency: {
      range,
      standardDeviation: round2(standardDeviation),
    },
    endurance: {
      halfDifference: round2(halfDifference),
      slope: round2(slope),
    },
    workCurve,
  };
}

// ---------- Helper math functions ----------

export function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function stdDev(arr: number[]): number {
  if (arr.length <= 1) return 0;
  const avg = mean(arr);
  const squareDiffs = arr.map((v) => (v - avg) ** 2);
  // Population standard deviation
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / arr.length);
}

/**
 * Compute the slope of the least-squares regression line.
 * x = 0, 1, 2, …, n-1; y = values
 */
export function linearRegressionSlope(values: number[]): number {
  const n = values.length;
  if (n <= 1) return 0;

  const xMean = (n - 1) / 2;
  const yMean = mean(values);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    const dx = i - xMean;
    numerator += dx * (values[i] - yMean);
    denominator += dx * dx;
  }

  if (denominator === 0) return 0;
  return numerator / denominator;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

