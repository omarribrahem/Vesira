import { useLang } from '../i18n/LangContext';
import { Reveal } from './Reveal';
import { MarketingPhoto } from './MarketingPhoto';

/** Four service pillars. Each pillar carries one photograph and one short
 *  explanation — one meaningful item per surface, no nested cards. */
export function Services() {
  const { t } = useLang();

  return (
    <section className="services section" id="services">
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="section-title">{t.services.title}</h2>
        </Reveal>
        <div className="service-grid">
          {t.services.items.map((service, index) => (
            <Reveal key={service.title} delay={Math.min(index * 60, 180)}>
              <article className="service-card">
                <div className="service-media">
                  <MarketingPhoto
                    name={service.photo}
                    sizes="(max-width: 820px) 92vw, (max-width: 1080px) 46vw, 22vw"
                  />
                </div>
                <div className="service-body">
                  <h3>{service.title}</h3>
                  <p>{service.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
