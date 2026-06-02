import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './HeroSection.css';

export default function HeroSection() {
  const sectionRef = useRef(null);
  const wordmarkRef = useRef(null);
  const taglineRef = useRef(null);
  const hintRef = useRef(null);
  const eyebrowRef = useRef(null);
  const dividerRef = useRef(null);

  useGSAP(() => {
    // Set initial hidden states immediately (before first paint)
    gsap.set(
      [eyebrowRef.current, taglineRef.current, dividerRef.current, hintRef.current],
      { opacity: 0 }
    );

    // SplitText — wrapped in try/catch in case the element isn't ready
    let split = null;
    try {
      split = new SplitText(wordmarkRef.current, { type: 'chars' });
      gsap.set(split.chars, { opacity: 0, y: 50 });
    } catch {
      gsap.set(wordmarkRef.current, { opacity: 0 });
    }

    // Hero entrance timeline — AGENTS.md §5 ACT 0
    const tl = gsap.timeline({ delay: 0.2 });

    tl.to(eyebrowRef.current, { opacity: 1, duration: 0.9, ease: 'power2.out' });

    if (split?.chars?.length) {
      tl.to(split.chars, {
        opacity: 1, y: 0, stagger: 0.025, duration: 1.2, ease: 'power3.out',
      }, '-=0.4');
    } else {
      tl.to(wordmarkRef.current, { opacity: 1, duration: 1.2 }, '-=0.4');
    }

    tl.to(taglineRef.current, {
      opacity: 1, letterSpacing: '0.04em', duration: 1.6, ease: 'power2.out',
    }, '-=0.8')
    .to(dividerRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.8')
    .to(hintRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.4');

    // Float loop on scroll hint
    gsap.to(hintRef.current, {
      y: 10, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5,
    });

    // Parallax — background slower than scroll
    gsap.to('.hero-bg', {
      yPercent: 25, ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top', end: 'bottom top', scrub: 1.5,
      },
    });

    // Fade out content as user scrolls away
    gsap.to('.hero-content', {
      opacity: 0, y: -40, ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: '50% top', end: 'bottom top', scrub: 1,
      },
    });

    // Cleanup SplitText on unmount (useGSAP handles gsap context cleanup)
    return () => split?.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="hero-section"
      className="hero-section"
      aria-label="Hero — Indra's leafs and fragrances"
    >
      <div
        className="hero-bg"
        style={{ backgroundImage: 'url(/assets/images/hero_tea_estate.jpg)' }}
        aria-hidden="true"
      />
      <div className="hero-mist-bottom" aria-hidden="true" />
      <div className="hero-mist-top" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />

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

      <div ref={hintRef} className="scroll-hint" aria-label="Scroll to explore">
        <span className="scroll-hint-label">Scroll to journey</span>
        <svg width="22" height="34" viewBox="0 0 22 34" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1.2" opacity="0.45"/>
          <circle className="scroll-dot-inner" cx="11" cy="10" r="2.5" fill="currentColor"/>
        </svg>
      </div>
    </section>
  );
}
