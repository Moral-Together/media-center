import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AppSplash } from '../components/AppSplash';

vi.mock('../components/Logo', () => ({
  Logo: () => <img alt="" data-testid="mock-logo" />,
}));

describe('AppSplash', () => {
  it('renders loading status when visible', () => {
    render(<AppSplash visible onExitComplete={vi.fn()} />);
    expect(screen.getByRole('status', { name: 'טוען את האתר' })).toBeInTheDocument();
    expect(screen.getByText('טוען…')).toBeInTheDocument();
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
  });

  it('hides after visible becomes false', async () => {
    const onExitComplete = vi.fn();
    const { rerender } = render(
      <AppSplash visible onExitComplete={onExitComplete} />,
    );
    rerender(<AppSplash visible={false} onExitComplete={onExitComplete} />);
    await waitFor(() => {
      expect(screen.queryByRole('status', { name: 'טוען את האתר' })).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(onExitComplete).toHaveBeenCalled();
    });
  });
});
