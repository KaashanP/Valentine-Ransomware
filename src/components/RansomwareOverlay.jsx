import React, { useState } from 'react';
import { Lock, AlertTriangle, ShieldAlert, Cpu, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const RansomwareOverlay = ({ unlockedDay, onStartChallenge, readyState, setReadyState }) => {
    const days = [1, 2, 3, 4, 5, 6];

    // Progress Calculation: 100 / 6 per day. 
    // If Day 1 is completed (unlockedDay = 2), progress is (2-1)/6 = 1/6.
    const completedDays = Math.max(0, unlockedDay - 1);
    const progressPercent = (completedDays / 6) * 100;

    if (readyState === 'emergency') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-red-600 animate-pulse transition-colors duration-500">
                <div className="bg-white p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-8 border-8 border-black">
                    <h1 className="text-6xl font-black text-red-600 animate-bounce tracking-widest text-shadow-lg">
                        EMERGENCY, KASHU CRYING
                    </h1>
                    <p className="text-2xl font-bold text-gray-800 uppercase">
                        Protocol violation detected! Heart integrity failing!
                    </p>
                    <button
                        onClick={() => setReadyState('ready')}
                        className="px-12 py-6 bg-red-600 text-white font-black text-2xl rounded-xl hover:bg-black transition-all shadow-[0_10px_0_rgb(153,27,27)] active:translate-y-[4px] active:shadow-none"
                    >
                        Abort and play the challenge
                    </button>
                    <div className="flex gap-4">
                        <AlertTriangle className="text-red-600 animate-pulse" size={48} />
                        <AlertTriangle className="text-red-600 animate-pulse" size={48} />
                        <AlertTriangle className="text-red-600 animate-pulse" size={48} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen p-6 text-center animate-in fade-in duration-1000 ${readyState === 'initial' ? 'bg-black/20' : ''}`}>
            {/* Progress Bar Container */}
            {readyState === 'ready' && (
                <div className="max-w-2xl w-full mb-12 animate-in slide-in-from-top duration-700">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-black text-green-400 tracking-tighter uppercase">Emotional Recovery Progress</span>
                        <span className="text-2xl font-black text-green-400 italic">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-4 w-full bg-gray-900 border-2 border-gray-800 rounded-full overflow-hidden p-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full shadow-[0_0_15px_rgba(0,255,0,0.4)]"
                        />
                    </div>
                </div>
            )}

            {/* Header Warning */}
            <div className="bg-red-900/40 border-4 border-red-600 p-8 rounded-xl max-w-2xl w-full mb-8 relative overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                <div className="flex items-center justify-center gap-4 mb-4 text-red-500">
                    <ShieldAlert size={48} className="animate-bounce" />
                    <h1 className="text-4xl font-black tracking-tighter uppercase whitespace-nowrap">ACCESS REVOKED</h1>
                    <ShieldAlert size={48} className="animate-bounce" />
                </div>

                <p className="text-xl mb-4 text-white font-black uppercase tracking-tight">
                    Your access to <span className="text-red-500 underline decoration-red-600 underline-offset-4">Kaashan's Heart</span> has been temporarily suspended.
                </p>

                <div className="text-left bg-black/70 p-4 border-2 border-red-900 rounded font-mono text-sm mb-4 shadow-inner">
                    <p className="text-red-500">SYSTEM ID: VALENTINE-2026-BETA</p>
                    <p>STATUS: LOCKED_BY_SENTIMENT_PROTOCOL</p>
                    <p>REQUIRED: PROOF_OF_AFFECTION_VERIFICATION</p>
                </div>

                <p className="text-gray-200 text-sm font-bold">
                    To regain access by February 14th, you must complete daily verification protocols. <br />
                    <span className="text-red-400">Failure to complete protocols will result in Kaashan dying out of sadness.</span>
                </p>
            </div>

            {readyState === 'initial' ? (
                <div className="flex flex-col items-center gap-8 py-8 animate-in slide-in-from-bottom duration-700">
                    <h2 className="text-5xl font-black text-white tracking-widest uppercase terminal-glow animate-pulse">
                        ARE YOU READY?
                    </h2>
                    <div className="flex gap-8">
                        <button
                            onClick={() => setReadyState('ready')}
                            className="px-16 py-6 bg-green-600 text-black font-black text-2xl rounded-xl hover:bg-green-400 transition-all hover:scale-110 shadow-[0_0_25px_rgba(0,255,0,0.6)] active:scale-95"
                        >
                            YES
                        </button>
                        <button
                            onClick={() => setReadyState('emergency')}
                            className="px-16 py-6 bg-gray-900/80 text-red-500 font-black text-2xl rounded-xl border-4 border-red-900/50 hover:bg-red-900/40 transition-all hover:scale-95 active:scale-90"
                        >
                            NO
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Daily Progress Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl w-full px-4">
                        {days.map((day) => {
                            const isUnlocked = day <= unlockedDay;
                            const isCompleted = day < unlockedDay;
                            const isCurrent = day === unlockedDay;

                            // Date check for tooltip/label
                            const startDate = new Date('2026-02-09T00:00:00');
                            const challengeDate = new Date(startDate);
                            challengeDate.setDate(startDate.getDate() + (day - 1));
                            const isPastOrToday = new Date() >= challengeDate;
                            const isActuallyUnlocked = isUnlocked && isPastOrToday;

                            return (
                                <motion.div
                                    key={day}
                                    whileHover={isActuallyUnlocked ? { scale: 1.05, y: -5 } : {}}
                                    className={`
                        border-4 p-6 rounded-2xl flex flex-col items-center gap-2 transition-all cursor-pointer relative overflow-hidden backdrop-blur-md
                        ${isActuallyUnlocked ? 'border-green-600 bg-green-900/30 shadow-[0_10px_20px_rgba(0,0,0,0.4)]' : 'border-gray-800 bg-gray-900/60 opacity-50 grayscale cursor-not-allowed'}
                        ${isCurrent && isPastOrToday ? 'ring-4 ring-green-400 ring-offset-4 ring-offset-black animate-pulse border-green-400' : ''}
                      `}
                                    onClick={() => isActuallyUnlocked && onStartChallenge(day)}
                                >
                                    {isCompleted && (
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <Heart size={12} fill="#ef4444" className="text-red-500" />
                                        </div>
                                    )}
                                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Protocol 0{day}</div>
                                    {isCompleted ? (
                                        <div className="text-green-400 font-black text-sm tracking-widest">VERIFIED</div>
                                    ) : (isUnlocked && isPastOrToday) ? (
                                        <div className="text-yellow-400 font-black text-sm animate-pulse tracking-widest">PENDING</div>
                                    ) : !isPastOrToday ? (
                                        <div className="text-red-900 font-black text-[10px] tracking-tight">UNLOCKS {challengeDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                                    ) : (
                                        <Lock size={24} className="text-gray-600" />
                                    )}
                                    <div className={`mt-2 text-xs font-bold ${isCurrent ? 'text-green-200' : 'text-gray-500'}`}>
                                        {day === 1 && "Trivia Mastery"}
                                        {day === 2 && "Memory Fragments"}
                                        {day === 3 && "Nurture Core"}
                                        {day === 4 && "Recall Matrix"}
                                        {day === 5 && "Emote Capture"}
                                        {day === 6 && "The Proposal"}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="mt-12 flex items-center gap-3 text-green-500/50 text-xs font-mono tracking-widest animate-pulse">
                        <Cpu size={16} />
                        <span>SECURE_ROMANCE_ESTABLISHED // PING: 14ms // UPLINK: ACTIVE</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default RansomwareOverlay;
