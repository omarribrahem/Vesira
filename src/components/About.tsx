import { useLang } from '../i18n/LangContext';
import { Reveal } from './Reveal';
import { MarketingPhoto } from './MarketingPhoto';

export function About() {
  const { t } = useLang();

  return (
    <section className="about section section--light" id="about">
      <div className="wrap split-layout">
        <Reveal className="split-copy">
          <h2 className="section-title">{t.about.title}</h2>
          <p className="section-text">{t.about.text}</p>
        </Reveal>
        <Reveal className="split-media" delay={120}>
          <div className="media-frame">
            <MarketingPhoto name={t.about.photo} sizes="(max-width: 1080px) 92vw, 44vw" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
