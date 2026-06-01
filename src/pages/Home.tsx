import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Code, Shield, Megaphone } from 'lucide-react';
import { Logo } from '../components/Logo';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="flex-1 w-full relative overflow-hidden">
      {/* Background glow effects & Animated Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Subtle dot grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(#0f172a 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}
        ></div>
        
        {/* Animated Aurora Orbs */}
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
            scale: [1, 1.2, 0.8, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[10%] w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply"
        />
        
        <motion.div
          animate={{
            x: [0, -100, 50, 0],
            y: [0, 50, -50, 0],
            scale: [1, 0.9, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[5%] w-[450px] h-[450px] bg-fuchsia-400/20 rounded-full blur-[120px] mix-blend-multiply"
        />
        
        <motion.div
          animate={{
            x: [0, 50, -100, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-[120px] mix-blend-multiply"
        />

        {/* Floating Glassmorphism Abstract Shapes */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 90, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[15%] left-[15%] w-28 h-28 rounded-[2rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center p-3 opacity-80"
        >
           <div className="w-full h-full rounded-2xl border border-slate-200/50 border-dashed" />
        </motion.div>

        <motion.div
          animate={{ y: [30, -30, 30], rotate: [0, -180, -360] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[55%] right-[12%] w-36 h-36 rounded-full border border-white/60 bg-gradient-to-tr from-white/20 to-white/70 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.08)] opacity-80"
        >
           <div className="absolute inset-2 rounded-full border border-white/40" />
        </motion.div>

        <motion.div
           animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [15, -15, 15] }}
           transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
           className="absolute bottom-[20%] left-[20%] w-24 h-24 bg-white/50 backdrop-blur-md border border-white/60 shadow-xl opacity-70"
           style={{ borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%" }}
        />
        
        <motion.div
          animate={{ y: [-15, 15, -15], x: [-15, 15, -15] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[30%] w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400/20 to-transparent border border-blue-200/50 backdrop-blur-sm rotate-45"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-4 md:pt-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
           className="flex flex-col items-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
             <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
             נוסד בשנת 5785
          </div>
          <Logo className="w-40 h-40 md:w-56 md:h-56 drop-shadow-xl" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 max-w-5xl text-gradient-tech pb-2"
        >
          מרכז המדיה של ישראל
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-600 text-lg leading-relaxed max-w-2xl text-center mb-10"
        >
          פרסום וקידום • מכירות • ייעוץ והכוונה • פיתוח
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/services"
            className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold hover:text-white transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 text-lg relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative z-10 flex items-center gap-2">גלה את השירותים שלנו <ArrowLeft className="w-5 h-5" /></span>
          </Link>
        </motion.div>
      </section>

      {/* Featured Services Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 relative bg-transparent">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-neon opacity-50"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">ההתמחויות שלנו</h2>
            <p className="text-slate-600 max-w-xl">
              אנחנו משלבים טכנולוגיה וקריאייטיב כדי לפתור את האתגרים המורכבים ביותר.
            </p>
          </div>
          <Link to="/services" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold">
            צפה בכל השירותים <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { icon: Code, title: "פיתוח", desc: "שירותי פיתוח וארכיטקטורה, אתרים מתקדמים ואפליקציות מובייל.", colorClass: "text-blue-600", bgClass: "bg-gradient-to-br from-blue-50 to-blue-100/50" },
            { icon: Shield, title: "אבטחת מידע", desc: "ביקורת אבטחת מידע, יצירת חומות אש ובדיקות חדירות לאתרים ומערכות.", colorClass: "text-purple-600", bgClass: "bg-gradient-to-br from-purple-50 to-purple-100/50" },
            { icon: Megaphone, title: "פרסום דיגיטלי", desc: "שיווק איכותי מבוסס ביצועים וקמפיינים עם תוצאות מהירות ואפקטיביות.", colorClass: "text-pink-600", bgClass: "bg-gradient-to-br from-pink-50 to-pink-100/50" },
          ].map((srv, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants} 
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative bg-white/60 backdrop-blur-xl border border-white max-w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-8 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer flex flex-col z-10"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 rounded-[2rem] pointer-events-none" />
               <div className={`relative w-14 h-14 ${srv.bgClass} border border-slate-200/60 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                 <srv.icon strokeWidth={2} className={`w-6 h-6 ${srv.colorClass}`} />
               </div>
               <h3 className="relative text-2xl font-bold text-slate-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">{srv.title}</h3>
               <p className="relative text-slate-600 text-base flex-1 leading-relaxed">{srv.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
