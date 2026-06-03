import React, { Fragment } from 'react';
import { motion, useInView } from 'motion/react';
import { Award, Target } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import {
  cardHover,
  cardVariants,
  containerStagger,
  scaleIn,
  sectionVariants,
  slideInLeft,
  slideInRight,
  useAnimatedCounter,
  viewportOnce,
} from '../lib/motion';

const stats = [
  { label: 'לקוחות מרוצים', value: '+120', numeric: 120, prefix: '+' },
  { label: 'פרויקטים שהושלמו', value: '+300', numeric: 300, prefix: '+' },
  { label: 'מומחים בצוות', value: '25', numeric: 25, prefix: '' },
  { label: 'שנות ניסיון', value: '10', numeric: 10, prefix: '' },
];

function AnimatedStat({ stat }: { stat: (typeof stats)[0] }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const display = useAnimatedCounter(stat.numeric, inView);

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      whileHover={cardHover}
      className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-slate-200 transition-shadow cursor-default"
    >
      <motion.span
        variants={scaleIn}
        className="text-4xl font-bold text-slate-900 mb-2 tabular-nums"
      >
        {stat.prefix}{display}
      </motion.span>
      <span className="text-sm font-medium text-slate-500">{stat.label}</span>
    </motion.div>
  );
}

const values = [
  {
    icon: Target,
    title: 'המטרה שלנו',
    desc: 'להוביל את שוק הדיגיטל הישראלי עם פתרונות טכנולוגיים חכמים ומותאמים אישית שמייצרים ערך אמיתי.',
    color: '#2563eb',
    variants: slideInLeft,
  },
  {
    icon: Award,
    title: 'הערכים שלנו',
    desc: 'שקיפות מלאה, חדשנות ללא מעצורים, ומחויבות טוטאלית להצלחת הפרויקטים של הלקוחות שלנו.',
    color: '#7c3aed',
    variants: slideInRight,
  },
];

export default function AboutUs() {
  return (
    <div className="flex-1 w-full relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PageMeta
        title="מי אנחנו"
        description="הכירו את הצוות מאחורי מרכז המדיה של ישראל – מפתחים, מעצבים ואנשי שיווק עם ניסיון של יותר מ-10 שנים בדיגיטל."
      />
      <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        {/* Story text — slides in from left */}
        <motion.div
          className="max-w-2xl"
          variants={slideInLeft}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <motion.div
            variants={scaleIn}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            הסיפור שלנו
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-slate-900">
            מי <span className="text-gradient">אנחנו</span>
          </h1>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            מרכז המדיה של ישראל הוקם במטרה לספק מענה טכנולוגי ודיגיטלי מקיף תחת קורת גג אחת. אנחנו קבוצה של מפתחים, מעצבים, ואנשי שיווק שחיים ונושמים דיגיטל.
          </p>
          <p className="text-lg text-slate-600 leading-relaxed">
            החזון שלנו הוא לחבר בין יצירתיות ואנליטיקה, ולהעניק ללקוחותינו יתרון תחרותי אמיתי בזירה הדיגיטלית. אנחנו מתחייבים לאיכות ללא פשרות, מקצוענות וחדשנות מתמדת.
          </p>
        </motion.div>

        {/* Stats grid with stagger — slides in from right */}
        <motion.div
          className="grid grid-cols-2 gap-4"
          variants={containerStagger}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {stats.map((stat) => (
            <Fragment key={stat.label}>
              <AnimatedStat stat={stat} />
            </Fragment>
          ))}
        </motion.div>
      </div>

      {/* Mission / Values — alternating slide directions */}
      <motion.div
        className="mb-4"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-10">
          מה מניע <span className="text-gradient-tech">אותנו</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {values.map((item) => (
          <motion.div
            key={item.title}
            variants={item.variants}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            whileHover={cardHover}
            className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 hover:shadow-lg hover:border-slate-200 transition-shadow cursor-default"
          >
            <motion.div
              variants={scaleIn}
              className="w-12 h-12 rounded-lg flex items-center justify-center mb-6"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <item.icon className="w-6 h-6" style={{ color: item.color }} />
            </motion.div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
            <p className="text-slate-600 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
