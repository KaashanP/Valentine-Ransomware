import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const QUESTIONS = [
    { id: 1, text: "Where was our very first date?", options: ["Thai Fusion", "The Barrel House", "KoFusion", "Japan House"], answer: 1 },
    { id: 2, text: "What is Kashu's favourite Cuisine?", options: ["Italian", "Sushi", "American (Cheeseburger)", "Indian"], answer: 2 },
    { id: 3, text: "What is Kashu's favouritest feature of Ishu?", options: ["Eyes", "Butt", "Boobies", "Every single Atom of Ishu's body"], answer: 3 },
    { id: 4, text: "Which personality trait of Ishu does Kashu love the most?", options: ["Never give up attitude", "Yapping", "True to her identity and beliefs", "Immense love for the people she loves"], answer: "any" },
    { id: 5, text: "What emoji do I use the most when texting you?", options: ["❤️", "😘", "😠", "😭"], answer: 0 },
    { id: 6, text: "What colour pant did I wear when I asked you out?", options: ["Light Blue", "Black", "Beige", "Grey"], answer: 2 },
    { id: 7, text: "What is the one thing I am most scared of?", options: ["Cockroaches", "Snakes", "Losing my baby", "Ishu's anger"], answer: 2 },
    { id: 8, text: "Where was the first time I noticed you?", options: ["Class", "MTD", "Party in Daniels", "Ikenberry"], answer: 2 },
    { id: 9, text: "Where do I want to marry you?", options: ["Amalfi Coast", "Mumbai", "Venice", "Wherever your mom decides"], answer: 3 },
    { id: 10, text: "Who loves more?", options: ["Kashu", "Ishu", "Both same", "Neither, we just frens"], answer: 0 },
];

const Day1Challenge = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [shake, setShake] = useState(false);

    const handleAnswer = (index) => {
        const currentQ = QUESTIONS[currentStep];
        if (currentQ.answer === "any" || index === currentQ.answer) {
            setScore(s => s + 1);
            if (currentStep < QUESTIONS.length - 1) {
                setCurrentStep(s => s + 1);
            } else {
                finish();
            }
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            // Optional: reset or just move to next with wrong mark. 
            // User said they have to get 10 correct, so let's reset this specific question or the whole quiz?
            // Resetting the whole quiz is more "Ransomware" style.
            alert("INCORRECT PROTOCOL RESPONSE. RESTARTING VERIFICATION...");
            setCurrentStep(0);
            setScore(0);
        }
    };

    const finish = () => {
        setIsFinished(true);
        // MEGA Confetti explosion
        const duration = 10 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 100 * (timeLeft / duration);
            // Launch from multiple spots
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: 0.5, y: 0.5 } });
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() } });
        }, 200);
    };

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border-4 border-pink-500 bg-pink-900/40 rounded-3xl animate-in zoom-in relative overflow-hidden shadow-[0_0_100px_rgba(255,105,180,0.5)] scale-110">
                {/* Intense Heart Bouncing Background */}
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-bounce"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDuration: `${Math.random() * 1 + 0.5}s`,
                                animationDelay: `${Math.random() * 3}s`,
                                fontSize: `${Math.random() * 30 + 20}px`,
                                filter: 'drop-shadow(0 0 10px pink)'
                            }}
                        >
                            {['❤️', '💖', '💝', '💗', '💓'][Math.floor(Math.random() * 5)]}
                        </div>
                    ))}
                </div>

                <div className="z-10 bg-black/60 p-10 rounded-2xl backdrop-blur-md border border-pink-500/30 flex flex-col items-center shadow-2xl">
                    <CheckCircle2 size={80} className="text-pink-500 mb-6 drop-shadow-[0_0_15px_pink]" />
                    <h2 className="text-5xl font-black mb-4 text-pink-400 tracking-tighter text-shadow-lg text-center uppercase">CONGRATULATIONS!</h2>
                    <p className="text-2xl text-white font-black mb-8 max-w-md text-center">
                        You have passed Day 1 challenge, you're off to a great start!
                    </p>

                    <div className="flex gap-4 mb-10 text-4xl animate-pulse">
                        ❤️❤️❤️❤️❤️❤️❤️
                    </div>

                    <button
                        onClick={onComplete}
                        className="px-12 py-6 bg-gradient-to-r from-pink-600 to-pink-400 text-white font-black text-xl uppercase tracking-widest rounded-full hover:scale-110 hover:shadow-[0_0_30px_rgba(255,105,180,0.8)] transition-all shadow-xl active:scale-95 border-b-8 border-pink-800"
                    >
                        RETURN TO DASHBOARD
                    </button>
                </div>
            </div>
        );
    }

    const q = QUESTIONS[currentStep];

    return (
        <div className={`max-w-xl mx-auto p-6 border-2 border-gray-800 bg-gray-900/80 rounded-lg shadow-2xl relative overflow-hidden ${shake ? 'animate-bounce' : ''}`}>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-800 mb-8 rounded-full">
                <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${(currentStep / QUESTIONS.length) * 100}%` }}
                ></div>
            </div>

            <div className="flex items-center gap-2 mb-6 text-gray-400">
                <HelpCircle size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Question {currentStep + 1} of {QUESTIONS.length}</span>
            </div>

            <h2 className="text-2xl font-bold mb-8 text-white">{q.text}</h2>

            <div className="grid grid-cols-1 gap-4">
                {q.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className="text-left p-4 border border-gray-700 rounded-lg hover:border-green-500 hover:bg-green-500/10 transition-all group relative overflow-hidden"
                    >
                        <span className="relative z-10 group-hover:text-green-400">{option}</span>
                        <div className="absolute inset-0 bg-green-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform"></div>
                    </button>
                ))}
            </div>

            <div className="mt-8 text-[10px] text-gray-600 font-mono italic">
                CAUTION: Any incorrect response will trigger an immediate reset of the Sentimental Handshake.
            </div>
        </div>
    );
};

export default Day1Challenge;
