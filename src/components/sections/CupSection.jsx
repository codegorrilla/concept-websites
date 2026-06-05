import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import './CupSection.css';

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

export default function CupSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Heading reveal with SplitText — AGENTS.md §5 ACT 6
    let split = null;
    try {
      split = new SplitText('.cup-heading', { type: 'chars' });
      gsap.from(split.chars, {
        opacity: 0,
        y: 50,
        rotateX: -20,
        stagger: 0.02,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });
    } catch {
      gsap.from('.cup-heading', {
        opacity: 0,
        y: 50,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        },
      });
    }

    // Product cards stagger reveal
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
      id="cup-section"
      className="cup-section"
      aria-label="The Cup — Product Gallery"
    >
      <div className="cup-gallery-container">
        <div className="cup-header">
          <div className="section-label cup-act-label">Act VII · The Cup</div>
          <h2 className="cup-heading heading-secondary">
            One cup.<br />
            <span className="italic-accent">A thousand years</span><br />
            of craft.
          </h2>
        </div>

        <div className="product-gallery" role="region" aria-label="Tea bag products">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="product-card">
              {/* Element 1: Title */}
              <h3 className="product-title font-display">{product.title}</h3>

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

