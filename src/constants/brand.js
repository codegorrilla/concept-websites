// Brand Design Tokens — matches AGENTS.md §2
export const COLORS = {
  earth:      '#2C1A0E',
  gold:       '#C9922A',
  goldLight:  '#E8A93A',
  goldDark:   '#A07520',
  mist:       '#E8DDD0',
  mistDark:   '#C8B8A2',
  green:      '#3B6B3A',
  greenLight: '#4A8048',
  greenDark:  '#2A4E29',
  terracotta: '#B5541C',
  black:      '#0D0906',
  white:      '#FAF6F1',
};

export const FONTS = {
  display:  "'Cormorant Garamond', Georgia, serif",
  heading:  "'Playfair Display', Georgia, serif",
  body:     "'Inter', system-ui, sans-serif",
  accent:   "'Libre Baskerville', Georgia, serif",
};

export const TYPOGRAPHY = {
  hero:   'clamp(3.5rem, 8vw, 7rem)',
  h1:     'clamp(2.8rem, 6vw, 5.5rem)',
  h2:     'clamp(2rem, 4vw, 3.5rem)',
  h3:     'clamp(1.4rem, 2.5vw, 2rem)',
  large:  'clamp(1.1rem, 1.8vw, 1.35rem)',
  body:   'clamp(0.95rem, 1.2vw, 1.05rem)',
  small:  '0.85rem',
  label:  '0.75rem',
};

export const EASING = {
  smooth:   'power3.out',
  bounce:   'back.out(1.7)',
  elastic:  'elastic.out(1, 0.5)',
  cinematic:'power2.inOut',
};
