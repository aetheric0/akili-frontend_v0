import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Clock, X } from 'lucide-react';
// import { useAppState } from '../../context/AuthContext';

const FOCUS_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes

const FocusTimer = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
    const [isActive, setIsActive] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    const intervalRef = useRef<number | null>(null);

    // const activeSessionId = useAppState(state => state.activeSessionId);
    // const updateXp = useAppState(state => state.updateXp);

    // This function will eventually call the backend
    const awardXp = () => {
        console.log('Awarding 30 XP for a completed focus session!');
        // TODO: Call POST /study/end endpoint here
    };

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        if (mode === 'focus') {
                            awardXp();
                            setMode('break');
                            return BREAK_DURATION;
                        } else {
                            setMode('focus');
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
    }, [isActive, mode]);

    const handleOrbClick = () => {
        setIsShaking(true);
        // After the shake animation (500ms), expand the modal
        setTimeout(() => {
            setIsShaking(false);
            setIsExpanded(true);
        }, 500);
    };

    const toggleTimer = () => {
        setIsActive(!isActive);
        if (!isActive) {
            // TODO: Call POST /study/start endpoint here
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        setMode('focus');
        setSecondsLeft(FOCUS_DURATION);
    };
    const handleClose = () => setIsExpanded(false);
    
    // --- The Orb (Collapsed State) ---
    if (!isExpanded) {
        return (
            <button
                onClick={handleOrbClick}
                // --- FIX: Changed 'fixed' to 'absolute' ---
                className={`absolute top-4 right-4 z-20 flex items-center justify-center w-12 h-12 bg-gray-800/50 backdrop-blur-sm rounded-full text-yellow-400 border border-white/10 hover:bg-gray-700 transition-all duration-300 animate-pulse hover:animate-none ${isShaking ? 'animate-shake' : ''}`}
                title="Start Focus Mode"
            >
                <Clock size={24} />
            </button>
        );
    }

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const totalDuration = mode === 'focus' ? FOCUS_DURATION : BREAK_DURATION;
    const progress = (secondsLeft / totalDuration) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    // --- The Modal (Expanded State) ---
    return (
        // --- FIX: Changed 'fixed' to 'absolute' ---
        <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={handleClose}></div>
            <div className="relative flex flex-col items-center gap-4 p-8 bg-gray-800/40 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl">
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-widest">Focus Mode</h3>
                
                {/* --- FIX: Restored the SVG display for the timer --- */}
                <div className="relative w-48 h-48 my-4">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="text-gray-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                        <circle 
                            className="text-yellow-400"
                            strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round" stroke="currentColor" fill="transparent" 
                            r="45" cx="50" cy="50" transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-5xl font-bold text-white" style={{textShadow: '0 0 10px rgba(250, 204, 21, 0.5)'}}>
                            {`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
                        </span>
                        <span className="text-xs uppercase text-gray-400">{mode}</span>
                    </div>
                </div>
                
                {/* --- FIX: Moved control buttons inside the modal --- */}
                <div className="flex gap-4">
                   <button onClick={toggleTimer} className="p-3 text-white bg-blue-600 rounded-full hover:bg-blue-500 shadow-lg">
                        {isActive ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button onClick={resetTimer} className="p-3 text-gray-300 bg-gray-700 rounded-full hover:bg-gray-600 shadow-lg">
                        <RefreshCw size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusTimer;