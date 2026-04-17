import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const location = useLocation();
  const isAdminPath = location.pathname === '/admin';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'student' | 'mentor' | 'admin'>(isAdminPath ? 'admin' : 'student');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = await login(email, password, role);
    if (err) {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      navigate(`/dashboard/${user.role}`);
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <motion.div animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
          <Card className="w-full max-w-md bg-background/50 backdrop-blur-sm border-primary/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                {isAdminPath ? 'Administrator Portal' : 'Welcome Back'}
              </CardTitle>
              <CardDescription>
                {isAdminPath ? 'Access the system management dashboard' : 'Sign in to your BOOTCAMP account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isAdminPath && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Login as</Label>
                    <div className="flex gap-4 p-1 bg-muted rounded-lg">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${role === 'student' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('mentor')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${role === 'mentor' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        Mentor
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="name@example.com"
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      required 
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative group">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••"
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        required 
                        className="bg-background/50 pr-10 border-primary/20 focus:border-primary transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-destructive bg-destructive/10 p-2 rounded text-center"
                  >
                    {error}
                  </motion.p>
                )}
                
                <Button type="submit" className="w-full py-6 text-lg font-semibold shadow-lg shadow-primary/20">
                  {isAdminPath ? 'Authorized Login' : 'Sign In'}
                </Button>
              </form>
              {!isAdminPath && (
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register now</Link>
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
