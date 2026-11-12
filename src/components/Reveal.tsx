import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger between siblings (ms). Keep small; interaction is never delayed. */
  delay?: number;
  as?: 'div';
}

/** Fade-up once when scrolled into view. Keyboard focus is unaffected: the
 *  content is always in the DOM and interactive before/while it animates. */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal();
  const style: CSSProperties | undefined =
    delay > 0 ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref}
      data-visible={visible || undefined}
      className={className ? `reveal ${className}` : 'reveal'}
      style={visible && delay > 0 ? style : undefined}
    >
      {children}
    </div>
  );
}
