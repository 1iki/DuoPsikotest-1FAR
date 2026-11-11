-- ============================================================
-- Seed data for demo/testing purposes
-- NOTE: This requires a user to exist in auth.users first.
-- Run after creating a test account via the app or Supabase dashboard.
-- ============================================================

-- Example: insert a completed session for a demo user
-- Replace 'YOUR_USER_UUID' with an actual user UUID after signup.

/*
insert into public.test_sessions (id, user_id, test_type, status, seed, config_snapshot, started_at, finished_at)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'YOUR_USER_UUID',
  'kraepelin',
  'completed',
  42,
  '{"testType":"kraepelin","label":"Tes Kraepelin","totalColumns":40,"secondsPerColumn":30,"numbersPerColumn":50,"practiceColumns":1,"practiceSecondsPerColumn":30}',
  now() - interval '1 hour',
  now()
);
*/

-- The seed data is intentionally commented out.
-- To use: create a user via the app, copy their UUID, and uncomment above.

