// User & Auth Types
export type UserRole = 'superuser' | 'teacher' | 'student';

export interface User {
  id: number;
  phone_number: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  school_id: number | null;
  class_id: number | null;
  school?: School;
  class?: Class;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface TokenRefreshResponse {
  access: string;
}

// School & Class Types
export interface School {
  id: number;
  name: string;
  region_id: number;
  region?: Region;
}

export interface Region {
  id: number;
  name: string;
}

export interface Class {
  id: number;
  name: string;
  school_id: number;
}

// Subject Types
export interface Subject {
  id: number;
  name: string;
}

// Quiz Types (called "Test" in UI)
export type QuizStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface Quiz {
  id: number;
  title: string;
  description: string;
  subject_id: number;
  subject?: Subject;
  class_category: string;
  duration: number; // in minutes
  start_time: string;
  end_time: string;
  status: QuizStatus;
  created_by: number;
  question_count: number;
  total_points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface QuizCreate {
  title: string;
  description: string;
  subject_id: number;
  class_category: string;
  duration: number;
  start_time: string;
  end_time: string;
}

export interface QuizUpdate {
  title?: string;
  description?: string;
  subject_id?: number;
  class_category?: string;
  duration?: number;
  start_time?: string;
  end_time?: string;
  status?: QuizStatus;
  is_active?: boolean;
}

// Question Types
export interface Question {
  id: number;
  quiz_id: number;
  text: string;
  options: QuestionOption[];
  points: number;
  order: number;
}

export interface QuestionOption {
  id: number;
  text: string;
  is_correct?: boolean; // Only visible to teachers/superusers
}

export interface QuestionCreate {
  quiz_id: number;
  text: string;
  options: { text: string; is_correct: boolean }[];
  points: number;
  order: number;
}

export interface QuestionUpdate {
  text?: string;
  options?: { id?: number; text: string; is_correct: boolean }[];
  points?: number;
  order?: number;
}

// Variant Types (Question sets for randomization)
export interface Variant {
  id: number;
  quiz_id: number;
  name: string;
  question_ids: number[];
}

// Event Types (Competitions)
export interface Event {
  id: number;
  name: string;
  description: string;
  quiz_id: number;
  quiz?: Quiz;
  start_date: string;
  end_date: string;
  is_active: boolean;
  prizes: Prize[];
  created_at: string;
}

export interface EventCreate {
  name: string;
  description: string;
  quiz_id: number;
  start_date: string;
  end_date: string;
}

// Prize Types
export interface Prize {
  id: number;
  event_id: number;
  place: 1 | 2 | 3;
  description: string;
  value?: string;
}

export interface PrizeCreate {
  event_id: number;
  place: 1 | 2 | 3;
  description: string;
  value?: string;
}

// User Quiz (Test Attempt) Types
export type UserQuizStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded';

export interface UserQuiz {
  id: number;
  user_id: number;
  quiz_id: number;
  quiz?: Quiz;
  variant_id: number | null;
  status: UserQuizStatus;
  started_at: string | null;
  ended_at: string | null;
  score: number | null;
  total_points: number | null;
  percentage: number | null;
  time_spent: number | null; // in seconds
  created_at: string;
}

export interface UserQuizAnswer {
  question_id: number;
  selected_option_id: number;
  answered_at: string;
}

export interface UserQuizSubmit {
  answers: UserQuizAnswer[];
}

// Result Types
export interface QuizResult {
  id: number;
  user_quiz_id: number;
  user_id: number;
  user?: User;
  quiz_id: number;
  score: number;
  total_points: number;
  percentage: number;
  rank: number;
  total_participants: number;
  time_spent: number;
  submitted_at: string;
}

// Statistics Types
export interface QuizStatistics {
  quiz_id: number;
  total_participants: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  pass_rate: number;
  rankings: RankingEntry[];
}

export interface RankingEntry {
  rank: number;
  user_id: number;
  user_name: string;
  school: string;
  score: number;
  time_spent: number;
}

// Filter Types
export interface QuizFilter {
  subject_id?: number;
  class_category?: string;
  school_id?: number;
  status?: QuizStatus;
  date_from?: string;
  date_to?: string;
}

// Pagination Types
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// API Error Type
export interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

// Legacy types for backward compatibility (will be removed)
export type TestStatus = QuizStatus;
export type Test = Quiz;
export type TestSession = UserQuiz;
export type StudentAnswer = UserQuizAnswer;
export type TestResult = QuizResult;
export type TestStatistics = QuizStatistics;
export type TestFilter = QuizFilter;
