import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { modules, defaultAttendanceLogs } from '@/lib/seedData';
import { User, AttendanceLog, Recording, Testimonial, Purchase as PurchaseType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PageTransition from '@/components/PageTransition';
import { Users, Video, FileText, ShoppingCart, MessageSquare, Send, ImagePlus, Type, X } from 'lucide-react';
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

const roleBadgeColor: Record<string, string> = {
  student: 'bg-blue-100 text-blue-700',
  mentor: 'bg-purple-100 text-purple-700',
  admin: 'bg-amber-100 text-amber-700',
};

export default function AdminDashboard() {
  const [students, setStudents] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [purchases, setPurchases] = useState<PurchaseType[]>([]);
  const [showRecording, setShowRecording] = useState<Recording | null>(null);
  const [messagingUser, setMessagingUser] = useState<AttendanceLog | null>(null);
  const [messageText, setMessageText] = useState('');

  // New testimonial form
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newText, setNewText] = useState('');
  const [newRating, setNewRating] = useState('5');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const reload = async () => {
    try {
      const [usersRes, logsRes, recordingsRes, testimonialsRes, purchasesRes] = await Promise.all([
        api.get('/users'),
        api.get('/users/attendance'), // Note: Backend needs this or fallback
        Promise.resolve({ data: JSON.parse(localStorage.getItem('recordings') || '[]') }),
        api.get('/testimonials'),
        api.get('/purchases')
      ]);

      setAllUsers(usersRes.data);
      setStudents(usersRes.data.filter((u: User) => u.role === 'student'));
      
      const storedLogs = logsRes.data || [];
      setLogs(storedLogs.length > 0 ? storedLogs : defaultAttendanceLogs);
      
      setRecordings(recordingsRes.data);
      setTestimonials(testimonialsRes.data);
      setPurchases(purchasesRes.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('Failed to sync with database');
    }
  };

  useEffect(reload, []);

  const getStudentProgress = (userId: string, moduleId: string) => {
    const data = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || !data[moduleId]) return 0;
    return Math.round((data[moduleId].length / mod.topics.length) * 100);
  };

  const liveMeetings = JSON.parse(localStorage.getItem('meetings') || '[]').filter((m: any) => m.status === 'live').length;

  // Testimonial media handle
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1024 * 1024) {
      toast.error("Image too large. Please keep it under 1MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImageUrl(reader.result as string);
      setIsUploading(false);
      toast.success("Image attached!");
    };
    reader.readAsDataURL(file);
  };

  // Testimonial CRUD
  const addTestimonial = async () => {
    if (!newName || !newText) return;
    try {
      const initials = newName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
      const payload = { 
        name: newName, 
        role: newRole, 
        text: newText, 
        rating: parseInt(newRating), 
        avatarInitials: initials,
        imageUrl: newImageUrl,
        videoUrl: newVideoUrl
      };
      
      await api.post('/testimonials', payload);
      setNewName(''); setNewRole(''); setNewText(''); setNewRating('5'); 
      setNewImageUrl(''); setNewVideoUrl('');
      toast.success('Testimonial added to database');
      reload();
    } catch (error) {
      toast.error('Failed to add testimonial');
    }
  };

  const saveTestimonial = async (id: string, field: string, value: string | number) => {
    try {
      const t = testimonials.find(item => item.id === id || (item as any)._id === id);
      const realId = (t as any)._id || t?.id;
      const updatedData = { ...t, [field]: value };
      await api.put(`/testimonials/${realId}`, updatedData);
      reload();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      const realId = id; // Assuming id is the MongoDB _id
      await api.delete(`/testimonials/${realId}`);
      toast.success('Deleted');
      reload();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !messagingUser) return;
    toast.success(`Message sent to ${messagingUser.name}`);
    setMessageText('');
    setMessagingUser(null);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { icon: Users, label: 'Total Students', value: students.length },
            { icon: Video, label: 'Active Meetings', value: liveMeetings },
            { icon: FileText, label: 'Recordings', value: recordings.length },
            { icon: ShoppingCart, label: 'Purchases', value: purchases.length },
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

        <Tabs defaultValue="testimonials" className="mt-8">
          <TabsList>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="purchases">Purchases</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
          </TabsList>

          {/* Testimonials Editor */}
          <TabsContent value="testimonials">
            <Card>
              <CardHeader><CardTitle>Manage Testimonials</CardTitle></CardHeader>
              <CardContent>
                {/* Add form */}
                <div className="mb-6 rounded-lg border p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Add New Testimonial</h3>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} />
                    <Input placeholder="Role" value={newRole} onChange={e => setNewRole(e.target.value)} />
                    <Select value={newRating} onValueChange={setNewRating}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n} Star{n>1?'s':''}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea placeholder="Testimonial text" value={newText} onChange={e => setNewText(e.target.value)} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold flex items-center gap-2">
                        <ImagePlus className="h-3 w-3" /> Photo / Image
                      </Label>
                      <div className="flex gap-2 items-center">
                        <Input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs h-9 cursor-pointer" />
                        {newImageUrl && <div className="h-9 w-9 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                          <img src={newImageUrl} className="object-cover h-full w-full" alt="Preview" />
                        </div>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-muted-foreground font-bold flex items-center gap-2">
                        <Video className="h-3 w-3" /> Video Link (YouTube/Vimeo)
                      </Label>
                      <Input placeholder="https://youtube.com/..." value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} className="h-9" />
                    </div>
                  </div>
                  <Button size="sm" onClick={addTestimonial} disabled={isUploading}>
                    {isUploading ? 'Uploading...' : 'Add Testimonial to Cloud'}
                  </Button>
                </div>

                {/* List */}
                <div className="space-y-4">
                  {testimonials.map((t: any) => (
                    <div key={t._id || t.id} className="rounded-lg border p-4 space-y-3 relative group">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <Input value={t.name} onChange={e => saveTestimonial(t._id || t.id, 'name', e.target.value)} />
                        <Input value={t.role} onChange={e => saveTestimonial(t._id || t.id, 'role', e.target.value)} />
                        <Select value={String(t.rating)} onValueChange={v => saveTestimonial(t._id || t.id, 'rating', parseInt(v))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n} Star{n>1?'s':''}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Media Display in list */}
                      {(t.imageUrl || t.videoUrl) && (
                        <div className="flex gap-2 overflow-x-auto py-1">
                          {t.imageUrl && (
                            <div className="relative h-16 w-24 rounded border overflow-hidden">
                              <img src={t.imageUrl} className="object-cover h-full w-full" alt="Testimonial" />
                              <button onClick={() => saveTestimonial(t._id || t.id, 'imageUrl', '')} className="absolute top-0 right-0 p-0.5 bg-black/50 text-white rounded-bl">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          {t.videoUrl && (
                            <div className="relative h-16 w-16 rounded border bg-muted flex items-center justify-center">
                              <Video className="h-4 w-4 text-primary" />
                              <button onClick={() => saveTestimonial(t._id || t.id, 'videoUrl', '')} className="absolute top-0 right-0 p-0.5 bg-black/50 text-white rounded-bl">
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <Textarea value={t.text} onChange={e => saveTestimonial(t._id || t.id, 'text', e.target.value)} />
                      <Button variant="destructive" size="sm" onClick={() => deleteTestimonial(t._id || t.id)}>Delete</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance */}
          <TabsContent value="attendance">
            <Card>
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
                    {logs.filter(l => l.role === 'student' || l.role === 'mentor').slice(-30).reverse().map((l, i) => (
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
          </TabsContent>

          {/* Progress */}
          <TabsContent value="progress">
            <Card>
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
          </TabsContent>

          {/* Purchases */}
          <TabsContent value="purchases">
            <Card>
              <CardHeader><CardTitle>Purchase Records</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>User</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Price</TableHead><TableHead>Date</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchases.map(p => (
                      <TableRow key={p.id}>
                        <TableCell>{p.userName}</TableCell>
                        <TableCell className="capitalize">{p.durationType}</TableCell>
                        <TableCell>{p.durationValue}</TableCell>
                        <TableCell>₹{p.totalPrice.toLocaleString('en-IN')}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(p.purchasedAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers.map(u => (
                      <TableRow key={u.id}>
                        <TableCell>{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell><Badge className={roleBadgeColor[u.role]}>{u.role}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recordings */}
          <TabsContent value="recordings">
            <Card>
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
          </TabsContent>
        </Tabs>


      </div>

      <Dialog open={!!messagingUser} onOpenChange={() => setMessagingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Message to {messagingUser?.name}
            </DialogTitle>
            <DialogDescription>
              Direct communication with the {messagingUser?.role}.
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
