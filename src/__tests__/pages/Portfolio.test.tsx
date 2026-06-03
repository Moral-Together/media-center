import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Portfolio from '../../pages/Portfolio';

function renderPortfolio() {
  return render(
    <MemoryRouter initialEntries={['/portfolio']}>
      <Routes>
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Portfolio page', () => {
  it('renders h1 with "תיק העבודות"', () => {
    renderPortfolio();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('תיק');
  });

  it('renders intro paragraph', () => {
    renderPortfolio();
    expect(screen.getByText(/פרויקטים הנבחרים/)).toBeInTheDocument();
  });

  it('renders exactly 6 project cards', () => {
    renderPortfolio();
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(6);
  });

  it('renders E-commerce project card', () => {
    renderPortfolio();
    expect(screen.getByText('E-commerce מתקדם לרשת קמעונאות')).toBeInTheDocument();
  });

  it('renders video campaign card', () => {
    renderPortfolio();
    expect(screen.getByText('קמפיין וידאו - השקת מותג רכב')).toBeInTheDocument();
  });

  it('renders fintech app card', () => {
    renderPortfolio();
    expect(screen.getByText('אפליקציית פינטק לניהול הוצאות')).toBeInTheDocument();
  });

  it('renders security project card', () => {
    renderPortfolio();
    expect(screen.getByText('מערך הגנה ובדיקות חדירות לארגון בריאות')).toBeInTheDocument();
  });

  it('renders SEO project card', () => {
    renderPortfolio();
    expect(screen.getByText('קידום אורגני (SEO) לסטארט-אפ B2B')).toBeInTheDocument();
  });

  it('renders branding project card', () => {
    renderPortfolio();
    expect(screen.getByText('מיתוג ויצירת תוכן חזותי לרשת מסעדות')).toBeInTheDocument();
  });

  it('renders category badges', () => {
    renderPortfolio();
    expect(screen.getByText('פיתוח אתרים')).toBeInTheDocument();
    expect(screen.getByText('הפקת וידאו')).toBeInTheDocument();
    expect(screen.getByText('אבטחת מידע')).toBeInTheDocument();
    expect(screen.getByText('שיווק דיגיטלי')).toBeInTheDocument();
  });

  it('renders project images with alt text', () => {
    renderPortfolio();
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img.getAttribute('alt')).toBeTruthy();
    });
  });

  it('renders "צפה בפרויקט" text in each card', () => {
    renderPortfolio();
    const viewLinks = screen.getAllByText('צפה בפרויקט');
    expect(viewLinks).toHaveLength(6);
  });
});
