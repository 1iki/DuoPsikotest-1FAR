// ============================================================
// Shared type definitions for the Psikotes application
// ============================================================

export type TestType = 'kraepelin' | 'pauli';
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';
export type CategoryLevel = 'Sangat Rendah' | 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';

// ---------- Test Configuration ----------

export interface TestConfig {
  testType: TestType;
  label: string;
  description: string;
  totalColumns: number;
  secondsPerColumn: number;
  numbersPerColumn: number;
  practiceColumns: number;
  practiceSecondsPerColumn: number;
}

// ---------- Database Models ----------

export interface Profile {
  id: string;
  full_name: string;
  created_at: string;
}

export interface TestSession {
  id: string;
  user_id: string;
  test_type: TestType;
  status: SessionStatus;
  seed: number;
  config_snapshot: TestConfig;
  started_at: string;
  finished_at: string | null;
}

export interface ColumnResult {
  id: string;
  session_id: string;
  column_index: number;
  rows_answered: number;
  correct: number;
  wrong: number;
  skipped: number;
  duration_ms: number;
  answers: number[];
}

export interface TestAnalysis {
  id: string;
  session_id: string;
  metrics: AnalysisMetrics;
  categories: AnalysisCategories;
  summary: string;
  created_at: string;
}

// ---------- Scoring / Analysis ----------

export interface ColumnStats {
  columnIndex: number;
  rowsAnswered: number;
  correct: number;
  wrong: number;
  skipped: number;
  durationMs: number;
}

export interface AnalysisMetrics {
  /** Panker - average answers per column */
  speed: number;
  /** Tianker - total errors and error percentage */
  accuracy: {
    totalErrors: number;
    errorPercentage: number;
  };
  /** Janker - range and standard deviation of answers per column */
  consistency: {
    range: number;
    standardDeviation: number;
  };
  /** Hanker - endurance: second-half vs first-half difference + regression slope */
  endurance: {
    halfDifference: number;
    slope: number;
  };
  /** Work curve data: answers per column */
  workCurve: number[];
}

export interface AnalysisCategories {
  speed: CategoryLevel;
  accuracy: CategoryLevel;
  consistency: CategoryLevel;
  endurance: CategoryLevel;
}

// ---------- Client-side Test State ----------

export interface TestState {
  sessionId: string;
  testType: TestType;
  config: TestConfig;
  currentColumn: number;
  columns: number[][];
  answers: (number | null)[];
  currentPairIndex: number;
  columnStartTime: number;
  isTransitioning: boolean;
  isFinished: boolean;
}

export interface ColumnSubmission {
  sessionId: string;
  columnIndex: number;
  answers: (number | null)[];
  durationMs: number;
}

// ---------- API Response Types ----------

export interface CreateSessionResponse {
  sessionId: string;
  columns: number[][];
  config: TestConfig;
}

export interface SessionResumeInfo {
  sessionId: string;
  currentColumn: number;
  columns: number[][];
  config: TestConfig;
}

export interface ProfileData {
  profile: Profile;
  sessions: (TestSession & {
    analysis: TestAnalysis | null;
  })[];
}

export interface SessionResultData {
  session: TestSession;
  columnResults: ColumnResult[];
  analysis: TestAnalysis;
}
