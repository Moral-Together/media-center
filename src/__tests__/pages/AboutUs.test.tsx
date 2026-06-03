import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AboutUs from '../../pages/AboutUs';

function renderAbout() {
  return render(
    <MemoryRouter initialEntries={['/about']}>
      <Routes>
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AboutUs page', () => {
  it('renders h1 with "מי אנחנו"', () => {
    renderAbout();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('מי אנחנו');
  });

  it('renders the story badge', () => {
    renderAbout();
    expect(screen.getByText('הסיפור שלנו')).toBeInTheDocument();
  });

  it('renders company description paragraphs', () => {
    renderAbout();
    expect(screen.getByText(/מרכז המדיה של ישראל הוקם/)).toBeInTheDocument();
    expect(screen.getByText(/החזון שלנו/)).toBeInTheDocument();
  });

  it('renders all 4 animated stat cards', () => {
    renderAbout();
    expect(screen.getByText('לקוחות מרוצים')).toBeInTheDocument();
    expect(screen.getByText('פרויקטים שהושלמו')).toBeInTheDocument();
    expect(screen.getByText('מומחים בצוות')).toBeInTheDocument();
    expect(screen.getByText('שנות ניסיון')).toBeInTheDocument();
  });

  it('renders "מה מניע אותנו" section heading', () => {
    renderAbout();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('מה מניע');
  });

  it('renders mission card', () => {
    renderAbout();
    expect(screen.getByText('המטרה שלנו')).toBeInTheDocument();
    expect(screen.getByText(/להוביל את שוק הדיגיטל/)).toBeInTheDocument();
  });

  it('renders values card', () => {
    renderAbout();
    expect(screen.getByText('הערכים שלנו')).toBeInTheDocument();
    expect(screen.getByText(/שקיפות מלאה/)).toBeInTheDocument();
  });
});
