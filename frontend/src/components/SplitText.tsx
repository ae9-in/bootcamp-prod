import { useRef, useEffect, useState } from 'react';

// Uses global GSAP from CDN (same strategy as BentoGrid)
// No premium plugins required — uses IntersectionObserver for scroll trigger

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;        // ms stagger between each character
  duration?: number;     // seconds per character animation
  ease?: string;         // GSAP ease string
  from?: Record<string, number | string>;
  to?: Record<string, number | string>;
  threshold?: number;    // IntersectionObserver threshold
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  tag?: keyof JSX.IntrinsicElements;
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'center',
  tag: Tag = 'p',
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animatedRef = useRef(false);
  const [fontsReady, setFontsReady] = useState(false);

  // Wait for fonts to load for accurate char rendering
  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsReady(true);
    } else {
      document.fonts.ready.then(() => setFontsReady(true));
    }
  }, []);

  useEffect(() => {
    if (!fontsReady || !containerRef.current || animatedRef.current) return;

    const gsap = (window as any).gsap;
    if (!gsap) return;

    const chars = letterRefs.current.filter(Boolean);

    const runAnimation = () => {
      if (animatedRef.current) return;
      animatedRef.current = true;

      gsap.to(chars, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        onComplete: () => {
          onLetterAnimationComplete?.();
        },
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fontsReady, text, delay, duration, ease, threshold, rootMargin, to]);

  const characters = text.split('');

  return (
    // @ts-ignore
    <Tag
      ref={containerRef}
      className={className}
      style={{ textAlign, display: 'block', wordBreak: 'keep-all' }}
      aria-label={text}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {characters.map((char, i) => (
          <span
            key={i}
            ref={(el) => (letterRefs.current[i] = el)}
            style={{
              display: 'inline-block',
              opacity: from.opacity !== undefined ? String(from.opacity) : '0',
              transform: `translateY(${from.y !== undefined ? `${from.y}px` : '40px'})`,
              willChange: 'transform, opacity',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </Tag>
  );
};

export default SplitText;
