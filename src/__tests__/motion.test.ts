import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnimatedCounter } from '../lib/motion';

// Mock motion's animate so tests don't depend on requestAnimationFrame timing.
// The mock immediately sets the MotionValue to target, making assertions deterministic.
vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return {
    ...actual,
    animate: vi.fn(
      (
        motionValue: { set: (v: number) => void },
        target: number,
      ) => {
        motionValue.set(target);
        return { stop: vi.fn() };
      },
    ),
  };
});

describe('useAnimatedCounter()', () => {
  it('returns 0 when not in view', () => {
    const { result } = renderHook(() => useAnimatedCounter(100, false));
    expect(result.current).toBe(0);
  });

  it('immediately reaches target when inView=true (mocked animation)', async () => {
    const { result } = renderHook(() => useAnimatedCounter(42, true));

    await act(async () => {});

    expect(result.current).toBe(42);
  });

  it('stays at 0 while inView=false regardless of time', () => {
    const { result } = renderHook(() => useAnimatedCounter(99, false));
    expect(result.current).toBe(0);
  });

  it('starts animation when inView transitions false → true', async () => {
    const { result, rerender } = renderHook(
      ({ inView }: { inView: boolean }) => useAnimatedCounter(50, inView),
      { initialProps: { inView: false } },
    );

    expect(result.current).toBe(0);

    await act(async () => {
      rerender({ inView: true });
    });

    expect(result.current).toBe(50);
  });

  it('does not re-animate when target and inView are unchanged', async () => {
    const { result, rerender } = renderHook(
      ({ target }: { target: number }) => useAnimatedCounter(target, true),
      { initialProps: { target: 10 } },
    );

    await act(async () => {});
    expect(result.current).toBe(10);

    await act(async () => {
      rerender({ target: 10 });
    });

    expect(result.current).toBe(10);
  });
});
