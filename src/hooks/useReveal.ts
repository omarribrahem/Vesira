import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element when it first enters the viewport.
 * - Elements already on screen (or in tall/zoomed viewports) are visible on the
 *   first frame through the `.is-visible` fast path — no hidden content.
 * - Below-fold elements get a short fade-up; reduced motion is handled in CSS.
 * - `data-reveal-delay` (ms) staggers siblings; total added delay is capped by
 *   callers and never delays interaction.
 */
export function useReveal(): {
  ref: (node: HTMLElement | null) => void;
  visible: boolean;
} {
  const nodeRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visible, setVisible] = useState(false);

  const ref = (node: HTMLElement | null) => {
    nodeRef.current = node;
  };

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(node);
    observerRef.current = observer;
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
