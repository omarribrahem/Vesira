type Lang = 'en' | 'ar';

/** Keys of the six service-related photographs in public/images/marketing. */
type PhotoKey = 'planning' | 'production' | 'social' | 'brandDesign' | 'paid' | 'performance';

/** All visible, translatable site copy. Keeping the shape identical for both
 *  locales makes a missing translation a type error instead of a blank label. */
interface Strings {
  title: string;
  description: string;
  nav: {
    about: string;
    services: string;
    media: string;
    markets: string;
    contact: string;
    cta: string;
    menu: string;
  };
  hero: {
    eyebrow: string;
    line1: string;
    line2: string;
    line3: string;
    description: string;
    cta1: string;
    cta2: string;
    artLabel: string;
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    facts: Array<{ strong: string; label: string }>;
    photo: PhotoKey;
  };
  services: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; text: string; photo: PhotoKey }>;
  };
  media: {
    eyebrow: string;
    title: string;
    text: string;
    photo: PhotoKey;
  };
  photos: Record<PhotoKey, { stem: string; alt: string }>;
  markets: {
    eyebrow: string;
    title: string;
    items: Array<{ title: string; text: string }>;
  };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    emailCta: string;
    instagramCta: string;
    footerNote: string;
  };
}

const en: Strings = {
  title: 'VASIRA — Growth Begins With Vision',
  description:
    'VASIRA is an independent marketing and growth partner for brands in Egypt and Saudi Arabia. Strategy, creative, social and performance under one roof.',
  nav: {
    about: 'About',
    services: 'Services',
    media: 'Paid media',
    markets: 'Markets',
    contact: 'Contact',
    cta: 'Start a project',
    menu: 'Menu',
  },
  hero: {
    eyebrow: 'Independent marketing & growth partner',
    line1: 'Strategy.',
    line2: 'Growth.',
    line3: 'Impact.',
    description:
      'VASIRA turns vision into a premium brand presence through strategy, content, design and performance-driven execution.',
    cta1: 'Start a project',
    cta2: 'Explore services',
    artLabel: 'The VASIRA mark as a lighthouse: two dark planes forming a V, a warm light rising from the point where they meet.',
  },
  about: {
    eyebrow: 'About VASIRA',
    title: 'A marketing partner built for premium brands and ambitious growth.',
    text: 'We craft strategy, creative direction and execution that feel elevated, modern and commercially smart — with a focused understanding of Egypt and Saudi Arabia.',
    facts: [
      { strong: 'EG', label: 'Egypt, a primary market' },
      { strong: 'KSA', label: 'Saudi Arabia, a primary market' },
      { strong: '04', label: 'Service pillars, one team' },
    ],
    photo: 'planning',
  },
  services: {
    eyebrow: 'What we do',
    title: 'Four pillars, one focused team.',
    items: [
      {
        title: 'Brand Strategy',
        text: 'Positioning, messaging, growth planning and market-led direction.',
        photo: 'brandDesign',
      },
      {
        title: 'Creative & Content',
        text: 'Visual campaigns, content systems and art direction built to stand out.',
        photo: 'production',
      },
      {
        title: 'Social & Media',
        text: 'Smart channel planning, paid media and always-on communication.',
        photo: 'social',
      },
      {
        title: 'Performance Growth',
        text: 'Optimization, conversion thinking and measurable progress across the funnel.',
        photo: 'performance',
      },
    ],
  },
  media: {
    eyebrow: 'Paid advertising',
    title: 'Paid media, planned and bought with intent.',
    text: 'We plan, buy and optimise paid campaigns across social and search — clear targeting, tested creative, and spend that follows the numbers that matter.',
    photo: 'paid',
  },
  photos: {
    planning: {
      stem: '01-campaign-strategy',
      alt: 'Marketing collaborators planning a campaign around a table.',
    },
    production: {
      stem: '02-product-production',
      alt: 'Camera and lighting arranged for a product photography session.',
    },
    social: {
      stem: '03-social-content',
      alt: 'A smartphone recording a tabletop product demonstration.',
    },
    brandDesign: {
      stem: '04-brand-design',
      alt: 'A designer comparing colour swatches and visual concepts.',
    },
    paid: {
      stem: '05-paid-campaigns',
      alt: 'A marketer comparing advertising creative on a laptop.',
    },
    performance: {
      stem: '06-performance-review',
      alt: 'Two collaborators reviewing campaign material together.',
    },
  },
  markets: {
    eyebrow: 'Market focus',
    title: 'Egypt and Saudi Arabia, with messaging shaped for each context.',
    items: [
      {
        title: 'Egypt',
        text: 'Audience-first campaigns, locally relevant storytelling and strong social execution.',
      },
      {
        title: 'Saudi Arabia',
        text: 'Premium brand positioning, culturally aware creative and focused growth strategy.',
      },
    ],
  },
  contact: {
    eyebrow: 'Let’s talk',
    title: 'Start the conversation.',
    text: 'Tell us about your brand and where you want it to go — we reply with next steps.',
    emailCta: 'Email VASIRA',
    instagramCta: 'Instagram',
    footerNote: 'Growth begins with vision.',
  },
};

const ar: Strings = {
  title: 'VASIRA — النمو يبدأ بالرؤية',
  description:
    'فاسيرا شريك مستقل في التسويق والنمو للعلامات في مصر والسعودية: استراتيجية وإبداع وسوشيال وأداء في مكان واحد.',
  nav: {
    about: 'عن فاسيرا',
    services: 'الخدمات',
    media: 'الإعلانات المدفوعة',
    markets: 'الأسواق',
    contact: 'تواصل',
    cta: 'ابدأ مشروعك',
    menu: 'القائمة',
  },
  hero: {
    eyebrow: 'شريك مستقل في التسويق والنمو',
    line1: 'استراتيجية.',
    line2: 'نمو.',
    line3: 'تأثير.',
    description:
      'تحوّل فاسيرا الرؤية إلى حضور براندي راقٍ من خلال الاستراتيجية والمحتوى والتصميم والتنفيذ المعتمد على الأداء.',
    cta1: 'ابدأ مشروعك',
    cta2: 'استكشف الخدمات',
    artLabel: 'علامة فاسيرا كمنارة: سطحان داكنان يشكلان حرف V ينبع منه ضوء دافئ من نقطة الالتقاء.',
  },
  about: {
    eyebrow: 'عن فاسيرا',
    title: 'شريك تسويقي مبني للعلامات الراقية والنمو الطموح.',
    text: 'نصنع الاستراتيجية والتوجيه الإبداعي والتنفيذ بأسلوب حديث واحترافي وذكي تجاريًا، مع فهم دقيق للسوقين المصري والسعودي.',
    facts: [
      { strong: 'EG', label: 'مصر، سوق أساسي' },
      { strong: 'KSA', label: 'السعودية، سوق أساسي' },
      { strong: '04', label: 'ركائز خدمية، وفريق واحد' },
    ],
    photo: 'planning',
  },
  services: {
    eyebrow: 'ماذا نقدم',
    title: 'أربع ركائز وفريق واحد يركز على علامتك.',
    items: [
      {
        title: 'استراتيجية العلامة',
        text: 'تموضع ورسائل وخطط نمو وتوجيه مبني على فهم السوق.',
        photo: 'brandDesign',
      },
      {
        title: 'الإبداع والمحتوى',
        text: 'حملات بصرية وأنظمة محتوى وتوجيه فني يجعل العلامة ملفتة.',
        photo: 'production',
      },
      {
        title: 'السوشيال والميديا',
        text: 'تخطيط ذكي للقنوات وتواصل مستمر يبقي العلامة حاضرة.',
        photo: 'social',
      },
      {
        title: 'نمو الأداء',
        text: 'تحسين النتائج والتفكير في التحويل وقياس التطور عبر المسار كاملًا.',
        photo: 'performance',
      },
    ],
  },
  media: {
    eyebrow: 'الإعلانات المدفوعة',
    title: 'إعلانات مدفوعة بنية واضحة، لا بالتخمين.',
    text: 'نخطط لحملاتنا المدفوعة على الشبكات الاجتماعية والبحث ونشتريها ونحسّنها: استهداف واضح، وإبداع مُختبَر، وإنفاق يتبع الأرقام المهمة.',
    photo: 'paid',
  },
  photos: {
    planning: {
      stem: '01-campaign-strategy',
      alt: 'فريق بيخطط لحملة تسويقية حول طاولة.',
    },
    production: {
      stem: '02-product-production',
      alt: 'كاميرا وإضاءة مجهّزين لتصوير منتج.',
    },
    social: {
      stem: '03-social-content',
      alt: 'موبايل بيصوّر عرضًا لمنتج على طاولة.',
    },
    brandDesign: {
      stem: '04-brand-design',
      alt: 'مصمم بيراجع درجات ألوان وأفكار بصرية.',
    },
    paid: {
      stem: '05-paid-campaigns',
      alt: 'متخصص تسويق بيراجع تصميمات إعلانية على لابتوب.',
    },
    performance: {
      stem: '06-performance-review',
      alt: 'شخصان بيراجعوا مواد حملة تسويقية معًا.',
    },
  },
  markets: {
    eyebrow: 'تركيز الأسواق',
    title: 'مصر والسعودية، برسائل مصممة حسب طبيعة كل سوق.',
    items: [
      {
        title: 'مصر',
        text: 'حملات قريبة من الجمهور المحلي، وقصص مناسبة للسوق، وتنفيذ قوي على السوشيال.',
      },
      {
        title: 'السعودية',
        text: 'تموضع براندي راقٍ، وإبداع واعٍ ثقافيًا، واستراتيجية نمو مركزة.',
      },
    ],
  },
  contact: {
    eyebrow: 'لنتواصل',
    title: 'ابدأ الحوار.',
    text: 'حدّثنا عن علامتك وإلى أين تريدها أن تصل — وسنرد عليك بالخطوات التالية.',
    emailCta: 'راسل فاسيرا',
    instagramCta: 'إنستغرام',
    footerNote: 'النمو يبدأ بالرؤية.',
  },
};

export type { Lang, Strings };
export const strings: Record<Lang, Strings> = { en, ar };
export const EMAIL_HREF =
  'mailto:Vasiramarketing@gmail.com?subject=VASIRA%20Project';
export const EMAIL_ADDRESS = 'Vasiramarketing@gmail.com';
export const INSTAGRAM_HREF = 'https://www.instagram.com/vasiramarketing/';
