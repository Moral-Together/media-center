import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

function Bomb({ explode }: { explode: boolean }) {
  if (explode) throw new Error('test error');
  return <div>safe content</div>;
}

describe('ErrorBoundary', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>healthy content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('healthy content')).toBeInTheDocument();
  });

  it('shows Hebrew error message when child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb explode />
      </ErrorBoundary>,
    );
    expect(screen.getByText('משהו השתבש')).toBeInTheDocument();
    expect(screen.getByText(/אירעה שגיאה/)).toBeInTheDocument();
  });

  it('shows a retry button on error', () => {
    render(
      <ErrorBoundary>
        <Bomb explode />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('button', { name: 'נסה שוב' })).toBeInTheDocument();
  });

  it('logs error to console', () => {
    render(
      <ErrorBoundary>
        <Bomb explode />
      </ErrorBoundary>,
    );
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('[ErrorBoundary]'),
      expect.any(Error),
      expect.anything(),
    );
  });

  it('clears error state when retry button is clicked with non-throwing children', () => {
    let shouldThrow = true;

    function DynamicBomb() {
      if (shouldThrow) throw new Error('test error');
      return <div>safe content</div>;
    }

    render(
      <ErrorBoundary>
        <DynamicBomb />
      </ErrorBoundary>,
    );

    expect(screen.getByText('משהו השתבש')).toBeInTheDocument();

    // Stop throwing before retry so children render successfully
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: 'נסה שוב' }));

    expect(screen.getByText('safe content')).toBeInTheDocument();
  });
});
