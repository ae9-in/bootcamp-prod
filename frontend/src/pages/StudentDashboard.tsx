import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { modules } from '@/lib/seedData';
import { AttendanceLog } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import PageTransition from '@/components/PageTransition';
import { BookOpen, Video } from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);

  useEffect(() => {
    const all: AttendanceLog[] = JSON.parse(localStorage.getItem('attendanceLogs') || '[]');
    setLogs(all.filter(l => l.userId === currentUser?.id).slice(-5).reverse());
  }, [currentUser]);

  const getProgress = (moduleId: string) => {
    if (!currentUser) return 0;
    const data = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || !data[moduleId]) return 0;
    return Math.round((data[moduleId].length / mod.topics.length) * 100);
  };

  return (
    <PageTransition>
      <div className="relative mx-auto max-w-7xl px-4 py-8">
        {/* Decorative Background Glows */}
        <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-none bg-gradient-to-r from-indigo-600/20 to-purple-600/20 shadow-xl shadow-indigo-500/10 transition-all hover:bg-indigo-600/25">
            <CardContent className="pt-8 pb-8">
              <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back, {currentUser?.name}! 👋</h1>
              <p className="mt-2 text-indigo-100/70 font-medium">You've completed 28% of your bootcamp. Keep it up!</p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Module Progress */}
          <Card className="bg-secondary/40 backdrop-blur-md border-indigo-500/10 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                Module Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              {modules.map(m => {
                const p = getProgress(m.id);
                return (
                  <div key={m.id} className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-indigo-50 group-hover:text-white transition-colors">
                        {m.title}
                      </span>
                      <span className="text-indigo-300 font-bold">{p}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={p} className="h-2.5 bg-indigo-950/50" />
                      {p > 0 && (
                        <div className="absolute top-0 left-0 h-2.5 w-full rounded-full bg-indigo-400/10 animate-pulse pointer-events-none" style={{ maxWidth: `${p}%` }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-secondary/40 backdrop-blur-md border-indigo-500/10 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
                  <div className="h-12 w-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
                    <Video className="h-6 w-6 text-indigo-400/50" />
                  </div>
                  <p className="text-sm text-indigo-200/50">No activity logged yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((l, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-sm hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-2 w-2 rounded-full ${l.event === 'login' ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                        <span className="font-medium text-white capitalize">{l.event}</span>
                      </div>
                      <span className="text-indigo-300/60 font-medium">{new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
            <Link to="/modules"><BookOpen className="mr-2 h-5 w-5" /> Explore Modules</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all">
            <Link to="/meeting"><Video className="mr-2 h-5 w-5" /> Join Live Meeting</Link>
          </Button>
        </div>
      </div>
    </PageTransition>
  );
}
