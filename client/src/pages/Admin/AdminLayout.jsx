import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Menu, ShoppingBag, ArrowLeft, Users, Bell, Monitor, FileText, DollarSign, X, Layers, MessageCircle } from 'lucide-react';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} />, end: true },
    { name: 'POS Terminal', path: '/admin/pos', icon: <Monitor size={18} /> },
    { name: 'Menu', path: '/admin/menu', icon: <Menu size={18} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Layers size={18} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingBag size={18} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={18} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageCircle size={18} /> },
    { name: 'Events', path: '/admin/events', icon: <FileText size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex overflow-hidden">
      {/* Desktop Sidebar (Always visible on large screens) */}
      <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col hidden lg:flex h-screen shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <Link to="/" className="text-lg tracking-widest font-black uppercase">
            Resto<span className="text-[#FFE600]">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive ? 'bg-[#FFE600] text-black font-bold' : 'text-gray-400 hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white transition-all">
            <ArrowLeft size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Back to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Universal Header (Mobile & Desktop) */}
        <header className="h-20 bg-[#111111] border-b border-white/5 flex items-center justify-between px-6 lg:px-12 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                <Menu size={20} />
             </button>
             <h2 className="text-[10px] font-black tracking-[0.3em] text-gray-500 uppercase hidden sm:block">Management Portal</h2>
          </div>
          <div className="flex items-center gap-6">
            <Bell size={18} className="text-gray-500" />
            <div className="w-8 h-8 rounded-full bg-[#FFE600] flex items-center justify-center text-black font-black text-xs">A</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
           <div className="absolute inset-0 bg-black/90" onClick={() => setIsMobileSidebarOpen(false)} />
           <div className="absolute inset-y-0 left-0 w-64 bg-[#111111] border-r border-white/5 flex flex-col">
              <div className="h-20 flex items-center justify-between px-8 border-b border-white/5">
                <span className="text-xs font-black uppercase tracking-widest">Admin</span>
                <button onClick={() => setIsMobileSidebarOpen(false)}><X size={20} /></button>
              </div>
              <nav className="flex-1 py-8 px-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name} to={item.path} end={item.end}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg ${isActive ? 'bg-[#FFE600] text-black font-bold' : 'text-gray-400'}`
                    }
                  >
                    {item.icon}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
