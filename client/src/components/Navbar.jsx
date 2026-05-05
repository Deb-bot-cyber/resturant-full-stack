import { API_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { LogOut, ShoppingBag, Clock, Menu, X } from 'lucide-react';
import MyOrdersModal from './MyOrdersModal';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, openAuthModal, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed z-50 flex justify-between items-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] left-0 right-0 mx-auto ${
        isScrolled 
          ? 'bg-white text-black py-3 px-6 md:px-8 top-4 w-[95%] max-w-7xl rounded-full shadow-2xl border border-black/5' 
          : 'bg-transparent text-white py-6 px-6 md:px-12 top-0 w-full max-w-full rounded-none border-transparent'
      }`}>
        {/* Logo */}
        <div className="text-xl md:text-2xl font-serif font-black tracking-tighter uppercase">
          SAFFRON & SILK
        </div>

        {/* Links & Button */}
        <div className="flex items-center gap-2 md:gap-6">
          <div className="hidden md:flex gap-6 text-[11px] font-bold tracking-[0.1em] uppercase">
            <a href="#" className="hover:opacity-70 transition-opacity">Philosophy</a>
            <a href="#menu" className="hover:opacity-70 transition-opacity">Royal Menu</a>
            <a href="#events" className="hover:opacity-70 transition-opacity">Festivals</a>
          </div>
          
          <div className="flex items-center gap-1 md:gap-3">
            {user && (
              <>
                <button onClick={() => setIsOrdersModalOpen(true)} className={`flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-colors ${isScrolled ? 'hover:text-[#FFE600]' : 'hover:text-[#FFE600]'}`} title="My Orders">
                  <Clock size={16} />
                  <span className="hidden lg:inline">Orders</span>
                </button>

                {user.role === 'admin' && (
                  <Link to="/admin" className={`flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-widest transition-colors ${isScrolled ? 'hover:text-[#FFE600]' : 'hover:text-[#FFE600]'}`} title="Admin Panel">
                    <ShoppingBag size={16} className="text-[#FFE600]" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}
                
                <button onClick={openCart} className={`relative p-2 transition-colors ${isScrolled ? 'hover:text-[#FFE600]' : 'hover:text-[#FFE600]'}`} title="Cart">
                  <ShoppingBag size={18} />
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-[#FFE600] text-black text-[10px] font-bold flex items-center justify-center rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>

                <div className="h-6 w-px bg-gray-500/30 mx-1 md:mx-2 hidden sm:block"></div>

                <span className="text-[11px] font-bold uppercase tracking-widest hidden lg:block max-w-[150px] truncate">
                  {user.email}
                </span>
                <button 
                  onClick={logout}
                  className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${isScrolled ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-red-500 text-white hover:bg-red-600'}`}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}

            {!user && (
              <button 
                onClick={openAuthModal}
                className={`px-4 md:px-6 py-2 md:py-2.5 text-[10px] md:text-[11px] font-bold uppercase tracking-wider transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled ? 'bg-black text-white hover:bg-gray-800 rounded-full' : 'bg-white text-black hover:bg-opacity-90 rounded-full'
                }`}
              >
                Login
              </button>
            )}

            {/* Hamburger for Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 md:hidden transition-colors ${isScrolled ? 'text-black hover:text-[#FFE600]' : 'text-white hover:text-[#FFE600]'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 mt-4 mx-4 bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 md:hidden"
            >
              <div className="flex flex-col gap-4 text-xs font-bold tracking-[0.2em] uppercase text-white/40">
                <a href="#" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FFE600] transition-colors py-2 border-b border-white/5">Philosophy</a>
                <a href="#menu" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FFE600] transition-colors py-2 border-b border-white/5">Royal Menu</a>
                <a href="#events" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#FFE600] transition-colors py-2 border-b border-white/5">Festivals</a>
              </div>
              {!user && (
                <button 
                  onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-[#FFE600] text-black font-[900] py-4 rounded-full uppercase tracking-widest text-[10px]"
                >
                  Login to Order
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      
      <MyOrdersModal isOpen={isOrdersModalOpen} onClose={() => setIsOrdersModalOpen(false)} />
    </>
  );
};

export default Navbar;
