import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Services from '../../pages/Services';

function renderServices() {
  return render(
    <MemoryRouter initialEntries={['/services']}>
      <Routes>
        <Route path="/services" element={<Services />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Services page', () => {
  it('renders h1 with "כל השירותים"', () => {
    renderServices();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('כל השירותים');
  });

  it('renders exactly 6 service cards', () => {
    renderServices();
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings).toHaveLength(6);
  });

  it('renders web development service', () => {
    renderServices();
    expect(screen.getByText('פיתוח אתרים ואפליקציות')).toBeInTheDocument();
    // "React" and "React Native" are both tags — check for exact standalone tag
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('renders cybersecurity service', () => {
    renderServices();
    expect(screen.getByText('סייבר ואבטחת מידע')).toBeInTheDocument();
    expect(screen.getByText('DevSecOps')).toBeInTheDocument();
  });

  it('renders SEO service', () => {
    renderServices();
    expect(screen.getByText('קידום אורגני (SEO)')).toBeInTheDocument();
    expect(screen.getByText(/תנועה אורגנית/)).toBeInTheDocument();
  });

  it('renders PPC ads service', () => {
    renderServices();
    expect(screen.getByText('פרסום דיגיטלי (PPC)')).toBeInTheDocument();
    expect(screen.getByText('PPC')).toBeInTheDocument();
  });

  it('renders video production service', () => {
    renderServices();
    expect(screen.getByText('הפקת וידאו')).toBeInTheDocument();
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  it('renders content creation service', () => {
    renderServices();
    expect(screen.getByText('יצירת תוכן חזותי לדיגיטל')).toBeInTheDocument();
    expect(screen.getByText('קופירייטינג')).toBeInTheDocument();
  });

  it('renders all tech tags as spans', () => {
    renderServices();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('AWS')).toBeInTheDocument();
    expect(screen.getByText('SMM')).toBeInTheDocument();
  });

  it('renders intro paragraph', () => {
    renderServices();
    expect(screen.getByText(/השותף הטכנולוגי/)).toBeInTheDocument();
  });
});
