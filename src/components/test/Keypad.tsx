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
      // Ignore if user is inside an input/textarea
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
      className="grid grid-cols-5 gap-2 p-2 select-none"
      role="group"
      aria-label="Keypad angka"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => handlePress(digit)}
          disabled={disabled}
          className="flex h-14 w-full select-none touch-manipulation items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold tabular-nums shadow-sm transition-all active:scale-95 active:bg-blue-300 disabled:opacity-40 dark:bg-gray-800 dark:active:bg-blue-800 sm:h-16 sm:text-2xl"
          aria-label={`Angka ${digit}`}
          style={{ minWidth: 56, minHeight: 56 }}
        >
          {digit}
        </button>
      ))}
    </div>
  );
}
