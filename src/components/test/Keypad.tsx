'use client';

import { useCallback } from 'react';

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

  return (
    <div
      className="grid grid-cols-5 gap-2 p-2"
      role="group"
      aria-label="Keypad angka"
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((digit) => (
        <button
          key={digit}
          type="button"
          onClick={() => handlePress(digit)}
          disabled={disabled}
          className="flex h-14 w-full items-center justify-center rounded-xl bg-gray-100 text-xl font-bold tabular-nums transition-all active:scale-95 active:bg-blue-200 disabled:opacity-40 dark:bg-gray-800 dark:active:bg-blue-800 sm:h-16 sm:text-2xl"
          aria-label={`Angka ${digit}`}
          style={{ minWidth: 56, minHeight: 56 }}
        >
          {digit}
        </button>
      ))}
    </div>
  );
}
