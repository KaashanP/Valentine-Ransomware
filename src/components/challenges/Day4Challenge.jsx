import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

const MEMORY_COUNT = 10;
const INITIAL_TIME = 45;

const MEMORY_DATA = [
    { options: ["MSTM Gala Night Afterparty", "Underground (Chicago)", "Kams Bollywood Night", "Last time we went to Kams"], correct: 3 },
    { options: ["Panshul and Me", "Aryan and Me", "First time I met Sasurji", "2 random strangers from my gallery"], correct: 2 },
    { options: ["Independence Day 23'", "Diwali 24'", "Diwali 23'", "Republic Day 24'"], correct: 1 },
    { options: ["Halloween painting", "Ganesh Chaturthi 24'", "Navratri 23'", "NPD"], correct: 3 },
    { options: ["Michigan Airbnb", "Prerna's house", "Sanjana's House", "Ishu's house"], correct: 0 },
    { options: ["Our Graduation", "Basketball", "Football Match", "Aryan's Graduation"], correct: 1 },
    { options: ["Canvas painting in Ike", "Picnic in Japan House", "Random day outside Gies", "Halloween 23'"], correct: 3 },
    { options: ["NPD", "Thanksgiving 23'", "Navratri 23'", "Ganesh Chaturthi 24'"], correct: 2 },
    { options: ["Your random image from before we met", "Jaeger in Murphy's", "Wine and Wings date night", "Last time we went to Murphy's"], correct: 1 },
    { options: ["Last time we went to Oozu", "Marufuku in SF", "Kaashu's bday dinner", "Sticky Rice"], correct: 2 }
];

const Day4Challenge = ({ onComplete }) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setLeft] = useState(INITIAL_TIME);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState('active'); // 'active', 'correct', 'shattering', 'exploded', 'finished'
    const [revealFull, setRevealFull] = useState(false);
    const [showBlood, setShowBlood] = useState(false);

    const memories = MEMORY_DATA.map((data, i) => ({
        ...data,
        id: i + 1,
        cropped: `/assets/day4/cropped/${i + 1}.png`,
        full: i === 8 ? `/assets/day4/full/${i + 1}.mp4` : `/assets/day4/full/${i + 1}.jpg`,
        isTypeVideo: i === 8
    }));

    useEffect(() => {
        if (status !== 'active') return;
        if (timeLeft <= 0) {
            handleAnswer(-1);
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
            setTimeout(nextStage, 3000);
        } else {
            setStatus('shattering');
            setRevealFull(true);
            setTimeout(() => {
                setShowBlood(true);
                setStatus('exploded');
            }, 800);
            setTimeout(() => {
                setShowBlood(false);
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

    if (status === 'finished') {
        const passed = score >= 8;
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto p-12 bg-black border-4 border-stone-950 rounded-[3rem] text-center shadow-2xl">
                <h2 className="text-5xl font-serif italic text-white mb-6">Recall Synthesis</h2>
                <div className="text-9xl font-black text-white mb-8 border-y border-stone-900 py-10">{score}/10</div>
                <p className="text-stone-500 mb-12 text-lg">{passed ? "Neural integrity preserved." : "Critical data loss."}</p>
                <button onClick={passed ? onComplete : () => window.location.reload()} className={`w-full py-6 font-black uppercase tracking-[0.3em] rounded-full transition-all ${passed ? 'bg-white text-black' : 'bg-red-900 text-white'}`}>
                    {passed ? "Unlock Protocol 05" : "Retry Matrix"}
                </button>
            </motion.div>
        );
    }

    const currentMemory = memories[currentIdx];

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#050505]">
            {/* Blood Splash Overlay */}
            <AnimatePresence>
                {showBlood && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                        {/* Blood Splatter SVG */}
                        <svg className="absolute inset-0 w-full h-full text-red-700/80 filter blur-sm" viewBox="0 0 800 600">
                            <motion.path
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                d="M400,300 C450,250 550,250 600,300 C650,350 550,450 400,500 C250,450 150,350 200,300 C250,250 350,250 400,300"
                                fill="currentColor"
                                className="origin-center"
                            />
                            {/* Random splats */}
                            {[...Array(20)].map((_, i) => (
                                <motion.circle
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: Math.random() * 2 + 1, x: (Math.random() - 0.5) * 800, y: (Math.random() - 0.5) * 600 }}
                                    cx="400" cy="300" r={Math.random() * 20 + 5}
                                    fill="currentColor"
                                />
                            ))}
                        </svg>
                        <motion.h2
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            className="relative z-[210] text-7xl md:text-9xl font-black text-red-600 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                        >
                            Memory Destroyed
                        </motion.h2>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-7xl">
                <div className="grid lg:grid-cols-[1fr,480px] gap-12 items-stretch min-h-[650px]">

                    {/* THE REALISTIC TIME BOMB */}
                    <div className="relative flex flex-col items-center justify-center p-8 bg-[#0a0a0a] rounded-[3.5rem] border-2 border-stone-900 shadow-inner">
                        <div className="relative w-full max-w-[550px] flex items-center justify-center">

                            {/* Dynamite Sticks Bundle */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 -z-10">
                                <div className="flex gap-1.5 rotate-90 scale-x-125">
                                    {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                        <div key={i} className="w-12 h-[550px] bg-red-800 rounded-full border-b-[12px] border-black/50 relative overflow-hidden shadow-2xl">
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-transparent to-black/40" />
                                            <div className="absolute top-1/2 left-0 right-0 h-2 bg-black/10" />
                                        </div>
                                    ))}
                                </div>
                                {/* Duct Tape Straps */}
                                <div className="absolute top-1/4 w-[120%] h-20 bg-stone-900 shadow-2xl -rotate-2 border-y border-stone-800" />
                                <div className="absolute bottom-1/4 w-[120%] h-20 bg-stone-900 shadow-2xl rotate-2 border-y border-stone-800" />
                            </div>

                            {/* Electronic Control Box */}
                            <motion.div
                                animate={status === 'shattering' ? { x: [-15, 15, -15, 15, 0], transition: { duration: 0.08, repeat: 10 } } : {}}
                                className="relative w-full bg-[#1A1A1A] border-[10px] border-[#2A2A2A] rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,1)] overflow-hidden"
                            >
                                {/* LCD Timer Panel */}
                                <div className="bg-black py-6 border-b-[6px] border-[#111] flex flex-col items-center">
                                    <div className="text-[10px] font-black text-stone-600 uppercase tracking-[0.4em] mb-3">T-Minus / Seg {currentIdx + 1}</div>
                                    <div className={`
                                        text-7xl font-mono font-black tracking-tighter px-10 py-2 border-4 rounded-xl
                                        ${status === 'correct' ? 'text-green-500 border-green-500/20' :
                                            timeLeft < 15 ? 'text-red-600 border-red-600 animate-pulse' : 'text-red-500 border-red-900/50'}
                                    `}>
                                        {status === 'correct' ? 'DISARMED' : formatTime(timeLeft)}
                                    </div>
                                </div>

                                {/* Memory Visual Core */}
                                <div className="relative aspect-auto min-h-[420px] bg-black flex items-center justify-center p-2">
                                    <AnimatePresence mode="wait">
                                        <motion.div key={`${currentIdx}-${revealFull}`} className="w-full h-full flex items-center justify-center">
                                            {currentMemory.isTypeVideo && revealFull ? (
                                                <video src={currentMemory.full} autoPlay className="max-h-[500px] w-auto h-auto object-contain rounded-xl shadow-2xl" />
                                            ) : (
                                                <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
                                                    {/* Enhanced Shatter Effect */}
                                                    {status === 'shattering' && (
                                                        <div className="absolute inset-0 z-50 grid grid-cols-6 grid-rows-6">
                                                            {Array.from({ length: 36 }).map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ scale: 1, opacity: 1 }}
                                                                    animate={{
                                                                        scale: [1, 2, 0],
                                                                        opacity: [1, 1, 0],
                                                                        rotate: Math.random() * 720,
                                                                        x: (Math.random() - 0.5) * 1000,
                                                                        y: (Math.random() - 0.5) * 1000
                                                                    }}
                                                                    transition={{ duration: 1.2, ease: 'backOut' }}
                                                                    className="bg-stone-950 border border-white/5 shadow-2xl"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    <motion.img
                                                        animate={{
                                                            filter: status === 'exploded' ? 'brightness(0)' : 'none',
                                                            scale: status === 'shattering' ? 1.2 : 1
                                                        }}
                                                        src={revealFull ? currentMemory.full : currentMemory.cropped}
                                                        alt="Memory"
                                                        className="max-h-[550px] w-auto h-auto object-contain rounded-xl p-4"
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* OPTIONS AREA (Solid Black Background) */}
                    <div className="bg-black p-10 rounded-[3.5rem] border-2 border-stone-900 flex flex-col justify-center">
                        <div className="mb-10 flex items-center justify-between">
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.6em]">Select Neural Key</h3>
                            <div className="text-stone-700 font-mono text-[10px]">{score}/10 Saved</div>
                        </div>

                        <div className="space-y-4">
                            {currentMemory.options.map((option, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={status === 'active' ? { x: 10, backgroundColor: '#111' } : {}}
                                    onClick={() => handleAnswer(i)}
                                    disabled={status !== 'active'}
                                    className={`
                                        w-full p-8 text-left rounded-3xl border-2 font-mono text-sm transition-all
                                        ${status === 'active' ? 'border-stone-800 text-stone-500 hover:border-white hover:text-white' :
                                            i === currentMemory.correct && (status === 'correct' || status === 'shattering' || status === 'exploded') ? 'border-green-500 bg-green-500/10 text-green-400' :
                                                'border-stone-900 text-stone-800 opacity-20'}
                                    `}
                                >
                                    <span className="flex items-center gap-5">
                                        <span className="w-8 h-8 rounded-full border border-stone-800 flex items-center justify-center text-[10px] text-stone-600 grayscale">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {option}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        <div className="mt-12 grid grid-cols-10 gap-1.5 h-1">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className={`rounded-full ${i === currentIdx ? 'bg-red-500' : i < currentIdx ? 'bg-stone-700' : 'bg-stone-900'}`} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Day4Challenge;
