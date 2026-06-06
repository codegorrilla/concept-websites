import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import './TeaLoungeSection.css';

const LOUNGE_FEATURES = [
  {
    id: 'blends',
    icon: '☕',
    title: '40+ Curated Blends',
    desc: 'From bold Assam mornings to delicate Darjeeling afternoons — every mood, every moment.',
  },
  {
    id: 'snacks',
    icon: '🫙',
    title: 'Evening Pairings',
    desc: 'House-made samosas, cardamom cookies, and cucumber sandwiches — crafted to complement.',
  },
  {
    id: 'ambiance',
    icon: '✦',
    title: 'Curated Ambiance',
    desc: 'Rattan chairs, warm lanterns, and the soft scent of first flush — a sanctuary in the city.',
  },
  {
    id: 'gatherings',
    icon: '◎',
    title: 'Private Gatherings',
    desc: 'Host your celebrations in our private tea room — for groups up to 20. Reservations welcome.',
  },
];

const MENU_HIGHLIGHTS = [
  { label: 'Assam Breakfast Blend', note: 'Bold · Malty · Invigorating', price: '₹280' },
  { label: 'Darjeeling Afternoon', note: 'Floral · Muscatel · Delicate', price: '₹340' },
  { label: 'Nilgiri Iced Brew', note: 'Brisk · Citrus · Refreshing', price: '₹320' },
  { label: 'Heritage Masala Chai', note: 'Spiced · Creamy · Comforting', price: '₹180' },
  { label: 'Moonlit White Tea', note: 'Subtle · Sweet · Ethereal', price: '₹420' },
];

export default function TeaLoungeSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // ─── Hero badge + heading entrance ───────────────────────────────────────
    gsap.from('.lounge-eyebrow', {
      opacity: 0, y: 20, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse' },
    });

    let split = null;
    try {
      split = new SplitText('.lounge-headline', { type: 'lines,words' });
      gsap.from(split.words, {
        opacity: 0, y: 40, rotateX: -15, stagger: 0.04, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.lounge-headline', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    } catch {
      gsap.from('.lounge-headline', {
        opacity: 0, y: 40, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.lounge-headline', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    }

    gsap.from('.lounge-sub', {
      opacity: 0, y: 25, duration: 1, delay: 0.3, ease: 'power2.out',
      scrollTrigger: { trigger: '.lounge-headline', start: 'top 75%', toggleActions: 'play none none reverse' },
    });

    // ─── Hero image parallax ──────────────────────────────────────────────────
    gsap.to('.lounge-hero-img', {
      yPercent: 12, ease: 'none',
      scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2 },
    });

    // ─── Feature cards stagger reveal ────────────────────────────────────────
    gsap.from('.lounge-feature-card', {
      opacity: 0, y: 50, scale: 0.96, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.lounge-features', start: 'top 80%', toggleActions: 'play none none reverse' },
    });

    // ─── Menu items stagger reveal ────────────────────────────────────────────
    gsap.from('.lounge-menu-item', {
      opacity: 0, x: -30, stagger: 0.1, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.lounge-menu', start: 'top 80%', toggleActions: 'play none none reverse' },
    });

    // ─── Snack image entrance ─────────────────────────────────────────────────
    gsap.from('.lounge-snacks-img-wrap', {
      opacity: 0, scale: 0.92, y: 40, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.lounge-menu-panel', start: 'top 75%', toggleActions: 'play none none reverse' },
    });

    // ─── CTA panel pop-in ────────────────────────────────────────────────────
    gsap.from('.lounge-cta-inner > *', {
      opacity: 0, y: 40, stagger: 0.15, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.lounge-cta', start: 'top 80%', toggleActions: 'play none none reverse' },
    });

    // ─── Stat counters ────────────────────────────────────────────────────────
    gsap.utils.toArray('.lounge-stat-num').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: target,
        snap: { textContent: 1 },
        duration: 1.8, ease: 'power1.out',
        scrollTrigger: { trigger: '.lounge-stats', start: 'top 80%', toggleActions: 'play none none reset' },
      });
    });

    // ─── Hover micro-animations on CTA buttons ────────────────────────────────
    gsap.utils.toArray('.lounge-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'power2.out' }));
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.inOut' }));
    });

    return () => split?.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="lounge-section"
      className="lounge-section"
      aria-label="Tea Lounge — Social gathering and tea bar experience"
    >
      {/* ── HERO BAND ──────────────────────────────────────────────────────── */}
      <div className="lounge-hero">
        <div className="lounge-hero-img-wrap" aria-hidden="true">
          <img
            src="/assets/images/tea_lounge.jpg"
            alt="Indra's Tea Lounge interior — warm, vibrant, and inviting"
            className="lounge-hero-img"
          />
          <div className="lounge-hero-overlay" />
        </div>

        <div className="lounge-hero-content">
          <div className="lounge-eyebrow section-label">Act VII · Tea Lounge</div>
          <h2 className="lounge-headline heading-secondary">
            Where Every<br />
            <em className="lounge-headline-accent">Sip Becomes</em><br />
            a Memory
          </h2>
          <p className="lounge-sub">
            Step into Indra's Tea Lounge — a vibrant gathering place where the art<br />
            of tea meets the warmth of community.
          </p>

          <div className="lounge-stats" aria-label="Lounge highlights">
            <div className="lounge-stat">
              <span className="lounge-stat-num" data-count="40">0</span>
              <span className="lounge-stat-unit">+</span>
              <span className="lounge-stat-label">Curated blends</span>
            </div>
            <div className="lounge-stat-divider" aria-hidden="true" />
            <div className="lounge-stat">
              <span className="lounge-stat-num" data-count="12">0</span>
              <span className="lounge-stat-unit">–7</span>
              <span className="lounge-stat-label">Open daily</span>
            </div>
            <div className="lounge-stat-divider" aria-hidden="true" />
            <div className="lounge-stat">
              <span className="lounge-stat-num" data-count="200">0</span>
              <span className="lounge-stat-unit">+</span>
              <span className="lounge-stat-label">Seats available</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURE CARDS ─────────────────────────────────────────────────── */}
      <div className="lounge-features-band">
        <div className="lounge-features" role="list" aria-label="Lounge features">
          {LOUNGE_FEATURES.map(f => (
            <div key={f.id} className="lounge-feature-card" role="listitem">
              <div className="lounge-feature-icon" aria-hidden="true">{f.icon}</div>
              <h3 className="lounge-feature-title">{f.title}</h3>
              <p className="lounge-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MENU + SNACK IMAGE PANEL ───────────────────────────────────────── */}
      <div className="lounge-menu-panel">
        <div className="lounge-menu-text-col">
          <div className="section-label lounge-menu-label">Signature Menu</div>
          <h3 className="lounge-menu-heading">Teas Worth Lingering Over</h3>
          <ul className="lounge-menu" aria-label="Signature tea menu">
            {MENU_HIGHLIGHTS.map(item => (
              <li key={item.label} className="lounge-menu-item">
                <div className="lounge-menu-item-left">
                  <span className="lounge-menu-name">{item.label}</span>
                  <span className="lounge-menu-note">{item.note}</span>
                </div>
                <span className="lounge-menu-price">{item.price}</span>
              </li>
            ))}
          </ul>
          <p className="lounge-menu-note-footer">
            Full menu available in-lounge. Seasonal specials change weekly.
          </p>
        </div>

        <div className="lounge-snacks-img-wrap" aria-hidden="true">
          <img
            src="/assets/images/tea_lounge_snacks.jpg"
            alt="Artisan Indian tea time spread with samosas, pakoras, and cookies"
            className="lounge-snacks-img"
          />
          <div className="lounge-snacks-caption">Evening pairing at Indra's Lounge</div>
        </div>
      </div>

      {/* ── RESERVATION CTA ───────────────────────────────────────────────── */}
      <div className="lounge-cta" aria-label="Reserve a table">
        <div className="lounge-cta-glow" aria-hidden="true" />
        <div className="lounge-cta-inner">
          <div className="section-label">Reserve Your Table</div>
          <h3 className="lounge-cta-heading">
            Come. Sit. Savour.<br />
            <span className="lounge-cta-sub">No rush. Just tea.</span>
          </h3>
          <p className="lounge-cta-desc">
            Walk in or reserve ahead for our private tea room.<br />
            Perfect for corporate evenings, celebrations, and slow afternoons.
          </p>
          <div className="lounge-cta-buttons">
            <a href="#" className="lounge-btn lounge-btn-primary" id="reserve-table-btn" role="button">
              Reserve a Table
            </a>
            <a href="#" className="lounge-btn lounge-btn-secondary" id="explore-lounge-btn" role="button">
              Explore the Menu
            </a>
          </div>
          <p className="lounge-cta-address">
            📍 No. 14, Tea Garden Road, Connaught Place, New Delhi · <strong>+91 98765 43210</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
