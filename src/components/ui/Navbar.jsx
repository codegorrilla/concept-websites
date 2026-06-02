import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './Navbar.css';

export default function Navbar() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(() => {
    // Hide on scroll down, reveal on scroll up
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: (self) => {
        if (!navRef.current) return;
        if (self.direction === 1 && self.progress > 0.02) {
          gsap.to(navRef.current, { y: -100, duration: 0.4, ease: 'power2.in' });
        } else {
          gsap.to(navRef.current, { y: 0, duration: 0.5, ease: 'power2.out' });
        }
        gsap.to(navRef.current.querySelector('.nav-bg'), {
          opacity: self.progress > 0.02 ? 1 : 0, duration: 0.4,
        });
      },
    });

    // Initial reveal
    gsap.from(navRef.current, { y: -80, opacity: 0, duration: 1.2, delay: 2.5, ease: 'power3.out' });
  }, { scope: navRef, dependencies: [] });

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <nav ref={navRef} className="navbar" id="navbar" aria-label="Main navigation">
      <div className="nav-bg" />
      <div className="nav-inner">
        <button className="nav-wordmark" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <span className="nav-brand-name">Indra's</span>
          <span className="nav-brand-sub">leafs &amp; fragrances</span>
        </button>

        <ul className="nav-links" role="list">
          <li><button onClick={() => scrollTo('origin-section')}>Origin</button></li>
          <li><button onClick={() => scrollTo('garden-section')}>Garden</button></li>
          <li><button onClick={() => scrollTo('harvest-section')}>Harvest</button></li>
          <li><button onClick={() => scrollTo('cup-section')}>The Cup</button></li>
          <li>
            <button className="nav-cta" onClick={() => scrollTo('cta-section')}>
              Shop Teas
            </button>
          </li>
        </ul>

        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <ul role="list">
          <li><button onClick={() => scrollTo('origin-section')}>Origin</button></li>
          <li><button onClick={() => scrollTo('garden-section')}>Garden</button></li>
          <li><button onClick={() => scrollTo('harvest-section')}>Harvest</button></li>
          <li><button onClick={() => scrollTo('process-section')}>Process</button></li>
          <li><button onClick={() => scrollTo('blend-section')}>Blend</button></li>
          <li><button onClick={() => scrollTo('cup-section')}>The Cup</button></li>
          <li><button onClick={() => scrollTo('cta-section')}>Shop Teas</button></li>
        </ul>
      </div>
    </nav>
  );
}
