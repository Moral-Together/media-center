import React from 'react';
import { motion } from 'motion/react';
import { Award, Target } from 'lucide-react';
import { cardHover, cardVariants, containerStagger, sectionVariants, viewportOnce } from '../lib/motion';

export default function AboutUs() {
  const stats = [
    { label: 'לקוחות מרוצים', value: '+120' },
    { label: 'פרויקטים שהושלמו', value: '+300' },
    { label: 'מומחים בצוות', value: '25' },
    { label: 'שנות ניסיון', value: '10' },
  ];

  return (
    <div className="flex-1 w-full relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10 mix-blend-multiply pointer-events-none"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
             <span className="w-2 h-2 rounded-full bg-blue-600"></span>
             הסיפור שלנו
          </div>
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
        
        <motion.div 
           variants={containerStagger}
           initial="hidden"
           animate="show"
           className="grid grid-cols-2 gap-4"
        >
           {stats.map((stat, idx) => (
             <motion.div key={idx} variants={cardVariants} whileHover={cardHover} className="bg-white border border-slate-100 shadow-sm rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:shadow-md hover:border-slate-200 transition-all">
               <span className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</span>
               <span className="text-sm font-medium text-slate-500">{stat.label}</span>
             </motion.div>
           ))}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: Target, title: 'המטרה שלנו', desc: 'להוביל את שוק הדיגיטל הישראלי עם פתרונות טכנולוגיים חכמים ומותאמים אישית שמייצרים ערך אמיתי.', color: '#2563eb' },
          { icon: Award, title: 'הערכים שלנו', desc: 'שקיפות מלאה, חדשנות ללא מעצורים, ומחויבות טוטאלית להצלחת הפרויקטים של הלקוחות שלנו.', color: '#7c3aed' },
        ].map((item, i) => (
           <motion.div 
             key={i}
            variants={cardVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            transition={{ delay: i * 0.08 }}
            whileHover={cardHover}
             className="bg-white border border-slate-100 shadow-sm rounded-2xl p-8 hover:shadow-lg hover:border-slate-200 transition-all cursor-default"
           >
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}20` }}>
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
           </motion.div>
        ))}
      </div>
    </div>
  );
}
