// Scroll Progress Map — AGENTS.md §4
// Each act maps its global scroll range [start, end] in normalized [0,1] coordinates

export const SCROLL_MAP = {
  hero:     { start: 0.00, end: 0.10, label: 'ACT I',    name: 'Hero'    },
  origin:   { start: 0.10, end: 0.25, label: 'ACT II',   name: 'Origin'  },
  garden:   { start: 0.25, end: 0.45, label: 'ACT III',  name: 'Garden'  },
  harvest:  { start: 0.45, end: 0.68, label: 'ACT IV',   name: 'Harvest' },
  process:  { start: 0.68, end: 0.90, label: 'ACT V',    name: 'Process' },
  cta:      { start: 0.90, end: 1.00, label: 'ACT VI',   name: 'Journey' },
};

/**
 * Maps a global scroll progress value [0,1] to a local section progress [0,1]
 * @param {number} globalProgress — overall page scroll progress [0,1]
 * @param {string} section — key from SCROLL_MAP
 * @returns {number} clamped local progress [0,1]
 */
export function getLocalProgress(globalProgress, section) {
  const { start, end } = SCROLL_MAP[section];
  return Math.min(1, Math.max(0, (globalProgress - start) / (end - start)));
}

/**
 * Returns the current active section key based on scroll progress
 */
export function getActiveSection(globalProgress) {
  for (const [key, range] of Object.entries(SCROLL_MAP)) {
    if (globalProgress >= range.start && globalProgress < range.end) return key;
  }
  return 'cta';
}
