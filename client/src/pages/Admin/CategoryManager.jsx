import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Tooltip from '../../components/Tooltip';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error('Fetch Categories Error:', err);
      toast.error('Failed to load categories. Is the server running?');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const normalizedName = newCategory.trim();
    
    if (!normalizedName) {
      toast.error('Please enter a category name');
      return;
    }

    // Client-side duplicate check
    const exists = categories.find(c => c.name.toLowerCase() === normalizedName.toLowerCase());
    if (exists) {
      toast.error('This category already exists');
      return;
    }
    
    setIsLoading(true);
    const loadingToast = toast.loading('Creating category...');
    
    try {
      const res = await axios.post(`${API_URL}/api/categories`, { name: normalizedName });
      
      setNewCategory('');
      setIsModalOpen(false);
      
      // Refresh list
      await fetchCategories();
      
      toast.success('Category created successfully!', { id: loadingToast });
    } catch (err) {
      console.error('Error adding category:', err);
      const errorMsg = err.response?.data?.message || 'Failed to create category. Check server logs.';
      toast.error(errorMsg, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This may affect menu items in this category.')) {
      try {
        await axios.delete(`${API_URL}/api/categories/${id}`);
        fetchCategories();
        toast.success('Category deleted');
      } catch (err) {
        toast.error('Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-medium text-white mb-1">Categories</h1>
          <p className="text-gray-500 text-sm">Organize your menu into distinct collections.</p>
        </div>
        <Tooltip text="Create a new food category">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FFE600] text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors text-sm shadow-lg shadow-[#FFE600]/10"
          >
            <Plus size={18} /> Add Category
          </button>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600]"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/40 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Name</th>
              <th className="px-8 py-5">Created At</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredCategories.map(cat => (
              <tr key={cat._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-5 font-medium text-white uppercase">{cat.name}</td>
                <td className="px-8 py-5 text-gray-400">{new Date(cat.createdAt).toLocaleDateString()}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end">
                    <Tooltip text="Delete Category">
                      <button 
                        onClick={() => handleDelete(cat._id)}
                        className="text-gray-600 hover:text-rose-500 transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCategories.length === 0 && (
          <div className="py-24 text-center text-gray-500 font-medium">No categories found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-xl font-medium text-white mb-6">New Category</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Category Name</label>
                 <input 
                  autoFocus
                  required
                  disabled={isLoading}
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="e.g. Royal Starters"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FFE600] outline-none disabled:opacity-50"
                />
              </div>
              <button 
                disabled={isLoading}
                className="w-full bg-[#FFE600] text-black font-bold py-3 rounded-lg hover:bg-white transition-colors mt-2 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManager;
