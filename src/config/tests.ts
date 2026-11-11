// ============================================================
// Test configuration — all tuneable parameters in one place
// ============================================================
import type { TestConfig } from '@/types';

export const TEST_CONFIGS: Record<string, TestConfig> = {
  kraepelin: {
    testType: 'kraepelin',
    label: 'Tes Kraepelin',
    description:
      'Tes kecepatan dan ketelitian berhitung. Jumlahkan dua angka berdampingan dan masukkan angka satuan hasilnya. Durasi sekitar 20 menit.',
    totalColumns: 40,
    secondsPerColumn: 30,
    numbersPerColumn: 50,
    practiceColumns: 1,
    practiceSecondsPerColumn: 30,
  },
  pauli: {
    testType: 'pauli',
    label: 'Tes Pauli',
    description:
      'Mirip Kraepelin dengan durasi lebih panjang per lajur. Mengukur ketahanan dan konsistensi kerja. Durasi sekitar 40 menit.',
    totalColumns: 40,
    secondsPerColumn: 60,
    numbersPerColumn: 60,
    practiceColumns: 1,
    practiceSecondsPerColumn: 60,
  },
} as const;

/** Transition duration between columns in milliseconds */
export const COLUMN_TRANSITION_MS = 1000;

/** Session is marked abandoned after this many ms of inactivity */
export const ABANDON_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/** Minimum touch-target size for keypad buttons (px) */
export const KEYPAD_BUTTON_SIZE = 56;

/** Maximum content width for the test screen (px) */
export const TEST_MAX_WIDTH = 480;

export function getTestConfig(testType: string): TestConfig | undefined {
  return TEST_CONFIGS[testType];
}

export function getEstimatedDuration(config: TestConfig): string {
  const totalSeconds = config.totalColumns * config.secondsPerColumn;
  const minutes = Math.ceil(totalSeconds / 60);
  return `~${minutes} menit`;
}
