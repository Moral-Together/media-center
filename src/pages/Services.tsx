import React, { Fragment } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Code, Shield, Megaphone, Search, Video, PenTool } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { cardVariants, containerStagger, sectionVariants, scaleIn, viewportOnce } from '../lib/motion';

const SERVICES = [
  { id: 'dev',      icon: Code,      color: '#2563eb' },
  { id: 'security', icon: Shield,    color: '#7c3aed' },
  { id: 'seo',      icon: Search,    color: '#db2777' },
  { id: 'ads',      icon: Megaphone, color: '#ea580c' },
  { id: 'video',    icon: Video,     color: '#059669' },
  { id: 'content',  icon: PenTool,   color: '#0ea5e9' },
] as const;

type ServiceItem = (typeof SERVICES)[number];

function ServiceCard({ service }: { service: ServiceItem }) {
  const { t } = useTranslation('services');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [9, -9]), {
    stiffness: 280,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 280,
    damping: 28,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const tags = t(`items.${service.id}.tags`, { returnObjects: true }) as string[];

  return (
    <motion.div
      variants={cardVariants}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.03,
        z: 12,
        transition: { type: 'spring', stiffness: 260, damping: 22 },
      }}
      className="group relative rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white max-w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:shadow-[0_24px_50px_rgb(0,0,0,0.10)] transition-shadow overflow-hidden flex flex-col cursor-pointer z-10"
    >
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700 blur-2xl z-0 pointer-events-none"
        style={{ background: service.color }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-[2rem] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          <motion.div
            variants={scaleIn}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ color: service.color, backgroundColor: `${service.color}18` }}
          >
            <service.icon strokeWidth={2} className="w-6 h-6" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
            {t(`items.${service.id}.title`)}
          </h2>
        </div>

        <p className="text-slate-600 text-base mb-8 flex-1 leading-relaxed">
          {t(`items.${service.id}.description`)}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-white/80 border border-slate-200/50 shadow-sm text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { t } = useTranslation('services');

  return (
    <div className="flex-1 w-full relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PageMeta
        title={t('meta.title')}
        description={t('meta.description')}
      />
      <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div
        className="max-w-3xl mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-slate-900">
          {t('heading.prefix')}<br /><span className="text-gradient-tech">{t('heading.highlight')}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
          {t('subtitle')}
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerStagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {SERVICES.map((service) => (
          <Fragment key={service.id}>
            <ServiceCard service={service} />
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
