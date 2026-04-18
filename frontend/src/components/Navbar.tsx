import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roleBadgeColor: Record<string, string> = {
  student: 'bg-indigo-500 text-white border-indigo-400',
  mentor: 'bg-purple-500 text-white border-purple-400',
  admin: 'bg-amber-500 text-white border-amber-400',
};

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const dashboardPath = currentUser ? `/dashboard/${currentUser.role}` : '/';

  return (
    <nav className="sticky top-0 z-50 border-b border-indigo-500/10 bg-[#0a0a14]/60 backdrop-blur-2xl transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent hover:brightness-125 transition-all">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          BOOTCAMP
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {currentUser ? (
            <>
              <Link to="/" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Home</Link>
              <Link to="/modules" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Modules</Link>
              <Link to="/meeting" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Meeting</Link>
              {currentUser.role === 'student' ? (
                <Link 
                  to={dashboardPath} 
                  className="text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  Profile
                </Link>
              ) : (
                <Link to={dashboardPath} className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Dashboard</Link>
              )}
              <div className="flex items-center gap-2">
                <Badge className={roleBadgeColor[currentUser.role]}>{currentUser.role}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={logout}
                className="border-white/20 text-white hover:bg-white/10 hover:text-white"
              >Logout</Button>
            </>
          ) : (
            <>
              <Link to="/" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Home</Link>
              <Link to="/modules" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Modules</Link>
              <Link to="/meeting" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Meeting</Link>
              <Link to="/login" className="text-sm font-semibold text-slate-200 hover:text-white transition-colors">Login</Link>
              <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white">
                <Link to="/purchase">Purchase Bootcamp</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b md:hidden"
          >
            <div className="flex flex-col gap-3 px-4 py-4">
              {currentUser ? (
                <>
                  <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium">Home</Link>
                  <Link to="/modules" onClick={() => setOpen(false)} className="text-sm font-medium">Modules</Link>
                  <Link to="/meeting" onClick={() => setOpen(false)} className="text-sm font-medium">Meeting</Link>
                  {currentUser.role === 'student' ? (
                    <Link 
                      to={dashboardPath} 
                      onClick={() => setOpen(false)} 
                      className="text-sm font-medium"
                    >
                      Profile
                    </Link>
                  ) : (
                    <Link to={dashboardPath} onClick={() => setOpen(false)} className="text-sm font-medium">Dashboard</Link>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge className={roleBadgeColor[currentUser.role]}>{currentUser.role}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => { logout(); setOpen(false); }}>Logout</Button>
                </>
              ) : (
                <>
                  <Link to="/" onClick={() => setOpen(false)} className="text-sm font-medium">Home</Link>
                  <Link to="/modules" onClick={() => setOpen(false)} className="text-sm font-medium">Modules</Link>
                  <Link to="/meeting" onClick={() => setOpen(false)} className="text-sm font-medium">Meeting</Link>
                  <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium">Login</Link>
                  <Button asChild size="sm"><Link to="/purchase" onClick={() => setOpen(false)}>Purchase Bootcamp</Link></Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
