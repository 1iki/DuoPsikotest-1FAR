import Link from 'next/link';
import { TEST_CONFIGS, getEstimatedDuration } from '@/config/tests';
import { getLatestSessionStatus } from '@/lib/actions/session';
import { Clock, ArrowRight, Zap, Flame, Info, CheckCircle2, History, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const dynamic = 'force-dynamic';

function formatStatus(status: string | null) {
  switch (status) {
    case 'completed':
      return {
        text: 'Selesai',
        variant: 'success' as const,
        icon: CheckCircle2,
      };
    case 'in_progress':
      return {
        text: 'Sedang Berlangsung',
        variant: 'warning' as const,
        icon: History,
      };
    case 'abandoned':
      return {
        text: 'Ditinggalkan',
        variant: 'destructive' as const,
        icon: AlertCircle,
      };
    default:
      return {
        text: 'Belum pernah',
        variant: 'secondary' as const,
        icon: History,
      };
  }
}

async function TestCard({ testType }: { testType: string }) {
  const config = TEST_CONFIGS[testType];
  const latestSession = await getLatestSessionStatus(testType);
  const status = formatStatus(latestSession?.status || null);
  const duration = getEstimatedDuration(config);
  const isKraepelin = testType === 'kraepelin';
  const StatusIcon = status.icon;

  return (
    <Card className="flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`rounded-xl p-2.5 shadow-xs ${
                isKraepelin
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
              }`}
            >
              {isKraepelin ? (
                <Zap className="h-5 w-5" />
              ) : (
                <Flame className="h-5 w-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{config.label}</CardTitle>
              <span className="text-[11px] text-gray-500 font-medium">
                {isKraepelin ? 'Kecepatan & Ketelitian' : 'Ketahanan & Keajegan'}
              </span>
            </div>
          </div>
          <Badge variant="outline" className="gap-1 font-mono text-xs">
            <Clock className="h-3 w-3 text-gray-500" />
            <span>{duration}</span>
          </Badge>
        </div>

        <CardDescription className="text-xs sm:text-sm pt-1">
          {config.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* Spec highlights */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-2.5 text-xs dark:bg-gray-800/50">
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">Total Lajur</span>
            <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
              {config.totalColumns} lajur
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] uppercase font-semibold">Durasi per Lajur</span>
            <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
              {config.secondsPerColumn} detik
            </span>
          </div>
        </div>

        {/* Previous attempt */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-gray-500">Percobaan terakhir:</span>
          <Badge variant={status.variant} className="gap-1 font-normal">
            <StatusIcon className="h-3 w-3" />
            <span>{status.text}</span>
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button asChild className="w-full font-semibold shadow-md shadow-indigo-600/20" size="lg">
          <Link href={`/tests/${testType}/instructions`} className="flex items-center justify-center gap-2">
            <span>Mulai Tes</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TestsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Pilih Uji Tes
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Pilih tes yang ingin dikerjakan. Pastikan Anda berada di lingkungan tenang dan siap fokus tanpa gangguan.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <TestCard testType="kraepelin" />
        <TestCard testType="pauli" />
      </div>

      <Alert variant="warning" className="border-amber-200/80 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <AlertDescription className="text-xs text-amber-900 dark:text-amber-200">
          <strong className="font-semibold">Perhatian Saat Mengerjakan:</strong> Gunakan perangkat ponsel cerdas dalam posisi potret. Sesi tes tidak dapat dijeda (pause) dan berlangsung tanpa henti hingga lajur terakhir.
        </AlertDescription>
      </Alert>
    </div>
  );
}
