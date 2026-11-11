import { describe, it, expect } from 'vitest';
import {
  mulberry32,
  generateColumn,
  generateAllColumns,
  createSessionSeed,
} from '@/lib/scoring/seed';
import {
  correctAnswer,
  generateAnswerKey,
  checkAnswers,
} from '@/lib/scoring/checker';
import {
  calculateMetrics,
  mean,
  stdDev,
  linearRegressionSlope,
} from '@/lib/scoring/metrics';
import { categoriseAll } from '@/lib/scoring/categorize';
import { categorise } from '@/config/norms';
import { buildNarrativeSummary } from '@/config/interpretations';
import type { ColumnStats } from '@/types';

describe('Seed & PRNG Generator', () => {
  it('mulberry32 produces deterministic outputs for the same seed', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(12345);

    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());

    expect(seq1).toEqual(seq2);
  });

  it('mulberry32 produces different outputs for different seeds', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(67890);

    const val1 = rng1();
    const val2 = rng2();

    expect(val1).not.toEqual(val2);
  });

  it('generateColumn produces digits between 0 and 9', () => {
    const digits = generateColumn(42, 0, 50);
    expect(digits).toHaveLength(50);
    digits.forEach((d) => {
      expect(Number.isInteger(d)).toBe(true);
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(9);
    });
  });

  it('generateAllColumns produces expected column count and length', () => {
    const cols = generateAllColumns(100, 5, 20);
    expect(cols).toHaveLength(5);
    cols.forEach((col) => {
      expect(col).toHaveLength(20);
    });
  });

  it('createSessionSeed produces a positive integer', () => {
    const seed = createSessionSeed();
    expect(seed).toBeGreaterThan(0);
    expect(Number.isInteger(seed)).toBe(true);
  });
});

describe('Answer Checker & Answer Key Generator', () => {
  it('correctAnswer returns the ones digit of sum', () => {
    expect(correctAnswer(7, 8)).toBe(5); // 15 % 10 = 5
    expect(correctAnswer(0, 0)).toBe(0);
    expect(correctAnswer(9, 9)).toBe(8); // 18 % 10 = 8
    expect(correctAnswer(3, 4)).toBe(7);
  });

  it('generateAnswerKey generates n-1 pairs for n numbers', () => {
    const key = generateAnswerKey(42, 0, 50);
    expect(key).toHaveLength(49);
    key.forEach((k) => {
      expect(k).toBeGreaterThanOrEqual(0);
      expect(k).toBeLessThanOrEqual(9);
    });
  });

  it('checkAnswers correctly scores all correct answers', () => {
    const answerKey = [5, 2, 8, 1, 9];
    const userAnswers = [5, 2, 8, 1, 9];

    const result = checkAnswers(answerKey, userAnswers);
    expect(result).toEqual({
      rowsAnswered: 5,
      correct: 5,
      wrong: 0,
      skipped: 0,
    });
  });

  it('checkAnswers correctly scores all wrong answers', () => {
    const answerKey = [5, 2, 8, 1, 9];
    const userAnswers = [0, 0, 0, 0, 0];

    const result = checkAnswers(answerKey, userAnswers);
    expect(result).toEqual({
      rowsAnswered: 5,
      correct: 0,
      wrong: 5,
      skipped: 0,
    });
  });

  it('checkAnswers handles skipped/null answers correctly', () => {
    const answerKey = [5, 2, 8, 1, 9];
    const userAnswers = [5, null, 8, undefined as unknown as null]; // 2 answered (both correct), 3 skipped

    const result = checkAnswers(answerKey, userAnswers);
    expect(result.rowsAnswered).toBe(2);
    expect(result.correct).toBe(2);
    expect(result.wrong).toBe(0);
    expect(result.skipped).toBe(3);
  });
});

describe('Scoring Metrics Calculation', () => {
  it('handles edge case: empty session (0 columns)', () => {
    const metrics = calculateMetrics([]);
    expect(metrics).toEqual({
      speed: 0,
      accuracy: { totalErrors: 0, errorPercentage: 0 },
      consistency: { range: 0, standardDeviation: 0 },
      endurance: { halfDifference: 0, slope: 0 },
      workCurve: [],
    });
  });

  it('handles edge case: all correct (0 errors)', () => {
    const fixture: ColumnStats[] = [
      { columnIndex: 0, rowsAnswered: 20, correct: 20, wrong: 0, skipped: 0, durationMs: 30000 },
      { columnIndex: 1, rowsAnswered: 20, correct: 20, wrong: 0, skipped: 0, durationMs: 30000 },
    ];
    const metrics = calculateMetrics(fixture);

    expect(metrics.speed).toBe(20);
    expect(metrics.accuracy.totalErrors).toBe(0);
    expect(metrics.accuracy.errorPercentage).toBe(0);
    expect(metrics.consistency.range).toBe(0);
    expect(metrics.consistency.standardDeviation).toBe(0);
  });

  it('handles edge case: all wrong answers (100% error rate)', () => {
    const fixture: ColumnStats[] = [
      { columnIndex: 0, rowsAnswered: 10, correct: 0, wrong: 10, skipped: 0, durationMs: 30000 },
      { columnIndex: 1, rowsAnswered: 10, correct: 0, wrong: 10, skipped: 0, durationMs: 30000 },
    ];
    const metrics = calculateMetrics(fixture);

    expect(metrics.speed).toBe(10);
    expect(metrics.accuracy.totalErrors).toBe(20);
    expect(metrics.accuracy.errorPercentage).toBe(100);
  });

  it('handles edge case: odd number of columns (e.g. 5 columns)', () => {
    // 5 columns: midpoint = Math.floor(5 / 2) = 2
    // firstHalf = [10, 12] (mean = 11)
    // secondHalf = [14, 16, 18] (mean = 16)
    // halfDifference = 16 - 11 = 5
    const fixture: ColumnStats[] = [
      { columnIndex: 0, rowsAnswered: 10, correct: 10, wrong: 0, skipped: 0, durationMs: 30000 },
      { columnIndex: 1, rowsAnswered: 12, correct: 12, wrong: 0, skipped: 0, durationMs: 30000 },
      { columnIndex: 2, rowsAnswered: 14, correct: 14, wrong: 0, skipped: 0, durationMs: 30000 },
      { columnIndex: 3, rowsAnswered: 16, correct: 16, wrong: 0, skipped: 0, durationMs: 30000 },
      { columnIndex: 4, rowsAnswered: 18, correct: 18, wrong: 0, skipped: 0, durationMs: 30000 },
    ];
    const metrics = calculateMetrics(fixture);

    expect(metrics.speed).toBe(14); // (10+12+14+16+18)/5 = 14
    expect(metrics.consistency.range).toBe(8); // 18 - 10 = 8
    expect(metrics.endurance.halfDifference).toBe(5); // 16 - 11 = 5
    expect(metrics.endurance.slope).toBe(2); // strictly increasing by 2 each col
    expect(metrics.workCurve).toEqual([10, 12, 14, 16, 18]);
  });

  it('correctly calculates linear regression slope', () => {
    // Perfectly flat line
    expect(linearRegressionSlope([10, 10, 10, 10])).toBe(0);
    // Increasing line: slope = 3
    expect(linearRegressionSlope([0, 3, 6, 9])).toBe(3);
    // Decreasing line: slope = -1
    expect(linearRegressionSlope([5, 4, 3, 2, 1])).toBe(-1);
    // Single item or empty
    expect(linearRegressionSlope([5])).toBe(0);
    expect(linearRegressionSlope([])).toBe(0);
  });

  it('correctly calculates mean and stdDev', () => {
    expect(mean([])).toBe(0);
    expect(mean([10, 20, 30])).toBe(20);

    expect(stdDev([])).toBe(0);
    expect(stdDev([5])).toBe(0);
    // Population standard deviation of [10, 20]: avg = 15, diffs = [-5, 5], sq = [25, 25], meanSq = 25, sqrt = 5
    expect(stdDev([10, 20])).toBe(5);
  });
});

describe('Categorisation & Interpretations', () => {
  it('categorises speed properly (higher is better)', () => {
    // Kraepelin speed boundaries: [10, 15, 20, 25]
    expect(categorise('kraepelin', 'speed', 5)).toBe('Sangat Rendah');
    expect(categorise('kraepelin', 'speed', 12)).toBe('Rendah');
    expect(categorise('kraepelin', 'speed', 18)).toBe('Sedang');
    expect(categorise('kraepelin', 'speed', 22)).toBe('Tinggi');
    expect(categorise('kraepelin', 'speed', 30)).toBe('Sangat Tinggi');
  });

  it('categorises accuracy properly (lower error percentage is better)', () => {
    // Kraepelin accuracy boundaries: [5, 10, 20, 35]
    // > 35 error% = Sangat Rendah
    // 20-35 = Rendah
    // 10-20 = Sedang
    // 5-10 = Tinggi
    // < 5 = Sangat Tinggi
    expect(categorise('kraepelin', 'accuracy', 50)).toBe('Sangat Rendah');
    expect(categorise('kraepelin', 'accuracy', 25)).toBe('Rendah');
    expect(categorise('kraepelin', 'accuracy', 15)).toBe('Sedang');
    expect(categorise('kraepelin', 'accuracy', 8)).toBe('Tinggi');
    expect(categorise('kraepelin', 'accuracy', 2)).toBe('Sangat Tinggi');
  });

  it('categoriseAll produces a complete category set', () => {
    const metrics = {
      speed: 18,
      accuracy: { totalErrors: 2, errorPercentage: 5 },
      consistency: { range: 4, standardDeviation: 1.5 },
      endurance: { halfDifference: 1, slope: 0.5 },
      workCurve: [16, 17, 18, 19, 20],
    };

    const categories = categoriseAll('kraepelin', metrics);
    expect(categories.speed).toBeDefined();
    expect(categories.accuracy).toBeDefined();
    expect(categories.consistency).toBeDefined();
    expect(categories.endurance).toBeDefined();
  });

  it('buildNarrativeSummary generates 3-5 sentences with disclaimer', () => {
    const categories = {
      speed: 'Tinggi' as const,
      accuracy: 'Sangat Tinggi' as const,
      consistency: 'Sedang' as const,
      endurance: 'Tinggi' as const,
    };

    const summary = buildNarrativeSummary(categories, 'Tes Kraepelin');
    expect(summary).toContain('Tes Kraepelin');
    expect(summary.toLowerCase()).toContain('kecepatan');
    expect(summary).toContain('bukan diagnosis atau asesmen psikologis resmi');

    // Count sentences (approximated by dot count)
    const sentenceCount = (summary.match(/\./g) || []).length;
    expect(sentenceCount).toBeGreaterThanOrEqual(3);
    expect(sentenceCount).toBeLessThanOrEqual(6);
  });
});
