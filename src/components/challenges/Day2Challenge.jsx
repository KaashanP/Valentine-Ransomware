import React, { useState, useEffect } from 'react';
import { Puzzle, RefreshCw, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const Day2Challenge = ({ onComplete }) => {
    const [grid, setGrid] = useState([]);
    const [solved, setSolved] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);

    // Puzzle settings
    const ROWS = 3;
    const COLS = 3;
    const TOTAL_PIECES = ROWS * COLS;

    // Image URL - placeholder for a romantic photo
    const imageUrl = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800";

    useEffect(() => {
        initializePuzzle();
    }, []);

    const initializePuzzle = () => {
        // Create an array [0, 1, 2, ..., 8] representing the pieces
        const pieces = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
        // Shuffle the pieces
        const shuffled = [...pieces].sort(() => Math.random() - 0.5);
        setGrid(shuffled);
        setSolved(false);
    };

    const handleDragStart = (idx) => {
        setDraggedIndex(idx);
    };

    const handleDrop = (idx) => {
        if (draggedIndex === null) return;

        const newGrid = [...grid];
        // Swap pieces
        const temp = newGrid[idx];
        newGrid[idx] = newGrid[draggedIndex];
        newGrid[draggedIndex] = temp;

        setGrid(newGrid);
        setDraggedIndex(null);
        checkSolved(newGrid);
    };

    const checkSolved = (currentGrid) => {
        const isSolved = currentGrid.every((piece, idx) => piece === idx);
        if (isSolved) {
            setSolved(true);
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ffc0cb', '#ffffff']
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-900/90 border-2 border-gray-800 rounded-xl shadow-2xl relative overflow-hidden h-full min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-green-400">
                    <Puzzle size={24} />
                    <h2 className="text-xl font-black uppercase">Protocol 2: Memory Fragments</h2>
                </div>
                <button
                    onClick={initializePuzzle}
                    className="p-2 text-gray-500 hover:text-green-400 transition-colors"
                    title="Reset Puzzle"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <p className="text-gray-400 text-sm mb-6 text-center italic">
                "Our memories are scattered pieces of a beautiful story. Restore the vision to proceed."
            </p>

            {/* Puzzle Board */}
            <div className="flex-grow flex items-center justify-center">
                <div
                    className="grid grid-cols-3 gap-1 bg-black p-1 border border-gray-800 rounded-lg shadow-inner w-full max-w-[400px] aspect-square"
                    onDragOver={(e) => e.preventDefault()}
                >
                    {grid.map((pieceIdx, i) => {
                        const row = Math.floor(pieceIdx / COLS);
                        const col = pieceIdx % COLS;

                        return (
                            <motion.div
                                key={i} // Use position in grid as key for stable DOM nodes
                                draggable={!solved}
                                onDragStart={() => handleDragStart(i)}
                                onDrop={() => handleDrop(i)}
                                className={`
                  relative cursor-grab active:cursor-grabbing overflow-hidden border border-gray-900/20
                  ${solved ? 'cursor-default transition-all duration-1000' : ''}
                `}
                                animate={{ scale: draggedIndex === i ? 0.95 : 1 }}
                            >
                                {/* Background Image Slice */}
                                <div
                                    className="w-full h-full bg-cover"
                                    style={{
                                        backgroundImage: `url(${imageUrl})`,
                                        backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                                        backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                                        filter: solved ? 'none' : 'grayscale(0.5) contrast(1.2)'
                                    }}
                                />

                                {/* Piece numbering for easier solving (optional, maybe too easy?) */}
                                {!solved && (
                                    <div className="absolute top-1 left-1 text-[8px] bg-black/50 text-gray-500 px-1 rounded">
                                        {pieceIdx + 1}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {solved && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-2 text-green-400">
                        <CheckCircle size={20} />
                        <span className="font-bold tracking-widest uppercase">IMAGE RECONSTRUCTED</span>
                    </div>
                    <button
                        onClick={onComplete}
                        className="w-full mt-2 py-3 bg-green-600 text-black font-black rounded hover:bg-green-400 transition-all uppercase tracking-tighter"
                    >
                        CONFIRM DATA INTEGRITY & PROCEED
                    </button>
                </motion.div>
            )}

            {!solved && (
                <div className="mt-6 text-center text-xs text-gray-600 font-mono italic animate-pulse">
          // HINT: Drag and drop pieces to swap positions. Match the sequence 1-9.
                </div>
            )}
        </div>
    );
};

export default Day2Challenge;
