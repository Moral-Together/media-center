import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  SITE_URL,
} from '../lib/seo';

interface PageMetaProps {
  title: string;
  description: string;
  image?: string;
  noIndex?: boolean;
}

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

function setHreflang(lang: string, href: string) {
  const selector = `link[rel="alternate"][hreflang="${lang}"]`;
  let el = document.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', lang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, data: object) {
  let el = document.querySelector<HTMLScriptElement>(`script[data-ld="${id}"]`);
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-ld', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function PageMeta({ title, description, image, noIndex = false }: PageMetaProps) {
  const { pathname } = useLocation();
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const robots = noIndex ? 'noindex, follow' : 'index, follow';

  useEffect(() => {
    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:locale', 'he_IL');
    setMeta('property', 'og:image', ogImage);
    setMeta('property', 'og:image:secure_url', ogImage);
    setMeta('property', 'og:image:alt', OG_IMAGE_ALT);
    setMeta('property', 'og:image:width', String(OG_IMAGE_WIDTH));
    setMeta('property', 'og:image:height', String(OG_IMAGE_HEIGHT));

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    setCanonical(canonical);

    // hreflang for Hebrew and x-default
    setHreflang('he', canonical);
    setHreflang('x-default', `${SITE_URL}/`);

    // WebPage structured data
    if (!noIndex) {
      setJsonLd('webpage', {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: fullTitle,
        description,
        url: canonical,
        inLanguage: 'he',
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
        },
      });
    }
  }, [fullTitle, description, canonical, ogImage, robots, noIndex]);

  return null;
}
