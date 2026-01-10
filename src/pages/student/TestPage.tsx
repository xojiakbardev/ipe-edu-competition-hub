import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useTestStore } from '@/stores/testStore';
import { testsApi, questionsApi, submissionApi } from '@/api/mockApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Send,
  Loader2
} from 'lucide-react';
import type { Question } from '@/types';

const TestPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { 
    currentQuestionIndex, 
    timeRemaining, 
    answers,
    setAnswer, 
    setCurrentQuestion, 
    setTimeRemaining,
    decrementTime,
    getAnswers,
    clearSession 
  } = useTestStore();

  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  // Fetch active test
  const { data: test, isLoading: testLoading } = useQuery({
    queryKey: ['activeTest', user?.id],
    queryFn: () => testsApi.getActiveTestForStudent(user!.id, user!.classCategory || '9-sinf'),
    enabled: !!user,
  });

  // Fetch questions (shuffled for students)
  const { data: questions = [], isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', test?.id],
    queryFn: () => questionsApi.getQuestionsByTestId(test!.id, true),
    enabled: !!test?.id && testStarted,
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      return submissionApi.submitTest(test!.id, user!.id, getAnswers(), timeSpent);
    },
    onSuccess: (result) => {
      clearSession();
      navigate('/student/result', { state: { result, testTitle: test?.title } });
    },
    onError: () => {
      toast({
        title: "Xatolik",
        description: "Test yuborilmadi. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    },
  });

  // Timer effect
  useEffect(() => {
    if (!testStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeRemaining, decrementTime]);

  // Auto submit when time runs out
  useEffect(() => {
    if (testStarted && timeRemaining === 0 && !submitMutation.isPending) {
      toast({
        title: "Vaqt tugadi!",
        description: "Test avtomatik yuborilmoqda...",
        variant: "destructive",
      });
      submitMutation.mutate();
    }
  }, [timeRemaining, testStarted, submitMutation, toast]);

  const startTest = () => {
    if (test) {
      setTimeRemaining(test.duration * 60);
      setStartTime(Date.now());
      setTestStarted(true);
    }
  };

  const handleSubmit = () => {
    setShowSubmitDialog(false);
    submitMutation.mutate();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = answers.size;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isTimeWarning = timeRemaining < 60 && timeRemaining > 0;

  if (testLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card max-w-md w-full">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Test topilmadi</h2>
            <p className="text-muted-foreground mb-6">Hozirda faol test mavjud emas</p>
            <Button onClick={() => navigate('/student/dashboard')}>
              Bosh sahifaga qaytish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Start screen
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card max-w-lg w-full animate-scale-in">
          <div className="gradient-primary h-2 rounded-t-lg" />
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{test.title}</CardTitle>
            <p className="text-muted-foreground mt-2">{test.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{test.duration}</p>
                <p className="text-sm text-muted-foreground">daqiqa</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">{test.questionCount}</p>
                <p className="text-sm text-muted-foreground">savol</p>
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Muhim eslatmalar:</p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Test boshlanganidan keyin to'xtatib bo'lmaydi</li>
                    <li>• Vaqt tugagach test avtomatik yuboriladi</li>
                    <li>• Barcha savollarga javob berishga harakat qiling</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 gradient-primary text-primary-foreground font-semibold"
              onClick={startTest}
            >
              Testni boshlash
            </Button>

            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/student/dashboard')}
            >
              Bekor qilish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className={`border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-50 ${isTimeWarning ? 'bg-destructive/5' : ''}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{test.title}</p>
                <p className="text-xs text-muted-foreground">
                  Savol {currentQuestionIndex + 1} / {questions.length}
                </p>
              </div>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isTimeWarning ? 'bg-destructive/10 text-destructive' : 'bg-secondary'}`}>
              <Clock className={`w-4 h-4 ${isTimeWarning ? 'animate-pulse' : ''}`} />
              <span className="font-mono font-bold text-lg">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          <Progress value={progress} className="mt-3 h-1.5" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {questionsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : currentQuestion ? (
          <Card className="shadow-card animate-fade-in">
            <CardContent className="p-6 sm:p-8">
              {/* Question */}
              <div className="mb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  {currentQuestion.points} ball
                </span>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground leading-relaxed">
                  {currentQuestion.text}
                </h2>
              </div>

              {/* Options */}
              <RadioGroup
                value={answers.get(currentQuestion.id) || ''}
                onValueChange={(value) => setAnswer(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={option.id}>
                    <RadioGroupItem
                      value={option.id}
                      id={option.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={option.id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-border cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground font-medium text-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="flex-1 text-foreground">{option.text}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Oldingi
                </Button>

                <span className="text-sm text-muted-foreground hidden sm:block">
                  {answeredCount} / {questions.length} javob berildi
                </span>

                {isLastQuestion ? (
                  <Button
                    className="gradient-primary text-primary-foreground"
                    onClick={() => setShowSubmitDialog(true)}
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Yuborish
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(currentQuestionIndex + 1)}
                  >
                    Keyingi
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Question Navigator */}
        <div className="mt-6 p-4 bg-card rounded-xl border border-border">
          <p className="text-sm font-medium text-foreground mb-3">Savollar:</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  idx === currentQuestionIndex
                    ? 'gradient-primary text-primary-foreground'
                    : answers.has(q.id)
                    ? 'bg-success/10 text-success border border-success/30'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Testni yuborishni tasdiqlang</AlertDialogTitle>
            <AlertDialogDescription>
              Siz {answeredCount} ta savoldan {questions.length} tasiga javob berdingiz.
              {answeredCount < questions.length && (
                <span className="block mt-2 text-warning">
                  Hali {questions.length - answeredCount} ta savolga javob berilmagan!
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="gradient-primary text-primary-foreground">
              Yuborish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestPage;
