'use client';

import type { CategoryLevel } from '@/types';

interface MetricCardProps {
  label: string;
  value: string;
  unit: string;
  category: CategoryLevel;
  invertColor?: boolean;
}

const CATEGORY_COLORS: Record<CategoryLevel, string> = {
  'Sangat Rendah': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Rendah: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Sedang: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Tinggi: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Sangat Tinggi': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export default function MetricCard({
  label,
  value,
  unit,
  category,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <p className="mb-1 font-mono text-2xl font-bold tabular-nums">{value}</p>
      <p className="mb-2 text-xs text-gray-500">{unit}</p>
      <span
        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[category]}`}
      >
        {category}
      </span>
    </div>
  );
}

