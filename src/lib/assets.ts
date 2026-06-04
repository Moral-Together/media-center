/** Public asset URL respecting Vite base (GitHub Pages subpaths). */
export function logoPlayUrl(): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}logo_play.png`.replace(/\/{2,}/g, '/');
}
