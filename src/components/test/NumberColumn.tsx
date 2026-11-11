'use client';

import { useMemo } from 'react';

interface NumberColumnProps {
  digits: number[];
  answers: (number | null)[];
  currentPairIndex: number;
}

export default function NumberColumn({
  digits,
  answers,
  currentPairIndex,
}: NumberColumnProps) {
  // Number of pairs = digits.length - 1
  const pairs = useMemo(() => {
    const result: { top: number; bottom: number; index: number }[] = [];
    for (let i = 0; i < digits.length - 1; i++) {
      result.push({ top: digits[i], bottom: digits[i + 1], index: i });
    }
    return result;
  }, [digits]);

  return (
    <div
      className="flex flex-col items-center overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 260px)' }}
      role="list"
      aria-label="Lajur angka"
    >
      {pairs.map((pair) => {
        const isActive = pair.index === currentPairIndex;
        const isAnswered = pair.index < currentPairIndex;
        const answer = answers[pair.index];

        return (
          <div
            key={pair.index}
            className={`flex w-full max-w-[200px] items-center justify-center gap-3 border-b border-gray-100 py-1 transition-colors dark:border-gray-800 ${
              isActive
                ? 'rounded-lg bg-blue-50 dark:bg-blue-900/30'
                : ''
            } ${isAnswered ? 'opacity-50' : ''}`}
            role="listitem"
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Top digit */}
            <span
              className={`w-8 text-center font-mono text-2xl font-bold tabular-nums ${
                isActive ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              {pair.top}
            </span>

            {/* Plus sign */}
            <span className="text-sm text-gray-400">+</span>

            {/* Bottom digit */}
            <span
              className={`w-8 text-center font-mono text-2xl font-bold tabular-nums ${
                isActive ? 'text-blue-600 dark:text-blue-400' : ''
              }`}
            >
              {pair.bottom}
            </span>

            {/* Answer / placeholder */}
            <span className="text-sm text-gray-400">=</span>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg font-mono text-xl font-bold tabular-nums ${
                isActive
                  ? 'border-2 border-blue-500 bg-white dark:bg-gray-900'
                  : isAnswered && answer !== null
                    ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    : 'bg-gray-50 text-gray-300 dark:bg-gray-900 dark:text-gray-600'
              }`}
            >
              {answer !== null && answer !== undefined ? answer : isActive ? '_' : '·'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
