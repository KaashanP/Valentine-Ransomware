import React, { useState, useEffect } from 'react';
import { Puzzle, RefreshCw, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import CelebrationOverlay from './CelebrationOverlay';

const PUZZLES = [
    { id: 1, rows: 3, cols: 3, image: "/memories/puzzle1.jpg", caption: "Our first puzzle (3x3) - A simple beginning." },
    { id: 2, rows: 3, cols: 4, image: "/memories/puzzle2.jpg", caption: "Level 2 (3x4) - Things are getting interesting." },
    { id: 3, rows: 4, cols: 4, image: "/memories/puzzle3.jpg", caption: "Level 3 (4x4) - Look how much we've grown!" },
    { id: 4, rows: 5, cols: 5, image: "/memories/puzzle4.jpg", caption: "Final Memory (5x5) - The ultimate challenge." },
];

const Day2Challenge = ({ onComplete }) => {
    const [currentLevel, setCurrentLevel] = useState(0);
    const [grid, setGrid] = useState([]);
    const [solved, setSolved] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [isLevelTransitioning, setIsLevelTransitioning] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);

    const levelData = PUZZLES[currentLevel];
    const ROWS = levelData.rows;
    const COLS = levelData.cols;
    const TOTAL_PIECES = ROWS * COLS;

    useEffect(() => {
        initializePuzzle();
    }, [currentLevel]);

    const initializePuzzle = () => {
        const pieces = Array.from({ length: TOTAL_PIECES }, (_, i) => i);
        // Shuffle the pieces
        const shuffled = [...pieces].sort(() => Math.random() - 0.5);

        // Ensure it's not solved by chance
        const isAlreadySolved = shuffled.every((piece, idx) => piece === idx);
        if (isAlreadySolved) {
            return initializePuzzle();
        }

        setGrid(shuffled);
        setSolved(false);
    };

    const handleDragStart = (idx) => {
        if (solved) return;
        setDraggedIndex(idx);
    };

    const handleDrop = (idx) => {
        if (draggedIndex === null || solved) return;

        const newGrid = [...grid];
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
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#ffc0cb', '#ffffff']
            });
        }
    };

    const handleNextLevel = () => {
        if (currentLevel < PUZZLES.length - 1) {
            setIsLevelTransitioning(true);
            setTimeout(() => {
                setCurrentLevel(prev => prev + 1);
                setIsLevelTransitioning(false);
            }, 500);
        } else {
            setShowCelebration(true);
        }
    };

    if (showCelebration) {
        return <CelebrationOverlay onFinalComplete={onComplete} />;
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray-900/90 border-2 border-gray-800 rounded-xl shadow-2xl relative overflow-hidden h-full min-h-[700px] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-green-400">
                        <Puzzle size={24} />
                        <h2 className="text-xl font-black uppercase">Protocol 2: Memory Fragments</h2>
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono">LEVEL {currentLevel + 1} OF {PUZZLES.length} • {ROWS}X{COLS} MATRIX</span>
                </div>
                {!solved && (
                    <button
                        onClick={initializePuzzle}
                        className="p-2 text-gray-500 hover:text-green-400 transition-colors"
                        title="Reset Puzzle"
                    >
                        <RefreshCw size={20} />
                    </button>
                )}
            </div>

            <p className="text-gray-400 text-sm mb-6 text-center italic">
                "{levelData.caption}"
            </p>

            {/* Puzzle Board */}
            <div className="flex-grow flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {!isLevelTransitioning && (
                        <motion.div
                            key={currentLevel}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className={`grid gap-1 bg-black p-1 border border-gray-800 rounded-lg shadow-inner w-full max-w-[450px] aspect-square`}
                            style={{
                                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`
                            }}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            {grid.map((pieceIdx, i) => {
                                const row = Math.floor(pieceIdx / COLS);
                                const col = pieceIdx % COLS;

                                return (
                                    <motion.div
                                        key={`${currentLevel}-${i}`}
                                        draggable={!solved}
                                        onDragStart={() => handleDragStart(i)}
                                        onDrop={() => handleDrop(i)}
                                        className={`
                                            relative cursor-grab active:cursor-grabbing overflow-hidden border border-gray-900/20
                                            ${solved ? 'cursor-default transition-all duration-1000' : ''}
                                        `}
                                        animate={{ scale: draggedIndex === i ? 0.95 : 1 }}
                                        whileHover={!solved ? { scale: 1.02, zIndex: 10 } : {}}
                                    >
                                        <div
                                            className="w-full h-full bg-cover"
                                            style={{
                                                backgroundImage: `url(${levelData.image})`,
                                                backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                                                backgroundPosition: `${(col / (COLS - 1)) * 100}% ${(row / (ROWS - 1)) * 100}%`,
                                                filter: solved ? 'none' : 'grayscale(0.3) contrast(1.1)'
                                            }}
                                        />

                                        {/* Optional Hint Numbers for larger grids */}
                                        {!solved && levelData.size > 3 && (
                                            <div className="absolute top-0.5 left-0.5 text-[6px] bg-black/30 text-gray-400 px-0.5 rounded">
                                                {pieceIdx + 1}
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {solved && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center"
                >
                    <div className="flex items-center justify-center gap-2 mb-2 text-green-400">
                        <CheckCircle size={20} />
                        <span className="font-bold tracking-widest uppercase">
                            {currentLevel === PUZZLES.length - 1 ? 'MEMORY FULLY RECOVERED' : 'SECTION RECONSTRUCTED'}
                        </span>
                    </div>
                    <button
                        onClick={handleNextLevel}
                        className="w-full mt-2 py-3 bg-green-600 text-black font-black rounded hover:bg-green-400 transition-all uppercase tracking-tighter flex items-center justify-center gap-2"
                    >
                        {currentLevel === PUZZLES.length - 1 ? 'CONFIRM DATA INTEGRITY & FINALIZE' : 'PROCEED TO NEXT FRAGMENT'}
                        <ChevronRight size={20} />
                    </button>
                </motion.div>
            )}

            {!solved && (
                <div className="mt-6 text-center text-xs text-gray-600 font-mono italic animate-pulse">
                    // HINT: Reconstruct the {ROWS}x{COLS} matrix to bypass security.
                </div>
            )}
        </div>
    );
};

export default Day2Challenge;
