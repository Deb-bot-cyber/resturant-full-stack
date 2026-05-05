import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Trash2, Star, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Tooltip from '../../components/Tooltip';

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews`);
      setReviews(res.data);
    } catch (err) {
      toast.error('Failed to load reviews');
    }
  };

  const toggleApproval = async (id, status) => {
    const loadingToast = toast.loading(status ? 'Approving review...' : 'Unapproving review...');
    try {
      await axios.put(`${API_URL}/api/reviews/${id}`, { isApproved: status });
      fetchReviews();
      toast.success(status ? 'Review approved' : 'Review unapproved', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to update review status', { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      const loadingToast = toast.loading('Deleting review...');
      try {
        await axios.delete(`${API_URL}/api/reviews/${id}`);
        fetchReviews();
        toast.success('Review deleted', { id: loadingToast });
      } catch (err) {
        toast.error('Failed to delete review', { id: loadingToast });
      }
    }
  };

  const filteredReviews = reviews.filter(rev => 
    rev.author.toLowerCase().includes(search.toLowerCase()) ||
    rev.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-medium text-white mb-1">Patron Reviews</h1>
        <p className="text-gray-500 text-sm">Moderate and manage guest testimonials.</p>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600]"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/40 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5">Patron</th>
              <th className="px-8 py-5">Review</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredReviews.map(rev => (
              <tr key={rev._id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <img src={rev.image} className="w-8 h-8 rounded-full object-cover grayscale" />
                    <div>
                       <span className="font-medium text-white block leading-none mb-1">{rev.author}</span>
                       <span className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">{rev.role}</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={10} 
                        className={i < rev.rating ? "text-[#FFE600] fill-[#FFE600]" : "text-white/10"} 
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-400 italic line-clamp-2 max-w-sm">"{rev.content}"</p>
                </td>
                <td className="px-8 py-5 text-center">
                  <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${rev.isApproved ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {rev.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    <Tooltip text={rev.isApproved ? "Unapprove" : "Approve"}>
                      <button 
                        onClick={() => toggleApproval(rev._id, !rev.isApproved)}
                        className={`p-2 rounded-lg transition-colors ${rev.isApproved ? 'text-gray-600 hover:text-rose-500' : 'text-[#FFE600] hover:bg-[#FFE600]/10'}`}
                      >
                        {rev.isApproved ? <X size={16} /> : <Check size={16} />}
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete Review">
                      <button onClick={() => handleDelete(rev._id)} className="text-gray-600 hover:text-rose-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredReviews.length === 0 && (
          <div className="py-24 text-center text-gray-500 font-medium">No reviews found.</div>
        )}
      </div>
    </div>
  );
};

export default ReviewsManager;
