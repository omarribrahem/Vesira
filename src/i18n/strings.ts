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
  title: 'VASIRA | Growth Begins With Vision',
  description:
    'VASIRA is a digital marketing partner for brands in Egypt and Saudi Arabia. Strategy, creative, social and performance under one roof.',
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
    eyebrow: 'Marketing & growth partner',
    line1: 'Growth begins',
    line2: 'with vision.',
    line3: '',
    description:
      'Strategy, creative, social and performance marketing for brands in Egypt and Saudi Arabia.',
    cta1: 'Start a project',
    cta2: 'Explore services',
    artLabel: 'The VASIRA mark as a lighthouse: two dark planes forming a V, a warm light rising from the point where they meet.',
  },
  about: {
    eyebrow: 'About',
    title: 'Built for brands growing in Egypt and Saudi Arabia.',
    text: 'One team handling strategy, creative direction and campaign execution, shaped around how each market buys.',
    photo: 'planning',
  },
  services: {
    eyebrow: 'Services',
    title: 'Four pillars, one team.',
    items: [
      {
        title: 'Brand Strategy',
        text: 'Positioning, messaging and market direction.',
        photo: 'brandDesign',
      },
      {
        title: 'Creative & Content',
        text: 'Campaigns, visual identity and art direction.',
        photo: 'production',
      },
      {
        title: 'Social & Media',
        text: 'Channel planning, content publishing and paid reach.',
        photo: 'social',
      },
      {
        title: 'Performance Growth',
        text: 'Conversion tracking, testing and campaign optimization.',
        photo: 'performance',
      },
    ],
  },
  media: {
    eyebrow: 'Paid media',
    title: 'Targeted campaigns across social and search.',
    text: 'Clear audience targeting, tested creative and budget allocation tied to real results.',
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
    eyebrow: 'Markets',
    title: 'Focused on Egypt and Saudi Arabia.',
    items: [
      {
        title: 'Egypt',
        text: 'Local audience insight, storytelling and social execution.',
      },
      {
        title: 'Saudi Arabia',
        text: 'Brand positioning, culturally grounded creative and growth planning.',
      },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Start a project.',
    text: 'Send us a note about your brand by email or Instagram.',
    emailCta: 'Email VASIRA',
    instagramCta: 'Instagram',
    footerNote: 'Growth begins with vision.',
  },
};

const ar: Strings = {
  title: 'VASIRA | النمو يبدأ بالرؤية',
  description:
    'فاسيرا شريك تسويق رقمي للعلامات التجارية في مصر والسعودية: الاستراتيجية والإبداع والسوشيال والأداء في مكان واحد.',
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
    eyebrow: 'شريك التسويق والنمو',
    line1: 'النمو يبدأ',
    line2: 'بالرؤية.',
    line3: '',
    description:
      'تسويق متكامل في الاستراتيجية والمحتوى والإعلانات للعلامات التجارية في مصر والسعودية.',
    cta1: 'ابدأ مشروعك',
    cta2: 'استكشف الخدمات',
    artLabel: 'علامة فاسيرا كمنارة: سطحان داكنان يشكلان حرف V ينبع منه ضوء دافئ من نقطة الالتقاء.',
  },
  about: {
    eyebrow: 'عن فاسيرا',
    title: 'شريك تسويقي للعلامات التجارية في مصر والسعودية.',
    text: 'فريق واحد يجمع بين الاستراتيجية والتوجيه الإبداعي وتنفيذ الحملات بما يناسب طبيعة كل سوق.',
    photo: 'planning',
  },
  services: {
    eyebrow: 'الخدمات',
    title: 'أربع ركائز، فريق واحد.',
    items: [
      {
        title: 'استراتيجية العلامة',
        text: 'التموضع والرسائل وتوجيه النمو في السوق.',
        photo: 'brandDesign',
      },
      {
        title: 'الإبداع والمحتوى',
        text: 'الحملات البصرية، أنظمة المحتوى والتوجيه الفني.',
        photo: 'production',
      },
      {
        title: 'السوشيال والميديا',
        text: 'تخطيط القنوات، إدارة المحتوى والوصول المدفوع.',
        photo: 'social',
      },
      {
        title: 'نمو الأداء',
        text: 'تحسين التحويلات، الاختبار المستمر وتطوير النتائج.',
        photo: 'performance',
      },
    ],
  },
  media: {
    eyebrow: 'الإعلانات المدفوعة',
    title: 'حملات مدفوعة على السوشيال ومحركات البحث.',
    text: 'استهداف واضح، اختبار مستمر للإعلانات، وتوزيع للميزانية حسب النتائج الفعلية.',
    photo: 'paid',
  },
  photos: {
    planning: {
      stem: '01-campaign-strategy',
      alt: 'فريق يخطط لحملة تسويقية حول طاولة.',
    },
    production: {
      stem: '02-product-production',
      alt: 'كاميرا وإضاءة مجهزتان لتصوير منتج.',
    },
    social: {
      stem: '03-social-content',
      alt: 'هاتف يصور عرضًا لمنتج على طاولة.',
    },
    brandDesign: {
      stem: '04-brand-design',
      alt: 'مصمم يراجع درجات ألوان وأفكارًا بصرية.',
    },
    paid: {
      stem: '05-paid-campaigns',
      alt: 'مختص تسويق يراجع تصميمات إعلانية على حاسوب محمول.',
    },
    performance: {
      stem: '06-performance-review',
      alt: 'عضوان من الفريق يراجعان مواد حملة تسويقية معًا.',
    },
  },
  markets: {
    eyebrow: 'الأسواق',
    title: 'نركز على مصر والسعودية.',
    items: [
      {
        title: 'مصر',
        text: 'حملات قريبة من الجمهور المحلي وتنفيذ قوي على السوشيال.',
      },
      {
        title: 'السعودية',
        text: 'تموضع واضح للعلامة وإبداع مناسب للثقافة المحلية وخطة نمو مركزة.',
      },
    ],
  },
  contact: {
    eyebrow: 'تواصل',
    title: 'ابدأ مشروعك.',
    text: 'أرسل لنا تفاصيل علامتك عبر البريد الإلكتروني أو إنستغرام.',
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
