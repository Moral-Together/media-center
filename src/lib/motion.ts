import { useEffect, useState } from 'react';
import { useMotionValue, useMotionValueEvent, animate } from 'motion/react';
import type { Variants } from 'motion/react';

export const viewportOnce = { once: true, margin: '-80px' };

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const containerStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06,
    },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.72 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 20 },
  },
};

export const cardHover = {
  y: -6,
  scale: 1.02,
  transition: { type: 'spring', stiffness: 260, damping: 22 },
};

/** Scroll-triggered reveal only (safe with route changes). */
export const scrollRevealMotion = {
  variants: cardVariants,
  initial: false as const,
  whileInView: 'show' as const,
  viewport: viewportOnce,
};

/**
 * Animates a number from 0 to `target` when `inView` becomes true.
 * Returns the rounded display value as a plain number.
 */
export function useAnimatedCounter(target: number, inView: boolean): number {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(count, 'change', (v) => {
    setDisplay(Math.round(v));
  });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, target, count]);

  return display;
}
