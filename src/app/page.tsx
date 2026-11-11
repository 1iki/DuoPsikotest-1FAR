import Link from 'next/link';
import {
  Brain,
  Zap,
  Flame,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="mx-auto w-full max-w-lg text-center">
        {/* Hero badge */}
        <div className="mb-4 inline-flex items-center">
          <Badge variant="secondary" className="px-3.5 py-1 text-xs font-semibold gap-1.5 shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Platform Tes Psikotes Terstandar</span>
          </Badge>
        </div>

        {/* Hero */}
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/25 ring-8 ring-indigo-50 dark:ring-indigo-950/40">
            <Brain className="h-10 w-10" />
          </div>
          <h1 className="mb-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            DuoPsikotest
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-md mx-auto">
            Simulasi uji tes Kraepelin dan Pauli berbasis web mobile-first dengan
            perhitungan metrik & kurva kerja otomatis secara deterministik.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="mb-8 space-y-3.5 text-left">
          <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md">
            <CardHeader className="p-4 sm:p-5 flex flex-row items-start gap-3.5 space-y-0">
              <div className="mt-0.5 rounded-xl bg-amber-50 p-2.5 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base">Tes Kraepelin</CardTitle>
                  <span className="text-[11px] font-mono font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md">
                    40 lajur × 30s
                  </span>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Menjumlahkan angka dari bawah ke atas. Mengukur kecepatan kerja (Panker) dan ketelitian berhitung (Tianker).
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md">
            <CardHeader className="p-4 sm:p-5 flex flex-row items-start gap-3.5 space-y-0">
              <div className="mt-0.5 rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 shrink-0">
                <Flame className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base">Tes Pauli</CardTitle>
                  <span className="text-[11px] font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-md">
                    40 lajur × 60s
                  </span>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Menjumlahkan angka berturut-turut. Menguji ketahanan stamina mental (Hanker) dan kestabilan performa (Janker).
                </CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-all hover:shadow-md">
            <CardHeader className="p-4 sm:p-5 flex flex-row items-start gap-3.5 space-y-0">
              <div className="mt-0.5 rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 shrink-0">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-base">Analisis & Kurva Kerja</CardTitle>
                  <span className="text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                    Real-time
                  </span>
                </div>
                <CardDescription className="text-xs sm:text-sm">
                  Visualisasi grafik kurva kerja interaktif, klasifikasi 5 level norma, dan narasi interpretasi psikologis instan.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link href="/register">
            <Button
              className="w-full text-base font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              size="lg"
            >
              <span>Daftar Akun Gratis</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full text-base font-semibold"
              size="lg"
            >
              Masuk ke Akun
            </Button>
          </Link>
        </div>

        {/* Benefits checklist */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>Keypad kustom proporsional</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
            <span>Anti-zoom & Screen Lock</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-emerald-600" />
            <span>Autosave per lajur</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-gray-200/80 bg-gray-50/80 p-3 text-[11px] leading-relaxed text-gray-500 dark:border-gray-800 dark:bg-gray-900/50">
          Hasil tes ini bersifat latihan dan simulasi mandiri, bukan diagnosis klinis atau asesmen psikologis resmi perusahaan/institusi.
        </div>
      </div>
    </main>
  );
}
