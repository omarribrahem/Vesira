import { useLang } from '../i18n/LangContext';
import { EMAIL_HREF } from '../i18n/strings';
import { Lighthouse } from './Lighthouse';
import { smoothScrollTo } from '../utils/smoothScroll';

export function Hero() {
  const { t } = useLang();

  return (
    <section className="hero section" id="home">
      <div className="hero-spotlight" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span>{t.hero.line1}</span>
            <span>{t.hero.line2}</span>
            {t.hero.line3 && <span>{t.hero.line3}</span>}
          </h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <a href={EMAIL_HREF} className="btn btn--primary">
              {t.hero.cta1}
            </a>
            <a
              href="#services"
              className="btn btn--ghost"
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo('services');
              }}
            >
              {t.hero.cta2}
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
