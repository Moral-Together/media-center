import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Contact from '../../pages/Contact';

function renderContact() {
  return render(
    <MemoryRouter initialEntries={['/contact']}>
      <Routes>
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Contact page', () => {
  it('renders h1 with contact heading', () => {
    renderContact();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('מוכנים להתחיל');
  });

  it('renders email contact info', () => {
    renderContact();
    const emailLink = screen.getByRole('link', { name: /hello@nexgen\.dev/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:hello@nexgen.dev');
  });

  it('renders phone contact info', () => {
    renderContact();
    const phoneLink = screen.getByRole('link', { name: /050/ });
    expect(phoneLink).toHaveAttribute('href', 'tel:+972500000000');
  });

  it('renders "שלח הודעה" CTA button as mailto link', () => {
    renderContact();
    const cta = screen.getByRole('link', { name: 'שלח הודעה' });
    expect(cta).toHaveAttribute('href', 'mailto:hello@nexgen.dev');
  });

  it('renders the email label', () => {
    renderContact();
    expect(screen.getByText('דוא״ל')).toBeInTheDocument();
  });

  it('renders the phone label', () => {
    renderContact();
    expect(screen.getByText('טלפון')).toBeInTheDocument();
  });

  it('renders the subtitle paragraph', () => {
    renderContact();
    expect(screen.getByText(/השאירו פרטים/)).toBeInTheDocument();
  });
});
