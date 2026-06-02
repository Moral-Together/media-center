import React from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Shield, Megaphone } from 'lucide-react';
import { Logo } from '../components/Logo';
import { PageMeta } from '../components/PageMeta';
import { cardHover, cardVariants, containerStagger, viewportOnce } from '../lib/motion';

export default function Home() {
  const heroRef = React.useRef<HTMLElement | null>(null);
  const [playHeroIntro] = React.useState(() => {
    try { return !sessionStorage.getItem('hero-intro-done'); } catch { return true; }
  });
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (playHeroIntro) {
      try { sessionStorage.setItem('hero-intro-done', '1'); } catch { /* storage unavailable */ }
    }
  }, [playHeroIntro]);

  const heroEnter = <T,>(value: T): false | T => (playHeroIntro ? value : false);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const auroraY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -90]);
  const shapeY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const auroraYMid = useTransform(auroraY, (value) => value * 0.65);
  const auroraYRear = useTransform(auroraY, (value) => value * -0.4);
  const shapeYMid = useTransform(shapeY, (value) => value * 0.6);

  const ctaX = useMotionValue(0);
  const ctaY = useMotionValue(0);
  const ctaSpringX = useSpring(ctaX, { stiffness: 260, damping: 22, mass: 0.8 });
  const ctaSpringY = useSpring(ctaY, { stiffness: 260, damping: 22, mass: 0.8 });

  const onCtaMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);
    ctaX.set(offsetX * 0.08);
    ctaY.set(offsetY * 0.12);
  };

  const onCtaLeave = () => {
    ctaX.set(0);
    ctaY.set(0);
  };

  return (
    <div className="flex-1 w-full relative overflow-hidden">
      <PageMeta
        title="ראשי"
        description="מרכז המדיה של ישראל – פיתוח אתרים, אבטחת מידע, פרסום דיגיטלי ועוד. הפתרון הדיגיטלי המלא לעסק שלך."
      />
      {/* Background glow effects & Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Subtle dot grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}
        ></div>
        
        {/* Animated Aurora Orbs */}
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, 100, -50, 0], scale: [1, 1.2, 0.8, 1] }}
          transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: auroraY }}
          className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply"
        />
        
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, -100, 50, 0], scale: [1, 0.9, 1.2, 1] }}
          transition={reduceMotion ? undefined : { duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: auroraYMid }}
          className="absolute top-[20%] left-[5%] w-[450px] h-[450px] bg-fuchsia-400/20 rounded-full blur-[120px] mix-blend-multiply"
        />
        
        <motion.div
          animate={reduceMotion ? undefined : { x: [0, 50, -100, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={reduceMotion ? undefined : { duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          style={{ y: auroraYRear }}
          className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px] mix-blend-multiply"
        />

        {/* Floating Glassmorphism Abstract Shapes */}
        <motion.div
          animate={reduceMotion ? undefined : { y: [-20, 20, -20], rotate: [0, 90, 180, 0] }}
          transition={reduceMotion ? undefined : { duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ y: shapeY }}
          className="hidden md:flex absolute top-[15%] left-[15%] w-28 h-28 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] items-center justify-center p-3 opacity-80"
        >
           <div className="w-full h-full rounded-2xl border border-slate-200/50 border-dashed" />
        </motion.div>

        <motion.div
          animate={reduceMotion ? undefined : { y: [30, -30, 30], rotate: [0, -180, -360] }}
          transition={reduceMotion ? undefined : { duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ y: shapeYMid }}
          className="hidden md:block absolute top-[55%] right-[12%] w-36 h-36 rounded-full border border-white/60 bg-gradient-to-tr from-white/20 to-white/70 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.08)] opacity-80"
        >
           <div className="absolute inset-2 rounded-full border border-white/40" />
        </motion.div>

        <motion.div
           animate={reduceMotion ? undefined : { y: [0, -40, 0], x: [0, 20, 0], rotate: [15, -15, 15] }}
           transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: 'easeInOut' }}
           className="hidden lg:block absolute bottom-[20%] left-[20%] w-24 h-24 bg-white/50 backdrop-blur-md border border-white/60 shadow-xl opacity-70"
           style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
        />
        
        <motion.div
          animate={reduceMotion ? undefined : { y: [-15, 15, -15], x: [-15, 15, -15] }}
          transition={reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[30%] right-[30%] w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400/20 to-transparent border border-blue-200/50 backdrop-blur-sm rotate-45"
        />
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity }}
        className="relative z-10 pt-4 md:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        
        <motion.div
           initial={heroEnter({ opacity: 0, scale: 0.8 })}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
           className="flex flex-col items-center mb-8"
        >
          <motion.div
            initial={heroEnter({ opacity: 0, y: -10 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
          >
             <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
             נוסד בשנת 5785
          </motion.div>
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -7, 0], rotate: [0, 1.2, 0, -1.2, 0] }}
            transition={reduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <motion.div
              animate={reduceMotion ? undefined : { opacity: [0.35, 0.62, 0.35], scale: [0.95, 1.04, 0.95] }}
              transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-blue-500/25 via-purple-500/30 to-pink-500/25"
            />
            <Logo className="relative w-40 h-40 md:w-56 md:h-56 drop-shadow-xl" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={heroEnter({ opacity: 0, scale: 0.95 })}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 max-w-5xl text-gradient-tech pb-2 hero-title-shimmer"
        >
          מרכז המדיה של ישראל
        </motion.h1>

        <motion.p
          initial={heroEnter({ opacity: 0 })}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-lg leading-relaxed max-w-2xl text-center mb-10"
        >
          פרסום וקידום • מכירות • ייעוץ והכוונה • פיתוח
        </motion.p>

        <motion.div
          initial={heroEnter({ opacity: 0, y: 20 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div style={{ x: ctaSpringX, y: ctaSpringY }}>
            <Link
            to="/services"
            className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:text-white transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 text-lg relative overflow-hidden group"
            onMouseMove={onCtaMove}
            onMouseLeave={onCtaLeave}
            >
              <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative z-10 flex items-center gap-2">גלה את השירותים שלנו <ArrowLeft className="w-5 h-5" /></span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Featured Services Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 relative bg-transparent">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-neon opacity-50"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">ההתמחויות שלנו</h2>
            <p className="text-slate-600 max-w-xl">
              אנחנו משלבים טכנולוגיה וקריאייטיב כדי לפתור את האתגרים המורכבים ביותר.
            </p>
          </div>
          <Link to="/services" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold">
            צפה בכל השירותים <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          variants={containerStagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: Code, title: "פיתוח", desc: "שירותי פיתוח וארכיטקטורה, אתרים מתקדמים ואפליקציות מובייל.", colorClass: "text-blue-600", bgClass: "bg-gradient-to-br from-blue-50 to-blue-100/50" },
            { icon: Shield, title: "אבטחת מידע", desc: "ביקורת אבטחת מידע, יצירת חומות אש ובדיקות חדירות לאתרים ומערכות.", colorClass: "text-purple-600", bgClass: "bg-gradient-to-br from-purple-50 to-purple-100/50" },
            { icon: Megaphone, title: "פרסום דיגיטלי", desc: "שיווק איכותי מבוסס ביצועים וקמפיינים עם תוצאות מהירות ואפקטивיות.", colorClass: "text-pink-600", bgClass: "bg-gradient-to-br from-pink-50 to-pink-100/50" },
          ].map((srv, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={cardHover}
              className="group relative bg-white/60 backdrop-blur-xl border border-white max-w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col z-10"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-[2rem] pointer-events-none" />
               <div className={`relative w-14 h-14 ${srv.bgClass} border border-slate-200/60 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                 <srv.icon strokeWidth={2} className={`w-6 h-6 ${srv.colorClass}`} />
               </div>
               <h3 className="relative text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">{srv.title}</h3>
               <p className="relative text-slate-600 text-base flex-1 leading-relaxed">{srv.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
