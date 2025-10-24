import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // This is for the /app route
    navigate(path);
  };

  const handleScroll = (id: string) => {
    // This is for the on-page # links
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center p-3 bg-slate-100/5 backdrop-blur-sm border border-white/5 rounded-xl shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          <span className="text-xl font-bold text-white">Akili AI</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-slate-300 font-medium">
          <a
            onClick={() => handleScroll('features')}
            className="cursor-pointer hover:text-yellow-400 transition-colors"
          >
            Features
          </a>
          <a
            onClick={() => handleScroll('story')}
            className="cursor-pointer hover:text-yellow-400 transition-colors"
          >
            Project Story
          </a>
          <a
            onClick={() => handleScroll('support')}
            className="cursor-pointer hover:text-yellow-400 transition-colors"
          >
            Support
          </a>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => handleNavigation('/app')}
          className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
        >
          Start Chatting
        </button>
      </div>
    </motion.nav>
  );
};

