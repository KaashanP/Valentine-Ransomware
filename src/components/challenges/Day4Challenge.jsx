import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Bomb, CheckCircle, XCircle, Timer, AlertTriangle, Play, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const MEMORY_COUNT = 10;
const INITIAL_TIME = 120; // 2 minutes

const Day4Challenge = ({ onComplete }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setLeft] = useState(INITIAL_TIME);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState('active'); // 'active', 'correct', 'exploded', 'finished'
    const [isExploding, setIsExploding] = useState(false);
    const [revealFull, setRevealFull] = useState(false);

    // Initial placeholders - will be updated with user data
    const [memories, setMemories] = useState(Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        cropped: `/assets/day4/cropped/${i + 1}.png`,
        full: i === 8 ? `/assets/day4/full/${i + 1}.mp4` : `/assets/day4/full/${i + 1}.jpg`, // 9.MP4 identified earlier
        options: [
            `Memory ${i + 1} Variation A`,
            `Memory ${i + 1} Variation B`,
            `Memory ${i + 1} Variation C`,
            `Memory ${i + 1} Variation D`
        ],
        correct: 0,
        isTypeVideo: i === 8
    })));

    // Timer Logic
    useEffect(() => {
        if (status !== 'active') return;
        if (timeLeft <= 0) {
            handleExplode();
            return;
        }
        const timer = setInterval(() => setLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, status]);

    const handleExplode = () => {
        setStatus('exploded');
        setIsExploding(true);
        setRevealFull(true);
        setTimeout(() => {
            setIsExploding(false);
            if (currentIdx < MEMORY_COUNT - 1) {
                moveToNext();
            } else {
                setStatus('finished');
            }
        }, 4000);
    };

    const handleAnswer = (choiceIdx) => {
        if (status !== 'active') return;

        if (choiceIdx === memories[currentIdx].correct) {
            setScore(prev => prev + 1);
            setStatus('correct');
            setRevealFull(true);
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#4ade80', '#ffffff']
            });
            setTimeout(() => {
                if (currentIdx < MEMORY_COUNT - 1) {
                    moveToNext();
                } else {
                    setStatus('finished');
                }
            }, 4000);
        } else {
            handleExplode();
        }
    };

    const moveToNext = () => {
        setCurrentIdx(prev => prev + 1);
        setLeft(INITIAL_TIME);
        setStatus('active');
        setRevealFull(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
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
                <div className="text-8xl font-black text-white mb-8 border-y-2 border-stone-800 py-8">
                    {score}/10
                </div>
                <p className="text-stone-400 mb-12 text-lg">
                    {passed
                        ? "Neural integrity preserved. Most memories reconstructed successfully."
                        : "Critical data loss. Your bond is fractured. Retry synthesis?"}
                </p>
                {passed ? (
                    <button
                        onClick={onComplete}
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-full hover:bg-stone-200 transition-all"
                    >
                        Initialize Protocol 05
                    </button>
                ) : (
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-6 bg-red-600 text-white font-black uppercase tracking-[0.3em] rounded-full hover:bg-red-500 transition-all"
                    >
                        Retry Matrix Upload
                    </button>
                )}
            </motion.div>
        );
    }

    return (
        <div className="relative min-h-[800px] flex items-center justify-center p-4">
            {/* Explosion Flash Overlay */}
            <AnimatePresence>
                {isExploding && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-white pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Main Cyberpunk Console */}
            <motion.div
                animate={isExploding ? { x: [-10, 10, -10, 10, 0], transition: { duration: 0.1, repeat: 5 } } : {}}
                className="w-full max-w-4xl bg-[#0a0a0a] border-2 border-stone-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
                {/* HUD Header */}
                <div className="flex justify-between items-center mb-8 border-b border-stone-800 pb-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-stone-500 font-black uppercase tracking-widest">Protocol 04 // Recall Matrix</span>
                        <span className="text-white font-mono text-xl">Memory Segment {currentIdx + 1}/10</span>
                    </div>

                    <div className={`
                        px-6 py-3 rounded-xl border-2 font-mono text-2xl font-black flex items-center gap-3 transition-colors
                        ${status === 'correct' ? 'border-green-500 text-green-500 bg-green-500/10' :
                            status === 'exploded' ? 'border-red-500 text-red-500 bg-red-500/10' :
                                timeLeft < 30 ? 'border-red-600 text-red-600 animate-pulse' : 'border-stone-700 text-white'}
                    `}>
                        <Timer className={timeLeft < 30 ? 'animate-spin-slow' : ''} />
                        {status === 'correct' ? "DISARMED" : status === 'exploded' ? 'DETONATED' : formatTime(timeLeft)}
                    </div>
                </div>

                {/* Main Visual Core */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* The "Bomb" Image Container */}
                    <div className="relative aspect-square md:aspect-[4/5] bg-stone-900 rounded-[2rem] overflow-hidden border-2 border-stone-800 group group-hover:border-stone-700 transition-colors">
                        <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-black/40" />

                        {currentMemory.isTypeVideo && revealFull ? (
                            <video
                                src={currentMemory.full}
                                autoPlay
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <motion.img
                                key={currentIdx}
                                initial={false}
                                animate={{
                                    scale: revealFull ? 1 : 1, // Full image is already sized
                                    filter: status === 'exploded' ? 'grayscale(1) brightness(0.2)' : 'none'
                                }}
                                src={revealFull ? currentMemory.full : currentMemory.cropped}
                                alt="Memory Core"
                                className="w-full h-full object-cover"
                            />
                        )}

                        {/* Status Overlays */}
                        <AnimatePresence>
                            {status === 'correct' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute inset-x-0 bottom-0 bg-green-500 py-4 text-black font-black uppercase text-center tracking-widest z-20"
                                >
                                    MEMORY SAVED
                                </motion.div>
                            )}
                            {status === 'exploded' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute inset-x-0 bottom-0 bg-red-600 py-4 text-white font-black uppercase text-center tracking-widest z-20"
                                >
                                    MEMORY DESTROYED
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Options Console */}
                    <div className="flex flex-col gap-4">
                        <div className="mb-4">
                            <h3 className="text-stone-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-center md:text-left">Select Neural Key</h3>
                            <div className="h-1 w-full bg-stone-900 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-stone-500"
                                    animate={{ width: `${(currentIdx / 10) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {currentMemory.options.map((option, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={status === 'active' ? { x: 5, backgroundColor: '#1a1a1a' } : {}}
                                    whileTap={status === 'active' ? { scale: 0.98 } : {}}
                                    onClick={() => handleAnswer(i)}
                                    disabled={status !== 'active'}
                                    className={`
                                        w-full p-6 text-left rounded-2xl border-2 font-medium transition-all relative overflow-hidden group
                                        ${status === 'active' ? 'border-stone-800 text-stone-400 hover:border-stone-500 hover:text-white' :
                                            i === currentMemory.correct && status === 'correct' ? 'border-green-500 bg-green-500/10 text-green-400' :
                                                i === currentMemory.correct && status === 'exploded' ? 'border-green-500/40 text-green-500/40' :
                                                    'border-stone-900 text-stone-700 opacity-50'}
                                    `}
                                >
                                    <span className="relative z-10 flex items-center justify-between">
                                        {option}
                                        {i === currentMemory.correct && status === 'correct' && <CheckCircle size={18} />}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Scanned Artifact Info */}
                <div className="mt-12 flex items-center gap-6 opacity-30">
                    <div className="flex-grow h-[1px] bg-stone-800" />
                    <div className="flex gap-4">
                        <Shield className="w-4 h-4 text-stone-500" />
                        <Volume2 className="w-4 h-4 text-stone-500" />
                        <AlertTriangle className="w-4 h-4 text-stone-500" />
                    </div>
                    <div className="flex-grow h-[1px] bg-stone-800" />
                </div>
            </motion.div>
        </div>
    );
};

export default Day4Challenge;
