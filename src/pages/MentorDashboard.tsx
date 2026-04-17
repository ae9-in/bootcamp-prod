import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules, defaultAttendanceLogs } from '@/lib/seedData';
import { User, AttendanceLog, Recording } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import PageTransition from '@/components/PageTransition';
import { Users, Video, FileText, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

function CountUp({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(timer); }
      else setVal(start);
    }, 40);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val}</>;
}

export default function MentorDashboard() {
  const [students, setStudents] = useState<User[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [showRecording, setShowRecording] = useState<Recording | null>(null);
  const [messagingUser, setMessagingUser] = useState<AttendanceLog | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, logsRes] = await Promise.all([
          api.get('/users'),
          api.get('/users/attendance')
        ]);
        
        setStudents(usersRes.data.filter((u: User) => u.role === 'student'));
        
        const storedLogs = logsRes.data || [];
        setLogs(storedLogs.length > 0 ? storedLogs : defaultAttendanceLogs);
        
        setRecordings(JSON.parse(localStorage.getItem('recordings') || '[]'));
      } catch (error) {
        console.error('Mentor fetch failed');
        toast.error('Failed to sync with cloud database');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStudentProgress = (userId: string, moduleId: string) => {
    const data = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || !data[moduleId]) return 0;
    return Math.round((data[moduleId].length / mod.topics.length) * 100);
  };

  const liveMeetings = JSON.parse(localStorage.getItem('meetings') || '[]').filter((m: any) => m.status === 'live').length;

  const handleSendMessage = () => {
    if (!messageText.trim() || !messagingUser) return;
    toast.success(`Message sent to ${messagingUser.name}`);
    setMessageText('');
    setMessagingUser(null);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground">Mentor Dashboard</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Users, label: 'Total Students', value: students.length },
            { icon: Video, label: 'Active Meetings', value: liveMeetings },
            { icon: FileText, label: 'Recordings', value: recordings.length },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="flex items-center gap-4 pt-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                    <p className="text-2xl font-bold"><CountUp target={s.value} /></p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Attendance */}
        <Card className="mt-8">
          <CardHeader><CardTitle>Student Attendance</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.filter(l => l.role === 'student').slice(-20).reverse().map((l, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={l.event === 'login' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                        {l.event}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{new Date(l.timestamp).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setMessagingUser(l)}
                        className="text-primary hover:text-primary hover:bg-primary/10"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Student Progress */}
        <Card className="mt-8">
          <CardHeader><CardTitle>Student Progress</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow><TableHead>Student</TableHead>{modules.map(m => <TableHead key={m.id}>{m.shortCode}</TableHead>)}</TableRow>
              </TableHeader>
              <TableBody>
                {students.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    {modules.map(m => <TableCell key={m.id}>{getStudentProgress(s.id, m.id)}%</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recordings */}
        <Card className="mt-8">
          <CardHeader><CardTitle>Recordings</CardTitle></CardHeader>
          <CardContent>
            {recordings.length === 0 ? <p className="text-sm text-muted-foreground">No recordings yet.</p> : (
              <div className="space-y-2">
                {recordings.map(r => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border px-4 py-2">
                    <div>
                      <p className="text-sm font-medium">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.duration} • {new Date(r.recordedAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowRecording(r)}>View</Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Button asChild><Link to="/meeting">Host Meeting</Link></Button>
        </div>
      </div>

      <Dialog open={!!messagingUser} onOpenChange={() => setMessagingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Message to {messagingUser?.name}
            </DialogTitle>
            <DialogDescription>
              Direct communication with the student.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea 
                placeholder="Type your message here..." 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="min-h-[120px] bg-background/50"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setMessagingUser(null)}>Cancel</Button>
            <Button onClick={handleSendMessage} className="gap-2">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!showRecording} onOpenChange={() => setShowRecording(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showRecording?.title}</DialogTitle>
            <DialogDescription>
              Duration: {showRecording?.duration}<br />
              Participants: {showRecording?.participants.join(', ')}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
