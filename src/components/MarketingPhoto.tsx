import { useLang } from '../i18n/LangContext';

type PhotoKey = 'planning' | 'production' | 'social' | 'brandDesign' | 'paid' | 'performance';

interface MarketingPhotoProps {
  name: PhotoKey;
  /** Layout hint so the browser picks the right candidate. */
  sizes: string;
  /** Above-the-fold images load eagerly; everything else lazily. */
  eager?: boolean;
  className?: string;
}

/**
 * One responsive photo surface. The 1536px file is the intrinsic master
 * (3:2); the 768px variant is the mobile candidate. No mirroring in RTL —
 * equipment and screens must not be reversed.
 */
export function MarketingPhoto({ name, sizes, eager = false, className }: MarketingPhotoProps) {
  const { t } = useLang();
  const { stem, alt } = t.photos[name];

  return (
    <img
      className={className}
      src={`./images/marketing/${stem}-1536.jpg`}
      srcSet={`./images/marketing/${stem}-768.jpg 768w, ./images/marketing/${stem}-1536.jpg 1536w`}
      sizes={sizes}
      width={1536}
      height={1024}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
