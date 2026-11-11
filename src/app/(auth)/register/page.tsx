'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signUp } from '@/lib/actions/auth';
import { Brain, MailCheck, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await signUp(formData);
      if (result?.error) {
        setError(result.error);
        toast.error('Pendaftaran Gagal', {
          description: result.error,
        });
        setLoading(false);
      } else if (result?.message) {
        setSuccessMessage(result.message);
        toast.success('Pendaftaran Berhasil!', {
          description: 'Cek email Anda untuk konfirmasi aktivasi.',
        });
        setLoading(false);
      } else {
        toast.success('Akun Berhasil Dibuat', {
          description: 'Mengarahkan ke dashboard tes...',
        });
      }
    } catch {
      // Next.js redirect thrown on successful direct signup without email verification
      toast.success('Akun Berhasil Dibuat', {
        description: 'Mengarahkan ke dashboard tes...',
      });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100/60 dark:from-gray-950 dark:to-gray-900/60">
      <Card className="w-full max-w-md shadow-xl border-gray-200/80 dark:border-gray-800">
        <CardHeader className="text-center pb-4">
          <Link
            href="/"
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 transition-transform hover:scale-105 active:scale-95"
          >
            <Brain className="h-8 w-8" />
          </Link>
          <CardTitle className="text-2xl font-bold">Daftar Akun Baru</CardTitle>
          <CardDescription>
            Buat akun dalam beberapa detik untuk memulai latihan tes psikotes
          </CardDescription>
        </CardHeader>

        <CardContent>
          {successMessage ? (
            <div className="space-y-4 text-center py-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <MailCheck className="h-8 w-8" />
              </div>

              <Alert variant="success" className="text-left">
                <div className="space-y-1">
                  <AlertTitle className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    Konfirmasi Email Dikirim
                  </AlertTitle>
                  <AlertDescription className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    {successMessage}
                  </AlertDescription>
                </div>
              </Alert>

              <div className="pt-2">
                <Button asChild className="w-full" size="lg">
                  <Link href="/login" className="flex items-center justify-center gap-2">
                    <span>Lanjut ke Halaman Masuk</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                >
                  Nama Lengkap
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Contoh: Budi Santoso"
                  disabled={loading}
                  error={!!error}
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                >
                  Kata Sandi
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="Minimal 8 karakter"
                  disabled={loading}
                  error={!!error}
                />
                <p className="text-[11px] text-gray-500">
                  Gunakan minimal 8 karakter dengan kombinasi huruf dan angka
                </p>
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
                loadingText="Sedang mendaftarkan akun..."
              >
                Daftar Akun
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t border-gray-100 pt-5 text-center dark:border-gray-800">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Masuk di sini
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
    </main>
  );
}
