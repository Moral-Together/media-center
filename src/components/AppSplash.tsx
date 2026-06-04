import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Logo } from './Logo';

type AppSplashProps = {
  visible: boolean;
  onExitComplete?: () => void;
};

export function AppSplash({ visible, onExitComplete }: AppSplashProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="app-splash"
          role="status"
          aria-busy="true"
          aria-label="טוען את האתר"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950"
        >
          <div className="relative mb-6">
            {!reduceMotion && (
              <motion.div
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.85, 1.15, 0.85],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-fuchsia-500/50"
              />
            )}
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={
                reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <Logo
                interactive={false}
                className="relative w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
              />
            </motion.div>
          </div>
          <p className="text-slate-400 text-sm tracking-widest">טוען…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
