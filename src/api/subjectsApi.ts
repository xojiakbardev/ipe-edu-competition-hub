import api from './config';
import type { Subject } from '@/types';

export const subjectsApi = {
  // Get all subjects
  getSubjects: async (): Promise<Subject[]> => {
    const response = await api.get('/subjects/');
    return response.data;
  },

  // Get subject by ID
  getSubjectById: async (id: number): Promise<Subject> => {
    const response = await api.get(`/subjects/${id}/`);
    return response.data;
  },

  // Create subject (admin only)
  createSubject: async (name: string): Promise<Subject> => {
    const response = await api.post('/subjects/', { name });
    return response.data;
  },

  // Update subject
  updateSubject: async (id: number, name: string): Promise<Subject> => {
    const response = await api.patch(`/subjects/${id}/`, { name });
    return response.data;
  },

  // Delete subject
  deleteSubject: async (id: number): Promise<void> => {
    await api.delete(`/subjects/${id}/`);
  },
};

export default subjectsApi;
