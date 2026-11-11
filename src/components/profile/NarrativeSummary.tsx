'use client';

interface NarrativeSummaryProps {
  summary: string;
}

export default function NarrativeSummary({ summary }: NarrativeSummaryProps) {
  if (!summary) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-400">Belum ada ringkasan tersedia.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-2 font-semibold">Ringkasan Analisis</h3>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        {summary}
      </p>
    </div>
  );
}

