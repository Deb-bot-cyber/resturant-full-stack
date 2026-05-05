import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Menu, ShoppingBag, ArrowLeft, Settings, Users, Bell, Monitor, FileText, DollarSign, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} />, end: true },
    { name: 'POS Terminal', path: '/admin/pos', icon: <Monitor size={20} /> },
    { name: 'Finance', path: '/admin/finance', icon: <DollarSign size={20} /> },
    { name: 'Menu', path: '/admin/menu', icon: <Menu size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <Settings size={20} /> },
    { name: 'Events', path: '/admin/events', icon: <FileText size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col hidden md:flex sticky top-0 h-screen">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link to="/" className="text-xl tracking-[0.2em] font-serif uppercase">
            Resto<span className="text-[#FFE600]">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#FFE600]/10 text-[#FFE600]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium tracking-wide text-sm uppercase">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium tracking-wide text-sm uppercase">Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle Header */}
      <header className="h-20 bg-[#111111]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 md:px-8 sticky top-0 z-20 md:hidden">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 text-gray-400 hover:text-[#FFE600] transition-colors"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="text-lg tracking-[0.2em] font-serif uppercase">
          Resto<span className="text-[#FFE600]">Admin</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-[#FFE600]/20 border border-[#FFE600]/50 flex items-center justify-center">
          <Users size={16} className="text-[#FFE600]" />
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#111111] z-[101] flex flex-col md:hidden shadow-2xl border-r border-white/5"
            >
              <div className="h-20 flex items-center justify-between px-8 border-b border-white/5">
                <span className="text-xl tracking-[0.2em] font-serif uppercase">
                  Resto<span className="text-[#FFE600]">Admin</span>
                </span>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="text-gray-400 hover:text-rose-500">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 py-8 px-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#FFE600]/10 text-[#FFE600]'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="font-medium tracking-wide text-sm uppercase">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4 border-t border-white/5">
                <Link
                  to="/"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="font-medium tracking-wide text-sm uppercase">Back to Site</span>
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Top Header (Desktop) */}
        <header className="h-20 bg-[#111111]/80 backdrop-blur-md border-b border-white/5 hidden md:flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center space-x-4">
             <h2 className="text-lg font-serif tracking-widest text-gray-200">ADMINISTRATION</h2>
          </div>
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#FFE600]/20 border border-[#FFE600]/50 flex items-center justify-center">
              <Users size={16} className="text-[#FFE600]" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
