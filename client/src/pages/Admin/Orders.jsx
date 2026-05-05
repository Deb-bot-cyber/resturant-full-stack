import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter, Eye, CheckCircle, Clock, XCircle, X } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/orders/${id}`, { status });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({...selectedOrder, status});
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Order Vault</h1>
          <p className="text-gray-400 tracking-wide text-sm">Monitor and manage royal dining requests.</p>
        </div>
        
        <div className="flex bg-[#111111] p-1 rounded-full border border-white/5">
          {['all', 'pending', 'preparing', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-[#FFE600] text-black' : 'text-gray-500 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 text-gray-400 text-xs tracking-widest uppercase">
              <th className="px-6 py-4 font-normal">Order ID</th>
              <th className="px-6 py-4 font-normal">Customer</th>
              <th className="px-6 py-4 font-normal">Items</th>
              <th className="px-6 py-4 font-normal">Total</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4 text-[#FFE600] font-black tracking-tighter">#{order._id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-gray-200 font-medium">{order.customerName}</span>
                    <span className="text-gray-500 text-[10px]">{order.phone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400">{order.items.length} dishes</td>
                <td className="px-6 py-4 text-white font-black">${order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    order.status === 'preparing' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-[#111111] border border-white/5 rounded-[40px] w-full max-w-2xl p-10 relative shadow-2xl overflow-hidden">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-white/20 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-serif text-white mb-6 uppercase tracking-tight">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2">Customer Details</p>
                <div className="bg-white/5 p-4 rounded-2xl">
                   <p className="text-white font-bold">{selectedOrder.customerName}</p>
                   <p className="text-gray-400 text-xs">{selectedOrder.phone}</p>
                   <p className="text-gray-400 text-xs mt-2">{selectedOrder.address}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2">Status Control</p>
                <div className="flex flex-wrap gap-2">
                  {['pending', 'preparing', 'completed', 'cancelled'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => updateStatus(selectedOrder._id, s)}
                      className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${selectedOrder.status === s ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-4">Items Summary</p>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-8 pr-2 custom-scrollbar">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-[#FFE600] font-black text-xs">{item.quantity}x</span>
                    <span className="text-white text-sm font-bold uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm font-black">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-white/5">
               <span className="text-white font-serif text-xl uppercase">Total Amount</span>
               <span className="text-3xl font-black text-[#FFE600]">${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
