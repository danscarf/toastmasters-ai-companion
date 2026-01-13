// app/_components/ahh-counter/SpeakerList.tsx
'use client';

import React, { useState } from 'react';
import { useAhhCounter } from '../../_providers/AhhCounterProvider';

export function SpeakerList() {
  const { session, addSpeaker, selectedSpeaker, selectSpeaker } = useAhhCounter();
  const [newSpeakerName, setNewSpeakerName] = useState('');

  const handleAddSpeaker = () => {
    if (newSpeakerName.trim()) {
      addSpeaker(newSpeakerName.trim());
      setNewSpeakerName('');
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Speakers</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newSpeakerName}
          onChange={(e) => setNewSpeakerName(e.target.value)}
          placeholder="New speaker name"
          className="flex-grow p-2 border rounded"
        />
        <button onClick={handleAddSpeaker} className="p-2 bg-blue-500 text-white rounded">
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {session.speakers.map((speaker) => (
          <li
            key={speaker.id}
            onClick={() => selectSpeaker(speaker)}
            className={`p-2 rounded cursor-pointer ${
              selectedSpeaker?.id === speaker.id ? 'bg-purple-200' : 'bg-gray-100'
            }`}
          >
            {speaker.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
