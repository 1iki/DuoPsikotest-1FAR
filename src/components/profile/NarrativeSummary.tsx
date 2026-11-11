'use client';

import { Sparkles } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface NarrativeSummaryProps {
  summary: string;
}

export default function NarrativeSummary({ summary }: NarrativeSummaryProps) {
  if (!summary) {
    return (
      <Card>
        <CardContent className="p-5 text-center text-sm text-gray-400">
          Belum ada ringkasan analisis tersedia.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:border-indigo-900/50 dark:from-gray-900 dark:via-indigo-950/20 dark:to-gray-900 shadow-sm">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="h-4 w-4" />
          <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Interpretasi Psikologis
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-sans">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
