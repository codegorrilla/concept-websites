/**
 * Resolves a public-folder asset path against Vite's BASE_URL.
 *
 * Why this is needed:
 *   Vite's `base` config option (e.g. '/tea-concept-2/') is injected into
 *   statically-imported files at build time, but NOT into runtime string
 *   literals like `src="/assets/images/foo.jpg"`.
 *   This helper ensures every public-asset reference is correctly prefixed
 *   in both development (base = '/') and production (base = '/tea-concept-2/').
 *
 * Usage:
 *   import { asset } from '@/utils/assetPath';
 *   <img src={asset('/assets/images/foo.jpg')} />
 *
 * @param {string} path - Absolute path from the public root, starting with '/'.
 * @returns {string} - Path correctly prefixed with BASE_URL.
 */
export function asset(path) {
  // import.meta.env.BASE_URL is always set by Vite (defaults to '/' in dev)
  const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // strip trailing slash
  return `${base}${path}`;
}
