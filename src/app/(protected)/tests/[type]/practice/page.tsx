'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TEST_CONFIGS } from '@/config/tests';
import { generateAllColumns, createSessionSeed } from '@/lib/scoring';
import TestEngine from '@/components/test/TestEngine';
import { CheckCircle2, Play, ArrowLeft } from 'lucide-react';

export default function PracticePage() {
  const params = useParams<{ type: string }>();
  const router = useRouter();
  const config = TEST_CONFIGS[params.type];
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);

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
        <p className="text-gray-500">Tipe tes tidak ditemukan.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 shadow-sm">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Latihan Selesai!</h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Anda sudah siap untuk mengerjakan tes sungguhan. Jawaban latihan tidak
          dinilai.
        </p>
        <div className="space-y-3">
          <button
            onClick={async () => {
              const { createSession } = await import('@/lib/actions/session');
              const result = await createSession(params.type);
              if (result.data) {
                router.push(
                  `/tests/${params.type}/run/${result.data.sessionId}`,
                );
              }
            }}
            className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Mulai Tes Sungguhan</span>
          </button>
          <button
            onClick={() => router.push(`/tests/${params.type}/instructions`)}
            className="flex items-center justify-center gap-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Baca Instruksi Lagi</span>
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Sesi Latihan</h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Ini adalah latihan {config.practiceColumns} lajur. Jawaban tidak
          dinilai. Gunakan untuk membiasakan diri dengan format dan ritme tes.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>Mulai Latihan</span>
        </button>
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
