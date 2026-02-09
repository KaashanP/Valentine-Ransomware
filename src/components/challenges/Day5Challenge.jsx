import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Heart, CheckCircle, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const EMOJIS = [
    { emoji: "😊", label: "Cute & Happy", context: "I have a beautiful girlfriend who has the cutest laugh..." },
    { emoji: "😠", label: "Angry/Grumpy", context: "But sometimes I do silly things that hurt her and she gets super mad..." },
    { emoji: "🥺", label: "Sad/Pouty", context: "Then she cries at times (and it breaks my heart)..." },
    { emoji: "😘", label: "Loving/Happy", context: "But then I somehow manage to cheer her up and she is back to happy loving again!" },
    { emoji: "🤩", label: "Excited", context: "And together, we are ready for another year of madness and love." }
];

const Day5Challenge = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [capturedPhotos, setCapturedPhotos] = useState([]); // Array of dataURLs
    const [showStory, setShowStory] = useState(false);
    const [storyStep, setStoryStep] = useState(0);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streamActive, setStreamActive] = useState(false);

    useEffect(() => {
        if (!showStory) {
            startCamera();
        }
        return () => stopCamera();
    }, [showStory, currentStep]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
            }
        } catch (err) {
            console.error("Camera Error:", err);
            // Fallback for demo: just simulate capture
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const capturePhoto = () => {
        if (canvasRef.current && videoRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvasRef.current.toDataURL('image/png');

            const newPhotos = [...capturedPhotos, dataUrl];
            setCapturedPhotos(newPhotos);

            if (currentStep < EMOJIS.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                stopCamera();
                setShowStory(true);
            }
        } else {
            // Fallback simulation
            const fakeUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentStep}`;
            const newPhotos = [...capturedPhotos, fakeUrl];
            setCapturedPhotos(newPhotos);
            if (currentStep < EMOJIS.length - 1) {
                setCurrentStep(currentStep + 1);
            } else {
                setShowStory(true);
            }
        }
    };

    const nextStoryStep = () => {
        if (storyStep < EMOJIS.length - 1) {
            setStoryStep(storyStep + 1);
        } else {
            confetti();
            // onComplete(); // Wait for them to click a final button
        }
    };

    if (showStory) {
        const isLast = storyStep === EMOJIS.length - 1;
        return (
            <div className="max-w-2xl mx-auto p-8 border-2 border-pink-500 bg-black rounded-2xl shadow-2xl flex flex-col items-center text-center">
                <h2 className="text-xl font-bold text-pink-500 mb-8 uppercase tracking-widest flex items-center gap-2">
                    <Heart size={20} fill="currentColor" /> DATA RECOVERY: STORY ARCHIVE
                </h2>

                <motion.div
                    key={storyStep}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full aspect-video rounded-lg overflow-hidden border-4 border-gray-800 mb-8"
                >
                    <img src={capturedPhotos[storyStep]} alt="Story" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 bg-black/60 backdrop-blur-sm">
                        <p className="text-lg font-medium text-white shadow-black drop-shadow-md">
                            {EMOJIS[storyStep].context}
                        </p>
                    </div>
                </motion.div>

                {!isLast ? (
                    <button
                        onClick={nextStoryStep}
                        className="px-8 py-3 bg-pink-600 text-white font-bold rounded-full hover:bg-pink-500 transition-all flex items-center gap-2"
                    >
                        NEXT PAGE <Heart size={16} />
                    </button>
                ) : (
                    <div className="w-full flex flex-col gap-4">
                        <div className="text-green-400 font-bold mb-2 uppercase animate-pulse">
                            STORY SYNC COMPLETE. EMOTIONAL ACCESS GRANTED.
                        </div>
                        <button
                            onClick={onComplete}
                            className="px-8 py-4 bg-green-600 text-black font-black rounded hover:bg-green-500 transition-all uppercase tracking-tighter"
                        >
                            FINAL PROTOCOL UNLOCKED &rarr;
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-900/90 border-2 border-gray-800 rounded-2xl shadow-2xl relative flex flex-col items-center">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-black text-pink-400 uppercase tracking-tighter flex items-center justify-center gap-2">
                    Protocol 5: Emote Capture
                </h2>
                <p className="text-gray-400 text-sm mt-2 italic">
                    "The system needs visual confirmation of your emotional range. Mirror the target emoji."
                </p>
            </div>

            <div className="relative w-full max-w-md aspect-square rounded-full overflow-hidden border-4 border-gray-800 mb-8 bg-black flex items-center justify-center">
                {streamActive ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-700">
                        <Camera size={64} />
                        <p className="text-xs">CAMERA OFFLINE // CLICK CAPTURE TO SIMULATE</p>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />

                {/* Emoji Overlay */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full w-20 h-20 flex items-center justify-center text-4xl border border-white/30 shadow-2xl">
                    {EMOJIS[currentStep].emoji}
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] px-3 py-1 rounded tracking-widest uppercase border border-white/20">
                    Target: {EMOJIS[currentStep].label}
                </div>
            </div>

            <button
                onClick={capturePhoto}
                className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center border-8 border-gray-800 hover:bg-pink-500 hover:scale-110 active:scale-90 transition-all shadow-2xl"
            >
                <Camera size={32} className="text-white" />
            </button>

            <div className="mt-8 flex gap-2">
                {EMOJIS.map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full border border-gray-700 ${i < currentStep ? 'bg-green-500' : i === currentStep ? 'bg-pink-500 animate-pulse' : 'bg-gray-800'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Day5Challenge;
