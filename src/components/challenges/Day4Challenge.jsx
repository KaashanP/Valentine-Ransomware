import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
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
    const [status, setStatus] = useState('active'); // active, correct, shattering, exploded, finished
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
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 },
                colors: ['#4ade80', '#ffffff', '#22c55e']
            });
            setTimeout(nextStage, 4000);
        } else {
            setStatus('shattering');
            setRevealFull(true);
            setTimeout(() => {
                setShowBlood(true);
                setStatus('exploded');
            }, 500);
            setTimeout(() => {
                setShowBlood(false);
                nextStage();
            }, 5000);
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
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto p-16 bg-black border-4 border-stone-900 rounded-[4rem] text-center shadow-[0_0_100px_rgba(255,0,0,0.1)]">
                <h2 className="text-6xl font-serif italic text-white mb-8">Recall Synthesis</h2>
                <div className="text-[12rem] font-black text-white mb-10 leading-none tracking-tighter">{score}<span className="text-4xl text-stone-700">/10</span></div>
                <p className="text-stone-400 mb-12 text-xl">{passed ? "Neural integrity preserved. Access granted." : "Critical data loss detected."}</p>
                <button onClick={passed ? onComplete : () => window.location.reload()} className={`w-full py-8 text-2xl font-black uppercase tracking-[0.4em] rounded-full transition-all ${passed ? 'bg-white text-black hover:scale-105' : 'bg-red-900 text-white hover:bg-red-800'}`}>
                    {passed ? "Protocol 05 Unlocked" : "Retry Matrix Upload"}
                </button>
            </motion.div>
        );
    }

    const currentMemory = memories[currentIdx];

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#020202] overflow-hidden">

            {/* 🩸 BLOOD SPLASH OVERLAY */}
            <AnimatePresence>
                {showBlood && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[500] flex items-center justify-center pointer-events-none">
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="none">
                            <defs>
                                <filter id="goo">
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                                </filter>
                            </defs>
                            <g filter="url(#goo)">
                                {[...Array(25)].map((_, i) => (
                                    <motion.circle
                                        key={i}
                                        initial={{ r: 0, cx: 500, cy: 400 }}
                                        animate={{
                                            r: Math.random() * 80 + 20,
                                            cx: Math.random() * 1000,
                                            cy: Math.random() * 800,
                                            scale: [1, 1.2, 1]
                                        }}
                                        fill="#990000"
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                ))}
                                {/* Dripping Splashes */}
                                {[...Array(8)].map((_, i) => (
                                    <motion.path
                                        key={`drip-${i}`}
                                        initial={{ d: `M${Math.random() * 1000},0 L${Math.random() * 1000},0 Z`, opacity: 0 }}
                                        animate={{
                                            d: `M${200 + i * 100},${-100} Q${200 + i * 100 + 50},${100} ${200 + i * 100},${600 + Math.random() * 200}`,
                                            opacity: 1
                                        }}
                                        stroke="#800000"
                                        strokeWidth="40"
                                        strokeLinecap="round"
                                        fill="none"
                                        transition={{ delay: 0.2 + i * 0.1, duration: 1.5 }}
                                    />
                                ))}
                            </g>
                        </svg>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1.5, opacity: 1, rotate: 0 }}
                            className="relative z-[510] font-black text-red-500 text-8xl md:text-[10rem] uppercase tracking-tighter drop-shadow-[0_10px_50px_rgba(255,0,0,0.9)]"
                        >
                            Memory Destroyed
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-12 items-center lg:items-stretch">

                {/* 🧨 SKEUOMORPHIC TIME BOMB SECTION */}
                <div className="flex-1 relative flex items-center justify-center min-h-[700px] w-full max-w-[700px]">

                    {/* Dynamite Sticks Bundle (Redo with pure SVG for 3D realism) */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10 rotate-90 scale-[1.2]">
                        <svg width="600" height="400" viewBox="0 0 600 400" className="drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)]">
                            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                <g key={i} transform={`translate(0, ${i * 55})`}>
                                    {/* Cylindrical Shadow */}
                                    <rect x="20" y="5" width="560" height="45" rx="22" fill="#4d0000" />
                                    {/* Main Body */}
                                    <rect x="25" y="0" width="550" height="45" rx="22" fill="#8b0000" />
                                    {/* Lighting/Gradient overlay for roundness */}
                                    <rect x="25" y="5" width="550" height="15" rx="22" fill="url(#stick-light)" opacity="0.4" />
                                    {/* Capped End Panels */}
                                    <circle cx="25" cy="22.5" r="22.5" fill="#5a0000" />
                                    <circle cx="575" cy="22.5" r="22.5" fill="#5a0000" />
                                    {/* Fuse wires coming out of the end */}
                                    <path d="M575,22.5 C620,22.5 600,100 550,150" fill="none" stroke={i % 2 === 0 ? "#ffcc00" : "#ff3300"} strokeWidth="3" opacity="0.6" />
                                </g>
                            ))}
                            <defs>
                                <linearGradient id="stick-light" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="white" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                            </defs>

                            {/* Black Tape Straps */}
                            <rect x="100" y="-10" width="80" height="420" fill="#111" rx="5" className="opacity-95" />
                            <rect x="420" y="-10" width="80" height="420" fill="#111" rx="5" className="opacity-95" />
                            {/* Tape texture details */}
                            <rect x="100" y="50" width="80" height="2" fill="white" opacity="0.05" />
                            <rect x="100" y="150" width="80" height="2" fill="white" opacity="0.05" />
                            <rect x="420" y="250" width="80" height="2" fill="white" opacity="0.05" />
                        </svg>
                    </div>

                    {/* Industrial Control Box Panel */}
                    <motion.div
                        animate={status === 'shattering' ? { x: [-15, 15, -15, 15, 0], y: [-5, 5, -5, 5, 0], scale: 1.05 } : {}}
                        transition={{ duration: 0.05, repeat: 20 }}
                        className="relative w-full max-w-[520px] bg-[#1a1a1a] border-[14px] border-[#2a2a2a] rounded-[3rem] shadow-[0_60px_100px_rgba(0,0,0,1),inset_0_2px_10px_rgba(255,255,255,0.1)] overflow-hidden"
                    >
                        {/* High-Impact Digital Timer Section */}
                        <div className="bg-[#050505] p-8 border-b-[8px] border-[#111] flex flex-col items-center">
                            <div className="text-[12px] font-black text-stone-500 uppercase tracking-[0.5em] mb-4">Neural Sequence {currentIdx + 1}</div>
                            <div className={`
                                text-9xl font-mono font-black tracking-tighter px-12 py-6 bg-black border-[6px] rounded-2xl shadow-[inset_0_0_80px_rgba(255,0,0,0.3)]
                                ${status === 'correct' ? 'text-green-500 border-green-500/20 shadow-[inset_0_0_80px_rgba(0,255,0,0.2)]' :
                                    timeLeft < 15 ? 'text-red-600 border-red-600 animate-pulse' : 'text-red-500 border-red-900'}
                            `}>
                                {status === 'correct' ? '00:00' : formatTime(timeLeft)}
                            </div>
                            {/* Blinking LEDs */}
                            <div className="mt-6 flex gap-8">
                                <div className={`w-3 h-3 rounded-full ${timeLeft % 2 === 0 ? 'bg-red-600 shadow-[0_0_15px_red]' : 'bg-red-950'} transition-colors`} />
                                <div className="w-3 h-3 rounded-full bg-stone-800" />
                                <div className="w-3 h-3 rounded-full bg-stone-800" />
                            </div>
                        </div>

                        {/* Fragment Viewing Port (Industrial Glass look) */}
                        <div className="relative bg-black flex items-center justify-center min-h-[480px] p-6">
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentIdx}-${revealFull}`} className="w-full h-full flex items-center justify-center">
                                    {currentMemory.isTypeVideo && revealFull ? (
                                        <video src={currentMemory.full} autoPlay className="max-h-[550px] w-full h-full object-contain rounded-lg" />
                                    ) : (
                                        <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
                                            {/* Advanced Image Shattering (64 fragments) */}
                                            {status === 'shattering' && (
                                                <div className="absolute inset-0 z-50 grid grid-cols-8 grid-rows-8">
                                                    {Array.from({ length: 64 }).map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ scale: 1, opacity: 1 }}
                                                            animate={{
                                                                scale: [1, 4, 0],
                                                                opacity: [1, 1, 0],
                                                                rotate: Math.random() * 1000,
                                                                x: (Math.random() - 0.5) * 2000,
                                                                y: (Math.random() - 0.5) * 2000
                                                            }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className="bg-[#111] border border-white/20"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            <motion.img
                                                animate={{
                                                    filter: status === 'exploded' ? 'brightness(0) blur(20px)' : 'none',
                                                    scale: status === 'shattering' ? 1.2 : 1
                                                }}
                                                src={revealFull ? currentMemory.full : currentMemory.cropped}
                                                alt="Memory Fragment"
                                                className="max-h-[600px] w-auto h-auto object-contain rounded-lg p-2"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Glass Surface Reflection */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent z-10" />
                            <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-red-600/20 blur-sm" />
                        </div>
                    </motion.div>
                </div>

                {/* 🌑 OPTIONS PANEL (PURE BLACK SIDEBAR) */}
                <div className="lg:w-[480px] w-full bg-black p-12 rounded-[3.5rem] border-2 border-stone-900 shadow-2xl flex flex-col justify-center">
                    <div className="mb-12 border-b-2 border-stone-900 pb-10">
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Neural Input Console</span>
                            <span className="text-stone-600 font-mono text-[11px] font-bold">Progress: {score}/10</span>
                        </div>
                        <h2 className="text-white font-serif italic text-4xl leading-tight">Identify this <br />Neural Fragment...</h2>
                    </div>

                    <div className="space-y-5">
                        {currentMemory.options.map((option, i) => (
                            <motion.button
                                key={i}
                                whileHover={status === 'active' ? { x: 15, backgroundColor: '#050505', borderColor: '#555' } : {}}
                                onClick={() => handleAnswer(i)}
                                disabled={status !== 'active'}
                                className={`
                                    w-full p-8 text-left rounded-3xl border-2 transition-all relative overflow-hidden active:scale-95
                                    ${status === 'active' ? 'border-stone-900 text-stone-500 hover:text-white' :
                                        i === currentMemory.correct ? 'border-green-600 bg-green-900/10 text-green-400' :
                                            'border-stone-950 text-stone-800 opacity-20'}
                                `}
                            >
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center font-mono text-sm text-stone-400 grayscale">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="font-sans font-medium text-lg tracking-tight">{option}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Industrial Progress Bar */}
                    <div className="mt-16 bg-[#050505] p-6 rounded-3xl border border-stone-900">
                        <div className="flex gap-2.5 h-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        backgroundColor: i === currentIdx ? '#ffffff' : i < currentIdx ? '#333' : '#111',
                                        boxShadow: i === currentIdx ? '0 0 15px white' : 'none'
                                    }}
                                    className="flex-grow rounded-full transition-all duration-700"
                                />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Day4Challenge;
