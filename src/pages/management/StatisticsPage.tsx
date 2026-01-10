import { useQuery } from '@tanstack/react-query';
import { useAuthStore, hasRole } from '@/stores/authStore';
import { statisticsApi, testsApi } from '@/api/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Medal,
  Target
} from 'lucide-react';

const StatisticsPage = () => {
  const { user } = useAuthStore();
  const [selectedTestId, setSelectedTestId] = useState<string>('');

  const { data: tests } = useQuery({
    queryKey: ['tests'],
    queryFn: () => testsApi.getTests(),
  });

  const { data: statistics, isLoading } = useQuery({
    queryKey: ['statistics', selectedTestId],
    queryFn: () => statisticsApi.getStatistics(selectedTestId ? { testId: selectedTestId } : undefined),
  });

  const currentStats = statistics?.[0];

  const canViewStatistics = hasRole(user, ['admin', 'super-admin']);

  if (!canViewStatistics) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="shadow-card max-w-md">
          <CardContent className="p-8 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Ruxsat yo'q</h2>
            <p className="text-muted-foreground">
              Statistikani ko'rish uchun admin huquqi kerak
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:ml-0 ml-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Statistika</h1>
          <p className="text-muted-foreground">Test natijalarini tahlil qiling</p>
        </div>
        
        <Select value={selectedTestId} onValueChange={setSelectedTestId}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Barcha testlar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Barcha testlar</SelectItem>
            {tests?.filter(t => t.status === 'completed').map(test => (
              <SelectItem key={test.id} value={test.id}>{test.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : currentStats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Jami ishtirokchi</p>
                    <p className="text-2xl font-bold text-foreground">{currentStats.totalParticipants}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">O'rtacha ball</p>
                    <p className="text-2xl font-bold text-foreground">{currentStats.averageScore}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Eng yuqori ball</p>
                    <p className="text-2xl font-bold text-foreground">{currentStats.highestScore}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">O'tish foizi</p>
                    <p className="text-2xl font-bold text-foreground">{currentStats.passRate}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-warning" />
                Reyting jadvali
              </CardTitle>
              <CardDescription>Eng yaxshi natijalar</CardDescription>
            </CardHeader>
            <CardContent>
              {currentStats.rankings && currentStats.rankings.length > 0 ? (
                <div className="space-y-3">
                  {currentStats.rankings.map((entry, idx) => (
                    <div 
                      key={entry.studentId}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                        idx === 0 ? 'bg-yellow-50 border border-yellow-200' :
                        idx === 1 ? 'bg-gray-50 border border-gray-200' :
                        idx === 2 ? 'bg-amber-50 border border-amber-200' :
                        'bg-secondary/30'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        idx === 0 ? 'bg-yellow-400 text-yellow-900' :
                        idx === 1 ? 'bg-gray-400 text-gray-900' :
                        idx === 2 ? 'bg-amber-400 text-amber-900' :
                        'bg-secondary text-muted-foreground'
                      }`}>
                        {idx < 3 ? (
                          <Medal className="w-6 h-6" />
                        ) : (
                          entry.rank
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">{entry.studentName}</p>
                          {idx === 0 && <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">🥇 Birinchi</Badge>}
                          {idx === 1 && <Badge className="bg-gray-100 text-gray-800 border-gray-300">🥈 Ikkinchi</Badge>}
                          {idx === 2 && <Badge className="bg-amber-100 text-amber-800 border-amber-300">🥉 Uchinchi</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.school}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">{entry.score}</p>
                        <p className="text-xs text-muted-foreground">ball</p>
                      </div>
                      
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-muted-foreground">
                          {Math.floor(entry.timeSpent / 60)}:{String(entry.timeSpent % 60).padStart(2, '0')}
                        </p>
                        <p className="text-xs text-muted-foreground">vaqt</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Ma'lumot yo'q</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Score Distribution (Visual placeholder) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Ball taqsimoti</CardTitle>
                <CardDescription>O'quvchilar ballari bo'yicha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { range: '90-100', percent: 15, color: 'bg-success' },
                    { range: '80-89', percent: 25, color: 'bg-primary' },
                    { range: '60-79', percent: 35, color: 'bg-warning' },
                    { range: '0-59', percent: 25, color: 'bg-destructive' },
                  ].map((item) => (
                    <div key={item.range} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.range} ball</span>
                        <span className="font-medium">{item.percent}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full transition-all duration-500`}
                          style={{ width: `${item.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Maktablar bo'yicha</CardTitle>
                <CardDescription>Top maktablar natijalari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { school: '5-son maktab', avg: 85, students: 12 },
                    { school: '12-son maktab', avg: 82, students: 15 },
                    { school: '1-son maktab', avg: 78, students: 18 },
                    { school: '8-son maktab', avg: 75, students: 10 },
                  ].map((item, idx) => (
                    <div key={item.school} className="flex items-center gap-4 p-3 bg-secondary/30 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.school}</p>
                        <p className="text-xs text-muted-foreground">{item.students} ishtirokchi</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{item.avg}%</p>
                        <p className="text-xs text-muted-foreground">o'rtacha</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="shadow-card">
          <CardContent className="p-12 text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Statistika yo'q</h3>
            <p className="text-muted-foreground">Hali yakunlangan testlar yo'q</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StatisticsPage;
