import { useQuery } from '@tanstack/react-query';
import { useAuthStore, hasRole } from '@/stores/authStore';
import { quizzesApi } from '@/api/quizzesApi';
import { userQuizzesApi } from '@/api/userQuizzesApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { BarChart3, Users, Trophy, TrendingUp, Target } from 'lucide-react';

const StatisticsPage = () => {
  const { user } = useAuthStore();
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');

  const { data: quizzesData } = useQuery({ queryKey: ['quizzes'], queryFn: () => quizzesApi.getQuizzes() });
  const tests = quizzesData?.results || [];

  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics', selectedQuizId],
    queryFn: () => userQuizzesApi.getQuizStatistics(parseInt(selectedQuizId)),
    enabled: !!selectedQuizId,
  });

  const canViewStatistics = hasRole(user, ['superuser']);

  if (!canViewStatistics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="shadow-card max-w-md"><CardContent className="p-8 text-center"><BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h2 className="text-xl font-bold mb-2">Ruxsat yo'q</h2><p className="text-muted-foreground">Statistikani ko'rish uchun admin huquqi kerak</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:ml-0 ml-12">
        <div><h1 className="text-2xl font-bold text-foreground">Statistika</h1><p className="text-muted-foreground">Test natijalarini tahlil qiling</p></div>
        <Select value={selectedQuizId} onValueChange={setSelectedQuizId}><SelectTrigger className="w-[280px]"><SelectValue placeholder="Testni tanlang" /></SelectTrigger><SelectContent>{tests.filter(t => t.status === 'completed').map(t => <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>)}</SelectContent></Select>
      </div>

      {!selectedQuizId ? (
        <Card className="shadow-card"><CardContent className="p-12 text-center"><BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="font-semibold text-foreground mb-2">Testni tanlang</h3><p className="text-muted-foreground">Statistikani ko'rish uchun yuqoridan test tanlang</p></CardContent></Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-28" />)}</div>
      ) : statistics ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Jami ishtirokchi</p><p className="text-2xl font-bold text-foreground">{statistics.total_participants}</p></div><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div></div></CardContent></Card>
            <Card className="shadow-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">O'rtacha ball</p><p className="text-2xl font-bold text-foreground">{statistics.average_score}</p></div><div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center"><Target className="w-6 h-6 text-accent" /></div></div></CardContent></Card>
            <Card className="shadow-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Eng yuqori ball</p><p className="text-2xl font-bold text-foreground">{statistics.highest_score}</p></div><div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-success" /></div></div></CardContent></Card>
            <Card className="shadow-card"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">O'tish foizi</p><p className="text-2xl font-bold text-foreground">{statistics.pass_rate}%</p></div><div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center"><Trophy className="w-6 h-6 text-warning" /></div></div></CardContent></Card>
          </div>

          <Card className="shadow-card"><CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5 text-warning" />Reyting jadvali</CardTitle><CardDescription>Eng yaxshi natijalar</CardDescription></CardHeader><CardContent>
            {statistics.rankings && statistics.rankings.length > 0 ? (
              <div className="space-y-3">{statistics.rankings.map((entry, idx) => (
                <div key={entry.user_id} className={`flex items-center gap-4 p-4 rounded-xl ${idx === 0 ? 'bg-yellow-50 border border-yellow-200' : idx === 1 ? 'bg-gray-50 border border-gray-200' : idx === 2 ? 'bg-amber-50 border border-amber-200' : 'bg-secondary/30'}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : idx === 1 ? 'bg-gray-400 text-gray-900' : idx === 2 ? 'bg-amber-400 text-amber-900' : 'bg-secondary text-muted-foreground'}`}>{entry.rank}</div>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-foreground">{entry.user_name}</p><p className="text-sm text-muted-foreground">{entry.school}</p></div>
                  <div className="text-right"><p className="text-xl font-bold text-foreground">{entry.score}</p><p className="text-xs text-muted-foreground">ball</p></div>
                </div>
              ))}</div>
            ) : <div className="text-center py-8"><BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">Ma'lumot yo'q</p></div>}
          </CardContent></Card>
        </>
      ) : <Card className="shadow-card"><CardContent className="p-12 text-center"><BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="font-semibold text-foreground mb-2">Statistika yo'q</h3></CardContent></Card>}
    </div>
  );
};

export default StatisticsPage;
