/**
 * Resolves a public-folder asset path against Vite's BASE_URL.
 *
 * Why this is needed:
 *   Vite's `base` config option is injected at build time for statically-
 *   imported files, but NOT for runtime string literals like `src="/assets/..."`.
 *   This helper reads `import.meta.env.BASE_URL` (set by Vite at build time)
 *   so every public-asset reference is correct in all environments:
 *
 *   | Environment              | base config | BASE_URL  | result for '/assets/a.jpg'  |
 *   |--------------------------|-------------|-----------|------------------------------|
 *   | vite dev server          | './'        | '/'       | '/assets/a.jpg'              |
 *   | dist via VS Code Live Srv| './'        | './'      | './assets/a.jpg'             |
 *   | GitHub Pages             | './'        | './'      | './assets/a.jpg'             |
 *   | npm run preview          | './'        | './'      | './assets/a.jpg'             |
 *
 * Usage:
 *   import { asset } from '@/utils/assetPath';
 *   <img src={asset('/assets/images/foo.jpg')} />
 *
 * @param {string} path - Absolute-from-public-root path, starting with '/'.
 * @returns {string} - Correctly prefixed path for the current environment.
 */
export function asset(path) {
  const base = import.meta.env.BASE_URL; // e.g. '/' in dev, './' in built dist
  // base ends with '/'; path starts with '/' — join cleanly to avoid double slashes
  return `${base.replace(/\/$/, '')}${path}`;
}

