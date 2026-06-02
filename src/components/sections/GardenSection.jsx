import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import './GardenSection.css';

const STATS = [
  { value: 2400, suffix: 'm', label: 'Elevation', desc: 'above sea level' },
  { value: 180, suffix: 'cm', label: 'Rainfall', desc: 'annual precipitation' },
  { value: 3, suffix: '', label: 'Harvests', desc: 'each growing year' },
];

export default function GardenSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const statsRefs = useRef([]);

  useGSAP(() => {
    // SplitText heading — AGENTS.md §5 ACT 2
    let split = null;
    try {
      split = new SplitText(headingRef.current, { type: 'chars' });
      gsap.from(split.chars, {
        opacity: 0, y: 50, rotateX: -30, stagger: 0.025, duration: 1.4, ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%', toggleActions: 'play none none reverse',
        },
      });
    } catch {
      gsap.from(headingRef.current, {
        opacity: 0, y: 50, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    }

    // Body text reveal
    gsap.from('.garden-body-text', {
      opacity: 0, y: 30, duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: '.garden-body-text', start: 'top 85%', toggleActions: 'play none none reverse' },
    });

    // Animated stat counters
    STATS.forEach((stat, i) => {
      const el = statsRefs.current[i];
      if (!el) return;
      const numEl = el.querySelector('.stat-number');
      if (!numEl) return;
      const obj = { val: 0 };

      gsap.to(obj, {
        val: stat.value, duration: 2.5, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reset' },
        onUpdate() { numEl.textContent = Math.round(obj.val).toLocaleString() + stat.suffix; },
      });

      gsap.from(el, {
        opacity: 0, y: 40, delay: i * 0.15, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.garden-stats', start: 'top 80%', toggleActions: 'play none none reverse' },
      });
    });

    // Background parallax
    gsap.to('.garden-bg', {
      yPercent: 25, ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom', end: 'bottom top', scrub: 1.5,
      },
    });

    // Floating leaf particles
    gsap.utils.toArray('.garden-leaf').forEach((leaf, i) => {
      gsap.to(leaf, {
        y: -40 - i * 10, x: (i % 2 === 0 ? 15 : -15),
        rotation: 360 * (i % 2 === 0 ? 1 : -1),
        duration: 4 + i * 0.5, repeat: -1, yoyo: true,
        ease: 'sine.inOut', delay: i * 0.3,
      });
    });

    return () => split?.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="garden-section"
      className="garden-section"
      aria-label="Garden — Tea fields of India"
    >
      <div className="garden-bg" style={{ backgroundImage: 'url(/assets/images/garden_aerial.jpg)' }} aria-hidden="true" />
      <div className="garden-overlay" aria-hidden="true" />

      {[...Array(8)].map((_, i) => (
        <div key={i} className="garden-leaf" aria-hidden="true"
          style={{ left: `${10 + i * 11}%`, top: `${20 + (i % 3) * 25}%`, fontSize: `${1 + (i % 3) * 0.4}rem`, opacity: 0.3 + (i % 3) * 0.15 }}>
          🍃
        </div>
      ))}

      <div className="garden-content">
        <div className="section-label garden-act-label">Act III · The Garden</div>
        <h2 ref={headingRef} className="garden-heading heading-secondary">
          Where every leaf tells<br />the story of its soil
        </h2>
        <p className="body-text garden-body-text">
          High above the clouds, where temperature swings between warm days and cool mist-drenched nights,
          the tea plant develops the complexity that no lowland crop can replicate. Elevation, rainfall,
          and skilled hands conspire to create something remarkable.
        </p>

        <div className="garden-stats" role="list">
          {STATS.map((stat, i) => (
            <div key={stat.label} ref={el => statsRefs.current[i] = el} className="garden-stat" role="listitem">
              <div className="stat-number animate-shimmer" aria-live="polite">0{stat.suffix}</div>
              <div className="stat-label section-label">{stat.label}</div>
              <div className="stat-desc caption">{stat.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
