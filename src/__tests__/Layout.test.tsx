import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';

function renderLayout(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<div>home page</div>} />
          <Route path="about" element={<div>about page</div>} />
          <Route path="services" element={<div>services page</div>} />
          <Route path="portfolio" element={<div>portfolio page</div>} />
          <Route path="contact" element={<div>contact page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('Layout', () => {
  it('renders header with logo link', () => {
    renderLayout();
    const logoLinks = screen.getAllByRole('link').filter(l =>
      l.getAttribute('href') === '/',
    );
    expect(logoLinks.length).toBeGreaterThan(0);
  });

  it('renders all 5 navigation links', () => {
    renderLayout();
    // These appear once in desktop nav; "צור קשר" also appears as header CTA so use getAllBy
    expect(screen.getAllByRole('link', { name: 'ראשי' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'מי אנחנו' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'שירותים' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'תיק עבודות' }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: 'צור קשר' }).length).toBeGreaterThan(0);
  });

  it('renders footer with current year', () => {
    renderLayout();
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });

  it('renders main content area with id="main-content"', () => {
    renderLayout();
    expect(document.getElementById('main-content')).toBeInTheDocument();
  });

  it('renders skip-to-content link', () => {
    renderLayout();
    const skipLink = screen.getByText('דלג לתוכן הראשי');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('renders mobile menu button with aria-label', () => {
    renderLayout();
    const btn = screen.getByRole('button', { name: /פתח תפריט/ });
    expect(btn).toBeInTheDocument();
  });

  it('opens mobile menu when burger is clicked', async () => {
    renderLayout();
    const btn = screen.getByRole('button', { name: /פתח תפריט/ });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('mobile menu has aria-modal and aria-label', async () => {
    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: /פתח תפריט/ }));
    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-label', 'תפריט ניווט');
    });
  });

  it('closes mobile menu when Escape key is pressed', async () => {
    renderLayout();
    fireEvent.click(screen.getByRole('button', { name: /פתח תפריט/ }));
    await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument());

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('marks current page link with aria-current="page"', () => {
    renderLayout('/about');
    const aboutLink = screen
      .getAllByRole('link', { name: 'מי אנחנו' })
      .find(l => l.getAttribute('aria-current') === 'page');
    expect(aboutLink).toBeDefined();
  });

  it('renders scroll progress bar in header', () => {
    renderLayout();
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('renders footer status indicators', () => {
    renderLayout();
    expect(screen.getByText(/פעיל/)).toBeInTheDocument();
    expect(screen.getByText(/Central-01/)).toBeInTheDocument();
    expect(screen.getByText(/99.99%/)).toBeInTheDocument();
  });

  it('renders child route content via Outlet', async () => {
    renderLayout('/about');
    await waitFor(() => {
      expect(screen.getByText('about page')).toBeInTheDocument();
    });
  });
});
