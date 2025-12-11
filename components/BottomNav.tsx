import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, Sparkles, UserCircle } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/') ? 'text-hamptons-navy' : 'text-gray-400'}`}
        >
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link 
          to="/directory" 
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/directory') ? 'text-hamptons-navy' : 'text-gray-400'}`}
        >
          <List size={24} strokeWidth={isActive('/directory') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Directory</span>
        </Link>
        <Link 
          to="/concierge" 
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/concierge') ? 'text-hamptons-navy' : 'text-gray-400'}`}
        >
          <Sparkles size={24} strokeWidth={isActive('/concierge') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Concierge</span>
        </Link>
        <Link 
          to="/apply" 
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive('/apply') ? 'text-hamptons-navy' : 'text-gray-400'}`}
        >
          <UserCircle size={24} strokeWidth={isActive('/apply') ? 2.5 : 2} />
          <span className="text-[10px] font-bold mt-1">Partner</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;