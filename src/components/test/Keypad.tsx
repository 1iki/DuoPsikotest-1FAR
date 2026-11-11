'use client';

import { useCallback, useEffect } from 'react';

interface KeypadProps {
  onPress: (digit: number) => void;
  disabled?: boolean;
}

export default function Keypad({ onPress, disabled = false }: KeypadProps) {
  const handlePress = useCallback(
    (digit: number) => {
      if (!disabled) {
        onPress(digit);
      }
    },
    [onPress, disabled],
  );

  // Allow physical keyboard 0-9 on desktop/laptop devices
  useEffect(() => {
    if (disabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 0 && num <= 9) {
        onPress(num);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, onPress]);

  return (
    <div
      className="grid grid-cols-5 gap-1.5 sm:gap-2.5 w-full select-none"
      role="group"
      aria-label="Keypad angka"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => handlePress(digit)}
          disabled={disabled}
          className="flex h-14 sm:h-16 w-full select-none touch-manipulation items-center justify-center rounded-xl bg-gray-100/90 text-2xl font-bold tabular-nums text-gray-900 border border-gray-200/80 shadow-sm transition-all active:scale-95 active:bg-blue-600 active:text-white active:border-blue-600 disabled:opacity-30 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:active:bg-blue-600 dark:active:border-blue-500"
          aria-label={`Angka ${digit}`}
        >
          {digit}
        </button>
      ))}
    </div>
  );
}
