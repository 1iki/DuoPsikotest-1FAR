'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ProfileData, TestType, AnalysisMetrics, AnalysisCategories } from '@/types';
import MetricCard from '@/components/profile/MetricCard';
import WorkCurveChart from '@/components/profile/WorkCurveChart';
import NarrativeSummary from '@/components/profile/NarrativeSummary';

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
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="font-bold">{profile.full_name || 'Pengguna'}</h2>
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
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-3 text-3xl">📝</div>
          <h3 className="mb-1 font-semibold">Belum Ada Riwayat</h3>
          <p className="mb-4 text-sm text-gray-500">
            Anda belum pernah menyelesaikan {activeTab === 'kraepelin' ? 'Tes Kraepelin' : 'Tes Pauli'}.
          </p>
          <Link
            href={`/tests/${activeTab}/instructions`}
            className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Mulai Tes Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Latest analysis card */}
          {latestMetrics && latestCategories && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">Hasil Analisis Terakhir</h3>
                <span className="text-xs text-gray-500">
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
              <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
                <h4 className="mb-3 text-sm font-semibold">Kurva Kerja</h4>
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
            <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 font-semibold">Tren Dibandingkan Percobaan Sebelumnya</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Kecepatan:</span>{' '}
                  <span
                    className={
                      latestMetrics.speed >= previousMetrics.speed
                        ? 'font-medium text-green-600'
                        : 'font-medium text-red-600'
                    }
                  >
                    {latestMetrics.speed >= previousMetrics.speed ? '▲' : '▼'}{' '}
                    {Math.abs(
                      Math.round(
                        (latestMetrics.speed - previousMetrics.speed) * 10,
                      ) / 10,
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Ketelitian:</span>{' '}
                  <span
                    className={
                      latestMetrics.accuracy.errorPercentage <=
                      previousMetrics.accuracy.errorPercentage
                        ? 'font-medium text-green-600'
                        : 'font-medium text-red-600'
                    }
                  >
                    {latestMetrics.accuracy.errorPercentage <=
                    previousMetrics.accuracy.errorPercentage
                      ? '▲ Membaik'
                      : '▼ Menurun'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Session history */}
          <div>
            <h3 className="mb-3 font-semibold">Riwayat Percobaan</h3>
            <div className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
              {filteredSessions.map((s, idx) => (
                <Link
                  key={s.id}
                  href={`/profile/${s.id}`}
                  className="flex items-center justify-between p-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <div>
                    <p className="text-sm font-medium">
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
                  <div className="text-right">
                    {s.analysis?.metrics && (
                      <p className="font-mono text-sm font-bold">
                        {(s.analysis.metrics as AnalysisMetrics).speed} jwb/lajur
                      </p>
                    )}
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      Detail →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
            ⚠️ Hasil ini bersifat latihan dan gambaran awal, bukan diagnosis atau
            asesmen psikologis resmi.
          </div>
        </div>
      )}
    </div>
  );
}

