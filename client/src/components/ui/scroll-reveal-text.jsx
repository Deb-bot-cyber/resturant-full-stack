import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Char = ({ children, progress, range, className }) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span className="relative">
      <span className={`absolute opacity-20 ${className}`}>{children}</span>
      <motion.span style={{ opacity }} className={className}>{children}</motion.span>
    </span>
  );
};

export const ScrollRevealText = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.8", "start 0.2"], 
  });

  const text1 = "Welcome to Resto Kayang, your destination for authentic Indonesian cuisine. Enjoy a culinary journey with dishes like savory rendang and delightful nasi goreng. Join us for a memorable dining experience where tradition meets taste";

  const totalChars = text1.replace(/\s/g, "").length;
  let charIndex = 0;

  const renderText = (text, className) => {
    const words = text.split(" ");
    return words.map((word, wordIdx) => {
      if (word === "") return null;
      return (
        <span key={wordIdx} className="inline-block mr-[0.25em] whitespace-nowrap">
          {word.split("").map((char) => {
            const start = charIndex / totalChars;
            const end = start + (1 / totalChars);
            charIndex++;
            return (
              <Char key={charIndex} range={[start, end]} progress={scrollYProgress} className={className}>
                {char}
              </Char>
            );
          })}
        </span>
      );
    });
  };

  return (
    <div ref={targetRef} className="text-3xl md:text-[42px] leading-[1.2] tracking-tight text-center">
      {renderText(text1, "text-black font-[900]")}
    </div>
  );
};

