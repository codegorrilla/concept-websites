import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './ProcessSection.css';

const STEPS = [
  { id: 'withering', num: '01', title: 'Withering', tagline: 'The leaf breathes and releases', color: '#3B6B3A', icon: '🌿',
    desc: "Freshly plucked leaves are spread on bamboo trays for 12–18 hours. They lose up to 70% of their moisture, becoming supple and ready to receive the roller's touch." },
  { id: 'rolling', num: '02', title: 'Rolling', tagline: 'Shape is given, flavour is born', color: '#7A8A3A', icon: '🔄',
    desc: 'The withered leaves are twisted and rolled, breaking their cell walls to release the essential oils and enzymes that give each tea its signature character.' },
  { id: 'oxidation', num: '03', title: 'Oxidation', tagline: 'Colour deepens, character forms', color: '#C9922A', icon: '✨',
    desc: 'In warm, humid air, the rolled leaves transform. Enzymes react with oxygen, turning the leaf from green to copper-brown while developing complexity of flavour.' },
  { id: 'drying', num: '04', title: 'Drying', tagline: 'The final seal of perfection', color: '#B5541C', icon: '🔥',
    desc: 'Hot air at precise temperatures halts oxidation and reduces moisture to 2–3%. What emerges is stable, transportable, and ready to reveal its full character in the cup.' },
];

export default function ProcessSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Heading reveal
    gsap.from('.process-heading', {
      opacity: 0, y: 50,
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none reverse',
      },
      duration: 1.2, ease: 'power3.out',
    });

    // Step cards stagger
    gsap.from('.process-step', {
      opacity: 0, x: -40, stagger: 0.2,
      scrollTrigger: {
        trigger: '.process-steps', start: 'top 80%', toggleActions: 'play none none reverse',
      },
      duration: 1, ease: 'power2.out',
    });

    // DrawSVG connector line — AGENTS.md §5 ACT 4
    gsap.from('.process-connector-line', {
      drawSVG: '0%',
      scrollTrigger: {
        trigger: '.process-steps', start: '20% center', end: '80% center', scrub: 1,
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
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="process-section"
      className="process-section"
      aria-label="Process — Four stages of tea making"
    >
      <div className="process-factory-bg">
        <img
          src="/assets/images/process_factory.jpg"
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
          <svg className="process-svg-connector" aria-hidden="true" viewBox="0 0 4 400" preserveAspectRatio="none">
            <line
              className="process-connector-line"
              x1="2" y1="0" x2="2" y2="400"
              stroke="var(--brand-gold)" strokeWidth="1.5" strokeDasharray="6 4"
            />
          </svg>

          <div className="process-steps" role="list">
            {STEPS.map((step) => (
              <div key={step.id} id={`step-${step.id}`} className="process-step" role="listitem">
                <div className="step-num-col">
                  <div className="step-icon" aria-hidden="true" style={{ color: step.color }}>{step.icon}</div>
                  <div className="step-num section-label">{step.num}</div>
                </div>
                <div className="step-content">
                  <div className="step-title heading-tertiary" style={{ color: step.color }}>{step.title}</div>
                  <div className="step-tagline tagline">"{step.tagline}"</div>
                  <p className="step-desc body-text">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
