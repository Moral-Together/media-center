import React from 'react';
import App from '../App';
import { AppSplash } from './AppSplash';

const MIN_SPLASH_MS = 600;

function logoPlayUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}logo_play.png`.replace(/\/{2,}/g, '/');
}

function waitForWindowLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }
    window.addEventListener('load', () => resolve(), { once: true });
  });
}

function waitForLogoImage(): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = logoPlayUrl();
  });
}

export default function AppShell() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [splashVisible, setSplashVisible] = React.useState(true);

  React.useEffect(() => {
    const min = new Promise<void>((r) => setTimeout(r, MIN_SPLASH_MS));
    Promise.all([min, waitForWindowLoad(), waitForLogoImage()]).then(() => {
      setSplashVisible(false);
    });
  }, []);

  return (
    <>
      {showSplash && (
        <AppSplash
          visible={splashVisible}
          onExitComplete={() => setShowSplash(false)}
        />
      )}
      <App />
    </>
  );
}
