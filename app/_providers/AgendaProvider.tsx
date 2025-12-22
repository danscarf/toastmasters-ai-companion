// app/_providers/AgendaProvider.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AssignedRole {
  id: string;
  role: string;
  assignee: string | null;
}

interface AgendaContextType {
  agendaData: AssignedRole[] | null;
  loading: boolean;
  error: string | null;
  processAgenda: (text: string, attendees?: string[]) => Promise<void>;
  clearAgenda: () => void;
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

export const AgendaProvider = ({ children }: { children: ReactNode }) => {
  const [agendaData, setAgendaData] = useState<AssignedRole[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const processAgenda = async (text: string, attendees?: string[]) => {
    setLoading(true);
    setError(null);
    setAgendaData(null);
    try {
      const response = await fetch('/api/process-agenda', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, attendees }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to process agenda.');
      }

      const data: AssignedRole[] = await response.json();
      setAgendaData(data);
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAgenda = () => {
    setAgendaData(null);
    setError(null);
  };

  return (
    <AgendaContext.Provider value={{ agendaData, loading, error, processAgenda, clearAgenda }}>
      {children}
    </AgendaContext.Provider>
  );
};

export const useAgenda = () => {
  const context = useContext(AgendaContext);
  if (context === undefined) {
    throw new Error('useAgenda must be used within an AgendaProvider');
  }
  return context;
};