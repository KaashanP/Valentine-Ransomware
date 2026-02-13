import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, RefreshCw, Volume2, VolumeX, Sparkles, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

const POSES = [
    { emoji: "😋", label: "Yum Face", instruction: "Mimic the sweetness of our first talk", context: "The Sweet First Talk (Insomnia Cookies)" },
    { emoji: "💄", label: "Mirror Glam", instruction: "Checking yourself out in the mirror", context: "The Adorable Mirror Habit" },
    { emoji: "💅", label: "Diva Face", instruction: "Show off that Pier 39 energy", context: "The Pier 39 Magic" },
    { emoji: "🙄", label: "Eye Roll", instruction: "When I say I love you more...", context: "The 'Love U More' Argument" },
    { emoji: "🥱", label: "Morning Yawn", instruction: "That 'just woke up' face on call", context: "The Morning Connection" },
    { emoji: "🫰", label: "Finger Heart", instruction: "Sorted every fight before bed", context: "The Truce & The Heart" },
    { emoji: "🤭", label: "Giggle", instruction: "Cover your mouth (The real baby!)", context: "The Baby of the Relationship" },
    { emoji: "😤", label: "The Pout", instruction: "Official 'Katti Kaashuu' expression", context: "Katti Kaashuu..." },
    { emoji: "🥺", label: "Puppy Eyes", instruction: "The face I can never say no to", context: "The 'Pweessh' Power" },
    { emoji: "🫡", label: "The Salute", instruction: "Ready for our future together?", context: "Accepting Our Future" }
];

const Day5Challenge = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [capturedPhotos, setCapturedPhotos] = useState([]);
    const [status, setStatus] = useState('intro'); // intro, capturing, synthesizing, montage
    const [streamActive, setStreamActive] = useState(false);
    const [montageIdx, setMontageIdx] = useState(0);
    const [isMuted, setIsMuted] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const audioRef = useRef(null);

    // Initial Montage Audio (Romantic Placeholder - should be replaced by real asset)
    const ROMANTIC_MUSIC = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3"; // Instrumental romance

    useEffect(() => {
        if (status === 'capturing') {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [status]);

    useEffect(() => {
        if (status === 'montage') {
            const timer = setInterval(() => {
                setMontageIdx(prev => {
                    if (prev < POSES.length - 1) return prev + 1;
                    return prev; // Stay on last image or loop? User said finish Day 5.
                });
            }, 10000); // 10 seconds per image per user request
            return () => clearInterval(timer);
        }
    }, [status]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1080 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setStreamActive(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const capturePhoto = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;

            // Mirror flip for natural selfie feel
            context.save();
            context.scale(-1, 1);
            context.drawImage(videoRef.current, -canvasRef.current.width, 0);
            context.restore();

            const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.8);
            const newPhotos = [...capturedPhotos, dataUrl];
            setCapturedPhotos(newPhotos);

            if (currentStep < POSES.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setStatus('synthesizing');
                setTimeout(() => setStatus('montage'), 4000);
            }
        } else {
            // Fallback for no camera
            const newPhotos = [...capturedPhotos, `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStep}`];
            setCapturedPhotos(newPhotos);
            if (currentStep < POSES.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setStatus('synthesizing');
                setTimeout(() => setStatus('montage'), 4000);
            }
        }
    };

    if (status === 'intro') {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto p-12 bg-black border-2 border-stone-900 rounded-[4rem] text-center shadow-[0_40px_100px_rgba(255,105,180,0.1)]">
                <div className="w-24 h-24 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-pink-500/20">
                    <Camera className="text-pink-500 w-10 h-10" />
                </div>
                <h1 className="text-5xl font-serif italic text-white mb-6">Emotional Calibration</h1>
                <p className="text-stone-400 text-xl leading-relaxed mb-12 max-w-xl mx-auto">
                    "The system requires an Organic Emotional Signature to unlock the final vault. Mirror the 10 core expressions of our journey."
                </p>
                <button onClick={() => setStatus('capturing')} className="w-full bg-white text-black py-8 rounded-full text-2xl font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-xl">
                    Initiate Capture
                </button>
            </motion.div>
        );
    }

    if (status === 'synthesizing') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-32 h-32 border-8 border-stone-900 border-t-pink-500 rounded-full mb-10 shadow-[0_0_50px_rgba(236,72,153,0.3)]" />
                <h2 className="text-4xl font-serif italic text-white mb-4">Compiling Emotional Archive...</h2>
                <p className="text-stone-500 uppercase tracking-[0.4em] text-sm">Syncing Neural Memory Layers</p>
                <div className="mt-12 w-64 h-2 bg-stone-900 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 4 }} className="h-full bg-pink-500" />
                </div>
            </div>
        );
    }

    if (status === 'montage') {
        const isDone = montageIdx === POSES.length - 1;
        return (
            <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-4">
                <audio ref={audioRef} src={ROMANTIC_MUSIC} autoPlay loop muted={isMuted} />

                <div className="absolute top-10 flex justify-between w-full px-12 items-center">
                    <div className="text-stone-500 uppercase tracking-[0.6em] text-[10px] font-black">Archive Playback: Emotional Sync</div>
                    <button onClick={() => setIsMuted(!isMuted)} className="p-4 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors">
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>

                <div className="relative w-full max-w-5xl aspect-[4/3] md:aspect-video rounded-[3rem] overflow-hidden border-8 border-stone-900 shadow-[0_0_100px_rgba(255,255,255,0.05)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={montageIdx}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img src={capturedPhotos[montageIdx]} alt="Memory" className="w-full h-full object-cover grayscale-[0.2]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                        </motion.div>
                    </AnimatePresence>

                    {/* Content Overlay */}
                    <div className="absolute bottom-16 left-16 right-16">
                        <motion.div
                            key={`text-${montageIdx}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1.5 }}
                            className="space-y-6"
                        >
                            <h3 className="text-pink-400 font-mono text-sm tracking-[0.5em] uppercase">{POSES[montageIdx].context}</h3>
                            <p className="text-4xl md:text-6xl font-serif italic text-white leading-tight max-w-3xl">
                                {POSES[montageIdx].instruction}
                            </p>
                        </motion.div>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 h-1.5 w-full bg-white/10">
                        <motion.div
                            key={`bar-${montageIdx}`}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 10, ease: "linear" }}
                            className="h-full bg-pink-500"
                        />
                    </div>
                </div>

                {isDone && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 group">
                        <button onClick={onComplete} className="bg-white text-black px-16 py-6 rounded-full text-xl font-black uppercase tracking-[0.4em] hover:bg-pink-500 hover:text-white transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-4">
                            Unlock The Final Vault <Heart className="fill-current" />
                        </button>
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center lg:items-center min-h-[85vh]">

            <div className="flex-1 w-full text-center lg:text-left space-y-8">
                <div className="inline-flex items-center gap-4 px-6 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full">
                    <Sparkles className="text-pink-500 w-4 h-4" />
                    <span className="text-pink-500 text-[10px] font-black uppercase tracking-[0.4em]">Neural Calibration Active</span>
                </div>

                {/* DYNAMIC POSE HEADER */}
                <div className="space-y-4">
                    <motion.h2 key={currentStep} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-6xl md:text-7xl font-serif italic text-white">
                        Next Pose: <br />
                        <span className="text-pink-500 not-italic font-sans font-black uppercase tracking-tighter">
                            {POSES[currentStep].label} {POSES[currentStep].emoji}
                        </span>
                    </motion.h2>
                    <p className="text-stone-500 text-xl font-medium tracking-tight">
                        {POSES[currentStep].instruction}
                    </p>
                </div>

                <div className="pt-8 flex gap-3">
                    {POSES.map((_, i) => (
                        <div key={i} className={`h-1.5 flex-grow rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-stone-900'}`} />
                    ))}
                </div>
            </div>

            {/* SKEUOMORPHIC CAMERA SECTION */}
            <div className="lg:w-[650px] w-full relative">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="relative aspect-square bg-[#0a0a0a] border-[16px] border-[#1a1a1a] rounded-[4rem] shadow-[0_80px_120px_rgba(0,0,0,1),inset_0_4px_20px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                    {/* Viewfinder Overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none border-[40px] border-black/20" />
                    <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-white/30 rounded-tl-2xl z-20" />
                    <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-white/30 rounded-tr-2xl z-20" />
                    <div className="absolute bottom-10 left-10 w-12 h-12 border-b-4 border-l-4 border-white/30 rounded-bl-2xl z-20" />
                    <div className="absolute bottom-10 right-10 w-12 h-12 border-b-4 border-r-4 border-white/30 rounded-br-2xl z-20" />

                    {/* Camera Feed */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        {streamActive ? (
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
                        ) : (
                            <div className="flex flex-col items-center gap-6 text-stone-800">
                                <RefreshCw className="w-16 h-16 animate-spin-slow opacity-20" />
                                <p className="text-[10px] uppercase tracking-[0.5em] font-black">Camera Initializing...</p>
                            </div>
                        )}
                    </div>

                    {/* REC Indicator */}
                    <div className="absolute top-12 left-12 flex items-center gap-3 z-30">
                        <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-3 h-3 rounded-full bg-red-600" />
                        <span className="text-white text-[11px] font-mono tracking-widest font-bold">REC 00:0{currentStep}:05</span>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                </motion.div>

                {/* Shutter Button Section */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
                    <button
                        onClick={capturePhoto}
                        className="w-24 h-24 bg-white rounded-full border-[10px] border-[#1a1a1a] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
                    >
                        <div className="w-16 h-16 bg-pink-500 rounded-full group-hover:bg-pink-400 transition-colors" />
                    </button>
                    <span className="text-stone-500 font-mono text-[10px] uppercase font-black">Capture Pose</span>
                </div>
            </div>

        </div>
    );
};

export default Day5Challenge;
