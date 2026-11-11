import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSessionResult } from '@/lib/actions/session';
import type { AnalysisMetrics, AnalysisCategories } from '@/types';
import WorkCurveChart from '@/components/profile/WorkCurveChart';
import MetricCard from '@/components/profile/MetricCard';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ type: string; sessionId: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { sessionId } = await params;
  const result = await getSessionResult(sessionId);

  if (!result || !result.analysis) {
    notFound();
  }

  const { session, analysis } = result;
  const metrics = analysis.metrics as AnalysisMetrics;
  const categories = analysis.categories as AnalysisCategories;

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6 text-center">
        <div className="mb-2 text-3xl">📊</div>
        <h1 className="text-2xl font-bold">Hasil Tes</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {(session.config_snapshot as { label: string }).label} —{' '}
          {new Date(session.started_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
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
          value={metrics.endurance.slope >= 0 ? `+${metrics.endurance.slope}` : metrics.endurance.slope.toString()}
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
        <h3 className="mb-2 font-semibold">Ringkasan</h3>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {analysis.summary}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
        ⚠️ Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau
        asesmen psikologis resmi.
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/tests"
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
        >
          Kembali
        </Link>
        <Link
          href="/profile"
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Lihat Profil
        </Link>
      </div>
    </div>
  );
}

