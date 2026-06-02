import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

function setCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function PageMeta({ title, description }: PageMetaProps) {
  const { pathname } = useLocation();
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${pathname}`;

  useEffect(() => {
    document.title = fullTitle;

    setMeta('name', 'description', description);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonical);

    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);

    setCanonical(canonical);

    return () => {
      document.title = SITE_NAME;
    };
  }, [fullTitle, description, canonical]);

  return null;
}
