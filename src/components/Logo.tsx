import React from 'react';
import { motion, useMotionValue, useReducedMotion } from 'motion/react';
import { logoPlayUrl } from '../lib/assets';

const SLOW   = 360 / 15_000; // deg/ms — 15 s/rotation
const FAST   = 360 /  4_000; // deg/ms —  4 s/rotation on hover
const SMOOTH = 0.009;         // speed interpolation factor per ms

export function Logo({
  className = 'w-12 h-12',
  interactive = true,
}: {
  className?: string;
  interactive?: boolean;
}) {
  const rotate       = useMotionValue(0);
  const reduceMotion = useReducedMotion();
  const targetSpeed  = React.useRef(SLOW);
  const currentSpeed = React.useRef(SLOW);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) return;
    let prev: number | null = null;
    let raf: number;

    const tick = (ts: number) => {
      if (prev !== null) {
        const dt = ts - prev;
        // smoothly interpolate toward target speed — eliminates rhythm break
        currentSpeed.current +=
          (targetSpeed.current - currentSpeed.current) *
          Math.min(1, dt * SMOOTH);
        const next = rotate.get() + dt * currentSpeed.current;
        // keep value in [0, 360) — visually identical, no snap
        rotate.set(next >= 360 ? next - 360 : next);
      }
      prev = ts;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rotate, reduceMotion]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={
        interactive
          ? () => { setHovered(true);  targetSpeed.current = FAST; }
          : undefined
      }
      onMouseLeave={
        interactive
          ? () => { setHovered(false); targetSpeed.current = SLOW; }
          : undefined
      }
    >
      {/* Base glow — expands and brightens on hover */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-[opacity,transform] duration-500"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)',
          opacity:   interactive && hovered ? 0.65 : 0.2,
          transform: interactive && hovered ? 'scale(1.4)' : 'scale(1)',
        }}
      />
      {/* Pulsing corona ring — appears only on hover (interactive mode) */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={
          interactive && hovered
            ? { scale: [1.35, 1.65, 1.35], opacity: [0.3, 0.55, 0.3] }
            : { scale: 1, opacity: 0 }
        }
        transition={
          interactive && hovered
            ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.35, ease: 'easeOut' }
        }
        style={{
          background:
            'radial-gradient(circle, rgba(0,242,254,0.28) 0%, rgba(177,0,255,0.18) 55%, transparent 80%)',
        }}
      />
      <motion.img
        src={logoPlayUrl()}
        alt=""
        draggable={false}
        fetchPriority="high"
        decoding="async"
        style={{ rotate }}
        className="relative z-10 w-full h-full object-contain mix-blend-screen select-none"
      />
    </div>
  );
}
