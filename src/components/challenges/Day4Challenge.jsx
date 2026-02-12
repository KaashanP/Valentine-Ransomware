import React, { useState, useEffect, useRef } from 'react';
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
        <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#050505] overflow-hidden">
            {/* Blood Splash Overlay */}
            <AnimatePresence>
                {showBlood && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
                        {/* Multiple Splatter Layers */}
                        {[...Array(3)].map((_, layer) => (
                            <svg key={layer} className={`absolute inset-0 w-full h-full text-red-900/${70 - layer * 10} filter blur-[2px]`} viewBox="0 0 800 600">
                                {[...Array(15)].map((_, i) => (
                                    <motion.path
                                        key={i}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: Math.random() * 2 + 1, opacity: 1 }}
                                        transition={{ delay: i * 0.05 + layer * 0.2 }}
                                        d={`M${Math.random() * 800},${Math.random() * 600} Q${Math.random() * 100},${Math.random() * 100} ${Math.random() * 50},${Math.random() * 50} T${Math.random() * 100},${Math.random() * 100} Z`}
                                        fill="currentColor"
                                    />
                                ))}
                            </svg>
                        ))}
                        <motion.h2
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative z-[210] text-7xl md:text-9xl font-black text-red-600 uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]"
                        >
                            Memory Destroyed
                        </motion.h2>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="w-full max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-[1fr,480px] gap-8 items-stretch pt-8">

                    {/* HYPER-REALISTIC SKEUOMORPHIC BOMB SECTION */}
                    <div className="relative flex flex-col items-center justify-center p-4 bg-[#0a0a0a] rounded-[3.5rem] border-2 border-white/5 shadow-2xl">

                        {/* THE BOMB DEVICE */}
                        <div className="relative w-full max-w-[550px] py-16 flex items-center justify-center">

                            {/* Dynamite Cylinder Bundle (3D Styled) */}
                            <div className="absolute inset-x-0 h-[480px] flex items-center justify-center gap-1.5 -z-10 rotate-90">
                                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                    <div key={i} className="w-14 h-full bg-[#8b0000] rounded-full relative shadow-[inserted_0_10px_20px_rgba(0,0,0,0.5),10px_0_20px_rgba(0,0,0,0.8)] border-x border-black/20 overflow-hidden">
                                        {/* Lighting effects for cylindrical look */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 via-transparent to-black/60" />
                                        <div className="absolute top-0 left-0 right-0 h-4 bg-black/40 rounded-t-full" />
                                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/30 flex justify-center items-center">
                                            <div className="w-3 h-12 bg-black/40 rounded-full" />
                                        </div>
                                    </div>
                                ))}

                                {/* Duct Tape Straps (Realistic Texture) */}
                                <div className="absolute top-[20%] w-[120%] h-24 bg-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.8)] -rotate-3 border-y border-[#222]">
                                    <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_4px)]" />
                                </div>
                                <div className="absolute bottom-[20%] w-[120%] h-24 bg-[#111] shadow-[0_10px_30px_rgba(0,0,0,0.8)] rotate-3 border-y border-[#222]">
                                    <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(90deg,#000,#000_1px,transparent_1px,transparent_4px)]" />
                                </div>

                                {/* Exposed Wires */}
                                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                                    <path d="M100,50 Q150,0 200,50" fill="none" stroke="#F87171" strokeWidth="4" className="drop-shadow-lg" />
                                    <path d="M300,50 Q350,100 400,50" fill="none" stroke="#60A5FA" strokeWidth="4" className="drop-shadow-lg" />
                                    <path d="M500,50 Q550,-20 600,50" fill="none" stroke="#34D399" strokeWidth="4" className="drop-shadow-lg" />
                                </svg>
                            </div>

                            {/* Center-mounted Industrial Control Panel */}
                            <motion.div
                                animate={status === 'shattering' ? { x: [-20, 20, -20, 20, 0], y: [-5, 5, -5, 5, 0], scale: 1.05, transition: { duration: 0.05, repeat: 20 } } : {}}
                                className="relative w-full bg-[#151515] border-[12px] border-[#252525] rounded-[2rem] shadow-[0_60px_100px_rgba(0,0,0,1),inset_0_2px_10px_rgba(255,255,255,0.1)] overflow-hidden"
                            >
                                {/* Digital LED Timer */}
                                <div className="bg-[#050505] p-6 border-b-[8px] border-[#111] flex flex-col items-center">
                                    <div className="flex gap-1 mb-2">
                                        {[1, 2, 3].map(i => <div key={i} className="w-3 h-1 bg-[#222] rounded-full shadow-inner" />)}
                                    </div>
                                    <div className={`
                                        text-8xl font-mono font-black tracking-tighter px-10 py-4 bg-black border-4 rounded-xl shadow-[inset_0_0_50px_rgba(255,0,0,0.2)]
                                        ${status === 'correct' ? 'text-green-500 border-green-500/20 shadow-[inset_0_0_50px_rgba(0,255,0,0.1)]' :
                                            timeLeft < 15 ? 'text-red-600 border-red-600 animate-pulse' : 'text-red-500 border-red-900/50'}
                                    `}>
                                        {status === 'correct' ? '00:00' : formatTime(timeLeft)}
                                    </div>
                                    <div className="mt-4 flex gap-4 opacity-40">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                        <div className="w-2 h-2 rounded-full bg-stone-700" />
                                        <div className="w-2 h-2 rounded-full bg-stone-700" />
                                    </div>
                                </div>

                                {/* Memory Viewing Port */}
                                <div className="relative bg-[#020202] flex items-center justify-center p-6 min-h-[450px]">
                                    <AnimatePresence mode="wait">
                                        <motion.div key={`${currentIdx}-${revealFull}`} className="w-full h-full flex items-center justify-center">
                                            {currentMemory.isTypeVideo && revealFull ? (
                                                <video src={currentMemory.full} autoPlay className="max-h-[500px] w-full h-full object-contain rounded-lg" />
                                            ) : (
                                                <div className="relative overflow-hidden w-full h-full flex items-center justify-center">
                                                    {status === 'shattering' && (
                                                        <div className="absolute inset-0 z-50 grid grid-cols-8 grid-rows-8">
                                                            {Array.from({ length: 64 }).map((_, i) => (
                                                                <motion.div
                                                                    key={i}
                                                                    initial={{ scale: 1, opacity: 1 }}
                                                                    animate={{
                                                                        scale: [1, 3, 0],
                                                                        opacity: [1, 1, 0],
                                                                        rotate: Math.random() * 1000,
                                                                        x: (Math.random() - 0.5) * 1500,
                                                                        y: (Math.random() - 0.5) * 1500
                                                                    }}
                                                                    transition={{ duration: 1.5, ease: 'easeOut' }}
                                                                    className="bg-stone-950 border border-white/20 shadow-2xl"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                    <motion.img
                                                        animate={{ filter: status === 'exploded' ? 'brightness(0)' : 'none' }}
                                                        src={revealFull ? currentMemory.full : currentMemory.cropped}
                                                        alt="Memory"
                                                        className="max-h-[550px] w-auto h-auto object-contain rounded-lg border border-white/5"
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Glass reflection overlay */}
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent z-10" />
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* KEY ENTRY SECTION (PURE BLACK) */}
                    <div className="bg-black p-12 rounded-[3.5rem] border-2 border-stone-900 shadow-2xl flex flex-col justify-center">
                        <div className="mb-12 border-b border-stone-900 pb-8">
                            <p className="text-[10px] font-black text-stone-600 uppercase tracking-[0.6em] mb-4">Neural Data Matrix</p>
                            <h2 className="text-white font-serif italic text-3xl">Decipher Memory {currentIdx + 1}</h2>
                        </div>

                        <div className="space-y-4">
                            {currentMemory.options.map((option, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={status === 'active' ? { x: 12, backgroundColor: '#080808', borderColor: '#444' } : {}}
                                    onClick={() => handleAnswer(i)}
                                    disabled={status !== 'active'}
                                    className={`
                                        w-full p-8 text-left rounded-3xl border-2 transition-all group relative overflow-hidden
                                        ${status === 'active' ? 'border-stone-900 text-stone-500 hover:text-white' :
                                            i === currentMemory.correct ? 'border-green-500 bg-green-500/10 text-green-400' :
                                                'border-stone-950 text-stone-800 opacity-20'}
                                    `}
                                >
                                    <div className="relative z-10 flex items-center gap-6">
                                        <span className="w-10 h-10 rounded-xl border border-stone-800 bg-stone-900 flex items-center justify-center font-mono text-xs text-stone-500">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="font-sans font-medium tracking-tight text-base">{option}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </motion.button>
                            ))}
                        </div>

                        {/* Progress Meter */}
                        <div className="mt-16 bg-stone-950 p-6 rounded-3xl border border-stone-900">
                            <div className="flex justify-between text-[10px] font-black text-stone-700 uppercase tracking-widest mb-4">
                                <span>Integration Score</span>
                                <span>{Math.round((score / 10) * 100)}%</span>
                            </div>
                            <div className="flex gap-2 h-1.5">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <div key={i} className={`flex-grow rounded-full transition-all duration-700 ${i === currentIdx ? 'bg-white shadow-[0_0_10px_white]' : i < currentIdx ? 'bg-stone-600' : 'bg-stone-900'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Day4Challenge;
