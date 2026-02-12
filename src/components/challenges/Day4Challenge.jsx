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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto p-8 bg-black border-2 border-stone-900 rounded-[3rem] text-center shadow-2xl min-h-[80vh] flex flex-col justify-center items-center">
                <div className="space-y-4 mb-12">
                    <h2 className="text-3xl font-serif italic text-white/80">Recall Synthesis</h2>
                    <div className="text-6xl font-black text-white">{score}/10</div>
                    <p className="text-stone-500 text-lg uppercase tracking-widest">
                        {passed ? "Neural integrity preserved. Access granted." : "Critical data loss detected."}
                    </p>
                </div>

                {passed && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="w-full"
                    >
                        <h3 className="text-4xl md:text-6xl font-black text-white mb-12 uppercase tracking-tighter">
                            BUT THE REAL BOMB IS
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                <motion.div
                                    key={num}
                                    whileHover={{ scale: 1.05 }}
                                    className="aspect-square bg-stone-900 rounded-2xl overflow-hidden border border-white/10"
                                >
                                    <img
                                        src={`/assets/day4/final_reveal/${num}.jpg`}
                                        alt="Surprise Reveal"
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>

                        <button
                            onClick={onComplete}
                            className="bg-white text-black px-12 py-5 text-xl font-black uppercase tracking-[0.3em] rounded-full hover:bg-stone-200 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
                        >
                            Complete Protocol 04
                        </button>
                    </motion.div>
                )}

                {!passed && (
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-red-900 text-white px-12 py-5 text-xl font-black uppercase tracking-[0.3em] rounded-full hover:bg-red-800 transition-all"
                    >
                        Retry Matrix
                    </button>
                )}
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
                                    <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="goo" />
                                </filter>
                                <radialGradient id="blood-grad" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#990000" />
                                    <stop offset="100%" stopColor="#4d0000" />
                                </radialGradient>
                            </defs>
                            <g filter="url(#goo)">
                                {/* Primary Splats */}
                                {[...Array(30)].map((_, i) => (
                                    <motion.circle
                                        key={i}
                                        initial={{ r: 0, cx: 500, cy: 400 }}
                                        animate={{
                                            r: Math.random() * 100 + 30,
                                            cx: Math.random() * 1000,
                                            cy: Math.random() * 800,
                                        }}
                                        fill="url(#blood-grad)"
                                        transition={{ duration: 0.6, ease: "easeOut", delay: Math.random() * 0.2 }}
                                    />
                                ))}
                                {/* Drips */}
                                {[...Array(12)].map((_, i) => (
                                    <motion.rect
                                        key={`drip-${i}`}
                                        initial={{ height: 0, x: Math.random() * 1000, y: -100 }}
                                        animate={{
                                            height: 400 + Math.random() * 400,
                                            y: -50
                                        }}
                                        width={Math.random() * 30 + 10}
                                        rx="20"
                                        fill="#660000"
                                        transition={{ delay: 0.5 + i * 0.1, duration: 2 }}
                                    />
                                ))}
                            </g>
                        </svg>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            className="relative z-[510] font-black text-red-500 text-7xl md:text-9xl uppercase tracking-tighter drop-shadow-[0_0_50px_black]"
                        >
                            Memory Destroyed
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">

                {/* 🧨 TRUE SKEUOMORPHIC TIME BOMB SECTION */}
                <div className="flex-1 relative flex items-center justify-center min-h-[750px] w-full max-w-[750px]">

                    {/* Dynamite Sticks Bundle - REDONE with deeper detail */}
                    <div className="absolute inset-0 flex items-center justify-center -z-10 rotate-90 scale-[1.3]">
                        <svg width="700" height="500" viewBox="0 0 700 500" className="drop-shadow-[20px_40px_60px_rgba(0,0,0,1)]">
                            <defs>
                                <linearGradient id="stick-grad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#e11d48" />
                                    <stop offset="30%" stopColor="#9f1239" />
                                    <stop offset="100%" stopColor="#4c0519" />
                                </linearGradient>
                                <radialGradient id="cap-grad" cx="50%" cy="50%" r="50%">
                                    <stop offset="0%" stopColor="#330000" />
                                    <stop offset="100%" stopColor="#1a0000" />
                                </radialGradient>
                                <filter id="noise">
                                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.1 0" />
                                </filter>
                            </defs>

                            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                <g key={i} transform={`translate(0, ${i * 65})`}>
                                    {/* The Shadow */}
                                    <rect x="30" y="8" width="600" height="55" rx="27" fill="black" opacity="0.6" />
                                    {/* The Body */}
                                    <rect x="35" y="2" width="590" height="50" rx="25" fill="url(#stick-grad)" />
                                    {/* Metallic Cap Texture */}
                                    <circle cx="35" cy="27" r="25" fill="url(#cap-grad)" />
                                    <circle cx="625" cy="27" r="25" fill="url(#cap-grad)" />
                                    {/* Surface Noise */}
                                    <rect x="35" y="2" width="590" height="50" rx="25" filter="url(#noise)" opacity="0.3" />
                                    {/* Highlight Line */}
                                    <rect x="60" y="10" width="540" height="5" rx="2.5" fill="white" opacity="0.1" />
                                </g>
                            ))}

                            {/* Black Industrial Tape */}
                            <rect x="150" y="-20" width="100" height="480" fill="#0a0a0a" rx="8" className="shadow-2xl" />
                            <rect x="450" y="-20" width="100" height="480" fill="#0a0a0a" rx="8" className="shadow-2xl" />
                            {/* Tape texture highlights */}
                            <rect x="150" y="50" width="100" height="4" fill="white" opacity="0.05" />
                            <rect x="450" y="150" width="100" height="4" fill="white" opacity="0.05" />
                        </svg>
                    </div>

                    {/* Industrial Recessed Control Logic Box */}
                    <motion.div
                        animate={status === 'shattering' ? { x: [-15, 15, -15, 15, 0], y: [-5, 5, -5, 5, 0], scale: 1.05 } : {}}
                        transition={{ duration: 0.05, repeat: 20 }}
                        className="relative w-full max-w-[550px] bg-[#111] border-[16px] border-[#1a1a1a] rounded-[3.5rem] shadow-[0_80px_120px_rgba(0,0,0,1),inset_0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden"
                    >
                        {/* LCD Display */}
                        <div className="bg-[#020202] p-8 border-b-[10px] border-[#080808] flex flex-col items-center shadow-inner">
                            <div className="text-9xl font-mono font-black tracking-tighter px-12 py-8 bg-black border-4 border-red-950/30 rounded-3xl shadow-[inset_0_0_100px_rgba(255,0,0,0.4)]
                                ${status === 'correct' ? 'text-green-500 border-green-500/20 shadow-[inset_0_0_100px_rgba(0,255,0,0.3)]' : 
                                  timeLeft < 15 ? 'text-red-900 border-red-900 animate-pulse' : 'text-red-600 border-red-950'}
                            ">
                                {status === 'correct' ? '00:00' : formatTime(timeLeft)}
                            </div>
                            <div className="mt-8 flex gap-12">
                                <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_20px_red]" />
                                <div className="w-4 h-4 rounded-full bg-stone-900 shadow-inner" />
                                <div className="w-4 h-4 rounded-full bg-stone-900 shadow-inner" />
                            </div>
                        </div>

                        {/* Viewing Aperture */}
                        <div className="relative bg-black flex items-center justify-center min-h-[500px] border-t-8 border-black">
                            <AnimatePresence mode="wait">
                                <motion.div key={`${currentIdx}-${revealFull}`} className="w-full h-full flex items-center justify-center p-4">
                                    {currentMemory.isTypeVideo && revealFull ? (
                                        <video src={currentMemory.full} autoPlay className="max-h-[550px] w-full h-full object-contain rounded-xl" />
                                    ) : (
                                        <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
                                            {/* Intense Shatter (100 fragments) */}
                                            {status === 'shattering' && (
                                                <div className="absolute inset-0 z-50 grid grid-cols-10 grid-rows-10">
                                                    {Array.from({ length: 100 }).map((_, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ scale: 1 }}
                                                            animate={{
                                                                scale: 0,
                                                                rotate: Math.random() * 1000,
                                                                x: (Math.random() - 0.5) * 2000,
                                                                y: (Math.random() - 0.5) * 2000
                                                            }}
                                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                                            className="bg-stone-950 border border-white/10"
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            <motion.img
                                                animate={{
                                                    filter: status === 'exploded' ? 'brightness(0) blur(40px)' : 'none',
                                                    scale: status === 'shattering' ? 1.3 : 1
                                                }}
                                                src={revealFull ? currentMemory.full : currentMemory.cropped}
                                                alt="Memory Segment"
                                                className="max-h-[600px] w-full h-auto object-contain rounded-xl"
                                            />
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Glass Glare */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.08] z-10" />
                        </div>
                    </motion.div>
                </div>

                {/* 🌑 OPTIONS SIDEBAR (Industrial Grade) */}
                <div className="lg:w-[480px] w-full bg-black p-12 rounded-[4rem] border-2 border-stone-900 shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col justify-center">
                    <div className="mb-14 border-b-2 border-stone-900/50 pb-10">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">Decipher Sequence</span>
                            <span className="bg-red-950/30 text-red-500 px-3 py-1 rounded-md text-[10px] font-mono border border-red-900/40">LIVE FEED</span>
                        </div>
                        <h2 className="text-white font-serif italic text-4xl leading-tight">Neural Reconstruction <br />#{currentIdx + 1}</h2>
                    </div>

                    <div className="space-y-6">
                        {currentMemory.options.map((option, i) => (
                            <motion.button
                                key={i}
                                whileHover={status === 'active' ? { x: 20, backgroundColor: '#030303', borderColor: '#444' } : {}}
                                onClick={() => handleAnswer(i)}
                                disabled={status !== 'active'}
                                className={`
                                    w-full p-8 text-left rounded-[2rem] border-2 transition-all relative group
                                    ${status === 'active' ? 'border-stone-900 text-stone-600 hover:text-white' :
                                        i === currentMemory.correct ? 'border-green-600 bg-green-950/20 text-green-400' :
                                            'border-stone-950 text-stone-800 opacity-10'}
                                `}
                            >
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center font-mono text-sm text-stone-500 shadow-inner group-hover:border-white/20 transition-colors">
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="font-sans font-medium text-lg leading-snug">{option}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Score Progress */}
                    <div className="mt-16 bg-stone-950/50 p-8 rounded-[2.5rem] border border-stone-900">
                        <div className="flex justify-between text-[11px] font-black text-stone-700 uppercase tracking-widest mb-6">
                            <span>Integrity Status</span>
                            <span>{score} FOUND</span>
                        </div>
                        <div className="flex gap-2.5 h-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        backgroundColor: i === currentIdx ? '#ffffff' : i < currentIdx ? '#222' : '#0a0a0a',
                                        boxShadow: i === currentIdx ? '0 0 20px white' : 'none'
                                    }}
                                    className="flex-grow rounded-full"
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
