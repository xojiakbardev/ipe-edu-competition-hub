import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { submissionApi } from '@/api/mockApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, 
  Clock, 
  Target, 
  Users, 
  Medal,
  ArrowLeft,
  Share2,
  Home
} from 'lucide-react';
import type { TestResult } from '@/types';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Get result from navigation state or fetch
  const stateResult = location.state?.result as TestResult | undefined;
  const testTitle = location.state?.testTitle as string | undefined;

  const { data: fetchedResults, isLoading } = useQuery({
    queryKey: ['studentResults', user?.id],
    queryFn: async () => {
      // In real app, fetch all results for student
      return submissionApi.getResultForStudent('3', user!.id);
    },
    enabled: !!user && !stateResult,
  });

  const result = stateResult || fetchedResults;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} daqiqa ${secs} soniya`;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { label: "A'lo", color: 'bg-success text-success-foreground' };
    if (percentage >= 80) return { label: 'Yaxshi', color: 'bg-primary text-primary-foreground' };
    if (percentage >= 60) return { label: "Qoniqarli", color: 'bg-warning text-warning-foreground' };
    return { label: "Qoniqarsiz", color: 'bg-destructive text-destructive-foreground' };
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: <Medal className="w-5 h-5" />, color: 'text-yellow-500', label: '🥇 1-o\'rin' };
    if (rank === 2) return { icon: <Medal className="w-5 h-5" />, color: 'text-gray-400', label: '🥈 2-o\'rin' };
    if (rank === 3) return { icon: <Medal className="w-5 h-5" />, color: 'text-amber-600', label: '🥉 3-o\'rin' };
    return { icon: null, color: '', label: `${rank}-o'rin` };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Natija topilmadi</h2>
            <p className="text-muted-foreground mb-6">
              Hali hech qanday test topshirmagansiz
            </p>
            <Button onClick={() => navigate('/student/dashboard')}>
              Bosh sahifaga qaytish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const grade = getGrade(result.percentage);
  const rankInfo = getRankBadge(result.rank);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/student/dashboard')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Orqaga
        </Button>

        {/* Result Hero Card */}
        <Card className="shadow-elevated overflow-hidden animate-scale-in">
          <div className="gradient-primary p-8 text-center text-primary-foreground">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {testTitle || 'Test natijasi'}
            </h1>
            <p className="opacity-90">
              Test muvaffaqiyatli yakunlandi!
            </p>
          </div>

          <CardContent className="p-6 -mt-6">
            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-secondary"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - result.percentage / 100)}`}
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-card rounded-full m-3 shadow-card">
                <span className="text-4xl font-bold text-foreground">
                  {result.percentage}%
                </span>
                <Badge className={`mt-1 ${grade.color}`}>
                  {grade.label}
                </Badge>
              </div>
            </div>

            {/* Score Details */}
            <div className="text-center mb-6">
              <p className="text-2xl font-bold text-foreground">
                {result.score} / {result.totalPoints}
              </p>
              <p className="text-muted-foreground">ball to'plandi</p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{rankInfo.label}</p>
                  <p className="text-sm text-muted-foreground">Reytingdagi o'rin</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{result.totalParticipants}</p>
                  <p className="text-sm text-muted-foreground">Jami ishtirokchi</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card col-span-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{formatTime(result.timeSpent)}</p>
                  <p className="text-sm text-muted-foreground">Sarflangan vaqt</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <Button 
            className="w-full h-12 gradient-primary text-primary-foreground font-semibold"
            onClick={() => navigate('/student/dashboard')}
          >
            <Home className="w-4 h-4 mr-2" />
            Bosh sahifaga qaytish
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              // Share functionality mock
              navigator.clipboard?.writeText(`Men IPe Education testida ${result.percentage}% ball to'pladim! 🎉`);
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Natijani ulashish
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
