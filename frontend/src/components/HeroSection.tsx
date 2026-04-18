import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import SplitText from '@/components/SplitText';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const count = Math.min(120, Math.floor((width * height) / 8000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = '#0a0a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsion = Math.max(0, 200 - dist) / 200;

        if (dist < 200) {
          p.vx -= (dx / dist) * repulsion * 2;
          p.vy -= (dy / dist) * repulsion * 2;
        }

        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x = Math.max(0, Math.min(canvas.width, p.x));
        p.y = Math.max(0, Math.min(canvas.height, p.y));
      });

      particlesRef.current.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 70, 229, ${0.4 + Math.random() * 0.3})`;
        ctx.fill();

        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${0.3 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#0a0a14' }}
    />
  );
}

export function TickerBar() {
  const stats = [
    '500+ Students Enrolled',
    '50+ Expert Mentors',
    '100+ Live Sessions',
    '95% Placement Rate',
    '50+ Courses Available',
    '24/7 Support',
  ];

  return (
    <div className="relative overflow-hidden bg-indigo-950/30 py-2 border-b border-indigo-500/20">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {[...stats, ...stats, ...stats].map((stat, i) => (
          <span key={i} className="text-sm text-indigo-300 font-medium">
            {stat}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  className?: string;
}

function AnimatedCounter({ end, suffix = '', className = '' }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = end / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return <span ref={ref} className={className}>{count}{suffix}</span>;
}

export default function HeroSection() {
  return (
    <div className="relative w-full" style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Keep the animated canvas behind the page content; otherwise it can cover sections on scroll. */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <ParticleCanvas />
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center px-6 h-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl"
          >
            Launch Your Career with{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Expert-Led Bootcamps
            </span>
          </motion.h1>

          <div className="mt-6 max-w-2xl">
            <SplitText
              text="Live sessions, recorded meetings, and structured learning paths"
              className="text-lg text-indigo-200 md:text-xl font-medium leading-relaxed"
              delay={30}
              duration={0.8}
              ease="power3.out"
              threshold={0.1}
              rootMargin="0px"
              textAlign="center"
              tag="p"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 relative overflow-hidden"
                style={{
                  boxShadow: '0 0 30px rgba(79, 70, 229, 0.5)',
                }}
              >
                <Link to="/register">Get Started</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-lg shadow-white/10">
                <Link to="/purchase">Purchase a Bootcamp</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}