// ============================================================
// Answer checking — runs on server to prevent manipulation
// ============================================================
import { generateColumn } from './seed';

export interface CheckResult {
  rowsAnswered: number;
  correct: number;
  wrong: number;
  skipped: number;
}

/**
 * Compute the correct answer for a pair of adjacent digits.
 * The answer is the ones digit of (a + b).
 */
export function correctAnswer(a: number, b: number): number {
  return (a + b) % 10;
}

/**
 * Generate the full answer key for a column.
 * For n digits there are (n-1) adjacent pairs.
 */
export function generateAnswerKey(
  sessionSeed: number,
  columnIndex: number,
  numbersPerColumn: number,
): number[] {
  const digits = generateColumn(sessionSeed, columnIndex, numbersPerColumn);
  const key: number[] = [];
  for (let i = 0; i < digits.length - 1; i++) {
    key.push(correctAnswer(digits[i], digits[i + 1]));
  }
  return key;
}

/**
 * Check user answers against the server-generated answer key.
 * `answers` may contain null for unanswered pairs.
 */
export function checkAnswers(
  answerKey: number[],
  answers: (number | null)[],
): CheckResult {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let rowsAnswered = 0;

  for (let i = 0; i < answerKey.length; i++) {
    const userAnswer = i < answers.length ? answers[i] : null;
    if (userAnswer === null || userAnswer === undefined) {
      skipped++;
    } else {
      rowsAnswered++;
      if (userAnswer === answerKey[i]) {
        correct++;
      } else {
        wrong++;
      }
    }
  }

  return { rowsAnswered, correct, wrong, skipped };
}

