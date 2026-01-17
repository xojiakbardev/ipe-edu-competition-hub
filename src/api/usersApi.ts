import api from './config';
import type { User, PaginatedResponse } from '@/types';

export interface UsersFilter {
  role?: string;
  school_id?: number;
  class_id?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

export const usersApi = {
  // Get all users (admin only)
  getUsers: async (filters?: UsersFilter): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users/', { params: filters });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}/`);
    return response.data;
  },

  // Create new user (admin only)
  createUser: async (data: Partial<User>): Promise<User> => {
    const response = await api.post('/users/', data);
    return response.data;
  },

  // Update user
  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.patch(`/users/${id}/`, data);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}/`);
  },
};

export default usersApi;
