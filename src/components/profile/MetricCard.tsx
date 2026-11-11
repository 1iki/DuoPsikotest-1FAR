'use client';

import type { CategoryLevel } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  sublabel?: string;
  value: string;
  unit: string;
  category: CategoryLevel;
  invertColor?: boolean;
}

function getBadgeVariant(category: CategoryLevel) {
  switch (category) {
    case 'Sangat Tinggi':
      return 'info' as const;
    case 'Tinggi':
      return 'success' as const;
    case 'Sedang':
      return 'warning' as const;
    case 'Rendah':
      return 'destructive' as const;
    case 'Sangat Rendah':
      return 'destructive' as const;
    default:
      return 'secondary' as const;
  }
}

export default function MetricCard({
  label,
  sublabel,
  value,
  unit,
  category,
}: MetricCardProps) {
  const badgeVariant = getBadgeVariant(category);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              {label}
            </span>
          </div>
          {sublabel && (
            <p className="text-[11px] text-gray-400 mb-2 leading-tight">
              {sublabel}
            </p>
          )}
          <div className="flex items-baseline gap-1.5 my-1">
            <span className="font-mono text-2xl sm:text-3xl font-black tabular-nums text-gray-900 dark:text-gray-100">
              {value}
            </span>
            <span className="text-xs text-gray-500 font-medium">{unit}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 mt-2 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Tingkat:</span>
          <Badge variant={badgeVariant} className="font-semibold text-[11px]">
            {category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
