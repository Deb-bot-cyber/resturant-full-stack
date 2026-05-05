import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Search, X, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Tooltip from '../../components/Tooltip';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      toast.error('Failed to load events');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.time,
      location: event.location,
      price: event.price,
      image: event.image
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      const loadingToast = toast.loading('Deleting event...');
      try {
        await axios.delete(`${API_URL}/api/events/${id}`);
        fetchEvents();
        toast.success('Event deleted', { id: loadingToast });
      } catch (err) {
        toast.error('Failed to delete event', { id: loadingToast });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToast = toast.loading(editingEvent ? 'Updating event...' : 'Creating event...');
    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/api/events/${editingEvent._id}`, formData);
        toast.success('Event updated', { id: loadingToast });
      } else {
        await axios.post(`${API_URL}/api/events`, formData);
        toast.success('Event created', { id: loadingToast });
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', date: '', time: '', location: '', price: '', image: '' });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEvents = events.filter(ev => 
    ev.title.toLowerCase().includes(search.toLowerCase()) ||
    ev.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-medium text-white mb-1">Events & Festivals</h1>
          <p className="text-gray-500 text-sm">Schedule and manage your cultural celebrations.</p>
        </div>
        <Tooltip text="Schedule New Event">
          <button 
            onClick={() => { setEditingEvent(null); setFormData({ title: '', description: '', date: '', time: '', location: '', price: '', image: '' }); setIsModalOpen(true); }}
            className="bg-[#FFE600] text-black px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors text-sm shadow-lg shadow-[#FFE600]/10"
          >
            <Plus size={18} /> Add Event
          </button>
        </Tooltip>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#FFE600]"
          />
        </div>
      </div>

      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/40 text-gray-500 uppercase text-[11px] font-bold tracking-widest border-b border-white/5">
            <tr>
              <th className="px-8 py-5 w-24">Img</th>
              <th className="px-8 py-5">Title</th>
              <th className="px-8 py-5">Date & Time</th>
              <th className="px-8 py-5">Location</th>
              <th className="px-8 py-5 text-right">Price</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredEvents.map(ev => (
              <tr key={ev._id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <img src={ev.image} className="w-10 h-10 rounded-lg object-cover border border-white/5" />
                </td>
                <td className="px-8 py-5">
                  <span className="font-medium text-white">{ev.title}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-0.5">
                     <div className="flex items-center gap-2 text-gray-300">
                        <Calendar size={12} className="text-gray-500" />
                        <span>{new Date(ev.date).toLocaleDateString()}</span>
                     </div>
                     <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest ml-5">{ev.time}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin size={12} className="text-gray-600" />
                    <span>{ev.location}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-right font-bold text-[#FFE600]">{ev.price}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-1">
                    <Tooltip text="Edit Event">
                      <button onClick={() => handleEdit(ev)} className="text-gray-600 hover:text-[#FFE600] transition-colors p-2">
                        <Edit2 size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip text="Delete Event">
                      <button onClick={() => handleDelete(ev._id)} className="text-gray-600 hover:text-rose-500 transition-colors p-2">
                        <Trash2 size={16} />
                      </button>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEvents.length === 0 && (
          <div className="py-24 text-center text-gray-500 font-medium">No events found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 w-full max-w-xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <h3 className="text-xl font-medium text-white mb-6 uppercase tracking-tighter">
              {editingEvent ? 'Edit Event' : 'New Event'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Event Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#FFE600] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Time</label>
                  <input required type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Location</label>
                  <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Price ($)</label>
                  <input required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm h-24 outline-none focus:border-[#FFE600]" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Image URL</label>
                <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm outline-none focus:border-[#FFE600]" />
              </div>
              <button 
                disabled={isLoading}
                type="submit" 
                className="w-full bg-[#FFE600] text-black font-bold py-3.5 rounded-lg uppercase tracking-widest text-xs hover:bg-white transition-all mt-4 disabled:opacity-50"
              >
                {editingEvent ? 'Save Changes' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;
