import { API_URL } from '../utils/api';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, Mail, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const endpoint = isLogin ? 'login' : 'register';
    try {
      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, formData);
      login(res.data.user);
      closeAuthModal();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-[#111111] border border-white/5 rounded-[40px] w-full max-w-md p-8 sm:p-12 relative shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFE600] opacity-[0.03] blur-[80px] -mr-32 -mt-32 rounded-full" />
            
            <button 
              onClick={closeAuthModal} 
              className="absolute top-8 right-8 text-white/20 hover:text-[#FFE600] transition-colors p-2 hover:bg-white/5 rounded-full z-10"
            >
              <X size={20} />
            </button>

            <div className="relative z-10">
              <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter uppercase">
                  {isLogin ? 'Royal Login' : 'Join The Court'}
                </h2>
                <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">
                  {isLogin ? 'Access your saffron profile' : 'Begin your royal culinary journey'}
                </p>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] p-4 rounded-2xl mb-8 flex items-center space-x-3 font-bold uppercase tracking-widest"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-white/20 font-black ml-4">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#FFE600] transition-colors">
                        <User size={18} />
                      </div>
                      <input 
                        required 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#FFE600] focus:bg-white/[0.05] transition-all font-bold tracking-tight" 
                        placeholder="ALEXANDER SMITH" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/20 font-black ml-4">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#FFE600] transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      required 
                      type="email" 
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#FFE600] focus:bg-white/[0.05] transition-all font-bold tracking-tight" 
                      placeholder="NAME@DOMAIN.COM" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-white/20 font-black ml-4">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-[#FFE600] transition-colors">
                      <Lock size={18} />
                    </div>
                    <input 
                      required 
                      type="password" 
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-14 pr-6 py-5 text-white focus:outline-none focus:border-[#FFE600] focus:bg-white/[0.05] transition-all font-bold tracking-tight" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-[#FFE600] text-black font-black py-6 rounded-full hover:bg-white transition-all duration-500 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center space-x-3 disabled:opacity-50 group shadow-[0_15px_30px_rgba(255,230,0,0.15)]"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Enter The Palace' : 'Join The Court'}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-10 text-center">
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-black hover:text-[#FFE600] transition-colors"
                >
                  {isLogin ? "New here? Create an account" : "Already a member? Login"}
                </button>
              </div>

              {isLogin && (
                <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                   <p className="text-[9px] font-black uppercase tracking-widest text-white/20">
                     Demo Admin: <span className="text-[#FFE600]">admin@artisanfeast.com</span> / <span className="text-[#FFE600]">adminpassword123</span>
                   </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
