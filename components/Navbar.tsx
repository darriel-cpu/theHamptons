import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getHomepageSettings } from '../services/db';
import { getCurrentUser, logout } from '../services/auth';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const user = getCurrentUser();

  // Initial load of logo
  useEffect(() => {
    const settings = getHomepageSettings();
    setLogoUrl(settings.logoUrl);

    // Listen for updates
    const handleUpdate = () => {
       const updated = getHomepageSettings();
       setLogoUrl(updated.logoUrl);
    };
    window.addEventListener('homepage-change', handleUpdate);
    return () => window.removeEventListener('homepage-change', handleUpdate);
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-28">
          
          {/* Mobile Menu Button (Left) */}
          <div className="flex md:hidden flex-1 justify-start">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-hamptons-navy hover:text-hamptons-gold focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>

          {/* Desktop Left Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-start space-x-6">
            <Link to="/" className="text-hamptons-navy hover:text-hamptons-gold text-xs font-bold tracking-wide transition-colors">HOME</Link>
            <Link to="/directory" className="text-hamptons-navy hover:text-hamptons-gold text-xs font-bold tracking-wide transition-colors">DIRECTORY</Link>
            <Link to="/concierge" className="text-hamptons-navy hover:text-hamptons-gold text-xs font-bold tracking-wide transition-colors">CONCIERGE</Link>
          </div>

          {/* Center Logo */}
          <div className="flex-shrink-0 flex justify-center px-4">
             <div className="cursor-pointer transition-all duration-300 transform hover:scale-105" onClick={() => navigate('/')}>
               {logoUrl && (
                 <img 
                   src={logoUrl} 
                   alt="Preferred Partners" 
                   className="h-11 md:h-16 w-auto object-contain"
                 />
               )}
             </div>
          </div>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-end space-x-6">
            <Link to="/apply" className="text-hamptons-navy hover:text-hamptons-gold text-xs font-bold tracking-wide transition-colors">BECOME A PARTNER</Link>
            
            {user ? (
              <div className="relative" ref={userMenuRef}>
                 <button 
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className="flex items-center gap-2 text-hamptons-navy hover:text-hamptons-gold font-bold text-xs tracking-wide transition-colors focus:outline-none"
                 >
                   <User size={18} />
                   <span>ACCOUNT</span>
                 </button>
                 {showUserMenu && (
                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5">
                     <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                       Signed in as <br/> <span className="font-bold text-gray-900">{user.name}</span>
                     </div>
                     
                     {user.role === 'ADMIN' && (
                       <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                         <LayoutDashboard size={16} /> Admin Dashboard
                       </Link>
                     )}
                     {user.role === 'PARTNER' && (
                       <Link to="/partner/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                         <LayoutDashboard size={16} /> My Dashboard
                       </Link>
                     )}
                     
                     <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                       <LogOut size={16} /> Sign Out
                     </button>
                   </div>
                 )}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-hamptons-navy text-white hover:bg-slate-800 px-5 py-2 rounded-full font-bold uppercase text-xs tracking-wider transition-all shadow-sm">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Right Placeholder (User Icon) */}
          <div className="flex md:hidden flex-1 justify-end items-center">
             <Link to={user ? (user.role === 'PARTNER' ? '/partner/dashboard' : '/') : '/login'} className="text-hamptons-navy p-2">
                <User size={24} />
             </Link>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-hamptons-navy hover:text-hamptons-gold block px-3 py-2 rounded-md text-base font-bold">Home</Link>
            <Link to="/directory" onClick={() => setIsOpen(false)} className="text-hamptons-navy hover:text-hamptons-gold block px-3 py-2 rounded-md text-base font-bold">Directory</Link>
            <Link to="/concierge" onClick={() => setIsOpen(false)} className="text-hamptons-navy hover:text-hamptons-gold block px-3 py-2 rounded-md text-base font-bold">AI Concierge</Link>
            <Link to="/apply" onClick={() => setIsOpen(false)} className="text-hamptons-navy hover:text-hamptons-gold block px-3 py-2 rounded-md text-base font-bold">Become a Partner</Link>
            
            <div className="border-t border-gray-100 my-2 pt-2">
              {user ? (
                 <>
                   <div className="px-3 py-2 text-sm text-gray-500">Hi, {user.name}</div>
                   {user.role === 'ADMIN' && (
                     <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-hamptons-navy block px-3 py-2 rounded-md text-base font-bold">Admin Dashboard</Link>
                   )}
                   {user.role === 'PARTNER' && (
                     <Link to="/partner/dashboard" onClick={() => setIsOpen(false)} className="text-hamptons-navy block px-3 py-2 rounded-md text-base font-bold">My Dashboard</Link>
                   )}
                   <button onClick={() => {handleLogout(); setIsOpen(false);}} className="text-red-600 block px-3 py-2 rounded-md text-base font-bold w-full text-left">Sign Out</button>
                 </>
              ) : (
                 <Link to="/login" onClick={() => setIsOpen(false)} className="text-hamptons-gold hover:text-hamptons-navy block px-3 py-2 rounded-md text-base font-bold">Sign In / Register</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;