import { SiteHeader } from './components/SiteHeader';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Media } from './components/Media';
import { Markets } from './components/Markets';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <>
      <div className="page-aura" aria-hidden="true" />
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Services />
        <Markets />
        <Media />
        <Contact />
      </main>
    </>
  );
}
