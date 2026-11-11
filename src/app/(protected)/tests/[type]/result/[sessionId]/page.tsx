import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSessionResult } from '@/lib/actions/session';
import type { AnalysisMetrics, AnalysisCategories } from '@/types';
import WorkCurveChart from '@/components/profile/WorkCurveChart';
import MetricCard from '@/components/profile/MetricCard';
import NarrativeSummary from '@/components/profile/NarrativeSummary';
import { Trophy, AlertTriangle, ArrowLeft, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ type: string; sessionId: string }>;
}

export default async function ResultPage({ params }: Props) {
  const { type, sessionId } = await params;
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
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shadow-md ring-8 ring-amber-50 dark:ring-amber-950/30">
          <Trophy className="h-8 w-8" />
        </div>
        <div>
          <Badge variant="success" className="mb-1 text-xs">
            Tes Berhasil Diselesaikan
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Laporan Hasil Tes
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            {config?.label || type} —{' '}
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

      {/* Work Curve Card */}
      <Card>
        <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base font-bold">Kurva Kerja (Work Curve)</CardTitle>
            <p className="text-xs text-gray-500">Jumlah jawaban benar/selesai tiap lajur</p>
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
          <strong>Disclaimer:</strong> Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi.
        </AlertDescription>
      </Alert>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/tests" className="flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Pilihan Tes</span>
          </Link>
        </Button>
        <Button asChild size="lg" className="w-full shadow-md shadow-indigo-600/20">
          <Link href="/profile" className="flex items-center justify-center gap-2">
            <User className="h-4 w-4" />
            <span>Lihat di Profil</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
