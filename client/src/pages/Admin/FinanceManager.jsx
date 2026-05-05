import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, TrendingUp, CreditCard, Activity, ArrowUpRight, Download } from 'lucide-react';

const FinanceManager = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0,
    averageTicket: 0,
    orderCount: 0
  });

  useEffect(() => {
    fetchFinanceStats();
  }, []);

  const fetchFinanceStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`);
      const completedOrders = res.data.filter(o => o.status === 'completed');
      
      const total = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);
      const today = new Date().toISOString().split('T')[0];
      const daily = completedOrders
        .filter(o => o.createdAt.split('T')[0] === today)
        .reduce((acc, o) => acc + o.totalAmount, 0);

      setStats({
        totalRevenue: total,
        dailyRevenue: daily,
        orderCount: completedOrders.length,
        averageTicket: completedOrders.length > 0 ? total / completedOrders.length : 0
      });
    } catch (err) {
      console.error(err);
    }
  };

  const metrics = [
    { title: 'Gross Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%' },
    { title: 'Daily Earnings', value: `$${stats.dailyRevenue.toLocaleString()}`, icon: Activity, trend: '+4.2%' },
    { title: 'Avg. Order Value', value: `$${stats.averageTicket.toFixed(2)}`, icon: CreditCard, trend: '-2.1%' },
    { title: 'Total Transactions', value: stats.orderCount, icon: TrendingUp, trend: '+8.3%' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif text-white mb-2">Financial Insights</h1>
          <p className="text-gray-400 tracking-widest text-xs uppercase font-black">Revenue and growth analytics</p>
        </div>
        <button className="bg-white/5 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white hover:text-black transition-all flex items-center gap-2">
          <Download size={14} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 p-8 rounded-[32px] relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-4">{m.title}</p>
              <h3 className="text-3xl font-black text-white mb-4">{m.value}</h3>
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <span className={m.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{m.trend}</span>
                <span className="text-gray-600">vs last period</span>
              </div>
            </div>
            <div className="absolute top-8 right-8 text-[#FFE600] opacity-10 group-hover:opacity-100 transition-all">
              <m.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-[40px] p-10 h-96 flex flex-col justify-between">
           <div className="flex justify-between items-center mb-8">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.2em]">Revenue Velocity</h4>
              <select className="bg-transparent border border-white/10 text-gray-500 text-[10px] font-black rounded-lg px-3 py-1 outline-none">
                 <option>LAST 30 DAYS</option>
                 <option>LAST 7 DAYS</option>
              </select>
           </div>
           <div className="flex-1 flex items-center justify-center opacity-20 italic text-xs uppercase font-black tracking-widest">
              [ Revenue Graph Placeholder ]
           </div>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-[40px] p-10 h-96">
           <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Payment Methods</h4>
           <div className="space-y-6">
              {[
                { name: 'Credit Card', percent: 65, color: 'bg-blue-500' },
                { name: 'Cash', percent: 25, color: 'bg-emerald-500' },
                { name: 'Digital Wallet', percent: 10, color: 'bg-[#FFE600]' }
              ].map((p, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-400">{p.name}</span>
                      <span className="text-white">{p.percent}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${p.color}`} style={{ width: `${p.percent}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceManager;
