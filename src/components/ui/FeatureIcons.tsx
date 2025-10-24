import { motion } from 'framer-motion';
import { FileText, MessageSquare, BrainCircuit, Star, BarChart } from 'lucide-react';

// --- Icon 1: Dual Mode ---
export const DualModeIcon = () => (
  <motion.div className="relative w-full h-48" initial="initial" whileHover="hover">
    {/* Document */}
    <motion.div
      className="absolute top-1/2 left-1/4 w-24 h-32 bg-slate-700 rounded-lg shadow-lg"
      variants={{
        initial: { rotate: -10, scale: 0.9 },
        hover: { rotate: -385, scale: 1.5, x: -10, },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <FileText className="w-28 h-28 text-amber-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
    {/* Chat Bubble */}
    <motion.div
      className="absolute top-1/2 left-1/2 w-24 h-20 bg-blue-600 rounded-xl shadow-lg"
      variants={{
        initial: { rotate: 5, scale: 0.9 },
        hover: { rotate: 380, scale: 1.5, x: 10 },
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <MessageSquare className="w-28 h-28 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </motion.div>
  </motion.div>
);

// --- Icon 2: Gamified Learning ---
export const GamifiedIcon = () => (
  <div className="relative w-full h-48 flex items-center justify-center">
    <motion.div
      className="p-4 bg-yellow-400 rounded-full shadow-lg"
      animate={{ scale: [1, 1.3, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Star className="w-32 h-32 text-white" fill="white" />
    </motion.div>
    <motion.div
      className="w-12 h-12 text-center absolute p-3 bg-blue-600 rounded-full shadow-md"
      style={{ top: -55, left: '15%' }}
      animate={{ y: [0, 10, 0]}}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
    >
      <span className="text-white font-bold text-sm">XP</span>
    </motion.div>
    <motion.div
      className="absolute p-3 bg-green-500 rounded-full shadow-md"
      style={{ bottom: -55, right: '15%' }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    >
      <BarChart className="w-6 h-6 text-white" />
    </motion.div>
  </div>
);

// --- Icon 3: Exam Analyzer (Your Vision) ---
export const AnalyzerIcon = () => {
  return (
    <div className="relative w-full h-48 flex items-center justify-center">
      {/* 1. The Document */}
      <motion.div
        className="absolute left-0"
        animate={{ x: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FileText className="w-20 h-20 text-slate-600" />
      </motion.div>

      {/* 2. The Neural Net (BrainCircuit) */}
      <motion.div
        className="text-blue-500"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BrainCircuit size={80} strokeWidth={1.5} />
      </motion.div>

      {/* 3. The Output (Result) */}
      <motion.div
        className="absolute right-0"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <Star className="w-20 h-20 text-yellow-400" fill="#facc15" />
      </motion.div>

      {/* Data particle 1 */}
      <motion.div
        className="absolute left-16 top-1/2 w-3 h-3 bg-yellow-300 rounded-full"
        animate={{
          x: [0, 60],
          y: [0, -20],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.2,
        }}
      />
      {/* Data particle 2 */}
      <motion.div
        className="absolute left-16 top-1/2 w-2 h-2 bg-blue-300 rounded-full"
        animate={{
          x: [0, 60],
          y: [0, 20],
          opacity: [0, 1, 1, 0],
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.7,
        }}
      />
    </div>
  );
};

