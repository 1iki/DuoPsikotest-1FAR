'use client';

import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  /** Duration in seconds */
  duration: number;
  /** Called when timer reaches zero */
  onTimeUp: () => void;
  /** Reset trigger — increment to restart */
  resetKey: number;
  /** Whether timer is running */
  running: boolean;
}

export default function Timer({
  duration,
  onTimeUp,
  resetKey,
  running,
}: TimerProps) {
  const [remaining, setRemaining] = useState(duration);
  const startRef = useRef<number>(0);
  const frameRef = useRef<number>(0);
  const calledRef = useRef(false);

  useEffect(() => {
    setRemaining(duration);
    calledRef.current = false;
    if (!running) return;

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = (now - startRef.current) / 1000;
      const left = Math.max(0, duration - elapsed);
      setRemaining(left);

      if (left <= 0 && !calledRef.current) {
        calledRef.current = true;
        onTimeUp();
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameRef.current);
  }, [duration, resetKey, running, onTimeUp]);

  // Circle progress
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = remaining / duration;
  const offset = circumference * (1 - progress);

  const seconds = Math.ceil(remaining);
  const isUrgent = seconds <= 5;

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="rotate-[-90deg]"
      >
        {/* Background circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`transition-colors ${
            isUrgent
              ? 'text-red-500'
              : 'text-blue-500'
          }`}
        />
      </svg>
      <span
        className={`min-w-[2ch] text-right font-mono text-lg font-bold tabular-nums ${
          isUrgent ? 'text-red-500' : ''
        }`}
      >
        {seconds}
      </span>
    </div>
  );
}
