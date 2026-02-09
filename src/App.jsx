import React, { useState, useEffect } from 'react';
import RansomwareOverlay from './components/RansomwareOverlay';
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

  useEffect(() => {
    // Date-Gating Logic
    // Day 1: Feb 9, Day 2: Feb 10, ..., Day 6: Feb 14
    const startDate = new Date('2026-02-09T00:00:00');
    const today = new Date();

    // Calculate how many days have passed since Feb 9
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const maxAvailableDay = Math.min(6, Math.max(1, diffDays));

    const savedDay = localStorage.getItem('valentine_ransomware_day');
    let currentUnlocked = 1;

    if (savedDay) {
      currentUnlocked = parseInt(savedDay);
    }

    // You can't be further than the current real-world date allows
    setUnlockedDay(Math.min(currentUnlocked, maxAvailableDay));
  }, []);

  const handleDayComplete = (day) => {
    const nextDay = day + 1;
    setUnlockedDay(nextDay);
    localStorage.setItem('valentine_ransomware_day', nextDay.toString());
    setShowChallenge(false);
  };

  const renderChallenge = () => {
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
    <div className="min-h-screen text-green-500 font-mono relative overflow-hidden">
      {!showChallenge ? (
        <RansomwareOverlay
          unlockedDay={unlockedDay}
          onStartChallenge={(day) => {
            setCurrentDay(day);
            setShowChallenge(true);
          }}
        />
      ) : (
        <div className="container mx-auto p-4 z-10 relative">
          <button
            onClick={() => setShowChallenge(false)}
            className="mb-8 text-red-500 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> EXIT CHALLENGE
          </button>
          {renderChallenge()}
        </div>
      )}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_100%),linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] z-50 opacity-10"></div>
    </div>
  );
};

export default App;
