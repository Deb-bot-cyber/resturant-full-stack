import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Trash2 } from 'lucide-react';

const UsersManager = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`${API_URL}/api/users/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/api/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">User Management</h1>
          <p className="text-gray-400 tracking-wide text-sm">Manage customers and admin accounts.</p>
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/50 text-gray-400 text-xs tracking-widest uppercase">
                <th className="px-6 py-4 font-normal">Name</th>
                <th className="px-6 py-4 font-normal">Email</th>
                <th className="px-6 py-4 font-normal">Role</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {users.map((user) => (
                <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#FFE600]/20 border border-[#FFE600]/50 flex items-center justify-center">
                      <User size={14} className="text-[#FFE600]" />
                    </div>
                    <span className="text-gray-200 font-medium">{user.name}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="bg-black border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FFE600]"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(user._id)} className="text-gray-400 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;
