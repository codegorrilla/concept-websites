import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import './CupSection.css';

const FLAVOR_TAGS = ['Malty', 'Floral', 'Brisk', 'Muscatel', 'Earthy', 'Warm'];

const BREW_GUIDE = [
  { icon: '🌡️', label: 'Water Temperature', value: '85–90°C', note: 'Not boiling — preserve delicate notes' },
  { icon: '⏱️', label: 'Steep Time', value: '3–4 min', note: 'Adjust to taste preference' },
  { icon: '⚖️', label: 'Leaf Ratio', value: '2g per 150ml', note: 'One teaspoon per cup' },
  { icon: '☕', label: 'Serving', value: 'Plain or with milk', note: 'Darjeeling best served plain' },
];

export default function CupSection() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const [brewOpen, setBrewOpen] = useState(false);

  useGSAP(() => {
    // Heading reveal with SplitText — AGENTS.md §5 ACT 6
    let split = null;
    try {
      split = new SplitText('.cup-heading', { type: 'chars' });
      gsap.from(split.chars, {
        opacity: 0, y: 50, rotateX: -20, stagger: 0.02, duration: 1.4, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse',
        },
      });
    } catch {
      gsap.from('.cup-heading', {
        opacity: 0, y: 50, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
    }

    // Cup image scrub reveal — AGENTS.md §5 ACT 6
    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top bottom', end: 'center center', scrub: 2,
      },
    })
    .from(imageRef.current, { y: 80, scale: 0.92, opacity: 0, duration: 1 })
    .from('.cup-label-text', { opacity: 0, scale: 0.85, duration: 1, ease: 'back.out(1.7)' }, 0.5);

    // Flavor tags stagger
    gsap.from('.flavor-tag', {
      opacity: 0, scale: 0.8, y: 20, stagger: 0.1, duration: 0.7, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.cup-flavors', start: 'top 85%', toggleActions: 'play none none reverse' },
    });

    // Steam wisps
    gsap.utils.toArray('.steam-wisp').forEach((wisp, i) => {
      gsap.to(wisp, {
        y: -100 - i * 20, x: Math.sin(i) * 20, opacity: 0, scale: 1.5 + i * 0.2,
        duration: 2.5 + i * 0.4, repeat: -1, delay: i * 0.6, ease: 'power1.out',
      });
    });

    // Image parallax
    gsap.to(imageRef.current, {
      yPercent: -8, ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 2,
      },
    });

    // CTA button hover micro-animations
    const buttons = sectionRef.current?.querySelectorAll('.brew-guide-toggle') ?? [];
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.02, duration: 0.2, ease: 'power2.out' }));
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.inOut' }));
    });

    return () => split?.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="cup-section"
      className="cup-section"
      aria-label="The Cup — One cup, a thousand years of craft"
    >
      <div className="cup-inner">
        <div className="cup-image-col">
          <div className="cup-image-wrapper">
            <img
              ref={imageRef}
              src="/assets/images/tea_cup_steam.jpg"
              alt="Handcrafted ceramic cup of Darjeeling tea with rising steam"
              className="cup-photo"
            />
            <div className="steam-container" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="steam-wisp"
                  style={{ left: `${40 + i * 5}%`, bottom: '58%', width: `${20 + i * 8}px`, height: `${30 + i * 10}px`, opacity: 0.25 }}
                />
              ))}
            </div>
            <div className="cup-label-text">
              <span className="section-label">Indra's Signature Blend</span>
              <span className="cup-label-year caption">Est. 1947</span>
            </div>
          </div>
        </div>

        <div className="cup-copy-col">
          <div className="section-label cup-act-label">Act VII · The Cup</div>
          <h2 className="cup-heading heading-secondary">
            One cup.<br />
            <span className="italic-accent">A thousand years</span><br />
            of craft.
          </h2>
          <p className="body-text cup-body">
            Everything before this moment — the mountains, the rainfall, the pickers' hands,
            the blender's memory — converges in a single cup. This is not just tea.
            This is a civilisation in a vessel.
          </p>

          <div className="cup-flavors" role="list" aria-label="Flavor notes">
            {FLAVOR_TAGS.map(tag => (
              <span key={tag} className="flavor-tag" role="listitem">{tag}</span>
            ))}
          </div>

          <button
            className={`brew-guide-toggle ${brewOpen ? 'open' : ''}`}
            onClick={() => setBrewOpen(v => !v)}
            aria-expanded={brewOpen}
            aria-controls="brew-guide-panel"
            id="brew-guide-btn"
          >
            <span>{brewOpen ? '— ' : '+ '}Brew Guide</span>
            <span className="brew-toggle-icon">{brewOpen ? '▲' : '▼'}</span>
          </button>

          <div id="brew-guide-panel" className={`brew-guide-panel ${brewOpen ? 'open' : ''}`} role="region" aria-labelledby="brew-guide-btn">
            {BREW_GUIDE.map(item => (
              <div key={item.label} className="brew-row">
                <span className="brew-icon" aria-hidden="true">{item.icon}</span>
                <div className="brew-info">
                  <div className="brew-label section-label">{item.label}</div>
                  <div className="brew-value heading-tertiary">{item.value}</div>
                  <div className="brew-note caption">{item.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
