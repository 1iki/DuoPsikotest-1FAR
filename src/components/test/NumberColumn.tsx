'use client';

import { useMemo, useRef, useEffect } from 'react';

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
  const activeRef = useRef<HTMLDivElement | null>(null);

  // Number of pairs = digits.length - 1
  const pairs = useMemo(() => {
    const result: { top: number; bottom: number; index: number }[] = [];
    for (let i = 0; i < digits.length - 1; i++) {
      result.push({ top: digits[i], bottom: digits[i + 1], index: i });
    }
    return result;
  }, [digits]);

  // Keep active pair centered in viewport as user progresses
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentPairIndex]);

  return (
    <div
      className="flex flex-col items-center overflow-y-auto px-2 py-4 scroll-smooth"
      style={{ maxHeight: 'calc(100vh - 270px)' }}
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
            ref={isActive ? activeRef : undefined}
            className={`flex w-full max-w-[220px] items-center justify-between border-b border-gray-100 px-3 py-1.5 transition-colors dark:border-gray-800 ${
              isActive
                ? 'rounded-xl bg-blue-50 font-bold ring-2 ring-blue-500/50 dark:bg-blue-900/40 dark:ring-blue-400/50'
                : ''
            } ${isAnswered ? 'opacity-40' : ''}`}
            role="listitem"
            aria-current={isActive ? 'true' : undefined}
          >
            {/* Pair calculation */}
            <div className="flex items-center gap-2 font-mono text-2xl tabular-nums">
              <span
                className={`w-7 text-center font-bold ${
                  isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : ''
                }`}
              >
                {pair.top}
              </span>
              <span className="text-sm font-normal text-gray-400">+</span>
              <span
                className={`w-7 text-center font-bold ${
                  isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : ''
                }`}
              >
                {pair.bottom}
              </span>
            </div>

            {/* Answer box */}
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-normal text-gray-400">=</span>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono text-xl font-bold tabular-nums transition-all ${
                  isActive
                    ? 'border-2 border-blue-500 bg-white text-blue-600 shadow-sm dark:bg-gray-900 dark:text-blue-400'
                    : isAnswered && answer !== null && answer !== undefined
                      ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      : 'bg-gray-50 text-gray-300 dark:bg-gray-900 dark:text-gray-600'
                }`}
              >
                {answer !== null && answer !== undefined
                  ? answer
                  : isActive
                    ? '?'
                    : '·'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
