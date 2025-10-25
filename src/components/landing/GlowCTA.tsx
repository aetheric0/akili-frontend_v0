import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export const GlowCTA: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <motion.button
    whileHover={{ scale: 1.03, boxShadow: "0 10px 40px rgba(99,102,241,0.18)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="relative z-20 inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg text-slate-900 bg-gradient-to-r from-yellow-400 to-amber-300 shadow-2xl hover:from-yellow-300 hover:to-amber-200"
  >
    <Zap className="w-5 h-5" />
    Start Chatting — It's Free
  </motion.button>
);
