// User & Auth Types
export type UserRole = 'student' | 'teacher' | 'admin' | 'super-admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  school?: string;
  classCategory?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Test & Question Types
export type TestStatus = 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface Question {
  id: string;
  testId: string;
  text: string;
  options: QuestionOption[];
  points: number;
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Only visible to teachers/admins, never sent to students
}

export interface Test {
  id: string;
  title: string;
  description: string;
  subject: string;
  classCategory: string;
  duration: number; // in minutes
  startTime: string;
  endTime: string;
  status: TestStatus;
  createdBy: string;
  questionCount: number;
  totalPoints: number;
  isActive: boolean;
}

export interface TestSession {
  id: string;
  testId: string;
  studentId: string;
  startedAt: string;
  endedAt?: string;
  answers: StudentAnswer[];
  isSubmitted: boolean;
}

export interface StudentAnswer {
  questionId: string;
  selectedOptionId: string;
  answeredAt: string;
}

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  score: number;
  totalPoints: number;
  percentage: number;
  rank: number;
  totalParticipants: number;
  timeSpent: number; // in seconds
  submittedAt: string;
}

// Statistics Types
export interface TestStatistics {
  testId: string;
  totalParticipants: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  rankings: RankingEntry[];
}

export interface RankingEntry {
  rank: number;
  studentId: string;
  studentName: string;
  school: string;
  score: number;
  timeSpent: number;
}

// Prize Types
export interface Prize {
  id: string;
  testId: string;
  place: 1 | 2 | 3;
  description: string;
  value?: string;
}

// Filter Types
export interface TestFilter {
  subject?: string;
  classCategory?: string;
  school?: string;
  status?: TestStatus;
  dateFrom?: string;
  dateTo?: string;
}
