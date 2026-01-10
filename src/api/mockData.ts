import type { User, Test, Question, TestResult, TestStatistics, Prize } from '@/types';

// Mock Users Database
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'student@ipe.uz',
    fullName: 'Alijon Karimov',
    role: 'student',
    school: "1-son maktab",
    classCategory: '9-sinf',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'teacher@ipe.uz',
    fullName: "Malika O'ktamova",
    role: 'teacher',
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    email: 'admin@ipe.uz',
    fullName: 'Shoxrux Toshmatov',
    role: 'admin',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: '4',
    email: 'superadmin@ipe.uz',
    fullName: 'Sardor Rahimov',
    role: 'super-admin',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

// Mock Tests Database
export const mockTests: Test[] = [
  {
    id: '1',
    title: 'Matematika olimpiadasi - 1-tur',
    description: "9-sinf o'quvchilari uchun matematika olimpiadasining birinchi turi",
    subject: 'Matematika',
    classCategory: '9-sinf',
    duration: 60,
    startTime: new Date(Date.now() + 1000 * 60 * 5).toISOString(), // 5 minutes from now
    endTime: new Date(Date.now() + 1000 * 60 * 65).toISOString(),
    status: 'scheduled',
    createdBy: '2',
    questionCount: 20,
    totalPoints: 100,
    isActive: true,
  },
  {
    id: '2',
    title: 'Fizika test sinovi',
    description: "10-sinf o'quvchilari uchun fizika test sinovi",
    subject: 'Fizika',
    classCategory: '10-sinf',
    duration: 45,
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // Started 30 min ago
    endTime: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    status: 'active',
    createdBy: '2',
    questionCount: 15,
    totalPoints: 75,
    isActive: true,
  },
  {
    id: '3',
    title: "Ingliz tili - So'z boyligi",
    description: "8-sinf o'quvchilari uchun ingliz tili so'z boyligi testi",
    subject: 'Ingliz tili',
    classCategory: '8-sinf',
    duration: 30,
    startTime: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    endTime: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    status: 'completed',
    createdBy: '2',
    questionCount: 25,
    totalPoints: 50,
    isActive: false,
  },
];

// Mock Questions Database
export const mockQuestions: Question[] = [
  {
    id: 'q1',
    testId: '1',
    text: "Agar 2x + 5 = 15 bo'lsa, x ning qiymati nechaga teng?",
    options: [
      { id: 'q1o1', text: '5', isCorrect: true },
      { id: 'q1o2', text: '10', isCorrect: false },
      { id: 'q1o3', text: '7', isCorrect: false },
      { id: 'q1o4', text: '3', isCorrect: false },
    ],
    points: 5,
    order: 1,
  },
  {
    id: 'q2',
    testId: '1',
    text: "Uchburchakning ichki burchaklari yig'indisi necha gradusga teng?",
    options: [
      { id: 'q2o1', text: '90°', isCorrect: false },
      { id: 'q2o2', text: '180°', isCorrect: true },
      { id: 'q2o3', text: '270°', isCorrect: false },
      { id: 'q2o4', text: '360°', isCorrect: false },
    ],
    points: 5,
    order: 2,
  },
  {
    id: 'q3',
    testId: '1',
    text: "5! (5 faktorial) ning qiymati nechaga teng?",
    options: [
      { id: 'q3o1', text: '25', isCorrect: false },
      { id: 'q3o2', text: '60', isCorrect: false },
      { id: 'q3o3', text: '120', isCorrect: true },
      { id: 'q3o4', text: '720', isCorrect: false },
    ],
    points: 5,
    order: 3,
  },
  {
    id: 'q4',
    testId: '1',
    text: "Aylana uzunligi formulasi qaysi?",
    options: [
      { id: 'q4o1', text: 'C = πr²', isCorrect: false },
      { id: 'q4o2', text: 'C = 2πr', isCorrect: true },
      { id: 'q4o3', text: 'C = πd²', isCorrect: false },
      { id: 'q4o4', text: 'C = 4πr', isCorrect: false },
    ],
    points: 5,
    order: 4,
  },
  {
    id: 'q5',
    testId: '1',
    text: "Kvadrat tenglamaning ildizlari formulasi (Vieta formulasi) bo'yicha x₁ + x₂ = ?",
    options: [
      { id: 'q5o1', text: '-b/a', isCorrect: true },
      { id: 'q5o2', text: 'c/a', isCorrect: false },
      { id: 'q5o3', text: 'b/a', isCorrect: false },
      { id: 'q5o4', text: '-c/a', isCorrect: false },
    ],
    points: 5,
    order: 5,
  },
];

// Mock Results Database
export const mockResults: TestResult[] = [
  {
    id: 'r1',
    testId: '3',
    studentId: '1',
    score: 42,
    totalPoints: 50,
    percentage: 84,
    rank: 3,
    totalParticipants: 45,
    timeSpent: 1560,
    submittedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

// Mock Statistics
export const mockStatistics: TestStatistics[] = [
  {
    testId: '3',
    totalParticipants: 45,
    averageScore: 35,
    highestScore: 48,
    lowestScore: 15,
    passRate: 78,
    rankings: [
      { rank: 1, studentId: 's1', studentName: 'Jasur Sobirov', school: '5-son maktab', score: 48, timeSpent: 1200 },
      { rank: 2, studentId: 's2', studentName: 'Nilufar Azimova', school: '12-son maktab', score: 46, timeSpent: 1350 },
      { rank: 3, studentId: '1', studentName: 'Alijon Karimov', school: '1-son maktab', score: 42, timeSpent: 1560 },
    ],
  },
];

// Mock Prizes
export const mockPrizes: Prize[] = [
  { id: 'p1', testId: '3', place: 1, description: "Oltin medal va sertifikat", value: "500,000 so'm" },
  { id: 'p2', testId: '3', place: 2, description: "Kumush medal va sertifikat", value: "300,000 so'm" },
  { id: 'p3', testId: '3', place: 3, description: "Bronza medal va sertifikat", value: "200,000 so'm" },
];

// Helper function to get tests by class category
export const getTestsByClass = (classCategory: string): Test[] => {
  return mockTests.filter(test => test.classCategory === classCategory);
};

// Helper function to shuffle array (for questions)
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
