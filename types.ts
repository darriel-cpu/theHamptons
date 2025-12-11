
export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface BusinessMetrics {
  views: number;
  contactClicks: number; // Phone, Email, Website clicks
  impressions: number; // Appearances in search/lists
  monthlyHistory: { name: string; views: number; contacts: number }[]; // For charts
}

export interface Business {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  verified: boolean;
  imageUrl: string;
  gallery: string[];
  services: string[];
  yearsInBusiness: number;
  bioVideoUrl?: string;
  bioText?: string;
  metrics: BusinessMetrics; // NEW
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  businesses: Business[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface HomepageSettings {
  heroImages: string[];
  heroVideoUrl?: string;
  spotlightPartnerId: string;
  logoUrl: string;
  footerLogoUrl: string; // NEW
}

export interface PageContent {
  slug: string; // e.g., 'about', 'apply'
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
}

export type UserRole = 'ADMIN' | 'PARTNER' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  businessId?: string; // Only for PARTNER role
}
