# AGENTS.md — Scroll-Based Brand Experience Website
## Indian Tea Manufacturing Company

> This document is the source of truth for AI agents and developers working on this project.
> It defines the brand identity, technical architecture, scroll animation system, and content flow
> for a cinematic, scroll-driven website built with **React**, **GSAP**, and **Three.js**.

---

## 1. Project Overview

### Brand Concept
**Indra's leafs & fragrances** is a premium Indian tea manufacturing company rooted in the highlands of Assam, Darjeeling, and Nilgiri. The brand ethos blends ancient Indian heritage with modern artisanal quality. Every interaction on the website should feel like a **sensory journey** — from field to cup.

### Core Experience Goal
The website is a **single-page, scroll-driven immersive experience**. As the user scrolls, they travel through:
1. Misty tea gardens at dawn
2. The hand-picking process
3. The artisanal processing facility
4. The final brewed cup — warmth, aroma, identity

The site is **not** a traditional webpage. It is a **cinematic brand film** controlled by the user's scroll position.

---

## 2. Brand Identity

### Color Palette
| Token | Hex | Usage |
|---|---|---|
| `--brand-earth` | `#2C1A0E` | Deep brown — primary backgrounds |
| `--brand-gold` | `#C9922A` | Amber gold — highlights, CTAs |
| `--brand-mist` | `#E8DDD0` | Warm cream — text, fog overlays |
| `--brand-green` | `#3B6B3A` | Forest green — nature sections |
| `--brand-terracotta` | `#B5541C` | Terracotta — warmth, processing section |
| `--brand-black` | `#0D0906` | Near-black — deep scenes |

### Typography
- **Display / Headlines**: `Cormorant Garamond` (Google Fonts) — elegant, vintage serif
- **Subheadings**: `Playfair Display` — editorial, rich serif
- **Body / UI**: `Inter` — modern, legible sans-serif
- **Accent / Taglines**: `Libre Baskerville Italic` — poetic, literary feel

### Tone & Voice
- Poetic and evocative — "Where the mist meets the leaf"
- Ancient wisdom meets modern craft
- Respectful of Indian geography and tea culture
- Avoid generic wellness clichés; lean into specificity (regions, processes, seasons)

---

## 3. Technology Stack

### Core Framework
| Library | Version | Purpose |
|---|---|---|
| `react` | `^18.x` | Component-based UI shell |
| `vite` | `^5.x` | Build tool and dev server |
| `gsap` | `^3.12.x` | Scroll animations, timelines, triggers |
| `@gsap/react` | `^2.x` | GSAP React integration hooks |
| `three` | `^0.165.x` | 3D scenes and particle systems |
| `@react-three/fiber` | `^8.x` | React renderer for Three.js |
| `@react-three/drei` | `^9.x` | Three.js helpers (environment, text, etc.) |
| `lenis` | `^1.x` | Smooth scroll driver |
| `react-router-dom` | `^6.x` | Minimal routing (if multi-page needed) |

### GSAP Plugins Required
```js
// Register in main.jsx
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import SplitText from "gsap/SplitText"; // Club GreenSock license required
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, DrawSVGPlugin, MorphSVGPlugin);
```

### Project Structure
```
tea-concept-2/
├── public/
│   ├── assets/
│   │   ├── textures/          # Three.js texture maps
│   │   ├── models/            # .glb / .gltf 3D models (tea leaves, cup)
│   │   ├── videos/            # Ambient background loops
│   │   └── fonts/             # Self-hosted font fallbacks
├── src/
│   ├── components/
│   │   ├── canvas/            # All Three.js / R3F components
│   │   │   ├── TeaGardenScene.jsx
│   │   │   ├── SteamParticles.jsx
│   │   │   ├── LeafParticles.jsx
│   │   │   ├── TeaCupModel.jsx
│   │   │   └── MistOverlay.jsx
│   │   ├── sections/          # Page sections (scroll panels)
│   │   │   ├── HeroSection.jsx
│   │   │   ├── OriginSection.jsx
│   │   │   ├── HarvestSection.jsx
│   │   │   ├── ProcessSection.jsx
│   │   │   ├── BlendSection.jsx
│   │   │   ├── CupSection.jsx
│   │   │   └── CtaSection.jsx
│   │   ├── ui/                # UI primitives
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScrollProgress.jsx
│   │   │   ├── SectionLabel.jsx
│   │   │   └── GoldDivider.jsx
│   │   └── layout/
│   │       ├── SmoothScrollLayout.jsx
│   │       └── CanvasLayout.jsx
│   ├── hooks/
│   │   ├── useScrollProgress.js
│   │   ├── useGSAPTimeline.js
│   │   └── useThreeTexture.js
│   ├── animations/
│   │   ├── heroAnimations.js
│   │   ├── textReveal.js
│   │   ├── particleTimeline.js
│   │   └── sceneTransitions.js
│   ├── constants/
│   │   ├── brand.js           # Color tokens, typography constants
│   │   └── scrollMap.js       # Section scroll progress mapping
│   ├── styles/
│   │   ├── index.css          # Design tokens, global resets
│   │   ├── typography.css
│   │   └── animations.css     # CSS keyframe helpers
│   ├── App.jsx
│   └── main.jsx
├── AGENTS.md                  # This file
├── package.json
└── vite.config.js
```

---

## 4. Scroll Architecture

### Scroll Driver
- **Lenis** handles smooth scroll interception and provides a normalized scroll value
- Lenis RAF loop is synced with GSAP's ticker for perfect frame alignment:

```js
// SmoothScrollLayout.jsx
const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Scroll Progress Map
The total scroll distance is divided into **7 acts**. Each act maps to a `[0, 1]` normalized progress range:

| Act | Section | Scroll Range | Description |
|---|---|---|---|
| 0 | Hero | `0.00 – 0.10` | Brand wordmark reveal, ambient mist |
| 1 | Origin | `0.10 – 0.25` | Map zoom into Assam / Darjeeling / Nilgiri |
| 2 | Garden | `0.25 – 0.40` | 3D tea garden flythrough with particles |
| 3 | Harvest | `0.40 – 0.52` | Hand-picking animation, leaf float |
| 4 | Process | `0.52 – 0.68` | Factory interior, morphing shapes |
| 5 | Blend | `0.68 – 0.82` | Color blending fluid simulation |
| 6 | Cup | `0.82 – 0.95` | Tea cup reveal, steam particles |
| 7 | CTA | `0.95 – 1.00` | Shop / contact panel |

---

## 5. Section-by-Section Animation Specifications

---

### ACT 0 — Hero Section (`0.00 – 0.10`)

**Visual Goal**: The user opens the site and is immediately greeted by an immersive full-viewport scene — a dark, misty tea estate at dawn, with the brand wordmark emerging from the fog.

**Three.js Canvas**:
- Background: Plane geometry with a custom GLSL shader simulating volumetric fog / mist drift
- Mist uses `SimplexNoise` animated over time via `uTime` uniform
- Soft point lights in amber/gold tone positioned above left

**GSAP Timeline** (`heroAnimations.js`):
```js
// On page load (not scroll-triggered)
const tl = gsap.timeline({ delay: 0.5 });

tl.from(".brand-wordmark", {
  opacity: 0,
  y: 60,
  duration: 2,
  ease: "power3.out",
})
.from(".brand-tagline", {
  opacity: 0,
  letterSpacing: "0.6em",
  duration: 1.8,
  ease: "power2.out",
}, "-=1.2")
.from(".scroll-hint", {
  opacity: 0,
  y: -10,
  duration: 1,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
}, "-=0.5");
```

**Content**:
- `h1`: "Indra's leafs & fragrances"
- `tagline`: *"From the highlands. Into your soul."*
- Subtle ambient sound toggle (muted by default)

---

### ACT 1 — Origin Section (`0.10 – 0.25`)

**Visual Goal**: A topographic/illustrated map of India zooms in to highlight the three tea-growing regions — Assam, Darjeeling, Nilgiri. Each region pulses as it is revealed.

**Three.js Canvas**:
- Flat plane with India map SVG rasterized as a texture
- Three glowing dot meshes (PointLight + sphere) pulse at region coordinates
- Camera animates in Z-axis toward the highlighted region

**GSAP ScrollTrigger**:
```js
ScrollTrigger.create({
  trigger: "#origin-section",
  start: "top bottom",
  end: "bottom top",
  scrub: 1.5,
  onUpdate: (self) => {
    // Drive camera Z position from self.progress
    camera.position.z = gsap.utils.interpolate(8, 2, self.progress);
  }
});

// Text reveal on scroll
gsap.from(".origin-region-label", {
  scrollTrigger: {
    trigger: "#origin-section",
    start: "30% center",
    toggleActions: "play none none reverse"
  },
  opacity: 0,
  y: 30,
  stagger: 0.3,
  duration: 1.2,
  ease: "power2.out"
});
```

**Content**:
- Region cards: Assam (bold malty), Darjeeling (floral muscatel), Nilgiri (brisk & fragrant)
- Brief poetic descriptor for each region (2 lines max)

---

### ACT 2 — Garden Section (`0.25 – 0.40`)

**Visual Goal**: A sweeping 3D flythrough over undulating tea garden rows. Particles simulate floating tea leaves. The camera glides forward as the user scrolls.

**Three.js Canvas** (`TeaGardenScene.jsx`):
- Terrain: Plane geometry (`PlaneGeometry(200, 200, 128, 128)`) with vertex displacement shader using terrain heightmap texture
- Tea rows: Instanced `BoxGeometry` (low-poly tea bushes) arranged in rows along terrain
- Leaf particles: `Points` geometry with custom shader, each particle has randomized float physics driven by `uTime`
- Environment: `EnvironmentMap` from `@react-three/drei` using an HDR of overcast highlands
- Fog: THREE.Fog(`#2C3A2C`, 30, 120)

**Camera Path Animation**:
```js
// Camera follows a CatmullRom spline path
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 12, 50),
  new THREE.Vector3(10, 8, 20),
  new THREE.Vector3(-5, 6, 0),
  new THREE.Vector3(0, 5, -30),
]);

// In useFrame or GSAP proxy
const progress = useScrollProgress(); // [0.25, 0.40] normalized to [0, 1]
const point = path.getPointAt(progress);
camera.position.copy(point);
camera.lookAt(path.getPointAt(Math.min(progress + 0.05, 1)));
```

**GSAP Text Animation**:
- `SplitText` splits `h2` into individual characters
- Characters stagger-reveal with `opacity` and `y` on scroll entry

**Content**:
- `h2`: *"Where every leaf tells the story of its soil"*
- `body`: Description of elevation, rainfall, and seasonal harvests
- Stat counters (animated): `2,400m` elevation · `180cm` annual rainfall · `3 harvests` per year

---

### ACT 3 — Harvest Section (`0.40 – 0.52`)

**Visual Goal**: Close-up focus on a pair of human hands plucking tea leaves. Leaves detach and float upward in a gentle particle arc. This is the most emotionally resonant section.

**Three.js Canvas** (`LeafParticles.jsx`):
- 200–400 leaf-shaped billboard particles (custom plane geometry with leaf texture + alpha map)
- Each particle: randomized `velocity`, `rotationSpeed`, `size`
- On scroll progress: particles emit from a source point (mimicking hands) and drift upward
- `uProgress` uniform drives particle Y-offset and opacity fade-in

**GSAP ScrollTrigger**:
```js
const leafTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#harvest-section",
    start: "top center",
    end: "bottom center",
    scrub: 2,
  }
});

leafTl
  .to(".harvest-hand-image", { scale: 1.05, duration: 1 })
  .from(".harvest-copy span", {
    opacity: 0,
    y: 20,
    stagger: 0.08,
    duration: 0.6,
  }, 0)
  .to(".leaf-particle-canvas", { opacity: 1, duration: 0.5 }, 0.2);
```

**Content**:
- `h2`: *"Two leaves and a bud. Nothing more."*
- Subtext on the tradition of pekoe harvesting
- Worker attribution — "Our pickers have harvested for 4 generations"

---

### ACT 4 — Process Section (`0.52 – 0.68`)

**Visual Goal**: Abstract, industrial yet artisanal. The section transitions from lush green to warm amber/terracotta. Morphing SVG shapes represent the tea withering, rolling, oxidizing, and drying phases.

**GSAP MorphSVG Animation**:
```js
// Morph between abstract leaf → spiral → flat rectangle shapes
const morphTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#process-section",
    scrub: 1.5,
    start: "top center",
    end: "bottom center",
  }
});

morphTl
  .to("#morph-shape", { morphSVG: "#spiral-shape", duration: 1 })
  .to("#morph-shape", { morphSVG: "#flat-shape", duration: 1 })
  .to("#morph-shape", { morphSVG: "#curl-shape", duration: 1 });
```

**GSAP DrawSVG — Process Steps**:
```js
// Line drawing connecting 4 process stages
gsap.from(".process-line", {
  drawSVG: "0%",
  scrollTrigger: {
    trigger: "#process-section",
    start: "20% center",
    end: "80% center",
    scrub: 1,
  },
  ease: "none",
});
```

**Background Shader Transition**:
- Three.js plane with a `uProgress`-driven GLSL mix between green (`#3B6B3A`) → amber (`#C9922A`) → terracotta (`#B5541C`)

**Content — 4 Process Steps**:
1. **Withering** — *"The leaf breathes and releases"*
2. **Rolling** — *"Shape is given, flavour is born"*
3. **Oxidation** — *"Colour deepens, character forms"*
4. **Drying** — *"The final seal of perfection"*

---

### ACT 5 — Blend Section (`0.68 – 0.82`)

**Visual Goal**: A fluid, liquid simulation in Three.js shows different tea varieties blending together. The background ripples with amber and gold. This section highlights the master blender's craft.

**Three.js Canvas — Fluid Simulation**:
- Uses a ping-pong FBO (framebuffer object) technique for 2D fluid simulation
- Two custom GLSL shaders: `advection.glsl` and `splat.glsl`
- Scroll progress triggers color "splats" at randomized UV positions
- Color palette: Assam (dark amber) + Darjeeling (pale gold) + Nilgiri (red-brown)

**Alternative (Simpler Approach if FBO complexity is too high)**:
- Use a `ShaderMaterial` on a plane with animated `uProgress`
- Voronoi noise pattern driven by scroll for a "mixing" visual

**GSAP ScrollTrigger — Content**:
```js
gsap.from(".blend-stat", {
  textContent: 0,
  snap: { textContent: 1 },
  duration: 2,
  scrollTrigger: {
    trigger: "#blend-section",
    start: "30% center",
    toggleActions: "play none none reset"
  }
});
```

**Content**:
- `h2`: *"The art of the blend is the science of memory"*
- Blend ratio visualization (animated donut/arc chart using SVG + GSAP)
- Master Blender profile: Name, years of experience, a single quote

---

### ACT 6 — Cup Section (`0.82 – 0.95`)

**Visual Goal**: The payoff. A beautifully lit 3D ceramic cup of tea appears. Steam rises in hypnotic wisps. The brand mark is subtly embossed on the cup. The user feels warmth, arrival, completion.

**Three.js Canvas** (`TeaCupModel.jsx` + `SteamParticles.jsx`):
- Load `.glb` model of a handcrafted ceramic cup using `useGLTF` from Drei
- Cup material: `MeshPhysicalMaterial` with roughness=0.3, metalness=0.0, ceramic-like surface
- Liquid inside: Separate plane geometry with animated refraction shader (simulated tea surface)
- Steam: `Points` system — ~300 particles starting above cup rim
  - Each particle: Y-velocity with sine wiggle on X (drift), fades out at top
  - Driven by `uTime` and `uProgress` uniforms

**Cup Reveal Animation**:
```js
const cupTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#cup-section",
    start: "top bottom",
    end: "center center",
    scrub: 2,
  }
});

cupTl
  .from(cupMeshRef.current.position, { y: -3, duration: 1 })
  .from(cupMeshRef.current.rotation, { y: Math.PI, duration: 1.5 }, 0)
  .from(".cup-label-text", {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: "back.out(1.7)"
  }, 0.5);
```

**Ambient Lighting**:
- Warm point light `0xFFA050` at `(3, 5, 5)` — simulates golden hour
- Hemisphere light `0xFFE4B5` / `0x2C1A0E` for ambient warmth

**Content**:
- `h2`: *"One cup. A thousand years of craft."*
- Flavor note tags: Malty · Floral · Brisk · Muscatel · Earthy
- "Brew Guide" toggle — expands a panel with water temp, steep time, ratio

---

### ACT 7 — CTA Section (`0.95 – 1.00`)

**Visual Goal**: Clean, elegant end panel. Dark background with gold accents. Two clear calls to action.

**Animations**:
- Simple fade and translate-Y reveal via GSAP `ScrollTrigger` with `toggleActions`
- Hover on CTA buttons: GSAP `mouseenter` / `mouseleave` micro-animations (scale, glow border)

**Content**:
- `h2`: *"Begin your journey with Indra's leafs & fragrances"*
- CTA 1 (Primary): "Shop Our Teas" → `/shop`
- CTA 2 (Secondary): "Visit Our Estate" → `/estate`
- Social links: Instagram · WhatsApp · Newsletter sign-up
- Footer: Region sourcing map, certifications (ISO, Rainforest Alliance, Organic India)

---

## 6. Shared Systems & Utilities

### Smooth Scroll + GSAP Sync
All `ScrollTrigger` instances MUST use `ScrollTrigger.scrollerProxy` or be initialized after Lenis is ready. The recommended pattern:

```js
// hooks/useGSAPTimeline.js
import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function useGSAPTimeline(buildFn, deps = []) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      buildFn();
    });
    return () => ctx.revert();
  }, deps);
}
```

### Three.js ↔ GSAP Bridge
Use a GSAP proxy object to drive Three.js uniforms / positions from scroll:

```js
// animations/particleTimeline.js
const proxy = { progress: 0 };

ScrollTrigger.create({
  trigger: "#section-id",
  start: "top bottom",
  end: "bottom top",
  scrub: 2,
  onUpdate: (self) => {
    proxy.progress = self.progress;
    mesh.material.uniforms.uProgress.value = proxy.progress;
  }
});
```

### Performance Guidelines
- **Mobile**: Reduce particle count by 60%; disable fluid simulation; use static image fallbacks for 3D scenes
- **Reduced Motion**: Respect `prefers-reduced-motion` — disable all parallax and physics; use simple fades only
- **Asset Loading**: Use GSAP `gsap.registerEffect` after all assets are loaded via a Suspense boundary
- **Canvas**: Use a single shared `<Canvas>` from R3F mounted at the root; scenes are toggled via `visible` prop, not mounted/unmounted
- **Textures**: Compress all textures with `basis-universal` format (.ktx2); use Draco compression for .glb models

---

## 7. Agent Instructions

### For Code-Generation Agents

When implementing sections:
1. **Always read `scrollMap.js`** to get the normalized progress range for the current section
2. **Always use `gsap.context()`** for cleanup — never raw `gsap.to()` calls outside a context
3. **Three.js uniforms** must be declared in the shader AND initialized in the material before use
4. **Do not hardcode colors** — import from `constants/brand.js` at all times
5. **SplitText** requires the element to be fully rendered in the DOM before splitting; wrap in `useLayoutEffect`
6. When using `ScrollTrigger.scrub`, prefer `scrub: 1.5` or `scrub: 2` for cinematic feel — avoid `scrub: true`

### For Design/Asset Agents

- All 3D models should be provided in `.glb` format with Draco compression
- Textures: provide both `.webp` (diffuse) and `.png` (alpha/normal) at 1024×1024 minimum
- The India map for ACT 1 should be an SVG with named path IDs for Assam, Darjeeling, and Nilgiri regions
- Steam particles texture: grayscale soft puff, 128×128, seamless on Y-axis

### For QA/Testing Agents

- Test scroll performance at 60fps on a mid-range device (simulate with Chrome DevTools throttling)
- Verify `prefers-reduced-motion` fallback activates correctly
- Confirm all GSAP contexts are reverted on component unmount (no memory leaks)
- Validate that Three.js canvas does not flicker during section transitions
- Test on Safari (WebKit) — verify GSAP `SplitText` line wrapping is consistent

---

## 8. Asset Sources

This section documents all approved external asset sources for photography, textures, 3D models, and maps. Follow the **licensing tier** guidelines — use **Prototype** sources during development and swap in **Production** sources before the final build.

---

### 8.1 Photography — Tea Estates, Harvest & People

Used in: Hero background, Harvest section hand imagery, CTA section atmosphere.

| Source | URL | License | Tier |
|---|---|---|---|
| **Unsplash** | [unsplash.com](https://unsplash.com) | Free, no attribution required | Prototype |
| **Pexels** | [pexels.com](https://pexels.com) | Free commercial use | Prototype |
| **Adobe Stock** | [stock.adobe.com](https://stock.adobe.com) | Paid — Standard or Extended license | Production |
| **Getty Images** | [gettyimages.com](https://gettyimages.com) | Paid — Editorial or Commercial license | Production |

**Search keywords**: `Assam tea garden`, `Darjeeling tea estate`, `tea picker hands`, `Nilgiri hills mist`, `Indian tea harvest`, `tea leaves close-up`

> ⚠️ **Important**: Verify model releases on any photo showing identifiable workers before using in production. Adobe Stock and Getty both filter for this.

---

### 8.2 India Map SVG — Origin Section (ACT 1)

Used in: Three.js plane texture for the region zoom animation. SVG must have named path IDs for Assam, Darjeeling, and Nilgiri regions.

| Source | URL | License | Format |
|---|---|---|---|
| **Natural Earth** | [naturalearthdata.com](https://www.naturalearthdata.com) | Public domain | Shapefile → SVG |
| **GADM** | [gadm.org](https://gadm.org) | Free for non-commercial; license for commercial | Shapefile → SVG |
| **Wikimedia Commons** | [commons.wikimedia.org](https://commons.wikimedia.org) | CC-BY / Public domain (verify per file) | SVG |

**Post-processing**: Convert shapefiles using [mapshaper.org](https://mapshaper.org) → export as SVG → manually add `id="assam"`, `id="darjeeling"`, `id="nilgiri"` to the relevant `<path>` elements for GSAP targeting.

---

### 8.3 3D Textures & PBR Materials

Used in: Tea cup ceramic surface, terrain heightmap, leaf alpha maps, mist overlay.

| Source | URL | License | Formats |
|---|---|---|---|
| **Poly Haven** | [polyhaven.com](https://polyhaven.com) | CC0 — fully free | `.hdr`, `.exr`, `.png`, `.jpg` |
| **AmbientCG** | [ambientcg.com](https://ambientcg.com) | CC0 — fully free | `.png`, `.webp` (PBR sets) |
| **Textures.com** | [textures.com](https://textures.com) | Free tier (15 downloads/day) + paid | `.jpg`, `.png` |

**Recommended downloads**:
- `Ceramic tiles` or `Porcelain` — for tea cup `MeshPhysicalMaterial`
- `Ground grass` or `Hillside terrain` — for garden section displacement map
- `Fabric weave` or `Paper` — for mist / fog overlay alpha

**Compression**: All textures must be converted to `.ktx2` using [Basis Universal](https://github.com/BinomialLLC/basis_universal) before committing to `public/assets/textures/`.

---

### 8.4 HDRI Environment Maps

Used in: `@react-three/drei` `<Environment>` component for scene lighting in the Garden and Cup sections.

| Source | URL | License | Recommended File |
|---|---|---|---|
| **Poly Haven** | [polyhaven.com/hdris](https://polyhaven.com/hdris) | CC0 | `overcast_soil_puresky_1k.hdr` or `kloppenheim_06_1k.hdr` |
| **HDRI Haven** *(legacy)* | Merged into Poly Haven | CC0 | — |

**Usage in R3F**:
```jsx
// CanvasLayout.jsx
import { Environment } from "@react-three/drei";

<Environment files="/assets/textures/overcast_highlands_1k.hdr" />
```

---

### 8.5 3D Models — Tea Cup (.glb)

Used in: `TeaCupModel.jsx` — the hero prop of ACT 6 (Cup Section).

| Source | URL | License | Notes |
|---|---|---|---|
| **Sketchfab** | [sketchfab.com](https://sketchfab.com) | Varies — filter by CC or Editorial | Search: `ceramic cup`, `tea mug`, `Japanese teacup` |
| **TurboSquid** | [turbosquid.com](https://turbosquid.com) | Royalty-free (paid) | Higher quality, production-ready |
| **CGTrader** | [cgtrader.com](https://cgtrader.com) | Royalty-free (paid) | Good range of ceramic models |
| **Custom Commission** | — | Full ownership | Recommended for final brand-embossed cup |

**Model requirements**:
- Format: `.glb` with **Draco compression** applied
- Poly count: ≤ 15,000 triangles for real-time performance
- Must include separate mesh for liquid surface (for refraction shader)
- Brand mark embossed as a normal map detail, not geometry

---

### 8.6 Video Loops — Ambient Backgrounds

Used in: Mobile fallback for Hero and Garden sections (replacing 3D canvas on low-powered devices).

| Source | URL | License | Format |
|---|---|---|---|
| **Pexels Video** | [pexels.com/videos](https://pexels.com/videos) | Free commercial use | `.mp4` |
| **Mixkit** | [mixkit.co](https://mixkit.co) | Free (Mixkit License) | `.mp4` |
| **Artgrid** | [artgrid.io](https://artgrid.io) | Subscription-based | `.mp4`, `.mov` (4K) |

**Search keywords**: `tea garden drone`, `misty mountains India`, `tea picking slow motion`, `steam rising cup`

**Optimization**: Encode all video loops to H.264 at 720p for web; strip audio track. Use `<video autoPlay muted loop playsInline>` attributes.

---

### 8.7 AI-Generated Placeholder Assets

During active development, AI-generated images may be used as placeholder assets for any section. These must be replaced with licensed photography or commissioned art before production launch.

| Tool | Usage | Status |
|---|---|---|
| **Antigravity Image Generation** | Concept art, placeholder section imagery, texture concepts | ✅ Available in-session |
| **Midjourney** | High-fidelity concept renders for client presentations | Manual, external |
| **Adobe Firefly** | Background generation with commercial license | External |

> ⚠️ **Policy**: AI-generated images must be clearly tagged with `<!-- AI_PLACEHOLDER -->` comments in JSX and tracked in the asset manifest. All must be replaced before the production build.

---

### 8.8 Asset Manifest & Tracking

Maintain a running list of all production-ready assets in `public/assets/ASSET_MANIFEST.md` with columns:

| Column | Description |
|---|---|
| `file` | Relative path within `public/assets/` |
| `source` | Where it was obtained |
| `license` | License type |
| `licensed_for` | `prototype` or `production` |
| `replace_before_launch` | `true` / `false` |

---

## 9. Key Brand Copy — Reference Sheet

| Section | Headline | Tagline / Subtext |
|---|---|---|
| Hero | "Indra's leafs & fragrances" | *"From the highlands. Into your soul."* |
| Origin | "Born of the Earth" | *"Three regions. One heritage."* |
| Garden | "The Garden Remembers" | *"Where every leaf tells the story of its soil."* |
| Harvest | "Two Leaves and a Bud" | *"The oldest rule in tea. The finest result."* |
| Process | "Craft Over Speed" | *"Four steps. No shortcuts. No compromises."* |
| Blend | "The Master's Hand" | *"The art of the blend is the science of memory."* |
| Cup | "The Perfect Cup" | *"One cup. A thousand years of craft."* |
| CTA | "Begin Your Journey" | *"Begin your journey with Indra's leafs & fragrances."* |

---

## 10. Open Questions & Future Iterations

- [x] Brand name confirmed: **Indra's leafs & fragrances**
- [ ] Decide on ambient audio: field sounds during garden section, subtle sitar motif on hero
- [ ] Determine whether the `Blend` fluid simulation uses full FBO or shader-based approximation
- [ ] Source `.glb` model for the ceramic tea cup (commission or use Sketchfab license)
- [ ] Confirm GSAP Club GreenSock license for `SplitText` and `MorphSVG` plugins
- [ ] Mobile breakpoint strategy: full 3D canvas vs. video fallback vs. image-based scroll
- [ ] Accessibility review: keyboard navigation for scroll sections, ARIA labels on canvas
- [ ] Define e-commerce integration: Shopify Storefront API or custom backend

---

*Last updated: June 2026 · Maintained by the Indra's leafs & fragrances development team*
