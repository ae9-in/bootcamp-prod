export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'student' | 'mentor' | 'admin';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatarInitials: string;
  imageUrl?: string;
  videoUrl?: string;
}


export interface AttendanceLog {
  userId: string;
  name: string;
  role: string;
  event: 'login' | 'logout';
  timestamp: string;
}

export interface Purchase {
  id: string;
  durationType: 'hours' | 'days' | 'weeks' | 'months';
  durationValue: number;
  totalPrice: number;
  purchasedAt: string;
  userId: string;
  userName: string;
}

export interface Meeting {
  id: string;
  hostId: string;
  hostName: string;
  startTime: string;
  endTime?: string;
  status: 'live' | 'ended';
  participants: { id: string; name: string }[];
}

export interface Recording {
  id: string;
  title: string;
  duration: string;
  participants: string[];
  recordingUrl: string;
  recordedAt: string;
}

export interface ModuleData {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  topics: string[];
}
