'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TEST_CONFIGS } from '@/config/tests';
import { generateAllColumns, createSessionSeed } from '@/lib/scoring';
import TestEngine from '@/components/test/TestEngine';
import { CheckCircle2, Play, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function PracticePage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const config = TEST_CONFIGS[params.type];
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startingReal, setStartingReal] = useState(false);

  // Generate practice columns client-side (not scored)
  const practiceSeed = useMemo(() => createSessionSeed(), []);
  const columns = useMemo(() => {
    if (!config) return [];
    return generateAllColumns(
      practiceSeed,
      config.practiceColumns,
      config.numbersPerColumn,
    );
  }, [config, practiceSeed]);

  if (!config) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Tipe tes tidak ditemukan.</p>
      </div>
    );
  }

  async function handleStartRealTest() {
    setStartingReal(true);
    toast.info('Menyiapkan sesi tes sungguhan...');
    try {
      const { createSession } = await import('@/lib/actions/session');
      const result = await createSession(params.type);
      if (result.error) {
        toast.error('Gagal Memulai Sesi', {
          description: result.error,
        });
        setStartingReal(false);
        return;
      }
      if (result.data) {
        toast.success('Sesi tes siap!', {
          description: 'Membuka lembar pengerjaan...',
        });
        router.push(`/tests/${params.type}/run/${result.data.sessionId}`);
      }
    } catch (err: unknown) {
      toast.error('Terjadi kesalahan', {
        description: err instanceof Error ? err.message : 'Silakan coba lagi.',
      });
      setStartingReal(false);
    }
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-md py-6">
        <Card className="text-center shadow-lg border-emerald-200 dark:border-emerald-900/60">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-sm">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <Badge variant="success" className="mx-auto mb-2">
              Latihan Selesai
            </Badge>
            <CardTitle className="text-2xl font-bold">
              Siap Mengerjakan Tes Sungguhan?
            </CardTitle>
            <CardDescription className="text-sm">
              Anda telah mencoba format 1 lajur latihan. Jawaban latihan tidak dinilai dan tidak disimpan ke profil.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pb-6">
            <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600 dark:bg-gray-800/60 dark:text-gray-300 text-left space-y-1">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Peringatan sebelum tes sungguhan:
              </p>
              <p>• Tes terdiri dari {config.totalColumns} lajur berurutan.</p>
              <p>• Durasi {config.secondsPerColumn} detik per lajur secara nonstop.</p>
              <p>• Nilai otomatis direkam dan dianalisis di profil akun Anda.</p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={handleStartRealTest}
              loading={startingReal}
              loadingText="Membuat sesi tes..."
              size="lg"
              className="w-full text-base font-semibold shadow-md shadow-indigo-600/20"
            >
              <Play className="h-4 w-4 fill-white mr-2" />
              <span>Mulai Tes Sungguhan</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              disabled={startingReal}
              onClick={() => {
                setStarted(true);
                setFinished(false);
              }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              <span>Ulangi Latihan</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-md py-6">
        <Card className="text-center shadow-lg">
          <CardHeader className="pb-3">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Sparkles className="h-7 w-7" />
            </div>
            <Badge variant="secondary" className="mx-auto mb-2">
              Simulasi Uji Coba
            </Badge>
            <CardTitle className="text-2xl font-bold">Sesi Latihan Mandiri</CardTitle>
            <CardDescription className="text-sm">
              Sesi latihan ini berisi {config.practiceColumns} lajur singkat untuk membiasakan kecepatan dan ritme sebelum tes sebenarnya.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pb-6">
            <div className="rounded-xl border border-dashed border-gray-300 p-4 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400">
              <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Cara menjawab:
              </p>
              <p>
                Tekan tombol angka pada keypad di bawah untuk menjumlahkan setiap pasangan angka berdampingan.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              onClick={() => setStarted(true)}
              size="lg"
              className="w-full text-base font-semibold shadow-md shadow-indigo-600/20"
            >
              <Play className="h-4 w-4 fill-white mr-2" />
              <span>Mulai Latihan Sekarang</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => router.push(`/tests/${params.type}/instructions`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Kembali ke Instruksi</span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <TestEngine
      sessionId="practice"
      columns={columns}
      config={config}
      isPractice
      onPracticeComplete={() => setFinished(true)}
    />
  );
}
