import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const prevPathRef = React.useRef<string | null>(null);
  const hasNavigatedRef = React.useRef(false);

  const pathname = location.pathname;

  if (prevPathRef.current !== null && prevPathRef.current !== pathname) {
    hasNavigatedRef.current = true;
  }

  React.useLayoutEffect(() => {
    if (hasNavigatedRef.current) {
      window.scrollTo(0, 0);
    }
    prevPathRef.current = pathname;
  }, [pathname]);

  const routeFadeIn = hasNavigatedRef.current && !reduceMotion;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const links = [
    { href: '/', label: 'ראשי' },
    { href: '/about', label: 'מי אנחנו' },
    { href: '/services', label: 'שירותים' },
    { href: '/portfolio', label: 'תיק עבודות' },
    { href: '/contact', label: 'צור קשר' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <motion.header
        initial={reduceMotion ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50"
      >
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform origin-left z-50"
          style={{ scaleX }}
        />
        <div className="px-6 lg:px-10">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center gap-3">
              <Logo className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tight uppercase">
                מרכז ה<span className="text-gradient">מדיה</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-10 text-base font-semibold text-slate-600">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 + i * 0.06 }}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'transition-colors hover:text-slate-900 relative pb-1',
                      pathname === link.href
                        ? 'text-slate-900 border-b-2 border-[#00f2fe]'
                        : 'border-b-2 border-transparent',
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="hidden md:block"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            >
              <Link
                to="/contact"
                className="px-5 py-2 inline-block bg-slate-900 text-white rounded-full font-bold transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 group-hover:text-white transition-colors">צור קשר</span>
              </Link>
            </motion.div>

            <button
              className="md:hidden p-2 text-slate-400 hover:text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 md:hidden text-slate-900"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.07, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 pt-24 flex flex-col relative pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-blue-200/10 via-transparent to-purple-200/10" />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={routeFadeIn ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-6 lg:px-10 py-4 bg-slate-100/50 border-t border-slate-200 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-slate-500 relative z-10 w-full mt-auto">
        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} מרכז המדיה של ישראל</span>
        </div>
        <div className="flex gap-4 md:gap-8 hidden md:flex">
          <span>
            סטטוס: <span className="text-emerald-500">פעיל</span>
          </span>
          <span>
            שרת: <span className="text-slate-900">Central-01</span>
          </span>
          <span>
            זמינות: <span className="text-slate-900">99.99%</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span>
            v2.0.4 <span className="hidden sm:inline">- אנטרפרייז</span>
          </span>
          <div className="flex gap-[2px]">
            <div className="w-[3px] h-3 bg-slate-300" />
            <div className="w-[3px] h-3 bg-[#0cf574]" />
            <div className="w-[3px] h-3 bg-[#00f2fe]" />
            <div className="w-[3px] h-3 bg-slate-300" />
          </div>
        </div>
      </footer>
    </div>
  );
}
