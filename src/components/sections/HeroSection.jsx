import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import './HeroSection.css';

// ── Leaf Particle Constants & Helper ──
const LEAF_PATHS = [
  "M10,2 C14,6 16,11 13,15 C10,18 6,17 4,13 C2,9 6,5 10,2 Z",
  "M10,2 C13,5 16,10 12,15 C8.5,19 4.5,16 6,11 C7.5,7.5 7,4.5 10,2 Z",
  "M10,4 C12.5,6.5 14,9.5 12,12.5 C10,15 7,14.5 5.5,12 C4,9.5 7.5,6.5 10,4 Z"
];

const LEAF_COLORS = [
  "#3B6B3A", // Forest green
  "#2C4A26", // Deep olive
  "#C9922A", // Amber gold
  "#B5541C", // Terracotta
  "#2C1A0E"  // Deep brown
];

const renderLeafSvg = (i) => {
  const path = LEAF_PATHS[i % LEAF_PATHS.length];
  const color = LEAF_COLORS[i % LEAF_COLORS.length];
  const size = 16 + (i * 73) % 12; // stable pseudo-random size between 16 and 27px
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 20 20" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ color }}
    >
      <path d={path} fill="currentColor" />
    </svg>
  );
};

const renderLeafParticle = (i) => {
  // Every 3rd particle uses the photorealistic Leaf-1.png image, scaled down
  if (i % 3 === 0) {
    const size = 30 + (i * 47) % 15; // stable size between 30px and 45px
    return (
      <img
        src="/assets/images/Leaf-1.png"
        alt="Premium tea leaf"
        style={{
          width: `${size}px`,
          height: 'auto',
          display: 'block',
        }}
      />
    );
  }
  return renderLeafSvg(i);
};

export default function HeroSection() {
  const wrapperRef  = useRef(null);   // outer 100 vh container
  const wordmarkRef = useRef(null);
  const taglineRef  = useRef(null);
  const hintRef     = useRef(null);
  const eyebrowRef  = useRef(null);
  const dividerRef  = useRef(null);
  const cupRef      = useRef(null);
  const cupScrollRef = useRef(null);
  const leavesRef   = useRef([]);

  useGSAP(() => {
    const getFallDistance = () => {
      const h = window.innerHeight;
      const w = window.innerWidth;
      let cupOffset;
      if (w <= 768) {
        cupOffset = Math.max(273, Math.min(w * 0.44, 343));
      } else {
        cupOffset = Math.max(245, Math.min(w * 0.288, 418));
      }
      return h - cupOffset;
    };

    // ── Initial hidden state ────────────────────────────────────────────────
    gsap.set(
      [eyebrowRef.current, taglineRef.current, dividerRef.current, hintRef.current],
      { opacity: 0 }
    );
    gsap.set(cupRef.current, { y: 400 });

    // Initialize all leaves at the top, transparent and scaled down
    leavesRef.current.forEach((leaf, idx) => {
      if (!leaf) return;
      gsap.set(leaf, {
        x: ((idx * 17) % 50) - 25, // horizontal offset spread
        y: -50,
        rotation: (idx * 45) % 360,
        opacity: 0,
        scale: 0.3,
      });
    });

    let split = null;
    try {
      split = new SplitText(wordmarkRef.current, { type: 'chars' });
      gsap.set(split.chars, { opacity: 0, y: 50 });
    } catch {
      gsap.set(wordmarkRef.current, { opacity: 0 });
    }

    // ── Entrance timeline ───────────────────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.25 });
    tl.to(eyebrowRef.current, { opacity: 1, duration: 0.9, ease: 'power2.out' });

    if (split?.chars?.length) {
      tl.to(split.chars, {
        opacity: 1, y: 0, stagger: 0.025, duration: 1.2, ease: 'power3.out',
      }, '-=0.4');
    } else {
      tl.to(wordmarkRef.current, { opacity: 1, duration: 1.2 }, '-=0.4');
    }

    tl.to(taglineRef.current, { opacity: 1, duration: 1.6, ease: 'power2.out' }, '-=0.8')
      .to(dividerRef.current, { opacity: 1, duration: 0.8 }, '-=0.8')
      .to(cupRef.current,     { y: 0, duration: 1.8, ease: 'power3.out' }, '-=1.4')
      .to(hintRef.current,    { opacity: 1, duration: 0.8 }, '-=0.8');

    // Standalone ambient loop animation for leaves 0-9 (starts after entrance)
    leavesRef.current.slice(0, 10).forEach((leaf, idx) => {
      if (!leaf) return;
      
      const delay = 1.35 + idx * 0.45;
      const ambientTl = gsap.timeline({
        repeat: -1,
        delay: delay,
      });

      ambientTl.to(leaf, {
        opacity: 1,
        scale: 1,
        duration: 0.45,
        ease: 'power1.out',
      })
      .to(leaf, {
        y: () => getFallDistance() + 40, // compensate for top: -40px offset so it lands exactly at the rim
        x: `+=${((idx * 31) % 40) - 20}`, // drift
        rotation: `+=${180 + (idx * 90) % 360}`,
        duration: 2.2 + (idx * 0.3) % 1.2,
        ease: 'power1.in',
      }, 0)
      .to(leaf, {
        y: '+=65', // settle deeper in cup
        x: `+=${((idx * 17) % 20) - 10}`, // extra slight drift inside liquid
        rotation: `+=${30 + (idx * 30) % 90}`,
        opacity: 0,
        scale: 0.3,
        duration: 0.9,
        ease: 'power2.out', // slow down inside the cup
      }, '>');
    });

    // Float loop on scroll hint
    gsap.to(hintRef.current, {
      y: 10, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.6,
    });

    // ── Text content fades out as the user scrolls down the page ─────────────
    gsap.to('.hero-content', {
      opacity: 0,
      y: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Cup slides down slightly on scroll
    gsap.to(cupScrollRef.current, {
      y: 60,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Scroll-triggered cascade for leaves 10-29
    const scrollLeaves = leavesRef.current.slice(10);
    const leavesScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });

    scrollLeaves.forEach((leaf, idx) => {
      if (!leaf) return;
      const startTime = (idx / scrollLeaves.length) * 0.6; // fall during first 60% of scroll
      const duration = 0.35;
      
      leavesScrollTl.to(leaf, {
        opacity: 1,
        scale: 1,
        duration: duration * 0.15,
      }, startTime)
      .to(leaf, {
        y: () => getFallDistance() + 40, // compensate for top: -40px offset so it lands exactly at the rim
        x: `+=${((idx * 19) % 30) - 15}`,
        rotation: `+=${270 + (idx * 60) % 360}`,
        ease: 'power1.in',
        duration: duration,
      }, startTime)
      .to(leaf, {
        y: '+=65', // settle deeper in cup
        x: `+=${((idx * 13) % 20) - 10}`,
        rotation: `+=${45 + (idx * 15) % 60}`,
        opacity: 0,
        scale: 0.3,
        ease: 'power2.out',
        duration: duration * 0.4,
      }, startTime + duration); // Starts exactly when the falling tween finishes
    });

    // Steam fades in as the tea bag immerses (reaching full opacity early)
    gsap.to('.hero-steam-container', {
      opacity: 1.0,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top top',
        end: '35% top',
        scrub: 1,
      },
    });

    // Infinite ambient steam rising/waving loop
    gsap.utils.toArray('.hero-steam-wisp').forEach((wisp, i) => {
      gsap.fromTo(wisp, 
        { y: 0, x: 0, opacity: 0.9, scaleX: 0.9, scaleY: 0.9 },
        {
          y: -120 - i * 15,
          x: () => Math.sin(i * 1.5) * 20 + (Math.random() - 0.5) * 12,
          opacity: 0,
          scaleX: 1.8,
          scaleY: 1.4,
          duration: 3.2 + i * 0.4,
          repeat: -1,
          delay: i * 0.5,
          ease: 'power1.out',
        }
      );
    });

    // Scroll hint fades out at very first scroll
    gsap.to(hintRef.current, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapperRef.current,
        start:  'top top',
        end:    '20% top',
        scrub:  1,
      },
    });

    return () => split?.revert();
  }, { scope: wrapperRef, dependencies: [] });

  return (
    <section
      ref={wrapperRef}
      id="hero-section"
      className="hero-wrapper"
      aria-label="Hero — Indra's leafs and fragrances"
    >
      {/* Background photo */}
      <div
        className="hero-bg"
        style={{ backgroundImage: 'url(/assets/images/hero_tea_estate.jpg)' }}
        aria-hidden="true"
      />
      <div className="hero-mist-bottom" aria-hidden="true" />
      <div className="hero-mist-top"    aria-hidden="true" />
      <div className="hero-vignette"    aria-hidden="true" />

      {/* Static Cup Image centered at the base */}
      <div ref={cupRef} className="hero-cup-container" aria-hidden="true">
        <div ref={cupScrollRef} className="hero-cup-wrapper">
          <img 
            src="/assets/images/cup_image.png" 
            alt="Premium wide glass teacup" 
            className="hero-cup-image" 
          />
        </div>
      </div>

      {/* Steam wisps rising from the cup */}
      <div className="hero-steam-container" aria-hidden="true">
        <svg className="hero-steam-svg" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="hero-steam-wisp wisp-1" d="M 30,110 Q 18,75 30,45 T 25,5" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path className="hero-steam-wisp wisp-2" d="M 42,110 Q 50,75 40,45 T 45,5" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path className="hero-steam-wisp wisp-3" d="M 52,110 Q 60,75 52,45 T 56,5" stroke="rgba(255, 255, 255, 0.95)" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path className="hero-steam-wisp wisp-4" d="M 62,110 Q 52,75 60,45 T 54,5" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path className="hero-steam-wisp wisp-5" d="M 72,110 Q 62,75 70,45 T 65,5" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="5" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Falling Tea Leaves Container */}
      <div className="hero-leaves-container" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={`hero-leaf-particle leaf-${i}`}
            ref={(el) => (leavesRef.current[i] = el)}
          >
            {renderLeafParticle(i)}
          </div>
        ))}
      </div>

      {/* Text content */}
      <div className="hero-content">
        <div ref={eyebrowRef} className="hero-eyebrow section-label">
          Est.&nbsp;1947&nbsp;&nbsp;·&nbsp;&nbsp;Assam&nbsp;&nbsp;·&nbsp;&nbsp;Darjeeling&nbsp;&nbsp;·&nbsp;&nbsp;Nilgiri
        </div>
        <h1 ref={wordmarkRef} className="brand-wordmark">
          Indra's leafs &amp; fragrances
        </h1>
        <p ref={taglineRef} className="brand-tagline">
          From the highlands. Into your soul.
        </p>
        <div ref={dividerRef} className="hero-divider" aria-hidden="true">
          <span className="hero-divider-line" />
          <span className="hero-divider-diamond" />
          <span className="hero-divider-line" />
        </div>
      </div>

      {/* Scroll hint */}
      <div ref={hintRef} className="scroll-hint" aria-label="Scroll to explore">
        <span className="scroll-hint-label">Scroll to explore</span>
        <svg width="22" height="34" viewBox="0 0 22 34" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="20" height="32" rx="10"
            stroke="currentColor" strokeWidth="1.2" opacity="0.45" />
          <circle className="scroll-dot-inner" cx="11" cy="10" r="2.5" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
