import React, { useState, useEffect } from 'react';
import RansomwareOverlay from './components/RansomwareOverlay';
import CelebrationOverlayDay3 from './components/challenges/CelebrationOverlayDay3';
import Day1Challenge from './components/challenges/Day1Challenge';
import Day2Challenge from './components/challenges/Day2Challenge';
import Day3Challenge from './components/challenges/Day3Challenge';
import Day4Challenge from './components/challenges/Day4Challenge';
import Day5Challenge from './components/challenges/Day5Challenge';
import Day6Challenge from './components/challenges/Day6Challenge';

const App = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [unlockedDay, setUnlockedDay] = useState(1);
  const [showChallenge, setShowChallenge] = useState(false);
  const [readyState, setReadyState] = useState('initial');
  const [showDay3Celebration, setShowDay3Celebration] = useState(false);

  useEffect(() => {
    // Date-Gating Logic
    const startDate = new Date('2026-02-09T00:00:00');
    const today = new Date();

    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const maxAvailableDay = Math.min(6, Math.max(1, diffDays));

    const savedDay = localStorage.getItem('valentine_ransomware_day');
    const savedReadyStatus = localStorage.getItem('valentine_ransomware_started');

    if (savedDay) {
      setUnlockedDay(Math.min(parseInt(savedDay), maxAvailableDay));
    } else {
      setUnlockedDay(1);
    }

    if (savedReadyStatus) {
      setReadyState(savedReadyStatus);
    }
  }, []);

  const handleDayComplete = (day) => {
    if (day === 3) {
      setShowDay3Celebration(true);
    } else {
      finalizeDay(day);
    }
  };

  const finalizeDay = (day) => {
    const nextDay = day + 1;
    setUnlockedDay(nextDay);
    localStorage.setItem('valentine_ransomware_day', nextDay.toString());
    setShowChallenge(false);
  };

  const handleSetReadyState = (state) => {
    setReadyState(state);
    if (state === 'ready') {
      localStorage.setItem('valentine_ransomware_started', 'ready');
    }
  };

  const renderChallenge = () => {
    if (showDay3Celebration) {
      return (
        <CelebrationOverlayDay3
          onProceed={() => {
            setShowDay3Celebration(false);
            finalizeDay(3);
          }}
        />
      );
    }

    switch (currentDay) {
      case 1: return <Day1Challenge onComplete={() => handleDayComplete(1)} />;
      case 2: return <Day2Challenge onComplete={() => handleDayComplete(2)} />;
      case 3: return <Day3Challenge onComplete={() => handleDayComplete(3)} />;
      case 4: return <Day4Challenge onComplete={() => handleDayComplete(4)} />;
      case 5: return <Day5Challenge onComplete={() => handleDayComplete(5)} />;
      case 6: return <Day6Challenge onComplete={() => handleDayComplete(6)} />;
      default: return null;
    }
  };
  return (
    <div className="min-h-screen text-green-500 font-mono relative overflow-x-hidden p-4 md:p-8 flex items-center justify-center">
      {!showChallenge ? (
        <RansomwareOverlay
          unlockedDay={unlockedDay}
          readyState={readyState}
          setReadyState={handleSetReadyState}
          onStartChallenge={(day) => {
            setCurrentDay(day);
            setShowChallenge(true);
          }}
        />
      ) : (
        <div className="w-full max-w-6xl z-10 relative">
          <button
            onClick={() => setShowChallenge(false)}
            className="mb-8 text-red-500 hover:text-white transition-colors flex items-center gap-2 font-black text-xs tracking-widest"
          >
            <span>&larr;</span> EXIT PROTOCOL
          </button>
          {renderChallenge()}
        </div>
      )}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-50 opacity-10"></div>
    </div>
  );
};

export default App;
