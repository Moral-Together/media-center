import React, { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';
import { ErrorBoundary } from './ErrorBoundary';

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const prevPathRef    = React.useRef<string | null>(null);
  const hasNavigatedRef = React.useRef(false);
  const mobileMenuRef  = React.useRef<HTMLDivElement>(null);

  const pathname = location.pathname;

  if (prevPathRef.current !== null && prevPathRef.current !== pathname) {
    hasNavigatedRef.current = true;
  }

  React.useLayoutEffect(() => {
    if (hasNavigatedRef.current) window.scrollTo(0, 0);
    prevPathRef.current = pathname;
  }, [pathname]);

  React.useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  React.useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      mobileMenuRef.current.querySelector<HTMLElement>('a, button')?.focus();
    }
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMobileMenuOpen(false); return; }
      if (e.key !== 'Tab' || !mobileMenuRef.current) return;
      const focusable = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const routeFadeIn = hasNavigatedRef.current && !reduceMotion;

  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Track whether we're still over the dark hero section
  const [isTop, setIsTop] = React.useState(() =>
    typeof window !== 'undefined' ? window.scrollY < 60 : true
  );
  useMotionValueEvent(scrollY, 'change', (y) => setIsTop(y < 60));

  // Which nav link is currently hovered (for sliding pill)
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null);

  const links = [
    { href: '/',          label: 'ראשי' },
    { href: '/about',     label: 'מי אנחנו' },
    { href: '/services',  label: 'שירותים' },
    { href: '/portfolio', label: 'תיק עבודות' },
    { href: '/contact',   label: 'צור קשר' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[200] focus:px-5 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-full focus:font-bold focus:shadow-lg"
      >
        דלג לתוכן הראשי
      </a>

      {/* ── Header ── */}
      <motion.header
        initial={reduceMotion ? false : { y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 backdrop-blur-md transition-[background-color,border-color] duration-500',
          isTop
            ? 'bg-slate-950/25 border-b border-white/[0.07]'
            : 'bg-white/85 border-b border-slate-200/60',
        )}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 origin-left z-50"
          style={{ scaleX }}
        />

        <div className="px-6 lg:px-10">
          <div className="flex justify-between items-center py-5">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group/logo">
              <Logo className="w-8 h-8" />
              <span className={cn(
                'font-bold text-xl tracking-tight uppercase transition-colors duration-500',
                isTop ? 'text-white' : 'text-slate-900',
              )}>
                מרכז ה<span className="text-gradient">מדיה</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav
              className="hidden md:flex items-center gap-0.5 text-base font-semibold"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {links.map((link, i) => {
                const isActive   = pathname === link.href;
                const showPill   = hoveredNav === link.href || (hoveredNav === null && isActive);
                return (
                  <motion.div
                    key={link.href}
                    className="relative"
                    initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 + i * 0.06 }}
                    onMouseEnter={() => setHoveredNav(link.href)}
                  >
                    <Link
                      to={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative block px-3.5 py-1.5 rounded-full transition-colors duration-200 select-none',
                        isTop
                          ? (isActive || hoveredNav === link.href ? 'text-white' : 'text-white/55')
                          : (isActive || hoveredNav === link.href ? 'text-slate-900' : 'text-slate-500'),
                      )}
                    >
                      {/* Sliding pill background */}
                      {showPill && (
                        <motion.span
                          layoutId="nav-pill"
                          className={cn(
                            'absolute inset-0 rounded-full',
                            isTop
                              ? 'bg-white/12 border border-white/16'
                              : 'bg-slate-100 border border-slate-200/80',
                          )}
                          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        />
                      )}
                      {/* Active glow dot */}
                      {isActive && (
                        <span
                          className={cn(
                            'absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors duration-500',
                            isTop
                              ? 'bg-cyan-400 shadow-[0_0_6px_2px_rgba(0,242,254,0.7)]'
                              : 'bg-violet-500 shadow-[0_0_5px_1px_rgba(139,92,246,0.55)]',
                          )}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA button */}
            <motion.div
              className="hidden md:block"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
            >
              <Link
                to="/contact"
                className={cn(
                  'px-5 py-2 inline-block rounded-full font-bold transition-all duration-300 relative overflow-hidden group',
                  isTop
                    ? 'border border-white/22 text-white/80 hover:text-white hover:border-white/38 hover:bg-white/10'
                    : 'bg-slate-900 text-white',
                )}
              >
                {!isTop && (
                  <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <span className="relative z-10 group-hover:text-white transition-colors">צור קשר</span>
              </Link>
            </motion.div>

            {/* Mobile hamburger */}
            <button
              className={cn(
                'md:hidden p-2 transition-colors duration-300',
                isTop ? 'text-white/60 hover:text-white' : 'text-slate-400 hover:text-slate-900',
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
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

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="תפריט ניווט"
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
                  aria-current={pathname === link.href ? 'page' : undefined}
                  className={cn(
                    'text-2xl font-bold transition-colors',
                    pathname === link.href
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main-content" className="flex-1 pt-24 flex flex-col relative pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-cyan-100/15 via-white to-violet-100/12" />
        <div className="pointer-events-none absolute inset-0 -z-10 section-dot-grid opacity-30" />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={routeFadeIn ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative w-full"
          >
            <ErrorBoundary>
              <Suspense fallback={
                <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              }>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="px-6 lg:px-10 py-4 bg-slate-100/50 border-t border-slate-200 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-slate-500 relative z-10 w-full mt-auto">
        <div className="flex items-center gap-3">
          <span>&copy; {new Date().getFullYear()} מרכז המדיה של ישראל</span>
        </div>
        <div className="hidden md:flex gap-4 md:gap-8">
          <span>סטטוס: <span className="text-emerald-500">פעיל</span></span>
          <span>שרת: <span className="text-slate-900">Central-01</span></span>
          <span>זמינות: <span className="text-slate-900">99.99%</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span>v2.0.4 <span className="hidden sm:inline">- אנטרפרייז</span></span>
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
