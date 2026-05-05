import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Search, Plus, Minus, Trash2, User, MapPin, LayoutGrid, List, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import Tooltip from '../../components/Tooltip';

const POS = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('list');
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
      toast.error('Failed to load menu data');
    }
  };

  const addToCart = (item) => {
    const existing = cart.find(i => i._id === item._id);
    if (existing) {
      setCart(cart.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast.success(`${item.name} added to tray`, { duration: 1000 });
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
    const item = cart.find(i => i._id === id);
    setCart(cart.filter(i => i._id !== id));
    if (item) toast.success(`${item.name} removed`);
  };

  const total = cart.reduce((acc, i) => acc + (i.price * i.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    const loadingToast = toast.loading('Processing payment...');
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
        status: 'completed'
      };
      await axios.post(`${API_URL}/api/orders`, orderData);
      toast.success('Order Completed Successfully!', { id: loadingToast });
      setCart([]);
      setCustomerInfo({ name: '', phone: '', address: 'Walk-in Customer' });
    } catch (err) {
      toast.error('Failed to process order', { id: loadingToast });
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
    <div className="flex h-[calc(100vh-120px)] -m-8 overflow-hidden">
      {/* Left Column: Header & Menu */}
      <div className="flex-1 flex flex-col gap-8 p-8 overflow-hidden min-w-0">
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          <div className="flex justify-between items-center gap-4 shrink-0">
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600]"
                />
              </div>

              <div className="relative">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-[#0A0A0A] border border-white/10 rounded-lg pl-4 pr-10 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600] cursor-pointer min-w-[140px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                   <Layers size={14} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 shadow-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#FFE600] text-black shadow-lg shadow-[#FFE600]/10' : 'text-gray-500 hover:text-white'}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#FFE600] text-black shadow-lg shadow-[#FFE600]/10' : 'text-gray-500 hover:text-white'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col min-h-0">
            <div className="overflow-y-auto flex-1 custom-scrollbar">
               {viewMode === 'list' ? (
                  <table className="w-full text-left text-sm">
                    <thead className="bg-black/40 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-white/5 sticky top-0 z-10">
                      <tr>
                        <th className="px-8 py-5 w-24">Img</th>
                        <th className="px-8 py-5">Product Name</th>
                        <th className="px-8 py-5">Price</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredItems.map(item => (
                        <tr key={item._id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => addToCart(item)}>
                          <td className="px-8 py-4">
                            <img src={item.image} className="w-10 h-10 rounded-lg object-cover transition-all border border-white/5" />
                          </td>
                          <td className="px-8 py-4">
                            <span className="font-medium text-white">{item.name}</span>
                            <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">{item.category?.name}</p>
                          </td>
                          <td className="px-8 py-4 font-bold text-gray-200">${item.price}</td>
                          <td className="px-8 py-4 text-right">
                             <Tooltip text="Add to Tray">
                                <button className="bg-white/5 text-white p-2 rounded-lg group-hover:bg-[#FFE600] group-hover:text-black transition-all">
                                   <Plus size={16} />
                                </button>
                             </Tooltip>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               ) : (
                  <div className="p-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {filteredItems.map(item => (
                        <div 
                           key={item._id} 
                           onClick={() => addToCart(item)}
                           className="bg-black/20 border border-white/5 rounded-2xl p-4 cursor-pointer hover:border-[#FFE600]/50 transition-all group"
                        >
                           <div className="aspect-square rounded-xl overflow-hidden mb-4 border border-white/5">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-all" />
                           </div>
                           <h4 className="text-white text-[11px] font-bold uppercase tracking-tight mb-1 truncate">{item.name}</h4>
                           <div className="flex justify-between items-center">
                              <span className="text-gray-600 text-[9px] uppercase font-bold tracking-widest">{item.category?.name}</span>
                              <span className="text-[#FFE600] font-bold text-xs">${item.price}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
               {filteredItems.length === 0 && (
                <div className="py-24 text-center text-gray-500 font-medium">No products found.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Order Tray (Full Height) */}
      <div className="w-[480px] bg-[#111111] border-l border-white/5 flex flex-col h-full shadow-2xl shrink-0">
         <div className="bg-black/40 p-8 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-[#FFE600] text-black rounded-xl">
                  <ShoppingBag size={20} />
               </div>
               <div>
                  <h3 className="text-white text-base font-bold uppercase tracking-widest">Order Tray</h3>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">{cart.length} items selected</p>
               </div>
            </div>
            <Tooltip text="Reset Cart">
              <button onClick={() => { setCart([]); toast.success('Cart cleared'); }} className="text-[10px] font-bold text-gray-600 uppercase hover:text-rose-500 tracking-widest transition-colors">Clear All</button>
            </Tooltip>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <table className="w-full text-left text-sm border-separate border-spacing-y-2">
               <thead className="text-gray-600 uppercase text-[9px] font-bold tracking-widest">
                  <tr>
                     <th className="px-4 py-2">Item</th>
                     <th className="px-4 py-2 text-center">Qty</th>
                     <th className="px-4 py-2 text-right">Total</th>
                     <th className="px-4 py-2"></th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {cart.map(item => (
                     <tr key={item._id} className="bg-white/[0.02] hover:bg-white/[0.04] transition-colors rounded-xl overflow-hidden">
                        <td className="px-4 py-4 first:rounded-l-xl">
                           <span className="text-white font-medium block leading-none">{item.name}</span>
                        </td>
                        <td className="px-4 py-4">
                           <div className="flex items-center justify-center gap-3">
                              <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-600 hover:text-white p-1"><Minus size={12} /></button>
                              <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item._id, 1)} className="text-gray-600 hover:text-[#FFE600] p-1"><Plus size={12} /></button>
                           </div>
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-gray-300">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="px-4 py-4 text-right last:rounded-r-xl">
                           <button onClick={() => removeFromCart(item._id)} className="text-gray-800 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {cart.length === 0 && (
              <div className="h-full py-40 text-center text-gray-700 opacity-50 flex flex-col items-center justify-center">
                 <ShoppingBag size={64} className="mb-4" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">No Items Selected</span>
              </div>
            )}
         </div>

         <div className="p-8 bg-black/40 border-t border-white/5 space-y-6 shrink-0">
            <div className="space-y-3">
               <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                     <User size={14} className="text-gray-600" />
                     <input 
                        value={customerInfo.name}
                        onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="NAME..."
                        className="bg-transparent border-none text-[10px] font-bold text-white w-full uppercase outline-none"
                     />
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                     <MapPin size={14} className="text-gray-600" />
                     <input 
                        value={customerInfo.address}
                        onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="TABLE..."
                        className="bg-transparent border-none text-[10px] font-bold text-white w-full uppercase outline-none"
                     />
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center border-t border-white/5 pt-4">
               <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Grand Total</span>
               <span className="text-3xl font-bold text-[#FFE600]">${total.toFixed(2)}</span>
            </div>

            <button 
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
              className="w-full bg-[#FFE600] text-black font-bold py-5 rounded-xl uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-20 shadow-xl shadow-[#FFE600]/10"
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default POS;
