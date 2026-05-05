import { API_URL } from '../../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, Trash2, Edit2, Check, X, MapPin, Clock, DollarSign } from 'lucide-react';

const EventsManager = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    image: '',
    capacity: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events/all`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await axios.put(`${API_URL}/api/events/${editingEvent._id}`, formData);
      } else {
        await axios.post(`${API_URL}/api/events`, formData);
      }
      setIsModalOpen(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error('Error saving event:', err);
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
      image: event.image,
      capacity: event.capacity
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`${API_URL}/api/events/${id}`);
        fetchEvents();
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      price: '',
      image: '',
      capacity: 0
    });
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif text-white mb-2 tracking-tight">Events & Festivals</h1>
          <p className="text-gray-400 tracking-widest text-xs uppercase font-black">Manage royal cultural experiences</p>
        </div>
        <button 
          onClick={() => { setEditingEvent(null); resetForm(); setIsModalOpen(true); }}
          className="bg-[#FFE600] text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-white transition-all shadow-xl"
        >
          <Plus size={16} /> Add Festival
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event._id} className="bg-[#111111] border border-white/5 rounded-[40px] overflow-hidden group hover:border-white/10 transition-all shadow-2xl">
            <div className="relative aspect-video">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              <div className="absolute top-6 left-6">
                 <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">{new Date(event.date).toLocaleDateString()}</span>
                 </div>
              </div>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-serif text-white mb-4 uppercase tracking-tight">{event.title}</h3>
              <p className="text-gray-500 text-xs line-clamp-2 mb-6 font-medium leading-relaxed">{event.description}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <Clock size={14} className="text-[#FFE600]" /> {event.time}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <MapPin size={14} className="text-[#FFE600]" /> {event.location}
                </div>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <DollarSign size={14} className="text-[#FFE600]" /> {event.price}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={() => handleEdit(event)} className="flex-1 bg-white/5 text-white py-3 rounded-2xl hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-widest border border-white/5">
                  Edit
                </button>
                <button onClick={() => handleDelete(event._id)} className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-500/10">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-[#111111] border border-white/5 rounded-[50px] w-full max-w-2xl p-12 relative shadow-[0_50px_100px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h2 className="text-4xl font-serif text-white mb-10 tracking-tighter uppercase">{editingEvent ? 'Refine Festival' : 'New Royal Festival'}</h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-6">Event Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-full px-8 py-5 text-white uppercase text-xs font-black focus:border-[#FFE600] outline-none" placeholder="E.G. SITAR NIGHT" />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-6">Date</label>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-full px-8 py-5 text-white text-xs font-black focus:border-[#FFE600] outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-6">Time</label>
                  <input required type="text" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-full px-8 py-5 text-white text-xs font-black focus:border-[#FFE600] outline-none" placeholder="19:00 - 22:00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-6">Price Entry</label>
                  <input required type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-full px-8 py-5 text-white text-xs font-black focus:border-[#FFE600] outline-none" placeholder="FREE / $50" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-6">Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-full px-8 py-5 text-white text-xs font-black focus:border-[#FFE600] outline-none" placeholder="MAIN LOUNGE" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-6">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-[32px] px-8 py-6 text-white text-xs font-medium focus:border-[#FFE600] outline-none h-32 leading-relaxed" placeholder="Tell the story of this event..." />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] ml-6">Image URL</label>
                <input required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full bg-white/[0.03] border border-white/5 rounded-full px-8 py-5 text-white text-xs font-medium focus:border-[#FFE600] outline-none" placeholder="HTTPS://..." />
              </div>

              <button type="submit" className="w-full bg-[#FFE600] text-black font-black py-6 rounded-full uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all shadow-2xl mt-4">
                {editingEvent ? 'Seal Changes' : 'Announce Festival'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManager;
