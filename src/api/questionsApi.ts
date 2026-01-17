import api from './config';
import type { Question, QuestionCreate, QuestionUpdate, PaginatedResponse } from '@/types';

export const questionsApi = {
  // Get questions for a quiz
  getQuestionsByQuizId: async (quiz_id: number): Promise<Question[]> => {
    const response = await api.get(`/quizzes/${quiz_id}/questions/`);
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (id: number): Promise<Question> => {
    const response = await api.get(`/questions/${id}/`);
    return response.data;
  },

  // Create new question
  createQuestion: async (data: QuestionCreate): Promise<Question> => {
    const response = await api.post('/questions/', data);
    return response.data;
  },

  // Update question
  updateQuestion: async (id: number, data: QuestionUpdate): Promise<Question> => {
    const response = await api.patch(`/questions/${id}/`, data);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (id: number): Promise<void> => {
    await api.delete(`/questions/${id}/`);
  },

  // Bulk create questions
  bulkCreateQuestions: async (quiz_id: number, questions: Omit<QuestionCreate, 'quiz_id'>[]): Promise<Question[]> => {
    const response = await api.post(`/quizzes/${quiz_id}/questions/bulk/`, { questions });
    return response.data;
  },

  // Reorder questions
  reorderQuestions: async (quiz_id: number, order: { id: number; order: number }[]): Promise<void> => {
    await api.post(`/quizzes/${quiz_id}/questions/reorder/`, { order });
  },
};

export default questionsApi;
