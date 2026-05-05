import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Users, ShoppingBag, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/stats/dashboard-summary`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-[#FFE600]' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-500' },
    { title: 'Avg Order Value', value: `$${stats.averageOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-serif text-white mb-2 tracking-tight">Executive Dashboard</h1>
        <p className="text-gray-400 tracking-widest text-xs uppercase font-black">Real-time performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-[#111111] border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all">
            <div className="relative z-10">
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-4">{card.title}</p>
              <h3 className="text-3xl font-black text-white">{card.value}</h3>
            </div>
            <div className={`absolute top-8 right-8 ${card.color} opacity-20 group-hover:opacity-100 transition-all transform group-hover:scale-110`}>
              <card.icon size={32} />
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10 h-80 flex items-center justify-center">
          <p className="text-gray-500 text-xs uppercase font-black tracking-[0.2em]">Sales Activity Chart</p>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10 h-80 flex items-center justify-center">
          <p className="text-gray-500 text-xs uppercase font-black tracking-[0.2em]">Customer Growth Chart</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
