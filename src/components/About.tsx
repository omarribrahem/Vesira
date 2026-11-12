import { useLang } from '../i18n/LangContext';
import { Reveal } from './Reveal';
import { MarketingPhoto } from './MarketingPhoto';
import ScrollReveal from './reactbits/ScrollReveal';

export function About() {
  const { t } = useLang();

  return (
    <section className="about section section--light" id="about">
      <div className="wrap split-layout">
        <Reveal className="split-copy">
          <div className="eyebrow eyebrow--dark">
            <span aria-hidden="true" />
            <p>{t.about.eyebrow}</p>
          </div>
          <ScrollReveal
            containerClassName="section-title scroll-reveal--heading"
            mode="enter"
            splitBy="words"
            effect="fade"
            stagger={0.07}
            duration={0.9}
            baseOpacity={0.14}
            baseRotation={2.5}
            baseOffset={6}
            highlightColor="var(--gold)"
          >
            {t.about.title}
          </ScrollReveal>
          <p className="section-text">{t.about.text}</p>
          <dl className="facts-row">
            {t.about.facts.map((fact) => (
              <div key={fact.strong} className="fact">
                <dt className="fact-strong">{fact.strong}</dt>
                <dd className="fact-label">{fact.label}</dd>
              </div>
            ))}
          </dl>
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
