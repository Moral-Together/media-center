import React from 'react';
import i18n from '../i18n';

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const t = (key: string) => i18n.t(key, { ns: 'common' });
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <p className="text-6xl mb-6 select-none">⚠️</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('error.heading')}</h2>
          <p className="text-slate-600 mb-8">{t('error.subtitle')}</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 bg-slate-900 text-white rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            {t('error.retry')}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
