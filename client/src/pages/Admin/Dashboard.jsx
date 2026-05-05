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
      if (res.data) {
        setStats({
          totalSales: res.data.totalSales || 0,
          totalOrders: res.data.totalOrders || 0,
          totalCustomers: res.data.totalCustomers || 0,
          averageOrderValue: res.data.averageOrderValue || 0
        });
      }
    } catch (err) {
      console.error('Stats Fetch Error:', err);
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `$${(stats.totalSales || 0).toLocaleString()}`, icon: DollarSign },
    { title: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag },
    { title: 'Total Customers', value: stats.totalCustomers || 0, icon: Users },
    { title: 'Avg Order Value', value: `$${(stats.averageOrderValue || 0).toFixed(2)}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-[#111111] border border-white/5 p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg text-[#FFE600]">
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">{card.title}</p>
                <h3 className="text-xl font-bold text-white">{card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-white/5 rounded-xl p-8 h-64 flex items-center justify-center border-dashed">
          <p className="text-gray-600 text-[10px] uppercase font-black tracking-[0.3em]">Revenue Analytics</p>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-xl p-8 h-64 flex items-center justify-center border-dashed">
          <p className="text-gray-600 text-[10px] uppercase font-black tracking-[0.3em]">Order Velocity</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
