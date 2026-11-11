'use server';

import { createClient } from '@/lib/supabase/server';
import { registerSchema, loginSchema } from '@/lib/validators/schemas';
import { checkRateLimit } from '@/lib/security/ratelimit';
import { redirect } from 'next/navigation';

export interface AuthResult {
  error?: string;
  message?: string;
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Input tidak valid' };
  }

  // Rate limit signup by email
  const rl = checkRateLimit(`register:${parsed.data.email}`, 3, 60 * 1000);
  if (!rl.success) {
    return { error: 'Terlalu banyak percobaan pendaftaran. Coba lagi dalam 1 menit.' };
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://duopsikotest-1far.vercel.app');

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If email confirmation is required, notify user to check their email
  if (data?.user && (!data.session || data.user.identities?.length === 0)) {
    return {
      message:
        'Pendaftaran berhasil! Tautan konfirmasi telah dikirim ke email Anda. Silakan periksa kotak masuk (atau folder spam) untuk mengaktifkan akun Anda sebelum masuk.',
    };
  }

  redirect('/tests');
}

export async function signIn(
  formData: FormData,
  redirectTo?: string,
): Promise<AuthResult> {
  const raw = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || 'Input tidak valid' };
  }

  // Rate limit login attempts: 5 per minute per email
  const rl = checkRateLimit(`login:${parsed.data.email}`, 5, 60 * 1000);
  if (!rl.success) {
    return { error: 'Terlalu banyak percobaan masuk. Silakan tunggu 1 menit sebelum mencoba lagi.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return {
        error:
          'Email Anda belum dikonfirmasi. Silakan buka email konfirmasi yang dikirimkan oleh sistem dan klik tautan untuk mengaktifkan akun.',
      };
    }
    if (error.message.toLowerCase().includes('invalid login credentials')) {
      return { error: 'Email atau kata sandi salah. Silakan coba lagi.' };
    }
    return { error: error.message };
  }

  redirect(redirectTo || '/tests');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
