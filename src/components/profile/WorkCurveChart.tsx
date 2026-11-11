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

export default function WorkCurveChart({
  data,
  height = 200,
}: WorkCurveChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-gray-400"
        style={{ height }}
      >
        Belum ada data kurva kerja
      </div>
    );
  }

  const chartData = data.map((value, index) => ({
    lajur: index + 1,
    jawaban: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="lajur"
          tick={{ fontSize: 10 }}
          label={{
            value: 'Lajur',
            position: 'insideBottom',
            offset: -5,
            fontSize: 11,
          }}
        />
        <YAxis
          tick={{ fontSize: 10 }}
          label={{
            value: 'Jawaban',
            angle: -90,
            position: 'insideLeft',
            fontSize: 11,
          }}
        />
        <Tooltip
          formatter={(value) => [Number(value ?? 0), 'Jawaban']}
          labelFormatter={(label) => `Lajur ${label}`}
        />
        <Line
          type="monotone"
          dataKey="jawaban"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 2 }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

