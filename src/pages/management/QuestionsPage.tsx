import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore, hasRole } from '@/stores/authStore';
import { quizzesApi } from '@/api/quizzesApi';
import { questionsApi } from '@/api/questionsApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, HelpCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface FormOption { id: number; text: string; is_correct: boolean; }

const QuestionsPage = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [formData, setFormData] = useState({ quiz_id: 0, text: '', points: '5', options: [
    { id: 1, text: '', is_correct: true }, { id: 2, text: '', is_correct: false },
    { id: 3, text: '', is_correct: false }, { id: 4, text: '', is_correct: false },
  ] as FormOption[] });

  const { data: quizzesData } = useQuery({ queryKey: ['quizzes'], queryFn: () => quizzesApi.getQuizzes() });
  const tests = quizzesData?.results || [];

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', selectedQuizId],
    queryFn: () => questionsApi.getQuestionsByQuizId(parseInt(selectedQuizId)),
    enabled: !!selectedQuizId,
  });

  const createMutation = useMutation({
    mutationFn: questionsApi.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setIsDialogOpen(false);
      toast({ title: "Muvaffaqiyatli!", description: "Savol qo'shildi" });
    },
  });

  const handleOptionChange = (index: number, text: string) => {
    setFormData(prev => ({ ...prev, options: prev.options.map((opt, i) => i === index ? { ...opt, text } : opt) }));
  };

  const handleCorrectChange = (index: number) => {
    setFormData(prev => ({ ...prev, options: prev.options.map((opt, i) => ({ ...opt, is_correct: i === index })) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quiz_id || !formData.text) return;
    createMutation.mutate({
      quiz_id: formData.quiz_id, text: formData.text, points: parseInt(formData.points), order: (questions?.length || 0) + 1,
      options: formData.options.map(o => ({ text: o.text, is_correct: o.is_correct })),
    });
  };

  const canCreateQuestion = hasRole(user, ['teacher', 'superuser']);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 lg:ml-0 ml-12">
        <div><h1 className="text-2xl font-bold text-foreground">Savollar</h1><p className="text-muted-foreground">Test savollarini boshqaring</p></div>
        {canCreateQuestion && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Yangi savol</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Yangi savol qo'shish</DialogTitle><DialogDescription>Savol ma'lumotlarini kiriting</DialogDescription></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Test</Label><Select value={String(formData.quiz_id || '')} onValueChange={(v) => setFormData(p => ({ ...p, quiz_id: parseInt(v) }))}><SelectTrigger><SelectValue placeholder="Testni tanlang" /></SelectTrigger><SelectContent>{tests.filter(t => t.status !== 'completed').map(t => <SelectItem key={t.id} value={String(t.id)}>{t.title}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label>Ball</Label><Input type="number" value={formData.points} onChange={(e) => setFormData(p => ({ ...p, points: e.target.value }))} /></div>
                </div>
                <div className="space-y-2"><Label>Savol matni</Label><Textarea value={formData.text} onChange={(e) => setFormData(p => ({ ...p, text: e.target.value }))} rows={3} /></div>
                <div className="space-y-3"><Label>Javob variantlari</Label>
                  {formData.options.map((option, idx) => (
                    <div key={option.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${option.is_correct ? 'bg-success text-success-foreground' : 'bg-secondary text-muted-foreground'}`}>{String.fromCharCode(65 + idx)}</div>
                      <Input value={option.text} onChange={(e) => handleOptionChange(idx, e.target.value)} className="flex-1" />
                      <Switch checked={option.is_correct} onCheckedChange={() => handleCorrectChange(idx)} />
                      {option.is_correct ? <CheckCircle2 className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 pt-4"><Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Bekor qilish</Button><Button type="submit" className="gradient-primary text-primary-foreground" disabled={createMutation.isPending}>{createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Qo'shish</Button></div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="shadow-card"><CardContent className="p-4"><div className="flex items-center gap-4"><Label className="text-sm font-medium whitespace-nowrap">Testni tanlang:</Label><Select value={selectedQuizId} onValueChange={setSelectedQuizId}><SelectTrigger className="max-w-xs"><SelectValue placeholder="Test tanlang" /></SelectTrigger><SelectContent>{tests.map(t => <SelectItem key={t.id} value={String(t.id)}>{t.title} ({t.question_count} savol)</SelectItem>)}</SelectContent></Select></div></CardContent></Card>

      {selectedQuizId ? (questionsLoading ? <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div> : questions && questions.length > 0 ? (
        <div className="space-y-4">{questions.map((q, idx) => (
          <Card key={q.id} className="shadow-card"><CardContent className="p-6"><div className="flex items-start gap-4"><div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">{idx + 1}</div><div className="flex-1"><div className="flex items-center gap-2 mb-2"><p className="font-medium text-foreground">{q.text}</p><Badge variant="outline">{q.points} ball</Badge></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">{q.options.map((o, oi) => (<div key={o.id} className={`flex items-center gap-2 p-2 rounded-lg ${o.is_correct ? 'bg-success/10 border border-success/30' : 'bg-secondary/50'}`}><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${o.is_correct ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>{String.fromCharCode(65 + oi)}</span><span className={`text-sm ${o.is_correct ? 'text-success font-medium' : 'text-muted-foreground'}`}>{o.text}</span>{o.is_correct && <CheckCircle2 className="w-4 h-4 text-success ml-auto" />}</div>))}</div></div></div></CardContent></Card>
        ))}</div>
      ) : <Card className="shadow-card"><CardContent className="p-12 text-center"><HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="font-semibold text-foreground mb-2">Savollar yo'q</h3></CardContent></Card>) : <Card className="shadow-card"><CardContent className="p-12 text-center"><HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" /><h3 className="font-semibold text-foreground mb-2">Test tanlang</h3></CardContent></Card>}
    </div>
  );
};

export default QuestionsPage;
