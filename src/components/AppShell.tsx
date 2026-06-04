import React from 'react';
import App from '../App';
import { AppSplash } from './AppSplash';
import { preloadLogoPlay } from '../lib/preloadLogo';

const MIN_SPLASH_MS = 600;

function waitForWindowLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
      return;
    }
    window.addEventListener('load', () => resolve(), { once: true });
  });
}

export default function AppShell() {
  const [showSplash, setShowSplash] = React.useState(true);
  const [splashVisible, setSplashVisible] = React.useState(true);

  React.useEffect(() => {
    const min = new Promise<void>((r) => setTimeout(r, MIN_SPLASH_MS));
    Promise.all([min, waitForWindowLoad(), preloadLogoPlay()]).then(() => {
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
