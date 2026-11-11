import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/auth/SignOutButton';
import { Brain, ClipboardList, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-900/85">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-2.5">
          <Link
            href="/tests"
            className="flex items-center gap-2.5 group transition-transform active:scale-95"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20 group-hover:bg-indigo-700 transition-colors">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
                DuoPsikotest
              </span>
              <span className="text-[10px] text-gray-500 font-medium">
                Kraepelin & Pauli
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/tests"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>Tes</span>
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
            >
              <User className="h-3.5 w-3.5" />
              <span>Profil</span>
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
