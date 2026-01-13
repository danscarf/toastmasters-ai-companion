// app/_components/ahh-counter/AhhCounterControls.tsx
'use client';

import React from 'react';
import { useAhhCounter } from '../../_providers/AhhCounterProvider';

export function AhhCounterControls() {
  const { selectedSpeaker, logFillerWord, undoLastLog } = useAhhCounter();
  const fillerWords = ["Ah", "Um", "Er", "Well", "So", "Like", "But", "Repeats", "Other"];

  const handleLog = (word: string) => {
    if (selectedSpeaker) {
      logFillerWord(selectedSpeaker, word);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">Controls</h2>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {fillerWords.map(word => (
          <button
            key={word}
            onClick={() => handleLog(word)}
            disabled={!selectedSpeaker}
            className="p-4 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {word}
          </button>
        ))}
      </div>
      <button
        onClick={undoLastLog}
        disabled={!selectedSpeaker}
        className="mt-4 p-2 bg-red-500 text-white rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Undo Last
      </button>
    </div>
  );
}
