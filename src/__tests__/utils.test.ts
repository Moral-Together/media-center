import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils';

describe('cn()', () => {
  it('returns empty string with no args', () => {
    expect(cn()).toBe('');
  });

  it('merges two class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('filters out falsy values', () => {
    expect(cn('a', false, undefined, null, 0 as never, 'b')).toBe('a b');
  });

  it('resolves tailwind conflicts — last wins', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('handles conditional classes via object syntax', () => {
    expect(cn({ 'text-red-500': true, 'text-blue-500': false })).toBe('text-red-500');
  });

  it('handles array syntax', () => {
    expect(cn(['a', 'b'])).toBe('a b');
  });

  it('merges responsive variants correctly', () => {
    const result = cn('md:flex', 'md:hidden');
    expect(result).toBe('md:hidden');
  });
});
