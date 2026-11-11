'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getSessionForResume } from '@/lib/actions/session';
import type { SessionResumeInfo } from '@/types';
import TestEngine from '@/components/test/TestEngine';
import { AlertCircle, Loader2, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

export default function TestRunPage() {
  const params = useParams<{ type: string; sessionId: string }>();
  const [session, setSession] = useState<SessionResumeInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const result = await getSessionForResume(params.sessionId);
        if (ignore) return;
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setSession(result.data);
        }
      } catch {
        if (!ignore) {
          setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      ignore = true;
    };
  }, [params.sessionId]);

  async function handleRetry() {
    setLoading(true);
    setError(null);
    try {
      const result = await getSessionForResume(params.sessionId);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setSession(result.data);
      }
    } catch {
      setError('Gagal terhubung ke server. Periksa koneksi internet Anda.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/50">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
              Memuat Lembar Sesi Tes
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Menyiapkan kolom angka dan memulihkan progres pengerjaan...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-4">
        <Card className="w-full max-w-sm text-center border-red-200 dark:border-red-900/60 shadow-lg">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400">
              <AlertCircle className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold">Gagal Membuka Sesi</CardTitle>
            <CardDescription className="text-xs text-red-600 dark:text-red-400">
              {error || 'Sesi tes tidak ditemukan atau telah kedaluwarsa.'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col gap-2.5">
            <Button onClick={handleRetry} className="w-full" size="default">
              <RotateCcw className="h-4 w-4 mr-2" />
              <span>Coba Muat Ulang</span>
            </Button>
            <Button asChild variant="outline" className="w-full" size="default">
              <Link href="/tests">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span>Kembali ke Pilihan Tes</span>
              </Link>
            </Button>
          </CardFooter>
        </Card>
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
