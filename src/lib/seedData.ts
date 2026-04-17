import { User, Testimonial, ModuleData } from '@/types';

export const defaultUsers: User[] = [
  { id: 'u1', email: 'admin@skillaunch.com', password: 'admin123', role: 'admin', name: 'Admin' },
  { id: 'u2', email: 'mentor@skillaunch.com', password: 'mentor123', role: 'mentor', name: 'Alex Mentor' },
  { id: 'u3', email: 'student1@skillaunch.com', password: 'student123', role: 'student', name: 'Riya Singh' },
  { id: 'u4', email: 'student2@skillaunch.com', password: 'student123', role: 'student', name: 'Karan Joshi' },
  { id: 'u5', email: 'student3@skillaunch.com', password: 'student123', role: 'student', name: 'Meera Das' },
];

export const defaultTestimonials: Testimonial[] = [
  { id: 't1', name: 'Priya Sharma', role: 'Business Analyst', text: 'BOOTCAMP completely transformed my career. The BA module is incredibly detailed and the mentor sessions are absolutely gold.', rating: 5, avatarInitials: 'PS' },
  { id: 't2', name: 'Rahul Verma', role: 'HR Executive', text: 'The HR module gave me practical knowledge I could use from day one. Highly recommend to anyone switching careers.', rating: 5, avatarInitials: 'RV' },
  { id: 't3', name: 'Sneha Patel', role: 'Web Developer', text: 'I went from zero coding knowledge to building full apps in 3 months. The web module is structured perfectly.', rating: 5, avatarInitials: 'SP' },
  { id: 't4', name: 'Arjun Nair', role: 'Student', text: 'The live meetings and recorded sessions made it easy to learn at my own pace without ever missing anything important.', rating: 4, avatarInitials: 'AN' },
  { id: 't5', name: 'Divya Krishnan', role: 'Career Changer', text: 'Switching from finance to HR felt impossible until BOOTCAMP. The structured modules and mentors made it real.', rating: 5, avatarInitials: 'DK' },
  { id: 't6', name: 'Mohammed Farhan', role: 'Business Analyst', text: 'The progress tracking kept me accountable and the bootcamp purchase options are very flexible and affordable.', rating: 4, avatarInitials: 'MF' },
];

export const modules: ModuleData[] = [
  {
    id: 'ba',
    title: 'Business Analysis',
    shortCode: 'BA',
    description: 'Master the fundamentals of business analysis with hands-on projects and real-world case studies.',
    topics: ['Requirements Gathering', 'Stakeholder Management', 'Process Mapping', 'Use Case Writing', 'Agile BA'],
  },
  {
    id: 'hr',
    title: 'Human Resources',
    shortCode: 'HR',
    description: 'Learn modern HR practices from recruitment to analytics with industry expert mentors.',
    topics: ['Recruitment Process', 'Onboarding', 'Performance Management', 'Labour Law Basics', 'HR Analytics'],
  },
  {
    id: 'web',
    title: 'Web Development',
    shortCode: 'WEB',
    description: 'Build full-stack web applications from scratch using modern tools and frameworks.',
    topics: ['HTML & CSS', 'JavaScript Fundamentals', 'React Basics', 'API Integration', 'Deployment'],
  },
];

export const defaultAttendanceLogs: any[] = [
  { userId: 'u2', name: 'Alex Mentor', role: 'mentor', event: 'login', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { userId: 'u3', name: 'Riya Singh', role: 'student', event: 'login', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { userId: 'u4', name: 'Karan Joshi', role: 'student', event: 'login', timestamp: new Date(Date.now() - 10800000).toISOString() },
  { userId: 'u5', name: 'Meera Das', role: 'student', event: 'login', timestamp: new Date(Date.now() - 14400000).toISOString() },
];

export function seedLocalStorage() {
  const users = localStorage.getItem('users');
  if (!users || JSON.parse(users).length === 0) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }
  
  const testimonials = localStorage.getItem('testimonials');
  if (!testimonials || JSON.parse(testimonials).length === 0) {
    localStorage.setItem('testimonials', JSON.stringify(defaultTestimonials));
  }
  
  const attendanceLogs = localStorage.getItem('attendanceLogs');
  if (!attendanceLogs || JSON.parse(attendanceLogs).length === 0) {
    localStorage.setItem('attendanceLogs', JSON.stringify(defaultAttendanceLogs));
  }
  if (!localStorage.getItem('purchases')) {
    localStorage.setItem('purchases', JSON.stringify([]));
  }
  if (!localStorage.getItem('meetings')) {
    localStorage.setItem('meetings', JSON.stringify([]));
  }
  if (!localStorage.getItem('recordings')) {
    localStorage.setItem('recordings', JSON.stringify([]));
  }
}
