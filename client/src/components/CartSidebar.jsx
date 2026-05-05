import { API_URL } from '../utils/api';
import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Package, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const CartSidebar = () => {
  const { isCartOpen, closeCart, cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const { user, openAuthModal } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [address, setAddress] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!address) {
      alert('Please enter your delivery address');
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        customerName: user.name || user.email,
        phone: user.email, // using email since I migrated to email/pass
        address: address
      };

      await axios.post(`${API_URL}/api/orders`, orderData);
      setOrderComplete(true);
      setTimeout(() => {
        clearCart();
        setOrderComplete(false);
        setIsCheckingOut(false);
        setAddress('');
        closeCart();
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Order failed. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0A0A0A] border-l border-white/5 z-[101] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#111111]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FFE600] flex items-center justify-center text-black">
                   <ShoppingBag size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-serif text-white uppercase tracking-tight">Your Tray</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{cart.length} delicacies</p>
                </div>
              </div>
              <button onClick={closeCart} className="p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {orderComplete ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                      <Package size={48} />
                   </div>
                   <h3 className="text-2xl font-serif text-white uppercase tracking-tighter">Order Placed!</h3>
                   <p className="text-gray-500 text-sm font-bold uppercase tracking-widest max-w-xs">Our royal chefs have started preparing your feast.</p>
                </div>
              ) : cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-6 bg-white/[0.02] border border-white/5 p-4 rounded-3xl group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 shadow-lg">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                       <div className="flex justify-between items-start">
                          <h4 className="text-white text-xs font-black uppercase tracking-tight truncate mr-2">{item.name}</h4>
                          <button onClick={() => removeFromCart(item._id)} className="text-white/10 hover:text-rose-500 transition-colors">
                             <Trash2 size={16} />
                          </button>
                       </div>
                       <div className="flex justify-between items-end">
                          <div className="flex items-center gap-3 bg-black rounded-full px-3 py-1 border border-white/5">
                             <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="text-white/20 hover:text-[#FFE600] transition-colors">-</button>
                             <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="text-white/20 hover:text-[#FFE600] transition-colors">+</button>
                          </div>
                          <span className="text-[#FFE600] font-black text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center py-20">
                   <ShoppingBag size={64} className="mb-6" />
                   <p className="text-sm uppercase font-black tracking-widest">Your tray is empty</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {!orderComplete && cart.length > 0 && (
              <div className="p-8 bg-[#111111] border-t border-white/5 space-y-6">
                 {user && (
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-4">Delivery Address</p>
                      <div className="relative">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20">
                            <Wallet size={16} />
                         </div>
                         <input 
                           value={address}
                           onChange={(e) => setAddress(e.target.value)}
                           placeholder="TABLE NO. / STREET ADDRESS..."
                           className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-14 pr-6 py-4 text-[10px] font-black text-white uppercase tracking-widest focus:border-[#FFE600] outline-none transition-all"
                         />
                      </div>
                   </div>
                 )}

                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-white/40 text-[10px] font-black uppercase tracking-[0.2em] px-4">
                       <span>Total Balance</span>
                       <span className="text-white">${total.toFixed(2)}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full bg-[#FFE600] text-black font-black py-6 rounded-full uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 hover:bg-white transition-all shadow-[0_15px_30px_rgba(255,230,0,0.1)] group"
                    >
                       {isCheckingOut ? (
                         <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                       ) : (
                         <>
                           <span>{user ? 'Seal The Order' : 'Login To Order'}</span>
                           <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                         </>
                       )}
                    </button>
                 </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
