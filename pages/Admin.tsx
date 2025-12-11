
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Plus, Trash2, Edit2, LogOut, Save, X, LayoutDashboard, Briefcase, FolderTree, Image as ImageIcon, Upload, Home, Eye, FileText, Check } from 'lucide-react';
import { logout, isAuthenticated, getUserRole } from '../services/auth';
import { 
  getDirectoryData, 
  deleteBusiness, 
  getCategoryHierarchy,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getHomepageSettings,
  saveHomepageSettings,
  getPageContent,
  savePageContent
} from '../services/db';
import { Category, Business, SubCategory, HomepageSettings, PageContent } from '../types';
import DynamicIcon from '../components/DynamicIcon';
import ImageUploader from '../components/ImageUploader';
import BusinessEditor from '../components/BusinessEditor';
import WYSIWYGEditor from '../components/WYSIWYGEditor';

// --- Login is now handled in pages/Auth.tsx, this component is Deprecated but kept if needed for route compatibility, redirecting ---
export const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/login');
    }, [navigate]);
    return null;
};

// --- Page Content Manager (CMS) ---
const PageContentManager: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState('home');
    const [content, setContent] = useState<PageContent>({ slug: 'home', title: '', subtitle: '', body: '', imageUrl: '' });
    const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);

    useEffect(() => {
        // Load content when selection changes
        const data = getPageContent(selectedPage);
        setContent(data);
        if(selectedPage === 'home') {
            setHomepageSettings(getHomepageSettings());
        }
    }, [selectedPage]);

    const handleSave = () => {
        savePageContent(content);
        alert('Page content saved successfully!');
    };

    const handleHomeHeroChange = (field: 'title' | 'subtitle', value: string) => {
        setContent(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Site Pages</h1>
                <button onClick={handleSave} className="bg-hamptons-navy text-white px-6 py-2 rounded font-bold hover:bg-slate-800 flex items-center gap-2">
                    <Save size={20} /> Save Changes
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Select Page to Edit</label>
                    <select 
                        value={selectedPage} 
                        onChange={e => setSelectedPage(e.target.value)}
                        className="w-full md:w-64 p-2 border rounded text-gray-900 bg-white font-bold"
                    >
                        <option value="home">Homepage (Hero & Content)</option>
                        <option value="about">About Us Page</option>
                        <option value="apply">Partner Application Page</option>
                    </select>
                </div>

                {/* VISUAL EDITOR FOR HOMEPAGE HERO */}
                {selectedPage === 'home' && homepageSettings ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800 flex items-start gap-2">
                           <Eye size={16} className="mt-0.5" />
                           <p><strong>Visual Editor:</strong> You are editing the Homepage Hero text. Click directly on the preview text below to edit it.</p>
                        </div>
                        
                        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl border border-gray-300 group">
                            {/* Background Simulation */}
                            <div className="absolute inset-0 z-0">
                                {homepageSettings.heroVideoUrl ? (
                                    <video src={homepageSettings.heroVideoUrl} muted loop autoPlay className="w-full h-full object-cover" />
                                ) : (
                                    <img src={homepageSettings.heroImages[0] || ''} className="w-full h-full object-cover" alt="Hero" />
                                )}
                                <div className="absolute inset-0 bg-hamptons-navy/60"></div>
                            </div>

                            {/* Editable Overlay */}
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
                                <span className="inline-block py-1 px-3 rounded-full bg-hamptons-gold/20 border border-hamptons-gold text-hamptons-gold text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
                                    Exclusive Directory
                                </span>
                                
                                <input
                                    type="text"
                                    value={content.title}
                                    onChange={e => handleHomeHeroChange('title', e.target.value)}
                                    className="font-serif text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl leading-tight bg-transparent text-center border border-transparent hover:border-white/50 focus:border-hamptons-gold focus:ring-0 focus:bg-black/20 rounded p-2 transition-all w-full max-w-4xl"
                                    placeholder="Click to edit Title..."
                                />
                                
                                <textarea
                                    value={content.subtitle}
                                    onChange={e => handleHomeHeroChange('subtitle', e.target.value)}
                                    className="text-lg text-gray-200 mb-8 font-light tracking-wide max-w-2xl mx-auto bg-transparent text-center border border-transparent hover:border-white/50 focus:border-hamptons-gold focus:ring-0 focus:bg-black/20 rounded p-2 transition-all w-full h-24 resize-none"
                                    placeholder="Click to edit Subtitle..."
                                />

                                <div className="flex gap-4 opacity-50 pointer-events-none">
                                    <button className="px-8 py-3 bg-hamptons-gold text-hamptons-navy font-bold rounded-full">Browse</button>
                                    <button className="px-8 py-3 border-2 border-white text-white font-bold rounded-full">Concierge</button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Homepage Sections */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
                            <h3 className="font-bold text-gray-700 mb-4">Tagline Section</h3>
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tagline Bar Text</label>
                                    <p className="text-xs text-gray-500 mb-2">This appears below the search bar.</p>
                                    <WYSIWYGEditor 
                                        value={content.title} // Reusing Title field logic for simplicity in this demo structure, realistically would be separate field
                                        onChange={(html) => setContent({...content, title: html})}
                                        className="h-32"
                                    /> 
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // STANDARD EDITOR FOR OTHER PAGES
                    <div className="grid grid-cols-1 gap-6 animate-fade-in">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Page Title</label>
                            <input 
                                value={content.title} 
                                onChange={e => setContent({...content, title: e.target.value})}
                                className="w-full p-2 border rounded text-gray-900 bg-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle / Headline</label>
                            <textarea 
                                value={content.subtitle} 
                                onChange={e => setContent({...content, subtitle: e.target.value})}
                                className="w-full p-2 border rounded text-gray-900 bg-white"
                                rows={2}
                            />
                        </div>
                        {selectedPage !== 'home' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Hero Image</label>
                            <div className="flex gap-2">
                                <input 
                                    value={content.imageUrl || ''} 
                                    onChange={e => setContent({...content, imageUrl: e.target.value})}
                                    className="w-full p-2 border rounded text-gray-900 bg-white"
                                    placeholder="Image URL"
                                />
                                <ImageUploader onImageSelected={b64 => setContent({...content, imageUrl: b64})} label="Upload" />
                            </div>
                            {content.imageUrl && (
                                <img src={content.imageUrl} alt="Preview" className="mt-2 h-32 object-cover rounded border" />
                            )}
                        </div>
                        )}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Main Content Body
                            </label>
                            <WYSIWYGEditor 
                                value={content.body} 
                                onChange={(html) => setContent({...content, body: html})}
                                className="min-h-[400px]"
                            />
                            <p className="text-xs text-gray-500 mt-1">Use the toolbar to format your text, add lists, or headings.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Homepage Manager ---
const HomepageManager: React.FC = () => {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    setSettings(getHomepageSettings());
    const data = getDirectoryData();
    const allBiz = data.flatMap(c => c.subCategories.flatMap(s => s.businesses));
    setBusinesses(allBiz);
  }, []);

  const handleSave = () => {
    if (settings) {
      saveHomepageSettings(settings);
      alert('Homepage settings saved!');
    }
  };

  const addHeroImage = () => {
    if (newImage && settings) {
      setSettings({ ...settings, heroImages: [...settings.heroImages, newImage] });
      setNewImage('');
    }
  };

  const removeHeroImage = (index: number) => {
    if (settings) {
      const newImages = [...settings.heroImages];
      newImages.splice(index, 1);
      setSettings({ ...settings, heroImages: newImages });
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-slate-900">Homepage Settings</h1>
        <button onClick={handleSave} className="bg-hamptons-navy text-white px-6 py-2 rounded font-bold hover:bg-slate-800 flex items-center gap-2">
          <Save size={20} /> Save Changes
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-hamptons-navy mb-4">Branding & Logos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Main Header Logo (Light Background)</label>
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-4 bg-gray-100 rounded border w-full h-24 flex items-center justify-center">
                        <img src={settings.logoUrl} alt="Main Logo" className="max-h-16 w-auto object-contain" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <input 
                        value={settings.logoUrl} 
                        onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                        className="w-full p-2 border rounded text-gray-900 bg-white"
                        placeholder="Logo URL"
                    />
                    <ImageUploader onImageSelected={(b64) => setSettings({...settings, logoUrl: b64})} label="Upload" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Footer Logo (Dark Background)</label>
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-4 bg-hamptons-navy rounded border w-full h-24 flex items-center justify-center">
                        <img src={settings.footerLogoUrl} alt="Footer Logo" className="max-h-16 w-auto object-contain" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <input 
                        value={settings.footerLogoUrl} 
                        onChange={(e) => setSettings({...settings, footerLogoUrl: e.target.value})}
                        className="w-full p-2 border rounded text-gray-900 bg-white"
                        placeholder="Footer Logo URL"
                    />
                    <ImageUploader onImageSelected={(b64) => setSettings({...settings, footerLogoUrl: b64})} label="Upload" />
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-hamptons-navy mb-4">Hero Media</h2>
        
        {/* Hero Video Section */}
        <div className="mb-8">
           <label className="block text-sm font-bold text-gray-700 mb-2">Video Background URL (Overrides Images)</label>
           <input 
              value={settings.heroVideoUrl || ''} 
              onChange={(e) => setSettings({...settings, heroVideoUrl: e.target.value})}
              className="w-full p-3 border rounded text-gray-900 bg-white"
              placeholder="https://.../video.mp4"
           />
           <p className="text-xs text-gray-500 mt-1">If a video URL is provided, it will play on loop instead of the image slideshow.</p>
        </div>

        <div className="border-t border-gray-100 pt-6">
            <h3 className="font-bold text-gray-700 mb-4">Image Slideshow (Fallback)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {settings.heroImages.map((img, idx) => (
                <div key={idx} className="relative group aspect-video bg-gray-100 rounded overflow-hidden">
                <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                <button 
                    onClick={() => removeHeroImage(idx)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} />
                </button>
                </div>
            ))}
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-bold text-gray-700 mb-1">Add New Slide (URL)</label>
                    <input 
                        value={newImage} 
                        onChange={(e) => setNewImage(e.target.value)} 
                        className="w-full p-2 border rounded text-gray-900 bg-white" 
                        placeholder="https://..." 
                    />
                </div>
                <div className="flex gap-2">
                    <ImageUploader onImageSelected={(b64) => setNewImage(b64)} label="Upload" />
                    <button 
                        onClick={addHeroImage} 
                        disabled={!newImage}
                        className="bg-hamptons-gold text-hamptons-navy px-4 py-2 rounded font-bold hover:bg-yellow-500 disabled:opacity-50"
                    >
                        Add Slide
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-hamptons-navy mb-4">Spotlight Partner</h2>
        <p className="text-gray-500 mb-4">Select the business to feature on the homepage.</p>
        <select 
          value={settings.spotlightPartnerId}
          onChange={(e) => setSettings({...settings, spotlightPartnerId: e.target.value})}
          className="w-full p-3 border rounded text-gray-900 bg-white max-w-md"
        >
          {businesses.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

// --- Category Editor Modal ---
interface CategoryEditorProps {
    category: Category | null;
    onClose: () => void;
    onSave: () => void;
}

const CategoryEditor: React.FC<CategoryEditorProps> = ({ category, onClose, onSave }) => {
    const [name, setName] = useState(category?.name || '');
    const [desc, setDesc] = useState(category?.description || '');
    const [img, setImg] = useState(category?.imageUrl || '');
    const [icon, setIcon] = useState(category?.icon || 'HelpCircle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name) return;
        
        if (category) {
            updateCategory(category.id, { name, description: desc, imageUrl: img, icon });
        } else {
            addCategory(name, desc, img, icon);
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-hamptons-navy font-serif">{category ? 'Edit Category' : 'New Category'}</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Category Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded text-gray-900 bg-white" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 border rounded text-gray-900 bg-white" rows={3} required />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Icon</label>
                            <div className="flex gap-2">
                                <input value={icon} onChange={e => setIcon(e.target.value)} className="w-full p-2 border rounded text-gray-900 bg-white" placeholder="Name or URL" />
                                <ImageUploader onImageSelected={setIcon} label="" />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Lucide name OR upload image</p>
                        </div>
                        <div className="w-16 flex items-end justify-center pb-2">
                             <div className="p-2 bg-gray-100 rounded text-hamptons-navy">
                                <DynamicIcon name={icon} size={24} />
                             </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label>
                        <div className="flex gap-2">
                            <input value={img} onChange={e => setImg(e.target.value)} className="w-full p-2 border rounded text-gray-900 bg-white" placeholder="Image URL" />
                            <ImageUploader onImageSelected={setImg} label="Upload" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-hamptons-navy text-white font-bold rounded hover:bg-slate-800">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- SubCategory Editor Modal ---
interface SubCategoryEditorProps {
    catId: string;
    subCategory: { id: string, name: string, icon: string } | null;
    onClose: () => void;
    onSave: () => void;
}

const SubCategoryEditor: React.FC<SubCategoryEditorProps> = ({ catId, subCategory, onClose, onSave }) => {
    const [name, setName] = useState(subCategory?.name || '');
    const [icon, setIcon] = useState(subCategory?.icon || 'Circle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name) return;
        
        if (subCategory) {
            updateSubCategory(catId, subCategory.id, name, icon);
        } else {
            addSubCategory(catId, name, icon);
        }
        onSave();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-hamptons-navy font-serif">{subCategory ? 'Edit Sub-Category' : 'New Sub-Category'}</h2>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Sub-Category Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded text-gray-900 bg-white" required />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Icon</label>
                            <div className="flex gap-2">
                                <input value={icon} onChange={e => setIcon(e.target.value)} className="w-full p-2 border rounded text-gray-900 bg-white" placeholder="Name or URL" />
                                <ImageUploader onImageSelected={setIcon} label="" />
                            </div>
                        </div>
                        <div className="w-16 flex items-end justify-center pb-2">
                             <div className="p-2 bg-gray-100 rounded text-hamptons-navy">
                                <DynamicIcon name={icon} size={24} />
                             </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-hamptons-navy text-white font-bold rounded hover:bg-slate-800">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- Category Manager Component ---
const CategoryManager: React.FC<{ data: Category[], onRefresh: () => void }> = ({ data, onRefresh }) => {
    const [editingCat, setEditingCat] = useState<Category | null | 'new'>(null);
    const [editingSub, setEditingSub] = useState<{ catId: string, sub: {id: string, name: string, icon: string} | null } | null>(null);

    const handleDeleteCat = (id: string) => {
        if(confirm("Delete this category? This will also remove all partners in it.")) {
            deleteCategory(id);
            onRefresh();
        }
    };

    const handleDeleteSub = (catId: string, subId: string) => {
        if(confirm("Delete this sub-category? Partners will be removed.")) {
            deleteSubCategory(catId, subId);
            onRefresh();
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Categories</h1>
                <button 
                  onClick={() => setEditingCat('new')}
                  className="bg-hamptons-gold text-hamptons-navy px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-500"
                >
                  <Plus size={20} /> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {data.map(cat => (
                    <div key={cat.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Category Header */}
                        <div className="p-4 bg-slate-50 border-b flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-hamptons-navy rounded-full flex items-center justify-center text-hamptons-gold overflow-hidden">
                                    <DynamicIcon name={cat.icon} size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">{cat.name}</h3>
                                    <p className="text-xs text-gray-500">{cat.subCategories.length} Sub-categories</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setEditingCat(cat)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"><Edit2 size={16} /></button>
                                <button onClick={() => handleDeleteCat(cat.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        
                        {/* Subcategories List */}
                        <div className="p-4">
                            <div className="space-y-2">
                                {cat.subCategories.map(sub => (
                                    <div key={sub.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100">
                                        <div className="flex items-center gap-2 pl-4">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
                                                <DynamicIcon name={sub.icon} size={14} />
                                            </div>
                                            <span className="text-gray-700 font-medium">{sub.name}</span>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{sub.businesses.length} partners</span>
                                        </div>
                                        <div className="flex gap-2 opacity-60 hover:opacity-100">
                                            <button onClick={() => setEditingSub({catId: cat.id, sub: sub})} className="text-indigo-600 p-1"><Edit2 size={14} /></button>
                                            <button onClick={() => handleDeleteSub(cat.id, sub.id)} className="text-red-600 p-1"><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setEditingSub({catId: cat.id, sub: null})}
                                className="mt-4 text-sm font-bold text-hamptons-navy hover:text-hamptons-gold flex items-center gap-1 pl-4"
                            >
                                <Plus size={16} /> Add Sub-Category
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {editingCat && (
                <CategoryEditor 
                    category={editingCat === 'new' ? null : editingCat}
                    onClose={() => setEditingCat(null)}
                    onSave={() => { onRefresh(); setEditingCat(null); }}
                />
            )}
            {editingSub && (
                <SubCategoryEditor
                    catId={editingSub.catId}
                    subCategory={editingSub.sub}
                    onClose={() => setEditingSub(null)}
                    onSave={() => { onRefresh(); setEditingSub(null); }}
                />
            )}
        </div>
    );
};

// --- Dashboard Component ---
export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'categories' | 'homepage' | 'pages'>('overview');
  const [editingBiz, setEditingBiz] = useState<Business | null | 'new'>(null);

  useEffect(() => {
    if (!isAuthenticated() || getUserRole() !== 'ADMIN') {
      navigate('/login');
      return;
    }
    setData(getDirectoryData());
  }, [navigate]);

  const refreshData = () => {
    setData(getDirectoryData());
    setEditingBiz(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this partner?')) {
      deleteBusiness(id);
      refreshData();
    }
  };

  // Stats
  const totalPartners = data.reduce((acc, cat) => acc + cat.subCategories.reduce((sAcc, sub) => sAcc + sub.businesses.length, 0), 0);
  const totalSubCats = data.reduce((acc, cat) => acc + cat.subCategories.length, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-slate-700">
           <ShieldCheck className="w-8 h-8 text-hamptons-gold mr-3" />
           <span className="font-serif font-bold text-xl">Admin</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-3 rounded text-left transition-colors ${activeTab === 'overview' ? 'bg-hamptons-gold text-slate-900 font-bold' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} className="mr-3" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('partners')}
            className={`w-full flex items-center px-4 py-3 rounded text-left transition-colors ${activeTab === 'partners' ? 'bg-hamptons-gold text-slate-900 font-bold' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Briefcase size={20} className="mr-3" /> Partners
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center px-4 py-3 rounded text-left transition-colors ${activeTab === 'categories' ? 'bg-hamptons-gold text-slate-900 font-bold' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FolderTree size={20} className="mr-3" /> Categories
          </button>
          <button 
            onClick={() => setActiveTab('homepage')}
            className={`w-full flex items-center px-4 py-3 rounded text-left transition-colors ${activeTab === 'homepage' ? 'bg-hamptons-gold text-slate-900 font-bold' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Home size={20} className="mr-3" /> Homepage
          </button>
          <button 
            onClick={() => setActiveTab('pages')}
            className={`w-full flex items-center px-4 py-3 rounded text-left transition-colors ${activeTab === 'pages' ? 'bg-hamptons-gold text-slate-900 font-bold' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
          >
            <FileText size={20} className="mr-3" /> Site Pages
          </button>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center text-gray-400 hover:text-white">
            <LogOut size={20} className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
            <span className="font-bold">PPOTH Admin</span>
            <button onClick={() => { logout(); navigate('/login'); }}><LogOut size={20} /></button>
        </div>

        <div className="p-8 max-w-7xl mx-auto">
          
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <h1 className="text-3xl font-serif font-bold text-slate-900">Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm uppercase font-bold">Total Partners</p>
                    <p className="text-4xl font-bold text-hamptons-navy mt-2">{totalPartners}</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm uppercase font-bold">Categories</p>
                    <p className="text-4xl font-bold text-hamptons-navy mt-2">{data.length}</p>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-sm uppercase font-bold">Sub-Categories</p>
                    <p className="text-4xl font-bold text-hamptons-navy mt-2">{totalSubCats}</p>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'partners' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Partners</h1>
                <button 
                  onClick={() => setEditingBiz('new')}
                  className="bg-hamptons-gold text-hamptons-navy px-4 py-2 rounded font-bold flex items-center gap-2 hover:bg-yellow-500"
                >
                  <Plus size={20} /> Add Partner
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map(cat => 
                      cat.subCategories.map(sub => 
                        sub.businesses.map(biz => (
                          <tr key={biz.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img className="h-10 w-10 rounded-full object-cover" src={biz.imageUrl} alt="" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{biz.name}</div>
                                  <div className="text-sm text-gray-500">{biz.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                                {sub.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {biz.verified ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  Vetted
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link to={`/business/${biz.id}`} target="_blank" className="text-blue-600 hover:text-blue-900 mr-4 inline-block" title="View Public Profile">
                                <Eye size={18} />
                              </Link>
                              <button onClick={() => setEditingBiz(biz)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                                <Edit2 size={18} />
                              </button>
                              <button onClick={() => handleDelete(biz.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <CategoryManager data={data} onRefresh={refreshData} />
          )}

          {activeTab === 'homepage' && (
            <HomepageManager />
          )}

          {activeTab === 'pages' && (
            <PageContentManager />
          )}
        </div>
      </main>
      
      {/* Editor Modal */}
      {editingBiz && (
        <BusinessEditor 
          business={editingBiz === 'new' ? null : editingBiz} 
          onClose={() => setEditingBiz(null)}
          onSave={refreshData}
        />
      )}
    </div>
  );
};
