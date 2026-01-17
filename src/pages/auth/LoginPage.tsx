import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/authApi';
import { getRedirectPath } from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Loader2, ArrowLeft, Phone, KeyRound } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setLoading, isLoading, setPhoneNumber, phoneNumber, isVerifying, setVerifying } = useAuthStore();
  const { toast } = useToast();
  
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    // Format as +998 XX XXX XX XX
    if (digits.length <= 3) return `+${digits}`;
    if (digits.length <= 5) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
    if (digits.length <= 8) return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
    if (digits.length <= 10) return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const getCleanPhone = () => {
    return '+' + phone.replace(/\D/g, '');
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cleanPhone = getCleanPhone();
    if (cleanPhone.length < 13) {
      toast({
        title: "Xatolik",
        description: "Telefon raqamini to'liq kiriting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await authApi.sendCode(cleanPhone);
      setPhoneNumber(cleanPhone);
      setStep('code');
      setVerifying(true);
      
      toast({
        title: "Kod yuborildi",
        description: `${cleanPhone} raqamiga SMS kod yuborildi`,
      });
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.response?.data?.detail || "SMS yuborilmadi. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast({
        title: "Xatolik",
        description: "Kodni to'liq kiriting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const cleanPhone = phoneNumber || getCleanPhone();
      const response = await authApi.verifyCode(cleanPhone, code);
      
      login(response.user, response.access, response.refresh);
      
      const displayName = response.user.first_name 
        ? `${response.user.first_name} ${response.user.last_name}`.trim()
        : response.user.phone_number;
      
      toast({
        title: "Muvaffaqiyatli!",
        description: `Xush kelibsiz, ${displayName}!`,
      });
      
      navigate(getRedirectPath(response.user.role));
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.response?.data?.detail || "Kod noto'g'ri. Qaytadan urinib ko'ring.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setCode('');
    setVerifying(false);
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
              {step === 'phone' 
                ? "Telefon raqamingizni kiriting"
                : "SMS orqali yuborilgan kodni kiriting"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon raqam</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+998 XX XXX XX XX"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="h-12 pl-10 text-lg"
                      maxLength={17}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary text-primary-foreground font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    'Kodni yuborish'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="mb-2 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Orqaga
                </Button>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <KeyRound className="w-4 h-4" />
                    <span>Kod {phoneNumber} ga yuborildi</span>
                  </div>
                  
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={code}
                      onChange={setCode}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="w-12 h-14 text-xl" />
                        <InputOTPSlot index={1} className="w-12 h-14 text-xl" />
                        <InputOTPSlot index={2} className="w-12 h-14 text-xl" />
                        <InputOTPSlot index={3} className="w-12 h-14 text-xl" />
                        <InputOTPSlot index={4} className="w-12 h-14 text-xl" />
                        <InputOTPSlot index={5} className="w-12 h-14 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 gradient-primary text-primary-foreground font-semibold"
                  disabled={isLoading || code.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Tekshirilmoqda...
                    </>
                  ) : (
                    'Kirish'
                  )}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="link"
                    className="text-muted-foreground"
                    onClick={handleSendCode}
                    disabled={isLoading}
                  >
                    Kodni qayta yuborish
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
