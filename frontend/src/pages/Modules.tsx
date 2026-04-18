import BentoGrid from '@/components/BentoGrid';
import { useAuth } from '@/context/AuthContext';
import { modules } from '@/lib/seedData';
import PageTransition from '@/components/PageTransition';

export default function Modules() {
  const { currentUser } = useAuth();

  const getProgress = (moduleId: string) => {
    if (!currentUser) return 0;
    const data = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
    const mod = modules.find(m => m.id === moduleId);
    if (!mod || !data[moduleId]) return 0;
    return Math.round((data[moduleId].length / mod.topics.length) * 100);
  };

  const bentoData = modules.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    label: m.shortCode,
    progress: getProgress(m.id)
  }));

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Learning Modules</h1>
          <p className="mt-4 text-lg text-indigo-200/60 max-w-2xl">
            Dive into our expert-led bootcamps. Explore interactive lessons, track your progress, and master your career.
          </p>
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
