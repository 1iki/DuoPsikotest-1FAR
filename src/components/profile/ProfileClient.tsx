'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ProfileData, TestType, AnalysisMetrics, AnalysisCategories } from '@/types';
import MetricCard from '@/components/profile/MetricCard';
import WorkCurveChart from '@/components/profile/WorkCurveChart';
import NarrativeSummary from '@/components/profile/NarrativeSummary';
import {
  FileQuestion,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  AlertTriangle,
  Play,
  Zap,
  Flame,
  History,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ProfileClientProps {
  data: ProfileData;
}

export default function ProfileClient({ data }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<TestType>('kraepelin');
  const { profile, sessions } = data;

  // Filter sessions by active tab
  const filteredSessions = sessions.filter(
    (s) => s.test_type === activeTab && s.status === 'completed',
  );

  const latestSession = filteredSessions[0];
  const latestAnalysis = latestSession?.analysis;
  const latestMetrics = latestAnalysis?.metrics as AnalysisMetrics | undefined;
  const latestCategories = latestAnalysis?.categories as
    | AnalysisCategories
    | undefined;

  // Previous session for comparison
  const previousSession = filteredSessions[1];
  const previousMetrics = previousSession?.analysis
    ?.metrics as AnalysisMetrics | undefined;

  const completedCount = sessions.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Account Profile Summary Header */}
      <Card className="border-indigo-100 bg-gradient-to-r from-white via-indigo-50/20 to-white dark:border-indigo-950 dark:from-gray-900 dark:via-indigo-950/20 dark:to-gray-900">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-xl shadow-md shadow-indigo-600/20">
              {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-gray-900 dark:text-gray-100">
                  {profile.full_name || 'Pengguna'}
                </h2>
                <Badge variant="outline" className="text-[10px]">
                  Peserta
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Total sesi terselesaikan: <strong className="text-gray-900 dark:text-gray-100">{completedCount}</strong> kali
              </p>
            </div>
          </div>
          <Link href="/tests">
            <Button size="sm" className="hidden sm:inline-flex gap-1.5 font-semibold">
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Tes Baru</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Test Tabs */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-gray-100/80 dark:bg-gray-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('kraepelin')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'kraepelin'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>Tes Kraepelin</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pauli')}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'pauli'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-gray-900 dark:text-indigo-400'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
          }`}
        >
          <Flame className="h-4 w-4" />
          <span>Tes Pauli</span>
        </button>
      </div>

      {/* Tab Content */}
      {filteredSessions.length === 0 ? (
        <Card className="text-center p-8 sm:p-12">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <FileQuestion className="h-8 w-8" />
          </div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
            Belum Ada Riwayat Selesai
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
            Anda belum pernah menyelesaikan {activeTab === 'kraepelin' ? 'Tes Kraepelin' : 'Tes Pauli'}. Mulai uji kemampuan Anda sekarang.
          </p>
          <Button asChild size="lg" className="font-semibold shadow-md shadow-indigo-600/20">
            <Link href={`/tests/${activeTab}/instructions`} className="inline-flex items-center gap-2">
              <Play className="h-4 w-4 fill-white" />
              <span>Mulai Tes Sekarang</span>
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Latest Analysis Section */}
          {latestMetrics && latestCategories && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                    Hasil Analisis Terakhir
                  </h3>
                  <p className="text-xs text-gray-500">
                    Waktu pengerjaan: {new Date(latestSession.started_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Badge variant="success" className="font-mono text-xs">
                  Selesai
                </Badge>
              </div>

              {/* 4 Primary Psychological Metrics */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <MetricCard
                  label="Kecepatan (Panker)"
                  sublabel="Rata-rata kecepatan berhitung"
                  value={latestMetrics.speed.toString()}
                  unit="jwb/lajur"
                  category={latestCategories.speed}
                />
                <MetricCard
                  label="Ketelitian (Tianker)"
                  sublabel="Persentase kesalahan total"
                  value={`${latestMetrics.accuracy.errorPercentage}%`}
                  unit={`(${latestMetrics.accuracy.totalErrors} salah)`}
                  category={latestCategories.accuracy}
                  invertColor
                />
                <MetricCard
                  label="Keajegan (Janker)"
                  sublabel="Stabilitas ritme kerja"
                  value={latestMetrics.consistency.range.toString()}
                  unit={`SD: ${latestMetrics.consistency.standardDeviation}`}
                  category={latestCategories.consistency}
                  invertColor
                />
                <MetricCard
                  label="Ketahanan (Hanker)"
                  sublabel="Kemiringan kurva kerja"
                  value={
                    latestMetrics.endurance.slope >= 0
                      ? `+${latestMetrics.endurance.slope}`
                      : latestMetrics.endurance.slope.toString()
                  }
                  unit="slope"
                  category={latestCategories.endurance}
                />
              </div>

              {/* Work Curve Chart Card */}
              <Card>
                <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800 flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle className="text-base font-bold">Kurva Kerja (Work Curve)</CardTitle>
                    <p className="text-xs text-gray-500">Fluktuasi jumlah jawaban per lajur</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {latestMetrics.workCurve.length} Lajur
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4">
                  <WorkCurveChart data={latestMetrics.workCurve} />
                </CardContent>
              </Card>

              {/* Narrative Summary Card */}
              {latestAnalysis?.summary && (
                <NarrativeSummary summary={latestAnalysis.summary} />
              )}
            </div>
          )}

          {/* Trend Comparison vs Previous Session */}
          {previousMetrics && latestMetrics && (
            <Card className="border-indigo-100 dark:border-indigo-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  Perbandingan Terhadap Percobaan Sebelumnya
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                  <span className="text-gray-500 block mb-1">Kecepatan (Panker):</span>
                  <div
                    className={`inline-flex items-center gap-1.5 font-bold ${
                      latestMetrics.speed >= previousMetrics.speed
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {latestMetrics.speed >= previousMetrics.speed ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>
                      {latestMetrics.speed >= previousMetrics.speed ? '+' : ''}
                      {Math.round((latestMetrics.speed - previousMetrics.speed) * 10) / 10} jwb/lajur
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800/50">
                  <span className="text-gray-500 block mb-1">Ketelitian (Tianker):</span>
                  <div
                    className={`inline-flex items-center gap-1.5 font-bold ${
                      latestMetrics.accuracy.errorPercentage <=
                      previousMetrics.accuracy.errorPercentage
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {latestMetrics.accuracy.errorPercentage <=
                    previousMetrics.accuracy.errorPercentage ? (
                      <>
                        <TrendingUp className="h-4 w-4" />
                        <span>Meningkat (Lebih Teliti)</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4" />
                        <span>Menurun (Lebih Banyak Salah)</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session History List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <History className="h-4 w-4 text-gray-500" />
                <span>Riwayat Percobaan</span>
              </h3>
              <span className="text-xs text-gray-500 font-medium">
                {filteredSessions.length} sesi tercatat
              </span>
            </div>

            <Card className="divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
              {filteredSessions.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/profile/${s.id}`}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Percobaan #{filteredSessions.length - idx}
                      </p>
                      {idx === 0 && (
                        <Badge variant="secondary" className="text-[10px] py-0 px-2">
                          Terbaru
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(s.started_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {s.analysis?.metrics && (
                      <div className="text-right">
                        <p className="font-mono text-sm font-extrabold text-indigo-600 dark:text-indigo-400">
                          {(s.analysis.metrics as AnalysisMetrics).speed} <span className="text-xs font-normal text-gray-500">jwb/lajur</span>
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Error: {(s.analysis.metrics as AnalysisMetrics).accuracy.errorPercentage}%
                        </p>
                      </div>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </Card>
          </div>

          {/* Psychological Disclaimer */}
          <Alert variant="warning" className="border-amber-200/80 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <AlertDescription className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Disclaimer:</strong> Hasil tes ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi perusahaan/organisasi.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}
