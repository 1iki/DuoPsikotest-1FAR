'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from '@/lib/actions/auth';
import { Brain, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/tests';
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await signIn(formData, redirectTo);
      if (result?.error) {
        setError(result.error);
        toast.error('Gagal Masuk', {
          description: result.error,
        });
        setLoading(false);
      } else {
        toast.success('Berhasil Masuk', {
          description: 'Mengarahkan ke dashboard tes...',
        });
      }
    } catch {
      // Next.js redirect throws an internal error, which indicates success
      toast.success('Berhasil Masuk', {
        description: 'Mengarahkan ke dashboard tes...',
      });
    }
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-gray-200/80 dark:border-gray-800">
      <CardHeader className="text-center pb-4">
        <Link
          href="/"
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition-transform hover:scale-105 active:scale-95"
        >
          <Brain className="h-8 w-8" />
        </Link>
        <CardTitle className="text-2xl font-bold">Masuk ke Akun</CardTitle>
        <CardDescription>
          Masukkan email dan kata sandi Anda untuk mengakses tes psikotes
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
            >
              Alamat Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="nama@email.com"
              disabled={loading}
              error={!!error}
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
              >
                Kata Sandi
              </label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Minimal 8 karakter"
              disabled={loading}
              error={!!error}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-xs font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full text-base font-semibold shadow-md shadow-indigo-600/20"
            size="lg"
            loading={loading}
            loadingText="Sedang memproses..."
          >
            Masuk
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t border-gray-100 pt-5 text-center dark:border-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Daftar sekarang
          </Link>
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100/60 dark:from-gray-950 dark:to-gray-900/60">
      <Suspense
        fallback={
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm text-gray-500">Memuat formulir masuk...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
