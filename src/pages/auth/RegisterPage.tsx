import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/mockApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Loader2, ArrowLeft } from 'lucide-react';

const classCategories = [
  '5-sinf', '6-sinf', '7-sinf', '8-sinf', '9-sinf', '10-sinf', '11-sinf'
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading } = useAuthStore();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    classCategory: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.school || !formData.classCategory) {
      toast({
        title: "Xatolik",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Xatolik",
        description: "Parollar mos kelmadi",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Xatolik",
        description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const { user, token } = await authApi.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        school: formData.school,
        classCategory: formData.classCategory,
      });
      
      login(user, token);
      
      toast({
        title: "Muvaffaqiyatli!",
        description: "Ro'yxatdan o'tdingiz. Xush kelibsiz!",
      });
      
      navigate('/student/dashboard');
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ro'yxatdan o'tish amalga oshmadi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 px-4 py-8">
      <div className="w-full max-w-md animate-fade-in">
        {/* Back Button */}
        <Link 
          to="/login" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kirish sahifasiga qaytish
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary shadow-elevated mb-4">
            <GraduationCap className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Ro'yxatdan o'tish</h1>
          <p className="text-muted-foreground mt-1">Faqat o'quvchilar uchun</p>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">Yangi hisob yaratish</CardTitle>
            <CardDescription>
              Ma'lumotlaringizni to'ldiring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">To'liq ism</Label>
                <Input
                  id="fullName"
                  placeholder="Familiya Ism"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">Maktab nomi</Label>
                <Input
                  id="school"
                  placeholder="Masalan: 5-son maktab"
                  value={formData.school}
                  onChange={(e) => handleChange('school', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classCategory">Sinf</Label>
                <Select 
                  value={formData.classCategory} 
                  onValueChange={(value) => handleChange('classCategory', value)}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Sinfni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {classCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="h-11"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 gradient-primary text-primary-foreground font-semibold mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
