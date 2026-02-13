import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ShieldCheck, Ghost, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const COUNTDOWN_SECONDS = 20;

const Day6Challenge = () => {
    const [yesScale, setYesScale] = useState(1);
    const [noPos, setNoPos] = useState(null); // null = initial position
    const [noDodgeCount, setNoDodgeCount] = useState(0);
    const [isAccepted, setIsAccepted] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);
    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
    const [phase, setPhase] = useState('question'); // question, pulling, accepted, celebration

    const noButtonRef = useRef(null);
    const yesButtonRef = useRef(null);
    const containerRef = useRef(null);

    // ── 20-SECOND COUNTDOWN TIMER ──
    useEffect(() => {
        if (phase !== 'question') return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // Auto-trigger the "gravitational pull" sequence
                    setPhase('pulling');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [phase]);

    // ── YES BUTTON GROWS OVER TIME ──
    useEffect(() => {
        if (phase !== 'question') return;
        // Scale grows from 1.0 to ~2.0 over 20 seconds
        const elapsed = COUNTDOWN_SECONDS - timeLeft;
        const newScale = 1 + (elapsed / COUNTDOWN_SECONDS) * 1.2;
        setYesScale(newScale);
    }, [timeLeft, phase]);

    // ── GRAVITATIONAL PULL PHASE → AUTO ACCEPT ──
    useEffect(() => {
        if (phase === 'pulling') {
            // Dramatic 2-second pull animation, then auto-accept
            setTimeout(() => {
                triggerAccept();
            }, 2000);
        }
    }, [phase]);

    // ── NO BUTTON DODGE LOGIC ──
    const dodgeNo = useCallback(() => {
        if (phase !== 'question' || !containerRef.current) return;

        const container = containerRef.current.getBoundingClientRect();
        const padding = 60;
        const btnW = 120;
        const btnH = 50;

        // Generate a random position within the viewport
        const maxX = container.width - btnW - padding;
        const maxY = container.height - btnH - padding;
        const newX = padding + Math.random() * maxX;
        const newY = padding + Math.random() * maxY;

        setNoPos({ x: newX, y: newY });
        setNoDodgeCount(prev => prev + 1);

        // Each dodge makes Yes grow a little more
        setYesScale(prev => Math.min(prev + 0.15, 2.5));
    }, [phase]);

    // ── MOUSE PROXIMITY DETECTION ──
    useEffect(() => {
        if (phase !== 'question') return;

        const handleMouseMove = (e) => {
            if (!noButtonRef.current) return;

            const rect = noButtonRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2);

            // Dodge when cursor gets within 120px
            if (dist < 120) {
                dodgeNo();
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [phase, dodgeNo]);

    // ── TOUCH SUPPORT: Dodge on touch near No button ──
    useEffect(() => {
        if (phase !== 'question') return;

        const handleTouch = (e) => {
            if (!noButtonRef.current) return;
            const touch = e.touches[0];
            const rect = noButtonRef.current.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dist = Math.sqrt((touch.clientX - cx) ** 2 + (touch.clientY - cy) ** 2);

            if (dist < 150) {
                dodgeNo();
            }
        };

        window.addEventListener('touchmove', handleTouch, { passive: true });
        return () => window.removeEventListener('touchmove', handleTouch);
    }, [phase, dodgeNo]);

    const triggerAccept = () => {
        if (isAccepted) return;
        setIsAccepted(true);
        setPhase('accepted');

        // Multi-burst confetti
        const duration = 4000;
        const end = Date.now() + duration;
        const colors = ['#ff0000', '#ff69b4', '#ffffff', '#ff1493', '#ffb6c1'];

        const frame = () => {
            confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
            confetti({ particleCount: 8, spread: 100, origin: { y: 0.7 }, colors });

            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();

        setTimeout(() => {
            setPhase('celebration');
            setShowFinalMessage(true);
        }, 3000);
    };

    // ── CELEBRATION VIEW ──
    if (showFinalMessage) {
        return (
            <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center overflow-hidden">
                {/* Floating hearts background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(30)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            initial={{
                                y: '110vh',
                                x: `${Math.random() * 100}vw`,
                                opacity: 0.15 + Math.random() * 0.3,
                                scale: 0.5 + Math.random() * 1.5
                            }}
                            animate={{ y: '-10vh' }}
                            transition={{
                                duration: 6 + Math.random() * 8,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: Math.random() * 5
                            }}
                        >
                            <Heart
                                size={20 + Math.random() * 30}
                                fill="currentColor"
                                className="text-pink-500/30"
                            />
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.3 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.3 }}
                    className="relative z-10 text-center px-8 max-w-3xl"
                >
                    <motion.div
                        animate={{ scale: [1, 1.15, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="mb-12"
                    >
                        <Heart size={140} fill="#ec4899" className="text-pink-500 mx-auto drop-shadow-[0_0_60px_rgba(236,72,153,0.6)]" />
                    </motion.div>

                    <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
                        I KNEW IT! <span className="text-pink-500">❤️</span>
                    </h1>

                    {/* The Couple Photo */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 1, duration: 1.5, type: 'spring', damping: 15 }}
                        className="mb-12"
                    >
                        <div className="relative mx-auto max-w-sm rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-[0_0_80px_rgba(236,72,153,0.3)] rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                            <img
                                src="/assets/day6_final.jpg"
                                alt="Us"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </motion.div>

                    <p className="text-2xl md:text-3xl text-pink-300 font-serif italic mb-16 leading-relaxed">
                        The ransomware has been deactivated. <br />My heart is now permanently yours.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5 }}
                        className="bg-emerald-950/40 border-2 border-emerald-500/40 backdrop-blur-xl p-10 rounded-[2rem] max-w-xl mx-auto"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <ShieldCheck className="text-emerald-400 w-6 h-6" />
                            <p className="text-emerald-400 font-mono text-sm uppercase tracking-[0.5em] font-black">Decryption Successful</p>
                        </div>
                        <p className="text-stone-300 text-lg leading-relaxed font-serif italic">
                            "You passed every test. You matched every memory. You grew every bloom. You mirrored every expression. I love you more than words can encode."
                        </p>
                        <div className="mt-8 flex justify-center gap-3">
                            {[...Array(7)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 2 + i * 0.15 }}
                                >
                                    <Heart size={18} fill="#10b981" className="text-emerald-500" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // ── GRAVITATIONAL PULL ANIMATION ──
    if (phase === 'pulling') {
        return (
            <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center">
                <motion.div
                    initial={{ scale: yesScale, opacity: 1 }}
                    animate={{ scale: 4, opacity: 1 }}
                    transition={{ duration: 2, ease: 'easeIn' }}
                    className="relative"
                >
                    <div className="px-16 py-10 bg-gradient-to-r from-pink-600 to-red-600 rounded-[2rem] shadow-[0_0_120px_rgba(236,72,153,0.8)]">
                        <span className="text-white font-black text-4xl tracking-wider">YES!</span>
                    </div>
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="absolute bottom-20 text-stone-600 font-mono text-xs uppercase tracking-[0.5em]"
                >
                    Gravitational Lock Initiated...
                </motion.p>
            </div>
        );
    }

    // ── MAIN QUESTION VIEW ──
    return (
        <div ref={containerRef} className="fixed inset-0 flex flex-col items-center justify-center relative overflow-hidden bg-black/50 backdrop-blur-sm z-[100]">

            {/* Falling Hearts Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-red-900/10"
                        initial={{ y: -100, x: `${Math.random() * 100}%` }}
                        animate={{ y: '110vh' }}
                        transition={{ duration: Math.random() * 10 + 5, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
                    >
                        <Heart size={Math.random() * 40 + 20} fill="currentColor" />
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {!isAccepted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="flex flex-col items-center z-10 px-6"
                    >
                        <div className="bg-black/90 border-4 border-pink-600/40 p-12 md:p-16 rounded-[3rem] shadow-[0_0_80px_rgba(236,72,153,0.15)] text-center max-w-2xl backdrop-blur-xl relative overflow-hidden">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 via-transparent to-red-900/10 pointer-events-none" />

                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <ShieldCheck size={64} className="text-pink-500 mb-8 mx-auto" />
                            </motion.div>

                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tighter relative z-10">
                                FINAL CLEARANCE:
                            </h1>
                            <h2 className="text-3xl md:text-5xl font-serif italic text-pink-400 mb-10 relative z-10">
                                Will You Be My Valentine?
                            </h2>

                            {/* Timer */}
                            <div className="mb-10">
                                <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-pink-500 to-red-500"
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${(timeLeft / COUNTDOWN_SECONDS) * 100}%` }}
                                        transition={{ duration: 1, ease: 'linear' }}
                                    />
                                </div>
                                <p className="text-stone-600 font-mono text-[10px] mt-3 uppercase tracking-[0.4em]">
                                    Auto-Accept in {timeLeft}s
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-center gap-8 relative z-10">
                                <motion.button
                                    ref={yesButtonRef}
                                    onClick={triggerAccept}
                                    animate={{ scale: yesScale }}
                                    transition={{ type: 'spring', damping: 10, stiffness: 80 }}
                                    whileHover={{ scale: yesScale + 0.1 }}
                                    whileTap={{ scale: yesScale - 0.1 }}
                                    className="px-10 md:px-14 py-5 md:py-7 bg-gradient-to-r from-pink-600 to-red-600 text-white font-black text-2xl md:text-3xl rounded-2xl shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:shadow-[0_0_80px_rgba(236,72,153,0.7)] transition-shadow relative overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        YES! <Heart size={24} className="fill-white" />
                                    </span>
                                    {/* Shimmer effect */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        animate={{ x: ['-200%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                    />
                                </motion.button>
                            </div>

                            {noDodgeCount > 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-stone-700 text-xs mt-6 font-mono uppercase tracking-[0.3em]"
                                >
                                    [No button escaped {noDodgeCount}x — resistance is futile]
                                </motion.p>
                            )}
                        </div>

                        <div className="mt-8 text-stone-700 font-mono text-[10px] flex items-center gap-2 uppercase tracking-[0.5em]">
                            <Ghost size={12} />
                            <span>No rejection permitted by kernel</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Dodging "No" Button */}
            {phase === 'question' && (
                <motion.button
                    ref={noButtonRef}
                    onMouseEnter={dodgeNo}
                    onClick={dodgeNo} // Even clicking it just makes it dodge
                    animate={noPos ? {
                        left: noPos.x,
                        top: noPos.y,
                    } : {}}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className={`${noPos ? 'fixed' : 'mt-6 relative'} z-[200] px-8 py-4 bg-stone-900 text-stone-600 font-bold text-lg rounded-xl border border-stone-800 hover:border-stone-700 select-none`}
                    style={noPos ? { position: 'fixed' } : {}}
                >
                    No
                </motion.button>
            )}
        </div>
    );
};

export default Day6Challenge;
