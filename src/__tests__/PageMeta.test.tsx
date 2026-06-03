import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { PageMeta } from '../components/PageMeta';

function renderWithRouter(pathname: string, props: React.ComponentProps<typeof PageMeta>) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="*" element={<PageMeta {...props} />} />
      </Routes>
    </MemoryRouter>,
  );
}

function getMeta(attr: string, value: string): HTMLMetaElement | null {
  return document.querySelector(`meta[${attr}="${value}"]`);
}

describe('PageMeta', () => {
  beforeEach(() => {
    document.title = '';
    document.querySelectorAll('meta[name], meta[property], link[rel="canonical"]').forEach(el =>
      el.remove(),
    );
  });

  it('sets document title as "Page | Site"', () => {
    renderWithRouter('/', { title: 'ראשי', description: 'test desc' });
    expect(document.title).toContain('ראשי');
    expect(document.title).toContain('מרכז המדיה של ישראל');
  });

  it('sets description meta tag', () => {
    renderWithRouter('/', { title: 'Test', description: 'my description' });
    expect(getMeta('name', 'description')?.getAttribute('content')).toBe('my description');
  });

  it('sets og:title', () => {
    renderWithRouter('/', { title: 'שירותים', description: 'd' });
    expect(getMeta('property', 'og:title')?.getAttribute('content')).toContain('שירותים');
  });

  it('sets og:description', () => {
    renderWithRouter('/services', { title: 'שירותים', description: 'service desc' });
    expect(getMeta('property', 'og:description')?.getAttribute('content')).toBe('service desc');
  });

  it('sets og:url to canonical URL', () => {
    renderWithRouter('/about', { title: 'מי אנחנו', description: 'd' });
    const ogUrl = getMeta('property', 'og:url')?.getAttribute('content') ?? '';
    expect(ogUrl).toMatch(/about$/);
  });

  it('sets canonical link to SITE_URL + pathname', () => {
    renderWithRouter('/services', { title: 'T', description: 'd' });
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    expect(canonical?.href).toMatch(/services/);
  });

  it('sets robots to noindex when noIndex=true', () => {
    renderWithRouter('/404', { title: '404', description: 'd', noIndex: true });
    expect(getMeta('name', 'robots')?.getAttribute('content')).toBe('noindex, follow');
  });

  it('sets robots to index by default', () => {
    renderWithRouter('/', { title: 'T', description: 'd' });
    expect(getMeta('name', 'robots')?.getAttribute('content')).toBe('index, follow');
  });

  it('sets twitter:card to summary_large_image', () => {
    renderWithRouter('/', { title: 'T', description: 'd' });
    expect(getMeta('name', 'twitter:card')?.getAttribute('content')).toBe('summary_large_image');
  });

  it('uses custom og:image when provided', () => {
    renderWithRouter('/', { title: 'T', description: 'd', image: 'https://example.com/img.png' });
    expect(getMeta('property', 'og:image')?.getAttribute('content')).toBe(
      'https://example.com/img.png',
    );
  });

  it('updates meta when props change', () => {
    const { rerender } = renderWithRouter('/', { title: 'First', description: 'first desc' });
    expect(document.title).toContain('First');

    rerender(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="*" element={<PageMeta title="Second" description="second desc" />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(document.title).toContain('Second');
  });
});
