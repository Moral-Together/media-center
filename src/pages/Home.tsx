import React from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useMotionTemplate,
  useTransform,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Shield, Megaphone } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PageMeta } from '../components/PageMeta';
import {
  cardHover,
  cardVariants,
  containerStagger,
  useAnimatedCounter,
  viewportOnce,
} from '../lib/motion';

const CYCLING_SERVICES = [
  'פיתוח אתרים ואפליקציות',
  'אבטחת מידע וסייבר',
  'פרסום דיגיטלי ו-SEO',
  'הפקת וידאו ותוכן',
];

const STATS = [
  {
    numeric: 120,
    prefix: '+',
    label: 'לקוחות מרוצים',
    accent: 'from-cyan-300 to-blue-400',
    glow: 'group-hover:shadow-cyan-500/25',
  },
  {
    numeric: 300,
    prefix: '+',
    label: 'פרויקטים',
    accent: 'from-violet-300 to-purple-400',
    glow: 'group-hover:shadow-violet-500/25',
  },
  {
    numeric: 25,
    prefix: '',
    label: 'מומחים',
    accent: 'from-fuchsia-300 to-pink-400',
    glow: 'group-hover:shadow-fuchsia-500/25',
  },
  {
    numeric: 10,
    prefix: '',
    label: 'שנות ניסיון',
    accent: 'from-emerald-300 to-teal-400',
    glow: 'group-hover:shadow-emerald-500/25',
  },
] as const;

const SPARKLE_COLORS = ['#00f2fe', '#818cf8', '#e879f9', '#0cf574', '#fce803'];

interface Sparkle { id: number; x: number; y: number; size: number; color: string; }

type HeroStatItem = (typeof STATS)[number];

function HeroStat({
  stat,
  index,
  playIntro,
  reduceMotion,
}: {
  stat: HeroStatItem;
  index: number;
  playIntro: boolean;
  reduceMotion: boolean | null;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const animated = useAnimatedCounter(stat.numeric, inView && !reduceMotion);
  const display = reduceMotion ? stat.numeric : animated;

  return (
    <motion.div
      ref={ref}
      initial={playIntro ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.48 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col items-center justify-center py-5 px-3 sm:px-4 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300 ${stat.glow} hover:shadow-lg`}
    >
      <div
        className={`absolute inset-x-3 top-0 h-px bg-gradient-to-l ${stat.accent} opacity-60 group-hover:opacity-100 transition-opacity`}
      />
      <span
        className={`text-3xl sm:text-4xl font-bold tabular-nums bg-gradient-to-b ${stat.accent} bg-clip-text text-transparent`}
      >
        {stat.prefix}
        {display}
      </span>
      <span className="text-[11px] sm:text-xs text-slate-400 mt-2 font-medium tracking-wide text-center leading-snug group-hover:text-slate-300 transition-colors">
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function Home() {
  const heroRef   = React.useRef<HTMLElement | null>(null);
  const [playHeroIntro] = React.useState(() => {
    try { return !sessionStorage.getItem('hero-intro-done'); } catch { return true; }
  });
  const [activeService, setActiveService] = React.useState(0);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (playHeroIntro) {
      try { sessionStorage.setItem('hero-intro-done', '1'); } catch { /* storage unavailable */ }
    }
  }, [playHeroIntro]);

  // Cycle through services every 2.8 s
  React.useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(
      () => setActiveService(p => (p + 1) % CYCLING_SERVICES.length),
      2800,
    );
    return () => clearInterval(id);
  }, [reduceMotion]);

  const heroEnter = <T,>(value: T): false | T => (playHeroIntro ? value : false);

  // Scroll: content gently fades + scales back as user scrolls away
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const heroScale   = useTransform(scrollYProgress, [0, 1],    [1, 0.94]);

  // Mouse-driven parallax for aurora orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smX = useSpring(mouseX, { stiffness: 45, damping: 28 });
  const smY = useSpring(mouseY, { stiffness: 45, damping: 28 });

  const o1x = useTransform(smX, [-1, 1], [-55, 55]);
  const o1y = useTransform(smY, [-1, 1], [-35, 35]);
  const o2x = useTransform(smX, [-1, 1], [ 40,-40]);
  const o2y = useTransform(smY, [-1, 1], [ 28,-28]);
  const o3x = useTransform(smX, [-1, 1], [-28, 28]);
  const o4x = useTransform(smX, [-1, 1], [ 22,-22]);
  const o4y = useTransform(smY, [-1, 1], [-18, 18]);

  // Cursor spotlight & sparkles
  const spotX = useMotionValue(-600);
  const spotY = useMotionValue(-600);
  const spotSX = useSpring(spotX, { stiffness: 85, damping: 20 });
  const spotSY = useSpring(spotY, { stiffness: 85, damping: 20 });
  const spotBg = useMotionTemplate`radial-gradient(580px circle at ${spotSX}px ${spotSY}px, rgba(6,182,212,0.13), rgba(99,102,241,0.08) 38%, transparent 65%)`;

  const [sparkles, setSparkles] = React.useState<Sparkle[]>([]);
  const sparkleIdRef = React.useRef(0);
  const lastSparkleRef = React.useRef(0);

  const onHeroMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const r = e.currentTarget.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      mouseX.set(px / r.width  * 2 - 1);
      mouseY.set(py / r.height * 2 - 1);
      spotX.set(px);
      spotY.set(py);

      const now = Date.now();
      if (now - lastSparkleRef.current > 55) {
        lastSparkleRef.current = now;
        const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
        const size = 3 + Math.random() * 5;
        const id = ++sparkleIdRef.current;
        const sx = px + (Math.random() - 0.5) * 90;
        const sy = py + (Math.random() - 0.5) * 90;
        setSparkles(prev => [...prev.slice(-20), { id, x: sx, y: sy, size, color }]);
        setTimeout(() => setSparkles(prev => prev.filter(s => s.id !== id)), 850);
      }
    },
    [reduceMotion, mouseX, mouseY, spotX, spotY],
  );
  const onHeroMouseLeave = React.useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    spotX.set(-600);
    spotY.set(-600);
    setSparkles([]);
  }, [mouseX, mouseY, spotX, spotY]);

  // CTA magnetic
  const ctaX = useMotionValue(0);
  const ctaY = useMotionValue(0);
  const ctaSX = useSpring(ctaX, { stiffness: 260, damping: 22, mass: 0.8 });
  const ctaSY = useSpring(ctaY, { stiffness: 260, damping: 22, mass: 0.8 });

  const onCtaMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    ctaX.set((e.clientX - (r.left + r.width  / 2)) * 0.08);
    ctaY.set((e.clientY - (r.top  + r.height / 2)) * 0.12);
  };
  const onCtaLeave = () => { ctaX.set(0); ctaY.set(0); };

  return (
    <div className="flex-1 w-full">
      <PageMeta
        title="ראשי"
        description="מרכז המדיה של ישראל – פיתוח אתרים, אבטחת מידע, פרסום דיגיטלי ועוד. הפתרון הדיגיטלי המלא לעסק שלך."
      />

      {/* ═══════════════════════ DARK HERO ═══════════════════════ */}
      <div
        className="relative bg-slate-950 overflow-hidden"
        onMouseMove={onHeroMouseMove}
        onMouseLeave={onHeroMouseLeave}
      >
        {/* Fine grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),' +
              'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        {/* Centre radial vignette — kills the grid in the middle */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 70% at 50% 40%, transparent 30%, #020617 100%)',
          }}
        />

        {/* Cursor spotlight */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{ background: spotBg }}
        />

        {/* ── Aurora orbs ── */}
        {/* Cyan — top-right */}
        <motion.div
          style={{ x: o1x, y: o1y, willChange: 'transform' }}
          animate={reduceMotion ? undefined : { scale: [1, 1.22, 0.88, 1] }}
          transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-48 -right-24 w-[680px] h-[680px] rounded-full bg-cyan-500/30 blur-[110px] pointer-events-none"
        />
        {/* Violet — left */}
        <motion.div
          style={{ x: o2x, y: o2y, willChange: 'transform' }}
          animate={reduceMotion ? undefined : { scale: [1, 0.83, 1.28, 1] }}
          transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 -left-36 w-[560px] h-[560px] rounded-full bg-violet-600/28 blur-[100px] pointer-events-none"
        />
        {/* Fuchsia — bottom-center */}
        <motion.div
          style={{ x: o3x, willChange: 'transform' }}
          animate={reduceMotion ? undefined : { scale: [1, 1.18, 0.88, 1], y: [0, 40, -25, 0] }}
          transition={reduceMotion ? undefined : { duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-48 left-1/3 w-[640px] h-[640px] rounded-full bg-fuchsia-600/25 blur-[115px] pointer-events-none"
        />
        {/* Blue — centre */}
        <motion.div
          style={{ x: o4x, y: o4y, willChange: 'transform' }}
          animate={reduceMotion ? undefined : { scale: [1, 1.12, 0.9, 1] }}
          transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full bg-blue-600/20 blur-[95px] pointer-events-none"
        />

        {/* ── Hero content ── */}
        <motion.section
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 pt-8 md:pt-12 pb-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col items-center text-center"
        >

          {/* Logo */}
          <motion.div
            initial={heroEnter({ opacity: 0, scale: 0.62 })}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.32, delay: 0.1 }}
            className="relative mb-8"
          >
            {/* Pulsing halo */}
            <motion.div
              animate={reduceMotion ? undefined : {
                opacity: [0.3, 0.7, 0.3],
                scale:   [0.85, 1.15, 0.85],
              }}
              transition={reduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full blur-3xl bg-gradient-to-r from-cyan-500/50 via-violet-500/50 to-fuchsia-500/50"
            />
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
              transition={reduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Logo className="relative w-32 h-32 md:w-44 md:h-44 drop-shadow-2xl" />
            </motion.div>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={heroEnter({ opacity: 0, y: 26 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6"
          >
            <img
              src="/logo_text.png"
              alt="מרכז המדיה של ישראל"
              draggable={false}
              width={800}
              height={160}
              fetchPriority="high"
              className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl h-auto mx-auto object-contain select-none"
            />
          </motion.h1>

          {/* Cycling service label */}
          <motion.div
            initial={heroEnter({ opacity: 0 })}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-col items-center mb-10 gap-1"
          >
            <p className="text-slate-400 text-base">אנחנו מתמחים ב</p>
            <div className="h-10 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeService}
                  initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                  exit={   { opacity: 0, y: -24, filter: 'blur(6px)' }}
                  transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                  className="text-2xl md:text-3xl font-bold text-gradient-cycling block"
                >
                  {CYCLING_SERVICES[activeService]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={heroEnter({ opacity: 0, y: 20 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-row items-center justify-center gap-2 sm:gap-4 mb-14 w-full max-w-lg sm:max-w-none mx-auto"
          >
            {/* Primary CTA */}
            <motion.div style={{ x: ctaSX, y: ctaSY }} className="flex-1 sm:flex-initial min-w-0">
              <Link
                to="/services"
                className="w-full sm:w-auto px-3 py-2.5 sm:px-8 sm:py-3.5 bg-white text-slate-950 rounded-full font-bold text-sm sm:text-lg relative overflow-hidden group flex items-center justify-center gap-1.5 sm:gap-2 shadow-[0_0_40px_rgba(255,255,255,0.18)] hover:shadow-[0_0_60px_rgba(255,255,255,0.28)] transition-shadow whitespace-nowrap"
                onMouseMove={onCtaMove}
                onMouseLeave={onCtaLeave}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2">
                  גלה את השירותים
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </span>
              </Link>
            </motion.div>

            {/* Ghost CTA */}
            <Link
              to="/contact"
              className="flex-1 sm:flex-initial min-w-0 px-3 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-bold text-sm sm:text-lg border border-white/15 text-white/75 hover:text-white hover:border-white/30 hover:bg-white/6 transition-all text-center whitespace-nowrap"
            >
              צור קשר
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={heroEnter({ opacity: 0, y: 16 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42 }}
            className="relative w-full max-w-2xl"
          >
            <div
              className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-r from-cyan-500/20 via-violet-500/15 to-fuchsia-500/20 blur-lg opacity-70 pointer-events-none"
              aria-hidden
            />
            <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-2 sm:p-3 rounded-[1.5rem] bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
              {STATS.map((stat, i) => (
                <HeroStat
                  key={stat.label}
                  stat={stat}
                  index={i}
                  playIntro={playHeroIntro}
                  reduceMotion={reduceMotion}
                />
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Sparkle particles */}
        {!reduceMotion && sparkles.map((s) => (
          <motion.div
            key={s.id}
            className="absolute pointer-events-none rounded-full z-[15]"
            style={{
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}, 0 0 ${s.size * 5}px ${s.color}60`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0.9, scale: 0 }}
            animate={{ opacity: 0, scale: 1.8, y: -28 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}

        {/* Soft glow above wave — no heavy blur into white */}
        <div
          className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(2, 6, 23, 0.95) 0%, rgba(15, 23, 42, 0.4) 45%, transparent 100%)',
          }}
        />
      </div>

      {/* Wave bridge: dark hero → light content */}
      <div className="relative z-10 -mt-px leading-[0] text-slate-50" aria-hidden>
        <svg
          className="block w-full h-14 sm:h-20 md:h-24"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,48 C360,88 720,8 1080,52 C1260,72 1380,64 1440,56 L1440,80 L0,80 Z"
          />
        </svg>
      </div>

      {/* ═══════════════════ SERVICES PREVIEW (light) ═══════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100/80 section-light-mesh">
        <div className="absolute inset-0 section-dot-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-neon opacity-40" />
        <div className="absolute top-24 -left-32 w-72 h-72 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -right-24 w-80 h-80 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />

        <div className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-l from-cyan-600 via-violet-600 to-pink-600 mb-3">
                מה אנחנו עושים
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-slate-900">
                ההתמחויות שלנו
              </h2>
              <p className="text-slate-600 max-w-xl text-lg leading-relaxed">
                אנחנו משלבים טכנולוגיה וקריאייטיב כדי לפתור את האתגרים המורכבים ביותר.
              </p>
            </div>
            <Link
              to="/services"
              className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200/80 bg-white/80 text-slate-700 font-bold text-sm shadow-sm hover:border-violet-200 hover:text-violet-700 hover:shadow-md transition-all"
            >
              צפה בכל השירותים
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {[
              {
                icon: Code,
                title: 'פיתוח',
                desc: 'שירותי פיתוח וארכיטקטורה, אתרים מתקדמים ואפליקציות מובייל.',
                colorClass: 'text-blue-600',
                bgClass: 'bg-gradient-to-br from-blue-50 to-cyan-50',
                accent: 'from-blue-500 via-cyan-500 to-blue-600',
                glow: 'group-hover:shadow-[0_24px_48px_-12px_rgba(37,99,235,0.22)]',
              },
              {
                icon: Shield,
                title: 'אבטחת מידע',
                desc: 'ביקורת אבטחת מידע, יצירת חומות אש ובדיקות חדירות לאתרים ומערכות.',
                colorClass: 'text-purple-600',
                bgClass: 'bg-gradient-to-br from-purple-50 to-violet-50',
                accent: 'from-violet-500 via-purple-500 to-fuchsia-600',
                glow: 'group-hover:shadow-[0_24px_48px_-12px_rgba(124,58,237,0.22)]',
              },
              {
                icon: Megaphone,
                title: 'פרסום דיגיטלי',
                desc: 'שיווק איכותי מבוסס ביצועים וקמפיינים עם תוצאות מהירות ואפקטивיות.',
                colorClass: 'text-pink-600',
                bgClass: 'bg-gradient-to-br from-pink-50 to-rose-50',
                accent: 'from-pink-500 via-rose-500 to-orange-500',
                glow: 'group-hover:shadow-[0_24px_48px_-12px_rgba(219,39,119,0.2)]',
              },
            ].map((srv, i) => (
              <motion.div key={i} variants={cardVariants} whileHover={cardHover}>
                <Link
                  to="/services"
                  className={`group relative flex flex-col h-full rounded-[2rem] p-8 bg-white/90 backdrop-blur-sm border border-slate-200/70 overflow-hidden transition-all duration-300 ${srv.glow} hover:-translate-y-1 hover:border-slate-300/80`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${srv.accent} opacity-80`}
                  />
                  <div
                    className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${srv.accent} opacity-[0.07] blur-2xl pointer-events-none group-hover:opacity-[0.12] transition-opacity`}
                  />
                  <span className="absolute top-6 end-6 text-[10px] font-bold tabular-nums text-slate-300 group-hover:text-slate-400 transition-colors">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div
                    className={`relative w-14 h-14 ${srv.bgClass} border border-slate-200/50 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-white group-hover:scale-105 transition-transform duration-300`}
                  >
                    <srv.icon strokeWidth={2} className={`w-6 h-6 ${srv.colorClass}`} />
                  </div>
                  <h3 className="relative text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    {srv.title}
                  </h3>
                  <p className="relative text-slate-600 text-base flex-1 leading-relaxed mb-6">
                    {srv.desc}
                  </p>
                  <span className="relative inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 group-hover:text-violet-600 transition-colors">
                    קרא עוד
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom fade into page background */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[var(--background)] to-transparent pointer-events-none" />
      </section>
    </div>
  );
}
