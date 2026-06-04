import { logoPlayUrl } from './assets';

let preloadPromise: Promise<void> | null = null;

function injectPreloadLink(url: string): void {
  const selector = `link[rel="preload"][href="${url}"]`;
  if (document.head.querySelector(selector)) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  link.setAttribute('fetchpriority', 'high');
  document.head.appendChild(link);
}

/** Start fetching logo_play.png as early as possible (module import or explicit call). */
export function preloadLogoPlay(): Promise<void> {
  if (preloadPromise) return preloadPromise;

  const url = logoPlayUrl();
  injectPreloadLink(url);

  preloadPromise = new Promise((resolve) => {
    const img = new Image();
    img.fetchPriority = 'high';
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });

  return preloadPromise;
}
