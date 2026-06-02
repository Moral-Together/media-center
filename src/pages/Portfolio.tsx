import React, { Fragment } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { cardVariants, containerStagger, sectionVariants, scaleIn, viewportOnce } from '../lib/motion';

const projects = [
  {
    id: 1,
    title: 'E-commerce מתקדם לרשת קמעונאות',
    category: 'פיתוח אתרים',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#2563eb',
  },
  {
    id: 2,
    title: 'קמפיין וידאו - השקת מותג רכב',
    category: 'הפקת וידאו',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#7c3aed',
  },
  {
    id: 3,
    title: 'אפליקציית פינטק לניהול הוצאות',
    category: 'פיתוח מובייל',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#db2777',
  },
  {
    id: 4,
    title: 'מערך הגנה ובדיקות חדירות לארגון בריאות',
    category: 'אבטחת מידע',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#ea580c',
  },
  {
    id: 5,
    title: 'קידום אורגני (SEO) לסטארט-אפ B2B',
    category: 'שיווק דיגיטלי',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#059669',
  },
  {
    id: 6,
    title: 'מיתוג ויצירת תוכן חזותי לרשת מסעדות',
    category: 'עיצוב ותוכן',
    image: 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#0ea5e9',
  },
];

type Project = (typeof projects)[0];

function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        y: -8,
        transition: { type: 'spring', stiffness: 300, damping: 24 },
      }}
      className="group relative rounded-[2rem] overflow-hidden bg-white/60 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_28px_56px_rgb(0,0,0,0.12)] transition-shadow cursor-pointer flex flex-col z-10"
    >
      {/* Image area */}
      <div className="aspect-[4/3] overflow-hidden relative rounded-t-[2rem]">
        <motion.img
          src={project.image}
          alt={project.title}
          animate={{ scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' fill='%23f1f5f9'%3E%3Crect width='800' height='600'/%3E%3C/svg%3E";
          }}
        />

        {/* Hover overlay via AnimatePresence */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 z-10"
              style={{ background: `${project.color}22` }}
            />
          )}
        </AnimatePresence>

        {/* Always-visible gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10 opacity-60" />

        {/* Category badge — scaleIn via parent variant */}
        <motion.div variants={scaleIn} className="absolute top-4 right-4 z-20">
          <span
            className="px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm backdrop-blur-md"
            style={{ backgroundColor: project.color }}
          >
            {project.category}
          </span>
        </motion.div>
      </div>

      {/* Content area */}
      <div className="p-6 bg-white/40 flex-1 flex flex-col">
        <motion.h3
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
        >
          {project.title}
        </motion.h3>

        <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-slate-600 font-medium group-hover:text-blue-600 transition-colors duration-300">
          <span>צפה בפרויקט</span>
          <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  return (
    <div className="flex-1 w-full relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <PageMeta
        title="תיק עבודות"
        description="פרויקטים נבחרים של מרכז המדיה של ישראל – מפתרונות תוכנה מורכבים ועד קמפיינים שיווקיים יצירתיים."
      />
      <div className="absolute top-[20%] right-[20%] w-72 h-72 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div
        className="text-center max-w-3xl mx-auto mb-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-slate-900">
          תיק <span className="text-gradient-tech">העבודות</span> שלנו
        </h1>
        <p className="text-lg text-slate-600">
          הצצה לפרויקטים הנבחרים שהובלנו. מפתרונות תוכנה מורכבים ועד לקמפיינים שיווקיים יצירתיים.
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerStagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        {projects.map((project) => (
          <Fragment key={project.id}>
            <ProjectCard project={project} />
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
