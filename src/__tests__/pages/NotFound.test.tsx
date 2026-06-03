import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NotFound from '../../pages/NotFound';

function renderNotFound() {
  return render(
    <MemoryRouter initialEntries={['/totally-unknown']}>
      <Routes>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('NotFound page', () => {
  it('renders large "404" text', () => {
    renderNotFound();
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders h1 "הדף לא נמצא"', () => {
    renderNotFound();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('הדף לא נמצא');
  });

  it('renders descriptive message', () => {
    renderNotFound();
    expect(screen.getByText(/הדף שחיפשת לא קיים/)).toBeInTheDocument();
  });

  it('renders a link back to home page', () => {
    renderNotFound();
    const homeLink = screen.getByRole('link', { name: /חזרה לדף הראשי/ });
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('sets noIndex meta (robots = noindex)', () => {
    renderNotFound();
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toBe('noindex, follow');
  });
});
