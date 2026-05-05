import { API_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ExquisiteFavorites = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/api/menu`),
        axios.get(`${API_URL}/api/categories`)
      ]);
      // Show favorites first, or all items if no favorites marked
      const filtered = menuRes.data.filter(i => i.isFavorite);
      setItems(filtered.length > 0 ? filtered.slice(0, 8) : menuRes.data.slice(0, 8));
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = activeCategory === 'all' 
    ? items 
    : items.filter(item => item.category?._id === activeCategory || item.category === activeCategory);

  return (
    <section id="menu" className="bg-[#0A0A0A] py-24 md:py-32 font-sans">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-none uppercase tracking-tighter"
            >
              Royal<br />Classics
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-white/40 text-sm md:text-base max-w-md font-bold uppercase tracking-[0.2em]"
            >
              A curated selection of India's most beloved flavors, from the clay ovens of Punjab to the royal kitchens of Lucknow.
            </motion.p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === 'all' ? 'bg-[#FFE600] text-black' : 'text-white/40 hover:text-white border border-white/10'}`}
            >
              All Specialties
            </button>
            {categories.slice(0, 4).map(cat => (
              <button 
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat._id ? 'bg-[#FFE600] text-black' : 'text-white/40 hover:text-white border border-white/10'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div 
              key={item._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-[#111111] border border-white/5 rounded-[40px] p-6 hover:border-[#FFE600]/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
            >
              <div className="relative aspect-square mb-6 rounded-[32px] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                   <div className="bg-black/80 backdrop-blur-md p-2 rounded-full text-[#FFE600]">
                      <Star size={12} fill="currentColor" />
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                   <h3 className="text-white text-lg font-black uppercase tracking-tight leading-tight group-hover:text-[#FFE600] transition-colors">{item.name}</h3>
                   <span className="text-[#FFE600] font-black text-lg tracking-tighter">${item.price}</span>
                </div>
                <p className="text-gray-500 text-xs font-medium leading-relaxed line-clamp-2 uppercase tracking-wide">
                   {item.description}
                </p>
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-white/5 text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#FFE600] hover:text-black transition-all group/btn"
                >
                  <Plus size={16} className="group-hover/btn:rotate-90 transition-transform duration-500" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add To Tray</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExquisiteFavorites;
