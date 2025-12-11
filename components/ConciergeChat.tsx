import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, X, Maximize2, Minimize2 } from 'lucide-react';
import { generateConciergeResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Link, useLocation } from 'react-router-dom';

interface ConciergeChatProps {
  isPopup?: boolean;
  onClose?: () => void;
}

const ConciergeChat: React.FC<ConciergeChatProps> = ({ isPopup = false, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Good day. I am your personal concierge. How may I assist with your Hamptons estate today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Pass current URL/Path as context
    const currentContext = location.pathname;
    const responseText = await generateConciergeResponse(input, currentContext);
    
    setIsLoading(false);
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to render text with Markdown-style links [Text](url)
  const renderMessageContent = (text: string) => {
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    
    return parts.map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return (
          <Link 
            key={i} 
            to={match[2]} 
            className="text-hamptons-navy font-bold underline decoration-hamptons-gold decoration-2 hover:text-hamptons-gold transition-colors"
          >
            {match[1]}
          </Link>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className={`flex flex-col bg-white overflow-hidden border border-gray-200 shadow-2xl ${isPopup ? 'h-[500px] w-full md:w-[380px] rounded-t-xl md:rounded-xl' : 'h-[600px] rounded-lg'}`}>
      
      {/* Header */}
      <div className="bg-hamptons-navy p-3 flex items-center justify-between cursor-pointer" onClick={isPopup ? undefined : undefined}>
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-hamptons-gold rounded-full">
                <Sparkles className="w-4 h-4 text-hamptons-navy" />
            </div>
            <div>
                <h3 className="text-white font-serif font-bold text-sm">Concierge</h3>
                <p className="text-[10px] text-gray-300">Online • Context Aware</p>
            </div>
        </div>
        {isPopup && onClose && (
            <button onClick={onClose} className="text-gray-300 hover:text-white transition-colors">
                <X size={18} />
            </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-gray-300' : 'bg-hamptons-navy'}`}>
                {msg.role === 'user' ? <User size={12} className="text-gray-600" /> : <Bot size={12} className="text-hamptons-gold" />}
              </div>
              <div className={`p-2.5 rounded-lg leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white text-gray-800 border border-gray-200 rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-hamptons-gold/30 rounded-tl-none'
              }`}>
                {renderMessageContent(msg.text)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2">
               <div className="w-6 h-6 rounded-full bg-hamptons-navy flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={12} className="text-hamptons-gold" />
               </div>
               <div className="bg-white p-3 rounded-lg rounded-tl-none border border-hamptons-gold/30 flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 bg-hamptons-navy rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-hamptons-navy rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                 <div className="w-1.5 h-1.5 bg-hamptons-navy rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask for recommendations..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-hamptons-navy focus:border-transparent text-sm text-gray-900 bg-white"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2 bg-hamptons-navy text-hamptons-gold rounded-md hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConciergeChat;