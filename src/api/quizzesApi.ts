import api from './config';
import type { Quiz, QuizCreate, QuizUpdate, QuizFilter, PaginatedResponse } from '@/types';

export const quizzesApi = {
  // Get all quizzes with filters
  getQuizzes: async (filters?: QuizFilter & { page?: number; page_size?: number }): Promise<PaginatedResponse<Quiz>> => {
    const response = await api.get('/quizzes/', { params: filters });
    return response.data;
  },

  // Get quiz by ID
  getQuizById: async (id: number): Promise<Quiz> => {
    const response = await api.get(`/quizzes/${id}/`);
    return response.data;
  },

  // Create new quiz
  createQuiz: async (data: QuizCreate): Promise<Quiz> => {
    const response = await api.post('/quizzes/', data);
    return response.data;
  },

  // Update quiz
  updateQuiz: async (id: number, data: QuizUpdate): Promise<Quiz> => {
    const response = await api.patch(`/quizzes/${id}/`, data);
    return response.data;
  },

  // Delete quiz
  deleteQuiz: async (id: number): Promise<void> => {
    await api.delete(`/quizzes/${id}/`);
  },

  // Activate/Deactivate quiz
  setQuizActive: async (id: number, is_active: boolean): Promise<Quiz> => {
    const response = await api.patch(`/quizzes/${id}/`, { is_active });
    return response.data;
  },

  // Get quizzes available for current student
  getAvailableQuizzes: async (): Promise<Quiz[]> => {
    const response = await api.get('/quizzes/available/');
    return response.data;
  },

  // Get active quiz for student's class
  getActiveQuiz: async (): Promise<Quiz | null> => {
    const response = await api.get('/quizzes/active/');
    return response.data;
  },
};

export default quizzesApi;
