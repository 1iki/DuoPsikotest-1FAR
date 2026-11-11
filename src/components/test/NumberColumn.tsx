'use client';

import { useMemo, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface NumberColumnProps {
  digits: number[];
  answers: (number | null)[];
  currentPairIndex: number;
  isPractice?: boolean;
}

export default function NumberColumn({
  digits,
  answers,
  currentPairIndex,
  isPractice = false,
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

  // Keep active pair smoothly centered in viewport as user answers
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
      aria-label="Lajur angka psikotes"
    >
      <div className="w-full max-w-[270px] flex flex-col items-center gap-2">
        {pairs.map((pair) => {
          const isActive = pair.index === currentPairIndex;
          const isAnswered = pair.index < currentPairIndex;
          const answer = answers[pair.index];
          const expectedUnit = (pair.top + pair.bottom) % 10;
          const isCorrect = isAnswered && answer === expectedUnit;

          return (
            <div
              key={pair.index}
              ref={isActive ? activeRef : undefined}
              className={`flex w-full items-center justify-between rounded-2xl px-4 py-2 border transition-all duration-150 ${
                isActive
                  ? 'border-indigo-500 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/20 scale-[1.03] z-10 dark:bg-indigo-950/70 dark:border-indigo-400 dark:ring-indigo-400/25'
                  : 'border-transparent bg-white/70 dark:bg-gray-900/60'
              } ${isAnswered ? 'opacity-40' : ''}`}
              role="listitem"
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Pair calculation */}
              <div className="flex items-center gap-2.5 font-mono text-2xl tabular-nums">
                <span
                  className={`w-7 text-center font-bold transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {pair.top}
                </span>
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                  +
                </span>
                <span
                  className={`w-7 text-center font-bold transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {pair.bottom}
                </span>
              </div>

              {/* Answer box */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500">
                  =
                </span>
                <span
                  className={`relative flex h-11 w-11 items-center justify-center rounded-xl font-mono text-2xl font-bold tabular-nums transition-all ${
                    isActive
                      ? 'border-2 border-indigo-500 bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-400'
                      : isAnswered && answer !== null && answer !== undefined
                        ? isPractice
                          ? isCorrect
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-950/60 dark:text-red-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        : 'bg-gray-100/60 text-gray-400 dark:bg-gray-800/60 dark:text-gray-500'
                  }`}
                >
                  {answer !== null && answer !== undefined
                    ? answer
                    : isActive
                      ? '?'
                      : '·'}

                  {/* Practice mode instant visual validation badge */}
                  {isPractice && isAnswered && (
                    <span
                      className={`absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-white ${
                        isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    >
                      {isCorrect ? (
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      ) : (
                        <X className="h-2.5 w-2.5 stroke-[3]" />
                      )}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
