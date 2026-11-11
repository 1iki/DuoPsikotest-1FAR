'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSessionForResume } from '@/lib/actions/session';
import type { SessionResumeInfo } from '@/types';
import TestEngine from '@/components/test/TestEngine';

export default function TestRunPage() {
  const params = useParams<{ type: string; sessionId: string }>();
  const [session, setSession] = useState<SessionResumeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const result = await getSessionForResume(params.sessionId);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setSession(result.data);
      }
      setLoading(false);
    }
    loadSession();
  }, [params.sessionId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
          <p className="text-sm text-gray-500">Memuat sesi tes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-4">
        <div className="text-center">
          <div className="mb-3 text-3xl">⚠️</div>
          <h2 className="mb-2 font-bold">Gagal Memuat Sesi</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500">Sesi tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <TestEngine
      sessionId={session.sessionId}
      columns={session.columns}
      config={session.config}
      startColumn={session.currentColumn}
    />
  );
}

