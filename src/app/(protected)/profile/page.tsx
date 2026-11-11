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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profil & Hasil Tes</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Riwayat pengerjaan tes, metrik performa, dan perkembangan hasil psikotes Anda.
        </p>
      </div>

      <ProfileClient data={data} />
    </div>
  );
}
