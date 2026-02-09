import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShieldCheck, Ghost } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Day6Challenge = () => {
    const [yesSize, setYesSize] = useState(1);
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
    const [isAccepted, setIsAccepted] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const noButtonRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleNoHover = () => {
        // Standard "moving button" logic as fallback or secondary
        const newX = Math.random() * (window.innerWidth - 100);
        const newY = Math.random() * (window.innerHeight - 50);
        setNoPosition({ x: newX, y: newY });
        setYesSize(prev => prev + 0.2);
    };

    const handleYesClick = () => {
        setIsAccepted(true);
        confetti({
            particleCount: 300,
            spread: 120,
            origin: { y: 0.6 },
            colors: ['#ff0000', '#ffffff', '#ff69b4']
        });
        setTimeout(() => setShowFinalMessage(true), 1500);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            if (!noButtonRef.current || isAccepted) return;

            const rect = noButtonRef.current.getBoundingClientRect();
            const buttonCenterX = rect.left + rect.width / 2;
            const buttonCenterY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2)
            );

            // "Reverse Cursor Chase" - If mouse gets too close, we can't literally move the mouse,
            // but we can make the NO button teleport instantly or make a "Ghost" cursor that stays away.
            // Another way: The button itself is essentially unclickable because it moves away BEFORE the click.
            if (distance < 100) {
                handleNoHover();
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [isAccepted]);

    if (showFinalMessage) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center"
            >
                <Heart size={120} fill="#ff0000" className="text-red-600 animate-bounce mb-8" />
                <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">I KNEW IT! ❤️</h1>
                <p className="text-2xl text-pink-400 font-bold mb-8">
                    The ransomware has been deactivated. My heart is now permanently yours.
                </p>
                <div className="bg-green-900/20 border border-green-500 p-6 rounded-lg font-mono text-sm max-w-md">
                    <p className="text-green-500">DECRYPTION SUCCESSFUL</p>
                    <p className="text-gray-400 mt-2">
                        "You passed every test. You matched every memory. You grew every bloom. I love you more than words can encode."
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => <Heart key={i} size={16} fill="#00ff00" className="text-green-500" />)}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <AnimatePresence>
                {!isAccepted && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center z-10"
                    >
                        <div className="bg-red-900/20 border-4 border-red-600 p-12 rounded-3xl shadow-[0_0_50px_rgba(255,0,0,0.3)] text-center max-w-2xl bg-black/80 backdrop-blur-md">
                            <ShieldCheck size={64} className="text-red-500 mb-6 mx-auto animate-pulse" />
                            <h1 className="text-5xl font-black text-white mb-8 leading-tight tracking-tighter">
                                FINAL CLEARANCE REQUIRED: <br /> WILL YOU BE MY VALENTINE?
                            </h1>

                            <div className="flex items-center justify-center gap-12 mt-8 min-h-[100px]">
                                <button
                                    onClick={handleYesClick}
                                    style={{ transform: `scale(${yesSize})` }}
                                    className="px-12 py-6 bg-red-600 text-white font-black text-2xl rounded-xl hover:bg-red-500 transition-all shadow-xl hover:shadow-red-500/50 relative z-20"
                                >
                                    YES!
                                </button>

                                <motion.button
                                    ref={noButtonRef}
                                    onMouseEnter={handleNoHover}
                                    animate={{ x: noPosition.x, y: noPosition.y }}
                                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                                    className="px-10 py-5 bg-gray-800 text-gray-500 font-bold text-xl rounded-xl border border-gray-600 fixed z-30"
                                >
                                    No
                                </motion.button>
                            </div>
                        </div>

                        <div className="mt-12 text-gray-600 font-mono text-xs flex items-center gap-2">
                            <Ghost size={14} />
                            <span>STABILITY CRITICAL // NO REJECTION PERMITTED BY KERNEL</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-red-900/10"
                        initial={{ y: -100, x: Math.random() * window.innerWidth }}
                        animate={{ y: window.innerHeight + 100 }}
                        transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, ease: 'linear' }}
                    >
                        <Heart size={Math.random() * 40 + 20} fill="currentColor" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Day6Challenge;
