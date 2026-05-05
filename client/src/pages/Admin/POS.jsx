import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Search, Plus, Minus, Trash2, User, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const POS = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: 'Walk-in Customer' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get(`${API_URL}/api/menu`),
        axios.get(`${API_URL}/api/categories`)
      ]);
      setItems(menuRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i._id === item._id);
    if (existing) {
      setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(i => {
      if (i._id === id) {
        const newQty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    try {
      const orderData = {
        items: cart.map(i => ({
          menuItem: i._id,
          name: i.name,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: total,
        customerName: customerInfo.name || 'Walk-in Customer',
        phone: customerInfo.phone || 'N/A',
        address: customerInfo.address,
        status: 'completed' // POS orders are usually completed immediately
      };
      await axios.post(`${API_URL}/api/orders`, orderData);
      alert('Order Processed Successfully!');
      setCart([]);
      setCustomerInfo({ name: '', phone: '', address: 'Walk-in Customer' });
    } catch (err) {
      console.error(err);
      alert('Failed to process order');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category?._id === selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-[calc(100vh-140px)] gap-8 font-sans">
      {/* Left: Menu Selection */}
      <div className="flex-1 flex flex-col gap-8 h-full min-w-0">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH MENU..."
              className="w-full bg-[#111111] border border-white/5 rounded-full pl-16 pr-8 py-5 text-sm font-black text-white uppercase tracking-widest focus:border-[#FFE600] outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === 'all' ? 'bg-[#FFE600] text-black' : 'bg-[#111111] text-gray-400 border border-white/5'}`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-6 py-4 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat._id ? 'bg-[#FFE600] text-black' : 'bg-[#111111] text-gray-400 border border-white/5'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <div 
                key={item._id} 
                onClick={() => addToCart(item)}
                className="bg-[#111111] border border-white/5 rounded-3xl p-4 cursor-pointer hover:border-[#FFE600]/50 transition-all group"
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                </div>
                <h4 className="text-white text-xs font-black uppercase tracking-tight mb-1 truncate">{item.name}</h4>
                <div className="flex justify-between items-center">
                   <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{item.category?.name}</span>
                   <span className="text-[#FFE600] font-black">${item.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div className="w-[400px] flex flex-col gap-8 bg-[#111111] border border-white/5 rounded-[40px] p-8 h-full shadow-2xl overflow-hidden">
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
           <div className="w-12 h-12 rounded-2xl bg-[#FFE600] text-black flex items-center justify-center">
              <ShoppingBag size={24} />
           </div>
           <div>
              <h3 className="text-white font-serif text-xl uppercase tracking-tight">Order Tray</h3>
              <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">{cart.length} items selected</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
           {cart.map(item => (
             <div key={item._id} className="flex gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/5">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                   <h5 className="text-white text-[11px] font-black uppercase truncate mb-2">{item.name}</h5>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-500 hover:text-[#FFE600]"><Minus size={14} /></button>
                         <span className="text-white text-xs font-bold">{item.quantity}</span>
                         <button onClick={() => updateQuantity(item._id, 1)} className="text-gray-500 hover:text-[#FFE600]"><Plus size={14} /></button>
                      </div>
                      <span className="text-[#FFE600] font-black text-xs">${(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="text-gray-700 hover:text-rose-500 ml-2"><Trash2 size={16} /></button>
             </div>
           ))}
           {cart.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                <ShoppingBag size={64} className="mb-4" />
                <p className="text-xs uppercase font-black tracking-widest">Tray is empty</p>
             </div>
           )}
        </div>

        <div className="space-y-6 pt-6 border-t border-white/5">
           <div className="space-y-3">
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                 <User size={14} className="text-gray-500" />
                 <input 
                    value={customerInfo.name}
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                    placeholder="CUSTOMER NAME..."
                    className="bg-transparent border-none text-[10px] font-black text-white w-full uppercase outline-none"
                 />
              </div>
              <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3">
                 <MapPin size={14} className="text-gray-500" />
                 <input 
                    value={customerInfo.address}
                    onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                    placeholder="TABLE / ADDRESS..."
                    className="bg-transparent border-none text-[10px] font-black text-white w-full uppercase outline-none"
                 />
              </div>
           </div>

           <div className="flex justify-between items-center">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Total Amount</span>
              <span className="text-2xl font-black text-[#FFE600]">${total.toFixed(2)}</span>
           </div>

           <button 
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
              className="w-full bg-[#FFE600] text-black font-black py-5 rounded-full uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all disabled:opacity-30 shadow-[0_15px_30px_rgba(255,230,0,0.1)]"
           >
              {isProcessing ? 'PROCESSING...' : 'PROCESS PAYMENT'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
