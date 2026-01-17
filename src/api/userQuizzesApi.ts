import api from './config';
import type { UserQuiz, UserQuizSubmit, Question, QuizResult, QuizStatistics, PaginatedResponse } from '@/types';

export const userQuizzesApi = {
  // Get user's quiz attempts
  getMyQuizzes: async (): Promise<UserQuiz[]> => {
    const response = await api.get('/user-quizzes/my/');
    return response.data;
  },

  // Get specific user quiz by ID
  getUserQuizById: async (id: number): Promise<UserQuiz> => {
    const response = await api.get(`/user-quizzes/${id}/`);
    return response.data;
  },

  // Start a quiz attempt
  startQuiz: async (quiz_id: number): Promise<UserQuiz> => {
    const response = await api.post('/user-quizzes/start/', { quiz_id });
    return response.data;
  },

  // Get questions for active quiz (shuffled, without correct answers)
  getQuizQuestions: async (user_quiz_id: number): Promise<Question[]> => {
    const response = await api.get(`/user-quizzes/${user_quiz_id}/questions/`);
    return response.data;
  },

  // Save answer (during quiz)
  saveAnswer: async (user_quiz_id: number, question_id: number, selected_option_id: number): Promise<void> => {
    await api.post(`/user-quizzes/${user_quiz_id}/answer/`, {
      question_id,
      selected_option_id,
    });
  },

  // Submit quiz
  submitQuiz: async (user_quiz_id: number, answers: UserQuizSubmit): Promise<QuizResult> => {
    const response = await api.post(`/user-quizzes/${user_quiz_id}/submit/`, answers);
    return response.data;
  },

  // Get quiz result
  getResult: async (user_quiz_id: number): Promise<QuizResult> => {
    const response = await api.get(`/user-quizzes/${user_quiz_id}/result/`);
    return response.data;
  },

  // --- Statistics (for management) ---

  // Get statistics for a quiz
  getQuizStatistics: async (quiz_id: number): Promise<QuizStatistics> => {
    const response = await api.get(`/quizzes/${quiz_id}/statistics/`);
    return response.data;
  },

  // Get all quiz results (for management)
  getQuizResults: async (quiz_id: number, params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<QuizResult>> => {
    const response = await api.get(`/quizzes/${quiz_id}/results/`, { params });
    return response.data;
  },

  // Get leaderboard
  getLeaderboard: async (quiz_id: number, limit?: number): Promise<QuizResult[]> => {
    const response = await api.get(`/quizzes/${quiz_id}/leaderboard/`, { params: { limit } });
    return response.data;
  },
};

export default userQuizzesApi;
