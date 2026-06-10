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

const SERVICES = [
  {
    icon: Code,
    title: 'פיתוח',
    desc: 'שירותי פיתוח וארכיטקטורה, אתרים מתקדמים ואפליקציות מובייל.',
    iconBg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    iconRing: 'ring-cyan-200/70',
    iconColor: 'text-cyan-600',
    accentBar: 'from-cyan-400 via-blue-500 to-indigo-500',
    hoverGlow: 'hover:shadow-[0_24px_48px_-12px_rgba(37,99,235,0.16)]',
    linkColor: 'text-cyan-600 group-hover:text-cyan-700',
    titleHover: 'group-hover:from-cyan-600 group-hover:to-blue-600',
  },
  {
    icon: Shield,
    title: 'אבטחת מידע',
    desc: 'ביקורת אבטחת מידע, יצירת חומות אש ובדיקות חדירות לאתרים ומערכות.',
    iconBg: 'bg-gradient-to-br from-violet-50 to-purple-50',
    iconRing: 'ring-violet-200/70',
    iconColor: 'text-violet-600',
    accentBar: 'from-violet-400 via-purple-500 to-fuchsia-500',
    hoverGlow: 'hover:shadow-[0_24px_48px_-12px_rgba(124,58,237,0.16)]',
    linkColor: 'text-violet-600 group-hover:text-violet-700',
    titleHover: 'group-hover:from-violet-600 group-hover:to-purple-600',
  },
  {
    icon: Megaphone,
    title: 'פרסום דיגיטלי',
    desc: 'שיווק איכותי מבוסס ביצועים וקמפיינים עם תוצאות מהירות ואפקטיביות.',
    iconBg: 'bg-gradient-to-br from-amber-50 to-rose-50',
    iconRing: 'ring-amber-200/70',
    iconColor: 'text-rose-600',
    accentBar: 'from-amber-400 via-rose-500 to-pink-500',
    hoverGlow: 'hover:shadow-[0_24px_48px_-12px_rgba(219,39,119,0.14)]',
    linkColor: 'text-rose-600 group-hover:text-rose-700',
    titleHover: 'group-hover:from-amber-600 group-hover:to-rose-600',
  },
];

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

interface ServiceCardProps {
  srv: typeof SERVICES[number];
  index: number;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function ServiceCard({ srv, index, onHoverStart, onHoverEnd }: ServiceCardProps) {
  const reduceMotion = useReducedMotion();
  const Icon = srv.icon;

  // Mouse coordinates for local spotlight glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth movement springs
  const springX = useSpring(mouseX, { stiffness: 150, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    onHoverEnd();
    if (reduceMotion) return;
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  const handleMouseEnter = () => {
    onHoverStart();
  };

  const spotlightColor =
    index === 0
      ? 'rgba(6, 182, 212, 0.15)'
      : index === 1
      ? 'rgba(139, 92, 246, 0.15)'
      : 'rgba(244, 63, 94, 0.12)';

  const ringGlow =
    index === 0
      ? 'group-hover:ring-cyan-400/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
      : index === 1
      ? 'group-hover:ring-violet-400/50 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
      : 'group-hover:ring-rose-400/50 group-hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]';

  const outlineGlow =
    index === 0
      ? 'group-hover:border-cyan-400/30'
      : index === 1
      ? 'group-hover:border-violet-400/30'
      : 'group-hover:border-rose-400/30';

  const buttonHoverClasses =
    index === 0
      ? 'group-hover:bg-cyan-50/70 group-hover:text-cyan-600 group-hover:border-cyan-200/60'
      : index === 1
      ? 'group-hover:bg-violet-50/70 group-hover:text-violet-600 group-hover:border-violet-200/60'
      : 'group-hover:bg-rose-50/70 group-hover:text-rose-600 group-hover:border-rose-200/60';

  const labelColorClasses =
    index === 0
      ? 'text-cyan-600'
      : index === 1
      ? 'text-violet-600'
      : 'text-rose-600';

  const spotlightBg = useMotionTemplate`radial-gradient(280px circle at ${springX}px ${springY}px, ${spotlightColor}, transparent 80%)`;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={cardHover}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <Link
        to="/services"
        className={`group relative flex flex-col h-full min-h-[360px] rounded-[2rem] p-8 overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200/60 shadow-[0_4px_20px_rgba(15,23,42,0.02)] transition-colors duration-500 ${outlineGlow} ${srv.hoverGlow}`}
      >
        {/* Dynamic top border indicator */}
        <div
          className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l ${srv.accentBar} transition-all duration-300 origin-center group-hover:h-[4px]`}
        />

        {/* Spotlight shine layer */}
        {!reduceMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{ background: spotlightBg }}
          />
        )}

        {/* Decorative corner glow */}
        <div
          className={`absolute -bottom-10 -end-10 w-40 h-40 rounded-full bg-gradient-to-br ${srv.accentBar} opacity-[0.04] group-hover:opacity-[0.14] blur-3xl transition-opacity duration-500 pointer-events-none z-[1]`}
        />

        {/* Top action row */}
        <div className="relative flex items-start justify-between gap-4 mb-8 z-[3]">
          {/* Double-nested ring icon wrapper */}
          <div
            className={`relative w-16 h-16 rounded-[1.25rem] bg-white ring-1 ring-slate-100 flex items-center justify-center shadow-md transition-all duration-500 ${ringGlow}`}
          >
            {/* Inner ambient ring */}
            <div
              className={`absolute inset-[-3px] rounded-[1.4rem] bg-gradient-to-br ${srv.accentBar} opacity-0 group-hover:opacity-100 blur-[2px] -z-10 transition-opacity duration-500`}
            />
            {/* Main icon */}
            <motion.div
              whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 12 }}
            >
              <Icon strokeWidth={1.8} className={`w-7 h-7 ${srv.iconColor}`} />
            </motion.div>
          </div>

          {/* Massive backdrop number */}
          <span
            className="text-6xl font-black font-display text-slate-100 select-none leading-none tracking-tight translate-y-[-4px] transition-all duration-500 group-hover:text-slate-200/60 group-hover:scale-110 group-hover:-translate-x-1"
            style={{
              fontVariantNumeric: 'tabular-nums',
              textShadow: '1px 1px 0px rgba(255,255,255,0.8)',
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`relative text-2xl font-bold text-slate-900 mb-4 z-[3] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l ${srv.titleHover} transition-all duration-300`}
        >
          {srv.title}
        </h3>

        {/* Description */}
        <p className="relative text-slate-600 text-base leading-relaxed flex-1 z-[3]">
          {srv.desc}
        </p>

        {/* Redesigned Button Pill */}
        <div className="relative mt-8 pt-6 border-t border-slate-100/60 flex items-center justify-between z-[3]">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white transition-all duration-300 shadow-sm text-sm font-bold ${buttonHoverClasses}`}
          >
            <span className={`transition-colors duration-300 ${labelColorClasses}`}>
              קרא עוד
            </span>
            <span className="w-5 h-5 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:text-inherit">
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Home() {
  const heroRef   = React.useRef<HTMLElement | null>(null);
  const [playHeroIntro] = React.useState(() => {
    try { return !sessionStorage.getItem('hero-intro-done'); } catch { return true; }
  });
  const [activeService, setActiveService] = React.useState(0);
  const [hoveredCard, setHoveredCard] = React.useState<number | null>(null);
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

      {/* ═══════════════════════ DARK HERO + SEAM ═══════════════════════ */}
      {/* overflow-x:clip clips horizontal orb bleed without creating a scroll container,
          leaving overflow-y:visible so aurora extends naturally down into the seam */}
      <div style={{ overflowX: 'clip' }}>
      <div
        className="relative bg-slate-950"
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
            {/* ── Primary CTA ── */}
            <motion.div style={{ x: ctaSX, y: ctaSY }} className="flex-1 sm:flex-initial min-w-0">
              {/* Color-cycling outer glow */}
              <motion.div
                className="rounded-full"
                animate={reduceMotion ? undefined : {
                  boxShadow: [
                    '0 0 20px 4px rgba(0,242,254,0.40),  0 0 50px 10px rgba(0,242,254,0.12)',
                    '0 0 20px 4px rgba(177,0,255,0.40),  0 0 50px 10px rgba(177,0,255,0.12)',
                    '0 0 20px 4px rgba(255,8,68,0.40),   0 0 50px 10px rgba(255,8,68,0.12)',
                    '0 0 20px 4px rgba(12,245,116,0.40), 0 0 50px 10px rgba(12,245,116,0.12)',
                    '0 0 20px 4px rgba(0,242,254,0.40),  0 0 50px 10px rgba(0,242,254,0.12)',
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Link
                  to="/services"
                  className="w-full sm:w-auto px-3 py-2.5 sm:px-8 sm:py-3.5 bg-white text-slate-950 rounded-full font-bold text-sm sm:text-lg relative overflow-hidden group flex items-center justify-center gap-1.5 sm:gap-2 btn-shimmer"
                  onMouseMove={onCtaMove}
                  onMouseLeave={onCtaLeave}
                >
                  {/* Gradient fill on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Periodic iridescent sheen — sweeps even without hover */}
                  {!reduceMotion && (
                    <motion.span
                      className="absolute inset-y-0 w-[55%] pointer-events-none z-[1]"
                      style={{
                        background:
                          'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0.40) 50%, rgba(255,255,255,0) 75%, transparent 100%)',
                      }}
                      initial={{ x: '-110%' }}
                      animate={{ x: '290%' }}
                      transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3.0 }}
                    />
                  )}
                  {/* Radial bloom from centre on hover */}
                  <span
                    className="absolute inset-0 rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.32) 0%, transparent 65%)' }}
                  />
                  <span className="relative z-10 group-hover:text-white transition-colors flex items-center gap-1.5 sm:gap-2">
                    גלה את השירותים
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            </motion.div>

            {/* ── Ghost CTA — rotating spotlight border ── */}
            <motion.div
              className="flex-1 sm:flex-initial min-w-0 relative rounded-full overflow-hidden p-[1.5px] bg-white/[0.07]"
              whileHover={reduceMotion ? undefined : { boxShadow: '0 0 26px 6px rgba(0,242,254,0.22)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Square rotating conic-gradient — creates traveling light on the border */}
              {!reduceMotion && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 'max(220%, calc(100% + 100px))',
                    aspectRatio: '1',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                  }}
                >
                  <motion.div
                    style={{
                      width: '100%',
                      height: '100%',
                      background:
                        'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 275deg, rgba(0,242,254,0.85) 308deg, rgba(129,140,248,1) 330deg, rgba(232,121,249,0.85) 348deg, transparent 360deg)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              )}
              <Link
                to="/contact"
                className="relative block px-3 py-2.5 sm:px-8 sm:py-3.5 rounded-full font-bold text-sm sm:text-lg bg-slate-950 text-white/70 hover:text-white hover:bg-slate-900 transition-colors text-center whitespace-nowrap group"
              >
                {/* Subtle inner glow on hover */}
                <span
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,242,254,0.07) 0%, transparent 70%)' }}
                />
                <span className="relative z-10">צור קשר</span>
              </Link>
            </motion.div>
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

        {/* Bottom dissolve — grid and orbs settle into solid dark before the wave */}
        <div
          className="absolute bottom-0 inset-x-0 h-36 pointer-events-none z-[5]"
          style={{
            background:
              'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.65) 45%, transparent 100%)',
          }}
        />
      </div>

      {/* ─── Wave bridge: dark hero flows into light services ─── */}
      <div className="relative -mt-px leading-[0] bg-[#020617] pointer-events-none" aria-hidden>
        {/* Aurora echo: faint orb glows bleeding over the wave crest */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 42% 90% at 22% 0%, rgba(139,92,246,0.16), transparent 60%),' +
              'radial-gradient(ellipse 38% 80% at 75% 0%, rgba(6,182,212,0.13), transparent 55%)',
          }}
        />
        <svg
          viewBox="0 0 1440 130"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative block w-full h-20 sm:h-28 md:h-32"
        >
          <defs>
            <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#06b6d4" />
              <stop offset="45%"  stopColor="#8b5cf6" />
              <stop offset="80%"  stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <filter id="wave-halo" x="-5%" y="-300%" width="110%" height="700%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="soft" />
              <feMerge>
                <feMergeNode in="soft" />
                <feMergeNode in="soft" />
              </feMerge>
            </filter>
          </defs>

          {/* Light wave body — same colour as services section top */}
          <path
            fill="#f5f6ff"
            d="M0,72 C240,108 480,26 720,58 C960,90 1200,34 1440,64 L1440,130 L0,130 Z"
          />
          {/* Soft neon halo hugging the crest */}
          <path
            d="M0,72 C240,108 480,26 720,58 C960,90 1200,34 1440,64"
            fill="none" stroke="url(#wave-grad)" strokeWidth="3" strokeOpacity="0.5"
            filter="url(#wave-halo)"
          />
          {/* Crisp gradient crest line */}
          <path
            d="M0,72 C240,108 480,26 720,58 C960,90 1200,34 1440,64"
            fill="none" stroke="url(#wave-grad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85"
          />
        </svg>
      </div>
      </div>{/* end hero+seam wrapper */}

      {/* ═══════════════════ SERVICES ═══════════════════ */}
      <section className="relative -mt-px overflow-hidden bg-[#f5f6ff]">
        {/* Gradient: matches seam lower triangle → white at cards */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #f5f6ff 0%, #f8f9ff 18%, #fbfcff 36%, #ffffff 60%)',
          }}
        />
        <div className="absolute inset-0 section-dot-grid opacity-[0.25] pointer-events-none" />
        <div className="absolute -top-4 right-0 w-96 h-96 rounded-full bg-violet-200/12 blur-3xl pointer-events-none" />
        <div className="absolute top-44 -left-24 w-80 h-80 rounded-full bg-cyan-200/10 blur-3xl pointer-events-none" />

        {/* Dynamic ambient background mesh matching the active card */}
        {!reduceMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden transition-all duration-1000 z-[0]">
            <motion.div
              animate={{
                opacity: hoveredCard === 0 ? 0.35 : 0,
                scale: hoveredCard === 0 ? 1.1 : 0.9,
              }}
              transition={{ duration: 0.6 }}
              className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full bg-cyan-300/30 blur-[120px]"
            />
            <motion.div
              animate={{
                opacity: hoveredCard === 1 ? 0.35 : 0,
                scale: hoveredCard === 1 ? 1.1 : 0.9,
              }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-violet-400/30 blur-[130px]"
            />
            <motion.div
              animate={{
                opacity: hoveredCard === 2 ? 0.35 : 0,
                scale: hoveredCard === 2 ? 1.1 : 0.9,
              }}
              transition={{ duration: 0.6 }}
              className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-rose-400/30 blur-[120px]"
            />
          </div>
        )}

        <div className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-[1]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-14 md:mb-20"
          >
            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 z-[1]">
              <div className="max-w-2xl relative pr-6">
                {/* Vertical editorial gradient line on the right (RTL start) */}
                <div className="absolute top-2 right-0 bottom-2 w-[3px] rounded-full bg-gradient-to-b from-cyan-400 via-violet-400 to-rose-400" />

                {/* Glowing Glassmorphic Badge */}
                <div className="relative inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6 overflow-hidden group/badge">
                  <span className="absolute -inset-px rounded-full bg-gradient-to-r from-cyan-400/20 via-violet-400/20 to-rose-400/20 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-l from-cyan-600 via-violet-600 to-rose-500">
                    מה אנחנו עושים
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 mb-5 leading-[1.08] tracking-tight">
                  ה<span className="text-gradient-tech">התמחויות</span> שלנו<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500">.</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
                  אנחנו משלבים טכנולוגיה и קריאייטיב כדי לפתור את האתגרים המורכבים ביותר.
                </p>
              </div>

              {/* Luminous White Glass Main CTA */}
              <Link
                to="/services"
                className="shrink-0 self-start lg:self-auto relative p-[1.5px] rounded-full overflow-hidden transition-transform duration-300 active:scale-98 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(6,182,212,0.1)] group/btn"
              >
                {/* Animated gradient border */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-rose-400" />
                {/* Inner container */}
                <span className="relative flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-slate-800 font-bold text-sm transition-colors duration-300 group-hover/btn:bg-slate-50/90">
                  צפה בכל השירותים
                  <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 transition-all duration-300 group-hover/btn:-translate-x-1 group-hover/btn:bg-slate-900 group-hover/btn:text-white">
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {SERVICES.map((srv, i) => (
              <ServiceCard
                key={i}
                srv={srv}
                index={i}
                onHoverStart={() => setHoveredCard(i)}
                onHoverEnd={() => setHoveredCard(null)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom transition wave — dissolves white back into Layout's slate-50/gradient background */}
      <div className="relative bg-transparent leading-[0] -mt-px z-10" aria-hidden>
        <svg
          className="block w-full h-16 sm:h-20 md:h-24 text-white"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            d="M0,0 L1440,0 L1440,40 C1120,5 920,80 720,44 C520,8 320,85 0,35 Z"
          />
        </svg>
      </div>
    </div>
  );
}
