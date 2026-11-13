import { useEffect, useState, useRef, type MouseEvent } from 'react';
import { useLang } from '../i18n/LangContext';
import { BrandMark } from './BrandMark';
import { OceanSound } from './OceanSound';
import { smoothScrollTo } from '../utils/smoothScroll';

const SECTIONS = ['about', 'services', 'media', 'markets', 'contact'] as const;

export function SiteHeader() {
  const { t, toggle, lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const showMenu = open;
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const keyboardOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // One source of truth: closing immediately removes hidden keyboard targets.
  // CSS handles pointer entrance; no stale exit timer can remove a reopened menu.
  const openMenu = () => {
    setOpen(true);
  };
  const closeMenu = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) menuToggleRef.current?.focus();
  };

  useEffect(() => {
    if (!showMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMenu(true);
      }
    };
    const onOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !menuToggleRef.current?.contains(target)) closeMenu();
    };
    const onFrame = () => {
      if (keyboardOpenRef.current) {
        const firstLink = firstLinkRef.current;
        const target = firstLink?.getClientRects().length ? firstLink : menuRef.current?.querySelector<HTMLButtonElement>('.lang-btn');
        target?.focus({ preventScroll: true });
      }
    };
    const raf = window.requestAnimationFrame(onFrame);
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 961px)');
    const onChange = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
        <a
          href="#home"
          className="brand"
          aria-label="VASIRA"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo('home');
          }}
        >
          <BrandMark />
          <span className="brand-name">VASIRA</span>
        </a>

        <nav className="desktop-nav" aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main navigation'}>
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo(id);
              }}
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button
            ref={menuToggleRef}
            type="button"
            className={open ? 'menu-toggle is-open' : 'menu-toggle'}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t.nav.menu}
            onClick={(event) => {
              keyboardOpenRef.current = event.detail === 0;
              if (open) closeMenu(true); else openMenu();
            }}
          >
            <span></span>
            <span></span>
          </button>

        </div>
      </header>

      {showMenu && (
        <nav
          id="mobile-nav"
          ref={menuRef}
          className="mobile-nav"
          data-open={open || undefined}
          aria-label={lang === 'ar' ? 'القائمة' : 'Menu'}
          data-keyboard={keyboardOpenRef.current || undefined}
          onClick={(event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const link = target.closest('a');
            if (link && link.hash) {
              event.preventDefault();
              const hash = link.hash;
              closeMenu();
              smoothScrollTo(hash);
            }
          }}
        >
          {SECTIONS.map((id, index) => (
            <a key={id} href={`#${id}`} ref={index === 0 ? firstLinkRef : undefined}>
              {t.nav[id]}
            </a>
          ))}
          <div className="menu-utilities">
            <button type="button" className="lang-btn" onClick={toggle}
              aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" />
              </svg>
              <span className="control-label">{lang === 'en' ? 'العربية' : 'English'}</span>
            </button>
            <OceanSound />
            <a href="#contact" className="btn btn--primary menu-project">{t.nav.cta}</a>
          </div>
        </nav>
      )}
    </>
  );
}
