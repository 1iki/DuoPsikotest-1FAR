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
} from 'lucide-react';

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

  return (
    <div>
      {/* Account summary */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4.5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-gray-100">{profile.full_name || 'Pengguna'}</h2>
            <p className="text-xs text-gray-500">
              Total sesi selesai: {sessions.filter((s) => s.status === 'completed').length}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab('kraepelin')}
          className={`flex-1 border-b-2 py-2.5 text-center text-sm font-semibold transition-colors ${
            activeTab === 'kraepelin'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Tes Kraepelin
        </button>
        <button
          onClick={() => setActiveTab('pauli')}
          className={`flex-1 border-b-2 py-2.5 text-center text-sm font-semibold transition-colors ${
            activeTab === 'pauli'
              ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Tes Pauli
        </button>
      </div>

      {/* Empty state */}
      {filteredSessions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900 shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            <FileQuestion className="h-7 w-7" />
          </div>
          <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">Belum Ada Riwayat</h3>
          <p className="mb-5 text-sm text-gray-500">
            Anda belum pernah menyelesaikan {activeTab === 'kraepelin' ? 'Tes Kraepelin' : 'Tes Pauli'}.
          </p>
          <Link
            href={`/tests/${activeTab}/instructions`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Mulai Tes Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Latest analysis card */}
          {latestMetrics && latestCategories && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Hasil Analisis Terakhir</h3>
                <span className="text-xs text-gray-500 font-mono">
                  {new Date(latestSession.started_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="mb-4 grid grid-cols-2 gap-3">
                <MetricCard
                  label="Kecepatan (Panker)"
                  value={latestMetrics.speed.toString()}
                  unit="jawaban/lajur"
                  category={latestCategories.speed}
                />
                <MetricCard
                  label="Ketelitian (Tianker)"
                  value={latestMetrics.accuracy.errorPercentage.toString()}
                  unit="% kesalahan"
                  category={latestCategories.accuracy}
                  invertColor
                />
                <MetricCard
                  label="Keajegan (Janker)"
                  value={latestMetrics.consistency.range.toString()}
                  unit={`range (SD: ${latestMetrics.consistency.standardDeviation})`}
                  category={latestCategories.consistency}
                  invertColor
                />
                <MetricCard
                  label="Ketahanan (Hanker)"
                  value={
                    latestMetrics.endurance.slope >= 0
                      ? `+${latestMetrics.endurance.slope}`
                      : latestMetrics.endurance.slope.toString()
                  }
                  unit="slope"
                  category={latestCategories.endurance}
                />
              </div>

              {/* Work Curve */}
              <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Kurva Kerja</h4>
                <WorkCurveChart data={latestMetrics.workCurve} />
              </div>

              {/* Narrative Summary */}
              {latestAnalysis?.summary && (
                <NarrativeSummary summary={latestAnalysis.summary} />
              )}
            </div>
          )}

          {/* Trend comparison (if > 1 session) */}
          {previousMetrics && latestMetrics && (
            <div className="rounded-xl border border-gray-200 bg-white p-4.5 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Tren Dibandingkan Percobaan Sebelumnya</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block mb-1">Kecepatan:</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
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
                      {Math.abs(
                        Math.round(
                          (latestMetrics.speed - previousMetrics.speed) * 10,
                        ) / 10,
                      )}{' '}
                      jwb/lajur
                    </span>
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">Ketelitian:</span>
                  <span
                    className={`inline-flex items-center gap-1 font-semibold ${
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
                        <span>Membaik</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="h-4 w-4" />
                        <span>Menurun</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Session history */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Riwayat Percobaan</h3>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
              {filteredSessions.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/profile/${s.id}`}
                  className="flex items-center justify-between p-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Percobaan #{filteredSessions.length - idx}
                    </p>
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
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      {s.analysis?.metrics && (
                        <p className="font-mono text-sm font-bold text-gray-900 dark:text-gray-100">
                          {(s.analysis.metrics as AnalysisMetrics).speed} <span className="text-xs font-normal text-gray-500">jwb</span>
                        </p>
                      )}
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        Detail
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2.5 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/20 dark:text-yellow-300">
            <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <span>Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau asesmen psikologis resmi.</span>
          </div>
        </div>
      )}
    </div>
  );
}
