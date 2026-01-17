import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, hasRole } from '@/stores/authStore';
import { quizzesApi } from '@/api/quizzesApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Calendar, Clock, Users, Play, CheckCircle } from 'lucide-react';
import type { Quiz } from '@/types';

const classCategories = ['5-sinf', '6-sinf', '7-sinf', '8-sinf', '9-sinf', '10-sinf', '11-sinf'];

const TestsPage = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', subject_id: 1, class_category: '', duration: '60', start_time: '' });

  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: () => quizzesApi.getQuizzes(),
  });

  const tests = quizzesData?.results || [];

  const createMutation = useMutation({
    mutationFn: quizzesApi.createQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      setIsDialogOpen(false);
      toast({ title: "Muvaffaqiyatli!", description: "Test yaratildi" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Quiz['status'] }) => quizzesApi.updateQuiz(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      toast({ title: "Muvaffaqiyatli!", description: "Test holati yangilandi" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = new Date(formData.start_time);
    const endTime = new Date(startTime.getTime() + parseInt(formData.duration) * 60000);
    createMutation.mutate({
      title: formData.title, description: formData.description, subject_id: formData.subject_id,
      class_category: formData.class_category, duration: parseInt(formData.duration),
      start_time: startTime.toISOString(), end_time: endTime.toISOString(),
    });
  };

  const getStatusBadge = (status: Quiz['status']) => {
    const badges = {
      scheduled: <Badge className="bg-warning/10 text-warning">Rejalashtirilgan</Badge>,
      active: <Badge className="bg-success/10 text-success">Faol</Badge>,
      completed: <Badge variant="secondary">Yakunlangan</Badge>,
      cancelled: <Badge variant="destructive">Bekor qilingan</Badge>,
      draft: <Badge variant="outline">Qoralama</Badge>,
    };
    return badges[status] || null;
  };

  const canManageStatus = hasRole(user, ['superuser']);
  const canCreateTest = hasRole(user, ['teacher', 'superuser']);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between lg:ml-0 ml-12">
        <div><h1 className="text-2xl font-bold text-foreground">Testlar</h1><p className="text-muted-foreground">Barcha testlarni boshqaring</p></div>
        {canCreateTest && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Yangi test</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Yangi test yaratish</DialogTitle><DialogDescription>Test ma'lumotlarini kiriting</DialogDescription></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2"><Label>Test nomi</Label><Input value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Tavsif</Label><Textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Sinf</Label><Select value={formData.class_category} onValueChange={(v) => setFormData(p => ({ ...p, class_category: v }))}><SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger><SelectContent>{classCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Davomiyligi (daqiqa)</Label><Input type="number" value={formData.duration} onChange={(e) => setFormData(p => ({ ...p, duration: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>Boshlanish vaqti</Label><Input type="datetime-local" value={formData.start_time} onChange={(e) => setFormData(p => ({ ...p, start_time: e.target.value }))} /></div>
                <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Bekor qilish</Button><Button type="submit" className="gradient-primary text-primary-foreground">Yaratish</Button></div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {isLoading ? [1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />) : tests.length > 0 ? tests.map((test) => (
          <Card key={test.id} className="shadow-card overflow-hidden">
            <div className={`h-1 ${test.status === 'active' ? 'bg-success' : test.status === 'scheduled' ? 'bg-warning' : 'bg-muted'}`} />
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2"><h3 className="font-semibold text-foreground">{test.title}</h3>{getStatusBadge(test.status)}</div>
                  <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(test.start_time).toLocaleDateString('uz-UZ')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{test.duration} daqiqa</span>
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" />{test.class_category}</span>
                  </div>
                </div>
                {canManageStatus && test.status !== 'completed' && (
                  <div className="flex gap-2">
                    {test.status === 'scheduled' && <Button size="sm" onClick={() => statusMutation.mutate({ id: test.id, status: 'active' })} className="bg-success hover:bg-success/90"><Play className="w-4 h-4 mr-1" />Boshlash</Button>}
                    {test.status === 'active' && <Button size="sm" variant="secondary" onClick={() => statusMutation.mutate({ id: test.id, status: 'completed' })}><CheckCircle className="w-4 h-4 mr-1" />Yakunlash</Button>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )) : <Card className="shadow-card"><CardContent className="p-12 text-center"><Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="font-semibold text-foreground mb-2">Testlar yo'q</h3></CardContent></Card>}
      </div>
    </div>
  );
};

export default TestsPage;
