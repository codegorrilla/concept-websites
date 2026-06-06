import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { asset } from '../../utils/assetPath';
import './ProcessSection.css';

const STEPS = [
  { id: 'withering', num: '01', title: 'Withering', tagline: 'The leaf breathes and releases', color: '#3B6B3A', icon: '🌿',
    desc: "Freshly plucked leaves are spread on bamboo trays for 12–18 hours. They lose up to 70% of their moisture, becoming supple and ready to receive the roller's touch." },
  { id: 'rolling', num: '02', title: 'Rolling', tagline: 'Shape is given, flavour is born', color: '#C9922A', icon: '🔄', // Changed to brand-gold/amber for better morph-coloring flow
    desc: 'The withered leaves are twisted and rolled, breaking their cell walls to release the essential oils and enzymes that give each tea its signature character.' },
  { id: 'oxidation', num: '03', title: 'Oxidation', tagline: 'Colour deepens, character forms', color: '#B5541C', icon: '✨', // Terracotta for rich oxidation warmth
    desc: 'In warm, humid air, the rolled leaves transform. Enzymes react with oxygen, turning the leaf from green to copper-brown while developing complexity of flavour.' },
  { id: 'drying', num: '04', title: 'Drying', tagline: 'The final seal of perfection', color: '#A07520', icon: '🔥', // Gold dark for finished dried leaf
    desc: 'Hot air at precise temperatures halts oxidation and reduces moisture to 2–3%. What emerges is stable, transportable, and ready to reveal its full character in the cup.' },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const vizColRef = useRef(null);

  useGSAP(() => {
    // Heading reveal
    gsap.from('.process-heading', {
      opacity: 0, y: 50,
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse',
      },
      duration: 1.2, ease: 'power3.out',
    });

    // Step list column entrance
    gsap.from('.process-steps-col', {
      opacity: 0, y: 40,
      scrollTrigger: {
        trigger: '.process-steps-col', start: 'top 80%', toggleActions: 'play none none reverse',
      },
      duration: 1, ease: 'power2.out',
    });

    // DrawSVG connector line — AGENTS.md §5 ACT 4
    gsap.from('.process-connector-line', {
      drawSVG: '0%',
      scrollTrigger: {
        trigger: '.process-steps', start: '10% center', end: '90% center', scrub: 1.5,
      },
      ease: 'none',
    });

    // Factory image parallax
    gsap.to('.process-factory-img', {
      yPercent: 15, ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom', end: 'bottom top', scrub: 2,
      },
    });

    // ─── PIN the right visualizer column ───────────────────────────────────
    // Pin the visualizer card for the full scroll duration of the steps column.
    ScrollTrigger.create({
      trigger: '.process-steps-col',
      start: 'top 20%',
      end: 'bottom 80%',
      pin: vizColRef.current,
      pinSpacing: false,
    });

    // ─── Per-step morph triggers ────────────────────────────────────────────
    STEPS.forEach((step) => {
      ScrollTrigger.create({
        trigger: `#step-${step.id}`,
        start: 'top center+=100',
        end: 'bottom center-=100',
        onToggle: (self) => {
          if (self.isActive) {
            // Morph the shape to step path and fill color
            gsap.to('#morph-shape', {
              morphSVG: `#path-${step.id}`,
              fill: step.color,
              duration: 0.8,
              ease: 'power2.inOut',
            });
            // Soft glow background shift
            gsap.to('.visualizer-glow', {
              background: `radial-gradient(circle, ${step.color}3a 0%, transparent 75%)`,
              duration: 0.8,
            });
            // Update state label text
            const labelText = document.querySelector('.visualizer-state-name');
            if (labelText) {
              labelText.textContent = step.title.toUpperCase();
              gsap.fromTo(labelText, { opacity: 0, y: 5 }, { opacity: 0.8, y: 0, duration: 0.4 });
            }
            // Add active class highlight
            const el = document.getElementById(`step-${step.id}`);
            if (el) el.classList.add('active');

            // Shift process overlay background ambient gradient color
            gsap.to('.process-factory-overlay', {
              background: `linear-gradient(to right, rgba(13,9,6,0.97) 0%, ${step.color}18 50%, rgba(13,9,6,0.97) 100%)`,
              duration: 1.2,
            });
          } else {
            // Remove active class highlight
            const el = document.getElementById(`step-${step.id}`);
            if (el) el.classList.remove('active');
          }
        },
      });
    });
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="process-section"
      className="process-section"
      aria-label="Process — Four stages of tea making"
    >
      {/* Hidden SVGs containing target paths for morphing */}
      <svg style={{ display: 'none' }} aria-hidden="true">
        {/* Withering: Leaf shape */}
        <path id="path-withering" d="M50,15 C75,32 78,58 50,85 C22,58 25,32 50,15 Z" />
        {/* Rolling: Coiled spiral representing cell wall crushing */}
        <path id="path-rolling" d="M50,15 C70,15 85,30 85,50 C85,68 68,82 50,82 C32,82 18,68 18,50 C18,35 30,22 46,22 C58,22 68,32 68,44 C68,52 60,60 52,60 C45,60 40,55 40,48 C40,43 43,39 47,39 C50,39 52,41 52,43 C52,44 50,45 49,45" />
        {/* Oxidation: Organic bubbly enzyme cloud */}
        <path id="path-oxidation" d="M50,15 C62,12 75,18 78,28 C85,32 88,45 84,55 C88,65 82,78 72,80 C62,85 48,82 38,82 C28,82 18,85 14,75 C10,65 14,52 16,45 C12,35 18,22 28,18 C38,15 42,18 50,15 Z" />
        {/* Drying: Symmetric, stable curved diamond seal */}
        <path id="path-drying" d="M50,15 Q68,32 85,50 Q68,68 50,85 Q32,68 15,50 Q32,32 50,15 Z" />
      </svg>

      <div className="process-factory-bg">
        <img
          src={asset("/assets/images/process_factory.jpg")}
          alt="Artisan tea withering factory"
          className="process-factory-img"
        />
        <div className="process-factory-overlay" aria-hidden="true" />
      </div>

      <div className="process-inner">
        <div className="process-header">
          <div className="section-label process-act-label">Act V · Process</div>
          <h2 className="process-heading heading-secondary">Craft Over Speed</h2>
          <p className="tagline process-subheading">Four steps. No shortcuts. No compromises.</p>
        </div>

        <div className="process-steps-container">
          {/* Left Column: Process Steps List */}
          <div className="process-steps-col">
            <svg className="process-svg-connector" aria-hidden="true" viewBox="0 0 4 400" preserveAspectRatio="none">
              <line
                className="process-connector-line"
                x1="2" y1="0" x2="2" y2="400"
                stroke="var(--brand-gold)" strokeWidth="1.5" strokeDasharray="6 4"
              />
            </svg>

            <div className="process-steps" role="list">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  id={`step-${step.id}`}
                  className="process-step"
                  style={{ '--step-color': step.color }}
                  role="listitem"
                >
                  <div className="step-num-col">
                    <div className="step-icon" aria-hidden="true">{step.icon}</div>
                    <div className="step-num section-label">{step.num}</div>
                  </div>
                  <div className="step-content">
                    <div className="step-title heading-tertiary">{step.title}</div>
                    <div className="step-tagline tagline">"{step.tagline}"</div>
                    <p className="step-desc body-text">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: GSAP-Pinned Shape Morphing Visualizer */}
          <div ref={vizColRef} className="process-visualizer-col" aria-hidden="true">
            <div className="visualizer-card">
              <div className="visualizer-glow" />
              <div className="visualizer-glass-gloss" />
              <div className="visualizer-shape-container">
                <svg className="visualizer-svg" viewBox="0 0 100 100" width="100%" height="100%">
                  <path
                    id="morph-shape"
                    d="M50,15 C75,32 78,58 50,85 C22,58 25,32 50,15 Z" /* Default leaf path */
                    fill="#3B6B3A" /* Default to withering green */
                  />
                </svg>
              </div>
              <div className="visualizer-label-box">
                <div className="visualizer-title section-label">STAGE STATE</div>
                <div className="visualizer-state-name heading-tertiary">WITHERING</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

