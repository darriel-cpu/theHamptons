
import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { getHomepageSettings } from '../services/db';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [footerLogoUrl, setFooterLogoUrl] = useState('');

  useEffect(() => {
    const settings = getHomepageSettings();
    setFooterLogoUrl(settings.footerLogoUrl || settings.logoUrl);

    const handleUpdate = () => {
       const updated = getHomepageSettings();
       setFooterLogoUrl(updated.footerLogoUrl || updated.logoUrl);
    };
    window.addEventListener('homepage-change', handleUpdate);
    return () => window.removeEventListener('homepage-change', handleUpdate);
  }, []);

  return (
    <footer className="bg-hamptons-navy text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 justify-between">
          
          {/* Logo Section */}
          <div className="md:w-1/3">
             <div className="mb-6 inline-block">
                {footerLogoUrl && (
                  <img 
                    src={footerLogoUrl} 
                    alt="PPOTH Logo" 
                    className="h-16 md:h-20 w-auto object-contain"
                  />
                )}
             </div>
             <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
               The exclusive directory for Hamptons homeowners. Connecting you with vetted, world-class service professionals for your estate needs.
             </p>
          </div>

          {/* Links Section - 3 Columns */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-hamptons-gold mb-6">Directory</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link to="/directory" className="hover:text-white transition-colors">Browse All</Link></li>
                <li><Link to="/concierge" className="hover:text-white transition-colors">AI Concierge</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-colors">Get Listed</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-hamptons-gold mb-6">Company</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/apply" className="hover:text-white transition-colors">Become a Partner</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-hamptons-gold mb-6">Connect</h3>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="text-gray-300 hover:text-hamptons-gold transition-colors"><Facebook size={24} /></a>
                <a href="#" className="text-gray-300 hover:text-hamptons-gold transition-colors"><Instagram size={24} /></a>
                <a href="#" className="text-gray-300 hover:text-hamptons-gold transition-colors"><Twitter size={24} /></a>
              </div>
              <div>
                  <p className="text-xs text-gray-500 mb-2">© {new Date().getFullYear()} Preferred Partners.</p>
                  <div className="flex gap-4 text-xs text-gray-600">
                    <Link to="/login" className="hover:text-gray-400">Partner Portal</Link>
                    <Link to="/admin/dashboard" className="hover:text-gray-400">Admin</Link>
                  </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
