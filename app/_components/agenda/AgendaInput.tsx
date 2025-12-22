// app/_components/agenda/AgendaInput.tsx
'use client';

import React, { useState } from 'react';
import { useAgenda } from '../../_providers/AgendaProvider';

export function AgendaInput() {
  const [inputText, setInputText] = useState<string>('');
  const [attendeeNames, setAttendeeNames] = useState<string>('');
  const { processAgenda, loading } = useAgenda();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const namesArray = attendeeNames.split(',').map(name => name.trim()).filter(name => name.length > 0);
    processAgenda(inputText, namesArray);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-lg space-y-4">
      <div>
        <label htmlFor="agenda-text" className="block text-sm font-medium text-gray-700">
          Paste your meeting agenda text or HTML here:
        </label>
        <textarea
          id="agenda-text"
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="e.g., Toastmaster: John Doe, Speaker: Jane Smith, ... "
          disabled={loading}
        ></textarea>
      </div>
      <div>
        <label htmlFor="attendee-names" className="block text-sm font-medium text-gray-700">
          Attendee Names (comma-separated, optional, for better PII handling):
        </label>
        <input
          type="text"
          id="attendee-names"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
          value={attendeeNames}
          onChange={(e) => setAttendeeNames(e.target.value)}
          placeholder="e.g., John Doe, Jane Smith"
          disabled={loading}
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        disabled={loading || inputText.trim().length === 0}
      >
        {loading ? 'Processing...' : 'Process Agenda'}
      </button>
    </form>
  );
}
