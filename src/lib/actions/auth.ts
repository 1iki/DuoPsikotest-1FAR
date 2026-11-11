'use server';

import { createClient } from '@/lib/supabase/server';
import { registerSchema, loginSchema } from '@/lib/validators/schemas';
import { checkRateLimit } from '@/lib/security/ratelimit';
import { redirect } from 'next/navigation';

export interface AuthResult {
  error?: string;
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

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    return { error: error.message };
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
    return { error: error.message };
  }

  redirect(redirectTo || '/tests');
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
