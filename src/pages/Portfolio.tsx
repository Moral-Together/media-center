import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { usePageEnter } from '../context/PageMotionContext';
import { cardHover, cardVariants, sectionVariants, viewportOnce } from '../lib/motion';

const projects = [
  {
    id: 1,
    title: 'E-commerce מתקדם לרשת קמעונאות',
    category: 'פיתוח אתרים',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#2563eb' // Blue
  },
  {
    id: 2,
    title: 'קמפיין וידאו - השקת מותג רכב',
    category: 'הפקת וידאו',
    image: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#7c3aed' // Purple
  },
  {
    id: 3,
    title: 'אפליקציית פינטק לניהול הוצאות',
    category: 'פיתוח מובייל',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#db2777' // Pink
  },
  {
    id: 4,
    title: 'מערך הגנה ובדיקות חדירות לארגון בריאות',
    category: 'אבטחת מידע',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#ea580c' // Orange
  },
  {
    id: 5,
    title: 'קידום אורגני (SEO) לסטארט-אפ B2B',
    category: 'שיווק דיגיטלי',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#059669' // Emerald
  },
  {
    id: 6,
    title: 'מיתוג ויצירת תוכן חזותי לרשת מסעדות',
    category: 'עיצוב ותוכן',
    image: 'https://images.unsplash.com/photo-1583338917451-face2751d8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    color: '#0ea5e9' // Sky
  }
];

export default function Portfolio() {
  const pageEnter = usePageEnter('hidden');

  return (
    <div className="flex-1 w-full relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] -z-10 mix-blend-multiply pointer-events-none"></div>

      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.h1 
          variants={sectionVariants}
          initial={pageEnter}
          animate="show"
          className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-slate-900"
        >
          תיק <span className="text-gradient-tech">העבודות</span> שלנו
        </motion.h1>
        <motion.p 
          variants={sectionVariants}
          initial={pageEnter}
          animate="show"
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600"
        >
          הצצה לפרויקטים הנבחרים שהובלנו. מפתרונות תוכנה מורכבים ועד לקמפיינים שיווקיים יצירתיים.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            variants={cardVariants}
            initial={pageEnter}
            whileInView="show"
            whileHover={cardHover}
            viewport={viewportOnce}
            transition={{ delay: index * 0.08 }}
            className="group relative rounded-[2rem] overflow-hidden bg-white/60 backdrop-blur-xl border border-white max-w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all cursor-pointer flex flex-col z-10"
          >
            {/* Project Image */}
            <div className="aspect-[4/3] overflow-hidden relative rounded-t-[2rem]">
              <div className="absolute inset-0 bg-transparent group-hover:bg-slate-900/10 transition-colors z-10 duration-500"></div>
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Gradient for readability of tags if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-20">
                <span 
                  className="px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm backdrop-blur-md bg-opacity-80"
                  style={{ backgroundColor: project.color }}
                >
                  {project.category}
                </span>
              </div>
            </div>

            {/* Project Content */}
            <div className="p-6 bg-white/40 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">{project.title}</h3>
              <div className="mt-auto pt-4 flex items-center gap-2 text-sm text-slate-600 font-medium group-hover:text-blue-600 transition-colors duration-300">
                <span>צפה בפרויקט</span>
                <ExternalLink className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
