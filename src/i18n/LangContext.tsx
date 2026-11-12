import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { strings, type Lang, type Strings } from './strings';

interface LangContextValue {
  lang: Lang;
  t: Strings;
  /** flip between EN and AR */
  toggle: () => void;
}

const LangContext = createContext<LangContextValue | null>(null);

const STORAGE_KEY = 'vasira-lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    /* storage unavailable — default below */
  }
  return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(initialLang);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = strings[lang].title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', strings[lang].description);
    const setMeta = (selector: string, content: string) => document.querySelector(selector)?.setAttribute('content', content);
    setMeta('meta[property="og:title"]', strings[lang].title);
    setMeta('meta[property="og:description"]', strings[lang].description);
    setMeta('meta[property="og:locale"]', lang === 'ar' ? 'ar_EG' : 'en_US');
    setMeta('meta[property="og:locale:alternate"]', lang === 'ar' ? 'en_US' : 'ar_EG');
    setMeta('meta[name="twitter:title"]', strings[lang].title);
    setMeta('meta[name="twitter:description"]', strings[lang].description);
    const share = new URL(`./social/vasira-share-${lang}.png`, document.baseURI).href;
    setMeta('meta[property="og:image"]', share);
    setMeta('meta[name="twitter:image"]', share);
    setMeta('meta[property="og:image:alt"]', lang === 'ar' ? 'فاسيرا — النمو يبدأ بالرؤية. تسويق رقمي في مصر والسعودية.' : 'VASIRA — Growth begins with vision. Digital marketing in Egypt and Saudi Arabia.');
    setMeta('meta[name="twitter:image:alt"]', lang === 'ar' ? 'فاسيرا — النمو يبدأ بالرؤية.' : 'VASIRA — Growth begins with vision.');
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* non-essential */
    }
  }, [lang]);

  const toggle = useCallback(() => {
    setLang((current) => (current === 'en' ? 'ar' : 'en'));
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ lang, t: strings[lang], toggle }),
    [lang, toggle],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
