import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../pages/Home';

function renderHome() {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>,
  );
}

describe('Home page', () => {
  it('renders the hero logo image with alt text', () => {
    renderHome();
    const logoImg = screen.getByAltText('מרכז המדיה של ישראל');
    expect(logoImg).toBeInTheDocument();
  });

  it('renders the primary CTA link to /services', () => {
    renderHome();
    const cta = screen.getByRole('link', { name: /גלה את השירותים/i });
    expect(cta).toHaveAttribute('href', '/services');
  });

  it('renders the secondary CTA link to /contact', () => {
    renderHome();
    const ctaLinks = screen.getAllByRole('link', { name: /צור קשר/i });
    const contactLinks = ctaLinks.filter(l => l.getAttribute('href') === '/contact');
    expect(contactLinks.length).toBeGreaterThan(0);
  });

  it('renders all 4 stat counters', () => {
    renderHome();
    expect(screen.getByText('לקוחות מרוצים')).toBeInTheDocument();
    expect(screen.getByText('פרויקטים')).toBeInTheDocument();
    expect(screen.getByText('מומחים')).toBeInTheDocument();
    expect(screen.getByText('שנות ניסיון')).toBeInTheDocument();
  });

  it('renders service preview section heading', () => {
    renderHome();
    expect(screen.getByText('ההתמחויות שלנו')).toBeInTheDocument();
  });

  it('renders 3 service preview cards with links to /services', () => {
    renderHome();
    const serviceLinks = screen
      .getAllByRole('link')
      .filter(l => l.getAttribute('href') === '/services');
    expect(serviceLinks.length).toBeGreaterThanOrEqual(3);
  });

  it('renders development service card', () => {
    renderHome();
    expect(screen.getByText('פיתוח')).toBeInTheDocument();
  });

  it('renders security service card', () => {
    renderHome();
    expect(screen.getByText('אבטחת מידע')).toBeInTheDocument();
  });

  it('renders digital marketing service card', () => {
    renderHome();
    expect(screen.getByText('פרסום דיגיטלי')).toBeInTheDocument();
  });

  it('renders "view all services" link', () => {
    renderHome();
    expect(screen.getByText('צפה בכל השירותים')).toBeInTheDocument();
  });

  it('renders the cycling service text container', () => {
    renderHome();
    expect(screen.getByText('אנחנו מתמחים ב')).toBeInTheDocument();
  });
});
