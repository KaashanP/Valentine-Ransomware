import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Volume2, VolumeX, Play } from 'lucide-react';

const CelebrationOverlayDay3 = ({ onProceed }) => {
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteraction, setHasInteraction] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const videoRef = useRef(null);

    // Force autoplay attempt on mount
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {
                console.log("Autoplay blocked - waiting for interaction");
            });
        }
    }, []);

    const handleStart = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play();
            setIsMuted(false);
            setHasInteraction(true);
        }
    };

    const toggleMute = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-[#FAF9F6] flex flex-col items-center justify-center overflow-hidden p-4 md:p-8"
        >
            {/* Ambient Pastel Background */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 -left-20 w-[800px] h-[800px] bg-amber-100 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 -right-20 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[150px]" />
            </div>

            {/* Premium Pastel Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 100 }}
                className="relative z-10 w-full max-w-2xl bg-white border border-stone-100 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08)] flex flex-col items-center text-center backdrop-blur-3xl"
            >
                <div className="mb-6 relative">
                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="p-2"
                    >
                        <img src="/assets/heart_glossy.png" alt="Glossy Heart" className="w-16 h-16 md:w-24 md:h-24 drop-shadow-[0_10px_30px_rgba(248,113,113,0.3)] object-contain" />
                    </motion.div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-2 -right-2 bg-stone-800 p-2 rounded-full border-4 border-white shadow-lg"
                    >
                        <ShieldCheck className="text-white w-4 h-4" />
                    </motion.div>
                </div>

                <div className="space-y-2 mb-8">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em]">Protocol 03: Finalized</p>
                    <h1 className="text-3xl md:text-5xl font-serif italic text-stone-800 tracking-tight leading-tight">
                        Neural Terrarium <br />
                        <span className="font-sans font-light opacity-60 not-italic">is fully stabilized.</span>
                    </h1>
                </div>

                {/* Reward Video - STRICT FORCED PORTRAIT RATIO */}
                <div className="mb-10 w-full max-w-[280px] md:max-w-[320px] aspect-[9/16] bg-black rounded-[2rem] relative overflow-hidden shadow-2xl border-4 border-stone-50 mx-auto group">
                    {!videoLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                            <div className="w-8 h-8 border-4 border-stone-400 border-t-white rounded-full animate-spin" />
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className={`w-full h-full object-contain transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                        src="/assets/reward_day3.mp4"
                        autoPlay
                        loop
                        playsInline
                        muted={isMuted}
                        onLoadedData={() => setVideoLoaded(true)}
                    />

                    <AnimatePresence>
                        {(!hasInteraction && videoLoaded) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleStart}
                                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center cursor-pointer group-hover:bg-black/20 transition-colors"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="p-5 bg-white/20 backdrop-blur-xl rounded-full border border-white/30"
                                >
                                    <Play className="text-white fill-white w-8 h-8 md:w-10 md:h-10" />
                                </motion.div>
                                <p className="text-white text-[10px] md:text-xs mt-6 font-black uppercase tracking-[0.3em] drop-shadow-lg">
                                    Tap for Sound
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {hasInteraction && (
                        <button
                            onClick={toggleMute}
                            className="absolute bottom-6 right-6 p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-black/60 transition-colors z-20"
                        >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onProceed}
                    className="px-10 py-4 bg-stone-900 text-white font-black rounded-[2rem] uppercase tracking-[0.2em] text-[10px] md:text-[11px] shadow-lg hover:shadow-xl transition-all"
                >
                    Unlock Protocol 04 &rarr;
                </motion.button>
            </motion.div>

            {/* Particle Rain */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-red-100 rounded-full"
                    initial={{ x: Math.random() * 100 + "vw", y: -20, opacity: 0 }}
                    animate={{ y: "100vh", opacity: [0, 0.5, 0] }}
                    transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
                />
            ))}
        </motion.div>
    );
};

export default CelebrationOverlayDay3;
