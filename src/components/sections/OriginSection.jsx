import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './OriginSection.css';

const REGIONS = [
  {
    id: 'assam', name: 'Assam', subtitle: 'Bold & Malty',
    desc: 'The mighty Brahmaputra valley yields a tea as powerful as the land itself — rich, full-bodied, with a warm malty depth.',
    elevation: '45–350m', season: 'Two flushes', character: 'Malty · Robust · Brisk',
  },
  {
    id: 'darjeeling', name: 'Darjeeling', subtitle: 'Floral Muscatel',
    desc: 'High in the Himalayan foothills, the Queen of Teas blooms — delicate, floral, with that unmistakable muscatel note.',
    elevation: '600–2,000m', season: 'Three flushes', character: 'Floral · Muscatel · Light',
  },
  {
    id: 'nilgiri', name: 'Nilgiri', subtitle: 'Brisk & Fragrant',
    desc: 'The Blue Mountains breathe life into a tea that is bright, aromatic, and consistently fragrant across all seasons.',
    elevation: '1,000–2,500m', season: 'Year-round', character: 'Brisk · Fragrant · Bright',
  },
];

export default function OriginSection() {
  const sectionRef = useRef(null);

  // useGSAP with scope — all string selectors auto-scoped to sectionRef
  useGSAP(() => {
    // Heading reveal
    gsap.from('.origin-heading', {
      opacity: 0, y: 60,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none reverse',
      },
      duration: 1.2, ease: 'power3.out',
    });

    // Region cards stagger — AGENTS.md §5 ACT 1
    gsap.from('.origin-region-label', {
      opacity: 0, y: 40, scale: 0.95,
      stagger: 0.25,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '20% center',
        toggleActions: 'play none none reverse',
      },
      duration: 1.2, ease: 'power2.out',
    });

    // Region dots pulse in
    gsap.from('.region-dot', {
      scale: 0, opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '15% center',
        toggleActions: 'play none none reverse',
      },
      duration: 0.8, ease: 'back.out(2)',
    });

    // Map zoom on scroll
    gsap.fromTo('.india-map-container',
      { scale: 0.85 },
      {
        scale: 1.05,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom', end: 'bottom top', scrub: 1.5,
        },
        ease: 'none',
      }
    );
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="origin-section"
      className="origin-section"
      aria-label="Origin — Three tea regions of India"
    >
      <div className="origin-inner">
        <div className="origin-text-col">
          <div className="section-label origin-act-label">Act II · Origin</div>
          <h2 className="heading-secondary origin-heading">Born of the Earth</h2>
          <p className="tagline origin-subheading">Three regions. One heritage.</p>
          <p className="body-text origin-body">
            India's three great tea-growing regions each bear a distinct personality,
            shaped by altitude, rainfall, and the passage of seasons. Together, they
            form the soul of Indra's leafs &amp; fragrances.
          </p>

          <div className="origin-regions-list">
            {REGIONS.map((region) => (
              <div key={region.id} className="origin-region-label" id={`region-${region.id}`}>
                <div className="origin-region-header">
                  <span className="origin-region-dot" />
                  <span className="origin-region-name heading-tertiary">{region.name}</span>
                  <span className="origin-region-subtitle section-label">{region.subtitle}</span>
                </div>
                <p className="origin-region-desc body-text">{region.desc}</p>
                <div className="origin-region-stats">
                  <span><strong>{region.elevation}</strong> elevation</span>
                  <span><strong>{region.season}</strong></span>
                  <span className="origin-region-chars">{region.character}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="origin-map-col">
          <div className="india-map-container" aria-label="Map of India showing tea regions">
            <svg viewBox="0 0 400 520" className="india-map-svg" aria-hidden="true">
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#C9922A" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#C9922A" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              <path
                d="M180,20 L230,18 L280,30 L320,55 L350,80 L370,120 L375,160 L365,200 L355,230 L370,260 L380,300 L370,340 L350,370 L320,395 L290,410 L260,430 L240,460 L220,490 L200,510 L185,490 L165,465 L145,440 L120,415 L95,390 L70,360 L50,325 L40,290 L45,255 L55,225 L45,195 L30,165 L40,130 L65,100 L95,75 L130,50 L160,30 Z"
                fill="rgba(59,107,58,0.12)" stroke="rgba(201,146,42,0.3)" strokeWidth="1.5"
              />
              <circle cx="288" cy="166" r="40" fill="url(#mapGlow)" opacity="0.8"/>
              <circle cx="248" cy="104" r="35" fill="url(#mapGlow)" opacity="0.6"/>
              <circle cx="208" cy="374" r="38" fill="url(#mapGlow)" opacity="0.5"/>
              <g className="region-dot" filter="url(#glow)">
                <circle cx="288" cy="166" r="6" fill="var(--brand-gold)" opacity="0.9"/>
                <circle cx="288" cy="166" r="12" fill="var(--brand-gold)" opacity="0.2"/>
                <circle cx="288" cy="166" r="20" fill="var(--brand-gold)" opacity="0.06"/>
              </g>
              <text x="298" y="162" fontSize="10" fill="var(--brand-mist)" fontFamily="var(--font-body)" opacity="0.8">Assam</text>
              <g className="region-dot" filter="url(#glow)">
                <circle cx="248" cy="104" r="6" fill="var(--brand-gold)" opacity="0.9"/>
                <circle cx="248" cy="104" r="12" fill="var(--brand-gold)" opacity="0.2"/>
                <circle cx="248" cy="104" r="20" fill="var(--brand-gold)" opacity="0.06"/>
              </g>
              <text x="258" y="100" fontSize="10" fill="var(--brand-mist)" fontFamily="var(--font-body)" opacity="0.8">Darjeeling</text>
              <g className="region-dot" filter="url(#glow)">
                <circle cx="208" cy="374" r="6" fill="var(--brand-gold)" opacity="0.9"/>
                <circle cx="208" cy="374" r="12" fill="var(--brand-gold)" opacity="0.2"/>
                <circle cx="208" cy="374" r="20" fill="var(--brand-gold)" opacity="0.06"/>
              </g>
              <text x="218" y="370" fontSize="10" fill="var(--brand-mist)" fontFamily="var(--font-body)" opacity="0.8">Nilgiri</text>
              <line x1="248" y1="104" x2="288" y2="166" stroke="rgba(201,146,42,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
              <line x1="288" y1="166" x2="208" y2="374" stroke="rgba(201,146,42,0.2)" strokeWidth="1" strokeDasharray="4 4"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
