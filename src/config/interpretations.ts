// ============================================================
// Interpretive text for each metric × category level
// All text in Bahasa Indonesia.
// ============================================================
import type { CategoryLevel, AnalysisCategories } from '@/types';

type InterpretationMap = Record<string, Record<CategoryLevel, string>>;

export const INTERPRETATIONS: InterpretationMap = {
  speed: {
    'Sangat Rendah':
      'Kecepatan kerja tergolong sangat lambat dan berada jauh di bawah rata-rata.',
    Rendah:
      'Kecepatan kerja berada di bawah rata-rata dan perlu ditingkatkan.',
    Sedang:
      'Kecepatan kerja cukup baik serta berada dalam kisaran rata-rata.',
    Tinggi:
      'Kecepatan kerja di atas rata-rata dengan ritme berhitung yang cepat.',
    'Sangat Tinggi':
      'Kecepatan kerja sangat tinggi dan mampu menyelesaikan banyak soal dengan cepat.',
  },
  accuracy: {
    'Sangat Rendah':
      'Ketelitian tergolong sangat rendah dengan banyak kesalahan perhitungan.',
    Rendah:
      'Ketelitian masih di bawah rata-rata dengan tingkat kesalahan yang cukup tinggi.',
    Sedang:
      'Ketelitian cukup baik dengan jumlah kesalahan yang tergolong wajar.',
    Tinggi:
      'Ketelitian baik dan hanya terdapat sedikit kesalahan.',
    'Sangat Tinggi':
      'Ketelitian sangat tinggi dengan akurasi pengerjaan yang hampir sempurna.',
  },
  consistency: {
    'Sangat Rendah':
      'konsistensi kerja sangat fluktuatif antar lajur',
    Rendah:
      'konsistensi kerja kurang stabil antar lajur',
    Sedang:
      'konsistensi kerja cukup stabil di setiap lajur',
    Tinggi:
      'konsistensi kerja baik dan seragam antar lajur',
    'Sangat Tinggi':
      'konsistensi kerja sangat stabil dan merata di seluruh lajur',
  },
  endurance: {
    'Sangat Rendah':
      'ketahanan menurun drastis menjelang akhir tes.',
    Rendah:
      'ketahanan cenderung menurun seiring berjalannya tes.',
    Sedang:
      'ketahanan relatif terjaga hingga akhir tes.',
    Tinggi:
      'ketahanan prima dan performa stabil hingga akhir tes.',
    'Sangat Tinggi':
      'ketahanan sangat prima dengan performa yang terus meningkat hingga akhir.',
  },
};

/**
 * Build a 3-5 sentence narrative summary from the categories.
 */
export function buildNarrativeSummary(
  categories: AnalysisCategories | Record<string, CategoryLevel>,
  testLabel: string,
): string {
  const speedText = INTERPRETATIONS.speed[categories.speed];
  const accuracyText = INTERPRETATIONS.accuracy[categories.accuracy];
  const consistencyText = INTERPRETATIONS.consistency[categories.consistency];
  const enduranceText = INTERPRETATIONS.endurance[categories.endurance];

  // Exactly 4 sentences (meets 3-5 sentence requirement)
  return [
    `Pada ${testLabel}, ${speedText.toLowerCase()}`,
    accuracyText,
    `Tingkat ${consistencyText}, serta ${enduranceText}`,
    'Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi.',
  ].join(' ');
}
