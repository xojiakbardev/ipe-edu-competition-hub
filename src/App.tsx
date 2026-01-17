import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Auth
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RoleGuard } from "@/components/auth/RoleGuard";
import LoginPage from "@/pages/auth/LoginPage";

// Student
import StudentDashboard from "@/pages/student/StudentDashboard";
import TestPage from "@/pages/student/TestPage";
import ResultPage from "@/pages/student/ResultPage";

// Management
import ManagementLayout from "@/components/layout/ManagementLayout";
import ManagementDashboard from "@/pages/management/ManagementDashboard";
import TestsPage from "@/pages/management/TestsPage";
import QuestionsPage from "@/pages/management/QuestionsPage";
import StatisticsPage from "@/pages/management/StatisticsPage";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['student']}>
                <StudentDashboard />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/student/test" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['student']}>
                <TestPage />
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/student/result" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['student']}>
                <ResultPage />
              </RoleGuard>
            </ProtectedRoute>
          } />

          {/* Management Routes */}
          <Route path="/management/dashboard" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['teacher', 'superuser']}>
                <ManagementLayout><ManagementDashboard /></ManagementLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/management/tests" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['teacher', 'superuser']}>
                <ManagementLayout><TestsPage /></ManagementLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/management/questions" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['teacher', 'superuser']}>
                <ManagementLayout><QuestionsPage /></ManagementLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />
          <Route path="/management/statistics" element={
            <ProtectedRoute>
              <RoleGuard allowedRoles={['superuser']}>
                <ManagementLayout><StatisticsPage /></ManagementLayout>
              </RoleGuard>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
