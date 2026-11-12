import { useLang } from '../i18n/LangContext';
import { EMAIL_HREF } from '../i18n/strings';
import { Lighthouse } from './Lighthouse';

export function Hero() {
  const { t } = useLang();

  return (
    <section className="hero section" id="home">
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span aria-hidden="true" />
            <p>{t.hero.eyebrow}</p>
          </div>
          <h1 className="hero-title">
            <span>{t.hero.line1}</span>
            <span>{t.hero.line2}</span>
            <span className="gold-accent">{t.hero.line3}</span>
          </h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <a href={EMAIL_HREF} className="btn btn--primary">
              {t.hero.cta1}
              <b aria-hidden="true">↗</b>
            </a>
            <a href="#services" className="btn btn--ghost">
              {t.hero.cta2}
              <b aria-hidden="true">↗</b>
            </a>
          </div>
        </div>

        <div className="hero-art">
          <Lighthouse />
        </div>
      </div>
    </section>
  );
}
