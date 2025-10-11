import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Zap } from "lucide-react";
import type { ISourceOptions } from "@tsparticles/engine";

// The particles configuration remains the same
const particlesOptions: ISourceOptions = {
     background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    interactivity: {
        events: {
            onHover: { enable: true, mode: "grab" },
            resize: { enable: true }, // Corrected from 'resize: true'
        },
        modes: {
            grab: { distance: 140, links: { opacity: 1 } },
        },
    },
    particles: {
        color: { value: "#4a5568" },
        links: {
            color: "#4a5568",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
        },
        collisions: { enable: true },
        move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: false,
            speed: 0.5,
            straight: false,
        },
        number: {
            density: {
                enable: true,
            },
            value: 800,
        },
        opacity: { value: 0.2 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
};

// The new, improved text sequence for the animation
const SPLASH_TEXTS = [
    "Welcome to Akili",
    "Turn Notes into Knowledge",
    "Gamify 🎮 and Level Up Your Learning"
];

const TEXT_INTERVAL = 2000;  // 2 seconds

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("hasVisited"));
    const [splashTextIndex, setSplashTextIndex] = useState(0);
    const [init, setInit] = useState(false);

   useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    useEffect(() => {
        // If the splash screen shouldn't be shown, do nothing.
        if (!showSplash) return;

        // Set the session storage key as soon as the splash screen is active
        sessionStorage.setItem("hasVisited", "true");

        // Check if we are on the last text message
        if (splashTextIndex >= SPLASH_TEXTS.length - 1) {
            // If so, set a final timer to hide the splash screen
            const finalTimer = setTimeout(() => {
                setShowSplash(false);
            }, TEXT_INTERVAL);
            return () => clearTimeout(finalTimer);
        }

        // Otherwise, set a timer to advance to the next text message
        const nextTextTimer = setTimeout(() => {
            setSplashTextIndex((prevIndex) => prevIndex + 1);
        }, TEXT_INTERVAL);

        // Cleanup function to cancel the timer if the component unmounts
        return () => clearTimeout(nextTextTimer);

    }, [splashTextIndex, showSplash]); // This effect re-runs whenever the text index or splash visibility changes


    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
    };

    return (
        <div className="relative w-full h-full">
            {init && <Particles id="tsparticles" options={particlesOptions} className="absolute inset-0 z-0" />}
            
            <AnimatePresence>
                {showSplash && (
                    <motion.div
                        key="splash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Zap className="w-24 h-24 text-yellow-400" />
                        </motion.div>
                        
                        <div className="mt-4 text-3xl font-bold text-white text-center h-10">
                            <AnimatePresence mode="wait">
                                <motion.h1
                                    key={splashTextIndex}
                                    variants={textVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                >
                                    {SPLASH_TEXTS[splashTextIndex]}
                                </motion.h1>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default AppWrapper;