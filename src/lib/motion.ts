import type { Variants } from 'motion/react';

export const viewportOnce = { once: true, margin: '-80px' };

export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const containerStagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const cardHover = {
  y: -8,
  scale: 1.02,
  transition: { type: 'spring', stiffness: 220, damping: 20, mass: 0.8 },
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 22, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: 'blur(6px)',
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] },
  },
};

export const pageOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0.18, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

/** Section/header entrance — only on first paint, not after client navigation. */
export function sectionRevealProps(skipRouteEnter: boolean) {
  if (skipRouteEnter) {
    return { initial: false as const };
  }
  return {
    variants: sectionVariants,
    initial: 'hidden' as const,
    animate: 'show' as const,
  };
}

/** Card scroll reveal — disabled on route nav so cards don't "load" twice with the page. */
export function scrollRevealProps(skipRouteEnter: boolean) {
  if (skipRouteEnter) {
    return { initial: false as const };
  }
  return {
    variants: cardVariants,
    initial: 'hidden' as const,
    whileInView: 'show' as const,
    viewport: viewportOnce,
  };
}
