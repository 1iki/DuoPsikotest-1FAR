// ============================================================
// Interpretive text for each metric × category level
// All text in Bahasa Indonesia.
// ============================================================
import type { CategoryLevel } from '@/types';

type InterpretationMap = Record<string, Record<CategoryLevel, string>>;

export const INTERPRETATIONS: InterpretationMap = {
  speed: {
    'Sangat Rendah':
      'Kecepatan kerja sangat lambat. Jumlah soal yang dijawab per lajur jauh di bawah rata-rata.',
    Rendah:
      'Kecepatan kerja di bawah rata-rata. Perlu peningkatan kecepatan dalam mengerjakan hitungan.',
    Sedang:
      'Kecepatan kerja cukup baik dan berada di kisaran rata-rata.',
    Tinggi:
      'Kecepatan kerja di atas rata-rata, menunjukkan kemampuan berhitung yang cepat.',
    'Sangat Tinggi':
      'Kecepatan kerja sangat tinggi. Mampu menyelesaikan banyak soal dalam waktu singkat.',
  },
  accuracy: {
    'Sangat Rendah':
      'Tingkat ketelitian sangat rendah dengan banyak kesalahan. Perlu lebih fokus pada ketepatan jawaban.',
    Rendah:
      'Ketelitian di bawah rata-rata. Cukup banyak kesalahan dalam perhitungan.',
    Sedang:
      'Ketelitian cukup baik dengan jumlah kesalahan yang wajar.',
    Tinggi:
      'Ketelitian baik, hanya sedikit kesalahan yang ditemukan.',
    'Sangat Tinggi':
      'Ketelitian sangat tinggi. Hampir tidak ada kesalahan dalam perhitungan.',
  },
  consistency: {
    'Sangat Rendah':
      'Konsistensi kerja sangat rendah. Jumlah jawaban antar lajur sangat fluktuatif.',
    Rendah:
      'Konsistensi kerja kurang stabil. Terdapat variasi cukup besar antar lajur.',
    Sedang:
      'Konsistensi kerja cukup stabil dengan variasi yang wajar antar lajur.',
    Tinggi:
      'Konsistensi kerja baik. Performa antar lajur relatif seragam.',
    'Sangat Tinggi':
      'Konsistensi kerja sangat baik. Performa hampir seragam di seluruh lajur.',
  },
  endurance: {
    'Sangat Rendah':
      'Ketahanan kerja sangat rendah. Terjadi penurunan drastis di separuh akhir tes.',
    Rendah:
      'Ketahanan kerja kurang baik. Performa cenderung menurun seiring waktu.',
    Sedang:
      'Ketahanan kerja cukup baik. Performa relatif terjaga walau ada sedikit penurunan.',
    Tinggi:
      'Ketahanan kerja baik. Performa stabil atau bahkan sedikit meningkat di separuh akhir.',
    'Sangat Tinggi':
      'Ketahanan kerja sangat baik. Performa konsisten meningkat atau sangat stabil hingga akhir tes.',
  },
};

/**
 * Build a 3-5 sentence narrative summary from the categories.
 */
export function buildNarrativeSummary(
  categories: Record<string, CategoryLevel>,
  testLabel: string,
): string {
  const parts: string[] = [];

  parts.push(
    `Berdasarkan hasil ${testLabel}, berikut adalah gambaran performa Anda.`,
  );

  const speedText = INTERPRETATIONS.speed[categories.speed];
  const accuracyText = INTERPRETATIONS.accuracy[categories.accuracy];
  const consistencyText = INTERPRETATIONS.consistency[categories.consistency];
  const enduranceText = INTERPRETATIONS.endurance[categories.endurance];

  parts.push(speedText);
  parts.push(accuracyText);
  parts.push(`${consistencyText} ${enduranceText}`);

  parts.push(
    'Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi.',
  );

  return parts.join(' ');
}
