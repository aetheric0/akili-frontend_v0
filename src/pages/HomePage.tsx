import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NET from 'vanta/dist/vanta.net.min.js';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Navbar } from '../components/ui/Navbar';

// --- Import the new, separate components ---
import { FeatureSection } from '../components/landing/FeatureSection';
import { DualModeIcon, GamifiedIcon, AnalyzerIcon } from '../components/landing/FeatureIcons';

// --- Home Page Component ---
const HomePage: React.FC = () => {
  const vantaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let vantaEffect: any = null;
    if (vantaRef.current) {
      vantaEffect = NET({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyrocontrols: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x334155, // Dark slate-blue for better contrast
        backgroundColor: 0x020617,
        points: 12.00,
        maxDistance: 20.00,
        spacing: 15.00
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  const handleStartChatting = () => {
    navigate('/app'); // Navigate to your main app page
  };

  return (
    <div className="text-white bg-stone-200 font-sans scroll-snap-type-y-mandatory h-screen w-screen">
        {/* --- Section 0: Floating Navbar --- */}
        <Navbar />

      {/* --- Section 1: The Hero --- */}
      <div ref={vantaRef} className="h-screen w-full relative">
        <div className="absolute inset-0 z-10 bg-black/70 md:bg-black/50"></div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-blue-200 mb-10 font-display">
            Stop Reading. <span className="text-yellow-400">Start Learning.</span>
          </h1>
          <p className="text-xl font-bold md:text-3xl text-white max-w-3xl mb-8 bg-blue-200/5 rounded-lg py-2">
            Akili is an AI study companion that turns your dense documents, notes, and exam papers into summaries, quizzes, and insights—in seconds.
          </p>

          {/* --- THE ANIMATED BORDER BUTTON FIX --- */}
          <motion.button
            onClick={handleStartChatting}
            // 1. The parent button is now TRANSPARENT.
            className="relative w-full max-w-xs px-10 py-4 text-stone-900 font-bold text-lg rounded-full shadow-2xl overflow-hidden bg-slate-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {/* 2. This is the animated gradient. It's slower (duration 8s). */}
            <motion.div
              className="absolute -inset-full w-auto h-auto"
              style={{
                backgroundImage: `conic-gradient(
                  from 0deg,
                  #facc15, 
                  #3b82f6, 
                  #ec4899,
                  #facc15 
                )`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 12, // <-- FIX 1: Slower animation (8 seconds)
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* 3. This "mask" now has the visible background color.
                   It is inset by 3px, making the border thicker.
            */}
            <div className="absolute inset-[4px] bg-white backdrop-blur-xl shadow-2xl rounded-full transition-colors duration-300 group-hover:bg-gray-400"></div>
            
            {/* 4. The text sits on top of the mask. */}
            <span className="relative z-10 font-bold text-xl text-stone-500 tracking-wider font-display group-hover:text-white">
              Start Chatting Now (Free)
            </span>
          </motion.button>
          
        </div>
      </div>  {/* --- Section 2: "Dual Modes" --- */}
      <div id="features" className="relative z-30">
        <FeatureSection
          icon={<DualModeIcon />}
          title="Dual-Mode Intelligence"
          description="Seamlessly switch between a general 'Chat Mode' for brainstorming and a powerful 'Study Mode' to have deep, contextual conversations with your uploaded documents."
        />
        <FeatureSection
          icon={<GamifiedIcon />}
          title="Gamified Learning"
          description="Turn studying into a game. In 'Study Mode,' use the built-in Focus Timer to earn XP and Coins for every 25-minute session you complete. Level up your profile and make progress tangible."
          reverse={true}
        />
        <FeatureSection
          icon={<AnalyzerIcon />}
          title="Predictive Exam Analyzer"
          description="Upload multiple past exams (PDFs or images), and Akili's AI will analyze the patterns to predict the most likely questions, identify key topics, and generate a new practice exam for you."
        />
      </div>
       {/* Founder's Story */}
        <section className="py-20 px-6 md:px-12 bg-gray-800">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 items-center">
            <div className="col-span-1">
              <img src="https://i.postimg.cc/5tsFgKSG/hoodiecopy.jpg" alt="Founder" className="rounded-full w-56 h-56 object-cover border-4 border-white/6" />
            </div>
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-3">The Founder’s Story</h3>
              <p className="text-slate-300 leading-relaxed">
              "I'm a 300-level Computer Science student at TEAU. I built Akili during a high-pressure sprint to solve a problem my friends and I face every day: drowning in lecture notes and PDFs. 
              <br/><br/>
              I couldn't find a tool that was smart, fast, and built for how we *actually* study, so I built it myself. This is the tool I wish I had, and I'm excited to share it with you."
            </p>
            <a href="[Your LinkedIn URL]" target="_blank" className="text-yellow-400 font-semibold mt-4 inline-block">
              Follow my journey on LinkedIn &rarr;
            </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 md:px-12 border-t border-white/6 bg-gray-800">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-400">
            <div>© {new Date().getFullYear()} Akili — Built with ❤️</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Support</a>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default HomePage;
