import { API_URL } from '../utils/api';
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const EventsSection = () => {
  const scrollRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events`);
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const handleBooking = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    
    setBookingStatus('Requesting your place...');
    setTimeout(() => {
      setBookingStatus('Confirmed! You are on the guest list.');
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingStatus('');
        setSelectedEvent(null);
      }, 3000);
    }, 2000);
  };

  return (
    <section id="events" className="bg-[#FFE600] py-24 md:py-32 relative overflow-hidden font-sans z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-[72px] font-serif font-black text-black leading-[0.9] mb-6 tracking-tighter uppercase">
              Saffron<br />Festivals
            </h2>
            <p className="text-black/70 text-sm md:text-base max-w-md font-black uppercase tracking-[0.2em] leading-relaxed">
              Experience the vibrant spirit of India through our curated cultural nights, live music, and festive banquets.
            </p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={scrollLeft}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={scrollRight}
              className="w-16 h-16 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {events.map((event) => (
            <div 
              key={event._id} 
              className="min-w-[85vw] md:min-w-[480px] w-[85vw] md:w-[480px] snap-start flex flex-col gap-10 group"
            >
              <div className="relative w-full aspect-[16/11] rounded-[60px] overflow-hidden shadow-2xl bg-black/5">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-8 left-8">
                  <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-2 shadow-xl">
                    <Calendar size={14} className="text-black" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black">
                       {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="absolute bottom-8 right-8">
                   <div className="bg-[#FFE600] text-black px-6 py-2.5 rounded-full font-black text-xs shadow-2xl uppercase tracking-widest">
                      {event.price}
                   </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-6 px-4">
                <div>
                  <h3 className="text-3xl md:text-4xl font-serif font-black text-black leading-tight mb-4 tracking-tighter uppercase group-hover:text-black/60 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-black/60 text-sm md:text-base font-bold uppercase tracking-wide leading-relaxed line-clamp-2">
                    {event.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                   <div className="flex items-center gap-2">
                     <Clock size={16} />
                     <span>{event.time}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <MapPin size={16} />
                     <span>{event.location}</span>
                   </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsBookingModalOpen(true);
                  }}
                  className="w-fit bg-black text-white px-10 py-5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all shadow-2xl active:scale-95"
                >
                  Reserve Access
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-[#111111] border border-white/5 rounded-[60px] w-full max-w-lg p-12 relative shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-10 right-10 text-white/20 hover:text-white transition-colors">
                <X size={28} />
              </button>

              <div className="text-center mb-10">
                 <div className="w-24 h-24 rounded-[32px] bg-[#FFE600]/10 flex items-center justify-center mx-auto mb-8">
                    <Calendar size={48} className="text-[#FFE600]" />
                 </div>
                 <h2 className="text-4xl font-serif font-black text-white tracking-tighter uppercase mb-4">Secure Your Spot</h2>
                 <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{selectedEvent?.title}</p>
              </div>

              {bookingStatus ? (
                <div className="py-16 text-center">
                   <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-[#FFE600] rounded-full flex items-center justify-center mx-auto mb-8 text-black"
                  >
                    <CheckCircle size={40} strokeWidth={3} />
                  </motion.div>
                  <p className="text-[#FFE600] font-black text-2xl mb-3 uppercase tracking-tighter">Reserved!</p>
                  <p className="text-white/40 text-sm font-bold uppercase tracking-widest">{bookingStatus}</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-8 space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Date</span>
                        <span className="text-sm font-black text-white uppercase tracking-tight">{new Date(selectedEvent?.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                     </div>
                     <div className="flex justify-between items-center text-white">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Time</span>
                        <span className="text-sm font-black uppercase tracking-tight">{selectedEvent?.time}</span>
                     </div>
                     <div className="flex justify-between items-center text-white">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Entry Fee</span>
                        <span className="text-[#FFE600] font-black text-xl tracking-tighter">{selectedEvent?.price}</span>
                     </div>
                  </div>

                  <button 
                    onClick={handleBooking}
                    className="w-full bg-[#FFE600] text-black font-black py-7 rounded-full uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all shadow-2xl active:scale-95"
                  >
                    Confirm Attendance
                  </button>
                  <p className="text-center text-white/10 text-[9px] uppercase font-black tracking-[0.3em] leading-relaxed">
                    Royal attendance is strictly by reservation.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsSection;
