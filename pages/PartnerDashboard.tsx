
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import { getBusinessById } from '../services/db';
import { Business } from '../types';
import BusinessEditor from '../components/BusinessEditor';
import { LogOut, Edit2, Eye, LayoutDashboard, MousePointer, Search, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const PartnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [business, setBusiness] = useState<Business | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'PARTNER' || !user.businessId) {
      navigate('/login');
      return;
    }

    const biz = getBusinessById(user.businessId);
    if (biz) {
      setBusiness(biz);
    }
  }, [user, navigate]);

  const handleRefresh = () => {
    if (user?.businessId) {
      const biz = getBusinessById(user.businessId);
      if (biz) setBusiness(biz);
    }
    setIsEditing(false);
  };

  if (!business) return <div className="p-10 text-center">Loading Profile...</div>;

  // Safe access to metrics
  const metrics = business.metrics || { views: 0, contactClicks: 0, impressions: 0, monthlyHistory: [] };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <LayoutDashboard className="h-6 w-6 text-hamptons-gold mr-2" />
              <span className="font-serif font-bold text-xl text-hamptons-navy">Partner Portal</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Welcome, {user?.name}</span>
              <button onClick={logout} className="text-gray-400 hover:text-hamptons-navy">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
          <div className="h-32 bg-hamptons-navy relative">
            <div className="absolute -bottom-10 left-8">
              <img src={business.imageUrl} alt="Profile" className="w-24 h-24 rounded-lg border-4 border-white shadow-md object-cover" />
            </div>
          </div>
          <div className="pt-12 pb-8 px-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-serif font-bold text-hamptons-navy">{business.name}</h1>
                <p className="text-gray-500">{business.email}</p>
                <div className="flex gap-2 mt-2">
                   {business.verified ? (
                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Vetted Partner</span>
                   ) : (
                     <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">Pending Review</span>
                   )}
                   <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-bold">Rating: {business.rating} ★</span>
                </div>
              </div>
              <div className="flex gap-3">
                 <button 
                   onClick={() => window.open(`#/business/${business.id}`, '_blank')}
                   className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-bold text-sm"
                 >
                   <Eye size={16} /> View Public
                 </button>
                 <button 
                   onClick={() => setIsEditing(true)}
                   className="flex items-center gap-2 px-4 py-2 bg-hamptons-navy text-white rounded-lg hover:bg-slate-800 transition-colors font-bold text-sm shadow-md"
                 >
                   <Edit2 size={16} /> Edit Profile
                 </button>
              </div>
            </div>

            {/* NEW METRICS SECTION */}
            <h3 className="font-serif font-bold text-2xl text-hamptons-navy mb-4 border-t border-gray-100 pt-6">Performance Analytics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <Eye size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.views}</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-full">
                        <MousePointer size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Lead Actions</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.contactClicks}</p>
                        <p className="text-[10px] text-gray-400">Calls, Emails, Website Clicks</p>
                    </div>
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-full">
                        <Search size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-bold uppercase">Search Visibility</p>
                        <p className="text-2xl font-bold text-gray-900">{metrics.impressions}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                      <TrendingUp size={20} className="text-hamptons-gold" />
                      <h3 className="font-bold text-hamptons-navy">Traffic History (6 Months)</h3>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.monthlyHistory}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{fill: '#f8fafc'}}
                            />
                            <Bar dataKey="views" fill="#3b1151" radius={[4, 4, 0, 0]} name="Views" />
                            <Bar dataKey="contacts" fill="#d4af37" radius={[4, 4, 0, 0]} name="Leads" />
                        </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               
               <div>
                  <h3 className="font-bold text-hamptons-navy mb-4">Listing Details</h3>
                  <div className="bg-slate-50 p-6 rounded-xl border border-gray-100 space-y-3 text-sm text-gray-600">
                     <p><strong className="text-gray-900">Phone:</strong> {business.phone}</p>
                     <p><strong className="text-gray-900">Address:</strong> {business.address}</p>
                     <p><strong className="text-gray-900">Website:</strong> {business.website}</p>
                     <p><strong className="text-gray-900">Services:</strong> {business.services.join(', ')}</p>
                     <div className="pt-4 mt-4 border-t border-gray-200">
                         <span className="block text-xs text-gray-400 mb-1">Your Categories</span>
                         <div className="flex flex-wrap gap-2">
                            <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-hamptons-navy">Home Improvement</span>
                            <span className="bg-white border border-gray-200 px-2 py-1 rounded text-xs font-bold text-hamptons-navy">Construction</span>
                         </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <BusinessEditor 
          business={business} 
          onClose={() => setIsEditing(false)} 
          onSave={handleRefresh}
          isPartnerView={true}
        />
      )}
    </div>
  );
};
