import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';
import { PageMotionContext } from '../context/PageMotionContext';
import { pageOverlayVariants, pageVariants } from '../lib/motion';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const prevPathRef = React.useRef<string | null>(null);
  const [hasNavigated, setHasNavigated] = React.useState(false);

  React.useEffect(() => {
    if (prevPathRef.current !== null && prevPathRef.current !== location.pathname) {
      setHasNavigated(true);
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    prevPathRef.current = location.pathname;
  }, [location.pathname, reduceMotion]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const skipChildMotion = hasNavigated && !reduceMotion;

  const links = [
    { href: '/', label: 'ראשי' },
    { href: '/about', label: 'מי אנחנו' },
    { href: '/services', label: 'שירותים' },
    { href: '/portfolio', label: 'תיק עבודות' },
    { href: '/contact', label: 'צור קשר' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
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
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'transition-all hover:text-slate-900 relative pb-1 hover:drop-shadow-sm',
                    location.pathname === link.href
                      ? 'text-slate-900 border-b-2 border-[#00f2fe]'
                      : 'border-b-2 border-transparent',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:block">
              <Link
                to="/contact"
                className="px-5 py-2 inline-block bg-slate-900 text-white rounded-full font-bold transition-all relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 group-hover:text-white transition-colors">צור קשר</span>
              </Link>
            </div>

            <button
              className="md:hidden p-2 text-slate-400 hover:text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 md:hidden text-slate-900"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}

      <main className="flex-1 pt-24 flex flex-col relative pb-10 overflow-hidden">
        {/* sync = crossfade (no blank gap between exit + enter like mode="wait") */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit={reduceMotion ? undefined : 'exit'}
            className="flex-1 relative w-full"
          >
            {!reduceMotion && (
              <motion.div
                variants={pageOverlayVariants}
                className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-blue-200/10 via-transparent to-purple-200/10"
              />
            )}
            <PageMotionContext.Provider value={skipChildMotion}>
              <Outlet />
            </PageMotionContext.Provider>
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
