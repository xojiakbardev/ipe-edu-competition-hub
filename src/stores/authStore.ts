import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Phone auth flow
  phoneNumber: string | null;
  isVerifying: boolean;
  
  // Actions
  setPhoneNumber: (phone: string) => void;
  setVerifying: (verifying: boolean) => void;
  login: (user: User, token: string, refreshToken: string) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      phoneNumber: null,
      isVerifying: false,

      setPhoneNumber: (phone) =>
        set({ phoneNumber: phone }),

      setVerifying: (verifying) =>
        set({ isVerifying: verifying }),

      login: (user, token, refreshToken) =>
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          phoneNumber: null,
          isVerifying: false,
        }),

      setTokens: (token, refreshToken) =>
        set({ token, refreshToken }),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          phoneNumber: null,
          isVerifying: false,
        }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'ipe-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper to check role permissions
export const hasRole = (user: User | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

// Management roles helper
export const isManagementRole = (role: UserRole): boolean => {
  return ['teacher', 'superuser'].includes(role);
};
