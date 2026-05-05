import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Search, User, Shield, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Tooltip from '../../components/Tooltip';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      toast.error('Failed to load users');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const loadingToast = toast.loading('Deleting user...');
      try {
        await axios.delete(`${API_URL}/api/users/${id}`);
        fetchUsers();
        toast.success('User deleted successfully', { id: loadingToast });
      } catch (err) {
        toast.error('Failed to delete user', { id: loadingToast });
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-medium text-white mb-1">User Directory</h1>
        <p className="text-gray-500 text-sm">Manage staff and administrator access levels.</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600]"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/40 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Identiy</th>
              <th className="px-8 py-5">Contact</th>
              <th className="px-8 py-5 text-center">Privileges</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-[#FFE600] transition-colors">
                      <User size={18} />
                    </div>
                    <span className="font-medium text-white">{user.username}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail size={12} className="text-gray-600" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-[#FFE600]/10 text-[#FFE600]' : 'bg-white/5 text-gray-500'}`}>
                    <Shield size={10} />
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end">
                    <Tooltip text="Revoke Access">
                      <button onClick={() => handleDelete(user._id)} className="text-gray-600 hover:text-rose-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-24 text-center text-gray-500 font-medium">No users found.</div>
        )}
      </div>
    </div>
  );
};

export default UsersManager;
