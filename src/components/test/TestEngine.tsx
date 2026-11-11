'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TestConfig } from '@/types';
import { submitColumn, completeSession } from '@/lib/actions/session';
import { COLUMN_TRANSITION_MS } from '@/config/tests';
import NumberColumn from './NumberColumn';
import Keypad from './Keypad';
import Timer from './Timer';
import {
  Trophy,
  Smartphone,
  Loader2,
  AlertCircle,
  CloudCheck,
} from 'lucide-react';
import { toast } from 'sonner';

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
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
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

  // Request wake lock so screen doesn't turn off
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

  // Prevent zoom and double-tap gestures
  useEffect(() => {
    const handler = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    document.addEventListener('touchstart', handler, { passive: false });
    return () => document.removeEventListener('touchstart', handler);
  }, []);

  // Landscape orientation detection & warning
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
    const durationMs =
      columnStartRef.current > 0 ? now - columnStartRef.current : 0;

    // Submit column results (skip for practice)
    if (!isPractice) {
      setSaveStatus('saving');
      try {
        const res = await submitColumn({
          sessionId,
          columnIndex: currentColumn,
          answers,
          durationMs,
        });
        if (res.error) {
          setSaveStatus('error');
          toast.error('Gagal Menyimpan Progres', {
            description: res.error,
          });
        } else {
          setSaveStatus('saved');
        }
      } catch {
        setSaveStatus('error');
      }
    }

    // Check if this was the last column
    if (currentColumn >= totalColumns - 1) {
      if (!isPractice) {
        setIsFinished(true);
        try {
          await completeSession(sessionId);
          toast.success('Tes Selesai!', {
            description: 'Memproses kurva kerja & analisis...',
          });
        } catch {
          // ignore error
        }
        setTimeout(() => {
          router.push(`/tests/${config.testType}/result/${sessionId}`);
        }, 800);
      } else {
        setIsFinished(true);
        onPracticeComplete?.();
      }
      return;
    }

    // Transition to next column after delay
    setTimeout(() => {
      setCurrentColumn((c) => c + 1);
      setAnswers([]);
      setCurrentPairIndex(0);
      columnStartRef.current = Date.now();
      setTimerKey((k) => k + 1);
      setIsTransitioning(false);
      setSaveStatus('idle');
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

      const maxPairs = (columns[currentColumn]?.length || 1) - 1;
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
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-md p-6 dark:bg-gray-950/95">
        <div className="text-center max-w-sm space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shadow-xl ring-8 ring-amber-50 dark:ring-amber-950/40">
            <Trophy className="h-10 w-10 animate-bounce" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-gray-100">
              Tes Telah Selesai!
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Perhitungan metrik kecepatan, ketelitian, keajegan, dan ketahanan sedang diproses...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold pt-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Mengarahkan ke laporan analisis...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLandscape) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-6 text-center dark:bg-gray-950">
        <div className="max-w-xs space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-md">
            <Smartphone className="h-8 w-8 animate-bounce" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Putar Perangkat Anda
          </h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Tes ini dirancang khusus dalam posisi portrait (tegak). Silakan tegakkan posisi ponsel cerdas Anda untuk melanjutkan.
          </p>
        </div>
      </div>
    );
  }

  const currentDigits = columns[currentColumn] || [];
  const answeredCount = answers.filter(
    (a) => a !== null && a !== undefined,
  ).length;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-gray-100 dark:bg-gray-950 overflow-hidden select-none">
      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col justify-between overflow-hidden bg-white dark:bg-gray-900 border-x border-gray-200/60 dark:border-gray-800/60 shadow-2xl">
        {/* Top Header bar with HUD info */}
        <div className="shrink-0 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 shadow-xs z-10">
          {/* Circular Countdown Timer */}
          <Timer
            key={timerKey}
            duration={secondsPerColumn}
            onTimeUp={handleTimeUp}
            running={!isTransitioning && !isFinished}
          />

          {/* Column Indicator */}
          <div className="text-center" aria-live="polite">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
              {isPractice ? 'Latihan' : 'Lajur'}
            </span>
            <p className="font-mono text-base font-extrabold tabular-nums text-gray-900 dark:text-gray-100">
              {currentColumn + 1}
              <span className="text-xs text-gray-400 font-normal">
                /{totalColumns}
              </span>
            </p>
          </div>

          {/* Answers & Autosave Indicator */}
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block">
              Dijawab
            </span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-base font-extrabold tabular-nums text-indigo-600 dark:text-indigo-400">
                {answeredCount}
              </span>
              {!isPractice && (
                <span title="Status Autosave">
                  {saveStatus === 'saving' && (
                    <Loader2 className="h-3 w-3 animate-spin text-amber-500" />
                  )}
                  {saveStatus === 'saved' && (
                    <CloudCheck className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                  {saveStatus === 'error' && (
                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Column transition overlay */}
        {isTransitioning && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/90 backdrop-blur-md dark:bg-gray-950/90 animate-in fade-in duration-200">
            <div className="text-center p-6 rounded-3xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-100 dark:border-gray-800 max-w-xs mx-4">
              <div className="mx-auto mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                <span>Pindah Lajur</span>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100 font-mono mb-1">
                Lajur {currentColumn + 2} / {totalColumns}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Bersiap untuk lajur berikutnya...
              </p>
            </div>
          </div>
        )}

        {/* Number column display (scrollable) */}
        <div className="relative flex-1 min-h-0 overflow-hidden bg-gray-50/60 dark:bg-gray-950/60">
          <NumberColumn
            digits={currentDigits}
            answers={answers}
            currentPairIndex={currentPairIndex}
            isPractice={isPractice}
          />
        </div>

        {/* Keypad — statically docked at the bottom of the user's screen */}
        <div className="shrink-0 w-full border-t border-gray-200/90 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-3 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] z-20">
          <Keypad
            onPress={handleKeyPress}
            disabled={isTransitioning || isFinished}
          />
        </div>
      </div>
    </div>
  );
}
