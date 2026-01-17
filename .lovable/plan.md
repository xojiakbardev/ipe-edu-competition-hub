# API Integration Plan - IPe Education Platform

## Overview
Integrate the real IPe API (phone-based SMS authentication) replacing the mock API system.

## Key API Changes
- **Auth**: Phone-based SMS verification (login → send SMS code → verify code → get tokens)
- **Users**: ID is integer, uses `phone_number`, `first_name`, `last_name`, `school_id`, `class_id`
- **Roles**: `superuser`, `teacher`, `student` (no separate admin role)
- **Quizzes**: Tests are called "quizzes" in API
- **Events**: Competition events with prizes
- **User Quizzes**: Quiz attempts with start/answer/submit flow

## Implementation Steps

### 1. Create API Configuration (`src/api/config.ts`)
- Base URL configuration
- Axios instance with interceptors
- Token refresh handling
- Error handling

### 2. Update Types (`src/types/index.ts`)
- Update `UserRole` to match API: `superuser`, `teacher`, `student`
- Update `User` interface with API fields
- Add all new types: School, Class, Subject, Quiz, Question, Event, Prize, UserQuiz, etc.

### 3. Create API Services
- `src/api/authApi.ts` - Login, verify, logout, refresh
- `src/api/usersApi.ts` - User CRUD
- `src/api/schoolsApi.ts` - Schools and classes
- `src/api/quizzesApi.ts` - Quizzes (tests) CRUD
- `src/api/questionsApi.ts` - Questions CRUD
- `src/api/eventsApi.ts` - Events (competitions)
- `src/api/userQuizzesApi.ts` - Quiz attempts

### 4. Update Auth Store (`src/stores/authStore.ts`)
- Add refresh token handling
- Add phone number login flow
- Update user type

### 5. Update Login Page (`src/pages/auth/LoginPage.tsx`)
- Phone number input
- SMS code verification step
- Remove role selection (role comes from API)

### 6. Update Student Pages
- Dashboard: Use events API for upcoming competitions
- Test page: Use user-quizzes API for quiz flow
- Result page: Use quiz results from API

### 7. Update Management Pages
- Use real API calls for quizzes, questions, statistics
- Update role checks for `superuser` and `teacher`

### 8. Add API URL Secret
- Store API base URL as environment variable

## Files to Create
- `src/api/config.ts`
- `src/api/authApi.ts`
- `src/api/usersApi.ts`
- `src/api/schoolsApi.ts`
- `src/api/quizzesApi.ts`
- `src/api/questionsApi.ts`
- `src/api/eventsApi.ts`
- `src/api/userQuizzesApi.ts`
- `src/api/variantsApi.ts`

## Files to Update
- `src/types/index.ts`
- `src/stores/authStore.ts`
- `src/pages/auth/LoginPage.tsx`
- `src/pages/auth/RegisterPage.tsx` (remove - registration via phone)
- `src/pages/student/StudentDashboard.tsx`
- `src/pages/student/TestPage.tsx`
- `src/pages/student/ResultPage.tsx`
- `src/components/auth/RoleGuard.tsx`
- `src/components/layout/ManagementLayout.tsx`
- `src/App.tsx`

## Files to Delete
- `src/api/mockApi.ts`
- `src/api/mockData.ts`
