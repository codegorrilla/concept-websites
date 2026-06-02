import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import SplitText from 'gsap/SplitText';
import DrawSVGPlugin from 'gsap/DrawSVGPlugin';
import MorphSVGPlugin from 'gsap/MorphSVGPlugin';
import App from './App.jsx';
import './styles/index.css';
import './styles/typography.css';
import './styles/animations.css';

// Register all GSAP plugins — AGENTS.md §3 (all now free/open source)
gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  DrawSVGPlugin,
  MorphSVGPlugin
);

// Global ScrollTrigger defaults
ScrollTrigger.defaults({
  markers: false,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
