import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { useSkipRouteEnter } from '../context/PageMotionContext';
import { cardHover, sectionRevealProps } from '../lib/motion';

export default function Contact() {
  const skipRouteEnter = useSkipRouteEnter();

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
      <motion.div {...sectionRevealProps(skipRouteEnter)} className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-slate-900">מוכנים להתחיל <span className="text-gradient-tech">פרויקט</span>?</h1>
        <p className="text-slate-600 text-lg mb-12">השאירו פרטים ונחזור אליכם בהקדם האפשרי לתכנון והמשך תהליך.</p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 text-slate-600">
          <motion.div initial={false} whileHover={cardHover} className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600"><Mail /></div>
             <div className="text-start"><p className="text-xs text-slate-400 uppercase tracking-widest font-bold">דוא״ל</p><a href="mailto:hello@nexgen.dev" className="hover:text-slate-900 transition-colors">hello@nexgen.dev</a></div>
          </motion.div>
          <motion.div initial={false} whileHover={cardHover} className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><Phone /></div>
             <div className="text-start"><p className="text-xs text-slate-400 uppercase tracking-widest font-bold">טלפון</p><a href="tel:+972500000000" className="hover:text-slate-900 transition-colors">050 000 0000</a></div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
