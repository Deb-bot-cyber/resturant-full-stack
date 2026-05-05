import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X, Settings2 } from 'lucide-react';

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isFavorite: false
  });
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, menuRes] = await Promise.all([
        axios.get(`${API_URL}/api/categories`),
        axios.get(`${API_URL}/api/menu`)
      ]);
      setCategories(catRes.data);
      setItems(menuRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category?._id || item.category,
      image: item.image,
      isFavorite: item.isFavorite || false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) {
      try {
        await axios.delete(`${API_URL}/api/menu/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${API_URL}/api/menu/${editingItem._id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/menu`, formData);
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', category: '', image: '', isFavorite: false });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    try {
      await axios.post(`${API_URL}/api/categories`, { name: newCategoryName });
      setNewCategoryName('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete category? Items in this category might be affected.')) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif text-white mb-2">Menu Collection</h1>
          <p className="text-gray-400 tracking-widest text-xs uppercase font-black">Curate your royal culinary offerings</p>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', price: '', category: '', image: '', isFavorite: false }); setIsModalOpen(true); }}
          className="bg-[#FFE600] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          <Plus size={16} /> Add New Dish
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
        {/* Sidebar: Categories */}
        <div className="xl:col-span-1 space-y-8">
           <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8">
              <h3 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Settings2 size={14} className="text-[#FFE600]" /> Manage Categories
              </h3>
              <div className="space-y-3 mb-6">
                {categories.map(cat => (
                  <div key={cat._id} className="flex items-center justify-between group">
                    <span className="text-gray-400 text-sm">{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat._id)} className="text-gray-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="NEW CAT..."
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white w-full uppercase"
                />
                <button onClick={handleAddCategory} className="bg-white/10 text-white p-2 rounded-xl hover:bg-[#FFE600] hover:text-black transition-colors">
                  <Plus size={16} />
                </button>
              </div>
           </div>
        </div>

        {/* Main Content: Dishes */}
        <div className="xl:col-span-3 space-y-8">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH THE MENU..."
              className="w-full bg-[#111111] border border-white/5 rounded-full pl-16 pr-8 py-5 text-sm font-black text-white uppercase tracking-widest focus:outline-none focus:border-[#FFE600] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredItems.map(item => (
              <div key={item._id} className="bg-[#111111] border border-white/5 rounded-3xl p-6 group hover:border-white/10 transition-all">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5 shadow-xl">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-lg font-black text-white uppercase tracking-tight">{item.name}</h4>
                      <span className="text-[#FFE600] font-black">${item.price}</span>
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-4">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-3 py-1 rounded-full">
                        {item.category?.name || 'Uncategorized'}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-gray-400 hover:text-[#FFE600] hover:bg-white/5 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-[#111111] border border-white/5 rounded-[40px] w-full max-w-2xl p-10 relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
            <h2 className="text-3xl font-serif text-white mb-8 tracking-tighter uppercase">{editingItem ? 'Edit Dish' : 'Add New Dish'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4">Dish Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white uppercase text-xs font-black focus:border-[#FFE600] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4">Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-black text-xs focus:border-[#FFE600] outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white uppercase text-xs font-black focus:border-[#FFE600] outline-none">
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs font-medium focus:border-[#FFE600] outline-none h-32" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-widest ml-4">Image URL</label>
                <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-xs focus:border-[#FFE600] outline-none" />
              </div>
              <div className="flex items-center gap-3 ml-4">
                <input type="checkbox" checked={formData.isFavorite} onChange={e => setFormData({...formData, isFavorite: e.target.checked})} className="w-5 h-5 rounded bg-white/5 border-white/10" />
                <label className="text-[10px] font-black uppercase text-white/60 tracking-widest">Mark as Royal Special (Favorite)</label>
              </div>
              <button type="submit" className="w-full bg-[#FFE600] text-black font-black py-5 rounded-full uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-2xl mt-4">
                {editingItem ? 'Save Changes' : 'Create Royal Dish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
