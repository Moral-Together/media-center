export const viewportOnce = { once: true, margin: '-80px' };

export const sectionVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export const containerStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const cardVariants = {
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

export const pageVariants = {
  initial: { opacity: 0, y: 22, filter: 'blur(10px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(8px)',
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
};

export const pageOverlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 0.18, transition: { duration: 0.28 } },
  exit: { opacity: 0, transition: { duration: 0.32 } },
};
