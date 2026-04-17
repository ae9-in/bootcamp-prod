import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Meeting as MeetingType, Recording } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Users, MessageSquare } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

export default function MeetingPage() {
  const { currentUser } = useAuth();
  const [meetings, setMeetings] = useState<MeetingType[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showRecording, setShowRecording] = useState<Recording | null>(null);

  const reload = () => {
    setMeetings(JSON.parse(localStorage.getItem('meetings') || '[]'));
    setRecordings(JSON.parse(localStorage.getItem('recordings') || '[]'));
  };

  useEffect(reload, []);

  const liveMeeting = meetings.find(m => m.status === 'live');
  const isHost = liveMeeting?.hostId === currentUser?.id;
  const isParticipant = liveMeeting?.participants.some(p => p.id === currentUser?.id);
  const canHost = currentUser?.role === 'mentor' || currentUser?.role === 'admin';

  const startMeeting = () => {
    if (!currentUser) return;
    const m: MeetingType = {
      id: Date.now().toString(),
      hostId: currentUser.id,
      hostName: currentUser.name,
      startTime: new Date().toISOString(),
      status: 'live',
      participants: [{ id: currentUser.id, name: currentUser.name }],
    };
    const all = [...meetings, m];
    localStorage.setItem('meetings', JSON.stringify(all));
    reload();
  };

  const joinMeeting = () => {
    if (!currentUser || !liveMeeting) return;
    if (isParticipant) return;
    liveMeeting.participants.push({ id: currentUser.id, name: currentUser.name });
    const updated = meetings.map(m => m.id === liveMeeting.id ? liveMeeting : m);
    localStorage.setItem('meetings', JSON.stringify(updated));
    reload();
  };

  const endMeeting = () => {
    if (!liveMeeting) return;
    liveMeeting.status = 'ended';
    liveMeeting.endTime = new Date().toISOString();
    const duration = Math.round((new Date(liveMeeting.endTime).getTime() - new Date(liveMeeting.startTime).getTime()) / 60000);
    const updated = meetings.map(m => m.id === liveMeeting.id ? liveMeeting : m);
    localStorage.setItem('meetings', JSON.stringify(updated));
    const rec: Recording = {
      id: Date.now().toString(),
      title: `Meeting by ${liveMeeting.hostName}`,
      duration: `${duration} min`,
      participants: liveMeeting.participants.map(p => p.name),
      recordingUrl: '#',
      recordedAt: liveMeeting.endTime,
    };
    const recs = [...recordings, rec];
    localStorage.setItem('recordings', JSON.stringify(recs));
    reload();
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground">Meeting Room</h1>

        {/* Main area */}
        <div className="mt-6 flex gap-4">
          <div className="flex-1">
            <div className="relative aspect-video rounded-2xl bg-foreground/95 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-3xl font-bold text-primary-foreground">
                {currentUser?.name?.charAt(0)}
              </div>
              {liveMeeting && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
                  <span className="text-xs text-primary-foreground/80 font-medium">LIVE</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-4 rounded-2xl bg-secondary/40 backdrop-blur-xl border border-white/5 px-8 py-4 shadow-2xl">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full transition-all duration-300 ${micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-destructive/20 text-destructive hover:bg-destructive/30'}`} 
                onClick={() => setMicOn(!micOn)}
              >
                {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full transition-all duration-300 ${camOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-destructive/20 text-destructive hover:bg-destructive/30'}`} 
                onClick={() => setCamOn(!camOn)}
              >
                {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-300">
                <Monitor className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full transition-all duration-300 ${showParticipants ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white/10 text-white hover:bg-white/20'}`} 
                onClick={() => setShowParticipants(!showParticipants)}
              >
                <Users className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`rounded-full transition-all duration-300 ${showChat ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white/10 text-white hover:bg-white/20'}`} 
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              {liveMeeting && (isHost || currentUser?.role === 'admin') && (
                <Button variant="destructive" size="icon" className="rounded-full shadow-lg shadow-destructive/20 hover:scale-110 active:scale-95 transition-all" onClick={endMeeting}>
                  <PhoneOff className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-3">
              {!liveMeeting && canHost && (
                <Button onClick={startMeeting}>Start Meeting</Button>
              )}
              {liveMeeting && !isParticipant && (
                <Button onClick={joinMeeting}>Join Meeting</Button>
              )}
              {liveMeeting && isParticipant && !isHost && (
                <p className="text-sm text-muted-foreground self-center">You're in the meeting</p>
              )}
              {!liveMeeting && !canHost && (
                <p className="text-sm text-muted-foreground">No live meeting. Wait for a mentor to start one.</p>
              )}
            </div>
          </div>

          {/* Side panels */}
          {showParticipants && liveMeeting && (
            <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-64">
              <Card><CardContent className="pt-4">
                <h3 className="font-semibold text-sm mb-3">Participants ({liveMeeting.participants.length})</h3>
                {liveMeeting.participants.map(p => (
                  <div key={p.id} className="flex items-center gap-2 py-1 text-sm text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-green-500" /> {p.name}
                  </div>
                ))}
              </CardContent></Card>
            </motion.div>
          )}
          {showChat && (
            <motion.div initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-64">
              <Card className="h-full"><CardContent className="pt-4">
                <h3 className="font-semibold text-sm mb-3">Chat</h3>
                <p className="text-xs text-muted-foreground">Chat messages will appear here during live meetings.</p>
              </CardContent></Card>
            </motion.div>
          )}
        </div>

        {/* Past recordings */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground">Past Recordings</h2>
          {recordings.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No recordings yet.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recordings.map(r => (
                <Card key={r.id} className="cursor-pointer" onClick={() => setShowRecording(r)}>
                  <CardContent className="pt-4">
                    <p className="font-semibold text-sm">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.duration} • {new Date(r.recordedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.participants.length} participants</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!showRecording} onOpenChange={() => setShowRecording(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{showRecording?.title}</DialogTitle>
            <DialogDescription>
              Duration: {showRecording?.duration}<br />
              Recorded: {showRecording?.recordedAt ? new Date(showRecording.recordedAt).toLocaleString() : ''}<br />
              Participants: {showRecording?.participants.join(', ')}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
