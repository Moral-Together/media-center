import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
}

const SITE_NAME = 'מרכז המדיה של ישראל';
const SITE_URL = 'https://media.moraltogether.com';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function PageMeta({ title, description }: PageMetaProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta('name', 'description', description);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', SITE_URL);

    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    return () => {
      document.title = SITE_NAME;
    };
  }, [fullTitle, description]);

  return null;
}
