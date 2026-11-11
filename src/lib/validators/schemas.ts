// ============================================================
// Zod schemas for input validation
// ============================================================
import { z } from 'zod';

export const testTypeSchema = z.enum(['kraepelin', 'pauli']);

export const registerSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter'),
  fullName: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
});

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(1, 'Kata sandi wajib diisi'),
});

export const createSessionSchema = z.object({
  testType: testTypeSchema,
});

export const submitColumnSchema = z.object({
  sessionId: z.string().uuid('Session ID tidak valid'),
  columnIndex: z.number().int().min(0),
  answers: z.array(z.number().int().min(0).max(9).nullable()),
  durationMs: z.number().int().min(0),
});

export const completeSessionSchema = z.object({
  sessionId: z.string().uuid('Session ID tidak valid'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type SubmitColumnInput = z.infer<typeof submitColumnSchema>;

