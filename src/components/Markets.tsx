import { useLang } from '../i18n/LangContext';
import { Reveal } from './Reveal';

export function Markets() {
  const { t } = useLang();

  return (
    <section className="markets section" id="markets">
      <div className="markets-lights" aria-hidden="true" />
      <div className="wrap">
        <Reveal className="section-head">
          <h2 className="section-title">{t.markets.title}</h2>
        </Reveal>
        <div className="market-grid">
          {t.markets.items.map((market, index) => (
            <Reveal key={market.title} delay={Math.min(index * 60, 120)}>
              <article className="market-card">
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
