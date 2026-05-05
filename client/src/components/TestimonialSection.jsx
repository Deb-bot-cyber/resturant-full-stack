import { API_URL } from '../utils/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialSection = () => {
  const [reviews, setReviews] = useState([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews/approved`);
      if (res.data.length > 0) {
        setReviews(res.data);
      } else {
        setReviews([{
          author: 'Arjun Kapoor',
          role: 'Food Enthusiast',
          content: 'Saffron & Silk brings the true essence of Indian royalty to the plate. A masterpiece!',
          image: 'https://i.pravatar.cc/150?u=arjun'
        }]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        setActiveReviewIndex((prev) => (prev + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews]);

  const currentReview = reviews[activeReviewIndex] || reviews[0];

  return (
    <section className="bg-[#FFE600] py-24 md:py-32 relative font-sans overflow-hidden">
      <div className="container mx-auto px-6 text-center max-w-5xl">
        <div className="flex justify-center mb-12">
           <div className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">Patron Voice</div>
        </div>

        {/* Quote */}
        <div className="min-h-[220px] flex flex-col justify-center mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReviewIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl md:text-[56px] font-serif font-black text-black leading-[1.1] mb-10 max-w-4xl mx-auto italic tracking-tighter">
                “{currentReview?.content}”
              </h2>
              
              <p className="text-xl font-black text-black uppercase tracking-widest">
                {currentReview?.author} 
                <span className="text-black/30 font-bold ml-3 text-sm tracking-[0.2em]">
                   {currentReview?.role ? `(${currentReview.role})` : ''}
                </span>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Avatars Row */}
        <div className="flex items-center justify-center -space-x-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review._id || index}
              onMouseEnter={() => setActiveReviewIndex(index)}
              className={`relative cursor-pointer transition-all duration-500 ${
                activeReviewIndex === index ? 'scale-125 z-10' : 'opacity-40 grayscale hover:opacity-80 hover:grayscale-0'
              }`}
            >
              <div className={`w-16 h-16 md:w-24 md:h-24 rounded-[32px] border-4 overflow-hidden shadow-2xl transition-all duration-700 ${
                activeReviewIndex === index ? 'border-white rotate-0' : 'border-transparent rotate-6'
              }`}>
                <img 
                  src={review.image || `https://i.pravatar.cc/150?u=${index}`} 
                  alt={review.author}
                  className="w-full h-full object-cover"
                />
              </div>
              {activeReviewIndex === index && (
                <motion.div 
                  layoutId="activePointer"
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3 h-3 bg-black rounded-full"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
