import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Database Schema & RLS Policy Enforcement', () => {
  const migrationPath = path.resolve(
    __dirname,
    '../supabase/migrations/00001_create_tables.sql',
  );
  const sql = fs.readFileSync(migrationPath, 'utf-8');

  it('enables row level security on all tables', () => {
    expect(sql).toContain('alter table public.profiles enable row level security;');
    expect(sql).toContain('alter table public.test_sessions enable row level security;');
    expect(sql).toContain('alter table public.column_results enable row level security;');
    expect(sql).toContain('alter table public.test_analyses enable row level security;');
  });

  it('ensures profiles can only be accessed by the profile owner', () => {
    expect(sql).toContain('create policy "Users can view own profile"');
    expect(sql).toContain('using (auth.uid() = id);');

    expect(sql).toContain('create policy "Users can update own profile"');
    expect(sql).toContain('using (auth.uid() = id);');
  });

  it('ensures test_sessions are strictly partitioned by user_id', () => {
    expect(sql).toContain('create policy "Users can view own sessions"');
    expect(sql).toContain('using (auth.uid() = user_id);');

    expect(sql).toContain('create policy "Users can insert own sessions"');
    expect(sql).toContain('with check (auth.uid() = user_id);');

    expect(sql).toContain('create policy "Users can update own sessions"');
    expect(sql).toContain('using (auth.uid() = user_id);');
  });

  it('ensures column_results cannot be viewed or inserted across different users', () => {
    expect(sql).toContain('create policy "Users can view own column results"');
    expect(sql).toContain('test_sessions.user_id = auth.uid()');

    expect(sql).toContain('create policy "Users can insert own column results"');
    expect(sql).toContain('test_sessions.user_id = auth.uid()');
  });

  it('ensures test_analyses cannot be viewed or inserted across different users', () => {
    expect(sql).toContain('create policy "Users can view own analyses"');
    expect(sql).toContain('test_sessions.user_id = auth.uid()');

    expect(sql).toContain('create policy "Users can insert own analyses"');
    expect(sql).toContain('test_sessions.user_id = auth.uid()');
  });
});

describe('RLS Logic Simulation: Cross-User Access Rejection', () => {
  interface MockSession {
    id: string;
    userId: string;
    status: string;
  }

  interface MockColumnResult {
    id: string;
    sessionId: string;
    columnIndex: number;
    answers: number[];
  }

  const sessions: MockSession[] = [
    { id: 'sess-user-1', userId: 'user-1', status: 'completed' },
    { id: 'sess-user-2', userId: 'user-2', status: 'completed' },
  ];

  const columnResults: MockColumnResult[] = [
    { id: 'col-1', sessionId: 'sess-user-1', columnIndex: 0, answers: [1, 2] },
    { id: 'col-2', sessionId: 'sess-user-2', columnIndex: 0, answers: [3, 4] },
  ];

  // RLS evaluation simulation matching the SQL policy
  function querySessionsAs(authUid: string): MockSession[] {
    return sessions.filter((s) => s.userId === authUid);
  }

  function queryColumnResultsAs(authUid: string): MockColumnResult[] {
    const userSessionIds = new Set(
      sessions.filter((s) => s.userId === authUid).map((s) => s.id),
    );
    return columnResults.filter((cr) => userSessionIds.has(cr.sessionId));
  }

  function canInsertColumnResult(
    authUid: string,
    result: { sessionId: string },
  ): boolean {
    const parentSession = sessions.find((s) => s.id === result.sessionId);
    return Boolean(parentSession && parentSession.userId === authUid);
  }

  it('denies user-1 from viewing user-2 test sessions', () => {
    const user1Sessions = querySessionsAs('user-1');
    expect(user1Sessions).toHaveLength(1);
    expect(user1Sessions[0].id).toBe('sess-user-1');
    expect(user1Sessions.some((s) => s.userId === 'user-2')).toBe(false);
  });

  it('denies user-1 from viewing user-2 column results', () => {
    const user1Results = queryColumnResultsAs('user-1');
    expect(user1Results).toHaveLength(1);
    expect(user1Results[0].sessionId).toBe('sess-user-1');
    expect(user1Results.some((cr) => cr.sessionId === 'sess-user-2')).toBe(false);
  });

  it('rejects user-1 from submitting column results for user-2 session', () => {
    const canInsert = canInsertColumnResult('user-1', {
      sessionId: 'sess-user-2',
    });
    expect(canInsert).toBe(false);
  });

  it('allows user-1 to submit column results for their own session', () => {
    const canInsert = canInsertColumnResult('user-1', {
      sessionId: 'sess-user-1',
    });
    expect(canInsert).toBe(true);
  });
});

