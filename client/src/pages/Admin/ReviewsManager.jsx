import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Trash2 } from 'lucide-react';

const ReviewsManager = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, isApproved) => {
    try {
      await axios.put(`${API_URL}/api/reviews/${id}`, { isApproved });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`${API_URL}/api/reviews/${id}`);
        fetchReviews();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-white mb-2">Review Management</h1>
        <p className="text-gray-400 tracking-wide text-sm">Approve or reject customer reviews.</p>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/50 text-gray-400 text-xs tracking-widest uppercase">
              <th className="px-6 py-4 font-normal">Author</th>
              <th className="px-6 py-4 font-normal">Content</th>
              <th className="px-6 py-4 font-normal">Status</th>
              <th className="px-6 py-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {reviews.map((review) => (
              <tr key={review._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={review.image} alt={review.author} className="w-8 h-8 rounded-full" />
                    <span className="text-gray-200 font-medium">{review.author}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-400 max-w-md">
                  <p className="truncate italic">"{review.content}"</p>
                </td>
                <td className="px-6 py-4">
                  {review.isApproved ? (
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Approved</span>
                  ) : (
                    <span className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {!review.isApproved && (
                      <button onClick={() => handleStatusChange(review._id, true)} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors">
                        <Check size={16} />
                      </button>
                    )}
                    {review.isApproved && (
                      <button onClick={() => handleStatusChange(review._id, false)} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors">
                        <X size={16} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(review._id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500 text-sm">
                  No reviews found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsManager;
