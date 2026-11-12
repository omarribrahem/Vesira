import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Media } from './components/Media';
import { Markets } from './components/Markets';
import { Contact } from './components/Contact';
import GlowCursor from './components/reactbits/GlowCursor';

/** One page, five anchored sections. The header handles language and the menu.
 *  Owner-approved animation wave (2026-11-10): GlowCursor wraps the two dark
 *  sections (ivory sections keep the fixed cursor behaviour); it inherits the
 *  section sizing via the --section modifier so overlays still position. */
export default function App() {
  return (
    <>
      <div className="page-aura" aria-hidden="true" />
      <SiteHeader />
      <main>
        <GlowCursor
          className="glow-cursor--section"
          color="#d4ae72"
          intensity={0.9}
          trailWidth={2.4}
          linger={1.1}
          glow={0.8}
          hotspot={0.6}
          followSpeed={0.55}
          quality="medium"
          clickBurst
        >
          <Hero />
        </GlowCursor>
        <About />
        <Services />
        <Media />
        <GlowCursor
          className="glow-cursor--section"
          color="#d4ae72"
          intensity={0.9}
          trailWidth={2.4}
          linger={1.1}
          glow={0.8}
          hotspot={0.6}
          followSpeed={0.55}
          quality="medium"
          clickBurst
        >
          <Markets />
        </GlowCursor>
        <Contact />
      </main>
    </>
  );
}
