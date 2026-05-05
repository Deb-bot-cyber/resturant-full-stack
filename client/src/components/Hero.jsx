import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import pastaHero from '../assets/pasta_hero.png';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const filter = useTransform(scrollYProgress, [0, 1], ['blur(0px)', 'blur(15px)']);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black font-sans">
      {/* Background Image Container for Scroll Effect */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ scale, opacity, filter }}
      >
        <img 
          src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2072&auto=format&fit=crop" 
          alt="Royal Indian Cuisine" 
          className="w-full h-full object-cover"
        />
        {/* Subtle Dark Overlay to match image depth */}
        <div className="absolute inset-0 bg-black/40"></div>
      </motion.div>

      {/* Main Title */}
      <motion.div 
        className="relative z-10 text-center select-none px-4"
        style={{ y: textY, opacity: textOpacity }}
      >
        <h1 className="text-[18vw] md:text-[14vw] leading-[0.8] font-serif font-black text-[#FFE600] uppercase tracking-tighter filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
          SAFFRON<br />& SILK
        </h1>
      </motion.div>

      {/* Bottom Content Wrapper for Mobile */}
      <div className="absolute bottom-8 md:bottom-12 left-0 right-0 px-6 md:px-12 z-20 flex flex-col md:flex-row justify-between items-end md:items-end gap-8">
        {/* Left: Hours */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          {/* Box 1 */}
          <div className="flex w-full md:w-[260px] h-[40px] border border-white/20 md:border-white rounded-full overflow-hidden backdrop-blur-md md:backdrop-blur-none">
            <div className="bg-white text-black px-4 flex items-center flex-1 font-black text-[10px] md:text-xs uppercase tracking-wider">
              Mon - Thu
            </div>
            <div className="bg-transparent text-white px-4 flex items-center justify-end flex-1 font-medium text-[10px] md:text-xs tracking-wider">
              11.00-23.00
            </div>
          </div>
          
          {/* Box 2 */}
          <div className="flex w-full md:w-[260px] h-[40px] border border-white/20 md:border-white rounded-full overflow-hidden backdrop-blur-md md:backdrop-blur-none">
            <div className="bg-[#FFE600] text-black px-4 flex items-center flex-1 font-black text-[10px] md:text-xs uppercase tracking-wider">
              Fri - Sun
            </div>
            <div className="bg-transparent text-white px-4 flex items-center justify-end flex-1 font-medium text-[10px] md:text-xs tracking-wider">
              11.00-00.00
            </div>
          </div>
        </div>

        {/* Right: Description */}
        <motion.div 
          className="max-w-[320px] text-right md:text-right hidden sm:block"
          style={{ opacity: textOpacity }}
        >
          <p className="text-white text-[10px] md:text-xs font-bold leading-relaxed opacity-90 tracking-[0.1em] uppercase">
            A royal voyage through the ancient spice routes. Experience the heritage of India's finest kitchens.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

