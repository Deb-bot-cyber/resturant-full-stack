import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Tooltip from '../../components/Tooltip';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/orders`);
      setOrders(res.data);
    } catch (err) {
      toast.error('Failed to load orders');
    }
  };

  const updateStatus = async (id, status) => {
    const loadingToast = toast.loading(`Updating status to ${status}...`);
    try {
      await axios.put(`${API_URL}/api/orders/${id}`, { status });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({...selectedOrder, status});
      }
      toast.success('Order status updated', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to update status', { id: loadingToast });
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = 
      o.customerName.toLowerCase().includes(search.toLowerCase()) || 
      o._id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-medium text-white mb-1">Order Vault</h1>
          <p className="text-gray-500 text-sm">Monitor and manage royal dining requests.</p>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          {['all', 'pending', 'preparing', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${filter === f ? 'bg-[#FFE600] text-black shadow-lg shadow-[#FFE600]/10' : 'text-gray-500 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600]"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/40 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Order ID</th>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Total</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-5 text-[#FFE600] font-bold tracking-tighter">#{order._id.slice(-6).toUpperCase()}</td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{order.customerName}</span>
                    <span className="text-gray-600 text-[10px]">{order.phone}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-white font-bold">${order.totalAmount.toFixed(2)}</td>
                <td className="px-8 py-5 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' :
                    order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    order.status === 'preparing' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-rose-500/10 text-rose-500'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end">
                    <Tooltip text="View Details">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-600 hover:text-white transition-colors">
                        <Eye size={18} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="py-24 text-center text-gray-500 font-medium">No orders found.</div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-2xl p-10 relative shadow-2xl overflow-hidden">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24} /></button>
            <h2 className="text-2xl font-medium text-white mb-8 uppercase tracking-tight">Order #{selectedOrder._id.slice(-6).toUpperCase()}</h2>
            
            <div className="grid grid-cols-2 gap-10 mb-10">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3">Customer Details</p>
                <div className="bg-white/5 p-5 rounded-xl space-y-1">
                   <p className="text-white font-bold">{selectedOrder.customerName}</p>
                   <p className="text-gray-400 text-xs">{selectedOrder.phone}</p>
                   <p className="text-gray-500 text-xs mt-3 border-t border-white/5 pt-3 leading-relaxed">{selectedOrder.address}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-3">Status Management</p>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'preparing', 'completed', 'cancelled'].map(s => (
                    <button 
                      key={s} 
                      onClick={() => updateStatus(selectedOrder._id, s)}
                      className={`px-3 py-2.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border transition-all ${selectedOrder.status === s ? 'bg-white text-black border-white shadow-lg shadow-white/5' : 'border-white/5 text-gray-500 hover:border-white/20 hover:text-white'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mb-4">Items Summary</p>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-10 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <span className="text-[#FFE600] font-bold text-xs">{item.quantity}x</span>
                    <span className="text-white text-sm font-medium uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-gray-400 text-xs font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
               <span className="text-gray-500 text-sm font-bold uppercase tracking-widest">Total Bill</span>
               <span className="text-3xl font-bold text-[#FFE600]">${selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
