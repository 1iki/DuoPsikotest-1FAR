import { getProfileData } from '@/lib/actions/session';
import ProfileClient from '@/components/profile/ProfileClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const data = await getProfileData();

  if (!data) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Profil & Hasil Tes
        </h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Riwayat pengerjaan tes, metrik performa, dan perkembangan hasil psikotes Anda.
        </p>
      </div>

      <ProfileClient data={data} />
    </div>
  );
}
