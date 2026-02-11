import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Heart, Activity, Keyboard, Sparkles, Snowflake, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

const ADJECTIVE_WHITELIST = [
    'passionate', 'beautiful', 'magical', 'secure', 'everlasting', 'kind', 'strong', 'peaceful', 'endless',
    'adventurous', 'sweet', 'special', 'real', 'comforting', 'exciting', 'pure', 'deep', 'steady', 'rare',
    'heartfelt', 'eternal', 'loyal', 'honest', 'brave', 'unique', 'bright', 'warm', 'infinite', 'true',
    'perfect', 'dreamy', 'divine', 'sacred', 'joyful', 'tender', 'graceful', 'radiant', 'serene', 'soulful',
    'vibrant', 'precious', 'bold', 'gentle', 'caring', 'devoted', 'inspiring', 'charming', 'lovely',
    'beloved', 'adored', 'treasured', 'wondrous', 'epic', 'relentless', 'unconditional', 'timeless',
    'intense', 'harmonious', 'blissful', 'fun', 'stable', 'homely', 'genuine'
];

const STAGES = {
    SYNC: 1,
    BREATHE: 2,
    VOCALIZE: 3,
    ILLUMINATE: 4
};

const FROST_COUNT = 300;

const Day3Challenge = ({ onComplete }) => {
    const [currentStage, setCurrentStage] = useState(STAGES.SYNC);
    const [progress, setProgress] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [wordsFound, setWordsFound] = useState(new Set());
    const [manualInput, setManualInput] = useState("");
    const [showManual, setShowManual] = useState(false);
    const [syncPulse, setSyncPulse] = useState(false);
    const [syncAccuracy, setSyncAccuracy] = useState(null);
    const [syncSuccesses, setSyncSuccesses] = useState(0);
    const [thawLevel, setThawLevel] = useState(0);

    // Stage 4 Logic
    const [boundariesTouched, setBoundariesTouched] = useState({ top: false, bottom: false, left: false, right: false });

    // Frost Particle State
    const [frostParticles, setFrostParticles] = useState(() =>
        Array.from({ length: FROST_COUNT }).map((_, i) => ({
            id: i,
            x: (Math.random() - 0.5) * 240,
            y: (Math.random() - 0.5) * 240,
            scale: Math.random() * 0.8 + 0.4,
            rotation: Math.random() * 360,
            opacity: 1,
            isBlown: false
        }))
    );

    // Stage 4 Motion Values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const solarX = useSpring(mouseX, { damping: 40, stiffness: 100 });
    const solarY = useSpring(mouseY, { damping: 40, stiffness: 100 });

    const containerRef = useRef(null);
    const recognitionRef = useRef(null);
    const streamRef = useRef(null);
    const analyserRef = useRef(null);
    const animationFrameRef = useRef(null);

    // --- STAGE 1: CARDIAC SYNC ---
    useEffect(() => {
        let interval;
        if (currentStage === STAGES.SYNC) {
            interval = setInterval(() => {
                setSyncPulse(true);
                setTimeout(() => setSyncPulse(false), 300);
            }, 1200);
        }
        return () => clearInterval(interval);
    }, [currentStage]);

    const handleSyncTap = () => {
        if (currentStage !== STAGES.SYNC) return;
        if (syncPulse) {
            setSyncAccuracy("PERFECT_SYNC");
            setSyncSuccesses(prev => {
                const next = prev + 1;
                // STAGE 1 REQUIREMENT: 7 SUCCESSES
                if (next >= 7) setTimeout(() => transitionToStage(STAGES.BREATHE), 800);
                return next;
            });
        } else {
            setSyncAccuracy("OUT_OF_SYNC");
            setSyncSuccesses(0);
        }
        setTimeout(() => setSyncAccuracy(null), 600);
    };

    // --- STAGE 2: FROST PHYSICS ---
    useEffect(() => {
        if (currentStage === STAGES.BREATHE) {
            startMicDetection();
        } else {
            stopMicDetection();
        }
        return () => stopMicDetection();
    }, [currentStage]);

    const stopMicDetection = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    };

    const startMicDetection = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 512;
            source.connect(analyser);
            analyserRef.current = analyser;

            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            const updateFrost = () => {
                if (!analyserRef.current || currentStage !== STAGES.BREATHE) return;
                analyserRef.current.getByteFrequencyData(dataArray);
                const volume = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;

                // STAGE 2: VOLUME THRESHOLD REDUCED TO 50 (Slightly easier)
                if (volume > 50) {
                    setFrostParticles(prev => {
                        const next = prev.map(p => {
                            if (p.isBlown) return p;
                            // STAGE 2: PROBABILITY INCREASED (Slightly easier)
                            if (Math.random() < (volume - 50) / 250) {
                                return { ...p, isBlown: true, vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20 };
                            }
                            return p;
                        });

                        const blownCount = next.filter(p => p.isBlown).length;
                        const newThawLevel = (blownCount / FROST_COUNT) * 100;
                        setThawLevel(newThawLevel);

                        if (newThawLevel >= 100) {
                            setTimeout(() => transitionToStage(STAGES.VOCALIZE), 1000);
                        }
                        return next;
                    });
                }
                animationFrameRef.current = requestAnimationFrame(updateFrost);
            };
            updateFrost();
        } catch (err) {
            console.error("Mic error", err);
        }
    };

    // --- STAGE 3: SATURATION RECOVERY ---
    useEffect(() => {
        if (currentStage === STAGES.VOCALIZE) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'en-US';

                recognitionRef.current.onresult = (event) => {
                    let fullTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        fullTranscript += event.results[i][0].transcript.toLowerCase();
                    }
                    ADJECTIVE_WHITELIST.forEach(word => {
                        if (fullTranscript.includes(word) && !wordsFound.has(word)) {
                            addWord(word);
                        }
                    });
                };
            }
        }
    }, [currentStage]);

    const addWord = (word) => {
        setWordsFound(prev => {
            const next = new Set(prev);
            if (next.has(word)) return prev;
            next.add(word);
            if (next.size >= 10) {
                if (recognitionRef.current) recognitionRef.current.stop();
                setIsListening(false);
                setTimeout(() => transitionToStage(STAGES.ILLUMINATE), 1000);
            }
            return next;
        });
    };

    // --- STAGE 4: SOLAR BLOOM ENGINE ---
    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // STAGE 4: SENSITIVITY ADJUSTED TO 0.5
        const sensitivity = 0.5;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const realX = e.clientX - rect.left - centerX;
        const realY = e.clientY - rect.top - centerY;

        const dampedX = realX * sensitivity;
        const dampedY = realY * sensitivity;

        mouseX.set(dampedX);
        mouseY.set(dampedY);

        if (currentStage === STAGES.ILLUMINATE) {
            // STAGE 4: BOUNDARY TRACKING
            const threshold = 130;

            setBoundariesTouched(prev => {
                const next = { ...prev };
                if (dampedY < -threshold) next.top = true;
                if (dampedY > threshold) next.bottom = true;
                if (dampedX < -threshold) next.left = true;
                if (dampedX > threshold) next.right = true;
                return next;
            });

            const allTouched = boundariesTouched.top && boundariesTouched.bottom && boundariesTouched.left && boundariesTouched.right;
            const distance = Math.sqrt(dampedX ** 2 + dampedY ** 2);

            if (allTouched) {
                // If all boundaries touched, allow completion ONLY at center
                if (distance < 40) {
                    setProgress(prev => {
                        const next = Math.min(prev + 1.5, 100);
                        if (next >= 100) handleFinalComplete();
                        return next;
                    });
                } else {
                    setProgress(Math.max(progress, 75));
                }
            } else {
                // Progress based on how many boundaries touched
                const count = Object.values(boundariesTouched).filter(v => v).length;
                setProgress(count * 15);
            }
        }
    };

    const transitionToStage = (next) => {
        setCurrentStage(next);
        setProgress(0);
    };

    const handleFinalComplete = () => {
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 }, colors: ['#f87171', '#d1d5db', '#ffffff'] });
        setTimeout(onComplete, 3000);
    };

    const getHeartFilter = () => {
        if (currentStage === STAGES.VOCALIZE) {
            const sat = wordsFound.size * 10;
            return `grayscale(${100 - sat}%) saturate(${0.5 + sat / 50}) brightness(${0.7 + sat / 40})`;
        }
        return 'none';
    };

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="max-w-4xl mx-auto p-12 bg-[#FAF9F6] border border-stone-200 rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.05)] flex flex-col items-center overflow-hidden relative min-h-[850px]"
        >
            <div className="absolute inset-0 pointer-events-none opacity-40">
                <div className="absolute top-0 -left-60 w-[800px] h-[800px] bg-amber-50 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 -right-60 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[150px]" />
            </div>

            <div className="z-50 w-full flex justify-between items-start mb-16 relative">
                <div className="text-left">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity size={12} className="text-stone-300" />
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em]">Cardiac Protocol 03</span>
                    </div>
                    <h2 className="text-4xl font-serif italic text-stone-800 tracking-tight leading-none bg-clip-text">
                        {currentStage === STAGES.SYNC && "Harmonic resonance"}
                        {currentStage === STAGES.BREATHE && "Cryogenic Defrost"}
                        {currentStage === STAGES.VOCALIZE && "Vitality Infusion"}
                        {currentStage === STAGES.ILLUMINATE && "Solar Awakening"}
                    </h2>
                </div>
                <div className="flex gap-2 p-2 bg-white/60 border border-stone-100 rounded-full shadow-sm backdrop-blur-xl">
                    {[1, 2, 3, 4].map(s => (
                        <motion.div
                            key={s}
                            animate={{
                                width: s === currentStage ? 44 : 10,
                                backgroundColor: s <= currentStage ? "#f87171" : "#E5E7EB"
                            }}
                            className="h-2 rounded-full transition-all duration-1000"
                        />
                    ))}
                </div>
            </div>

            <div className="relative flex-grow w-full flex items-center justify-center">
                <AnimatePresence>
                    {syncAccuracy && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: -50 }}
                            className="absolute top-0 font-serif italic text-stone-500 text-lg tracking-widest pointer-events-none"
                        >
                            {syncAccuracy.replace("_", " ")}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative w-[400px] h-[400px] flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center" onClick={handleSyncTap}>
                        <motion.img
                            src="/assets/heart_glossy.png"
                            alt="3D Heart"
                            className="w-[300px] h-[300px] object-contain cursor-pointer relative z-30 transition-all duration-1000"
                            animate={currentStage === STAGES.SYNC ? { scale: syncPulse ? 1.08 : 1 } : { scale: 1 }}
                            style={{
                                filter: getHeartFilter(),
                                mixBlendMode: 'multiply'
                            }}
                        />

                        <div className="absolute inset-0 z-40 pointer-events-none overflow-visible">
                            {frostParticles.map(p => (
                                <motion.div
                                    key={p.id}
                                    initial={false}
                                    animate={p.isBlown ? {
                                        x: p.vx * 40,
                                        y: p.vy * 40,
                                        opacity: 0,
                                        scale: 0.2,
                                        rotate: p.rotation + 180
                                    } : {
                                        x: p.x,
                                        y: p.y,
                                        opacity: p.opacity,
                                        scale: p.scale,
                                        rotate: p.rotation
                                    }}
                                    transition={p.isBlown ? { duration: 1, ease: "easeOut" } : { duration: 0.3 }}
                                    className="absolute left-1/2 top-1/2"
                                >
                                    <Sparkles size={20} className="text-sky-100/80 drop-shadow-sm" />
                                </motion.div>
                            ))}
                        </div>

                        {currentStage === STAGES.SYNC && (
                            <AnimatePresence>
                                {syncPulse && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1.6, opacity: 0.4 }}
                                        exit={{ scale: 2, opacity: 0 }}
                                        className="absolute w-[300px] h-[300px] border-2 border-red-200 rounded-full z-10"
                                    />
                                )}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {currentStage === STAGES.ILLUMINATE && (
                    <motion.div
                        style={{ x: solarX, y: solarY }}
                        className="absolute z-50 pointer-events-none flex items-center justify-center"
                    >
                        <div className="w-48 h-48 bg-amber-200/20 rounded-full blur-[40px] border border-amber-100/10" />
                        <div className="w-10 h-10 bg-amber-50 rounded-full shadow-[0_0_30px_rgba(251,191,36,0.6)] border border-white" />
                        <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute w-20 h-20 border border-amber-200/40 rounded-full"
                        />
                    </motion.div>
                )}
            </div>

            <div className="z-50 w-full max-w-xl mb-12 relative">
                <AnimatePresence mode="wait">
                    {currentStage === STAGES.VOCALIZE ? (
                        <motion.div
                            key="voc_ui"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-wrap justify-center gap-2 p-6 bg-white border border-stone-100 rounded-[2.5rem] h-28 overflow-y-auto shadow-inner no-scrollbar">
                                {Array.from(wordsFound).map(word => (
                                    <motion.span
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        key={word} className="px-5 py-2 bg-red-400/5 border border-red-200 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                                {wordsFound.size === 0 && <span className="text-stone-300 text-[11px] uppercase tracking-[0.3em] italic pt-6">Awaiting affections...</span>}
                            </div>

                            <div className="flex gap-6 justify-center">
                                <button
                                    onClick={() => {
                                        if (isListening) recognitionRef.current.stop();
                                        else recognitionRef.current.start();
                                        setIsListening(!isListening);
                                    }}
                                    className={`p-9 rounded-[2rem] transition-all border-2 ${isListening ? 'bg-red-50 border-red-200 text-red-500 shadow-xl' : 'bg-white border-stone-100 text-stone-300 hover:text-stone-500 shadow-sm'}`}
                                >
                                    {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                                </button>
                                <button
                                    onClick={() => setShowManual(!showManual)}
                                    className="p-9 rounded-[2rem] bg-white border-2 border-stone-100 text-stone-300 hover:text-stone-500 shadow-sm"
                                >
                                    <Keyboard size={28} />
                                </button>
                            </div>

                            {showManual && (
                                <motion.form
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    onSubmit={(e) => { e.preventDefault(); const clean = manualInput.toLowerCase().trim(); if (ADJECTIVE_WHITELIST.includes(clean)) addWord(clean); setManualInput(""); }}
                                    className="flex gap-2 p-3 bg-white border border-stone-100 rounded-3xl shadow-2xl"
                                >
                                    <input
                                        type="text"
                                        value={manualInput}
                                        onChange={(e) => setManualInput(e.target.value)}
                                        placeholder="Biological Calibration..."
                                        className="flex-grow bg-transparent border-none text-stone-700 font-serif italic text-sm px-4 focus:ring-0"
                                    />
                                    <button className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black">Add</button>
                                </motion.form>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="inst_ui"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/40 border border-stone-100 p-12 rounded-[3.5rem] shadow-sm backdrop-blur-3xl"
                        >
                            <div className="flex items-center gap-3 mb-4 justify-center">
                                <AlertCircle size={14} className="text-stone-400" />
                                <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.5em]">System status</span>
                            </div>
                            <h3 className="text-2xl font-serif italic text-stone-800 leading-relaxed px-6">
                                {currentStage === STAGES.SYNC && "Align your rhythmic pulses with the center heart."}
                                {currentStage === STAGES.BREATHE && "The heart is frosted over. Blow to scatter the crystals."}
                                {currentStage === STAGES.ILLUMINATE && "The spark is ready. Guide the solar light back to the core."}
                            </h3>
                            {currentStage === STAGES.ILLUMINATE && (
                                <div className="mt-4 flex justify-center gap-4">
                                    <span className={`text-[9px] font-bold uppercase p-1 px-2 rounded ${boundariesTouched.top ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400'}`}>T</span>
                                    <span className={`text-[9px] font-bold uppercase p-1 px-2 rounded ${boundariesTouched.bottom ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400'}`}>B</span>
                                    <span className={`text-[9px] font-bold uppercase p-1 px-2 rounded ${boundariesTouched.left ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400'}`}>L</span>
                                    <span className={`text-[9px] font-bold uppercase p-1 px-2 rounded ${boundariesTouched.right ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-400'}`}>R</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 left-12 right-12 z-50">
                <div className="flex justify-between items-end mb-4 border-b border-stone-100 pb-3">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-stone-300 uppercase tracking-widest mb-1">Calibration Vector</p>
                        <span className="text-sm font-serif italic text-stone-500">Stage 0{currentStage} / 04</span>
                    </div>
                    <span className="text-sm text-red-500 font-mono">
                        {currentStage === STAGES.VOCALIZE && `${wordsFound.size * 10}%`}
                        {currentStage === STAGES.BREATHE && `${Math.round(thawLevel)}%`}
                        {currentStage === STAGES.SYNC && `${Math.round(syncSuccesses * 14.28)}%`}
                        {currentStage === STAGES.ILLUMINATE && `${Math.round(progress)}%`}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-stone-100/50 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className="h-full bg-red-400"
                        animate={{
                            width: currentStage === STAGES.VOCALIZE ? `${wordsFound.size * 10}%` : (currentStage === STAGES.BREATHE ? `${thawLevel}%` : (currentStage === STAGES.SYNC ? `${syncSuccesses * 14.28}%` : `${progress}%`))
                        }}
                    />
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default Day3Challenge;
