
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useParams, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, MapPin, Phone, Globe, Mail, ChevronRight, CheckSquare, Loader2, ChevronDown, Search, Play } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import ConciergeChat from './components/ConciergeChat';
import ConciergeWidget, { openConciergeEvent } from './components/ConciergeWidget';
import { api } from './services/api';
import { getBusinessById, getDirectoryData, incrementMetric } from './services/db';
import { Category, Business, HomepageSettings, PageContent, SubCategory } from './types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AdminDashboard } from './pages/Admin';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { AuthPage } from './pages/Auth';
import DynamicIcon from './components/DynamicIcon';
import { isAuthenticated } from './services/auth';

// --- Protected Route Wrapper ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// --- Loading Component ---
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-hamptons-navy">
    <Loader2 size={48} className="animate-spin mb-4 text-hamptons-gold" />
    <p className="font-serif italic text-lg animate-pulse">Curating Excellence...</p>
  </div>
);

// --- Hero Background Component (Video or Slideshow) ---
const HeroBackground: React.FC<{ images: string[], videoUrl?: string }> = ({ images, videoUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (videoUrl) return; // Don't cycle images if video is active
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); 
    return () => clearInterval(interval);
  }, [images, videoUrl]);

  // Video Mode
  if (videoUrl) {
      return (
          <div className="absolute inset-0 z-0 overflow-hidden">
              <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
              >
                  <source src={videoUrl} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-hamptons-navy/60 z-10"></div>
          </div>
      );
  }

  // Slideshow Mode
  if (images.length === 0) return <div className="absolute inset-0 bg-hamptons-navy"></div>;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url("${img}")` }}
        />
      ))}
      <div className="absolute inset-0 bg-hamptons-navy/60 z-10"></div>
    </div>
  );
};

// --- Pages ---

// 1. Home Page
const Home: React.FC = () => {
  const [directoryData, setDirectoryData] = useState<Category[]>([]);
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [homeContent, setHomeContent] = useState<PageContent | null>(null);
  const [spotlightPartner, setSpotlightPartner] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dir, set, content] = await Promise.all([
          api.fetchDirectory(),
          api.fetchHomepageSettings(),
          api.fetchPageContent('home')
        ]);
        
        setDirectoryData(dir);
        setSettings(set);
        setHomeContent(content);

        if (set.spotlightPartnerId) {
          const biz = await api.fetchBusinessById(set.spotlightPartnerId);
          setSpotlightPartner(biz);
        }
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    // Listen for local updates if using mock
    const handleUpdate = () => loadData();
    window.addEventListener('homepage-change', handleUpdate);
    window.addEventListener('db-change', handleUpdate);
    window.addEventListener('page-change-home', handleUpdate);
    return () => {
      window.removeEventListener('homepage-change', handleUpdate);
      window.removeEventListener('db-change', handleUpdate);
      window.removeEventListener('page-change-home', handleUpdate);
    }
  }, []);

  // Search Effect
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const data = getDirectoryData();
      const query = searchQuery.toLowerCase();
      
      const matchedBusinesses: Business[] = [];
      const seenIds = new Set<string>();

      // Iterate through the hierarchy to find matches
      for (const cat of data) {
        const catMatch = cat.name.toLowerCase().includes(query);
        for (const sub of cat.subCategories) {
          const subMatch = sub.name.toLowerCase().includes(query);
          for (const biz of sub.businesses) {
             if (seenIds.has(biz.id)) continue;
             const nameMatch = biz.name.toLowerCase().includes(query);
             const serviceMatch = biz.services.some(s => s.toLowerCase().includes(query));

             if (catMatch || subMatch || nameMatch || serviceMatch) {
                 matchedBusinesses.push(biz);
                 seenIds.add(biz.id);
             }
          }
        }
      }
      setSearchResults(matchedBusinesses.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (bizId: string) => {
    navigate(`/business/${bizId}`);
    setSearchQuery('');
    setSearchResults([]);
  };

  if (loading) return <PageLoader />;

  // Fallback if settings haven't loaded
  const heroImages = settings?.heroImages || [];
  const heroVideo = settings?.heroVideoUrl;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] md:min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <HeroBackground images={heroImages} videoUrl={heroVideo} />
        
        <div className="relative z-20 max-w-5xl mx-auto w-full">
          <span className="inline-block py-1 px-3 rounded-full bg-hamptons-gold/20 border border-hamptons-gold text-hamptons-gold text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 backdrop-blur-sm">
            Exclusive Directory
          </span>
          <h1 className="font-serif text-4xl md:text-7xl font-bold text-white mb-6 md:mb-8 drop-shadow-xl leading-tight">
            <span dangerouslySetInnerHTML={{ __html: homeContent?.title || "The Gold Standard of Hamptons Living" }} />
          </h1>
          <div className="text-base md:text-xl text-gray-200 mb-8 md:mb-12 font-light tracking-wide max-w-2xl mx-auto px-4 hidden md:block">
            <div dangerouslySetInnerHTML={{ __html: homeContent?.subtitle || "Connecting discerning homeowners with the East End's most trusted, vetted, and elite service professionals." }} />
          </div>
          <p className="text-sm text-gray-200 mb-8 font-light tracking-wide max-w-xs mx-auto md:hidden">
            Vetted, elite service professionals for your estate.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-6 mb-12">
             <Link to="/directory" className="px-8 py-3 md:px-10 md:py-4 bg-hamptons-gold text-hamptons-navy font-bold uppercase tracking-wider hover:bg-white hover:text-hamptons-navy transition-all rounded-full shadow-lg transform hover:-translate-y-1 text-sm md:text-base">
                Browse Directory
             </Link>
             <button onClick={openConciergeEvent} className="px-8 py-3 md:px-10 md:py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-white hover:text-hamptons-navy transition-all rounded-full shadow-lg transform hover:-translate-y-1 text-sm md:text-base">
                Ask AI Concierge
             </button>
          </div>
        </div>
      </section>

      {/* Dynamic Wide Search Bar - Overlapping Hero and Content */}
      <div className="relative z-30 px-4 -mt-8 md:-mt-10 pb-8">
          <div className="max-w-4xl mx-auto w-full relative" ref={searchRef}>
             <div className="relative group shadow-2xl rounded-full">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                   <Search className="h-6 w-6 text-gray-400 group-focus-within:text-hamptons-gold transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-16 pr-6 py-4 md:py-6 border-0 rounded-full leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-hamptons-gold text-base md:text-lg transition duration-150 ease-in-out font-sans shadow-lg"
                  placeholder="Search for services, professionals, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             
             {/* Search Results Dropdown */}
             {searchResults.length > 0 && (
                <div className="absolute mt-2 w-full bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 text-left">
                  <div className="px-4 py-3 bg-gray-50 text-xs font-bold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                      Matches for "{searchQuery}"
                  </div>
                  <ul className="max-h-80 overflow-y-auto py-2">
                    {searchResults.map(biz => (
                      <li key={biz.id}>
                        <button
                          onClick={() => handleSearchResultClick(biz.id)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-4 transition-colors border-b border-gray-50 last:border-0"
                        >
                           <img src={biz.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                           <div className="overflow-hidden">
                              <p className="text-base font-bold text-hamptons-navy truncate font-serif">{biz.name}</p>
                              <p className="text-xs text-gray-500 truncate mt-0.5">{biz.services.slice(0, 3).join(', ')}</p>
                           </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
             )}
          </div>
      </div>

      {/* Tagline Section */}
      <div className="bg-white py-8 px-4 text-center border-b border-gray-100">
          <h2 className="font-sans text-hamptons-navy font-bold text-base md:text-xl lg:text-2xl uppercase tracking-widest">
            YOUR GO-TO DIRECTORY FOR HOME SERVICE PROFESSIONALS OF THE HAMPTONS
          </h2>
      </div>

      {/* Categories Preview - App Like Grid on Mobile and Desktop */}
      <section className="py-8 md:py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-6 md:mb-16">
             <div className="w-16 md:w-24 h-1 bg-hamptons-gold mx-auto"></div>
           </div>

           {/* Desktop Grid */}
           <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
             {directoryData.map((cat) => (
               <Link to={`/category/${cat.id}`} key={cat.id} className="group cursor-pointer block h-full">
                 <div className="bg-hamptons-navy p-10 rounded-xl border border-white/10 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full shadow-lg relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                        <DynamicIcon name={cat.icon} size={150} className="text-white" />
                    </div>

                   {/* Increased Icon Size */}
                   <div className="w-32 h-32 rounded-full bg-white/10 text-hamptons-gold flex items-center justify-center mb-8 shadow-inner border border-white/20 backdrop-blur-sm overflow-hidden relative z-10">
                      <DynamicIcon name={cat.icon} size={64} className="w-16 h-16" />
                   </div>
                   <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-hamptons-gold transition-colors relative z-10">{cat.name}</h3>
                   <p className="text-sm text-gray-200 mb-6 group-hover:text-white transition-colors line-clamp-2 relative z-10 flex-grow">{cat.description}</p>
                   <span className="text-xs font-bold uppercase tracking-wider text-hamptons-gold mt-auto inline-flex items-center gap-1 group-hover:text-white relative z-10">
                      View Listings <ChevronRight size={14} />
                   </span>
                 </div>
               </Link>
             ))}
           </div>

           {/* Mobile 2x2 Grid View */}
           <div className="md:hidden grid grid-cols-2 gap-3 px-2">
             {directoryData.map((cat) => (
               <Link to={`/category/${cat.id}`} key={cat.id} className="block h-full">
                 <div className="bg-hamptons-navy p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg h-36 active:scale-95 transition-transform border border-white/10 relative overflow-hidden group">
                   {/* Background decoration */}
                   <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                       <DynamicIcon name={cat.icon} size={64} className="text-white" />
                   </div>
                   
                   <div className="relative z-10 flex flex-col items-center">
                       <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 text-hamptons-gold backdrop-blur-sm border border-white/20 shadow-inner">
                          <DynamicIcon name={cat.icon} size={24} />
                       </div>
                       <h3 className="text-xs font-bold text-white uppercase tracking-wider leading-tight">{cat.name}</h3>
                   </div>
                 </div>
               </Link>
             ))}
           </div>
        </div>
      </section>

      {/* Featured Partner Section */}
      {spotlightPartner && (
        <section className="py-12 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-10 md:gap-16">
             <div className="w-full md:w-1/2 relative">
                <div className="hidden md:block absolute -top-4 -left-4 w-24 h-24 bg-hamptons-gold/20 rounded-full -z-0"></div>
                <img src={spotlightPartner.imageUrl} alt="Featured Work" className="relative z-10 rounded-2xl shadow-xl h-[300px] md:h-[500px] w-full object-cover" />
             </div>
             <div className="w-full md:w-1/2">
                <span className="text-hamptons-gold font-bold uppercase tracking-widest text-xs md:text-sm mb-4 block">Spotlight Partner</span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-hamptons-navy mb-6 md:mb-8">{spotlightPartner.name}</h2>
                <p className="text-gray-600 leading-relaxed mb-8 md:mb-10 text-base md:text-lg">
                   {spotlightPartner.description.substring(0, 250)}...
                </p>
                <Link to={`/business/${spotlightPartner.id}`} className="inline-flex items-center justify-center px-8 py-3 bg-hamptons-navy text-white font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-lg w-full md:w-auto">
                   View Full Profile <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
             </div>
          </div>
        </section>
      )}
    </div>
  );
};

// 2. Directory Page
const MobileCategoryAccordion: React.FC<{ category: Category }> = ({ category }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-3 mx-4 rounded-xl overflow-hidden shadow-md">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left bg-hamptons-navy active:bg-slate-800 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-hamptons-gold overflow-hidden backdrop-blur-sm border border-white/10">
                        <DynamicIcon name={category.icon} size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-serif font-bold text-white text-lg leading-tight">{category.name}</h3>
                        <p className="text-xs text-gray-300 mt-1">{category.subCategories.length} services</p>
                    </div>
                </div>
                <div className={`p-1 rounded-full bg-white/10 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={20} className="text-hamptons-gold" />
                </div>
            </button>
            
            <div 
                className={`bg-white overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="p-3 bg-gray-50 grid grid-cols-2 gap-3">
                    {category.subCategories.map(sub => (
                        <Link 
                            key={sub.id} 
                            to={`/category/${category.id}`} 
                            state={{ subId: sub.id }}
                            className="bg-hamptons-navy p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm active:scale-95 transition-transform border border-white/10 h-28"
                        >
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 text-hamptons-gold backdrop-blur-sm border border-white/20">
                                <DynamicIcon name={sub.icon} size={20} />
                            </div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-tight line-clamp-2">{sub.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Directory: React.FC = () => {
  const [directoryData, setDirectoryData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
        const data = await api.fetchDirectory();
        setDirectoryData(data);
        setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-6 border-b border-gray-200">
        <h1 className="font-serif text-3xl font-bold text-hamptons-navy">Directory</h1>
        <p className="text-sm text-gray-500 mt-1">Browse all vetted partners</p>
      </div>

      {/* Mobile View: App-like Accordion List */}
      <div className="md:hidden pt-4">
         {directoryData.map(cat => (
             <MobileCategoryAccordion key={cat.id} category={cat} />
         ))}
         <div className="h-24"></div> {/* Bottom spacer for nav */}
      </div>

      {/* Desktop View: Grid */}
      <div className="hidden md:block py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-hamptons-navy mb-4">Our Directory</h1>
              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">Browse our exclusive network of vetted professionals serving the East End.</p>
           </div>

           <div className="space-y-20">
              {directoryData.map((cat) => (
                 <div key={cat.id}>
                    <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
                       <div className="w-12 h-12 bg-hamptons-navy rounded-lg flex items-center justify-center text-hamptons-gold shadow-md overflow-hidden flex-shrink-0">
                          <DynamicIcon name={cat.icon} size={24} className="md:w-7 md:h-7" />
                       </div>
                       <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-end">
                              <h2 className="text-2xl md:text-3xl font-serif font-bold text-hamptons-navy">{cat.name}</h2>
                              <Link to={`/category/${cat.id}`} className="text-sm font-bold text-hamptons-gold hover:text-hamptons-navy transition-colors uppercase tracking-wider mt-1 md:mt-0">View All {cat.name} Partners</Link>
                          </div>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                       {cat.subCategories.map(sub => (
                          <Link key={sub.id} to={`/category/${cat.id}`} state={{ subId: sub.id }} className="block h-full">
                            <div className="bg-hamptons-navy rounded-xl border border-white/10 p-6 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                        <div className="text-hamptons-gold bg-white/10 p-2 rounded-full group-hover:bg-hamptons-gold group-hover:text-hamptons-navy transition-colors overflow-hidden flex items-center justify-center w-10 h-10 flex-shrink-0 backdrop-blur-sm">
                                            <DynamicIcon name={sub.icon} size={20} />
                                        </div>
                                        <h3 className="font-bold text-lg text-white group-hover:text-hamptons-gold transition-colors">{sub.name}</h3>
                                </div>
                                <ul className="space-y-3 flex-1">
                                    {sub.businesses.map(biz => (
                                        <li key={biz.id}>
                                            <span className="text-gray-300 hover:text-white text-sm flex items-center gap-2 group/link">
                                                <ChevronRight size={14} className="text-gray-500 group-hover/link:text-hamptons-gold" /> 
                                                <span className="group-hover/link:underline">{biz.name}</span>
                                            </span>
                                        </li>
                                    ))}
                                    {sub.businesses.length === 0 && <li className="text-gray-500 text-xs italic">No partners yet</li>}
                                </ul>
                            </div>
                          </Link>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

// 3. Category Page
const CategoryPage: React.FC = () => {
  const { catId } = useParams<{ catId: string }>();
  const [directoryData, setDirectoryData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetch = async () => {
        const data = await api.fetchDirectory();
        setDirectoryData(data);
        setLoading(false);
    };
    fetch();
  }, []);

  // Check for subId passed in state (from mobile accordion)
  useEffect(() => {
    if (location.state && (location.state as any).subId) {
        setSelectedSubId((location.state as any).subId);
    }
  }, [location]);

  if (loading) return <PageLoader />;

  const category = directoryData.find(c => c.id === catId);
  if (!category) return <div className="p-12 text-center text-gray-500">Category not found.</div>;

  const activeSubCategory = selectedSubId ? category.subCategories.find(s => s.id === selectedSubId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
       <div className="bg-hamptons-navy py-10 md:py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
             <DynamicIcon name={category.icon} size={300} className="text-white" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
             <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 text-hamptons-gold backdrop-blur-sm border border-white/20 overflow-hidden">
                <DynamicIcon name={category.icon} size={32} className="w-8 h-8 md:w-12 md:h-12" />
             </div>
             <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2 md:mb-6">{category.name}</h1>
             <p className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto px-4">{category.description}</p>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          
          {/* Breadcrumb if drilled down */}
          {selectedSubId && (
            <button 
                onClick={() => setSelectedSubId(null)} 
                className="mb-6 md:mb-8 flex items-center text-hamptons-navy font-bold hover:text-hamptons-gold transition-colors text-sm md:text-base"
            >
                <ChevronRight className="rotate-180 mr-1" size={20} /> Back to {category.name}
            </button>
          )}

          {!selectedSubId ? (
            // GRID VIEW of Subcategories
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {category.subCategories.map(sub => (
                    <div 
                        key={sub.id} 
                        onClick={() => setSelectedSubId(sub.id)}
                        className="bg-hamptons-navy rounded-xl shadow-lg border border-white/10 p-4 md:p-8 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full justify-center group active:scale-95 relative overflow-hidden"
                    >
                         {/* Background decoration */}
                        <div className="absolute top-0 right-0 p-2 opacity-5 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                            <DynamicIcon name={sub.icon} size={80} className="text-white" />
                        </div>

                        <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-full flex items-center justify-center text-hamptons-gold mb-3 md:mb-6 group-hover:bg-hamptons-gold group-hover:text-hamptons-navy transition-colors overflow-hidden backdrop-blur-sm border border-white/20 z-10">
                            <DynamicIcon name={sub.icon} size={24} className="md:w-8 md:h-8" />
                        </div>
                        <h3 className="font-serif font-bold text-sm md:text-2xl text-white mb-1 md:mb-2 leading-tight z-10">{sub.name}</h3>
                        <p className="text-gray-300 text-[10px] md:text-sm mb-3 md:mb-6 z-10">{sub.businesses.length} Verified Partners</p>
                        <span className="text-hamptons-gold font-bold uppercase tracking-wider text-[10px] md:text-xs flex items-center gap-1 group-hover:text-white z-10">
                            View Partners <ChevronRight size={14} />
                        </span>
                    </div>
                ))}
            </div>
          ) : (
            // DETAIL VIEW of Selected Subcategory
             <div className="animate-fade-in-up">
               {activeSubCategory && (
                   <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8 border border-gray-100">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="p-3 bg-hamptons-navy rounded-lg text-white overflow-hidden w-12 h-12 flex items-center justify-center flex-shrink-0">
                               <DynamicIcon name={activeSubCategory.icon} size={24} />
                          </div>
                          <h2 className="text-xl md:text-3xl font-serif font-bold text-hamptons-navy">{activeSubCategory.name}</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {activeSubCategory.businesses.map(biz => (
                            <Link to={`/business/${biz.id}`} key={biz.id} className="block group h-full">
                                <div className="flex flex-col md:flex-row gap-6 border border-gray-100 rounded-xl p-5 hover:bg-slate-50 transition-colors hover:shadow-md h-full">
                                <img src={biz.imageUrl} alt={biz.name} className="w-full md:w-48 h-48 md:h-auto object-cover rounded-lg" />
                                <div className="flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-bold text-lg md:text-xl text-hamptons-navy group-hover:text-hamptons-gold transition-colors">{biz.name}</h3>
                                            <div className="flex items-center gap-1 text-hamptons-gold text-sm">
                                            <Star fill="currentColor" size={14} />
                                            <span className="font-bold">{biz.rating}</span>
                                            <span className="text-gray-400 font-normal ml-1">({biz.reviewCount} reviews)</span>
                                            </div>
                                        </div>
                                        {biz.verified && (
                                            <span className="bg-green-100 text-green-800 text-[10px] uppercase px-2 py-1 rounded-full font-bold flex items-center gap-1 flex-shrink-0">
                                            <CheckCircle size={10} /> Vetted
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{biz.shortDescription}</p>
                                    <div className="text-sm font-bold text-hamptons-navy group-hover:text-hamptons-gold uppercase tracking-wide self-start mt-auto flex items-center gap-1">
                                        View Profile <ArrowRight size={14} />
                                    </div>
                                </div>
                                </div>
                            </Link>
                         ))}
                         {activeSubCategory.businesses.length === 0 && (
                             <div className="col-span-full py-12 text-center text-gray-400 italic bg-gray-50 rounded-lg">
                                 No partners listed in this category yet.
                             </div>
                         )}
                      </div>
                   </div>
               )}
             </div>
          )}
       </div>
    </div>
  );
};

// 4. Business Profile Page
const BusinessProfile: React.FC = () => {
  const { bizId } = useParams<{ bizId: string }>();
  const [business, setBusiness] = useState<Business | null>(null);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [parentSubCategory, setParentSubCategory] = useState<SubCategory | null>(null);
  const [loading, setLoading] = useState(true);

  // Track View on Mount
  useEffect(() => {
    if (bizId) {
        incrementMetric(bizId, 'view');
    }
  }, [bizId]);

  const handleContactClick = () => {
      if (business) {
          incrementMetric(business.id, 'contact');
      }
  };

  useEffect(() => {
    if(bizId) {
        // Fetch directory too so we can find the parent category/sub
        api.fetchDirectory().then(data => {
            let foundBiz: Business | undefined;
            let foundCat: Category | undefined;
            let foundSub: SubCategory | undefined;

            for(const cat of data) {
                for(const sub of cat.subCategories) {
                    const biz = sub.businesses.find(b => b.id === bizId);
                    if(biz) {
                        foundBiz = biz;
                        foundCat = cat;
                        foundSub = sub;
                        break;
                    }
                }
                if(foundBiz) break;
            }

            if(foundBiz) {
                setBusiness(foundBiz);
                setParentCategory(foundCat || null);
                setParentSubCategory(foundSub || null);
            }
            setLoading(false);
        });
    }
  }, [bizId]);

  if (loading) return <PageLoader />;
  if (!business) return <div className="p-12 text-center text-gray-500">Business Profile Not Found</div>;

  // Mock data for chart
  const performanceData = [
    { name: 'Quality', score: 98 },
    { name: 'Value', score: 92 },
    { name: 'Response', score: 96 },
    { name: 'Punctuality', score: 99 },
  ];

  return (
    <div className="bg-white min-h-screen pb-10">
       
       {/* Breadcrumbs */}
       <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-3 border-b border-gray-100 flex items-center text-xs md:text-sm text-gray-500 overflow-x-auto whitespace-nowrap">
           <Link to="/" className="hover:text-hamptons-navy font-bold">Home</Link>
           <ChevronRight size={14} className="mx-2 flex-shrink-0" />
           <Link to="/directory" className="hover:text-hamptons-navy font-bold">Directory</Link>
           {parentCategory && (
               <>
                   <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                   <Link to={`/category/${parentCategory.id}`} className="hover:text-hamptons-navy font-bold">{parentCategory.name}</Link>
               </>
           )}
           {parentCategory && parentSubCategory && (
                <>
                    <ChevronRight size={14} className="mx-2 flex-shrink-0" />
                    <Link 
                        to={`/category/${parentCategory.id}`} 
                        state={{ subId: parentSubCategory.id }}
                        className="hover:text-hamptons-navy font-bold"
                    >
                        {parentSubCategory.name}
                    </Link>
                </>
           )}
           <ChevronRight size={14} className="mx-2 flex-shrink-0" />
           <span className="text-hamptons-gold font-bold">{business.name}</span>
       </div>

       {/* Header Image */}
       <div className="h-[40vh] md:h-[500px] w-full relative">
          <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-hamptons-navy/90 via-hamptons-navy/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-16">
             <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row items-end justify-between gap-6 md:gap-8">
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 md:mb-4">
                         <span className="bg-hamptons-gold text-hamptons-navy text-[10px] md:text-xs font-bold px-2 py-1 md:px-3 rounded-full uppercase tracking-wider">Premier Partner</span>
                         {business.verified && <span className="text-white/80 text-xs md:text-sm flex items-center gap-1"><CheckCircle size={14} className="text-green-400" /> Vetted & Insured</span>}
                      </div>
                      <h1 className="text-3xl md:text-6xl font-serif font-bold text-white mb-3 md:mb-4 shadow-sm">{business.name}</h1>
                      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white/90 text-sm md:text-lg">
                         <div className="flex items-center gap-2">
                            <Star className="text-hamptons-gold" fill="#d4af37" size={16} /> <span className="font-bold">{business.rating}</span> ({business.reviewCount} Reviews)
                         </div>
                         <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-300" /> {business.address}
                         </div>
                      </div>
                   </div>
                   <button onClick={handleContactClick} className="w-full sm:w-auto bg-hamptons-gold text-hamptons-navy px-8 py-3 md:px-10 md:py-4 font-bold uppercase tracking-wider rounded-lg shadow-xl hover:bg-white transition-all transform hover:-translate-y-1 text-sm md:text-base">
                      Contact Partner
                   </button>
                </div>
             </div>
          </div>
       </div>

       {/* Content */}
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
             
             {/* Left Main */}
             <div className="lg:col-span-2 space-y-10 md:space-y-16 order-2 lg:order-1">
                
                <section>
                   <h2 className="text-2xl md:text-3xl font-serif font-bold text-hamptons-navy mb-4 md:mb-6">About the Business</h2>
                   <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-line">{business.description}</p>
                </section>

                {/* NEW: BIO VIDEO & DESCRIPTION SECTION */}
                {(business.bioVideoUrl || business.bioText) && (
                  <section className="bg-hamptons-navy rounded-2xl overflow-hidden shadow-2xl relative">
                     <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1 relative z-10">
                            <span className="text-hamptons-gold text-xs font-bold uppercase tracking-widest mb-3">Meet The Partner</span>
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-6">A Word From The Team</h2>
                            {business.bioText && (
                               <p className="text-gray-300 leading-relaxed text-base md:text-lg italic">
                                  "{business.bioText}"
                               </p>
                            )}
                        </div>
                        <div className="bg-black relative min-h-[300px] order-1 md:order-2">
                             {business.bioVideoUrl ? (
                                <video 
                                   src={business.bioVideoUrl} 
                                   className="absolute inset-0 w-full h-full object-cover" 
                                   controls 
                                   playsInline
                                   poster={business.imageUrl} // Fallback to cover image
                                />
                             ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                   <Play size={48} className="text-gray-600" />
                                </div>
                             )}
                        </div>
                     </div>
                  </section>
                )}

                {business.gallery && business.gallery.length > 0 && (
                <section>
                   <h2 className="text-2xl md:text-3xl font-serif font-bold text-hamptons-navy mb-4 md:mb-6">Portfolio Gallery</h2>
                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {business.gallery.map((img, idx) => (
                         <img key={idx} src={img} alt={`Gallery ${idx}`} className="rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer h-48 w-full object-cover" />
                      ))}
                   </div>
                </section>
                )}

                <section>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-hamptons-navy mb-4 md:mb-6">Performance Metrics</h2>
                    <div className="h-64 md:h-72 w-full bg-slate-50 rounded-xl p-4 md:p-8 border border-gray-100 shadow-inner">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                            {performanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill="#3b1151" />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                </section>

                {business.reviews && business.reviews.length > 0 && (
                <section>
                   <h2 className="text-2xl md:text-3xl font-serif font-bold text-hamptons-navy mb-4 md:mb-6">Client Testimonials</h2>
                   <div className="space-y-6">
                      {business.reviews.map(review => (
                         <div key={review.id} className="bg-slate-50 p-6 md:p-8 rounded-xl border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 text-sm md:text-base">
                                       {review.author.charAt(0)}
                                   </div>
                                   <span className="font-bold text-hamptons-navy text-base md:text-lg">{review.author}</span>
                               </div>
                               <span className="text-gray-400 text-xs md:text-sm">{review.date}</span>
                            </div>
                            <div className="flex text-hamptons-gold mb-4">
                               {[...Array(5)].map((_, i) => (
                                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />
                               ))}
                            </div>
                            <p className="text-gray-600 italic text-base md:text-lg leading-relaxed">"{review.text}"</p>
                         </div>
                      ))}
                   </div>
                </section>
                )}
             </div>

             {/* Right Sidebar - Mobile Order 1 */}
             <div className="space-y-8 order-1 lg:order-2">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl border border-gray-100 sticky top-24 md:top-28">
                   <h3 className="font-serif font-bold text-2xl text-hamptons-navy mb-6 md:mb-8">Contact Information</h3>
                   
                   <div className="space-y-6">
                      <div className="flex items-start gap-4 group">
                         <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-hamptons-gold group-hover:text-hamptons-navy transition-colors">
                             <MapPin className="text-hamptons-navy" size={20} />
                         </div>
                         <span className="text-gray-600 mt-1 text-sm md:text-base">{business.address}</span>
                      </div>
                      <div className="flex items-center gap-4 group">
                         <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-hamptons-gold group-hover:text-hamptons-navy transition-colors">
                            <Phone className="text-hamptons-navy" size={20} />
                         </div>
                         <a href={`tel:${business.phone}`} onClick={handleContactClick} className="text-gray-800 font-bold text-lg hover:text-hamptons-navy">{business.phone}</a>
                      </div>
                      <div className="flex items-center gap-4 group">
                         <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-hamptons-gold group-hover:text-hamptons-navy transition-colors">
                            <Mail className="text-hamptons-navy" size={20} />
                         </div>
                         <a href={`mailto:${business.email}`} onClick={handleContactClick} className="text-gray-600 text-sm truncate hover:text-hamptons-navy">{business.email}</a>
                      </div>
                      <div className="flex items-center gap-4 group">
                         <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-hamptons-gold group-hover:text-hamptons-navy transition-colors">
                            <Globe className="text-hamptons-navy" size={20} />
                         </div>
                         <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" onClick={handleContactClick} className="text-gray-600 text-sm truncate hover:text-hamptons-navy">{business.website}</a>
                      </div>
                   </div>

                   <hr className="my-6 md:my-8 border-gray-100" />

                   <h4 className="font-bold text-sm text-hamptons-navy uppercase tracking-widest mb-4">Services Offered</h4>
                   <div className="flex flex-wrap gap-2">
                      {business.services.map(service => (
                         <span key={service} className="bg-slate-50 text-hamptons-navy text-xs px-3 py-1.5 rounded-full font-bold border border-gray-100">
                            {service}
                         </span>
                      ))}
                   </div>

                   <button onClick={handleContactClick} className="w-full mt-8 md:mt-10 bg-hamptons-navy text-white py-3 md:py-4 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg text-sm md:text-base">
                      Request Quote
                   </button>
                   <p className="text-center text-xs text-gray-400 mt-4">Response time: usually within 2 hours</p>
                </div>
             </div>

          </div>
       </div>
    </div>
  );
};

const ConciergePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 py-10 md:py-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-hamptons-navy mb-4">AI Concierge</h1>
                    <p className="text-gray-600 text-base md:text-lg">
                        Let our intelligent assistant guide you to the perfect Hamptons partner for your needs.
                    </p>
                </div>
                <ConciergeChat />
            </div>
        </div>
    )
}

const About: React.FC = () => {
  const [content, setContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchPageContent('about').then(data => {
        setContent(data);
        setLoading(false);
    });
  }, []);

  if (loading) return <PageLoader />;
  if (!content) return <div>Failed to load content</div>;

  return (
    <div className="min-h-screen bg-white py-16 md:py-24">
      {content.imageUrl && (
        <div className="w-full h-64 md:h-96 relative mb-12">
            <img src={content.imageUrl} alt="About Us" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-hamptons-navy/40"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                 <h1 className="font-serif text-4xl md:text-6xl font-bold text-white shadow-sm">{content.title}</h1>
            </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-6 text-center">
        {!content.imageUrl && <h1 className="font-serif text-4xl md:text-5xl font-bold text-hamptons-navy mb-8 md:mb-10">{content.title}</h1>}
        
        {/* Render HTML Content from WYSIWYG Editor */}
        <div 
          className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 leading-relaxed font-light prose prose-lg mx-auto"
          dangerouslySetInnerHTML={{ __html: content.body }} 
        />
        
        <div className="w-32 h-1 bg-hamptons-gold mx-auto my-10 md:my-12"></div>
        <p className="font-serif italic text-2xl md:text-3xl text-hamptons-navy">
          "{content.subtitle}"
        </p>
      </div>
    </div>
  );
};

// --- Apply to be a Partner Page ---
const ApplyPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState<PageContent | null>(null);
  
  useEffect(() => {
    api.fetchPageContent('apply').then(data => setContent(data));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl max-w-lg text-center border-t-4 border-hamptons-gold">
           <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle size={32} className="md:w-10 md:h-10" />
           </div>
           <h2 className="text-2xl md:text-3xl font-serif font-bold text-hamptons-navy mb-4">Application Received</h2>
           <p className="text-gray-600 mb-8 text-sm md:text-base">
             Thank you for your interest in joining Preferred Partners of the Hamptons. Our vetting team will review your credentials and contact you within 5 business days.
           </p>
           <Link to="/" className="inline-block px-8 py-3 bg-hamptons-navy text-white font-bold rounded hover:bg-slate-800 transition-colors">
             Return Home
           </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
         <div className="text-center mb-8 md:mb-12">
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-hamptons-navy mb-4 md:mb-6">{content?.title || "Become a Partner"}</h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
               {content?.subtitle || "Join the most exclusive network of home service professionals on the East End. Membership is by invitation or application only."}
            </p>
            {/* Render HTML content for additional instructions */}
            {content?.body && (
                 <div 
                   className="mt-6 text-gray-600 prose prose-sm mx-auto" 
                   dangerouslySetInnerHTML={{ __html: content.body }} 
                 />
            )}
         </div>

         <div className="bg-white rounded-2xl shadow-lg p-6 md:p-12 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
               <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <CheckSquare className="w-6 h-6 md:w-8 md:h-8 text-hamptons-gold mx-auto mb-3" />
                  <h3 className="font-bold text-hamptons-navy mb-1 text-sm md:text-base">Vetted Quality</h3>
                  <p className="text-xs text-gray-500">Strict background & quality checks</p>
               </div>
               <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Star className="w-6 h-6 md:w-8 md:h-8 text-hamptons-gold mx-auto mb-3" />
                  <h3 className="font-bold text-hamptons-navy mb-1 text-sm md:text-base">Elite Clients</h3>
                  <p className="text-xs text-gray-500">Access to high-net-worth homeowners</p>
               </div>
               <div className="text-center p-4 bg-slate-50 rounded-lg">
                  <Globe className="w-6 h-6 md:w-8 md:h-8 text-hamptons-gold mx-auto mb-3" />
                  <h3 className="font-bold text-hamptons-navy mb-1 text-sm md:text-base">Premium Exposure</h3>
                  <p className="text-xs text-gray-500">Featured in our digital concierge</p>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Business Name</label>
                     <input required className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hamptons-gold bg-white text-gray-900" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Contact Person</label>
                     <input required className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hamptons-gold bg-white text-gray-900" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                     <input type="email" required className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hamptons-gold bg-white text-gray-900" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                     <input type="tel" required className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hamptons-gold bg-white text-gray-900" />
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Service Category</label>
                  <select className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hamptons-gold bg-white text-gray-900">
                     <option>Home Improvement</option>
                     <option>Landscaping & Maintenance</option>
                     <option>Pool Services</option>
                     <option>Cleaning & Housekeeping</option>
                     <option>Private Chef / Catering</option>
                     <option>Event Planning</option>
                     <option>Security & Technology</option>
                     <option>Other</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Years in Business</label>
                  <input type="number" className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hamptons-gold bg-white text-gray-900" />
               </div>

               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Why should we partner with you?</label>
                  <textarea rows={4} className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-hamptons-gold bg-white text-gray-900" placeholder="Tell us about your experience and standards..."></textarea>
               </div>

               <div className="pt-4">
                  <button type="submit" className="w-full bg-hamptons-navy text-hamptons-gold font-bold py-3 md:py-4 rounded hover:bg-slate-800 transition-colors uppercase tracking-wider shadow-md text-sm md:text-base">
                     Submit Application
                  </button>
               </div>
            </form>
         </div>
      </div>
    </div>
  );
};

// Main App Component with Route Structure
const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen font-sans text-slate-900 bg-white md:pb-0 pb-[calc(4rem+env(safe-area-inset-bottom))]">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/login" element={<AuthPage />} />
            
            {/* Protected Routes for Users */}
            <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
            <Route path="/category/:catId" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
            <Route path="/business/:bizId" element={<ProtectedRoute><BusinessProfile /></ProtectedRoute>} />
            <Route path="/concierge" element={<ProtectedRoute><ConciergePage /></ProtectedRoute>} />
            
            {/* Admin Routes */}
            {/* Legacy redirect */}
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Partner Routes */}
            <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          </Routes>
        </main>
        <ConciergeWidget />
        <Footer />
        <BottomNav />
      </div>
    </Router>
  );
};

export default App;
