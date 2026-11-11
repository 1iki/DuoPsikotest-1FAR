import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/lib/actions/auth';
import { Brain, ClipboardList, User, LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/80">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Link href="/tests" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Brain className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight">Psikotes</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/tests"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Tes</span>
            </Link>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <User className="h-4 w-4" />
              <span>Profil</span>
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  );
}
