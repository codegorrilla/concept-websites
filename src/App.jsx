import SmoothScrollLayout from './components/layout/SmoothScrollLayout';
import Navbar from './components/ui/Navbar';
import ScrollProgress from './components/ui/ScrollProgress';
import HeroSection from './components/sections/HeroSection';
import OriginSection from './components/sections/OriginSection';
import GardenSection from './components/sections/GardenSection';
import HarvestSection from './components/sections/HarvestSection';
import ProcessSection from './components/sections/ProcessSection';
import CtaSection from './components/sections/CtaSection';
import './App.css';

export default function App() {
  return (
    <SmoothScrollLayout>
      {/* Fixed UI overlays */}
      <Navbar />
      <ScrollProgress />

      {/* Scroll sections — ordered by AGENTS.md §4 Scroll Map */}
      <main id="main-content" role="main">
        <HeroSection />    {/* ACT 0 — 0.00–0.10 */}
        <OriginSection />  {/* ACT 1 — 0.10–0.25 */}
        <GardenSection />  {/* ACT 2 — 0.25–0.40 */}
        <HarvestSection /> {/* ACT 3 — 0.40–0.52 */}
        <ProcessSection /> {/* ACT 4 — 0.52–0.68 */}
        <CtaSection />     {/* ACT 5 — 0.68–1.00 */}
      </main>
    </SmoothScrollLayout>
  );
}
