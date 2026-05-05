import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, ShoppingBag, Users, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const FinanceManager = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    fetchFinanceStats();
  }, []);

  const fetchFinanceStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`);
      const completedOrders = res.data.filter(o => o.status === 'completed' || o.status === 'delivered');
      
      const total = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
      const uniqueCustomers = new Set(completedOrders.map(o => o.customerName)).size;

      setStats({
        totalRevenue: total,
        totalOrders: completedOrders.length,
        totalCustomers: uniqueCustomers,
        averageOrderValue: completedOrders.length > 0 ? total / completedOrders.length : 0
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load financial records');
    }
  };

  const statCards = [
    { title: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign },
    { title: 'Total Orders', value: stats.totalOrders || 0, icon: ShoppingBag },
    { title: 'Total Customers', value: stats.totalCustomers || 0, icon: Users },
    { title: 'Avg Order Value', value: `$${(stats.averageOrderValue || 0).toFixed(2)}`, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl font-serif text-white uppercase tracking-[0.3em] font-black">Dashboard Overview</h1>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-[#111111] border border-white/5 p-6 rounded-xl hover:border-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-lg text-[#FFE600] border border-white/5">
                <card.icon size={20} />
              </div>
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest leading-none mb-1.5">{card.title}</p>
                <h3 className="text-xl font-bold text-white tracking-tight">
                    {card.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Large Analytics Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111111] border border-white/5 rounded-xl p-8 h-80 flex flex-col items-center justify-center border-dashed group hover:border-[#FFE600]/20 transition-all">
          <div className="p-4 bg-white/5 rounded-full mb-4 opacity-20 group-hover:opacity-100 transition-opacity">
             <Activity size={32} className="text-[#FFE600]" />
          </div>
          <p className="text-gray-600 text-[10px] uppercase font-black tracking-[0.4em]">Revenue Analytics</p>
        </div>
        
        <div className="bg-[#111111] border border-white/5 rounded-xl p-8 h-80 flex flex-col items-center justify-center border-dashed group hover:border-[#FFE600]/20 transition-all">
          <div className="p-4 bg-white/5 rounded-full mb-4 opacity-20 group-hover:opacity-100 transition-opacity">
             <TrendingUp size={32} className="text-[#FFE600]" />
          </div>
          <p className="text-gray-600 text-[10px] uppercase font-black tracking-[0.4em]">Order Velocity</p>
        </div>
      </div>
    </div>
  );
};

export default FinanceManager;
