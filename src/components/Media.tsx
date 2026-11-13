import { useLang } from '../i18n/LangContext';
import { Reveal } from './Reveal';
import { MarketingPhoto } from './MarketingPhoto';

/** Paid media, given its own section since paid advertising is bought and
 *  optimised as a distinct discipline, not a footnote inside another pillar. */
export function Media() {
  const { t } = useLang();

  return (
    <section className="media section section--light" id="media">
      <div className="wrap media-layout">
        <Reveal className="media-copy">
          <h2 className="section-title">{t.media.title}</h2>
          <p className="section-text">{t.media.text}</p>
        </Reveal>
        <Reveal className="media-visual" delay={120}>
          <div className="media-frame">
            <MarketingPhoto name={t.media.photo} sizes="(max-width: 1080px) 92vw, 46vw" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
