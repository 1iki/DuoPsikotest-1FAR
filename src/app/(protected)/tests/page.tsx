import Link from 'next/link';
import { TEST_CONFIGS, getEstimatedDuration } from '@/config/tests';
import { getLatestSessionStatus } from '@/lib/actions/session';

function formatStatus(status: string | null): { text: string; color: string } {
  switch (status) {
    case 'completed':
      return { text: 'Selesai', color: 'text-green-600 dark:text-green-400' };
    case 'in_progress':
      return { text: 'Sedang Berlangsung', color: 'text-yellow-600 dark:text-yellow-400' };
    case 'abandoned':
      return { text: 'Ditinggalkan', color: 'text-red-600 dark:text-red-400' };
    default:
      return { text: 'Belum pernah', color: 'text-gray-500 dark:text-gray-500' };
  }
}

async function TestCard({ testType }: { testType: string }) {
  const config = TEST_CONFIGS[testType];
  const latestSession = await getLatestSessionStatus(testType);
  const status = formatStatus(latestSession?.status || null);
  const duration = getEstimatedDuration(config);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-3 flex items-start justify-between">
        <h2 className="text-lg font-bold">{config.label}</h2>
        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {duration}
        </span>
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {config.description}
      </p>
      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-gray-500">Percobaan terakhir:</span>
        <span className={`font-medium ${status.color}`}>{status.text}</span>
      </div>
      <Link
        href={`/tests/${testType}/instructions`}
        className="block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Mulai Tes
      </Link>
    </div>
  );
}

export default function TestsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pilih Tes</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Pilih tes yang ingin Anda kerjakan. Pastikan Anda dalam kondisi tenang
          dan siap fokus.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TestCard testType="kraepelin" />
        <TestCard testType="pauli" />
      </div>

      <div className="mt-6 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
        <strong>Tips:</strong> Gunakan HP dalam posisi portrait. Tes tidak bisa
        di-pause setelah dimulai. Pastikan baterai cukup dan koneksi internet
        stabil.
      </div>
    </div>
  );
}
