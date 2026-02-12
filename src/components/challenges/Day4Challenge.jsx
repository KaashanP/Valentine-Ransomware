import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bomb, CheckCircle, XCircle, Timer, AlertTriangle, Play, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const MEMORY_COUNT = 10;
const INITIAL_TIME = 45; // High pressure: 45 seconds

const MEMORY_DATA = [
    {
        options: ["MSTM Gala Night Afterparty", "Underground (Chicago)", "Kams Bollywood Night", "Last time we went to Kams"],
        correct: 3
    },
    {
        options: ["Panshul and Me", "Aryan and Me", "First time I met Sasurji", "2 random strangers from my gallery"],
        correct: 2
    },
    {
        options: ["Independence Day 23'", "Diwali 24'", "Diwali 23'", "Republic Day 24'"],
        correct: 1
    },
    {
        options: ["Halloween painting", "Ganesh Chaturthi 24'", "Navratri 23'", "NPD"],
        correct: 3
    },
    {
        options: ["Michigan Airbnb", "Prerna's house", "Sanjana's House", "Ishu's house"],
        correct: 0
    },
    {
        options: ["Our Graduation", "Basketball", "Football Match", "Aryan's Graduation"],
        correct: 1
    },
    {
        options: ["Canvas painting in Ike", "Picnic in Japan House", "Random day outside Gies", "Halloween 23'"],
        correct: 3
    },
    {
        options: ["NPD", "Thanksgiving 23'", "Navratri 23'", "Ganesh Chaturthi 24'"],
        correct: 2
    },
    {
        options: ["Your random image from before we met", "Jaeger in Murphy's", "Wine and Wings date night", "Last time we went to Murphy's"],
        correct: 1
    },
    {
        options: ["Last time we went to Oozu", "Marufuku in SF", "Kaashu's bday dinner", "Sticky Rice"],
        correct: 2
    }
];

const Day4Challenge = ({ onComplete }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setLeft] = useState(INITIAL_TIME);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState('active'); // 'active', 'correct', 'exploded', 'shattering', 'finished'
    const [showRedScreen, setShowRedScreen] = useState(false);
    const [revealFull, setRevealFull] = useState(false);

    const memories = MEMORY_DATA.map((data, i) => ({
        ...data,
        id: i + 1,
        cropped: `/assets/day4/cropped/${i + 1}.png`,
        full: i === 8 ? `/assets/day4/full/${i + 1}.mp4` : `/assets/day4/full/${i + 1}.jpg`,
        isTypeVideo: i === 8
    }));

    // Timer Logic
    useEffect(() => {
        if (status !== 'active') return;
        if (timeLeft <= 0) {
            handleAnswer(-1); // Auto-fail on timeout
            return;
        }
        const timer = setInterval(() => setLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, status]);

    const handleAnswer = (choiceIdx) => {
        if (status !== 'active') return;

        const isCorrect = choiceIdx === memories[currentIdx].correct;

        if (isCorrect) {
            setScore(prev => prev + 1);
            setStatus('correct');
            setRevealFull(true);
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4ade80', '#ffffff']
            });
            setTimeout(nextStage, 4000);
        } else {
            setStatus('shattering');
            setRevealFull(true);

            // Wait for shatter animation to "peak"
            setTimeout(() => {
                setShowRedScreen(true);
                setStatus('exploded');
            }, 1000);

            // Wait for red screen duration
            setTimeout(() => {
                setShowRedScreen(false);
                nextStage();
            }, 4000);
        }
    };

    const nextStage = () => {
        if (currentIdx < MEMORY_COUNT - 1) {
            setCurrentIdx(prev => prev + 1);
            setLeft(INITIAL_TIME);
            setStatus('active');
            setRevealFull(false);
        } else {
            setStatus('finished');
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentMemory = memories[currentIdx];

    if (status === 'finished') {
        const passed = score >= 8;
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto p-12 bg-black border-4 border-stone-800 rounded-[3rem] text-center shadow-[0_0_100px_rgba(255,255,255,0.05)]"
            >
                <h2 className="text-5xl font-serif italic text-white mb-6">Recall Synthesis</h2>
                <div className="text-9xl font-black text-white mb-8 border-y-2 border-stone-900 py-10 tracking-tighter">
                    {score}<span className="text-3xl text-stone-600 block">/ 10</span>
                </div>
                <p className="text-stone-400 mb-12 text-lg font-medium">
                    {passed
                        ? "Neural integrity preserved. Your memories are safe."
                        : "Critical data loss. Your bond is fractured. Re-upload required."}
                </p>
                {passed ? (
                    <button
                        onClick={onComplete}
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-stone-200 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                    >
                        Initialize Protocol 05
                    </button>
                ) : (
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.3em] rounded-full hover:bg-red-500 transition-all shadow-[0_20px_50px_rgba(220,38,38,0.2)]"
                    >
                        Retry Synthesis
                    </button>
                )}
            </motion.div>
        );
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4">
            {/* Full Screen Red Failure Overlay */}
            <AnimatePresence>
                {showRedScreen && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-red-600 flex flex-col items-center justify-center text-white"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-center"
                        >
                            <Bomb className="w-32 h-32 mb-8 mx-auto animate-bounce text-white fill-white/20" />
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">Memory Destroyed</h2>
                            <p className="text-white/60 font-mono tracking-[0.5em] uppercase">Critical System Failure</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                animate={status === 'shattering' ? { x: [-20, 20, -20, 20, 0], transition: { duration: 0.1, repeat: 10 } } : {}}
                className="w-full max-w-7xl"
            >
                {/* HUD Header */}
                <div className="flex justify-between items-center mb-10 border-b border-stone-800 pb-8 px-4">
                    <div className="flex flex-col">
                        <span className="text-[12px] text-stone-500 font-bold uppercase tracking-[0.4em]">Protocol 04 // Recall Matrix</span>
                        <h2 className="text-white font-serif italic text-4xl">Segment {currentIdx + 1}<span className="text-stone-700 not-italic font-sans text-xl ml-4">/ 10</span></h2>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[1fr,450px] gap-16 items-center">
                    {/* THE TIME BOMB CONTAINER */}
                    <div className="relative flex items-center justify-center py-12">
                        {/* Dynamite Sticks (Stylized Background) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 -z-10 opacity-80 scale-110 rotate-3">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-10 h-[500px] bg-red-700 rounded-full border-b-8 border-black/40 shadow-inner relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/50 via-transparent to-red-900/50" />
                                    </div>
                                ))}
                            </div>
                            {/* Duct Tape Straps */}
                            <div className="absolute top-1/4 left-0 right-0 h-16 bg-stone-800/90 shadow-2xl backdrop-blur-sm -rotate-1" />
                            <div className="absolute bottom-1/4 left-0 right-0 h-16 bg-stone-800/90 shadow-2xl backdrop-blur-sm rotate-1" />
                        </div>

                        {/* Central Bomb Panel */}
                        <div className="relative w-full max-w-[500px] bg-[#151515] border-8 border-stone-800 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                            {/* Digital Timer Panel */}
                            <div className="bg-black p-4 border-b-4 border-stone-900 flex justify-center items-center gap-4">
                                <div className={`
                                    text-6xl font-black font-mono tracking-tighter px-6 py-2 rounded-lg border-2
                                    ${status === 'correct' ? 'text-green-500 border-green-500/20' :
                                        status === 'shattering' || timeLeft < 15 ? 'text-red-600 border-red-600/20 animate-pulse' : 'text-red-500 border-red-900'}
                                `}>
                                    {status === 'correct' ? 'DISARMED' : formatTime(timeLeft)}
                                </div>
                            </div>

                            {/* Image Core (The Fragment) */}
                            <div className="relative aspect-auto min-h-[400px] flex items-center justify-center bg-[#050505]">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`${currentIdx}-${revealFull}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full flex items-center justify-center p-2"
                                    >
                                        {currentMemory.isTypeVideo && revealFull ? (
                                            <video
                                                src={currentMemory.full}
                                                autoPlay
                                                className="w-full h-full object-contain rounded-2xl"
                                            />
                                        ) : (
                                            <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
                                                {/* Shatter Fragments Effect */}
                                                {status === 'shattering' && (
                                                    <div className="absolute inset-0 z-50 grid grid-cols-4 grid-rows-4 pointer-events-none">
                                                        {Array.from({ length: 16 }).map((_, i) => (
                                                            <motion.div
                                                                key={i}
                                                                initial={{ scale: 1, opacity: 1 }}
                                                                animate={{
                                                                    scale: 0,
                                                                    opacity: 0,
                                                                    rotate: Math.random() * 360,
                                                                    x: (Math.random() - 0.5) * 500,
                                                                    y: (Math.random() - 0.5) * 500
                                                                }}
                                                                transition={{ duration: 1, ease: 'easeOut' }}
                                                                className="bg-stone-900 border border-white/10"
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <motion.img
                                                    animate={{
                                                        filter: status === 'exploded' ? 'grayscale(1) brightness(0)' : 'none',
                                                        scale: status === 'shattering' ? 1.1 : 1
                                                    }}
                                                    src={revealFull ? currentMemory.full : currentMemory.cropped}
                                                    alt="Memory Fragment"
                                                    className="max-h-[600px] w-auto h-auto object-contain rounded-2xl"
                                                />
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Success Overlay */}
                                <AnimatePresence>
                                    {status === 'correct' && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 100 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute inset-x-0 bottom-0 bg-green-500 py-6 text-black font-black uppercase text-center tracking-[0.5em] z-30"
                                        >
                                            Memory Saved
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* OPTIONS SIDEBAR */}
                    <div className="flex flex-col gap-6">
                        <div className="mb-4">
                            <h3 className="text-stone-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-center lg:text-left underline decoration-stone-800 underline-offset-8">Select Neural Key</h3>
                        </div>

                        <div className="space-y-4">
                            {currentMemory.options.map((option, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={status === 'active' ? { x: 10, scale: 1.02 } : {}}
                                    whileTap={status === 'active' ? { scale: 0.98 } : {}}
                                    onClick={() => handleAnswer(i)}
                                    disabled={status !== 'active'}
                                    className={`
                                        w-full p-8 text-left rounded-3xl border-2 font-mono text-sm transition-all relative overflow-hidden group
                                        ${status === 'active' ? 'border-stone-800 text-stone-400 hover:border-white hover:text-white hover:bg-white/5' :
                                            i === currentMemory.correct && (status === 'correct' || status === 'shattering' || status === 'exploded') ? 'border-green-500 bg-green-500/10 text-green-400' :
                                                status === 'exploded' ? 'border-red-900/50 text-stone-700 grayscale opacity-20' :
                                                    'border-stone-900 text-stone-800 opacity-30'}
                                    `}
                                >
                                    <div className="relative z-10 flex items-center justify-between">
                                        <span className="flex items-center gap-4">
                                            <span className="text-stone-600 font-sans italic opacity-50">{String.fromCharCode(65 + i)}.</span>
                                            {option}
                                        </span>
                                        {i === currentMemory.correct && status === 'correct' && <CheckCircle className="text-green-500" size={24} />}
                                    </div>
                                    {/* Scanline hover effect */}
                                    {status === 'active' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
                                </motion.button>
                            ))}
                        </div>

                        {/* Progress Indicator */}
                        <div className="mt-8 grid grid-cols-10 gap-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIdx ? 'bg-white w-full' : i < currentIdx ? 'bg-stone-700' : 'bg-stone-900'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer HUD elements */}
                <div className="mt-20 flex items-center gap-10 opacity-20">
                    <span className="text-[10px] font-mono text-white">X-RECOVER_V4.0 // ENCRYPTION: ACTIVE</span>
                    <div className="flex-grow h-[1px] bg-stone-800" />
                    <div className="flex gap-6">
                        <Shield size={14} className="text-white" />
                        <Volume2 size={14} className="text-white" />
                        <AlertTriangle size={14} className="text-white" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Day4Challenge;
