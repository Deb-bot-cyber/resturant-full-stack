import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import welcome1 from '../assets/welcome_1.png';
import welcome2 from '../assets/welcome_2.png';
import welcome3 from '../assets/welcome_3.png';

import { ScrollRevealText } from './ui/scroll-reveal-text';
import { AnimatedCounter } from './ui/animated-counter';

const WelcomeSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"] 
  });

  const leftRotate = useTransform(scrollYProgress, [0, 1], [-8, 0]);
  const leftX = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

  const rightRotate = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const rightX = useTransform(scrollYProgress, [0, 1], ["0%", "80%"]);

  return (
    <section ref={containerRef} className="bg-[#FFE600] py-32 px-6 font-sans overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        {/* Overlapping Images Gallery */}
        <div className="relative flex justify-center items-center mb-10 min-h-[200px] md:min-h-0">
          {/* Left Image */}
          <motion.div 
            style={{ rotate: leftRotate, x: leftX }}
            className="absolute left-[0%] md:left-[20%] z-10 w-[40%] md:w-[25%] aspect-video shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-white/10 origin-center"
          >
            <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" alt="Indian Dining" className="w-full h-full object-cover" />
          </motion.div>
          {/* Center Image */}
          <motion.div 
            className="z-20 w-[55%] md:w-[35%] aspect-video shadow-[0_30px_60px_rgba(0,0,0,0.4)] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-white/20 origin-center"
          >
            <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop" alt="Indian Interior" className="w-full h-full object-cover" />
          </motion.div>
          {/* Right Image */}
          <motion.div 
            style={{ rotate: rightRotate, x: rightX }}
            className="absolute right-[0%] md:right-[20%] z-10 w-[40%] md:w-[25%] aspect-video shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-white/10 origin-center"
          >
            <img src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2072&auto=format&fit=crop" alt="Indian Feast" className="w-full h-full object-cover" />
          </motion.div>
        </div>

        {/* Welcome Text */}
        <div className="text-center max-w-4xl mx-auto mb-20 px-4">
          <h2 className="text-4xl md:text-6xl font-serif font-black text-black uppercase tracking-tighter mb-8 leading-[0.9]">
             A Heritage of <span className="text-white">Royal Spices</span> & Timeless Tradition
          </h2>
          <p className="text-black/60 text-sm md:text-xl font-bold uppercase tracking-widest max-w-2xl mx-auto">
             Welcome to Saffron & Silk, where every dish tells a story from the ancient courts of India.
          </p>
        </div>

        {/* Divider */}
        <div className="w-full max-w-6xl mx-auto h-[1.5px] bg-black/10 mb-20"></div>

        {/* Stats */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center md:justify-between items-center gap-12 md:gap-8 text-black max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3 text-center md:text-left">
            <span className="text-4xl md:text-5xl font-[900] tracking-tighter"><AnimatedCounter to={10000} />+</span>
            <span className="text-sm md:text-xl font-bold md:font-semibold opacity-60 md:opacity-80 uppercase md:normal-case tracking-widest md:tracking-normal">Satisfied Customers</span>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3 text-center md:text-left">
            <span className="text-4xl md:text-5xl font-[900] tracking-tighter"><AnimatedCounter to={200} />+</span>
            <span className="text-sm md:text-xl font-bold md:font-semibold opacity-60 md:opacity-80 uppercase md:normal-case tracking-widest md:tracking-normal">Menu Selection</span>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-3 text-center md:text-left">
            <span className="text-4xl md:text-5xl font-[900] tracking-tighter"><AnimatedCounter to={95} />%</span>
            <span className="text-sm md:text-xl font-bold md:font-semibold opacity-60 md:opacity-80 uppercase md:normal-case tracking-widest md:tracking-normal">Positive Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;

