import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { PageMeta } from '../components/PageMeta';
import { sectionVariants } from '../lib/motion';

export default function NotFound() {
  const { t } = useTranslation('common');

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
      <PageMeta title="404" description={t('not_found.description')} noIndex />

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="show"
        className="max-w-lg flex flex-col items-center"
      >
        <p className="text-[8rem] font-bold leading-none text-gradient-tech mb-4 select-none">
          404
        </p>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('not_found.heading')}</h1>
        <p className="text-slate-600 mb-10 text-lg">
          {t('not_found.subtitle')}
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold transition-all shadow-xl shadow-blue-500/20 inline-flex items-center gap-2 hover:opacity-90"
        >
          {t('not_found.back_home')}
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  );
}
