// ============================================================
// Categorisation — maps raw metrics to category levels
// ============================================================
import type {
  AnalysisCategories,
  AnalysisMetrics,
  TestType,
} from '@/types';
import { categorise } from '@/config/norms';

/**
 * Categorise all metrics for a given test type.
 */
export function categoriseAll(
  testType: TestType,
  metrics: AnalysisMetrics,
): AnalysisCategories {
  return {
    speed: categorise(testType, 'speed', metrics.speed),
    accuracy: categorise(testType, 'accuracy', metrics.accuracy.errorPercentage),
    consistency: categorise(testType, 'consistency', metrics.consistency.range),
    endurance: categorise(testType, 'endurance', metrics.endurance.slope),
  };
}
