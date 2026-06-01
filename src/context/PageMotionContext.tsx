import { createContext, useContext } from 'react';

/**
 * True after the user navigates between routes (not on the very first page load).
 * Child pages skip mount/whileInView entrances so only the Layout crossfade runs.
 */
export const PageMotionContext = createContext(false);

export function useSkipRouteEnter() {
  return useContext(PageMotionContext);
}
