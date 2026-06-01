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
