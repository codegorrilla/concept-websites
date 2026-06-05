import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import './HarvestSection.css';

const PRODUCTS = [
  {
    id: 'assam',
    title: 'Assam Golden Buds',
    price: '₹850',
    pouchColor: '#1c120c', // Dark rich cocoa/charcoal
    pouchText: '#C9922A',  // Brand Gold
    details: {
      subtitle: '100% ORGANIC CTC',
      notes: 'MALT · HONEY · COCOA',
      origin: 'SINGLE ESTATE',
      weight: '100G (3.5 OZ)'
    }
  },
  {
    id: 'darjeeling',
    title: 'Darjeeling Muscatel',
    price: '₹1,200',
    pouchColor: '#c4d2d4', // Amaya-style dusty teal
    pouchText: '#0D0906',  // Deep black
    details: {
      subtitle: 'EXQUISITE FIRST FLUSH',
      notes: 'FLORAL · MUSCATEL · FRESH GRASS',
      origin: 'SINGLE ESTATE',
      weight: '75G (2.6 OZ)'
    }
  },
  {
    id: 'nilgiri',
    title: 'Nilgiri Frost Tea',
    price: '₹650',
    pouchColor: '#2b4233', // Deep forest green
    pouchText: '#E8DDD0',  // Warm cream
    details: {
      subtitle: 'BRISK WINTER FLUSH',
      notes: 'BRISK · CITRUS · EUCALYPTUS',
      origin: 'SINGLE ESTATE',
      weight: '100G (3.5 OZ)'
    }
  }
];

export default function HarvestSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // SplitText heading — AGENTS.md §5 ACT 3
    let split = null;
    try {
      split = new SplitText('.harvest-heading', { type: 'chars' });
      gsap.from(split.chars, {
        opacity: 0, y: 40, stagger: 0.03, duration: 1.2, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%', toggleActions: 'play none none reverse',
        },
      });
    } catch {
      gsap.from('.harvest-heading', {
        opacity: 0, y: 40, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
      });
    }

    // Scrub timeline — AGENTS.md §5 ACT 3
    const leafTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.harvest-inner',
        start: 'top center', end: 'bottom center', scrub: 2,
      },
    });
    leafTl
      .to('.harvest-hand-image', { scale: 1.06, duration: 1 })
      .from('.harvest-copy-word', { opacity: 0, y: 20, stagger: 0.08, duration: 0.6 }, 0)
      .to('.harvest-particles', { opacity: 1, y: '-=30', duration: 0.8 }, 0.3);

    // Individual leaf floats
    gsap.utils.toArray('.h-leaf').forEach((leaf, i) => {
      gsap.to(leaf, {
        y: -80 - Math.random() * 60, x: (Math.random() - 0.5) * 80,
        rotation: (Math.random() - 0.5) * 180, opacity: 0,
        duration: 2.5 + Math.random() * 2, repeat: -1, delay: i * 0.4, ease: 'power1.out',
      });
    });

    // Parallax on hand image
    gsap.to('.harvest-hand-image', {
      yPercent: -8, ease: 'none',
      scrollTrigger: {
        trigger: '.harvest-inner',
        start: 'top bottom', end: 'bottom top', scrub: 2,
      },
    });

    // Product cards stagger reveal (triggered when the gallery row comes into view)
    gsap.from('.product-card', {
      opacity: 0,
      y: 60,
      stagger: 0.15,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.product-gallery',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      }
    });

    return () => split?.revert();
  }, { scope: sectionRef, dependencies: [] });

  return (
    <section
      ref={sectionRef}
      id="harvest-section"
      className="harvest-section"
      aria-label="Harvest — Hand-picking tea leaves"
    >
      <div className="harvest-inner">
        <div className="harvest-image-col">
          <div className="harvest-image-wrapper">
            <img
              src="/assets/images/harvest_hands.jpg"
              alt="Hands carefully plucking two leaves and a bud from a tea plant"
              className="harvest-hand-image"
            />
            <div className="harvest-image-caption caption">Pekoe harvest · Darjeeling first flush</div>
          </div>
          <div className="harvest-particles" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-leaf"
                style={{ left: `${10 + i * 7}%`, bottom: `${20 + (i % 4) * 15}%`, fontSize: `${0.8 + (i % 3) * 0.4}rem`, opacity: 0.6 }}>
                {i % 2 === 0 ? '🍃' : '🌿'}
              </div>
            ))}
          </div>
        </div>

        <div className="harvest-copy-col">
          <div className="section-label harvest-act-label">Act IV · Harvest</div>
          <h2 className="harvest-heading heading-secondary">
            Two leaves<br />and a bud.<br />
            <span className="italic-accent">Nothing more.</span>
          </h2>
          <div className="harvest-copy">
            {'The oldest rule in tea. The finest result.'.split(' ').map((word, i) => (
              <span key={i} className="harvest-copy-word">{word} </span>
            ))}
          </div>
          <p className="body-text harvest-body">
            For four generations, our pickers have risen before dawn to walk the dew-laden rows.
            Each pair of leaves and tender bud is chosen by touch — a skill that no machine has ever replicated.
          </p>
          <div className="harvest-quote">
            <div className="harvest-quote-mark">"</div>
            <blockquote>
              <p className="tagline">Our pickers have harvested for four generations.</p>
              <cite className="caption">— The Indra estate tradition</cite>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Product Gallery row (Stripe from Cup Section) */}
      <div className="harvest-gallery-row">
        <h3 className="harvest-gallery-title font-heading">Our Sourced Teas</h3>
        <div className="product-gallery" role="region" aria-label="Tea bag products">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="product-card">
              {/* Element 1: Title */}
              <h4 className="product-title font-display">{product.title}</h4>

              {/* Element 2: Packaging Image */}
              <div className="product-packaging-wrapper">
                <div className="pouch-glow" style={{ '--glow-color': product.pouchColor }} />
                <div className="tea-pouch" style={{ '--pouch-bg': product.pouchColor, '--pouch-text': product.pouchText }}>
                  <div className="pouch-gloss" />
                  
                  {/* Top Seal Area with notches */}
                  <div className="pouch-seal">
                    <div className="pouch-notch notch-left" />
                    <div className="pouch-seal-pattern" />
                    <div className="pouch-notch notch-right" />
                  </div>
                  <div className="pouch-zipper" />

                  {/* Brand Branding */}
                  <div className="pouch-brand">
                    <span className="pouch-brand-main">INDRA</span>
                    <span className="pouch-brand-sub">LEAFS &amp; FRAGRANCES</span>
                  </div>

                  {/* Bottom Amaya-style info box */}
                  <div className="pouch-info-box">
                    <div className="pouch-info-row row-1">
                      <div className="pouch-info-title">{product.title.toUpperCase()}</div>
                      <div className="pouch-info-badge">PREMIUM</div>
                    </div>
                    <div className="pouch-info-row row-2">
                      <div className="pouch-info-notes-label">TASTING NOTES</div>
                      <div className="pouch-info-notes">{product.details.notes}</div>
                    </div>
                    <div className="pouch-info-row row-3">
                      <div className="pouch-info-origin">{product.details.origin}</div>
                      <div className="pouch-info-weight">{product.details.weight}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Element 3: Price Tag */}
              <div className="product-price">{product.price}</div>

              {/* Element 4: Buy Button */}
              <button className="product-buy-btn font-body">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
