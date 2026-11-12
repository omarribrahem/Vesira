import { useLang } from '../i18n/LangContext';
import { Reveal } from './Reveal';
import ScrollReveal from './reactbits/ScrollReveal';

export function Markets() {
  const { t } = useLang();

  return (
    <section className="markets section" id="markets">
      <div className="markets-lights" aria-hidden="true" />
      <div className="wrap">
        <Reveal className="section-head">
          <div className="eyebrow">
            <span aria-hidden="true" />
            <p>{t.markets.eyebrow}</p>
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
            {t.markets.title}
          </ScrollReveal>
        </Reveal>
        <div className="market-grid">
          {t.markets.items.map((market, index) => (
            <Reveal key={market.title} delay={Math.min(index * 60, 120)}>
              <article className="market-card">
                <span className="market-num" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{market.title}</h3>
                <p>{market.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
