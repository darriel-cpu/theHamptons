
import { Category, Business, HomepageSettings, PageContent } from '../types';
import { getDirectoryData, getHomepageSettings, saveDirectoryData, saveHomepageSettings, getPageContent, savePageContent } from './db';

// CONFIGURATION
// Set this to FALSE when you are ready to connect to your real Node/Supabase backend
const USE_MOCK_BACKEND = true;
const API_URL = 'https://api.yourdomain.com'; // Your real backend URL

/**
 * This service abstracts the data source. 
 * The frontend components (App.tsx) will call these async functions.
 * Currently, they resolve immediately using localStorage data (Mock).
 * Later, you replace the fetch logic with real API calls.
 */

export const api = {
  
  // --- Directory Data ---
  
  fetchDirectory: async (): Promise<Category[]> => {
    if (USE_MOCK_BACKEND) {
      // Simulate network latency
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getDirectoryData());
        }, 800); 
      });
    } else {
      const res = await fetch(`${API_URL}/directory`);
      return res.json();
    }
  },

  // --- Business Data ---

  fetchBusinessById: async (id: string): Promise<Business | null> => {
    if (USE_MOCK_BACKEND) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = getDirectoryData();
          let found: Business | null = null;
          for (const cat of data) {
            for (const sub of cat.subCategories) {
              const biz = sub.businesses.find(b => b.id === id);
              if (biz) found = biz;
            }
          }
          resolve(found);
        }, 500);
      });
    } else {
      const res = await fetch(`${API_URL}/businesses/${id}`);
      return res.json();
    }
  },

  // --- Homepage Settings ---

  fetchHomepageSettings: async (): Promise<HomepageSettings> => {
    if (USE_MOCK_BACKEND) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getHomepageSettings());
        }, 300);
      });
    } else {
      const res = await fetch(`${API_URL}/settings/homepage`);
      return res.json();
    }
  },

  updateHomepageSettings: async (settings: HomepageSettings): Promise<void> => {
    if (USE_MOCK_BACKEND) {
      return new Promise((resolve) => {
        saveHomepageSettings(settings);
        resolve();
      });
    } else {
      await fetch(`${API_URL}/settings/homepage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
    }
  },

  // --- CMS Page Content ---

  fetchPageContent: async (slug: string): Promise<PageContent> => {
    if (USE_MOCK_BACKEND) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getPageContent(slug));
            }, 300);
        });
    } else {
        const res = await fetch(`${API_URL}/pages/${slug}`);
        return res.json();
    }
  },

  updatePageContent: async (content: PageContent): Promise<void> => {
      if (USE_MOCK_BACKEND) {
          return new Promise((resolve) => {
              savePageContent(content);
              resolve();
          });
      } else {
        await fetch(`${API_URL}/pages/${content.slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content)
        });
      }
  }
};
