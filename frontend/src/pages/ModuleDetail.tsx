import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { modules } from '@/lib/seedData';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const mod = modules.find(m => m.id === id);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const data = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
    setCompleted(data[id!] || []);
  }, [id, currentUser]);

  const toggle = (topic: string) => {
    if (!currentUser) return;
    const next = completed.includes(topic) ? completed.filter(t => t !== topic) : [...completed, topic];
    setCompleted(next);
    const data = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
    data[id!] = next;
    localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(data));
  };

  if (!mod) return <div className="p-8 text-center">Module not found</div>;

  const progress = Math.round((completed.length / mod.topics.length) * 100);

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/modules" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Modules
        </Link>
        <Card className="mt-6">
          <CardHeader>
            <div className="inline-block rounded-md bg-primary/10 px-3 py-1 text-sm font-bold text-primary w-fit">{mod.shortCode}</div>
            <CardTitle className="mt-2">{mod.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{mod.description}</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Progress</span><span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mod.topics.map((topic, i) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    checked={completed.includes(topic)}
                    onCheckedChange={() => toggle(topic)}
                  />
                  <span className={`text-sm ${completed.includes(topic) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{topic}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
