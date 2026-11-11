import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSessionResult } from '@/lib/actions/session';
import type { AnalysisMetrics, AnalysisCategories } from '@/types';
import WorkCurveChart from '@/components/profile/WorkCurveChart';
import MetricCard from '@/components/profile/MetricCard';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ sessionId: string }>;
}

export default async function ProfileSessionDetailPage({ params }: Props) {
  const { sessionId } = await params;
  const result = await getSessionResult(sessionId);

  if (!result || !result.analysis) {
    notFound();
  }

  const { session, analysis } = result;
  const metrics = analysis.metrics as AnalysisMetrics;
  const categories = analysis.categories as AnalysisCategories;
  const config = session.config_snapshot as { label: string };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-4">
        <Link
          href="/profile"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Kembali ke Profil
        </Link>
      </div>

      <div className="mb-6 text-center">
        <div className="mb-2 text-3xl">📋</div>
        <h1 className="text-2xl font-bold">Detail Percobaan</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {config?.label || session.test_type} —{' '}
          {new Date(session.started_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <MetricCard
          label="Kecepatan (Panker)"
          value={metrics.speed.toString()}
          unit="jawaban/lajur"
          category={categories.speed}
        />
        <MetricCard
          label="Ketelitian (Tianker)"
          value={metrics.accuracy.errorPercentage.toString()}
          unit="% kesalahan"
          category={categories.accuracy}
          invertColor
        />
        <MetricCard
          label="Keajegan (Janker)"
          value={metrics.consistency.range.toString()}
          unit={`range (SD: ${metrics.consistency.standardDeviation})`}
          category={categories.consistency}
          invertColor
        />
        <MetricCard
          label="Ketahanan (Hanker)"
          value={
            metrics.endurance.slope >= 0
              ? `+${metrics.endurance.slope}`
              : metrics.endurance.slope.toString()
          }
          unit="slope"
          category={categories.endurance}
        />
      </div>

      {/* Work Curve */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 font-semibold">Kurva Kerja</h3>
        <WorkCurveChart data={metrics.workCurve} />
      </div>

      {/* Narrative Summary */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-2 font-semibold">Ringkasan Analisis</h3>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {analysis.summary}
        </p>
      </div>

      {/* Column Details Table */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-3 font-semibold">Rincian Per Lajur</h3>
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th className="py-1.5 px-2">Lajur</th>
                <th className="py-1.5 px-2">Dijawab</th>
                <th className="py-1.5 px-2">Benar</th>
                <th className="py-1.5 px-2">Salah</th>
                <th className="py-1.5 px-2">Terlewat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-mono">
              {result.columnResults.map((col) => (
                <tr key={col.column_index}>
                  <td className="py-1 px-2 font-semibold">{col.column_index + 1}</td>
                  <td className="py-1 px-2">{col.rows_answered}</td>
                  <td className="py-1 px-2 text-green-600">{col.correct}</td>
                  <td className="py-1 px-2 text-red-600">{col.wrong}</td>
                  <td className="py-1 px-2 text-yellow-600">{col.skipped}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
        ⚠️ Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau
        asesmen psikologis resmi.
      </div>

      <div className="flex gap-3">
        <Link
          href="/profile"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Kembali ke Profil
        </Link>
      </div>
    </div>
  );
}
