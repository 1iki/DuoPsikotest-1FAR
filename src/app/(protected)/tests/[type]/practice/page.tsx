'use client';

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TEST_CONFIGS } from '@/config/tests';
import { generateAllColumns, createSessionSeed } from '@/lib/scoring';
import TestEngine from '@/components/test/TestEngine';

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
        <div className="mb-4 text-4xl">✅</div>
        <h2 className="mb-2 text-xl font-bold">Latihan Selesai!</h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Anda sudah siap untuk mengerjakan tes sungguhan. Jawaban latihan tidak
          dinilai.
        </p>
        <div className="space-y-3">
          <button
            onClick={async () => {
              // Create real session and redirect
              const { createSession } = await import('@/lib/actions/session');
              const result = await createSession(params.type);
              if (result.data) {
                router.push(
                  `/tests/${params.type}/run/${result.data.sessionId}`,
                );
              }
            }}
            className="block w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Mulai Tes Sungguhan
          </button>
          <button
            onClick={() => router.push(`/tests/${params.type}/instructions`)}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            Baca Instruksi Lagi
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto max-w-md py-12 text-center">
        <h2 className="mb-2 text-xl font-bold">Sesi Latihan</h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Ini adalah latihan {config.practiceColumns} lajur. Jawaban tidak
          dinilai. Gunakan untuk membiasakan diri dengan format tes.
        </p>
        <button
          onClick={() => setStarted(true)}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Mulai Latihan
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

