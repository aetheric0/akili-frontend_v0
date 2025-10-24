import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface FeatureSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  reverse?: boolean;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  icon,
  title,
  description,
  reverse = false,
}) => {
  const ref = useRef(null);
  // Trigger animation when the section is 30% in view
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // More impactful "pop-in" animation
  const variants = {
    hidden: { opacity: 0, y: 75 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      ref={ref}
      // --- FIX 1: Use h-screen and scroll-snap-align ---
      className={`h-screen w-full flex items-center justify-center p-8 scroll-snap-align-start ${
        reverse ? 'bg-slate-900' : 'bg-slate-950'
      }`}
    >
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${
          reverse ? 'md:flex-row-reverse' : ''
        }`}
      >
        {/* Text Content */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 3.0, delay: 0.1, ease: [0.21, 1.02, 0.73, 1] }} // Fast-out, slow-in
          className={`text-center md:text-left ${
            reverse ? 'md:order-1' : ''
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            {title}
          </h2>
          {/* --- FIX 2: Improved font size and readability --- */}
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Animated Icon */}
        <motion.div
          variants={variants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          transition={{ duration: 3.0, delay: 0.3, ease: [0.21, 1.02, 0.73, 1] }}
          className={`w-full max-w-sm mx-auto ${
            reverse ? 'md:order-2' : ''
          }`}
        >
          {icon}
        </motion.div>
      </div>
    </motion.section>
  );
};

