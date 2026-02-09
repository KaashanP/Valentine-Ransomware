import React from 'react';
const Placeholder = ({ day, onComplete }) => (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-gray-800 rounded-lg bg-gray-900/40">
        <h2 className="text-2xl font-bold mb-4">Protocol {day} in progress...</h2>
        <p className="text-gray-400 mb-8 italic">This module is currently being calibrated for your relationship data.</p>
        <button onClick={onComplete} className="px-6 py-2 bg-green-600 text-black font-bold rounded hover:bg-green-400 transition-colors">
            SIMULATE COMPLETION
        </button>
    </div>
);
export const Day1 = (props) => <Placeholder day={1} {...props} />;
export const Day2 = (props) => <Placeholder day={2} {...props} />;
export const Day3 = (props) => <Placeholder day={3} {...props} />;
export const Day4 = (props) => <Placeholder day={4} {...props} />;
export const Day5 = (props) => <Placeholder day={5} {...props} />;
export const Day6 = (props) => <Placeholder day={6} {...props} />;
