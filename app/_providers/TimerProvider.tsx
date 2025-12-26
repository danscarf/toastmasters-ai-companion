import React, { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { logEvent } from '../_lib/analytics';
import { useAuth } from './SupabaseAuthProvider'; // Import useAuth
import { initializeDataSource, getTimerSessionRepository } from '../_lib/typeorm'; // Import TypeORM utilities
import { TimerSession } from '../_lib/entities/TimerSession'; // Import the TypeORM entity (no alias)

// Define the shape of a Timer Preset
export interface TimerPreset {
  name: string;
  type: 'Speech' | 'Evaluation' | 'Table Topics' | 'Custom';
  greenTime: number; // seconds
  yellowTime: number; // seconds
  redTime: number; // seconds
  gracePeriod: { under: number; over: number }; // seconds
}

// Define the shape of a Logged Timer Session (Frontend representation for state)
export interface LoggedTimerSession { // Renamed from TimerSession
  id: string;
  speakerName: string | null;
  presetName: string;
  timeRequirement: string; // e.g., "5-7 min"
  duration: number; // seconds
  isWithinTime: boolean | null; // null until evaluated
  timestamp: Date;
  userId?: string; // Optional for frontend, will be set on save
}

// Define the shape of the Timer Context
interface TimerContextType {
  isRunning: boolean;
  elapsedTime: number; // seconds
  colorSignal: 'none' | 'green' | 'yellow' | 'red';
  selectedPreset: TimerPreset | null;
  loggedTimes: LoggedTimerSession[]; // Use LoggedTimerSession
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  selectPreset: (preset: TimerPreset | null) => void;
  logTime: (speakerName: string | null) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const MAX_TIMER_DURATION = 7200; // 2 hours in seconds

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [colorSignal, setColorSignal] = useState<'none' | 'green' | 'yellow' | 'red'>('none');
  const [selectedPreset, setSelectedPreset] = useState<TimerPreset | null>(null);
  const [loggedTimes, setLoggedTimes] = useState<LoggedTimerSession[]>([]); // Use LoggedTimerSession

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth(); // Get authenticated user

  // Initialize TypeORM Data Source
  useEffect(() => {
    initializeDataSource().catch(console.error);
  }, []); // Run only once on mount

  // Define functions using useCallback
  const stopTimer = useCallback(() => setIsRunning(false), []);
  const startTimer = useCallback(() => setIsRunning(true), []);
  
  const resetTimer = useCallback(() => {
    stopTimer();
    setElapsedTime(0);
    setColorSignal('none');
  }, [stopTimer]);

  const calculateIsWithinTime = useCallback((duration: number, preset: TimerPreset): boolean => {
    const minTime = preset.greenTime - preset.gracePeriod.under;
    const maxTime = preset.redTime + preset.gracePeriod.over;
    return duration >= minTime && duration <= maxTime;
  }, []);

  const formatTimeRequirement = useCallback((preset: TimerPreset): string => {
    if (preset.type === 'Table Topics') {
      return `${preset.greenTime / 60} - ${preset.redTime / 60} min`;
    }
    return `${preset.greenTime / 60}-${preset.redTime / 60} min`;
  }, []);

  const selectPreset = useCallback((preset: TimerPreset | null) => {
    setSelectedPreset(preset);
  }, []);

  const logTime = useCallback(async (speakerName: string | null) => { // Made async
    if (selectedPreset && user?.id) { // Ensure user is logged in
      const isWithinTime = calculateIsWithinTime(elapsedTime, selectedPreset);
      
      const newSessionEntity = new TimerSession(); // Instantiate the TypeORM entity
      newSessionEntity.id = crypto.randomUUID(); // TypeORM will assign if PrimaryGeneratedColumn
      newSessionEntity.speakerName = speakerName;
      newSessionEntity.presetName = selectedPreset.name;
      newSessionEntity.timeRequirement = formatTimeRequirement(selectedPreset);
      newSessionEntity.duration = elapsedTime;
      newSessionEntity.isWithinTime = isWithinTime;
      newSessionEntity.timestamp = new Date();
      newSessionEntity.userId = user.id;

      try {
        const sessionRepository = getTimerSessionRepository();
        const savedSession = await sessionRepository.save(newSessionEntity); // Save to database
        setLoggedTimes(prev => [...prev, savedSession]); // Add saved session to state (will be TimerSession entity instance)
      } catch (dbError) {
        console.error("Failed to save timer session to database:", dbError);
        // Fallback to local state if DB save fails, create a local LoggedTimerSession from entity
        setLoggedTimes(prev => [...prev, {
          id: newSessionEntity.id,
          speakerName: newSessionEntity.speakerName,
          presetName: newSessionEntity.presetName,
          timeRequirement: newSessionEntity.timeRequirement,
          duration: newSessionEntity.duration,
          isWithinTime: newSessionEntity.isWithinTime,
          timestamp: newSessionEntity.timestamp,
          userId: newSessionEntity.userId,
        }]);
      }
      
      resetTimer(); // Reset after logging
    } else if (!user?.id) {
      console.warn("Cannot log time: User not authenticated.");
      // Optionally, show a message to the user
    }
  }, [selectedPreset, elapsedTime, calculateIsWithinTime, formatTimeRequirement, resetTimer, user]); // Added user to dependencies

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Auto-stop logic
  useEffect(() => {
    if (isRunning && elapsedTime >= MAX_TIMER_DURATION) {
      stopTimer();
      logEvent('timer_auto_stopped', { duration: elapsedTime, reason: 'max_duration_exceeded' });
      console.warn('Timer automatically stopped due to exceeding maximum duration.');
    }
  }, [isRunning, elapsedTime, stopTimer]);

  // Update color signal based on elapsed time and selected preset
  useEffect(() => {
    if (selectedPreset) {
      if (elapsedTime >= selectedPreset.redTime) {
        setColorSignal('red');
      } else if (elapsedTime >= selectedPreset.yellowTime) {
        setColorSignal('yellow');
      } else if (elapsedTime >= selectedPreset.greenTime) {
        setColorSignal('green');
      } else {
        setColorSignal('none');
      }
    } else {
      setColorSignal('none');
    }
  }, [elapsedTime, selectedPreset]);
  
  const value = {
    isRunning,
    elapsedTime,
    colorSignal,
    selectedPreset,
    loggedTimes,
    startTimer,
    stopTimer,
    resetTimer,
    selectPreset,
    logTime,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
