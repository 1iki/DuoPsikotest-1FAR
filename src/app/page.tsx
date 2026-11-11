import Link from 'next/link';
import { Brain, Zap, Flame, BarChart3, Info } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md text-center">
        {/* Hero */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
            <Brain className="h-9 w-9" />
          </div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            Psikotes Online
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Latihan tes Kraepelin dan Pauli dengan analisis otomatis.
            Ukur kecepatan, ketelitian, konsistensi, dan ketahanan kerja Anda.
          </p>
        </div>

        {/* Features */}
        <div className="mb-8 space-y-3 text-left">
          <div className="flex items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mt-0.5 rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Tes Kraepelin</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                40 lajur × 30 detik. Fokus pada kecepatan dan ketelitian berhitung.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mt-0.5 rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Tes Pauli</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                40 lajur × 60 detik. Mengukur ketahanan dan konsistensi kerja jangka panjang.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3.5 rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mt-0.5 rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analisis Otomatis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Hasil langsung dengan grafik kurva kerja, metrik performa, dan ringkasan naratif.
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link
            href="/register"
            className="block w-full rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Daftar Gratis
          </Link>
          <Link
            href="/login"
            className="block w-full rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:hover:bg-gray-900"
          >
            Masuk
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Hasil tes bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen resmi.</span>
        </div>
      </div>
    </main>
  );
}
