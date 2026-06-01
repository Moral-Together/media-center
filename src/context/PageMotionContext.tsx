import { createContext, useContext } from 'react';

/** True inside Layout route transition — child pages should skip their own mount entrance. */
export const PageMotionContext = createContext(false);

export function usePageMotion() {
  return useContext(PageMotionContext);
}

export function usePageEnter<T>(enter: T): false | T {
  const insideRouteTransition = usePageMotion();
  return insideRouteTransition ? false : enter;
}
