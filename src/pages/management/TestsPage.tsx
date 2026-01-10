import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, hasRole } from '@/stores/authStore';
import { testsApi } from '@/api/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import type { Test } from '@/types';

const classCategories = ['5-sinf', '6-sinf', '7-sinf', '8-sinf', '9-sinf', '10-sinf', '11-sinf'];
const subjects = ['Matematika', 'Fizika', 'Kimyo', 'Biologiya', 'Ingliz tili', 'Ona tili', 'Tarix'];

const TestsPage = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    classCategory: '',
    duration: '60',
    startTime: '',
  });

  const { data: tests, isLoading } = useQuery({
    queryKey: ['tests'],
    queryFn: () => testsApi.getTests(),
  });

  const createMutation = useMutation({
    mutationFn: testsApi.createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      setIsDialogOpen(false);
      setFormData({ title: '', description: '', subject: '', classCategory: '', duration: '60', startTime: '' });
      toast({ title: "Muvaffaqiyatli!", description: "Test yaratildi" });
    },
    onError: () => {
      toast({ title: "Xatolik", description: "Test yaratilmadi", variant: "destructive" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ testId, status }: { testId: string; status: Test['status'] }) => 
      testsApi.updateTestStatus(testId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      toast({ title: "Muvaffaqiyatli!", description: "Test holati yangilandi" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.classCategory || !formData.startTime) {
      toast({ title: "Xatolik", description: "Barcha maydonlarni to'ldiring", variant: "destructive" });
      return;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(startTime.getTime() + parseInt(formData.duration) * 60000);

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      subject: formData.subject,
      classCategory: formData.classCategory,
      duration: parseInt(formData.duration),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: 'scheduled',
      createdBy: user!.id,
      isActive: true,
    });
  };

  const getStatusBadge = (status: Test['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Rejalashtirilgan</Badge>;
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Faol</Badge>;
      case 'completed':
        return <Badge variant="secondary">Yakunlangan</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Bekor qilingan</Badge>;
      default:
        return null;
    }
  };

  const canManageStatus = hasRole(user, ['admin', 'super-admin']);
  const canCreateTest = hasRole(user, ['teacher', 'admin', 'super-admin']);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between lg:ml-0 ml-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Testlar</h1>
          <p className="text-muted-foreground">Barcha testlarni boshqaring</p>
        </div>
        
        {canCreateTest && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" />
                Yangi test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Yangi test yaratish</DialogTitle>
                <DialogDescription>Test ma'lumotlarini kiriting</DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Test nomi</Label>
                  <Input
                    id="title"
                    placeholder="Masalan: Matematika olimpiadasi"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Tavsif</Label>
                  <Textarea
                    id="description"
                    placeholder="Test haqida qisqacha ma'lumot"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fan</Label>
                    <Select 
                      value={formData.subject} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Sinf</Label>
                    <Select 
                      value={formData.classCategory} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, classCategory: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {classCategories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Davomiyligi (daqiqa)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="10"
                      max="180"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startTime">Boshlanish vaqti</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Bekor qilish
                  </Button>
                  <Button type="submit" className="gradient-primary text-primary-foreground" disabled={createMutation.isPending}>
                    Yaratish
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tests List */}
      <div className="grid gap-4">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full" />
          ))
        ) : tests && tests.length > 0 ? (
          tests.map((test) => (
            <Card key={test.id} className="shadow-card overflow-hidden">
              <div className={`h-1 ${
                test.status === 'active' ? 'bg-success' : 
                test.status === 'scheduled' ? 'bg-warning' : 'bg-muted'
              }`} />
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{test.title}</h3>
                      {getStatusBadge(test.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(test.startTime).toLocaleDateString('uz-UZ')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {test.duration} daqiqa
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {test.classCategory}
                      </span>
                      <Badge variant="outline">{test.subject}</Badge>
                    </div>
                  </div>

                  {canManageStatus && test.status !== 'completed' && (
                    <div className="flex gap-2">
                      {test.status === 'scheduled' && (
                        <Button 
                          size="sm"
                          onClick={() => statusMutation.mutate({ testId: test.id, status: 'active' })}
                          className="bg-success hover:bg-success/90"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Boshlash
                        </Button>
                      )}
                      {test.status === 'active' && (
                        <Button 
                          size="sm"
                          variant="secondary"
                          onClick={() => statusMutation.mutate({ testId: test.id, status: 'completed' })}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Yakunlash
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Testlar yo'q</h3>
              <p className="text-muted-foreground">Birinchi testni yaratish uchun tugmani bosing</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TestsPage;
