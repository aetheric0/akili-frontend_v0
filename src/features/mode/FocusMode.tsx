import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RefreshCw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../../context/AuthContext";
import { endStudySessionApi, startStudySessionApi } from "../../api/focusStudyApi";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const FocusTimer = () => {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState<'orb' | 'modal'>('orb');
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [isShaking, setIsShaking] = useState(false);

  const { activeSessionId, updateXp } = useAppState();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const intervalRef = useRef<number | null>(null);

  // --- API & LOGIC HANDLERS ---
  const awardXp = useCallback(async () => {
    if (!activeSessionId) return;
    try {
      const { new_xp } = await endStudySessionApi(activeSessionId);
      updateXp(new_xp);
      console.log(`Session ended. Awarded XP. New total: ${new_xp}`);
    } catch (err) {
      console.error("Failed to end study session:", err);
    }
  }, [activeSessionId, updateXp]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsActive(false); // Stop the timer
            if (mode === "focus") {
              awardXp();
              setMode("break");
              return BREAK_DURATION;
            } else {
              setMode("focus");
              return FOCUS_DURATION;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, mode, awardXp]);

  const handleOrbClick = () => {
    if (isShaking) return;
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      setView('modal');
    }, 500); // Duration of the shake animation
  };

  const handleCloseModal = () => setView('orb');

  const toggleTimer = async () => {
    if (!activeSessionId) return;
    if (!isActive) {
      try {
        await startStudySessionApi(activeSessionId);
        setIsActive(true);
      } catch (error) { console.error("Failed to start study session:", error); }
    } else {
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setSecondsLeft(FOCUS_DURATION);
  };

  // --- RENDER LOGIC ---
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalDuration = mode === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = (secondsLeft / totalDuration) * 100;
  const circumference = 2  * Math.PI * 55;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // --- CONDITIONAL ANIMATION VARIANTS ---
const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: isDesktop ? -50 : 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
  <div className={`fixed z-50 ${isDesktop ? 'top-5 right-5' : 'bottom-24 right-5'}`}>
      <AnimatePresence>
        {view === 'orb' && (
          <motion.button
            key="orb"
            onClick={handleOrbClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              rotate: isShaking ? [0, -10, 10, -10, 10, 0] : 0,
              backgroundColor: isShaking
                ? ["#1f2937", "#f97316", "#fde68a", "#1f2937"]
                : "#1f2937",
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            // --- FIX: Restored the correct classes for the orb button ---
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full border border-white/10 backdrop-blur-md text-yellow-400 font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-gray-700/70 ${isDesktop ? '' : 'w-14 h-14'}`}
          >
            {isDesktop ? (
              <>
                <span className="text-sm font-extrabold uppercase tracking-widest drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">Focus Mode</span>
                <Clock size={20} />
              </>
            ) : (
              <Clock size={24} />
            )}
          </motion.button>
        )}

        {view === 'modal' && (
          <motion.div
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: "easeOut" }}
            // --- FIX: Restored the correct classes for the modal container ---
            className={`absolute w-[360px] p-4 bg-gradient-to-br from-gray-900/50 to-gray-800/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-4 ${isDesktop ? 'top-0 right-0' : 'bottom-14 right-0'}`}
          >
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-sm uppercase tracking-wider font-bold">{mode} Time</span>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition">✕</button>
            </div>
            <div className="flex justify-between items-center">
              <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 120 120">
                      <circle className="text-gray-700/50" strokeWidth="8" stroke="currentColor" fill="transparent" r="55" cx="60" cy="60" />
                      <motion.circle
                          className="text-yellow-400"
                          strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round" stroke="currentColor" fill="transparent"
                          r="55" cx="60" cy="60" transform="rotate(-90 60 60)"
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset }}
                          transition={{ duration: 1, ease: "linear" }}
                      />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-mono text-white" style={{ textShadow: '0 0 8px rgba(250, 204, 21, 0.5)' }}>
                        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                      </span>
                  </div>
              </div>
              <div className="flex items-center gap-3">
                {/* --- THIS IS THE FIX --- */}
                <button onClick={toggleTimer} className="p-4 bg-blue-600 hover:bg-blue-500 rounded-full text-white shadow-lg">
                  {isActive ? <Pause size={24} /> : <Play size={24} />}
                </button>
                <button onClick={resetTimer} className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300 shadow-lg"><RefreshCw size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusTimer;