import { useState } from 'react';
import BentoGrid from '@/components/BentoGrid';
import { useAuth } from '@/context/AuthContext';
import { modules } from '@/lib/seedData';
import PageTransition from '@/components/PageTransition';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function Modules() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');

  const getProgress = (moduleId: string) => {
    if (!currentUser) return 0;
    const data = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || !data[moduleId]) return 0;
    return Math.round((data[moduleId].length / mod.topics.length) * 100);
  };

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase()) || 
    m.description.toLowerCase().includes(search.toLowerCase()) ||
    m.topics.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const bentoData = filteredModules.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    label: m.shortCode,
    progress: getProgress(m.id)
  }));

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Learning Modules</h1>
            <p className="mt-4 text-lg text-indigo-200/60 max-w-2xl">
              Dive into our expert-led bootcamps. Master your career with structured learning.
            </p>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-400" />
            <Input 
              placeholder="Search bootcamps or topics..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-indigo-950/20 border-indigo-500/20 text-white placeholder:text-indigo-400/50"
            />
          </div>
        </div>
        
        <BentoGrid 
          data={bentoData}
          textAutoHide={true}
          enableStars={true}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={400}
          particleCount={15}
          glowColor="132, 0, 255"
        />
      </div>
    </PageTransition>
  );
}
