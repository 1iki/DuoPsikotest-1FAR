// Barrel export for scoring module
export { mulberry32, generateColumn, generateAllColumns, createSessionSeed } from './seed';
export { correctAnswer, generateAnswerKey, checkAnswers } from './checker';
export type { CheckResult } from './checker';
export { calculateMetrics, mean, stdDev, linearRegressionSlope } from './metrics';
export { categoriseAll } from './categorize';
