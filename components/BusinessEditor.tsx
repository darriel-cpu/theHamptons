
import React, { useState, useEffect } from 'react';
import { Save, X, Trash2, Plus, Video, FileText } from 'lucide-react';
import { Business } from '../types';
import { getCategoryHierarchy, saveBusiness, getDirectoryData } from '../services/db';
import ImageUploader from './ImageUploader';

interface EditorProps {
  business: Business | null; // null means new
  onClose: () => void;
  onSave: () => void;
  isPartnerView?: boolean; // If true, disable category changing
}

const BusinessEditor: React.FC<EditorProps> = ({ business, onClose, onSave, isPartnerView = false }) => {
  const hierarchy = getCategoryHierarchy();
  
  // Form State
  const [formData, setFormData] = useState<Partial<Business>>({
    id: `biz_${Date.now()}`,
    name: '',
    description: '',
    shortDescription: '',
    address: 'East Hampton, NY',
    phone: '',
    email: '',
    website: '',
    rating: 5.0,
    reviewCount: 0,
    verified: true,
    imageUrl: 'https://picsum.photos/800/600',
    gallery: [],
    services: [],
    reviews: [],
    yearsInBusiness: 1,
    bioVideoUrl: '',
    bioText: ''
  });

  const [selectedCat, setSelectedCat] = useState(hierarchy[0]?.id || '');
  const [selectedSub, setSelectedSub] = useState(hierarchy[0]?.subCategories[0]?.id || '');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  useEffect(() => {
    if (business) {
        setFormData(business);
        // Try to find current category for this business to set dropdowns
        const data = getDirectoryData();
        for(const c of data) {
            for(const s of c.subCategories) {
                if(s.businesses.find(b => b.id === business.id)) {
                    setSelectedCat(c.id);
                    setSelectedSub(s.id);
                }
            }
        }
    }
  }, [business]);

  // Filter subcategories based on selected category
  const activeSubCategories = hierarchy.find(c => c.id === selectedCat)?.subCategories || [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (val: string) => {
    setFormData(prev => ({ ...prev, services: val.split(',').map(s => s.trim()) }));
  };

  const handleImageUpload = (b64: string) => {
    setFormData(prev => ({ ...prev, imageUrl: b64 }));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryImage) {
        setFormData(prev => ({
            ...prev,
            gallery: [...(prev.gallery || []), newGalleryImage]
        }));
        setNewGalleryImage('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData(prev => {
        const newGallery = [...(prev.gallery || [])];
        newGallery.splice(index, 1);
        return { ...prev, gallery: newGallery };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && selectedCat && selectedSub) {
      saveBusiness(formData as Business, selectedCat, selectedSub);
      onSave();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-hamptons-navy font-serif">
            {business ? 'Edit Profile' : 'New Partner'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Section 1: Classification - Disabled for Partners usually, but editable here for now */}
           <div className="md:col-span-2 bg-slate-50 p-4 rounded border border-gray-200">
             <h3 className="font-bold text-sm uppercase text-gray-500 mb-3">Directory Placement</h3>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Main Category</label>
                  <select 
                    value={selectedCat} 
                    onChange={e => { setSelectedCat(e.target.value); setSelectedSub(''); }}
                    className="w-full p-2 border rounded text-gray-900 bg-white disabled:bg-gray-100"
                    disabled={isPartnerView}
                  >
                    {hierarchy.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sub Category</label>
                  <select 
                    value={selectedSub} 
                    onChange={e => setSelectedSub(e.target.value)}
                    className="w-full p-2 border rounded text-gray-900 bg-white disabled:bg-gray-100"
                    disabled={isPartnerView}
                  >
                    <option value="">Select Sub-Category</option>
                    {activeSubCategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
               </div>
             </div>
             {isPartnerView && <p className="text-xs text-gray-500 mt-2 italic">Contact admin to change category classification.</p>}
           </div>

           {/* Section 2: Basic Info */}
           <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Business Name</label>
                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Short Description</label>
                <input name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" placeholder="One line summary..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Phone</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Email</label>
                <input name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" />
              </div>
           </div>

           <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Website</label>
                <input name="website" value={formData.website} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Profile Cover Image</label>
                <div className="flex gap-2">
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" placeholder="URL" />
                    <ImageUploader onImageSelected={handleImageUpload} label="Upload" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Years in Business</label>
                <input type="number" name="yearsInBusiness" value={formData.yearsInBusiness} onChange={handleChange} className="w-full p-2 border rounded text-gray-900 bg-white" />
              </div>
           </div>

           {/* Full Width */}
           <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700">Full Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full p-2 border rounded text-gray-900 bg-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Services (comma separated)</label>
                <input 
                  value={formData.services?.join(', ')} 
                  onChange={e => handleServicesChange(e.target.value)} 
                  className="w-full p-2 border rounded text-gray-900 bg-white" 
                  placeholder="Installation, Maintenance, Consultation"
                />
              </div>
           </div>

           {/* NEW: Partner Bio & Video Section */}
           <div className="md:col-span-2 bg-slate-900 p-6 rounded border border-gray-700 text-white mt-4">
             <div className="flex items-center gap-2 mb-4">
                <Video className="text-hamptons-gold" />
                <h3 className="font-bold text-hamptons-gold">Partner Bio & Video</h3>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                   <label className="block text-sm font-bold text-gray-300 mb-1">Bio Video URL</label>
                   <input 
                      name="bioVideoUrl" 
                      value={formData.bioVideoUrl || ''} 
                      onChange={handleChange} 
                      className="w-full p-2 border border-gray-600 rounded text-white bg-slate-800 focus:border-hamptons-gold focus:ring-1 focus:ring-hamptons-gold" 
                      placeholder="https://... (MP4 Link)"
                   />
                   <p className="text-xs text-gray-500 mt-1">Direct link to an MP4 video file recommended.</p>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-300 mb-1">Short Bio / Introduction</label>
                   <textarea 
                      name="bioText" 
                      value={formData.bioText || ''} 
                      onChange={handleChange} 
                      rows={3} 
                      className="w-full p-2 border border-gray-600 rounded text-white bg-slate-800 focus:border-hamptons-gold focus:ring-1 focus:ring-hamptons-gold" 
                      placeholder="A brief message from the founder..."
                   />
                </div>
             </div>
           </div>

           {/* Portfolio Gallery Management */}
           <div className="md:col-span-2 border-t border-gray-100 pt-6">
              <h3 className="font-bold text-hamptons-navy mb-4">Portfolio Gallery</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.gallery?.map((img, idx) => (
                      <div key={idx} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          >
                              <Trash2 size={14} />
                          </button>
                      </div>
                  ))}
                  {(!formData.gallery || formData.gallery.length === 0) && (
                      <div className="col-span-2 text-gray-400 text-sm italic py-4">No images in gallery yet.</div>
                  )}
              </div>

              <div className="flex gap-2 items-end">
                  <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Add Image URL</label>
                      <input 
                          value={newGalleryImage}
                          onChange={e => setNewGalleryImage(e.target.value)}
                          className="w-full p-2 border rounded text-gray-900 bg-white"
                          placeholder="https://..."
                      />
                  </div>
                  <div className="pb-0.5">
                    <ImageUploader onImageSelected={b64 => setNewGalleryImage(b64)} label="Upload" />
                  </div>
                  <button 
                      type="button"
                      onClick={handleAddGalleryImage}
                      disabled={!newGalleryImage}
                      className="bg-hamptons-navy text-white px-4 py-2 rounded font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 mb-0.5"
                  >
                      <Plus size={18} /> Add
                  </button>
              </div>
           </div>

           <div className="md:col-span-2 flex justify-end gap-3 pt-6 border-t border-gray-100">
             <button type="button" onClick={onClose} className="px-6 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded">Cancel</button>
             <button type="submit" className="px-6 py-2 bg-hamptons-navy text-white font-bold rounded hover:bg-slate-800 flex items-center gap-2">
               <Save size={18} /> Save Changes
             </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessEditor;
