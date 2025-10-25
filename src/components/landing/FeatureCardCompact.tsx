import { motion } from "framer-motion";

export const FeatureCardCompact: React.FC<{
  Icon: React.ComponentType<any>;
  title: string;
  description: string;
}> = ({ Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-white/6 backdrop-blur-md border border-white/6 p-6 rounded-2xl shadow-lg max-w-sm hover:shadow-2xl transition"
  >
    <div className="flex items-center gap-4 mb-3">
      <div className="p-2 rounded-lg bg-gradient-to-br from-white/5 to-white/3">
        <Icon className="w-6 h-6 text-yellow-400" />
      </div>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
    </div>
    <p className="text-sm text-slate-300">{description}</p>
  </motion.div>
);
