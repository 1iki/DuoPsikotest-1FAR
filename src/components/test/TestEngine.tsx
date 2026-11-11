'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TestConfig } from '@/types';
import { submitColumn, completeSession } from '@/lib/actions/session';
import { COLUMN_TRANSITION_MS } from '@/config/tests';
import NumberColumn from './NumberColumn';
import Keypad from './Keypad';
import Timer from './Timer';

interface TestEngineProps {
  sessionId: string;
  columns: number[][];
  config: TestConfig;
  startColumn?: number;
  isPractice?: boolean;
  onPracticeComplete?: () => void;
}

export default function TestEngine({
  sessionId,
  columns,
  config,
  startColumn = 0,
  isPractice = false,
  onPracticeComplete,
}: TestEngineProps) {
  const router = useRouter();
  const [currentColumn, setCurrentColumn] = useState(startColumn);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const columnStartRef = useRef<number>(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const totalColumns = isPractice ? config.practiceColumns : config.totalColumns;
  const secondsPerColumn = isPractice
    ? config.practiceSecondsPerColumn
    : config.secondsPerColumn;

  // Initialize start time on mount
  useEffect(() => {
    columnStartRef.current = Date.now();
  }, []);

  // Request wake lock
  useEffect(() => {
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch {
        // Wake lock not supported or denied
      }
    }
    requestWakeLock();

    return () => {
      wakeLockRef.current?.release();
    };
  }, []);

  // Prevent zoom and double-tap
  useEffect(() => {
    const handler = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', handler, { passive: false });
    return () => document.removeEventListener('touchstart', handler);
  }, []);

  // Landscape warning
  const [isLandscape, setIsLandscape] = useState(false);
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Submit column and advance
  const advanceColumn = useCallback(async () => {
    if (isTransitioning || isFinished) return;
    setIsTransitioning(true);

    const now = Date.now();
    const durationMs = columnStartRef.current > 0 ? now - columnStartRef.current : 0;

    // Submit column results (skip for practice)
    if (!isPractice) {
      await submitColumn({
        sessionId,
        columnIndex: currentColumn,
        answers,
        durationMs,
      });
    }

    // Check if this was the last column
    if (currentColumn >= totalColumns - 1) {
      if (!isPractice) {
        await completeSession(sessionId);
        setIsFinished(true);
        setTimeout(() => {
          router.push(`/tests/${config.testType}/result/${sessionId}`);
        }, 500);
      } else {
        setIsFinished(true);
        onPracticeComplete?.();
      }
      return;
    }

    // Transition to next column
    setTimeout(() => {
      setCurrentColumn((c) => c + 1);
      setAnswers([]);
      setCurrentPairIndex(0);
      columnStartRef.current = Date.now();
      setTimerKey((k) => k + 1);
      setIsTransitioning(false);
    }, COLUMN_TRANSITION_MS);
  }, [
    answers,
    currentColumn,
    isFinished,
    isPractice,
    isTransitioning,
    sessionId,
    totalColumns,
    config.testType,
    router,
    onPracticeComplete,
  ]);

  // Handle keypad press
  const handleKeyPress = useCallback(
    (digit: number) => {
      if (isTransitioning || isFinished) return;

      const maxPairs = columns[currentColumn].length - 1;
      if (currentPairIndex >= maxPairs) return;

      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentPairIndex] = digit;
        return newAnswers;
      });

      // Auto-advance to next pair
      if (currentPairIndex + 1 < maxPairs) {
        setCurrentPairIndex((i) => i + 1);
      }
    },
    [columns, currentColumn, currentPairIndex, isTransitioning, isFinished],
  );

  // Handle time up
  const handleTimeUp = useCallback(() => {
    advanceColumn();
  }, [advanceColumn]);

  if (isFinished && !isPractice) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6 dark:bg-gray-950">
        <div className="text-center">
          <div className="mb-4 text-5xl">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tes Selesai!</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Menghitung analisis & mengalihkan ke halaman hasil...
          </p>
        </div>
      </div>
    );
  }

  if (isLandscape) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6 text-center dark:bg-gray-950">
        <div className="max-w-xs">
          <div className="mb-4 text-5xl animate-bounce">📱</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Putar Perangkat Anda</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Tes ini dirancang khusus dalam posisi portrait (tegak). Silakan putar HP Anda ke posisi vertikal untuk melanjutkan.
          </p>
        </div>
      </div>
    );
  }

  const currentDigits = columns[currentColumn] || [];

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden select-none">
      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col justify-between overflow-hidden bg-white dark:bg-gray-900 border-x border-gray-200/60 dark:border-gray-800/60 shadow-2xl">
        {/* Top Header bar */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 shadow-sm z-10">
          <Timer
            key={timerKey}
            duration={secondsPerColumn}
            onTimeUp={handleTimeUp}
            running={!isTransitioning && !isFinished}
          />
          <div className="text-center" aria-live="polite">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">Lajur</span>
            <p className="font-mono text-base font-bold tabular-nums text-gray-900 dark:text-gray-100">
              {currentColumn + 1}<span className="text-xs text-gray-400 font-normal">/{totalColumns}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">Dijawab</span>
            <p className="font-mono text-base font-bold tabular-nums text-blue-600 dark:text-blue-400">
              {answers.filter((a) => a !== null && a !== undefined).length}
            </p>
          </div>
        </div>

        {/* Column transition overlay */}
        {isTransitioning && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/95 backdrop-blur-sm dark:bg-gray-950/95">
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 block mb-1">
                Lajur Berikutnya
              </span>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono">
                Lajur {currentColumn + 2} / {totalColumns}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Bersiap menghitung...</p>
            </div>
          </div>
        )}

        {/* Number column display (scrollable) */}
        <div className="relative flex-1 min-h-0 overflow-hidden bg-gray-50/50 dark:bg-gray-950/50">
          <NumberColumn
            digits={currentDigits}
            answers={answers}
            currentPairIndex={currentPairIndex}
          />
        </div>

        {/* Keypad — statically docked at the bottom of the user's screen */}
        <div className="shrink-0 w-full border-t border-gray-200/90 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2.5 pt-2.5 pb-[max(env(safe-area-inset-bottom),0.75rem)] z-20">
          <Keypad
            onPress={handleKeyPress}
            disabled={isTransitioning || isFinished}
          />
        </div>
      </div>
    </div>
  );
}
