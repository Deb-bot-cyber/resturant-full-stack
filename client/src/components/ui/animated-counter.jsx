import React, { useEffect, useRef } from "react";
import { animate, useInView, useMotionValue } from "framer-motion";

export const AnimatedCounter = ({ from = 0, to, duration = 2 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(from);

  useEffect(() => {
    if (inView) {
      const controls = animate(motionValue, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => {
          if (ref.current) {
            ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(value));
          }
        },
      });
      return controls.stop;
    }
  }, [inView, to, duration, motionValue]);

  return <span ref={ref}>{from}</span>;
};

