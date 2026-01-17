import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { quizzesApi } from '@/api/quizzesApi';
import { userQuizzesApi } from '@/api/userQuizzesApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Trophy, TrendingUp, Clock, Calendar } from 'lucide-react';

const ManagementDashboard = () => {
  const { user } = useAuthStore();

  const { data: quizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizzesApi.getQuizzes(),
  });

  const tests = quizzes?.results || [];
  const activeTests = tests.filter(t => t.status === 'active' || t.status === 'scheduled');
  const completedTests = tests.filter(t => t.status === 'completed');

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.first_name) return user.first_name;
    return user.phone_number;
  };

  const getRoleWelcome = () => {
    switch (user?.role) {
      case 'superuser':
        return "Barcha tizim ma'lumotlarini ko'rishingiz mumkin";
      case 'teacher':
        return "Test va savollar yaratishingiz mumkin";
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="lg:ml-0 ml-12">
        <h1 className="text-2xl font-bold text-foreground">
          Xush kelibsiz, {getUserDisplayName()}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">{getRoleWelcome()}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faol testlar</p>
                {quizzesLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{activeTests.length}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Yakunlangan</p>
                {quizzesLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{completedTests.length}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Jami testlar</p>
                {quizzesLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{tests.length}</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">O'rtacha ball</p>
                <p className="text-2xl font-bold text-foreground">-</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>So'nggi testlar</CardTitle>
          <CardDescription>Oxirgi yaratilgan va faol testlar</CardDescription>
        </CardHeader>
        <CardContent>
          {quizzesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (<Skeleton key={i} className="h-20 w-full" />))}
            </div>
          ) : tests.length > 0 ? (
            <div className="space-y-4">
              {tests.slice(0, 5).map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{test.title}</h4>
                      <Badge variant={test.status === 'active' ? 'default' : 'secondary'}
                        className={test.status === 'active' ? 'bg-success/10 text-success' : test.status === 'scheduled' ? 'bg-warning/10 text-warning' : ''}>
                        {test.status === 'active' ? 'Faol' : test.status === 'scheduled' ? 'Rejalashtirilgan' : 'Yakunlangan'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(test.start_time).toLocaleDateString('uz-UZ')}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{test.duration} daqiqa</span>
                      <span>{test.class_category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Hali test yo'q</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagementDashboard;
