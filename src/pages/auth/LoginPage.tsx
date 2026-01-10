import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/mockApi';
import { getRedirectPath } from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Users, ShieldCheck, Crown, Loader2, BookOpen } from 'lucide-react';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string; icon: React.ReactNode; description: string }[] = [
  { value: 'student', label: "O'quvchi", icon: <GraduationCap className="w-5 h-5" />, description: "Test topshirish uchun" },
  { value: 'teacher', label: "O'qituvchi", icon: <BookOpen className="w-5 h-5" />, description: "Test yaratish uchun" },
  { value: 'admin', label: 'Admin', icon: <ShieldCheck className="w-5 h-5" />, description: "Testlarni boshqarish" },
  { value: 'super-admin', label: 'Super Admin', icon: <Crown className="w-5 h-5" />, description: "To'liq boshqaruv" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuthStore();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { user, token } = await authApi.login(email, password, selectedRole);
      login(user, token);
      
      toast({
        title: "Muvaffaqiyatli!",
        description: `Xush kelibsiz, ${user.fullName}!`,
      });
      
      navigate(getRedirectPath(user.role));
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Kirish amalga oshmadi. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">IPe Education</h1>
          <p className="text-muted-foreground mt-1">Test olimpiada tizimi</p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Tizimga kirish</CardTitle>
            <CardDescription>
              Hisobingiz yo'qmi?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Ro'yxatdan o'ting
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-3">
                <Label>Rolni tanlang</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setSelectedRole(value as UserRole)}
                  className="grid grid-cols-2 gap-3"
                >
                  {roles.map((role) => (
                    <div key={role.value}>
                      <RadioGroupItem
                        value={role.value}
                        id={role.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={role.value}
                        className="flex flex-col items-center justify-center p-3 rounded-lg border-2 border-muted cursor-pointer transition-all hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                      >
                        <span className="text-primary mb-1">{role.icon}</span>
                        <span className="font-medium text-sm">{role.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 gradient-primary text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  'Kirish'
                )}
              </Button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground text-center">
                <span className="font-medium">Demo:</span> Istalgan email va parol bilan kiring
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
