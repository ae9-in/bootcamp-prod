import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Check } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { Purchase as PurchaseType } from '@/types';

const included = ['Live sessions', 'Recorded meetings', 'Module access', 'Progress tracking', 'Mentor support'];

export default function Purchase() {
  const [tab, setTab] = useState('hours');
  const [value, setValue] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const price = value * 500;

  const handleEnroll = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const purchase: PurchaseType = {
      id: Date.now().toString(),
      durationType: tab as PurchaseType['durationType'],
      durationValue: value,
      totalPrice: price,
      purchasedAt: new Date().toISOString(),
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Guest',
    };
    const purchases: PurchaseType[] = JSON.parse(localStorage.getItem('purchases') || '[]');
    purchases.push(purchase);
    localStorage.setItem('purchases', JSON.stringify(purchases));
    setShowModal(true);
  };

  const maxMap: Record<string, number> = { hours: 12, days: 30, weeks: 12, months: 12 };

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-center text-4xl font-bold text-foreground">Purchase & Organise Your Bootcamp</h1>
        <p className="mt-3 text-center text-muted-foreground">Flexible pricing starting at just ₹500</p>

        <Card className="mt-10">
          <CardContent className="pt-6">
            <Tabs value={tab} onValueChange={(v) => { setTab(v); setValue(1); }}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="hours">Hours</TabsTrigger>
                <TabsTrigger value="days">Days</TabsTrigger>
                <TabsTrigger value="weeks">Weeks</TabsTrigger>
                <TabsTrigger value="months">Months</TabsTrigger>
              </TabsList>
              {['hours', 'days', 'weeks', 'months'].map(t => (
                <TabsContent key={t} value={t} className="mt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration: {value} {t}</span>
                      <span className="text-muted-foreground">Max: {maxMap[t]}</span>
                    </div>
                    <Slider
                      min={1}
                      max={maxMap[t]}
                      step={1}
                      value={[value]}
                      onValueChange={([v]) => setValue(v)}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <motion.p
                key={price}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-bold text-primary"
              >
                ₹{price.toLocaleString('en-IN')}
              </motion.p>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-sm font-medium">What's included:</p>
              <ul className="space-y-2">
                {included.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary" /> {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button className="mt-8 w-full" size="lg" onClick={handleEnroll}>Enroll Now</Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Bootcamp Booked!</DialogTitle>
            <DialogDescription>Your bootcamp has been booked! Check your dashboard after login.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
