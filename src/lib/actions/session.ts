'use server';

import { createClient } from '@/lib/supabase/server';
import { getTestConfig } from '@/config/tests';
import { createSessionSeed, generateAllColumns } from '@/lib/scoring';
import { createSessionSchema, submitColumnSchema } from '@/lib/validators/schemas';
import { checkAnswers, generateAnswerKey } from '@/lib/scoring';
import { calculateMetrics } from '@/lib/scoring';
import { categoriseAll } from '@/lib/scoring';
import { buildNarrativeSummary } from '@/config/interpretations';
import type {
  TestType,
  ColumnStats,
  CreateSessionResponse,
  SessionResumeInfo,
} from '@/types';

// ============================================================
// Create a new test session
// ============================================================
export async function createSession(
  testType: string,
): Promise<{ data?: CreateSessionResponse; error?: string }> {
  const parsed = createSessionSchema.safeParse({ testType });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const config = getTestConfig(parsed.data.testType);
  if (!config) {
    return { error: 'Tipe tes tidak valid' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' };
  }

  const seed = createSessionSeed();

  const { data: session, error } = await supabase
    .from('test_sessions')
    .insert({
      user_id: user.id,
      test_type: parsed.data.testType,
      seed,
      config_snapshot: config,
    })
    .select('id')
    .single();

  if (error) {
    return { error: error.message };
  }

  // Generate columns from seed (sent to client, but answer key stays server-side)
  const columns = generateAllColumns(
    seed,
    config.totalColumns,
    config.numbersPerColumn,
  );

  return {
    data: {
      sessionId: session.id,
      columns,
      config,
    },
  };
}

// ============================================================
// Get session info for resuming
// ============================================================
export async function getSessionForResume(
  sessionId: string,
): Promise<{ data?: SessionResumeInfo; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' };
  }

  const { data: session, error } = await supabase
    .from('test_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (error || !session) {
    return { error: 'Sesi tidak ditemukan' };
  }

  if (session.status !== 'in_progress') {
    return { error: 'Sesi sudah selesai atau ditinggalkan' };
  }

  // Check if abandoned (> 30 minutes since start)
  const startTime = new Date(session.started_at).getTime();
  const now = Date.now();
  if (now - startTime > 30 * 60 * 1000) {
    await supabase
      .from('test_sessions')
      .update({ status: 'abandoned', finished_at: new Date().toISOString() })
      .eq('id', sessionId);
    return { error: 'Sesi telah ditinggalkan (lebih dari 30 menit)' };
  }

  // Find how many columns have been completed
  const { data: completedColumns } = await supabase
    .from('column_results')
    .select('column_index')
    .eq('session_id', sessionId)
    .order('column_index', { ascending: true });

  const currentColumn = completedColumns ? completedColumns.length : 0;
  const config = session.config_snapshot as import('@/types').TestConfig;

  const columns = generateAllColumns(
    session.seed,
    config.totalColumns,
    config.numbersPerColumn,
  );

  return {
    data: {
      sessionId,
      currentColumn,
      columns,
      config,
    },
  };
}

// ============================================================
// Submit a completed column
// ============================================================
export async function submitColumn(input: {
  sessionId: string;
  columnIndex: number;
  answers: (number | null)[];
  durationMs: number;
}): Promise<{ error?: string }> {
  const parsed = submitColumnSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' };
  }

  // Fetch session to get seed
  const { data: session, error: sessionError } = await supabase
    .from('test_sessions')
    .select('seed, config_snapshot, user_id, status')
    .eq('id', parsed.data.sessionId)
    .single();

  if (sessionError || !session) {
    return { error: 'Sesi tidak ditemukan' };
  }

  if (session.user_id !== user.id) {
    return { error: 'Akses ditolak' };
  }

  if (session.status !== 'in_progress') {
    return { error: 'Sesi sudah selesai' };
  }

  const config = session.config_snapshot as import('@/types').TestConfig;

  // Generate answer key server-side
  const answerKey = generateAnswerKey(
    session.seed,
    parsed.data.columnIndex,
    config.numbersPerColumn,
  );

  // Check answers
  const result = checkAnswers(answerKey, parsed.data.answers);

  // Save column result
  const { error: insertError } = await supabase.from('column_results').upsert(
    {
      session_id: parsed.data.sessionId,
      column_index: parsed.data.columnIndex,
      rows_answered: result.rowsAnswered,
      correct: result.correct,
      wrong: result.wrong,
      skipped: result.skipped,
      duration_ms: parsed.data.durationMs,
      answers: parsed.data.answers,
    },
    { onConflict: 'session_id,column_index' },
  );

  if (insertError) {
    return { error: insertError.message };
  }

  return {};
}

// ============================================================
// Complete a session — calculate analysis server-side
// ============================================================
export async function completeSession(
  sessionId: string,
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda harus login terlebih dahulu' };
  }

  // Get session
  const { data: session, error: sessionError } = await supabase
    .from('test_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (sessionError || !session) {
    return { error: 'Sesi tidak ditemukan' };
  }

  if (session.status !== 'in_progress') {
    return { error: 'Sesi sudah selesai' };
  }

  // Get all column results
  const { data: columnResults, error: colError } = await supabase
    .from('column_results')
    .select('*')
    .eq('session_id', sessionId)
    .order('column_index', { ascending: true });

  if (colError) {
    return { error: colError.message };
  }

  // Map to ColumnStats
  const stats: ColumnStats[] = (columnResults || []).map((r) => ({
    columnIndex: r.column_index,
    rowsAnswered: r.rows_answered,
    correct: r.correct,
    wrong: r.wrong,
    skipped: r.skipped,
    durationMs: r.duration_ms,
  }));

  // Calculate metrics
  const metrics = calculateMetrics(stats);

  // Categorise
  const testType = session.test_type as TestType;
  const categories = categoriseAll(testType, metrics);

  // Build narrative summary
  const config = session.config_snapshot as import('@/types').TestConfig;
  const summary = buildNarrativeSummary(categories, config.label);

  // Save analysis
  const { error: analysisError } = await supabase
    .from('test_analyses')
    .upsert(
      {
        session_id: sessionId,
        metrics,
        categories,
        summary,
      },
      { onConflict: 'session_id' },
    );

  if (analysisError) {
    return { error: analysisError.message };
  }

  // Mark session as completed
  const { error: updateError } = await supabase
    .from('test_sessions')
    .update({
      status: 'completed',
      finished_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (updateError) {
    return { error: updateError.message };
  }

  return {};
}

// ============================================================
// Get session result (for result page)
// ============================================================
export async function getSessionResult(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: session } = await supabase
    .from('test_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', user.id)
    .single();

  if (!session) return null;

  const { data: columnResults } = await supabase
    .from('column_results')
    .select('*')
    .eq('session_id', sessionId)
    .order('column_index', { ascending: true });

  const { data: analysis } = await supabase
    .from('test_analyses')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  return {
    session,
    columnResults: columnResults || [],
    analysis,
  };
}

// ============================================================
// Get user profile data
// ============================================================
export async function getProfileData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: sessions } = await supabase
    .from('test_sessions')
    .select(`
      *,
      test_analyses (*)
    `)
    .eq('user_id', user.id)
    .order('started_at', { ascending: false });

  return {
    profile: profile || { id: user.id, full_name: user.email || '', created_at: '' },
    email: user.email || '',
    sessions: (sessions || []).map((s) => ({
      ...s,
      analysis: Array.isArray(s.test_analyses)
        ? s.test_analyses[0] || null
        : s.test_analyses || null,
    })),
  };
}

// ============================================================
// Get latest session status for dashboard cards
// ============================================================
export async function getLatestSessionStatus(testType: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: session } = await supabase
    .from('test_sessions')
    .select('id, status, started_at, finished_at')
    .eq('user_id', user.id)
    .eq('test_type', testType)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  return session;
}
