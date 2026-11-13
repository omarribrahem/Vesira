import { useLang } from '../i18n/LangContext';
import { EMAIL_HREF, INSTAGRAM_HREF } from '../i18n/strings';
import { Reveal } from './Reveal';

export function Contact() {
  const { t } = useLang();

  return (
    <section className="contact section section--light" id="contact">
      <div className="wrap contact-grid">
        <Reveal className="contact-copy">
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-text">{t.contact.text}</p>
          <div className="contact-actions">
            <a href={EMAIL_HREF} className="btn btn--primary">
              {t.contact.emailCta}
            </a>
            <a
              href={INSTAGRAM_HREF}
              target="_blank"
              rel="noopener"
              className="btn btn--ghost"
            >
              {t.contact.instagramCta}
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="site-footer wrap">
        <p>© 2026 VASIRA — {t.contact.footerNote}</p>
      </footer>
    </section>
  );
}
