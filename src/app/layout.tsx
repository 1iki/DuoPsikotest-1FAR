import '@/app/globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Psikotes Online — Tes Kraepelin & Pauli',
  description:
    'Platform latihan tes psikotes Kraepelin dan Pauli dengan analisis otomatis.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
