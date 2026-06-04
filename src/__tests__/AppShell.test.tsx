import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import AppShell from '../components/AppShell';

vi.mock('../App', () => ({
  default: () => <div data-testid="app-root">app</div>,
}));

vi.mock('../lib/preloadLogo', () => ({
  preloadLogoPlay: () => Promise.resolve(),
}));

vi.mock('../components/AppSplash', () => ({
  AppSplash: ({
    visible,
    onExitComplete,
  }: {
    visible: boolean;
    onExitComplete?: () => void;
  }) => {
    if (!visible) {
      queueMicrotask(() => onExitComplete?.());
      return null;
    }
    return <div role="status" aria-label="טוען את האתר">splash</div>;
  },
}));

const OriginalImage = globalThis.Image;

beforeEach(() => {
  vi.useFakeTimers();
  Object.defineProperty(document, 'readyState', {
    configurable: true,
    value: 'complete',
  });
  globalThis.Image = class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    set src(_value: string) {
      queueMicrotask(() => this.onload?.());
    }
  } as unknown as typeof Image;
});

afterEach(() => {
  vi.useRealTimers();
  globalThis.Image = OriginalImage;
});

describe('AppShell', () => {
  it('shows splash then mounts app after load gates', async () => {
    render(<AppShell />);
    expect(screen.getByRole('status', { name: 'טוען את האתר' })).toBeInTheDocument();
    expect(screen.getByTestId('app-root')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(600);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.queryByRole('status', { name: 'טוען את האתר' })).not.toBeInTheDocument();
  });
});
