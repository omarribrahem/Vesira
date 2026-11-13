import gsap from 'gsap';

let activeScrollTween: gsap.core.Tween | null = null;

/**
 * Animated smooth scroll to a given section ID with fluid deceleration,
 * interruption safety, accessible focus management, and reduced-motion fallback.
 */
export function smoothScrollTo(targetId: string, onComplete?: () => void): void {
  const id = targetId.replace(/^#/, '');
  const isTop = id === 'home' || id === '';
  const element = isTop ? document.documentElement : document.getElementById(id);

  if (!element && !isTop) return;

  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header offset: 88px on desktop, 76px on mobile/tablet
  const isMobile = window.innerWidth <= 960;
  const headerOffset = isTop ? 0 : (isMobile ? 76 : 88);

  const startY = window.scrollY;
  const targetY = isTop
    ? 0
    : Math.max(0, Math.round(element!.getBoundingClientRect().top + window.scrollY - headerOffset));

  // If already at target, focus and finish
  if (Math.abs(targetY - startY) < 2) {
    if (element && !isTop) {
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
    }
    onComplete?.();
    return;
  }

  // Update URL hash cleanly without instant native jump
  if (id && window.history?.pushState) {
    window.history.pushState(null, '', `#${id}`);
  }

  // Instant scroll if user prefers reduced motion
  if (isReducedMotion) {
    window.scrollTo({ top: targetY, behavior: 'auto' });
    if (element && !isTop) {
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
    }
    onComplete?.();
    return;
  }

  // Stop any in-flight programmatic scroll
  if (activeScrollTween) {
    activeScrollTween.kill();
    activeScrollTween = null;
  }

  const scrollState = { y: startY };
  const distance = Math.abs(targetY - startY);
  // Elegant duration proportional to distance: 0.65s to 1.15s
  const duration = Math.min(1.15, Math.max(0.65, distance / 1600));

  const cancel = () => {
    if (activeScrollTween) {
      activeScrollTween.kill();
      activeScrollTween = null;
    }
    removeInterruptListeners();
  };

  const removeInterruptListeners = () => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchmove', cancel);
  };

  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchmove', cancel, { passive: true });

  activeScrollTween = gsap.to(scrollState, {
    y: targetY,
    duration,
    ease: 'power3.out',
    onUpdate: () => {
      window.scrollTo(0, scrollState.y);
    },
    onComplete: () => {
      removeInterruptListeners();
      activeScrollTween = null;
      if (element && !isTop) {
        element.tabIndex = -1;
        element.focus({ preventScroll: true });
      }
      onComplete?.();
    },
  });
}
