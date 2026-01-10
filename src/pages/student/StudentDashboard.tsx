import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { testsApi } from '@/api/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Clock, 
  Calendar, 
  BookOpen, 
  Trophy, 
  ArrowRight,
  LogOut,
  User,
  Timer
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  const { data: activeTest, isLoading } = useQuery({
    queryKey: ['activeTest', user?.id, user?.classCategory],
    queryFn: () => testsApi.getActiveTestForStudent(user!.id, user!.classCategory || '9-sinf'),
    enabled: !!user,
  });

  // Countdown timer
  useEffect(() => {
    if (!activeTest) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const startTime = new Date(activeTest.startTime).getTime();
      const distance = startTime - now;

      if (distance <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [activeTest]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Rejalashtirilgan</Badge>;
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Faol</Badge>;
      case 'completed':
        return <Badge variant="secondary">Yakunlangan</Badge>;
      default:
        return null;
    }
  };

  const canStartTest = activeTest?.status === 'active' || 
    (activeTest?.status === 'scheduled' && countdown?.days === 0 && countdown?.hours === 0 && countdown?.minutes === 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">IPe Education</h1>
              <p className="text-xs text-muted-foreground">O'quvchi paneli</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user?.fullName}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Salom, {user?.fullName?.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            {user?.school} • {user?.classCategory}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Jami testlar</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">84%</p>
                  <p className="text-sm text-muted-foreground">O'rtacha ball</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Timer className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">#3</p>
                  <p className="text-sm text-muted-foreground">Eng yaxshi o'rin</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Test Section */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Faol test</h3>
          
          {isLoading ? (
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : activeTest ? (
            <Card className="shadow-card overflow-hidden">
              <div className="gradient-primary h-2" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{activeTest.title}</CardTitle>
                    <CardDescription className="mt-1">{activeTest.description}</CardDescription>
                  </div>
                  {getStatusBadge(activeTest.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Test Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {new Date(activeTest.startTime).toLocaleDateString('uz-UZ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{activeTest.duration} daqiqa</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{activeTest.questionCount} ta savol</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{activeTest.totalPoints} ball</span>
                  </div>
                </div>

                {/* Countdown */}
                {countdown && activeTest.status === 'scheduled' && (
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-3 text-center">Test boshlanishiga:</p>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: countdown.days, label: 'Kun' },
                        { value: countdown.hours, label: 'Soat' },
                        { value: countdown.minutes, label: 'Daqiqa' },
                        { value: countdown.seconds, label: 'Soniya' },
                      ].map((item) => (
                        <div key={item.label} className="text-center">
                          <div className="bg-card rounded-lg p-3 shadow-soft">
                            <span className="text-2xl font-bold text-foreground">
                              {String(item.value).padStart(2, '0')}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground mt-1 block">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Start Button */}
                <Button 
                  className="w-full h-12 gradient-primary text-primary-foreground font-semibold"
                  disabled={!canStartTest}
                  onClick={() => navigate('/student/test')}
                >
                  {canStartTest ? (
                    <>
                      Testni boshlash
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Test hali boshlanmagan'
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">Hozirda faol test yo'q</h4>
                <p className="text-muted-foreground text-sm">
                  Yangi testlar e'lon qilinganida sizga xabar beramiz
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Previous Results Link */}
        <div className="mt-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/student/result')}
          >
            Oldingi natijalarni ko'rish
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
