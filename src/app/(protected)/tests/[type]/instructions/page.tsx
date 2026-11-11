import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEST_CONFIGS, getEstimatedDuration } from '@/config/tests';

interface Props {
  params: Promise<{ type: string }>;
}

export default async function InstructionsPage({ params }: Props) {
  const { type } = await params;
  const config = TEST_CONFIGS[type];
  if (!config) notFound();

  const duration = getEstimatedDuration(config);

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-2 text-2xl font-bold">{config.label}</h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Baca instruksi berikut dengan cermat sebelum memulai tes.
      </p>

      <div className="mb-6 space-y-4">
        {/* Instruction cards */}
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="mb-2 font-semibold">📋 Cara Mengerjakan</h3>
          <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>
              Anda akan melihat deretan angka vertikal (lajur). Setiap lajur
              berisi {config.numbersPerColumn} angka.
            </li>
            <li>
              Jumlahkan dua angka yang berdampingan (atas + bawah), lalu masukkan{' '}
              <strong>hanya angka satuan</strong> hasilnya.
            </li>
            <li>
              Contoh: 7 + 8 = 15, jawaban yang dimasukkan adalah <strong>5</strong>.
            </li>
            <li>
              Setelah menjawab, kursor otomatis pindah ke pasangan berikutnya.
              Jawaban <strong>tidak bisa diedit</strong>.
            </li>
            <li>
              Setiap lajur punya waktu {config.secondsPerColumn} detik. Setelah
              waktu habis, otomatis pindah ke lajur berikutnya.
            </li>
          </ol>
        </div>

        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
          <h3 className="mb-2 font-semibold">⏱️ Detail Tes</h3>
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <p>
              <span className="text-gray-500">Jumlah lajur:</span>{' '}
              <strong>{config.totalColumns} lajur</strong>
            </p>
            <p>
              <span className="text-gray-500">Waktu per lajur:</span>{' '}
              <strong>{config.secondsPerColumn} detik</strong>
            </p>
            <p>
              <span className="text-gray-500">Estimasi total:</span>{' '}
              <strong>{duration}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <h3 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-300">
            ⚠️ Penting
          </h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
            <li>Tes <strong>tidak bisa di-pause</strong> setelah dimulai.</li>
            <li>Pastikan HP dalam posisi <strong>portrait</strong>.</li>
            <li>Pastikan baterai dan koneksi internet cukup.</li>
            <li>Jawab secepat dan seteliti mungkin.</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href={`/tests/${type}/practice`}
          className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Mulai Latihan ({config.practiceColumns} Lajur)
        </Link>
        <Link
          href="/tests"
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
        >
          Kembali
        </Link>
      </div>
    </div>
  );
}
