import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/StarRating';
import AvatarCircle from '@/components/AvatarCircle';
import PageTransition from '@/components/PageTransition';
import { ArrowLeft, Play, ExternalLink, Video } from 'lucide-react';
import api from '@/lib/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        setTestimonials(res.data);
      } catch (error) {
        console.error('Failed to fetch testimonials');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mt-8 text-center">
          <h1 className="text-4xl font-bold text-foreground">Student Testimonials</h1>
          <p className="mt-3 text-muted-foreground">Real stories from our bootcamp community</p>
        </div>

        {isLoading ? (
          <div className="mt-12 text-center text-muted-foreground">Syncing with database...</div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id || (t as any)._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full overflow-hidden flex flex-col group">
                  {t.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img 
                        src={t.imageUrl} 
                        alt={`${t.name}'s testimonial`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    </div>
                  )}
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3">
                      <AvatarCircle initials={t.avatarInitials} name={t.name} />
                      <div>
                        <p className="font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3"><StarRating rating={t.rating} /></div>
                    
                    <p className="mt-4 text-sm text-muted-foreground italic leading-relaxed flex-1">
                      "{t.text}"
                    </p>

                    {t.videoUrl && (
                      <div className="mt-6">
                        <a 
                          href={t.videoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-3 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                        >
                          <Video className="h-4 w-4" />
                          Watch Success Story
                          <ExternalLink className="h-3 w-3 opacity-50" />
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        {testimonials.length === 0 && !isLoading && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground italic">No testimonials found in the database yet.</p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

