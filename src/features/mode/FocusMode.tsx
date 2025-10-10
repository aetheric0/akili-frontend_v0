import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RefreshCw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppState } from "../../context/AuthContext";
import { endStudySessionApi, startStudySessionApi } from "../../api/focusStudyApi";

const FOCUS_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const FocusTimer = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [isExploding, setIsExploding] = useState(false);

  const activeSessionId = useAppState((s) => s.activeSessionId);
  const updateXp = useAppState((s) => s.updateXp);
  const intervalRef = useRef<number | null>(null);

  const awardXp = useCallback(async () => {
    if (!activeSessionId) return;
    try {
      const { new_xp } = await endStudySessionApi(activeSessionId);
      updateXp(new_xp);
    } catch (err) {
      console.error("Failed to end study session:", err);
    }
  }, [activeSessionId, updateXp]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
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
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, mode, awardXp]);

  const toggleTimer = async () => {
    if (!activeSessionId) return;
    if (!isActive) {
      await startStudySessionApi(activeSessionId);
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode("focus");
    setSecondsLeft(FOCUS_DURATION);
  };

  const handleFocusClick = () => {
    if (isExploding) return;
    setIsExploding(true);
    setTimeout(() => {
      setIsExploding(false);
      setIsExpanded(true);
    }, 1200);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const total = mode === "focus" ? FOCUS_DURATION : BREAK_DURATION;
  const progress = (secondsLeft / total) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* --- Focus Mode Button --- */}
      {!isExpanded && (
        <motion.button
          onClick={handleFocusClick}
          animate={{
            scale: isExploding ? [1, 1.1, 1.4, 1] : 1,
            backgroundColor: isExploding
              ? ["#1e293b", "#f97316", "#fde68a", "#1e293b"]
              : "#1e293b",
            rotate: isExploding ? [0, -5, 5, -5, 5, 0] : 0,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/60 border border-white/10
                     backdrop-blur-md text-yellow-400 font-bold uppercase tracking-widest
                     shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-gray-700/70
                     skew-x-[-8deg] select-none"
        >
          <span className="text-lg font-extrabold drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
            Focus Mode
          </span>
          <Clock size={22} className="skew-x-[8deg]" />
        </motion.button>
      )}

      {/* --- Dropdown Timer Card --- */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-14 right-0 w-[360px] p-4
                       bg-gray-900/50 backdrop-blur-xl border border-white/10
                       rounded-2xl shadow-2xl flex flex-col gap-4"
          >
            <div className="flex justify-between items-center text-gray-300">
              <span className="text-sm uppercase tracking-wider">
                {mode === "focus" ? "Focus" : "Break"} Time
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="text-4xl font-mono text-yellow-400">
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-xs text-gray-400 uppercase">{mode}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTimer}
                  className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full text-white"
                >
                  {isActive ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button
                  onClick={resetTimer}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded-full text-gray-300"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>

            <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-400"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusTimer;
