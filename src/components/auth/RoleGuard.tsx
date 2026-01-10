import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, hasRole } from '@/stores/authStore';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

export const RoleGuard = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/login' 
}: RoleGuardProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(user, allowedRoles)) {
    // Redirect to appropriate section based on role
    const redirectPath = getRedirectPath(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

// Helper to get redirect path based on role
export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'student':
      return '/student/dashboard';
    case 'teacher':
    case 'admin':
    case 'super-admin':
      return '/management/dashboard';
    default:
      return '/login';
  }
};
