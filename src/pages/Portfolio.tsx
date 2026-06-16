import React, { useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';
import { viewportOnce } from '../lib/motion';

type FilterKey = 'all' | 'dev' | 'media' | 'digital';

const PROJECTS = [
  { id: 1, filter: 'dev'     as FilterKey, color: '#2563eb', accent: 'from-cyan-400 to-blue-500',     image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 2, filter: 'media'   as FilterKey, color: '#7c3aed', accent: 'from-violet-400 to-purple-500', image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, filter: 'dev'     as FilterKey, color: '#db2777', accent: 'from-fuchsia-400 to-pink-500',  image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 4, filter: 'digital' as FilterKey, color: '#ea580c', accent: 'from-amber-400 to-orange-500', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 5, filter: 'digital' as FilterKey, color: '#059669', accent: 'from-emerald-400 to-teal-500', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 6, filter: 'media'   as FilterKey, color: '#0ea5e9', accent: 'from-sky-400 to-blue-500',     image: 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
] as const;

type Project = (typeof PROJECTS)[number];

const FILTERS: FilterKey[] = ['all', 'dev', 'media', 'digital'];

const FLASH_FRAMES = [
  { top: '14%', left: '8%',  w: '18%', h: '16%', delay: 0    },
  { top: '58%', left: '68%', w: '16%', h: '13%', delay: 1.6  },
  { top: '28%', left: '54%', w: '17%', h: '15%', delay: 0.9  },
  { top: '68%', left: '18%', w: '20%', h: '15%', delay: 2.3  },
  { top: '10%', left: '74%', w: '14%', h: '12%', delay: 3.2  },
  { top: '48%', left: '36%', w: '15%', h: '13%', delay: 1.1  },
];

function FlashFrames() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {FLASH_FRAMES.map((f, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: f.top, left: f.left, width: f.w, height: f.h }}
          animate={{ opacity: [0, 0.65, 0] }}
          transition={{ duration: 1.8, delay: f.delay, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
        >
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/50" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/50" />
        </motion.div>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation('portfolio');
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-80, 80], [6, -6]);
  const rotateY = useTransform(mouseX, [-80, 80], [-6, 6]);

  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotBg = useMotionTemplate`radial-gradient(280px circle at ${spotX}% ${spotY}%, rgba(255,255,255,0.06), transparent 80%)`;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    mouseX.set(cx - rect.width / 2);
    mouseY.set(cy - rect.height / 2);
    spotX.set((cx / rect.width) * 100);
    spotY.set((cy / rect.height) * 100);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    spotX.set(50);
    spotY.set(50);
  }

  const num = String(project.id).padStart(2, '0');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative rounded-[2rem] overflow-hidden bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_28px_56px_rgb(0,0,0,0.12)] transition-shadow cursor-pointer flex flex-col z-10"
    >
      {/* spotlight */}
      <motion.div className="absolute inset-0 z-0 pointer-events-none rounded-[2rem]" style={{ background: spotBg }} />

      {/* colored top bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${project.accent} flex-shrink-0`} />

      {/* image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img
          src={project.image}
          alt={t(`items.${project.id}.title`)}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23f1f5f9'%3E%3Crect width='800' height='600'/%3E%3C/svg%3E";
          }}
        />

        {/* number badge */}
        <div
          className="absolute top-4 start-4 z-20 w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg"
          style={{ background: project.color }}
        >
          {num}
        </div>

        {/* category pill */}
        <div className="absolute top-4 end-4 z-20">
          <span
            className="px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm backdrop-blur-md"
            style={{ backgroundColor: project.color }}
          >
            {t(`items.${project.id}.category`)}
          </span>
        </div>

        {/* hover description overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-6 px-5"
              style={{ background: `linear-gradient(to top, ${project.color}ee 0%, ${project.color}88 50%, transparent 100%)` }}
            >
              <p className="text-white/90 text-sm text-center leading-relaxed mb-4 line-clamp-3">
                {t(`items.${project.id}.description`)}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-white border border-white/40 px-4 py-2 rounded-full backdrop-blur-md bg-white/10">
                <span>{t('view_project')}</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* card body */}
      <div className="p-6 flex-1 flex flex-col relative z-10">
        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
          {t(`items.${project.id}.title`)}
        </h3>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const { t } = useTranslation('portfolio');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filtered = PROJECTS.filter(p => activeFilter === 'all' || p.filter === activeFilter);

  return (
    <div className="flex-1 w-full overflow-hidden">
      <PageMeta title={t('meta.title')} description={t('meta.description')} />

      {/* ── DARK HERO ── */}
      <section className="relative bg-slate-950 overflow-hidden">
        {/* aurora orbs */}
        <div className="absolute top-[-10%] end-[-8%] w-[520px] h-[520px] rounded-full bg-gradient-to-br from-cyan-500/25 via-blue-500/20 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[5%] start-[-6%] w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-violet-500/20 via-fuchsia-500/15 to-transparent blur-[90px] pointer-events-none" />
        <div className="absolute top-[40%] start-[45%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-rose-500/15 to-transparent blur-[80px] pointer-events-none" />
        <FlashFrames />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 text-center">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 bg-white/10 border border-white/15 text-cyan-300 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t('badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-[1.08] mb-6 text-white"
          >
            {t('heading.plain')}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('heading.highlight')}
            </span>
            {t('heading.suffix')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* wave to white */}
        <svg className="w-full -mb-px block" viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 64 C360 0 1080 0 1440 64 L1440 64 L0 64 Z" fill="white" />
        </svg>
      </section>

      {/* ── FILTERED GALLERY ── */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* filter tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-12"
          >
            <div className="relative flex items-center gap-1 bg-slate-100 rounded-2xl p-1.5">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                    activeFilter === f ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {activeFilter === f && (
                    <motion.div
                      layoutId="active-filter"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t(`filters.${f}`)}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* cards grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── DARK CTA ── */}
      <section className="relative bg-white overflow-hidden">
        {/* wave to dark */}
        <svg className="w-full -mb-px block" viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 0 C360 64 1080 64 1440 0 L1440 64 L0 64 Z" fill="rgb(2 6 23)" />
        </svg>

        <div className="relative bg-slate-950 overflow-hidden pb-32 -mt-px">
          {/* orbs */}
          <div className="absolute top-[-20%] start-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-600/15 to-transparent blur-[100px] pointer-events-none" />
          <div className="absolute bottom-[-10%] end-[-5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tl from-cyan-600/20 to-transparent blur-[90px] pointer-events-none" />

          {/* grid backdrop */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.5 }}
              className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4"
            >
              {t('cta.eyebrow')}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-10"
            >
              {t('cta.title_plain')}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                {t('cta.title_highlight')}
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl text-lg hover:bg-slate-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)]"
              >
                {t('cta.button')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
