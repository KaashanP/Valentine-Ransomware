import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';

const FloatingHeart = ({ delay }) => (
    <motion.div
        initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0, scale: 0.5 }}
        animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8],
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`]
        }}
        transition={{
            duration: 5 + Math.random() * 5,
            delay: delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className="fixed pointer-events-none text-red-500/60 z-[60]"
    >
        <Heart fill="currentColor" size={24 + Math.random() * 40} />
    </motion.div>
);

const CelebrationOverlay = ({ onFinalComplete }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video play failed:", error);
            });
        }
    }, []);

    const hearts = Array.from({ length: 25 });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden p-4 md:p-8"
        >
            {/* Centered Video Container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <video
                    ref={videoRef}
                    className="max-w-[90%] max-h-[80%] w-auto h-auto object-contain opacity-70 border-2 border-red-500/30 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                    src="/assets/celebration.mov"
                    loop
                    muted
                    playsInline
                />
            </div>

            {/* Scanlines Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />

            {/* Floating Hearts */}
            {hearts.map((_, i) => (
                <FloatingHeart key={i} delay={i * 0.4} />
            ))}

            {/* Celebration Content */}
            <div className="relative z-20 flex flex-col items-center max-w-2xl px-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 100, delay: 0.5 }}
                    className="mb-8 p-4 bg-red-500/20 border-2 border-red-500 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.5)]"
                >
                    <Heart className="text-red-500 animate-pulse" size={64} fill="currentColor" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-4xl md:text-6xl font-black text-red-500 uppercase tracking-tighter mb-4 terminal-glow"
                    style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.8)' }}
                >
                    SYSTEM BREACH
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-xl md:text-2xl font-mono text-white mb-8 leading-relaxed"
                >
                    CRITICAL WARNING: Unconditional love detected in the core.
                    Encryption bypassed. Security protocols irrelevant.
                    <br />
                    <span className="text-red-400 mt-4 block italic">"You are my absolute favorite memory."</span>
                </motion.p>

                <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    onClick={onFinalComplete}
                    className="group relative px-8 py-4 bg-red-600 text-white font-black rounded-lg hover:bg-red-500 transition-all uppercase tracking-widest overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Proceed to Protocol 3
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                    />
                </motion.button>
            </div>

            <style jsx>{`
                .terminal-glow {
                    filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5));
                }
            `}</style>
        </motion.div>
    );
};

export default CelebrationOverlay;
