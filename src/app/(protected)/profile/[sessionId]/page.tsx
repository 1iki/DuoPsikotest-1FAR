import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSessionResult } from '@/lib/actions/session';
import type { AnalysisMetrics, AnalysisCategories } from '@/types';
import WorkCurveChart from '@/components/profile/WorkCurveChart';
import MetricCard from '@/components/profile/MetricCard';
import NarrativeSummary from '@/components/profile/NarrativeSummary';
import { ArrowLeft, ClipboardList, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    <div className="mx-auto max-w-xl space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Ringkasan Profil</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm">
          <ClipboardList className="h-7 w-7" />
        </div>
        <div>
          <Badge variant="secondary" className="mb-1 text-xs">
            Rincian Percobaan
          </Badge>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            {config?.label || session.test_type}
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Waktu pengerjaan:{' '}
            {new Date(session.started_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <MetricCard
          label="Kecepatan (Panker)"
          sublabel="Rata-rata kecepatan berhitung"
          value={metrics.speed.toString()}
          unit="jwb/lajur"
          category={categories.speed}
        />
        <MetricCard
          label="Ketelitian (Tianker)"
          sublabel="Tingkat kesalahan penjumlahan"
          value={`${metrics.accuracy.errorPercentage}%`}
          unit={`(${metrics.accuracy.totalErrors} salah)`}
          category={categories.accuracy}
          invertColor
        />
        <MetricCard
          label="Keajegan (Janker)"
          sublabel="Stabilitas ritme kerja"
          value={metrics.consistency.range.toString()}
          unit={`SD: ${metrics.consistency.standardDeviation}`}
          category={categories.consistency}
          invertColor
        />
        <MetricCard
          label="Ketahanan (Hanker)"
          sublabel="Kemiringan kurva kerja"
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
      <Card>
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-bold">Kurva Kerja (Work Curve)</CardTitle>
            <p className="text-xs text-gray-500">Fluktuasi pengerjaan sepanjang lajur</p>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            {metrics.workCurve.length} Lajur
          </Badge>
        </CardHeader>
        <CardContent className="pt-4">
          <WorkCurveChart data={metrics.workCurve} />
        </CardContent>
      </Card>

      {/* Narrative Summary */}
      {analysis.summary && <NarrativeSummary summary={analysis.summary} />}

      {/* Psychological Disclaimer */}
      <Alert variant="warning" className="border-amber-200/80 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <AlertDescription className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <strong>Disclaimer:</strong> Hasil tes ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi perusahaan/organisasi.
        </AlertDescription>
      </Alert>

      {/* Back CTA */}
      <div className="pt-2">
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/profile" className="flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Halaman Profil</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
