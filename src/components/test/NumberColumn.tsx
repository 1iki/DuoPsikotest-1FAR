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
      className="h-full w-full overflow-y-auto px-4 py-16 scroll-smooth overscroll-contain flex flex-col items-center"
      role="list"
      aria-label="Lajur angka"
    >
      <div className="w-full max-w-[260px] flex flex-col items-center gap-1.5">
        {pairs.map((pair) => {
          const isActive = pair.index === currentPairIndex;
          const isAnswered = pair.index < currentPairIndex;
          const answer = answers[pair.index];

          return (
            <div
              key={pair.index}
              ref={isActive ? activeRef : undefined}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-2 border transition-all ${
                isActive
                  ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/30 scale-105 z-10 dark:bg-blue-950/60 dark:border-blue-400 dark:ring-blue-400/30'
                  : 'border-transparent bg-white/70 dark:bg-gray-900/60'
              } ${isAnswered ? 'opacity-35' : ''}`}
              role="listitem"
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Pair calculation */}
              <div className="flex items-center gap-2.5 font-mono text-2xl tabular-nums">
                <span
                  className={`w-7 text-center font-bold ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {pair.top}
                </span>
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">+</span>
                <span
                  className={`w-7 text-center font-bold ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {pair.bottom}
                </span>
              </div>

              {/* Answer box */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">=</span>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl font-mono text-2xl font-bold tabular-nums transition-all ${
                    isActive
                      ? 'border-2 border-blue-500 bg-white text-blue-600 shadow-sm dark:bg-gray-900 dark:text-blue-400'
                      : isAnswered && answer !== null && answer !== undefined
                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        : 'bg-gray-100/60 text-gray-400 dark:bg-gray-800/60 dark:text-gray-500'
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
    </div>
  );
}
