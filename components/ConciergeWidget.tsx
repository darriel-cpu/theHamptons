import React, { useState } from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';
import ConciergeChat from './ConciergeChat';

const ConciergeWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle widget visibility
  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed z-[100] bottom-[calc(4rem+env(safe-area-inset-bottom)+1rem)] md:bottom-8 right-4 md:right-8 flex flex-col items-end pointer-events-none">
      
      {/* The Chat Window Popup */}
      <div className={`pointer-events-auto transition-all duration-300 origin-bottom-right ${
          isOpen 
            ? 'opacity-100 scale-100 translate-y-0 mb-4' 
            : 'opacity-0 scale-95 translate-y-10 pointer-events-none h-0'
        }`}>
        <ConciergeChat isPopup={true} onClose={() => setIsOpen(false)} />
      </div>

      {/* The Floating Action Button (FAB) */}
      <button
        onClick={toggleOpen}
        className="pointer-events-auto bg-hamptons-navy hover:bg-slate-800 text-hamptons-gold p-4 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-hamptons-gold flex items-center justify-center group"
        aria-label="Open Concierge AI"
      >
        {isOpen ? (
            // Icon when open (usually close, but handled inside chat) or just maintain branding
             <Sparkles className="w-6 h-6 animate-pulse" />
        ) : (
            // Icon when closed
            <div className="relative">
                <Sparkles className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-hamptons-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-hamptons-gold"></span>
                </span>
            </div>
        )}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-white font-bold text-sm ml-0 group-hover:ml-2">
            AI Concierge
        </span>
      </button>
    </div>
  );
};

export const openConciergeEvent = () => {
    // Helper to programmatically open the widget from other components
    // In a real app, use Context. For now, we simulate a click or simple visibility logic if strictly React.
    // Since this is a widget, we can't easily trigger state from outside without Context.
    // For simplicity in this codebase, we will let the user click the button.
    alert("Please click the Gold Sparkle icon in the bottom right to chat with the Concierge.");
};

export default ConciergeWidget;