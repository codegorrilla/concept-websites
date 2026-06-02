import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './BlendSection.css';

const BLENDS = [
  { name: 'Assam',      pct: 45, color: '#8B4513', desc: 'Bold base' },
  { name: 'Darjeeling', pct: 30, color: '#C9922A', desc: 'Floral top note' },
  { name: 'Nilgiri',    pct: 25, color: '#6B8E23', desc: 'Bright finish' },
];

const BLEND_STATS = [
  { value: 47, label: 'Years blending', suffix: '' },
  { value: 320, label: 'Unique blends created', suffix: '+' },
  { value: 12, label: 'Awards', suffix: '' },
];

export default function BlendSection() {
  const sectionRef = useRef(null);
  const statsRefs = useRef([]);

  const cx = 140, cy = 140, r = 100;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  useGSAP(() => {
    // Heading reveal
    gsap.from('.blend-heading', {
      opacity: 0, y: 50, duration: 1.4, ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse',
      },
    });

    // Donut arc reveal — use querySelectorAll for direct element access
    // (strokeDashoffset is an SVG attribute, animate via direct element refs)
    const arcs = sectionRef.current?.querySelectorAll('.blend-arc') ?? [];
    arcs.forEach((arc, i) => {
      const naturalOffset = parseFloat(arc.style.strokeDashoffset || arc.getAttribute('stroke-dashoffset') || 0);
      gsap.fromTo(arc,
        { strokeDashoffset: naturalOffset + circumference },
        {
          strokeDashoffset: naturalOffset,
          duration: 1.8, delay: i * 0.25, ease: 'power2.out',
          scrollTrigger: {
            trigger: '.blend-chart', start: 'top 80%', toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Legend items stagger
    gsap.from('.blend-legend-item', {
      opacity: 0, x: 30, stagger: 0.15, duration: 0.9, ease: 'power2.out',
      scrollTrigger: {
        trigger: '.blend-legend', start: 'top 85%', toggleActions: 'play none none reverse',
      },
    });

    // Counter stats — AGENTS.md §5 ACT 5
    BLEND_STATS.forEach((stat, i) => {
      const el = statsRefs.current[i];
      if (!el) return;
      const numEl = el.querySelector('.blend-stat-val');
      if (!numEl) return;
      const obj = { val: 0 };
      gsap.to(obj, {
        val: stat.value, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reset' },
        onUpdate() { numEl.textContent = Math.round(obj.val) + stat.suffix; },
      });
      gsap.from(el, {
        opacity: 0, y: 30, delay: i * 0.12, duration: 1, ease: 'power2.out',
        scrollTrigger: { trigger: '.blend-stats-row', start: 'top 85%', toggleActions: 'play none none reverse' },
      });
    });

    // Fluid background animations
    gsap.to('.blend-fluid-1', { x: 30, y: -20, scale: 1.1, rotation: 5, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.blend-fluid-2', { x: -25, y: 30, scale: 0.95, rotation: -3, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });
    gsap.to('.blend-fluid-3', { x: 15, y: -35, scale: 1.05, rotation: 8, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="blend-section"
      className="blend-section"
      aria-label="Blend — The master blender's craft"
    >
      <div className="blend-fluids" aria-hidden="true">
        <div className="blend-fluid blend-fluid-1" />
        <div className="blend-fluid blend-fluid-2" />
        <div className="blend-fluid blend-fluid-3" />
      </div>

      <div className="blend-inner">
        <div className="blend-header">
          <div className="section-label blend-act-label">Act VI · The Blend</div>
          <h2 className="blend-heading heading-secondary">
            The art of the blend<br />
            <span className="italic-accent">is the science of memory</span>
          </h2>
        </div>

        <div className="blend-content-grid">
          <div className="blend-chart-col">
            <svg className="blend-chart" viewBox="0 0 280 280" aria-label="Blend composition chart">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="28"/>
              {BLENDS.map((blend) => {
                const dash = (blend.pct / 100) * circumference;
                const offset = cumulative * circumference / 100;
                cumulative += blend.pct;
                return (
                  <circle
                    key={blend.name}
                    className="blend-arc"
                    cx={cx} cy={cy} r={r}
                    fill="none"
                    stroke={blend.color}
                    strokeWidth="26"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={circumference * 0.25 - offset}
                    strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 6px ${blend.color}60)` }}
                  />
                );
              })}
              <text x={cx} y={cy - 10} textAnchor="middle" fill="var(--brand-mist)" fontFamily="var(--font-display)" fontSize="22" fontWeight="300">Master</text>
              <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--brand-gold)" fontFamily="var(--font-accent)" fontSize="13" fontStyle="italic">Blend</text>
            </svg>

            <div className="blend-legend" role="list">
              {BLENDS.map((blend) => (
                <div key={blend.name} className="blend-legend-item" role="listitem">
                  <span className="blend-legend-dot" style={{ background: blend.color, boxShadow: `0 0 8px ${blend.color}80` }} />
                  <span className="blend-legend-name body-text">{blend.name}</span>
                  <span className="blend-legend-pct" style={{ color: blend.color }}>{blend.pct}%</span>
                  <span className="blend-legend-desc caption">{blend.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="blend-copy-col">
            <p className="body-text blend-body">
              Every harvest season, our Master Blender tastes hundreds of single-origin
              lots before composing a blend that honours the year's unique conditions.
              The result is a consistency that paradoxically celebrates variation.
            </p>

            <div className="blend-stats-row" role="list">
              {BLEND_STATS.map((stat, i) => (
                <div key={stat.label} ref={el => statsRefs.current[i] = el} className="blend-stat" role="listitem">
                  <div className="blend-stat-val animate-shimmer">0</div>
                  <div className="blend-stat-label section-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="blend-master-card">
              <div className="blend-master-avatar" aria-hidden="true"><span>RK</span></div>
              <div className="blend-master-info">
                <div className="heading-tertiary blend-master-name">Rajan Krishnan</div>
                <div className="section-label blend-master-title">Master Blender, 3rd Generation</div>
                <blockquote className="tagline blend-master-quote">
                  "A great blend is not a formula. It is a conversation between memory and the present harvest."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
