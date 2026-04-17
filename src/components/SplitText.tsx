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

    const el = containerRef.current;
    const gsap = (window as any).gsap;
    if (!gsap) return; // Fallback: just show the text if GSAP isn't ready

    // Split text into individual character spans
    const chars = text.split('').map((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // non-breaking space
      span.style.cssText = `
        display: inline-block;
        opacity: ${from.opacity !== undefined ? String(from.opacity) : '0'};
        transform: translateY(${from.y !== undefined ? `${from.y}px` : '40px'});
        will-change: transform, opacity;
      `;
      span.setAttribute('aria-hidden', 'true');
      return span;
    });

    // Clear content and insert spans
    el.textContent = '';
    // Add accessible hidden text for screen readers
    const ariaSpan = document.createElement('span');
    ariaSpan.className = 'sr-only';
    ariaSpan.textContent = text;
    el.appendChild(ariaSpan);
    chars.forEach(span => el.appendChild(span));

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

    // Use IntersectionObserver to trigger on scroll (replaces ScrollTrigger)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      // Restore plain text on unmount
      el.textContent = text;
    };
  }, [fontsReady, text, delay, duration, ease, threshold, rootMargin]);

  return (
    // @ts-ignore — dynamic tag
    <Tag
      ref={containerRef}
      className={className}
      style={{ textAlign, display: 'block', wordBreak: 'keep-all' }}
      aria-label={text}
    />
  );
};

export default SplitText;
