import React, { useState, useEffect } from 'react';
import { Camera, Clipboard, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const MEMORIES = [
    { id: 1, text: "Our first coffee date where I spilled latte on my shirt.", img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=200" },
    { id: 2, text: "That rainy evening we spent watching trilogies.", img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=200" },
    { id: 3, text: "Hiking up the hill to see the sunset.", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200" },
    { id: 4, text: "The time we tried to bake a cake and it failed miserably.", img: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=200" },
    { id: 5, text: "Eating street food at midnight in the cold.", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=200" },
];

const Day4Challenge = ({ onComplete }) => {
    const [shuffledMemories, setShuffledMemories] = useState([]);
    const [shuffledImages, setShuffledImages] = useState([]);
    const [matches, setMatches] = useState({}); // { imageId: memoryId }
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [solved, setSolved] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setShuffledMemories([...MEMORIES].sort(() => Math.random() - 0.5));
        setShuffledImages([...MEMORIES].sort(() => Math.random() - 0.5));
    }, []);

    const handleSelectImage = (id) => {
        if (solved) return;
        setSelectedImageId(id);
        setError(false);
    };

    const handleSelectMemory = (id) => {
        if (solved || !selectedImageId) return;

        if (selectedImageId === id) {
            const newMatches = { ...matches, [id]: id };
            setMatches(newMatches);
            setSelectedImageId(null);
            setError(false);

            if (Object.keys(newMatches).length === MEMORIES.length) {
                handleComplete();
            }
        } else {
            setError(true);
            setTimeout(() => setError(false), 500);
        }
    };

    const handleComplete = () => {
        setSolved(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#3b82f6', '#ffffff', '#60a5fa']
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900/90 border-2 border-gray-800 rounded-2xl shadow-2xl relative overflow-hidden">
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-blue-500 uppercase tracking-tighter flex items-center justify-center gap-2">
                    Protocol 4: Recall Matrix
                </h2>
                <p className="text-gray-400 text-sm mt-2 italic">
                    "The system is indexing your shared history. Link the visuals to the narrative to restore the data stream."
                </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Images Column */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Neural Snapshots</h3>
                    {shuffledImages.map((m) => {
                        const isMatched = !!matches[m.id];
                        const isSelected = selectedImageId === m.id;

                        return (
                            <motion.div
                                key={m.id}
                                whileHover={!isMatched ? { scale: 1.02 } : {}}
                                whileTap={!isMatched ? { scale: 0.98 } : {}}
                                onClick={() => !isMatched && handleSelectImage(m.id)}
                                className={`
                  relative h-24 rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                  ${isMatched ? 'border-green-500 opacity-50 grayscale' : isSelected ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-gray-800 hover:border-gray-600'}
                `}
                            >
                                <img src={m.img} alt="Memory" className="w-full h-full object-cover" />
                                {isMatched && <CheckCircle className="absolute top-2 right-2 text-green-500 shadow-black" size={24} />}
                            </motion.div>
                        );
                    })}
                </div>

                {/* Text Column */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-4">Data Logs</h3>
                    {shuffledMemories.map((m) => {
                        const isMatched = Object.values(matches).includes(m.id);

                        return (
                            <motion.div
                                key={m.id}
                                whileHover={!isMatched && selectedImageId ? { backgroundColor: 'rgba(59, 130, 246, 0.1)' } : {}}
                                onClick={() => handleSelectMemory(m.id)}
                                className={`
                  h-24 p-3 flex items-center justify-center text-center text-xs font-medium rounded-lg border-2 transition-all
                  ${isMatched ? 'border-green-500 bg-green-900/10 text-green-400 opacity-50' : selectedImageId ? 'border-blue-900/50 cursor-pointer hover:border-blue-600' : 'border-gray-800 text-gray-400'}
                  ${error && selectedImageId ? 'border-red-600 animate-pulse' : ''}
                `}
                            >
                                {m.text}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {solved ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-green-500/20 border border-green-500 rounded-lg text-center"
                    >
                        <div className="text-green-400 font-bold mb-4 uppercase tracking-widest">DATA INTEGRITY RESTORED</div>
                        <button
                            onClick={onComplete}
                            className="w-full py-4 bg-green-600 text-black font-black rounded hover:bg-green-400 transition-all uppercase"
                        >
                            UPGRADE PERMISSIONS & NEXT PROTOCOL
                        </button>
                    </motion.div>
                ) : (
                    <div className="text-center">
                        {error && (
                            <div className="text-red-500 text-xs mb-4 flex items-center justify-center gap-2 animate-bounce">
                                <AlertCircle size={14} />
                                <span>MISMATCH DETECTED. RE-EVALUATING MEMORY...</span>
                            </div>
                        )}
                        <p className="text-[10px] text-gray-600 font-mono italic">
              // Click a snapshot first, then find its matching log entry.
                        </p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Day4Challenge;
