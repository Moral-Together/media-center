import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import {
  containerStagger,
  scaleIn,
  sectionVariants,
  slideInLeft,
  slideInRight,
  viewportOnce,
} from '../lib/motion';

export default function Contact() {
  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
      <PageMeta
        title="צור קשר"
        description="צרו קשר עם מרכז המדיה של ישראל. נשמח לשמוע על הפרויקט שלכם ולתכנן יחד את הצעד הבא."
      />
      <motion.div
        className="max-w-2xl w-full"
        variants={containerStagger}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
      >
        <motion.h1
          variants={sectionVariants}
          className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6 text-slate-900"
        >
          מוכנים להתחיל <span className="text-gradient-tech">פרויקט</span>?
        </motion.h1>

        <motion.p variants={sectionVariants} className="text-slate-600 text-lg mb-12">
          השאירו פרטים ונחזור אליכם בהקדם האפשרי לתכנון והמשך תהליך.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-12 text-slate-600 mb-14">
          {/* Email — slides from left */}
          <motion.div variants={slideInLeft} className="flex items-center gap-4">
            <motion.div
              variants={scaleIn}
              className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm"
            >
              <Mail className="w-6 h-6" />
            </motion.div>
            <div className="text-start">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-0.5">דוא״ל</p>
              <a
                href="mailto:hello@nexgen.dev"
                className="text-slate-700 font-medium hover:text-blue-600 transition-colors"
              >
                hello@nexgen.dev
              </a>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={sectionVariants}
            className="hidden sm:block w-px h-10 bg-slate-200"
          />

          {/* Phone — slides from right */}
          <motion.div variants={slideInRight} className="flex items-center gap-4">
            <motion.div
              variants={scaleIn}
              className="w-14 h-14 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm"
            >
              <Phone className="w-6 h-6" />
            </motion.div>
            <div className="text-start">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-0.5">טלפון</p>
              <a
                href="tel:+972500000000"
                className="text-slate-700 font-medium hover:text-purple-600 transition-colors"
              >
                050 000 0000
              </a>
            </div>
          </motion.div>
        </div>

        {/* CTA button with pulsing glow */}
        <motion.div variants={sectionVariants}>
          <motion.a
            href="mailto:hello@nexgen.dev"
            className="inline-block px-12 py-4 bg-slate-900 text-white rounded-full font-bold text-lg relative overflow-hidden group btn-shimmer"
            whileHover={{ scale: 1.06, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 0 0 0px rgba(37, 99, 235, 0)',
                '0 0 0 14px rgba(37, 99, 235, 0.12)',
                '0 0 0 0px rgba(37, 99, 235, 0)',
              ],
            }}
            transition={{
              boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 },
            }}
          >
            <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">שלח הודעה</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
}
