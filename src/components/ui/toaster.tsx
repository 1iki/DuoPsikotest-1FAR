'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        className:
          '!rounded-2xl !border !border-gray-200 !bg-white !text-gray-900 !shadow-lg dark:!border-gray-800 dark:!bg-gray-900 dark:!text-gray-100 !font-sans !p-4',
        duration: 3500,
      }}
    />
  );
}
