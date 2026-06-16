import React from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Award, Target, User } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import {
  cardVariants,
  containerStagger,
  sectionVariants,
  viewportOnce,
  useAnimatedCounter,
} from '../lib/motion';

const STATS = [
  { labelKey: 'stats.clients',  numeric: 120, prefix: '+', accent: 'from-cyan-300 to-blue-400'    },
  { labelKey: 'stats.projects', numeric: 300, prefix: '+', accent: 'from-violet-300 to-purple-400' },
  { labelKey: 'stats.experts',  numeric: 25,  prefix: '',  accent: 'from-fuchsia-300 to-pink-400'  },
  { labelKey: 'stats.years',    numeric: 10,  prefix: '',  accent: 'from-emerald-300 to-teal-400'  },
] as const;

const TEAM = [
  { roleKey: 'team_roles.ceo',       color: '#2563eb', accent: 'from-cyan-400 to-blue-500'     },
  { roleKey: 'team_roles.design',    color: '#7c3aed', accent: 'from-violet-400 to-purple-500' },
  { roleKey: 'team_roles.dev',       color: '#db2777', accent: 'from-fuchsia-400 to-pink-500'  },
  { roleKey: 'team_roles.marketing', color: '#059669', accent: 'from-emerald-400 to-teal-500'  },
] as const;

const VALUES = [
  {
    key: 'goal',
    icon: Target,
    color: '#2563eb',
    accent: 'from-cyan-400 via-blue-500 to-indigo-500',
    spotColor: 'rgba(6,182,212,0.13)',
  },
  {
    key: 'ethos',
    icon: Award,
    color: '#7c3aed',
    accent: 'from-violet-400 via-purple-500 to-fuchsia-500',
    spotColor: 'rgba(139,92,246,0.13)',
  },
] as const;

const CONSTELLATION_NODES = [
  { x: 12, y: 18 }, { x: 28, y: 62 }, { x: 48, y: 12 },
  { x: 62, y: 48 }, { x: 78, y: 22 }, { x: 22, y: 78 },
  { x: 55, y: 72 }, { x: 72, y: 68 }, { x: 88, y: 45 },
  { x: 8,  y: 52 }, { x: 42, y: 38 }, { x: 68, y: 88 },
];
const CONSTELLATION_EDGES = [[1,5],[1,9],[1,10],[2,10],[3,6],[3,7],[3,10],[4,8],[6,7],[6,11],[7,8],[7,11]];
const NODE_COLORS = ['#22d3ee','#a78bfa','#f472b6','#22d3ee','#a78bfa','#22d3ee','#f472b6','#a78bfa','#22d3ee','#f472b6','#a78bfa','#22d3ee'];

function ConstellationBg() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {CONSTELLATION_EDGES.map(([a, b], i) => (
        <motion.line
          key={`e${i}`}
          x1={CONSTELLATION_NODES[a].x} y1={CONSTELLATION_NODES[a].y}
          x2={CONSTELLATION_NODES[b].x} y2={CONSTELLATION_NODES[b].y}
          stroke="rgba(167,139,250,0.45)"
          strokeWidth="0.25"
          animate={{ opacity: [0.1, 0.55, 0.1] }}
          transition={{ duration: 2.5 + i * 0.45, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
        />
      ))}
      {CONSTELLATION_NODES.map((n, i) => (
        <motion.circle
          key={`n${i}`}
          cx={n.x} cy={n.y}
          fill={NODE_COLORS[i]}
          animate={{ r: [0.7, 1.4, 0.7], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2 + i * 0.28, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
        />
      ))}
    </svg>
  );
}

function BigStat({ stat, index }: { stat: typeof STATS[number]; index: number }) {
  const { t } = useTranslation('about');
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const animated = useAnimatedCounter(stat.numeric, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center justify-center text-center px-6 py-12"
    >
      <div className={`absolute inset-x-6 top-0 h-[2px] rounded-full bg-gradient-to-l ${stat.accent} opacity-40`} />
      <span className={`text-6xl sm:text-7xl xl:text-8xl font-black tabular-nums leading-none bg-gradient-to-b ${stat.accent} bg-clip-text text-transparent mb-4`}>
        {stat.prefix}{animated}
      </span>
      <span className="text-slate-400 text-sm font-medium tracking-wide">{t(stat.labelKey)}</span>
    </motion.div>
  );
}

function ValueCard({ item, index }: { item: typeof VALUES[number]; index: number }) {
  const { t } = useTranslation('about');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [9, -9]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 280, damping: 28 });

  const rawSpotX = useMotionValue(-1000);
  const rawSpotY = useMotionValue(-1000);
  const spotSX = useSpring(rawSpotX, { stiffness: 150, damping: 24 });
  const spotSY = useSpring(rawSpotY, { stiffness: 150, damping: 24 });
  const spotColor = item.spotColor;
  const spotBg = useMotionTemplate`radial-gradient(280px circle at ${spotSX}px ${spotSY}px, ${spotColor}, transparent 80%)`;

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

  const Icon = item.icon;

  return (
    <motion.div
      variants={cardVariants}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, z: 12, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
      className="group relative rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_24px_50px_rgb(0,0,0,0.10)] transition-shadow overflow-hidden flex flex-col cursor-default z-10"
    >
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l ${item.accent} origin-center transition-all duration-300 group-hover:h-[4px]`} />
      <motion.div className="absolute inset-0 pointer-events-none z-[2]" style={{ background: spotBg }} />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-[2rem] pointer-events-none" />
      <div
        className="absolute -bottom-10 -end-10 w-48 h-48 rounded-full opacity-[0.04] group-hover:opacity-[0.12] blur-3xl transition-opacity duration-500 pointer-events-none z-[1]"
        style={{ backgroundColor: item.color }}
      />

      <div className="relative z-[3] flex flex-col h-full p-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div
            className="relative w-16 h-16 rounded-[1.25rem] bg-white ring-1 ring-slate-100 flex items-center justify-center shadow-md"
            style={{ color: item.color }}
          >
            <div className={`absolute inset-[-3px] rounded-[1.4rem] bg-gradient-to-br ${item.accent} opacity-0 group-hover:opacity-100 blur-[2px] -z-10 transition-opacity duration-500`} />
            <Icon strokeWidth={1.8} className="w-7 h-7" />
          </div>
          <span
            className="text-6xl font-black text-slate-100 select-none leading-none tracking-tight translate-y-[-4px] transition-all duration-500 group-hover:text-slate-200/60 group-hover:scale-110"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 className={`text-2xl font-bold text-slate-900 mb-4 transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-l ${item.accent}`}>
          {t(`values.${item.key}.title`)}
        </h3>
        <p className="text-slate-600 text-base leading-relaxed flex-1">
          {t(`values.${item.key}.desc`)}
        </p>
      </div>
    </motion.div>
  );
}

function TeamCard({ member }: { member: typeof TEAM[number] }) {
  const { t } = useTranslation('about');
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 24 } }}
      className="group relative rounded-[2rem] overflow-hidden bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_28px_56px_rgb(0,0,0,0.12)] transition-shadow cursor-default z-10"
    >
      <div className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-l ${member.accent} z-20`} />

      {/* Avatar placeholder */}
      <div
        className="aspect-square flex items-center justify-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${member.color}18, ${member.color}08)` }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle at 50% 60%, ${member.color}22, transparent 70%)` }}
        />
        <User
          className="w-20 h-20 transition-transform duration-500 group-hover:scale-110"
          style={{ color: `${member.color}60` }}
          strokeWidth={1}
        />
      </div>

      <div className="p-6 bg-white/40 flex items-center justify-center">
        <span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: member.color }}
        >
          {t(member.roleKey)}
        </span>
      </div>
    </motion.div>
  );
}

export default function AboutUs() {
  const { t } = useTranslation('about');

  return (
    <div className="flex-1 w-full">
      <PageMeta title={t('meta.title')} description={t('meta.description')} />

      {/* ── 1. DARK HERO ── */}
      <section className="relative min-h-[72vh] flex items-center bg-slate-950 overflow-x-clip">
        <div className="absolute -top-20 end-[15%] w-96 h-96 rounded-full bg-violet-600 blur-[140px] opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 start-[5%] w-72 h-72 rounded-full bg-cyan-500 blur-[110px] opacity-[0.15] pointer-events-none" />
        <div className="absolute bottom-10 end-[35%] w-72 h-72 rounded-full bg-fuchsia-500 blur-[120px] opacity-10 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),' +
              'linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <ConstellationBg />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm"
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
            {t('heading.plain')}
            <span className="text-gradient-tech">{t('heading.highlight')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            {t('meta.description')}
          </motion.p>
        </div>

        <div className="absolute bottom-0 start-0 end-0 leading-[0]" aria-hidden>
          <svg
            viewBox="0 0 1440 60"
            className="w-full h-12 md:h-16 text-white block"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="currentColor" d="M0,60 L1440,60 L1440,20 C1100,58 900,4 720,32 C540,60 300,6 0,38 Z" />
          </svg>
        </div>
      </section>

      {/* ── 2. STORY ── */}
      <section className="relative bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="max-w-3xl relative ps-6"
          >
            <div className="absolute top-1 start-0 bottom-1 w-[3px] rounded-full bg-gradient-to-b from-cyan-400 via-violet-400 to-rose-400" />
            <p className="text-lg text-slate-700 leading-relaxed mb-5">{t('story.p1')}</p>
            <p className="text-lg text-slate-500 leading-relaxed">{t('story.p2')}</p>
          </motion.div>
        </div>
      </section>

      {/* ── 3. DARK STATS STRIP ── */}
      <div className="relative bg-slate-950 leading-[0] -mt-px" aria-hidden>
        <svg
          className="block w-full h-12 md:h-16 text-white"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="currentColor" d="M0,0 L1440,0 L1440,20 C1120,55 920,0 720,30 C520,60 320,5 0,30 Z" />
        </svg>
      </div>

      <section className="relative bg-slate-950 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),' +
              'linear-gradient(to right, rgba(255,255,255,0.032) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
        <div className="absolute -top-24 start-1/4 w-80 h-80 rounded-full bg-cyan-500 blur-[100px] opacity-[0.07] pointer-events-none" />
        <div className="absolute -bottom-24 end-1/4 w-80 h-80 rounded-full bg-violet-500 blur-[100px] opacity-[0.07] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-10 md:mb-14"
          >
            <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-slate-700" />
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500 whitespace-nowrap">
              {t('stats_eyebrow')}
            </span>
            <div className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-slate-700" />
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-0">
            {STATS.map((stat, i) => (
              <BigStat key={stat.labelKey} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="relative bg-slate-950 leading-[0]" aria-hidden>
        <svg
          className="block w-full h-12 md:h-16 text-white"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="currentColor" d="M0,60 L1440,60 L1440,30 C1120,5 920,60 720,30 C520,0 320,55 0,25 Z" />
        </svg>
      </div>

      {/* ── 4. VALUES / MISSION ── */}
      <section className="relative bg-white py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 end-[5%] w-96 h-96 bg-violet-400/[0.06] rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 start-[8%] w-80 h-80 bg-fuchsia-400/[0.06] rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              {t('mission_badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              {t('mission.heading_plain')}<span className="text-gradient-tech">{t('mission.heading_highlight')}</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {VALUES.map((item, i) => (
              <ValueCard key={item.key} item={item} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. TEAM ── */}
      <section className="relative bg-white pb-24 overflow-hidden">
        <div className="absolute bottom-0 start-[10%] w-80 h-80 bg-cyan-400/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-0 end-[5%] w-72 h-72 bg-emerald-400/[0.05] rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mb-14"
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              {t('team_badge')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              {t('team_heading.plain')}<span className="text-gradient-tech">{t('team_heading.highlight')}</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
          >
            {TEAM.map((member, i) => (
              <TeamCard key={i} member={member} />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
