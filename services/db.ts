
import { Category, SubCategory, Business, HomepageSettings, PageContent } from '../types';
import { DIRECTORY_DATA } from '../constants';

const DB_KEY = 'ppoth_db_v10';
const HOMEPAGE_KEY = 'ppoth_homepage_v2'; 
const PAGES_KEY = 'ppoth_pages_v2'; 

// Initialize DB with seed data if empty
const initDB = (): Category[] => {
  const existing = localStorage.getItem(DB_KEY);
  if (existing) {
    return JSON.parse(existing);
  }
  localStorage.setItem(DB_KEY, JSON.stringify(DIRECTORY_DATA));
  return DIRECTORY_DATA;
};

export const getDirectoryData = (): Category[] => {
  return initDB();
};

export const saveDirectoryData = (data: Category[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(data));
  // Dispatch a custom event so components can react to storage changes
  window.dispatchEvent(new Event('db-change'));
};

// --- Homepage Settings ---

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  heroImages: [
    "https://i.imgur.com/8Q5F5M5.jpeg",
    "https://i.imgur.com/hX3K22h.jpeg"
  ],
  heroVideoUrl: "https://vid.cdn-website.com/e37982c0/videos/6l8vw55sS1OiP5zC7BIY_social_poppageddon_httpss.mj.run4g9dj_oDxf8_show_a_timelapse_of_a_te_1e7cf96d-3222-44f0-b0f8-addb0eb0cd00_0-v.mp4",
  spotlightPartnerId: 'biz_arch_1', // Default ID
  logoUrl: "https://lirp.cdn-website.com/e37982c0/dms3rep/multi/opt/PPOTH-Color-Logo-v1-1thin-1920w.jpg",
  footerLogoUrl: "https://lirp.cdn-website.com/e37982c0/dms3rep/multi/opt/PPOTH-Color-Logo-v1-1thin-1920w.jpg" // Default to same, user can change
};

export const getHomepageSettings = (): HomepageSettings => {
  const existing = localStorage.getItem(HOMEPAGE_KEY);
  if (existing) {
    const settings = JSON.parse(existing);
    // Migration
    if (!settings.logoUrl) settings.logoUrl = DEFAULT_HOMEPAGE_SETTINGS.logoUrl;
    if (!settings.footerLogoUrl) settings.footerLogoUrl = settings.logoUrl || DEFAULT_HOMEPAGE_SETTINGS.footerLogoUrl;
    return settings;
  }
  localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(DEFAULT_HOMEPAGE_SETTINGS));
  return DEFAULT_HOMEPAGE_SETTINGS;
};

export const saveHomepageSettings = (settings: HomepageSettings) => {
  localStorage.setItem(HOMEPAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event('homepage-change'));
};

// --- CMS Page Content ---

const DEFAULT_PAGES: PageContent[] = [
  {
    slug: 'home',
    title: 'The Gold Standard of Hamptons Living',
    subtitle: 'Connecting discerning homeowners with the East End\'s most trusted, vetted, and elite service professionals.',
    body: 'Curated Categories', 
    imageUrl: '' 
  },
  {
    slug: 'about',
    title: 'About Preferred Partners',
    subtitle: 'Excellence in every interaction.',
    body: 'Preferred Partners of the Hamptons (PPOTH) was founded on a simple principle: excellence is the only option. We understand that owning a home in the Hamptons is a privilege that comes with high expectations for maintenance and lifestyle services.\n\nOur directory is not open to everyone. Every business listed here has passed a rigorous vetting process, checking for licensure, insurance, years in business, and most importantly, a track record of white-glove service for high-net-worth clients.',
    imageUrl: 'https://i.imgur.com/6Xy1j2k.jpeg'
  },
  {
    slug: 'apply',
    title: 'Become a Partner',
    subtitle: 'Join the most exclusive network of home service professionals on the East End.',
    body: 'Membership is by invitation or application only. We seek partners who demonstrate an unwavering commitment to quality, discretion, and reliability.',
    imageUrl: 'https://i.imgur.com/e8JzG2g.jpeg'
  }
];

export const getPageContent = (slug: string): PageContent => {
  const existing = localStorage.getItem(PAGES_KEY);
  let pages: PageContent[] = existing ? JSON.parse(existing) : DEFAULT_PAGES;
  
  const page = pages.find(p => p.slug === slug);
  if (page) return page;
  
  const def = DEFAULT_PAGES.find(p => p.slug === slug);
  return def || { slug, title: 'Untitled', subtitle: '', body: '' };
};

export const savePageContent = (content: PageContent) => {
  const existing = localStorage.getItem(PAGES_KEY);
  let pages: PageContent[] = existing ? JSON.parse(existing) : DEFAULT_PAGES;
  
  const index = pages.findIndex(p => p.slug === content.slug);
  if (index >= 0) {
    pages[index] = content;
  } else {
    pages.push(content);
  }
  
  localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
  window.dispatchEvent(new Event(`page-change-${content.slug}`));
};

// --- Helper CRUD Operations for Businesses ---

export const getBusinessById = (id: string): Business | undefined => {
  const data = getDirectoryData();
  for (const cat of data) {
    for (const sub of cat.subCategories) {
      const biz = sub.businesses.find(b => b.id === id);
      if (biz) return biz;
    }
  }
  return undefined;
};

export const deleteBusiness = (bizId: string) => {
  const data = getDirectoryData();
  let found = false;
  
  const newData = data.map(cat => ({
    ...cat,
    subCategories: cat.subCategories.map(sub => ({
      ...sub,
      businesses: sub.businesses.filter(b => {
        if (b.id === bizId) {
            found = true;
            return false;
        }
        return true;
      })
    }))
  }));

  if (found) saveDirectoryData(newData);
};

export const saveBusiness = (biz: Business, catId: string, subId: string) => {
  const data = getDirectoryData();
  
  let cleanedData = data.map(cat => ({
    ...cat,
    subCategories: cat.subCategories.map(sub => ({
      ...sub,
      businesses: sub.businesses.filter(b => b.id !== biz.id)
    }))
  }));

  const updatedData = cleanedData.map(cat => {
    if (cat.id !== catId) return cat;
    return {
      ...cat,
      subCategories: cat.subCategories.map(sub => {
        if (sub.id !== subId) return sub;
        return {
          ...sub,
          businesses: [...sub.businesses, biz]
        };
      })
    };
  });

  saveDirectoryData(updatedData);
};

// --- Metrics Helper ---
export const incrementMetric = (bizId: string, type: 'view' | 'contact' | 'impression') => {
    const data = getDirectoryData();
    let updated = false;

    const newData = data.map(cat => ({
        ...cat,
        subCategories: cat.subCategories.map(sub => ({
            ...sub,
            businesses: sub.businesses.map(biz => {
                if (biz.id === bizId) {
                    updated = true;
                    // Ensure metrics object exists (for migration)
                    const metrics = biz.metrics || { views: 0, contactClicks: 0, impressions: 0, monthlyHistory: [] };
                    
                    return {
                        ...biz,
                        metrics: {
                            ...metrics,
                            views: type === 'view' ? metrics.views + 1 : metrics.views,
                            contactClicks: type === 'contact' ? metrics.contactClicks + 1 : metrics.contactClicks,
                            impressions: type === 'impression' ? metrics.impressions + 1 : metrics.impressions
                        }
                    };
                }
                return biz;
            })
        }))
    }));

    if (updated) saveDirectoryData(newData);
};

export const getCategoryHierarchy = () => {
  const data = getDirectoryData();
  return data.map(c => ({
    id: c.id,
    name: c.name,
    subCategories: c.subCategories.map(s => ({ id: s.id, name: s.name }))
  }));
};

// --- Category & SubCategory Management ---

export const addCategory = (name: string, description: string, imageUrl: string, icon: string) => {
  const data = getDirectoryData();
  const newCat: Category = {
    id: `cat_${Date.now()}`,
    name,
    description,
    imageUrl: imageUrl || 'https://picsum.photos/800/600',
    icon: icon || 'HelpCircle',
    subCategories: []
  };
  saveDirectoryData([...data, newCat]);
};

export const updateCategory = (id: string, updates: Partial<Category>) => {
  const data = getDirectoryData();
  const newData = data.map(c => (c.id === id ? { ...c, ...updates } : c));
  saveDirectoryData(newData);
};

export const deleteCategory = (id: string) => {
  const data = getDirectoryData();
  const newData = data.filter(c => c.id !== id);
  saveDirectoryData(newData);
};

export const addSubCategory = (catId: string, name: string, icon: string) => {
  const data = getDirectoryData();
  const newData = data.map(c => {
    if (c.id !== catId) return c;
    return {
      ...c,
      subCategories: [...c.subCategories, {
        id: `sub_${Date.now()}`,
        name,
        icon: icon || 'Circle',
        businesses: []
      }]
    };
  });
  saveDirectoryData(newData);
};

export const updateSubCategory = (catId: string, subId: string, name: string, icon: string) => {
  const data = getDirectoryData();
  const newData = data.map(c => {
    if (c.id !== catId) return c;
    return {
      ...c,
      subCategories: c.subCategories.map(s => (s.id === subId ? { ...s, name, icon } : s))
    };
  });
  saveDirectoryData(newData);
};

export const deleteSubCategory = (catId: string, subId: string) => {
  const data = getDirectoryData();
  const newData = data.map(c => {
    if (c.id !== catId) return c;
    return {
      ...c,
      subCategories: c.subCategories.filter(s => s.id !== subId)
    };
  });
  saveDirectoryData(newData);
};
