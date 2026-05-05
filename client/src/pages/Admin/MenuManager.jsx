import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Tooltip from '../../components/Tooltip';

const MenuManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isFavorite: false
  });

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
      toast.error('Failed to load menu data');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    let categoryId = item.category?._id || item.category;
    if (typeof categoryId === 'string' && categoryId.length > 0 && !/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      const matchedCat = categories.find(c => c.name === categoryId);
      if (matchedCat) categoryId = matchedCat._id;
    }
    
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: categoryId,
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
        toast.success('Item deleted');
      } catch (err) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading(editingItem ? 'Updating item...' : 'Creating item...');
    try {
      if (editingItem) {
        await axios.put(`${API_URL}/api/menu/${editingItem._id}`, formData);
        toast.success('Item updated', { id: loadingToast });
      } else {
        await axios.post(`${API_URL}/api/menu`, formData);
        toast.success('Item created', { id: loadingToast });
      }
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', category: '', image: '', isFavorite: false });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-medium text-white mb-1">Menu Management</h1>
          <p className="text-gray-500 text-sm">Manage your restaurant's culinary offerings.</p>
        </div>
        <Tooltip text="Create a new dish">
          <button 
            onClick={() => { setEditingItem(null); setFormData({ name: '', description: '', price: '', category: '', image: '', isFavorite: false }); setIsModalOpen(true); }}
            className="bg-[#FFE600] text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors text-sm shadow-lg shadow-[#FFE600]/10"
          >
            <Plus size={18} /> Add Menu Item
          </button>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600]"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/40 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5 w-24">Img</th>
              <th className="px-8 py-5">Name</th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5 text-center">Price</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredItems.map(item => (
              <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <img src={item.image} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{item.name}</span>
                    {item.isFavorite && <Tooltip text="Royal Special"><Star size={12} className="text-[#FFE600] fill-[#FFE600]" /></Tooltip>}
                  </div>
                </td>
                <td className="px-8 py-5 text-gray-400">
                  <span className="bg-white/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {item.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-8 py-5 text-center font-bold text-gray-200">${item.price}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    <Tooltip text="Edit Dish">
                      <button onClick={() => handleEdit(item)} className="text-gray-600 hover:text-[#FFE600] transition-colors p-2">
                        <Edit2 size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete Dish">
                      <button onClick={() => handleDelete(item._id)} className="text-gray-600 hover:text-rose-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="py-24 text-center text-gray-500 font-medium">No items found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 w-full max-w-lg relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-xl font-medium text-white mb-6 uppercase tracking-tighter">
              {editingItem ? 'Edit Item' : 'New Menu Item'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Dish Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#FFE600] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price ($)</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#FFE600] outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Category</label>
                <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#FFE600] outline-none">
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm h-24 outline-none focus:border-[#FFE600]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FFE600]" />
              </div>
              <div className="flex items-center gap-3 ml-1 pt-2">
                <input type="checkbox" checked={formData.isFavorite} onChange={e => setFormData({...formData, isFavorite: e.target.checked})} className="w-4 h-4 rounded border-white/10" />
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mark as Royal Special</label>
              </div>
              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-[#FFE600] text-black font-bold py-3.5 rounded-lg uppercase tracking-widest text-xs hover:bg-white transition-all mt-4 disabled:opacity-50"
              >
                {editingItem ? 'Save Changes' : 'Create Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
