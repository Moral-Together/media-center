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
import { Menu, X, Instagram, Facebook, Linkedin, Mail, Phone, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { Logo } from './Logo';
import { ErrorBoundary } from './ErrorBoundary';
import { useLanguageSync } from '../i18n/useLanguageSync';
import { LANGUAGES, type LangCode } from '../i18n/index';

function LanguageSwitcher({ layoutSuffix = 'desktop', variant = 'light' }: { layoutSuffix?: string; variant?: 'light' | 'dark' }) {
  const { i18n } = useTranslation();
  const current = (Object.keys(LANGUAGES).includes(i18n.language)
    ? i18n.language
    : 'he') as LangCode;

  const displayOrder: LangCode[] = ['he', 'en', 'el'];

  const isDark = variant === 'dark';

  return (
    <div className={cn(
      'flex items-center gap-0.5 rounded-full p-0.5 backdrop-blur-sm',
      isDark
        ? 'bg-white/[0.06] border border-white/[0.10]'
        : 'bg-slate-100/80 border border-slate-200/60',
    )}>
      {displayOrder.map((code) => {
        const info = LANGUAGES[code];
        const isActive = current === code;
        return (
          <button
            key={code}
            onClick={() => i18n.changeLanguage(code)}
            aria-label={`Switch to ${info.label}`}
            aria-pressed={isActive}
            className={cn(
              'relative flex items-center gap-1 px-2.5 py-[5px] rounded-full text-[11px] font-bold transition-colors duration-150 select-none',
              isDark
                ? isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                : isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`lang-pill-${layoutSuffix}`}
                className={isDark
                  ? 'absolute inset-0 rounded-full bg-white/[0.15]'
                  : 'absolute inset-0 rounded-full bg-white shadow-sm'
                }
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span className="relative z-10">{info.flag}</span>
            <span className="relative z-10">{code.toUpperCase()}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Layout() {
  useLanguageSync(); // syncs document.dir + document.lang on every language change

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location     = useLocation();
  const { t, i18n } = useTranslation();
  const lang = (Object.keys(LANGUAGES).includes(i18n.language) ? i18n.language : 'he') as LangCode;
  const contentDir = lang === 'he' ? 'rtl' : 'ltr';
  const reduceMotion = useReducedMotion();
  const prevPathRef     = React.useRef<string | null>(null);
  const hasNavigatedRef = React.useRef(false);
  const mobileMenuRef   = React.useRef<HTMLDivElement>(null);
  const pathname = location.pathname;

  if (prevPathRef.current !== null && prevPathRef.current !== pathname)
    hasNavigatedRef.current = true;

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hovered nav item for sliding underline
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null);

  // Subtle cursor glow inside the header
  const glowX  = useMotionValue(-600);
  const glowY  = useMotionValue(-600);
  const sgX    = useSpring(glowX, { stiffness: 140, damping: 20 });
  const sgY    = useSpring(glowY, { stiffness: 140, damping: 20 });
  const glowBg = useMotionTemplate`radial-gradient(320px circle at ${sgX}px ${sgY}px, rgba(99,102,241,0.07), transparent 75%)`;

  const links = [
    { href: '/',          label: t('nav.home') },
    { href: '/about',     label: t('nav.about') },
    { href: '/services',  label: t('nav.services') },
    { href: '/portfolio', label: t('nav.portfolio') },
    { href: '/contact',   label: t('nav.contact') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[200] focus:px-5 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-full focus:font-bold focus:shadow-lg"
      >
        {t('a11y.skip_to_content')}
      </a>

      {/* ════════════════════ HEADER ════════════════════ */}
      <motion.header
        initial={reduceMotion ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_1px_0_rgba(0,0,0,0.04),0_2px_16px_rgba(0,0,0,0.06)]"
        onMouseMove={!reduceMotion ? (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          glowX.set(e.clientX - r.left);
          glowY.set(e.clientY - r.top);
        } : undefined}
        onMouseLeave={!reduceMotion ? () => { glowX.set(-600); glowY.set(-600); } : undefined}
      >
        {/* Cursor glow — barely perceptible, makes the header feel alive */}
        {!reduceMotion && (
          <motion.div className="absolute inset-0 pointer-events-none" style={{ background: glowBg }} />
        )}

        {/* Scroll-progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
          style={{
            scaleX,
            background: 'linear-gradient(to right, #00f2fe, #818cf8, #e879f9)',
          }}
        />

        <div className="relative z-10 px-6 lg:px-10">
          <div className="flex items-center justify-between h-[72px] flex-row">

            {/* ── Logo ── */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/" className="flex items-center gap-3">
                <Logo className="w-9 h-9" />
                <span className="font-bold text-xl tracking-tight uppercase text-slate-900">
                  מרכז ה<span className="text-gradient">מדיה</span>
                </span>
              </Link>
            </motion.div>

            {/* ── Desktop nav ── */}
            <nav
              className="hidden md:flex items-center gap-1 flex-row"
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
                    initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 + i * 0.06 }}
                    onMouseEnter={() => setHoveredNav(link.href)}
                  >
                    <Link
                      to={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'relative flex items-center px-4 py-2 text-base font-semibold rounded-lg select-none transition-colors duration-150',
                        isActive || isHov ? 'text-slate-900' : 'text-slate-500',
                      )}
                    >
                      {/* Hover background pill */}
                      {isHov && !isActive && (
                        <motion.span
                          layoutId="nav-bg"
                          className="absolute inset-0 rounded-lg bg-slate-100/80 border border-slate-200/60"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}

                      {/* Text — micro-lift on hover */}
                      <motion.span
                        className="relative z-10 block"
                        animate={isHov && !reduceMotion ? { y: -1 } : { y: 0 }}
                        transition={{ type: 'spring', stiffness: 600, damping: 35 }}
                      >
                        {link.label}
                      </motion.span>

                      {/* Sliding gradient underline for active + hovered */}
                      {showLine && (
                        <motion.span
                          layoutId="nav-line"
                          className="absolute bottom-[1px] inset-x-3 h-[2px] rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500"
                          style={!reduceMotion ? {
                            boxShadow: '0 0 8px 1px rgba(139,92,246,0.5)',
                          } : undefined}
                          transition={{ type: 'spring', stiffness: 500, damping: 42 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* ── Language switcher + CTA (grouped left side) ── */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher layoutSuffix="desktop" />
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.42 }}
              >
                <Link
                  to="/contact"
                  className="relative px-6 py-2 rounded-full font-bold text-base overflow-hidden group"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                  <span className="absolute inset-[1.5px] rounded-full bg-white group-hover:bg-transparent transition-colors duration-300" />
                  <span className="relative z-10 font-bold text-base bg-gradient-to-r from-cyan-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
                    {t('cta.contact')}
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* ── Mobile hamburger ── */}
            <button
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(v => !v)}
              aria-label={isMobileMenuOpen ? t('a11y.close_menu') : t('a11y.open_menu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen
                  ? <motion.span key="x"
                      initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}    transition={{ duration: 0.18 }}
                    ><X size={22} /></motion.span>
                  : <motion.span key="m"
                      initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}   transition={{ duration: 0.18 }}
                    ><Menu size={22} /></motion.span>
                }
              </AnimatePresence>
            </button>

          </div>
        </div>
      </motion.header>

      {/* ════════════════════ MOBILE MENU ════════════════════ */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu" ref={mobileMenuRef}
            role="dialog" aria-modal="true" aria-label={t('a11y.nav_menu')}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            dir={contentDir}
            className="fixed inset-0 z-40 bg-white/96 backdrop-blur-2xl flex flex-col pt-[80px] pb-10 px-5 md:hidden"
          >
            <div className="absolute top-[72px] inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            <nav className="flex flex-col gap-1 mt-4">
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
                        'flex items-center justify-between px-4 py-3.5 rounded-2xl text-xl font-bold transition-colors',
                        isActive
                          ? 'text-slate-900 bg-slate-50 border border-slate-100'
                          : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50/80',
                      )}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_8px_2px_rgba(0,242,254,0.55)]" />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            <motion.div
              className="mt-auto flex flex-col gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.28 }}
            >
              {/* Language switcher — mobile */}
              <div className="flex justify-center">
                <LanguageSwitcher layoutSuffix="mobile" />
              </div>

              <Link
                to="/contact"
                className="block w-full text-center px-6 py-4 rounded-2xl font-bold text-lg relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-fuchsia-500" />
                <span className="relative z-10 text-white">{t('cta.contact')}</span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════════════════════ MAIN ════════════════════ */}
      <main id="main-content" dir={contentDir} className="flex-1 pt-[72px] flex flex-col relative">
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

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="relative bg-slate-950 text-white overflow-hidden">
        {/* subtle aurora */}
        <div className="absolute top-0 start-[10%] w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 end-[10%] w-80 h-80 rounded-full bg-cyan-600/10 blur-[100px] pointer-events-none" />
        {/* grid */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(to right,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />

        {/* ── Main columns ── */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Brand */}
            <div>
              <Link to="/" className="inline-flex items-center gap-3 mb-5">
                <Logo className="w-10 h-10" />
                <span className="font-bold text-lg text-white tracking-tight">
                  מרכז ה<span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">מדיה</span>
                </span>
              </Link>
              <p dir={contentDir} className="text-slate-400 text-sm leading-relaxed mb-7 max-w-xs">
                {t('footer.tagline')}
              </p>
              <div className="flex items-center gap-3">
                {([
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Facebook,  label: 'Facebook'  },
                  { icon: Linkedin,  label: 'LinkedIn'  },
                ] as const).map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.12] hover:border-white/20 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 dir={contentDir} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">
                {t('footer.nav_title')}
              </h3>
              <nav dir={contentDir} className="flex flex-col gap-3">
                {links.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 w-fit"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact info */}
            <div>
              <h3 dir={contentDir} className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-6">
                {t('footer.contact_title')}
              </h3>
              <div dir={contentDir} className="flex flex-col gap-4">
                {([
                  { icon: Mail,  href: `mailto:${t('footer.email')}`, text: t('footer.email')  },
                  { icon: Phone, href: `tel:${t('footer.phone').replace(/\s/g,'')}`, text: t('footer.phone') },
                  { icon: Clock, href: null, text: t('footer.hours') },
                ] as const).map(({ icon: Icon, href, text }) => (
                  <div key={text} className="flex items-center gap-3 text-sm text-slate-400">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {href
                      ? <a href={href} className="hover:text-white transition-colors">{text}</a>
                      : <span>{text}</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="relative z-10 border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span dir={contentDir} className="text-xs text-slate-500">
              © 2025 {t('footer.copyright')} · {t('footer.rights')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
