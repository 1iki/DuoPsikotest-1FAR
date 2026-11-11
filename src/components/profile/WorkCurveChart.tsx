'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WorkCurveChartProps {
  data: number[];
  height?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: number;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
        <p className="font-semibold text-gray-500">Lajur {label}</p>
        <p className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {payload[0].value} <span className="font-normal text-xs text-gray-600 dark:text-gray-400">jawaban</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function WorkCurveChart({
  data,
  height = 220,
}: WorkCurveChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-xs text-gray-400"
        style={{ height }}
      >
        Belum ada data kurva kerja untuk ditampilkan
      </div>
    );
  }

  const chartData = data.map((value, index) => ({
    lajur: index + 1,
    jawaban: value,
  }));

  return (
    <div className="w-full select-none" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.6} />
          <XAxis
            dataKey="lajur"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="jawaban"
            stroke="#4f46e5"
            strokeWidth={2.5}
            dot={{ r: 2.5, fill: '#4f46e5', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#4f46e5', stroke: '#c7d2fe', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
