import React, { Fragment } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Code, Shield, Megaphone, Search, Video, PenTool } from 'lucide-react';
import { cardVariants, containerStagger, sectionVariants, scaleIn, viewportOnce } from '../lib/motion';

const services = [
  {
    id: 'dev',
    icon: Code,
    title: 'פיתוח אתרים ואפליקציות',
    description: 'אנו בונים מערכות מתקדמות, אפליקציות אינטרנט ואפליקציות מובייל שמותאמות לדרישות ולקהל היעד שלכם.',
    tags: ['React', 'Node.js', 'React Native', 'AWS'],
    color: '#2563eb',
  },
  {
    id: 'security',
    icon: Shield,
    title: 'סייבר ואבטחת מידע',
    description: 'אנו מספקים הגנת נתונים חזקה, כולל בדיקות חדירות וביקורת אבטחה, כחלק בלתי נפרד מפתרונות הרשת שלנו.',
    tags: ['ביקורת אבטחה', 'בדיקת חדירות', 'DevSecOps'],
    color: '#7c3aed',
  },
  {
    id: 'seo',
    icon: Search,
    title: 'קידום אורגני (SEO)',
    description: 'הבאת האתר למקומות הראשונים בגוגל. פיתוח אסטרטגיית תוכן, אופטימיזציה מקצועית וקישורים לשוק המקומי.',
    tags: ['SEO טכני', 'בניית קישורים', 'תנועה אורגנית'],
    color: '#db2777',
  },
  {
    id: 'ads',
    icon: Megaphone,
    title: 'פרסום דיגיטלי (PPC)',
    description: 'ניהול קמפיינים ממומנים בגוגל, פייסבוק, וטיקטוק בשיטת תשלום על פי תוצאות ומקסום החזרי השקעה.',
    tags: ['PPC', 'טרגוט נתונים', 'אנליטיקה'],
    color: '#ea580c',
  },
  {
    id: 'video',
    icon: Video,
    title: 'הפקת וידאו',
    description: 'יצירת סרטוני פרסומת מקצועיים, עריכת וידאו בקצב גבוה ואנימציה בתלת מימד לקמפיינים וערוצים מסחריים.',
    tags: ['צילום', 'עריכה', 'אנימציה', 'YouTube'],
    color: '#059669',
  },
  {
    id: 'content',
    icon: PenTool,
    title: 'יצירת תוכן חזותי לדיגיטל',
    description: 'אנו כותבים טקסטים מכירתיים, יוצרים גרפיקה מקורית, ומנהלים רשתות חברתיות להרחבת המותג ויחסי ציבור.',
    tags: ['SMM', 'קופירייטינג', 'יחסי ציבור'],
    color: '#0ea5e9',
  },
];

type Service = (typeof services)[0];

function ServiceCard({ service }: { service: Service }) {
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
      {/* Colour glow on hover */}
      <div
        className="absolute -inset-1 opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700 blur-2xl z-0 pointer-events-none"
        style={{ background: service.color }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-[2rem] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-6">
          {/* Icon animates with scaleIn — inherits parent variant */}
          <motion.div
            variants={scaleIn}
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
            style={{ color: service.color, backgroundColor: `${service.color}18` }}
          >
            <service.icon strokeWidth={2} className="w-6 h-6" />
          </motion.div>
          <h2 className="text-2xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
            {service.title}
          </h2>
        </div>

        <p className="text-slate-600 text-base mb-8 flex-1 leading-relaxed">
          {service.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {service.tags.map((tag) => (
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
  return (
    <div className="flex-1 w-full relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div
        className="max-w-3xl mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 text-slate-900">
          כל השירותים <br />ב<span className="text-gradient-tech">מקום אחד</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600">
          אנחנו לא סתם חברת קבלן, אנחנו השותף הטכנולוגי שיעזור לעסק שלך לצמוח ולממש את כל פוטנציאל המדיה הדיגיטלי שלו.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerStagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {services.map((service) => (
          <Fragment key={service.id}>
            <ServiceCard service={service} />
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
