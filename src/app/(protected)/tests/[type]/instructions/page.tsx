import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEST_CONFIGS, getEstimatedDuration } from '@/config/tests';
import { BookOpen, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';

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
      <h1 className="mb-2 text-2xl font-bold tracking-tight">{config.label}</h1>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Baca instruksi berikut dengan cermat sebelum memulai tes.
      </p>

      <div className="mb-6 space-y-4">
        {/* Instruction cards */}
        <div className="rounded-xl border border-gray-200 bg-white p-4.5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Cara Mengerjakan</h3>
          </div>
          <ol className="list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
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

        <div className="rounded-xl border border-gray-200 bg-white p-4.5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Detail Tes</h3>
          </div>
          <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
            <p className="flex justify-between border-b border-gray-100 pb-1.5 dark:border-gray-800">
              <span className="text-gray-500">Jumlah lajur:</span>
              <strong className="font-mono">{config.totalColumns} lajur</strong>
            </p>
            <p className="flex justify-between border-b border-gray-100 pb-1.5 dark:border-gray-800">
              <span className="text-gray-500">Waktu per lajur:</span>
              <strong className="font-mono">{config.secondsPerColumn} detik</strong>
            </p>
            <p className="flex justify-between pt-0.5">
              <span className="text-gray-500">Estimasi total:</span>
              <strong>{duration}</strong>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4.5 dark:border-yellow-900/50 dark:bg-yellow-950/20">
          <div className="mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold">Penting</h3>
          </div>
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
          className="block w-full rounded-lg bg-blue-600 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          Mulai Latihan ({config.practiceColumns} Lajur)
        </Link>
        <Link
          href="/tests"
          className="flex items-center justify-center gap-1.5 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>
      </div>
    </div>
  );
}
