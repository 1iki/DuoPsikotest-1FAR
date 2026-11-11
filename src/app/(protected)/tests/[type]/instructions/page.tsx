import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TEST_CONFIGS, getEstimatedDuration } from '@/config/tests';
import { BookOpen, Clock, AlertTriangle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  params: Promise<{ type: string }>;
}

export default async function InstructionsPage({ params }: Props) {
  const { type } = await params;
  const config = TEST_CONFIGS[type];
  if (!config) notFound();

  const duration = getEstimatedDuration(config);
  const isKraepelin = type === 'kraepelin';

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="secondary" className="text-xs">
            {isKraepelin ? 'Tes Kraepelin' : 'Tes Pauli'}
          </Badge>
          <Badge variant="outline" className="text-xs font-mono">
            {duration}
          </Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Petunjuk Pengerjaan
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Pelajari aturan dan mekanisme berikut sebelum memulai sesi latihan.
        </p>
      </div>

      {/* Instructions Card */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BookOpen className="h-5 w-5" />
            <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
              Aturan & Mekanisme
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3.5 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              1
            </span>
            <p className="leading-relaxed">
              Anda akan melihat kolom vertikal (lajur) berisi deretan angka acak 0–9. Setiap lajur memuat{' '}
              <strong className="text-gray-900 dark:text-gray-100">{config.numbersPerColumn} angka</strong>.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              2
            </span>
            <p className="leading-relaxed">
              Jumlahkan dua angka yang berdampingan, lalu ketik{' '}
              <strong className="text-gray-900 dark:text-gray-100 underline decoration-indigo-400 decoration-2">
                HANYA angka satuan
              </strong>{' '}
              dari hasil penjumlahan tersebut.
            </p>
          </div>

          {/* Example Box */}
          <div className="ml-9 rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-xs dark:border-indigo-900/50 dark:bg-indigo-950/30">
            <p className="font-semibold text-indigo-950 dark:text-indigo-200 mb-1">
              Contoh Penjumlahan:
            </p>
            <div className="grid grid-cols-2 gap-2 text-indigo-900 dark:text-indigo-300 font-mono">
              <div className="rounded-lg bg-white/80 p-2 dark:bg-gray-900/80">
                <span>7 + 8 = 15</span> → ketik <strong>5</strong>
              </div>
              <div className="rounded-lg bg-white/80 p-2 dark:bg-gray-900/80">
                <span>4 + 3 = 7</span> → ketik <strong>7</strong>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              3
            </span>
            <p className="leading-relaxed">
              Gunakan keypad di layar. Setelah memasukkan 1 digit, sistem otomatis maju ke pasangan berikutnya.{' '}
              <span className="text-amber-700 font-medium dark:text-amber-400">
                Jawaban tidak dapat diedit atau dibatalkan.
              </span>
            </p>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              4
            </span>
            <p className="leading-relaxed">
              Setiap lajur memiliki durasi tetap{' '}
              <strong className="text-gray-900 dark:text-gray-100">{config.secondsPerColumn} detik</strong>.
              Ketika waktu lajur habis, layar akan berpindah otomatis ke lajur berikutnya.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test details */}
      <Card>
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Clock className="h-5 w-5" />
            <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
              Spesifikasi Pengerjaan
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-gray-100 dark:divide-gray-800 text-sm">
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Jumlah Total Lajur:</span>
            <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
              {config.totalColumns} lajur
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Durasi per Lajur:</span>
            <span className="font-mono font-bold text-gray-900 dark:text-gray-100">
              {config.secondsPerColumn} detik
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Estimasi Total Durasi:</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {duration}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Alert variant="warning" className="border-amber-200/80 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <AlertTitle className="text-xs font-bold text-amber-900 dark:text-amber-200">
            Peringatan Penting
          </AlertTitle>
          <AlertDescription className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
            Tes ini tidak dapat dijeda. Pastikan ponsel Anda dalam orientasi portrait, daya baterai mencukupi, dan notifikasi dinonaktifkan sementara.
          </AlertDescription>
        </div>
      </Alert>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <Button asChild size="lg" className="w-full font-semibold shadow-md shadow-indigo-600/20">
          <Link href={`/tests/${type}/practice`} className="flex items-center justify-center gap-2">
            <span>Mulai Sesi Latihan ({config.practiceColumns} Lajur)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/tests" className="flex items-center justify-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Pilihan Tes</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
