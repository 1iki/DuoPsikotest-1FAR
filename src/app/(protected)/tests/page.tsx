import Link from 'next/link';
import { TEST_CONFIGS, getEstimatedDuration } from '@/config/tests';
import { getLatestSessionStatus } from '@/lib/actions/session';
import { Clock, ArrowRight, Zap, Flame, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatStatus(status: string | null): { text: string; color: string } {
  switch (status) {
    case 'completed':
      return { text: 'Selesai', color: 'text-emerald-600 dark:text-emerald-400' };
    case 'in_progress':
      return { text: 'Sedang Berlangsung', color: 'text-amber-600 dark:text-amber-400' };
    case 'abandoned':
      return { text: 'Ditinggalkan', color: 'text-red-600 dark:text-red-400' };
    default:
      return { text: 'Belum pernah', color: 'text-gray-500 dark:text-gray-400' };
  }
}

async function TestCard({ testType }: { testType: string }) {
  const config = TEST_CONFIGS[testType];
  const latestSession = await getLatestSessionStatus(testType);
  const status = formatStatus(latestSession?.status || null);
  const duration = getEstimatedDuration(config);
  const isKraepelin = testType === 'kraepelin';

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div>
        <div className="mb-3.5 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className={`rounded-lg p-2 ${isKraepelin ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'}`}>
              {isKraepelin ? <Zap className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{config.label}</h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <Clock className="h-3 w-3" />
            <span>{duration}</span>
          </span>
        </div>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {config.description}
        </p>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between text-xs border-t border-gray-100 pt-3 dark:border-gray-800">
          <span className="text-gray-500">Percobaan terakhir:</span>
          <span className={`font-semibold ${status.color}`}>{status.text}</span>
        </div>
        <Link
          href={`/tests/${testType}/instructions`}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          <span>Mulai Tes</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default function TestsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Pilih Tes</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Pilih tes yang ingin Anda kerjakan. Pastikan Anda dalam kondisi tenang
          dan siap fokus.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TestCard testType="kraepelin" />
        <TestCard testType="pauli" />
      </div>

      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/20 dark:text-yellow-300">
        <Info className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
        <div>
          <span className="font-bold">Tips Pengerjaan:</span> Gunakan HP dalam posisi portrait. Tes tidak bisa di-pause setelah dimulai. Pastikan baterai cukup dan koneksi internet stabil.
        </div>
      </div>
    </div>
  );
}
