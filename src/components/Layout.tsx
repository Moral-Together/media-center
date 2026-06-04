import React, { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
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
  const location  = useLocation();
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
    if (isMobileMenuOpen && mobileMenuRef.current)
      mobileMenuRef.current.querySelector<HTMLElement>('a, button')?.focus();
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  React.useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsMobileMenuOpen(false); return; }
      if (e.key !== 'Tab' || !mobileMenuRef.current) return;
      const els = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      );
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first)      { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isMobileMenuOpen]);

  const routeFadeIn = hasNavigatedRef.current && !reduceMotion;

  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Dark transparent mode — ONLY on home page before scroll
  const [isTop, setIsTop] = React.useState(() =>
    pathname === '/' && (typeof window !== 'undefined' ? window.scrollY < 60 : true)
  );
  React.useEffect(() => {
    setIsTop(pathname === '/' && window.scrollY < 60);
  }, [pathname]);
  useMotionValueEvent(scrollY, 'change', (y) => setIsTop(pathname === '/' && y < 60));

  // Sliding underline tracker
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null);

  // Cursor spotlight drifting inside the header — premium micro-interaction
  const glowX = useMotionValue(-600);
  const glowY = useMotionValue(-600);
  const sgX   = useSpring(glowX, { stiffness: 140, damping: 20 });
  const sgY   = useSpring(glowY, { stiffness: 140, damping: 20 });
  const glowBg = useMotionTemplate`radial-gradient(280px circle at ${sgX}px ${sgY}px, rgba(0,242,254,0.05), transparent 80%)`;

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

      {/* ═══════════════ HEADER ═══════════════ */}
      <motion.header
        initial={reduceMotion ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500',
          isTop
            ? 'bg-slate-950/15 border-b border-white/[0.06]'
            : 'bg-white/90 border-b border-slate-200/60 shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_4px_24px_rgba(0,0,0,0.05)]',
        )}
        onMouseMove={!reduceMotion ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          glowX.set(e.clientX - r.left);
          glowY.set(e.clientY - r.top);
        } : undefined}
        onMouseLeave={!reduceMotion ? () => { glowX.set(-600); glowY.set(-600); } : undefined}
      >
        {/* Cursor glow — barely visible, creates a sense of life */}
        {!reduceMotion && (
          <motion.div className="absolute inset-0 pointer-events-none z-0" style={{ background: glowBg }} />
        )}

        {/* Scroll progress line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left"
          style={{
            scaleX,
            background: 'linear-gradient(to right, #00f2fe, #818cf8, #e879f9)',
          }}
        />

        <div className="relative z-10 px-6 lg:px-10">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <Logo className="w-[30px] h-[30px]" />
              <span className={cn(
                'font-bold text-[17px] tracking-tight uppercase transition-colors duration-500',
                isTop ? 'text-white' : 'text-slate-900',
              )}>
                מרכז ה<span className="text-gradient">מדיה</span>
              </span>
            </Link>

            {/* ── Desktop nav ── */}
            <nav
              className="hidden md:flex items-center"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                const isHov    = hoveredNav === link.href;
                const showLine = isHov || (!hoveredNav && isActive);

                return (
                  <motion.div
                    key={link.href}
                    className="relative"
                    initial={reduceMotion ? false : { opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1], delay: 0.06 + i * 0.05 }}
                    onMouseEnter={() => setHoveredNav(link.href)}
                  >
                    <Link
                      to={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center px-4 py-2 text-[13px] font-semibold tracking-wide rounded-md select-none transition-colors duration-150',
                        isTop
                          ? isActive ? 'text-white' : isHov ? 'text-white/88' : 'text-white/42'
                          : isActive ? 'text-slate-900' : isHov ? 'text-slate-700' : 'text-slate-400',
                      )}
                    >
                      {/* Text micro-lift on hover */}
                      <motion.span
                        className="block"
                        animate={isHov && !reduceMotion ? { y: -1.5 } : { y: 0 }}
                        transition={{ type: 'spring', stiffness: 600, damping: 32 }}
                      >
                        {link.label}
                      </motion.span>

                      {/* Shared sliding underline — spring-animated between links */}
                      {showLine && (
                        <motion.span
                          layoutId="nav-line"
                          className={cn(
                            'absolute bottom-[3px] inset-x-3.5 h-[1.5px] rounded-full',
                            isTop
                              ? 'bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400'
                              : 'bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500',
                          )}
                          style={isTop && !reduceMotion
                            ? { boxShadow: '0 0 7px 1.5px rgba(0,242,254,0.65)' }
                            : undefined
                          }
                          transition={{ type: 'spring', stiffness: 520, damping: 42 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* ── CTA button ── */}
            <motion.div
              className="hidden md:flex shrink-0"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.38 }}
            >
              <Link
                to="/contact"
                className={cn(
                  'relative px-5 py-[7px] rounded-full text-[13px] font-semibold overflow-hidden group transition-all duration-300',
                  isTop
                    ? 'text-white/80 hover:text-white'
                    : 'bg-slate-900 text-white hover:scale-[1.03]',
                )}
              >
                {/* Dark header: outline with inner glow on hover */}
                {isTop && (
                  <>
                    <span className="absolute inset-0 rounded-full border border-white/22 group-hover:border-white/40 transition-[border-color] duration-300" />
                    <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/[0.08] transition-colors duration-300" />
                  </>
                )}
                {/* Light header: dark pill + neon gradient on hover */}
                {!isTop && (
                  <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                <span className="relative z-10 group-hover:text-white transition-colors duration-200">
                  צור קשר
                </span>
              </Link>
            </motion.div>

            {/* ── Mobile hamburger ── */}
            <button
              className={cn(
                'md:hidden p-2 rounded-lg transition-colors duration-300',
                isTop ? 'text-white/55 hover:text-white' : 'text-slate-400 hover:text-slate-900',
              )}
              onClick={() => setIsMobileMenuOpen(v => !v)}
              aria-label={isMobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen
                  ? <motion.span key="x"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }}
                    ><X size={20} /></motion.span>
                  : <motion.span key="m"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.16 }}
                    ><Menu size={20} /></motion.span>
                }
              </AnimatePresence>
            </button>

          </div>
        </div>
      </motion.header>

      {/* ═══════════════ MOBILE MENU ═══════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu" ref={mobileMenuRef}
            role="dialog" aria-modal="true" aria-label="תפריט ניווט"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed inset-0 z-40 bg-white/96 backdrop-blur-2xl flex flex-col pt-[88px] pb-10 px-5 md:hidden"
          >
            {/* Subtle top gradient line */}
            <div className="absolute top-[68px] inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <nav className="flex flex-col gap-1 mt-2">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 + i * 0.055, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'flex items-center justify-between px-4 py-3.5 rounded-2xl text-[19px] font-bold transition-colors',
                        isActive
                          ? 'text-slate-900 bg-slate-50 border border-slate-100'
                          : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50',
                      )}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] shadow-[0_0_6px_2px_rgba(0,242,254,0.5)]" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA in mobile menu */}
            <motion.div
              className="mt-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.3 }}
            >
              <Link
                to="/contact"
                className="block w-full text-center px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-base relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">צור קשר</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ MAIN ═══════════════ */}
      <main id="main-content" className="flex-1 pt-[68px] flex flex-col relative pb-10">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-cyan-100/15 via-white to-violet-100/12" />
        <div className="pointer-events-none absolute inset-0 -z-10 section-dot-grid opacity-30" />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={routeFadeIn ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
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

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="px-6 lg:px-10 py-4 bg-slate-100/50 border-t border-slate-200 flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-slate-500 relative z-10 w-full mt-auto">
        <span>&copy; {new Date().getFullYear()} מרכז המדיה של ישראל</span>
        <div className="hidden md:flex gap-6">
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
