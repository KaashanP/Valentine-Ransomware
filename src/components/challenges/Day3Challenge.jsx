import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Heart, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const Day3Challenge = ({ onComplete }) => {
    const [isListening, setIsListening] = useState(false);
    const [wordsFound, setWordsFound] = useState(new Set());
    const [currentWord, setCurrentWord] = useState("");
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);

    const TARGET_COUNT = 20;

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const result = event.results[i][0].transcript.toLowerCase().trim();
                    if (event.results[i].isFinal) {
                        processWords(result);
                    } else {
                        interimTranscript += result;
                    }
                }
                setTranscript(interimTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech Recognition Error:", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                if (isListening) recognitionRef.current.start();
            };
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [isListening]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            if (!recognitionRef.current) {
                alert("Speech Recognition is not supported in this browser. Try Chrome.");
                return;
            }
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const processWords = (text) => {
        const words = text.split(/\s+/);
        words.forEach(word => {
            // Simple logic: if it's longer than 3 chars and not already found, count it as an adjective for this demo
            // In a real app, you might use a dictionary or NLP, but for a romantic game, 
            // let's just accept unique words that feel meaningful.
            if (word.length > 3 && !wordsFound.has(word)) {
                setWordsFound(prev => {
                    const next = new Set(prev);
                    next.add(word);
                    if (next.size === TARGET_COUNT) {
                        handleComplete();
                    }
                    return next;
                });
                setCurrentWord(word);
                setTimeout(() => setCurrentWord(""), 2000);
            }
        });
    };

    const handleComplete = () => {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.7 },
            colors: ['#ff69b4', '#ff1493', '#00ff00']
        });
    };

    const progress = Math.min((wordsFound.size / TARGET_COUNT) * 100, 100);
    const plantSize = 0.5 + (wordsFound.size / TARGET_COUNT) * 1.5;

    return (
        <div className="max-w-2xl mx-auto p-8 border-2 border-gray-800 bg-gray-900/90 rounded-2xl shadow-2xl flex flex-col items-center text-center overflow-hidden">
            <div className="mb-6">
                <h2 className="text-2xl font-black text-pink-500 uppercase tracking-tighter flex items-center gap-2">
                    Protocol 3: Nurture Core
                </h2>
                <p className="text-gray-400 text-sm mt-2 italic">
                    "A relationship only blooms with kind words. Speak 20 adjectives that describe your love."
                </p>
            </div>

            {/* The Plant Container */}
            <div className="relative h-64 w-full flex items-center justify-center mb-8">
                <motion.div
                    animate={{
                        scale: plantSize,
                        rotate: wordsFound.size % 2 === 0 ? [0, 2, 0] : [0, -2, 0]
                    }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    {/* Simple SVG Plant */}
                    <svg width="100" height="150" viewBox="0 0 100 150">
                        <path d="M50 150 V50" stroke="#4a2c2a" strokeWidth="8" />
                        <motion.path
                            d="M50 100 Q 20 80 50 60"
                            fill="#22c55e"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: wordsFound.size > 5 ? 1 : 0 }}
                        />
                        <motion.path
                            d="M50 120 Q 80 100 50 80"
                            fill="#22c55e"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: wordsFound.size > 10 ? 1 : 0 }}
                        />
                        {/* The Flower (Blooms at the end) */}
                        {wordsFound.size >= TARGET_COUNT && (
                            <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                                <circle cx="50" cy="50" r="15" fill="#f43f5e" />
                                <circle cx="50" cy="30" r="10" fill="#f43f5e" />
                                <circle cx="50" cy="70" r="10" fill="#f43f5e" />
                                <circle cx="30" cy="50" r="10" fill="#f43f5e" />
                                <circle cx="70" cy="50" r="10" fill="#f43f5e" />
                                <circle cx="50" cy="50" r="5" fill="#fbbf24" />
                            </motion.g>
                        )}
                    </svg>

                    <AnimatePresence>
                        {currentWord && (
                            <motion.div
                                initial={{ opacity: 0, y: 0 }}
                                animate={{ opacity: 1, y: -50 }}
                                exit={{ opacity: 0 }}
                                className="absolute top-0 left-1/2 -translate-x-1/2 text-pink-400 font-bold text-xl whitespace-nowrap"
                            >
                                + {currentWord}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Progress Stats */}
            <div className="w-full mb-8">
                <div className="flex justify-between text-xs font-mono mb-1">
                    <span>BLOOM_LEVEL: {wordsFound.size}/{TARGET_COUNT}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700">
                    <motion.div
                        className="h-full bg-pink-500 shadow-[0_0_10px_#ff69b4]"
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-4 w-full">
                {wordsFound.size < TARGET_COUNT ? (
                    <>
                        <button
                            onClick={toggleListening}
                            className={`
                p-6 rounded-full transition-all duration-300 shadow-xl
                ${isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-500/50' : 'bg-pink-600 hover:bg-pink-500'}
              `}
                        >
                            {isListening ? <MicOff size={32} strokeWidth={3} /> : <Mic size={32} strokeWidth={3} />}
                        </button>
                        <div className="text-sm font-mono text-gray-400">
                            {isListening ? "LISTENING..." : "TAP MIC TO START SPEAKING"}
                        </div>
                        {transcript && (
                            <div className="text-xs text-gray-500 mt-2 px-4 py-1 border border-gray-800 rounded">
                                Detection Buffer: <span className="text-gray-400 italic">"{transcript}"</span>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="w-full animate-in slide-in-from-bottom duration-500">
                        <div className="flex items-center justify-center gap-2 text-green-400 mb-4 font-black tracking-widest uppercase">
                            <CheckCircle size={24} />
                            <span>HEART CALIBRATION COMPLETE</span>
                        </div>
                        <button
                            onClick={onComplete}
                            className="w-full py-4 bg-green-600 text-black font-black rounded hover:bg-green-500 transition-all uppercase shadow-lg shadow-green-500/20"
                        >
                            COMMIT & CONTINUE
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto w-full p-2 bg-black/30 rounded">
                {Array.from(wordsFound).map(w => (
                    <span key={w} className="px-2 py-1 bg-gray-800 text-pink-400 text-[10px] rounded border border-gray-700">
                        {w}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Day3Challenge;
