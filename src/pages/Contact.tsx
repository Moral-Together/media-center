import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Clock, Instagram, Facebook, Linkedin, Send, CheckCircle2 } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { viewportOnce } from '../lib/motion';

function RadioWaves() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
      {[0, 1, 2, 3, 4].map(i => (
        <motion.circle
          key={i}
          cx="50" cy="50"
          fill="none"
          stroke="rgba(34,211,238,0.25)"
          strokeWidth="0.3"
          animate={{ r: [3, 62], opacity: [0.7, 0] }}
          transition={{ duration: 5, delay: i * 1, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
      <motion.circle
        cx="50" cy="50"
        fill="rgba(34,211,238,0.5)"
        animate={{ r: [1.2, 2.2, 1.2], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}

function FormField({
  label,
  id,
  children,
  delay = 0,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.45, delay }}
      className="flex flex-col gap-1.5"
    >
      <label htmlFor={id} className="text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </motion.div>
  );
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-300';

export default function Contact() {
  const { t } = useTranslation('contact');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 1200);
  }

  const infoCards = [
    {
      icon: Mail,
      label: t('info.email_label'),
      value: t('info.email_val'),
      href: `mailto:${t('info.email_val')}`,
      color: '#2563eb',
      accent: 'from-cyan-400 to-blue-500',
    },
    {
      icon: Phone,
      label: t('info.phone_label'),
      value: t('info.phone_val'),
      href: `tel:${t('info.phone_val').replace(/\s/g, '')}`,
      color: '#7c3aed',
      accent: 'from-violet-400 to-purple-500',
    },
    {
      icon: Clock,
      label: t('info.hours_label'),
      value: t('info.hours_val'),
      href: null,
      color: '#059669',
      accent: 'from-emerald-400 to-teal-500',
    },
  ] as const;

  const socials = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook,  href: '#', label: 'Facebook'  },
    { icon: Linkedin,  href: '#', label: 'LinkedIn'  },
  ] as const;

  return (
    <div className="flex-1 w-full overflow-hidden">
      <PageMeta title={t('meta.title')} description={t('meta.description')} />

      {/* ── DARK HERO ── */}
      <section className="relative bg-slate-950 overflow-hidden">
        <div className="absolute top-[-10%] end-[-8%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/25 via-blue-500/20 to-transparent blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[5%] start-[-6%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-violet-500/20 via-fuchsia-500/15 to-transparent blur-[90px] pointer-events-none" />
        <div className="absolute top-[35%] start-[40%] w-[280px] h-[280px] rounded-full bg-gradient-to-br from-rose-500/12 to-transparent blur-[80px] pointer-events-none" />
        <RadioWaves />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 bg-white/10 border border-white/15 text-cyan-300 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t('badge')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-[1.08] mb-6 text-white"
          >
            {t('heading.plain')}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              {t('heading.highlight')}
            </span>
            {t('heading.suffix')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <svg className="w-full -mb-px block" viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 64 C360 0 1080 0 1440 64 L1440 64 L0 64 Z" fill="white" />
        </svg>
      </section>

      {/* ── SPLIT CONTENT ── */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14 items-start">

            {/* ── FORM (2/3) ── */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.55 }}
                className="bg-white/60 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_48px_rgba(0,0,0,0.06)] p-8 md:p-10"
              >
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 260, damping: 22 }}
                    className="flex flex-col items-center justify-center py-16 text-center gap-5"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-xl font-bold text-slate-900 max-w-xs leading-snug">
                      {t('form.success')}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label={t('form.name')} id="name" delay={0.05}>
                        <input id="name" type="text" placeholder={t('form.name_ph')} required className={inputClass} />
                      </FormField>
                      <FormField label={t('form.email')} id="email" delay={0.1}>
                        <input id="email" type="email" placeholder={t('form.email_ph')} required className={inputClass} />
                      </FormField>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField label={t('form.phone')} id="phone" delay={0.15}>
                        <input id="phone" type="tel" placeholder={t('form.phone_ph')} className={inputClass} />
                      </FormField>
                      <FormField label={t('form.subject')} id="subject" delay={0.2}>
                        <input id="subject" type="text" placeholder={t('form.subject_ph')} className={inputClass} />
                      </FormField>
                    </div>
                    <FormField label={t('form.message')} id="message" delay={0.25}>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder={t('form.message_ph')}
                        required
                        className={`${inputClass} resize-none`}
                      />
                    </FormField>

                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={viewportOnce}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <motion.button
                        type="submit"
                        disabled={sending}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        animate={{
                          boxShadow: sending ? 'none' : [
                            '0 0 0 0px rgba(37,99,235,0)',
                            '0 0 0 14px rgba(37,99,235,0.12)',
                            '0 0 0 0px rgba(37,99,235,0)',
                          ],
                        }}
                        transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.4 } }}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold px-10 py-4 rounded-2xl text-base transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        {sending ? t('form.submitting') : t('form.submit')}
                      </motion.button>
                    </motion.div>
                  </form>
                )}
              </motion.div>
            </div>

            {/* ── INFO SIDEBAR (1/3) ── */}
            <div className="flex flex-col gap-5">

              {/* info cards */}
              {infoCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5 flex items-center gap-4"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center shadow-md`}
                  >
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-0.5">
                      {card.label}
                    </p>
                    {card.href ? (
                      <a
                        href={card.href}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors truncate block"
                        style={{ color: card.color }}
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-slate-900">{card.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* social */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.45, delay: 0.35 }}
                className="bg-white/60 backdrop-blur-xl border border-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] p-5"
              >
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                  {t('social_label')}
                </p>
                <div className="flex items-center gap-3">
                  {socials.map((s) => (
                    <motion.a
                      key={s.label}
                      href={s.href}
                      aria-label={s.label}
                      whileHover={{ scale: 1.12, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-gradient-to-br hover:from-blue-500 hover:to-violet-500 flex items-center justify-center text-slate-600 hover:text-white transition-all duration-200 shadow-sm"
                    >
                      <s.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
