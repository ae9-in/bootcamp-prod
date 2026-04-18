import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { modules } from '@/lib/seedData';
import PageTransition from '@/components/PageTransition';
import HeroSection from '@/components/HeroSection';
import { TickerBar } from '@/components/HeroSection';
import { ArrowRight, Code, Users, Briefcase, Video, Shield, BookOpen } from 'lucide-react';

const moduleIcons: Record<string, React.ElementType> = {
  ba: Briefcase,
  hr: Users,
  web: Code,
};



const benefits = [
  { icon: Video, title: 'Live Meetings', desc: 'Real-time sessions with mentors' },
  { icon: Shield, title: 'Progress Tracking', desc: 'Monitor your learning journey' },
  { icon: ArrowRight, title: 'Flexible Plans', desc: 'Pay by hour, day, week or month' },
];

export default function Index() {
  return (
    <PageTransition>
      <HeroSection />
      <TickerBar />



      {/* Modules */}
      <section className="bg-[#0a0a14] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-white">Learning Modules</h2>
          <p className="mt-2 text-center text-indigo-300">Master in-demand skills with expert-led content</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {modules.map((m, i) => {
              const Icon = moduleIcons[m.id] || BookOpen;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="h-full"
                >
                  <Link to="/modules" className="block h-full">
                    <Card className="h-full cursor-pointer transition-all hover:shadow-lg hover:shadow-indigo-500/20 bg-indigo-950/20 border-indigo-500/20">
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/20">
                          <Icon className="h-7 w-7 text-indigo-400" />
                        </div>
                        <div className="inline-block w-fit rounded-md bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{m.shortCode}</div>
                        <h3 className="mt-3 text-xl font-semibold text-white">{m.title}</h3>
                        <p className="mt-2 text-sm text-indigo-300">{m.description}</p>
                        <div className="mt-auto pt-4 flex flex-wrap gap-2">
                          {m.topics.slice(0, 3).map(t => (
                            <span key={t} className="rounded-full bg-indigo-900/50 px-2.5 py-0.5 text-xs text-indigo-300">{t}</span>
                          ))}
                          {m.topics.length > 3 && (
                            <span className="rounded-full bg-indigo-900/50 px-2.5 py-0.5 text-xs text-indigo-300">+{m.topics.length - 3} more</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="inline-block">
              <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-lg shadow-white/10 px-8">
                <Link to="/modules">View All Modules <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#0d0d1a] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold text-white">Why BOOTCAMP?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <Card className="h-full text-center bg-indigo-950/20 border-indigo-500/20">
                  <CardContent className="pt-8 pb-8">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600/20">
                      <b.icon className="h-7 w-7 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{b.title}</h3>
                    <p className="mt-2 text-sm text-indigo-300">{b.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Banner */}
      <section className="bg-indigo-900 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to start your journey?</h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-200">
            Purchase a bootcamp by hours, days, weeks, or months starting at just ₹500
          </p>
          <Button asChild size="lg" className="mt-8 bg-indigo-600 hover:bg-indigo-700">
            <Link to="/purchase">Purchase a Bootcamp <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a14] border-t border-indigo-500/20 py-10">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-indigo-300">
          <p className="font-semibold text-white">BOOTCAMP</p>
          <div className="mt-3 flex justify-center gap-6">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/modules" className="hover:text-white">Modules</Link>
            <Link to="/meeting" className="hover:text-white">Meeting</Link>
            <Link to="/purchase" className="hover:text-white">Purchase</Link>
            <Link to="/login" className="hover:text-white">Login</Link>
          </div>
          <p className="mt-4">© 2025 BOOTCAMP. All rights reserved.</p>
        </div>
      </footer>
    </PageTransition>
  );
}
