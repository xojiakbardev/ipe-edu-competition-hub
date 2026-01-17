import api from './config';
import type { User, LoginResponse } from '@/types';

export interface SendCodeRequest {
  phone_number: string;
}

export interface VerifyCodeRequest {
  phone_number: string;
  code: string;
}

export interface VerifyCodeResponse {
  access: string;
  refresh: string;
  user: User;
}

export const authApi = {
  // Step 1: Send SMS code to phone number
  sendCode: async (phone_number: string): Promise<{ message: string }> => {
    const response = await api.post('/users/login/', { phone_number });
    return response.data;
  },

  // Step 2: Verify SMS code and get tokens
  verifyCode: async (phone_number: string, code: string): Promise<VerifyCodeResponse> => {
    const response = await api.post('/users/verify/', { phone_number, code });
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/me/');
    return response.data;
  },

  // Update current user profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.patch('/users/me/', data);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    const response = await api.post('/users/token/refresh/', { refresh });
    return response.data;
  },

  // Logout (invalidate refresh token)
  logout: async (refresh: string): Promise<void> => {
    await api.post('/users/logout/', { refresh });
  },
};

export default authApi;
