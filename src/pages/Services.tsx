import React from 'react';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Code, Shield, Megaphone, Search, Video, PenTool } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { cardVariants, containerStagger, sectionVariants, viewportOnce } from '../lib/motion';

type CardSize = 'normal' | 'large' | 'wide';

type ServiceDef = {
  id: string;
  icon: React.ElementType;
  color: string;
  accent: string;
  spotColor: string;
  size: CardSize;
};

const SERVICES: ServiceDef[] = [
  { id: 'dev',      icon: Code,      color: '#2563eb', accent: 'from-cyan-400 via-blue-500 to-indigo-500',      spotColor: 'rgba(6,182,212,0.13)',  size: 'large'  },
  { id: 'security', icon: Shield,    color: '#7c3aed', accent: 'from-violet-400 via-purple-500 to-fuchsia-500', spotColor: 'rgba(139,92,246,0.13)', size: 'normal' },
  { id: 'seo',      icon: Search,    color: '#db2777', accent: 'from-pink-400 via-rose-500 to-red-500',         spotColor: 'rgba(219,39,119,0.13)', size: 'normal' },
  { id: 'ads',      icon: Megaphone, color: '#ea580c', accent: 'from-amber-400 via-orange-500 to-red-500',      spotColor: 'rgba(234,88,12,0.13)',  size: 'normal' },
  { id: 'video',    icon: Video,     color: '#059669', accent: 'from-emerald-400 via-teal-500 to-cyan-500',     spotColor: 'rgba(5,150,105,0.13)',  size: 'normal' },
  { id: 'content',  icon: PenTool,   color: '#0ea5e9', accent: 'from-sky-400 via-blue-500 to-indigo-500',       spotColor: 'rgba(14,165,233,0.13)', size: 'wide'   },
];

function GridPulse() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          className="absolute border border-cyan-400/20"
          style={{ width: '65%', height: '45%', borderRadius: '6px' }}
          animate={{ scale: [0.05, 1.8], opacity: [0.7, 0] }}
          transition={{ duration: 5, delay: i * 1.25, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      {/* center crosshair */}
      <motion.div
        className="absolute w-8 h-px bg-cyan-400/30"
        animate={{ scaleX: [0, 1, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute h-8 w-px bg-cyan-400/30"
        animate={{ scaleY: [0, 1, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

function ServiceCard({ service, index }: { service: ServiceDef; index: number }) {
  const { t } = useTranslation('services');

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [9, -9]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 280, damping: 28 });

  const rawSpotX = useMotionValue(-1000);
  const rawSpotY = useMotionValue(-1000);
  const spotSX = useSpring(rawSpotX, { stiffness: 150, damping: 24 });
  const spotSY = useSpring(rawSpotY, { stiffness: 150, damping: 24 });
  const spotColor = service.spotColor;
  const spotBg = useMotionTemplate`radial-gradient(320px circle at ${spotSX}px ${spotSY}px, ${spotColor}, transparent 80%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    rawSpotX.set(e.clientX - rect.left);
    rawSpotY.set(e.clientY - rect.top);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    rawSpotX.set(-1000);
    rawSpotY.set(-1000);
  }

  const Icon = service.icon;
  const tags = t(`items.${service.id}.tags`, { returnObjects: true }) as string[];
  const isWide  = service.size === 'wide';
  const isLarge = service.size === 'large';
  const cardStyle = isWide
    ? { transformPerspective: 900 }
    : { rotateX, rotateY, transformPerspective: 900 };

  return (
    <motion.div
      variants={cardVariants}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02, z: isWide ? 0 : 10, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
      className="group relative rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_50px_rgb(0,0,0,0.10)] transition-shadow overflow-hidden cursor-default z-10 h-full"
    >
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l ${service.accent} origin-center transition-all duration-300 group-hover:h-[4px]`} />
      <motion.div className="absolute inset-0 pointer-events-none z-[2]" style={{ background: spotBg }} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-[2rem] pointer-events-none" />
      <div
        className="absolute -bottom-10 -end-10 w-48 h-48 rounded-full opacity-[0.04] group-hover:opacity-[0.10] blur-3xl transition-opacity duration-500 pointer-events-none z-[1]"
        style={{ backgroundColor: service.color }}
      />

      {isWide ? (
        /* ── Wide card: horizontal on lg ── */
        <div className="relative z-[3] flex flex-col lg:flex-row lg:items-center gap-8 p-8 lg:p-10 h-full">
          <div className="flex items-center gap-5 lg:flex-col lg:items-center lg:gap-3 lg:w-28 shrink-0">
            <div
              className="relative w-16 h-16 rounded-[1.25rem] bg-white ring-1 ring-slate-100 flex items-center justify-center shadow-md"
              style={{ color: service.color }}
            >
              <div className={`absolute inset-[-3px] rounded-[1.4rem] bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 blur-[2px] -z-10 transition-opacity duration-500`} />
              <Icon strokeWidth={1.8} className="w-7 h-7" />
            </div>
            <span className="text-5xl font-black text-slate-100 select-none leading-none tabular-nums transition-all duration-500 group-hover:text-slate-200/60">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="hidden lg:block w-px self-stretch bg-slate-200/60" />

          <div className="flex-1 min-w-0">
            <h2 className={`text-2xl font-bold text-slate-900 mb-3 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l ${service.accent}`}>
              {t(`items.${service.id}.title`)}
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">{t(`items.${service.id}.description`)}</p>
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-xs font-medium rounded-lg bg-white/80 border border-slate-200/50 shadow-sm text-slate-600 whitespace-nowrap">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* ── Normal / Large card: vertical ── */
        <div className={`relative z-[3] flex flex-col h-full ${isLarge ? 'p-10' : 'p-8'}`}>
          <div className="flex items-start justify-between gap-4 mb-8">
            <div
              className={`relative ${isLarge ? 'w-20 h-20 rounded-[1.5rem]' : 'w-16 h-16 rounded-[1.25rem]'} bg-white ring-1 ring-slate-100 flex items-center justify-center shadow-md`}
              style={{ color: service.color }}
            >
              <div className={`absolute inset-[-3px] ${isLarge ? 'rounded-[1.6rem]' : 'rounded-[1.4rem]'} bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 blur-[2px] -z-10 transition-opacity duration-500`} />
              <Icon strokeWidth={1.8} className={isLarge ? 'w-9 h-9' : 'w-7 h-7'} />
            </div>
            <span
              className="font-black text-slate-100 select-none leading-none tracking-tight translate-y-[-4px] transition-all duration-500 group-hover:text-slate-200/60 group-hover:scale-110"
              style={{ fontSize: isLarge ? '5rem' : '3.75rem', fontVariantNumeric: 'tabular-nums' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h2 className={`${isLarge ? 'text-3xl' : 'text-2xl'} font-bold text-slate-900 mb-4 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l ${service.accent}`}>
            {t(`items.${service.id}.title`)}
          </h2>

          <p className={`text-slate-600 ${isLarge ? 'text-base md:text-lg' : 'text-base'} leading-relaxed flex-1 mb-8`}>
            {t(`items.${service.id}.description`)}
          </p>

          <div className="flex flex-wrap gap-2 mt-auto">
            {tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-xs font-medium rounded-lg bg-white/80 border border-slate-200/50 shadow-sm text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function Services() {
  const { t } = useTranslation('services');

  return (
    <div className="flex-1 w-full">
      <PageMeta title={t('meta.title')} description={t('meta.description')} />

      {/* ── 1. DARK HERO ── */}
      <section className="relative min-h-[60vh] flex items-center bg-slate-950 overflow-x-clip">
        <div className="absolute -top-16 end-[10%] w-96 h-96 rounded-full bg-blue-600 blur-[140px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 start-[5%] w-72 h-72 rounded-full bg-cyan-500 blur-[110px] opacity-[0.12] pointer-events-none" />
        <div className="absolute bottom-0 end-[40%] w-64 h-64 rounded-full bg-violet-500 blur-[100px] opacity-10 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),' +
              'linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <GridPulse />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {t('badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-7xl lg:text-8xl font-black leading-[1.05] text-white mb-6"
          >
            {t('heading.prefix')}
            <span className="text-gradient-tech">{t('heading.highlight')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <div className="absolute bottom-0 start-0 end-0 leading-[0]" aria-hidden>
          <svg viewBox="0 0 1440 60" className="w-full h-12 md:h-16 text-white block" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M0,60 L1440,60 L1440,20 C1100,58 900,4 720,32 C540,60 300,6 0,38 Z" />
          </svg>
        </div>
      </section>

      {/* ── 2. BENTO GRID ── */}
      <section className="relative bg-white py-16 md:py-24 overflow-hidden">
        <div className="absolute top-[10%] end-[5%] w-80 h-80 bg-blue-400/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-[10%] start-[5%] w-72 h-72 bg-violet-400/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {SERVICES.map((service, i) => (
              <div
                key={service.id}
                className={
                  service.size === 'large' ? 'md:col-span-2 lg:col-span-2' :
                  service.size === 'wide'  ? 'md:col-span-2 lg:col-span-3' : ''
                }
              >
                <ServiceCard service={service} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 3. DARK CTA ── */}
      <div className="relative bg-slate-950 leading-[0] -mt-px" aria-hidden>
        <svg className="block w-full h-12 md:h-16 text-white" viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0,0 L1440,0 L1440,20 C1120,55 920,0 720,30 C520,60 320,5 0,30 Z" />
        </svg>
      </div>

      <section className="relative bg-slate-950 overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),' +
              'linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <div className="absolute top-0 start-1/4 w-80 h-80 rounded-full bg-cyan-500 blur-[120px] opacity-[0.07] pointer-events-none" />
        <div className="absolute bottom-0 end-1/4 w-80 h-80 rounded-full bg-violet-500 blur-[120px] opacity-[0.07] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 mb-6">
              {t('cta.eyebrow')}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-10">
              {t('cta.title_plain')}
              <span className="text-gradient-tech">{t('cta.title_highlight')}</span>
            </h2>
            <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-block px-12 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.08)] hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
              >
                {t('cta.button')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
