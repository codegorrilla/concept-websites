import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import './CtaSection.css';

const CERTIFICATIONS = [
  { label: 'ISO 22000', icon: '✓' },
  { label: 'Rainforest Alliance', icon: '🌿' },
  { label: 'Organic India', icon: '🌱' },
  { label: 'Fair Trade', icon: '⚖️' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'WhatsApp', href: '#' },
  { label: 'Newsletter', href: '#' },
];

export default function CtaSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Section reveal stagger — AGENTS.md §5 ACT 7
    gsap.from('.cta-content > *', {
      opacity: 0, y: 50, stagger: 0.15, duration: 1.2, ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse',
      },
    });

    gsap.from('.cert-badge', {
      opacity: 0, scale: 0.8, stagger: 0.1, duration: 0.8, ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: '.cta-certs', start: 'top 85%', toggleActions: 'play none none reverse',
      },
    });

    // CTA button hover micro-animations — AGENTS.md §5 ACT 7
    gsap.utils.toArray('.cta-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'power2.out' }));
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.inOut' }));
    });
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="cta-section"
      className="cta-section"
      aria-label="Begin your journey — Shop our teas"
    >
      <div className="cta-grain" aria-hidden="true" />
      <div className="cta-glow" aria-hidden="true" />

      <div className="cta-inner">
        <div className="cta-content">
          <div className="section-label cta-act-label">Act VIII · Begin</div>
          <h2 className="cta-heading heading-secondary">
            Begin your journey with<br />
            <span className="italic-accent">Indra's leafs &amp; fragrances</span>
          </h2>
          <p className="tagline cta-tagline">Every cup carries a story. Yours is waiting.</p>

          <div className="cta-buttons" role="group" aria-label="Call to action">
            <a href="#" className="cta-btn cta-btn-primary" id="shop-teas-btn" role="button">Shop Our Teas</a>
            <a href="#" className="cta-btn cta-btn-secondary" id="visit-estate-btn" role="button">Visit Our Estate</a>
          </div>

          <div className="cta-newsletter">
            <p className="caption cta-newsletter-label">Join 12,000+ tea lovers. No spam, ever.</p>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()} aria-label="Newsletter signup">
              <input type="email" placeholder="your@email.com" className="newsletter-input" aria-label="Email address" id="newsletter-email" />
              <button type="submit" className="newsletter-submit" id="newsletter-submit-btn">Subscribe</button>
            </form>
          </div>

          <div className="cta-social" role="list" aria-label="Social media links">
            {SOCIAL_LINKS.map(link => (
              <a key={link.label} href={link.href} className="social-link" aria-label={link.label} role="listitem">{link.label}</a>
            ))}
          </div>
        </div>

        <div className="cta-certs" role="list" aria-label="Certifications">
          {CERTIFICATIONS.map(cert => (
            <div key={cert.label} className="cert-badge" role="listitem">
              <span className="cert-icon" aria-hidden="true">{cert.icon}</span>
              <span className="cert-label section-label">{cert.label}</span>
            </div>
          ))}
        </div>

        <footer className="cta-footer">
          <div className="footer-brand">
            <span className="footer-brand-name">Indra's leafs &amp; fragrances</span>
            <span className="footer-brand-sub caption">Premium Indian Tea · Est. 1947</span>
          </div>
          <div className="footer-sourcing caption">Sourced from Assam · Darjeeling · Nilgiri</div>
          <div className="footer-copy caption">© 2026 Indra's leafs &amp; fragrances. All rights reserved.</div>
        </footer>
      </div>
    </section>
  );
}
