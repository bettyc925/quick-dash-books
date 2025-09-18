import { useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerOptions {
  timeout: number; // in milliseconds
  onTimeout: () => void;
  events?: string[];
}

export const useIdleTimer = ({ timeout, onTimeout, events }: UseIdleTimerOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const defaultEvents = [
    'mousedown',
    'mousemove', 
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ];

  const eventList = events || defaultEvents;

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, timeout);
  }, [timeout, onTimeout]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Set up event listeners
    eventList.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timer
    resetTimer();

    return () => {
      // Clean up event listeners
      eventList.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [eventList, handleActivity, resetTimer]);

  return {
    getLastActivity: () => lastActivityRef.current,
    resetTimer
  };
};