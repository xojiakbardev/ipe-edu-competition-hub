import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { testsApi, statisticsApi } from '@/api/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Trophy, 
  TrendingUp,
  Clock,
  Calendar
} from 'lucide-react';

const ManagementDashboard = () => {
  const { user } = useAuthStore();

  const { data: tests, isLoading: testsLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: () => testsApi.getTests(),
  });

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: () => statisticsApi.getStatistics(),
  });

  const activeTests = tests?.filter(t => t.status === 'active' || t.status === 'scheduled') || [];
  const completedTests = tests?.filter(t => t.status === 'completed') || [];

  const getRoleWelcome = () => {
    switch (user?.role) {
      case 'super-admin':
        return "Barcha tizim ma'lumotlarini ko'rishingiz mumkin";
      case 'admin':
        return "Testlarni boshqarish va natijalarni ko'rishingiz mumkin";
      case 'teacher':
        return "Test va savollar yaratishingiz mumkin";
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="lg:ml-0 ml-12">
        <h1 className="text-2xl font-bold text-foreground">
          Xush kelibsiz, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">{getRoleWelcome()}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faol testlar</p>
                {testsLoading ? (
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
                {testsLoading ? (
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
                <p className="text-sm text-muted-foreground">Jami ishtirokchi</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {statistics?.reduce((sum, s) => sum + s.totalParticipants, 0) || 0}
                  </p>
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
                {statsLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {Math.round(statistics?.reduce((sum, s) => sum + s.averageScore, 0) / (statistics?.length || 1)) || 0}%
                  </p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tests */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>So'nggi testlar</CardTitle>
          <CardDescription>Oxirgi yaratilgan va faol testlar</CardDescription>
        </CardHeader>
        <CardContent>
          {testsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : tests && tests.length > 0 ? (
            <div className="space-y-4">
              {tests.slice(0, 5).map((test) => (
                <div 
                  key={test.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{test.title}</h4>
                      <Badge 
                        variant={test.status === 'active' ? 'default' : test.status === 'scheduled' ? 'secondary' : 'outline'}
                        className={
                          test.status === 'active' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : test.status === 'scheduled'
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : ''
                        }
                      >
                        {test.status === 'active' ? 'Faol' : test.status === 'scheduled' ? 'Rejalashtirilgan' : 'Yakunlangan'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(test.startTime).toLocaleDateString('uz-UZ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {test.duration} daqiqa
                      </span>
                      <span>{test.classCategory}</span>
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

      {/* Role-specific content */}
      {(user?.role === 'admin' || user?.role === 'super-admin') && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Top 3 natijalar</CardTitle>
            <CardDescription>Eng yaxshi natijalarni ko'rsatgan o'quvchilar</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : statistics && statistics[0]?.rankings ? (
              <div className="space-y-3">
                {statistics[0].rankings.slice(0, 3).map((entry, idx) => (
                  <div 
                    key={entry.studentId}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                      idx === 1 ? 'bg-gray-100 text-gray-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{entry.studentName}</p>
                      <p className="text-sm text-muted-foreground">{entry.school}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{entry.score} ball</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">Ma'lumot yo'q</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ManagementDashboard;
