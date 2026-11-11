import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSessionResult } from '@/lib/actions/session';
import type { AnalysisMetrics, AnalysisCategories } from '@/types';
import WorkCurveChart from '@/components/profile/WorkCurveChart';
import MetricCard from '@/components/profile/MetricCard';
import { BarChart3, AlertTriangle, ArrowLeft, User } from 'lucide-react';

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
        <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
          <BarChart3 className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Hasil Tes</h1>
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
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Kurva Kerja</h3>
        <WorkCurveChart data={metrics.workCurve} />
      </div>

      {/* Narrative Summary */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">Ringkasan Analisis</h3>
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          {analysis.summary}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/20 dark:text-yellow-300">
        <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
        <span>Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi.</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href="/tests"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali</span>
        </Link>
        <Link
          href="/profile"
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <User className="h-4 w-4" />
          <span>Lihat Profil</span>
        </Link>
      </div>
    </div>
  );
}
